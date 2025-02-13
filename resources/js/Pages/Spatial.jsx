import React, { useEffect, useRef, useState } from "react";
import { Head } from "@inertiajs/react";
import FrontLayout from "@/Layouts/FrontLayout";
import { RadialChart } from "@/Components/publicspatialcomp/radialchart";
import { Card } from "@/Components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Button } from "@/Components/ui/button";
import { Check } from "lucide-react"
import { WATER_STATUS_CLASS_MAP, WATER_STATUS_TEXT_MAP } from "@/constants";
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP } from "@/constants";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ChevronDownIcon } from "@heroicons/react/16/solid";
import { NitrateChart } from "@/Components/publicspatialcomp/NitrateChart";
import { SalinityChart } from "@/Components/publicspatialcomp/SalinityChart";
import { TDSChart } from "@/Components/publicspatialcomp/TDSChart";
import { TotalHardnessChart } from "@/Components/publicspatialcomp/TotalHardnessChart";
import { TurbidityChart } from "@/Components/publicspatialcomp/TurbidityChart";
import Footer from "@/Layouts/NewFooter";


export default function Spatial() {
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [map, setMap] = useState(null);
  const markers = useRef([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedValue, setSelectedValue] = useState("all");


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

  // Set filteredData to all waterQualityData initially when data is fetched
  useEffect(() => {
    if (!loading) {
      setFilteredData(waterQualityData);  // Set filtered data to all data when loading is done
    }
  }, [loading, waterQualityData]);  // Trigger this useEffect after the data is loaded

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
      const apikey = import.meta.env.VITE_PUBLIC_SPATIAL_GOOGLE_MAPS_API_KEY;
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
    if (!map || !filteredData.length) return;
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
        <p><strong>PH Level:</strong> ${data.ph_level}</p>
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

  // Handle select change for filtering data
  const handleSelectChange = (value) => {
    setSelectedValue(value)
    const filtered = waterQualityData.filter(site =>
      site.status === value || value === "all"
    )
    setFilteredData(filtered)
  }

  const defaultMarkerData = {
    name: "No Marker Selected",
    address: "No address available",
  };

  // Determine if we have selected marker data, otherwise use default values
  const currentMarkerData = selectedMarkerData || defaultMarkerData;
  const currentAddress = selectedAddress || "Fetching address...";

  return (
    <FrontLayout>
      <Head title="Water Sites" />
      <div className="min-h-full py-6 bg-[#fafafa]">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6 p-6">
          {/* Map Section */}
          <Card>
            {/* Map section */}
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-xl font-semi-bold text-gray-800 ">Water Sites Map</h1>
                <div className="flex items-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline">Filter
                        <ChevronDownIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                      <DropdownMenuLabel>Choose Water Quality</DropdownMenuLabel>
                      <div className="space-y-2 p-2">
                        <DropdownMenuItem
                          onClick={() => handleSelectChange("all")}
                          className={selectedValue === "all" ? "bg-blue-100" : ""}
                        >
                          {selectedValue === "all" && <Check className="mr-2" />}
                          All
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSelectChange("Potable")}
                          className={selectedValue === "Potable" ? "bg-blue-100" : ""}
                        >
                          {selectedValue === "Potable" && <Check className="mr-2" />}
                          Potable
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleSelectChange("Non-potable")}
                          className={selectedValue === "Non-potable" ? "bg-blue-100" : ""}
                        >
                          {selectedValue === "Non-potable" && <Check className="mr-2" />}
                          Non-potable
                        </DropdownMenuItem>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="flex flex-row">
                  {/* Map */}
                  <div ref={mapRef} className="w-full h-[450px] border rounded mt-2 mb-2"></div>
                </div>
              )}
            </div>
          </Card>
          {/* Details Section */}
          <Card className="p-4">
            <Table>
              <TableCaption>Details of the selected marker.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Field</TableHead>
                  <TableHead>Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Name</TableCell>
                  <TableCell>{currentMarkerData.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Status</TableCell>
                  <TableCell>
                    <span className={"px-2 py-1 rounded-xl " + ACTIVE_STATUS_CLASS_MAP[currentMarkerData.active_status]}>
                      {ACTIVE_STATUS_TEXT_MAP[currentMarkerData.active_status]}
                    </span>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium">pH Level</TableCell>
                  <TableCell>{currentMarkerData.ph_level}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Water Condition</TableCell>
                  <TableCell>
                    <span className={"px-2 py-1 rounded-xl " + WATER_STATUS_CLASS_MAP[currentMarkerData.status]}>
                      {WATER_STATUS_TEXT_MAP[currentMarkerData.status]}
                    </span>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Turbidity</TableCell>
                  <TableCell>{currentMarkerData.turbidity} NTU</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Total Dissolve Solids</TableCell>
                  <TableCell>{currentMarkerData.total_dissolved_solids} mg/L</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Salinity</TableCell>
                  <TableCell>{currentMarkerData.salinity} mg/L</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Nitrate</TableCell>
                  <TableCell>{currentMarkerData.nitrate} mg/L</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Latitude</TableCell>
                  <TableCell>{currentMarkerData.latitude}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Longitude</TableCell>
                  <TableCell>{currentMarkerData.longitude}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Address</TableCell>
                  <TableCell>{currentAddress}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Card>
          {/* Charts1 Section */}
          <div className="md:col-span-2 lg:col-span-1">
            <div className="mb-4 flex grid lg:grid-cols-2 gap-2">

              <TurbidityChart turbidity={Number(selectedMarkerData?.turbidity) || 0} />
              <RadialChart currentPh={Number(selectedMarkerData?.ph_level) || 0} />
            </div>
            <div className=" flex grid lg:grid-cols-2 gap-2">

              <TDSChart tds={Number(selectedMarkerData?.total_dissolved_solids) || 0} />

              <SalinityChart salinity={Number(selectedMarkerData?.salinity) || 0} />
            </div>
          </div>
        </div>
        {/* Charts Section */}
        <div className="px-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TotalHardnessChart totalhardness={Number(selectedMarkerData?.total_hardness) || 0} />
          <NitrateChart nitrate={Number(selectedMarkerData?.nitrate) || 0} />
        </div>
      </div>
    </FrontLayout>
  );


}
