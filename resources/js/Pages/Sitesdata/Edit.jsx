import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Button } from "@/Components/ui/button";


export default function Edit({ auth }) {

  const { props } = usePage();
  const { sites } = props;

  console.log(sites);
  const { data, setData, post, errors, reset } = useForm({
    name: sites.name || "",
    ph_level: sites.ph_level || "",
    turbidity: sites.turbidity || "",
    total_dissolved_solids: sites.total_dissolved_solids || "",
    total_hardness: sites.total_hardness || "",
    salinity: sites.salinity || "",
    nitrate: sites.salinity || "",
    sulfate: sites.sulfate || "",
    latitude: sites.latitude || "",
    longitude: sites.longitude || "",
    active_status: sites.active_status || "",
    _method: "PUT",
  });

  const refs = {
    name: useRef(null),
    ph_level: useRef(null),
    turbidity: useRef(null),
    total_dissolved_solids: useRef(null),
    total_hardness: useRef(null),
    salinity: useRef(null),
    nitrate: useRef(null),
    sulfate: useRef(null),
    latitude: useRef(null),
    longitude: useRef(null),
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const fields = Object.keys(refs);
      const currentIndex = fields.indexOf(field);
      const nextField = fields[currentIndex + 1];
      if (nextField && refs[nextField].current) {
        refs[nextField].current.focus();
      }
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting Data:", data);
    post(route("sitesdata.update", sites.id));
  };

  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      // Check if latitude and longitude are valid numbers
      const isValidLatLng =
        typeof data.latitude === "number" &&
        typeof data.longitude === "number" &&
        !isNaN(data.latitude) &&
        !isNaN(data.longitude);

      const center = isValidLatLng ?
        { lat: data.latitude, lng: data.longitude } :
        { lat: 6.7361159998675095, lng: 125.38093326810893 }; // Default location
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom: 16,
        mapTypeId: google.maps.MapTypeId.HYBRID,
      });

      //marker
      const marker = new google.maps.Marker({
        position: center,
        map,
        draggable: true,
      });

      // Update latitude and longitude on marker drag
      marker.addListener("dragend", (event) => {
        const { lat, lng } = event.latLng.toJSON();
        setData("latitude", lat);
        setData("longitude", lng);
      });

      // Update marker position on map click
      map.addListener("click", (event) => {
        const { lat, lng } = event.latLng.toJSON();
        setData("latitude", lat);
        setData("longitude", lng);
        marker.setPosition(event.latLng);
      });
    };

    // Load the Google Maps script
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_UPDATESITES_GOOGLE_MAPS_API_KEY;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initMap;
    document.body.appendChild(script);

    return () => {
      delete window.initMap;
    };
  }, []);

  return (
    <AuthenticatedLayout
      user={auth.user}

    >
      <Head title="Site Water Quality" />
      <div className="p-6 flex justify-center">

        <Card className="p-6">
          <CardTitle>
            Update "{data.name}" Water Quality
          </CardTitle>
          <Separator className="mt-6 mb-6" />
          <CardContent>
            <div className="grid lg:grid-cols-3 sm:grid-cols-1 gap-6">

              <div className="lg:col-span-2">
                <InputLabel htmlFor="name" value="Name (e.g., Sample Location)" />
                <TextInput
                  id="name"
                  type="text"
                  name="name"
                  value={data.name}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("name", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "name")}
                  ref={refs.name}
                />
                <InputError message={errors.name} className="mt-2" />
              </div>

              {/* Active Status Dropdown */}
              <div className="mt-1">
                <InputLabel htmlFor="active_status" value="Active Status" />
                <Select value={data.active_status} onValueChange={(value) => {
                  console.log("Selected Active Status:", value);
                  setData("active_status", value);
                }}>
                  <SelectTrigger className="ml-auto h-10 w-full rounded-lg pl-2.5 " aria-label="Select active status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent align="end" className="rounded-xl">
                    <SelectItem value="Active" className="rounded-lg">
                      Active
                    </SelectItem>
                    <SelectItem value="Inactive" className="rounded-lg">
                      Inactive
                    </SelectItem>
                  </SelectContent>
                </Select>
                <InputError message={errors.active_status} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="total_hardness" value="Total Hardness (mg/L - e.g., 150)" />
                <TextInput
                  id="total_hardness"
                  type="number"
                  name="total_hardness"
                  value={data.total_hardness}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("total_hardness", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "total_hardness")}
                  ref={refs.total_hardness}
                />
                <InputError
                  message={errors.total_hardness}
                  className="mt-2"
                />
              </div>

              <div>
                <InputLabel htmlFor="ph_level" value="pH Level (e.g., 7.0 - Neutral)" />
                <TextInput
                  id="ph_level"
                  type="number"
                  step="1"
                  name="ph_level"
                  value={data.ph_level}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("ph_level", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "ph_level")}
                  ref={refs.ph_level}
                />
                <InputError message={errors.ph_level} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="turbidity" value="Turbidity (NTU - e.g., 3.06)" />
                <TextInput
                  id="turbidity"
                  type="number"
                  step="0.01"
                  name="turbidity"
                  value={data.turbidity}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("turbidity", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "turbidity")}
                  ref={refs.turbidity}
                />
                <InputError message={errors.turbidity} className="mt-2" />
              </div>

              <div>
                <InputLabel
                  htmlFor="total_dissolved_solids"
                  value="Total Dissolved Solids (mg/L - e.g., 19.04)"
                />
                <TextInput
                  id="total_dissolved_solids"
                  type="number"
                  name="total_dissolved_solids"
                  value={data.total_dissolved_solids}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("total_dissolved_solids", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "total_dissolved_solids")}
                  ref={refs.total_dissolved_solids}
                />
                <InputError
                  message={errors.total_dissolved_solids}
                  className="mt-2"
                />
              </div>
              <div>
                <InputLabel htmlFor="salinity" value="Salinity (% - e.g., 0.5)" />
                <TextInput
                  id="salinity"
                  type="number"
                  name="salinity"
                  value={data.salinity}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("salinity", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "salinity")}
                  ref={refs.salinity}
                />
                <InputError message={errors.salinity} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="nitrate" value="Nitrate (mg/L - e.g., 10)" />
                <TextInput
                  id="nitrate"
                  type="number"
                  name="nitrate"
                  value={data.nitrate}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("nitrate", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "nitrate")}
                  ref={refs.nitrate}
                />
                <InputError message={errors.nitrate} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="sulfate" value="Sulfate (mg/L - e.g., 25)" />
                <TextInput
                  id="sulfate"
                  type="number"
                  name="sulfate"
                  value={data.sulfate}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("sulfate", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "sulfate")}
                  ref={refs.sulfate}
                />
                <InputError message={errors.sulfate} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="latitude" value="Latitude (e.g., 34.052235)" />
                <TextInput
                  id="latitude"
                  type="number"
                  step="0.000001"
                  name="latitude"
                  value={data.latitude}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("latitude", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "latitude")}
                  ref={refs.latitude}
                />
                <InputError message={errors.latitude} className="mt-2" />
              </div>

              <div>
                <InputLabel htmlFor="longitude" value="Longitude (e.g., -118.243683)" />
                <TextInput
                  id="longitude"
                  type="number"
                  step="0.000001"
                  name="longitude"
                  value={data.longitude}
                  className="mt-1 block w-full"
                  onChange={(e) => setData("longitude", e.target.value)}
                  onKeyDown={(e) => handleKeyDown(e, "longitude")}
                  ref={refs.longitude}
                />
                <InputError message={errors.longitude} className="mt-2" />
              </div>



            </div>
            {/* Google Maps Integration */}
            <div className="mt-6">
              <InputLabel value="Map" />
              <div
                ref={mapRef}
                className="w-full h-80 border rounded"
              ></div>
            </div>

            <form
              onSubmit={onSubmit}
              className=" mt-6"
            >

              <div className=" text-right">
                <Button variant="outline"
                  href={route("sitesdata.index")}
                  className="mr-4 lg:w-[150px] lg:h-[40px] "
                >
                  Cancel
                </Button>
                <Button className="bg-blue-500 lg:w-[150px] lg:h-[40px]  transition-all hover:bg-blue-600">
                  Update
                </Button>
              </div>
            </form>
          </CardContent>

        </Card>

      </div>

    </AuthenticatedLayout>
  );
}
