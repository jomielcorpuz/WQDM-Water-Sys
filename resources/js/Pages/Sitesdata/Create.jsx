import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useRef } from "react";

export default function Create({ auth }) {
  const { data, setData, post, errors, reset } = useForm({
    name: "",
    ph_level: "",
    turbidity: "",
    total_dissolved_solids: "",
    total_hardness: "",
    salinity: "",
    nitrate: "",
    sulfate: "",
    latitude: "",
    longitude: "",
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

    post(route("sitesdata.store"));
  };

  const mapRef = useRef(null);

  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(mapRef.current, {
        center: { lat: 6.7380087165097216, lng: 125.36800714554644 },
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.HYBRID,
      });

      const marker = new google.maps.Marker({
        position: { lat: 0, lng: 0 },
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyA6CkGvFvQzwxk37JorwNmwPAKKXW0GXFc&callback=initMap`;
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
      header={
        <div className="flex justify-between items-center">
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            Create Water Quality Entry
          </h2>
        </div>
      }
    >
        <Head title="Water Quality" />

<div className="py-12">
  <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
      <form
        onSubmit={onSubmit}
        className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
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


        <div className="mt-4 text-right">
          <Link
            href={route("sitesdata.index")}
            className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
          >
            Cancel
          </Link>
          <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600">
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
</AuthenticatedLayout>
  );
}
