import React, { useEffect, useRef, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import Paginatedata from "@/Components/Paginatedata";

export default function Index({ auth }) {
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [map, setMap] = useState(null);
  const markers = useRef([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch water quality data
  useEffect(() => {
    const fetchData = async (url = "/api/spatial") => {
      try {
        const response = await fetch(url); // API endpoint
        const data = await response.json();
        console.log(data);
        setWaterQualityData(data.data || data);
        //setFilteredData(data.data || data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching spatial data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current) return;
    const initMap = async () => {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 6.7380087165097216, lng: 125.36800714554644 },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID,
      });
      setMap(mapInstance);
    };
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      const apikey = import.meta.env.VITE_PRIVATE_SPATIAL_GOOGLE_MAPS_API_KEY;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apikey}&callback=initMap`;
      script.async = true;
      script.defer = true;
      window.initMap = initMap;
      document.body.appendChild(script);
    } else {
      if (!loading) {
        initMap();
      }
    }
    return () => {
      if (window.google && window.google.maps) {
        delete window.google.maps;
      }
    };
  }, [loading]);

  // Add markers to the map
  useEffect(() => {
    if (!map) return;
    // Clear existing markers
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    const geocoder = new google.maps.Geocoder();
    filteredData.forEach(data => {
      const marker = new google.maps.Marker({
        position: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) },
        map,
        title: `${data.name}`,
      });

      markers.current.push(marker);

      const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="text-align: left; padding: 0; margin: 0;">
            <div style="text-align: left;">
            <h1 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">${data.name}</h1>
            <p><strong>pH Level:</strong> ${data.ph_level}</p>
            <p><strong>Water Condition:</strong> ${data.status}</p>
            <p><strong>Latitude:</strong> ${data.latitude}</p>
            <p><strong>Longitude:</strong> ${data.longitude}</p>
            </div>
            </div>
            `,
      });

      marker.addListener("click", () => {
        setSelectedMarkerData(data);
        infoWindow.open(map, marker);

        geocoder.geocode(
          { location: { lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) } },
          (results, status) => {
            if (status === "OK" && results[0]) {
              setSelectedAddress(results[0].formatted_address);
            }
            else {
              console.error("Geocoder failed due to: ", status);
              setSelectedAddress("Address not found.");
            }
          }
        );
      });
    });
  }, [filteredData, map]);

  //GOOGLE MAP API KEY= AIzaSyCbGjdTMW4ngIMov-8vQAdtKyc_DyhhJXs

  // Handle SelectInput change
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const filtered = waterQualityData.filter(site =>
      site.status === selectedValue || selectedValue === "all");
    setFilteredData(filtered);
    setCurrentPage(1);
  };
  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Spatial Distribution
        </h2>
      }
    >
      <Head title="Spatial Distribution" />

      <div className="mx-auto w-full ">
        <div className="m-4">


          {/* Map section */}
          <div className="bg-white mx-auto  sm:px-6 lg:px-8 m-4 border rounded overflow-hidden shadow-sm lg:rounded-lg ">
            <div className="p-4 bg-white dark:bg-gray-800">
              <h1 className="text-2xl font-bold mb-2">
                {/* Spatial Distribution of Water Quality */}
              </h1>
              <div className="flex flex-wrap space-x-2 ">
                <h1 className="text-2xl font-bold mt-1"> Generate Sites:</h1>
                <SelectInput onChange={handleSelectChange}>
                  <option value="none">none</option>
                  <option value="all">All</option>
                  <option value="Potable">Potable</option>
                  <option value="Non-potable">Non-potable</option>
                </SelectInput>
              </div>

              <hr className="my-4 border-t-2 border-gray-300" />

              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="flex flex-row">
                  {/* Map  */}
                  <div ref={mapRef} className="w-full h-96 border rounded mb-4"></div>


                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white mx-auto sm:px-6 lg:px-8  overflow-hidden shadow-sm sm:rounded-lg border rounded lg:rounded-lg ">
            <div className="flex mt-6 ml-4">
              <h1 className="text-2xl font-bold mb-4">Sites Reading</h1>
            </div>
            <div className="p-4 text-gray-900 text-dark-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">ID</th>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Condition</th>
                      <th className="px-3 py-3">PH Level</th>
                      <th className="px-3 py-3">Salinity</th>
                      <th className="px-3 py-3">Turbidity</th>
                      <th className="px-3 py-3">Dissolve Solids</th>
                      <th className="px-3 py-3">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((site, index) => (
                      <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{site.name}</td>
                        <td className="px-3 py-2">{site.status}</td>
                        <td className="px-3 py-2">{site.ph_level}</td>
                        <td className="px-3 py-2">{site.salinity}</td>
                        <td className="px-3 py-2">{site.turbidity.toFixed(1)} NTU</td>
                        <td className="px-3 py-2">{site.total_dissolved_solids}</td>
                        <td className="px-3 py-2">{site.address || "Fetching address..." || "Not Found"}</td>
                      </tr>))}
                  </tbody>
                </table>

              </div>
              <Paginatedata
                itemsPerPage={itemsPerPage}
                totalItems={filteredData.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );

}
