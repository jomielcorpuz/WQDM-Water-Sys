import React, { useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import GuestLayout from "@/Layouts/FrontLayout";
import { RadialChart } from "@/Components/publicspatialcomp/radialchart";


export default function Spatial() {
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [map, setMap] = useState(null);
  const markers = useRef([]);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch water quality data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/spatial"); // API endpoint
        const data = await response.json();
        console.log(data);
        setWaterQualityData(data.data || data);
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
    const initMap = () => {
      const mapInstance = new google.maps.Map(mapRef.current, {
        center: { lat: 6.7380087165097216, lng: 125.36800714554644 },
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.HYBRID,
      });
      setMap(mapInstance);
    };
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDf4-glzKgqzlRro_kOgsljGjPF9z1Y-_o&callback=initMap`;
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

  //GOOGLE MAP API KEY = AIzaSyDf4-glzKgqzlRro_kOgsljGjPF9z1Y-_o

  // Handle SelectInput change
  const handleSelectChange = (e) => {
    const selectedValue = e.target.value;
    const filtered = waterQualityData.filter(site =>
      site.status === selectedValue || selectedValue === "all");
    setFilteredData(filtered);
  };

  return (
    <div>
      <GuestLayout>
        <div className="py-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Map section */}
              <div className="bg-white border rounded overflow-hidden shadow-sm sm:rounded-lg">
                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-between items-center mb-2">
                    <h1 className="text-xl font-bold">Water Sites Map</h1>
                    <div className="flex items-center">
                      <span className="text-sm font-semibold mr-2">View by:</span>
                      <SelectInput onChange={handleSelectChange}>
                        <option value="all">All</option>
                        <option value="Potable">Potable</option>
                        <option value="Non-potable">Non-potable</option>
                      </SelectInput>
                    </div>
                  </div>
                  <hr className="my-2 border-t-2 border-gray-300" />
                  {loading ? (
                    <p>Loading...</p>
                  ) : (
                    <div className="flex flex-row">
                      {/* Map */}
                      <div ref={mapRef} className="w-full h-96 border rounded mt-2 mb-2"></div>
                    </div>
                  )}
                </div>
              </div>
              {/* Details Section */}
              <div className="bg-white p-4 overflow-hidden shadow-sm sm:rounded-lg border rounded">
                <h1 className="text-xl font-bold mb-2 mt-2">Sites Reading</h1>
                <hr className="my-2 mt-4 mb-3 border-t-2 border-gray-300" />
                <div className="flex flex-col justify-center items-center">

                  <div className="w-full p-4 border rounded shadow bg-gray-200">
                    {selectedMarkerData ? (
                      <div>
                        <h3 className="font-bold text-lg mb-2">{selectedMarkerData.name}</h3>
                        <p>
                          <strong>pH Level:</strong> {selectedMarkerData.ph_level}
                        </p>
                        <p>
                          <strong>Water Condition:</strong> {selectedMarkerData.status}
                        </p>
                        <p>
                          <strong>Latitude:</strong> {selectedMarkerData.latitude}
                        </p>
                        <p>
                          <strong>Longitude:</strong> {selectedMarkerData.longitude}
                        </p>
                        <p>
                          <strong>Address:</strong> {selectedAddress || "Fetching address..."}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500">Click a marker to see details.</p>
                    )}
                  </div>
                </div>
              </div>
              <RadialChart />
            </div>
          </div>
        </div>
      </GuestLayout>
    </div>
  );


}
