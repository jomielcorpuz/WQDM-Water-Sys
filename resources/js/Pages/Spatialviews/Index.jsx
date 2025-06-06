import React, { useEffect, useRef, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import SelectInput from "@/Components/SelectInput";
import Paginatedata from "@/Components/Paginatedata";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/Components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { PieChart, Pie, Label } from "recharts";
import { Skeleton } from "@/Components/ui/skeleton";
import { Loader } from "lucide-react";
import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { WATER_STATUS_CLASS_MAP, WATER_STATUS_TEXT_MAP } from "@/constants";
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP } from "@/constants";
import { Button } from "@/Components/ui/button";

const chartConfig = {
  potable: {
    label: "Potable",
    color: "hsl(var(--chart-2))",
  },
  nonpotable: {
    label: "Nonpotable",
    color: "hsl(var(--chart-1))",
  },
};


export default function Index({ auth }) {
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);
  const [waterQualityData, setWaterQualityData] = useState([]);
  const [map, setMap] = useState(null);
  const markers = useRef([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMarkerData, setSelectedMarkerData] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState("");

  const [totalPotable, setTotalPotable] = useState(0);
  const [totalNonPotable, setTotalNonPotable] = useState(0);

  // Fetch water quality data
  useEffect(() => {
    const fetchData = async (url = "/api/spatial") => {
      try {
        const response = await fetch(url); // API endpoint
        const data = await response.json();
        setWaterQualityData(data.data || data);
        setLoading(false);
      } catch (error) {
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


      });
    });
  }, [filteredData, map]);

  // Handle SelectInput change
  const handleSelectChange = (selectedValue) => {
    setSelectedStatus(selectedValue);

    const filtered = waterQualityData.filter(
      (site) => site.status === selectedValue || selectedValue === "all"
    );

    setFilteredData(filtered);

    // Calculate the totals for potable and non-potable
    const potable = filtered.reduce((acc, curr) => acc + (curr.status === "Potable" ? 1 : 0), 0);
    const nonPotable = filtered.reduce((acc, curr) => acc + (curr.status === "Non-potable" ? 1 : 0), 0);

    setTotalPotable(potable);
    setTotalNonPotable(nonPotable);
  };

  // Get current page data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Pie chart rendering
  const renderPieChart = () => {
    const data = [];
    if (selectedStatus === "Potable" || selectedStatus === "all") {
      data.push({ name: "Potable", value: totalPotable, fill: chartConfig.potable.color });
    }
    if (selectedStatus === "Non-potable" || selectedStatus === "all") {
      data.push({ name: "Nonpotable", value: totalNonPotable, fill: chartConfig.nonpotable.color });
    }

    // Default empty state for the chart if no data is selected
    if (data.length === 0) {
      data.push({ name: "Potable", value: 0, fill: chartConfig.potable.color });
      data.push({ name: "Nonpotable", value: 0, fill: chartConfig.nonpotable.color });
    }

    return (
      <PieChart width={300} height={300}>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                      {totalPotable + totalNonPotable}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                      Total
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    );
  };

  const defaultMarkerData = {
    name: "No Marker Selected",
    address: "No address available",
  };
  const currentMarkerData = selectedMarkerData || defaultMarkerData;

  //Update selected markerdata
  const handleEditClick = () => {
    if (!selectedMarkerData) {
      console.error("No site selected");
      return;
    }

    const redirectRoute = route("spatialviews.index");
    console.log(`Editing site: ${selectedMarkerData.name} (ID: ${selectedMarkerData.id}), Redirect to: ${redirectRoute}`);

    router.get(route("sitesdata.edit", {
      sitesdatum: selectedMarkerData.id,
      redirect: redirectRoute
    }));
  };



  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Spatial Distribution
        </h2>
      }>
      <Head title="Spatial Distribution" />
      <div className="flex-col">
        <div className="p-6 grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-6">
          {/* Map section */}
          <Card className="lg:col-span-2">
            <div className="p-4 sm:px-6 lg:px-8bg-white dark:bg-gray-800">
              <div className="flex flex-wrap justify-between items-center ">
                <h1 className="text-xl font-semibold mt-1"> Water Sites Map</h1>
                <Select value={selectedStatus || undefined} onValueChange={handleSelectChange}>
                  <SelectTrigger className="h-11 w-[150px] rounded-lg pl-2.5" aria-label="Select status">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent align="end" className="rounded-xl">
                    <SelectItem value="all" className="rounded-lg">All</SelectItem>
                    <SelectItem value="Potable" className="rounded-lg">Potable</SelectItem>
                    <SelectItem value="Non-potable" className="rounded-lg">Non-Potable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {loading ? (
                <div >
                  <Loader />
                </div>
              ) : (
                <div className="flex flex-row mt-4">
                  {/* Map  */}
                  <div ref={mapRef} className="w-full h-96 border rounded mb-4"></div>
                </div>
              )}
            </div>
          </Card>
          {/* Summary Card*/}
          <div className="flex-col space-y-6">
            {/* Details Section */}
            <Card className="p-4">
              <div className="flex justify-end">
                <Button variant="secondary"
                  onClick={handleEditClick}
                  disabled={!selectedMarkerData}>
                  Update
                </Button>
              </div>
              <Table>
                <TableCaption>Selected marker details</TableCaption>
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
                    <TableCell className="font-medium">Water Condition</TableCell>
                    <TableCell>
                      <span className={"px-2 py-1 rounded-xl " + WATER_STATUS_CLASS_MAP[currentMarkerData.status]}>
                        {WATER_STATUS_TEXT_MAP[currentMarkerData.status]}
                      </span>
                    </TableCell>
                  </TableRow>

                </TableBody>
              </Table>
            </Card>
            {/* Pie Chart */}
            <Card className="col-span-1">
              <CardHeader>
                <div className="grid gap-1">
                  <CardTitle>Pie Chart</CardTitle>
                  <CardDescription>Shows total number of filtered sites</CardDescription>
                </div>
              </CardHeader>
              <div className="flex justify-center items-center p-4">
                {filteredData.length > 0 ? (renderPieChart()) :
                  (
                    <Skeleton className="w-[300px] h-[300px] rounded-full" />
                  )}
              </div>
            </Card>
          </div>
        </div>
        {/* Table Section */}
        <Card className="mx-6">
          <CardHeader>
            <div className="flex">
              <h1 className="text-2xl font-bold">Sites Reading</h1>
            </div>
          </CardHeader>
          <CardContent>
            <div className="p-4 text-gray-900 text-dark-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3">ID</th>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Condition</th>
                      <th className="px-3 py-3">Status</th>
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
                        <td className="px-3 py-2">{site.active_status}</td>
                        <td className="px-3 py-2">{site.ph_level}</td>
                        <td className="px-3 py-2">{site.salinity}</td>
                        <td className="px-3 py-2">{site.turbidity.toFixed(1)} NTU</td>
                        <td className="px-3 py-2">{site.total_dissolved_solids}</td>
                        <td className="px-3 py-2">{site.address || "Fetching address..." || "Not Found"}</td>
                      </tr>))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <Paginatedata
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredData.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              </div>
            </div>
          </CardContent>

        </Card>

      </div>

    </AuthenticatedLayout>
  );

}
