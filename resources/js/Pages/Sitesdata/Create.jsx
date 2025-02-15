
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";
import { Button } from "@/Components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/Components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import InputLabel from "@/Components/InputLabel";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/Components/ui/select";


const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ph_level: z.number().min(0, "pH Level must be positive"),
  turbidity: z.number().min(0, "Turbidity must be positive"),
  total_dissolved_solids: z.number().min(0, "TDS must be positive"),
  total_hardness: z.number().min(0, "Total Hardness must be positive"),
  salinity: z.number().min(0, "Salinity must be positive"),
  nitrate: z.number().min(0, "Nitrate must be positive"),
  sulfate: z.number().min(0, "Sulfate must be positive"),
  latitude: z.number().min(-90).max(90, "Invalid latitude"),
  longitude: z.number().min(-180).max(180, "Invalid longitude"),
  active_status: z.string().min(1, "Active status is required"),
  address: z.string().min(1, "Address is required"),
});

export default function Create({ auth }) {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
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
      active_status: "",
      address: "",

    },
  });

  const {
    register,
    setValue,  //  Use this to update latitude & longitude dynamically
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      latitude: 6.738, // Default location
      longitude: 125.368,
    },
  });

  const onSubmit = (data) => {
    // Use route('sitesdata.store') instead of hardcoded path
    console.log(data);
    router.post(route('sitesdata.store'), data, {
      onError: (errors) => {
        console.error("Error occurred:", errors);
        Object.keys(errors).forEach((field) => {
          form.setError(field, { type: "manual", message: errors[field] });
        });
      },
      onSuccess: () => {
        form.reset();
      },
    });
  };

  const handleCancel = (e) => {
    e.preventDefault();
    form.reset();
    router.get(route("sitesdata.index")); // Navigate without submitting
  };

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
    address: useRef(null),
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


  const mapRef = useRef(null);

  // GOOGLE MAP
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
        form.setValue("latitude", lat);  //  Update FormField
        form.setValue("longitude", lng);
      });

      // Update marker position on map click
      map.addListener("click", (event) => {
        const { lat, lng } = event.latLng.toJSON();
        form.setValue("latitude", lat);
        form.setValue("longitude", lng);
        marker.setPosition(event.latLng); // Move marker
      });
    };

    // Load the Google Maps script
    const script = document.createElement("script");
    const apiKey = import.meta.env.VITE_ADDSITES_GOOGLE_MAPS_API_KEY;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
    script.async = true;
    script.defer = true;
    window.initMap = initMap;
    document.body.appendChild(script);

    return () => {
      delete window.initMap;
    };
  }, [setValue]);

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

      <Card className="m-6 lg:px-6 pt-6 sm:px-2">
        <div className="py-2">

          <CardTitle className="flex-nowrap space-y-1 mb-1 px-6">Add new Water Sites</CardTitle>
          <CardDescription className="flex-nowrap space-y-1 mb-1 px-6">Fill required water quality information</CardDescription>
        </div>
        <Separator />
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 bg-white dark:bg-gray-800 ">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name (e.g., Sample Location)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Active Status */}
                <FormField
                  control={form.control}
                  name="active_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Active Status</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.clearErrors("active_status");
                          }}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* ph Level */}
                <FormField
                  control={form.control}
                  name="ph_level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>pH Level (e.g., 7.0 - Neutral)</FormLabel>
                      <FormControl>
                        <Input type="number" step="1" {...field} placeholder="Enter pH level"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("ph_level"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "ph_level")}
                          ref={refs.ph_level}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* turbidity */}
                <FormField
                  control={form.control}
                  name="turbidity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Turbidity (NTU - e.g., 3.06)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} placeholder="Enter turbidity"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("turbidity"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "turbidity")}
                          ref={refs.turbidity}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* TDS */}
                <FormField
                  control={form.control}
                  name="total_dissolved_solids"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Dissolved Solids (mg/L - e.g., 19.04)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Enter total dissolved solids"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("total_dissolved_solids"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "total_dissolved_solids")}
                          ref={refs.total_dissolved_solids}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Total Hardness */}
                <FormField
                  control={form.control}
                  name="total_hardness"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Hardness (mg/L - e.g., 150)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Enter total hardness"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("total_hardness"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "total_hardness")}
                          ref={refs.total_hardness}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Salinity */}
                <FormField
                  control={form.control}
                  name="salinity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Salinity (% - e.g., 0.5)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Enter salinity"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("salinity"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "salinity")}
                          ref={refs.salinity}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Nitrate */}
                <FormField
                  control={form.control}
                  name="nitrate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nitrate (mg/L - e.g., 10)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Enter nitrate"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("nitrate"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "nitrate")}
                          ref={refs.nitrate}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Sulfate */}
                <FormField
                  control={form.control}
                  name="sulfate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sulfate (mg/L - e.g., 25)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} placeholder="Enter sulfate"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("sulfate"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "sulfate")}
                          ref={refs.sulfate}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Address */}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Latitude */}
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude (e.g., 34.052235)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.000001" {...field} placeholder="Enter latitude"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("latitude"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "latitude")}
                          ref={refs.latitude}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Longitude */}
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude (e.g., -118.243683)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.000001" {...field} placeholder="Enter longitude"
                          onChange={(e) => {
                            const value = parseFloat(e.target.value); // Ensure it's a number
                            field.onChange(value);
                            form.clearErrors("longitude"); // 🔥 Clear error when user types
                          }}
                          onKeyDown={(e) => handleKeyDown(e, "longitude")}
                          ref={refs.longitude}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Google Maps Integration */}
              <div className="mt-6">
                <InputLabel value="Map" />
                <div
                  ref={mapRef}
                  className="w-full h-80 border rounded"
                ></div>
              </div>
              <Separator className="my-6" />
              <div className="mt-6 text-right">
                <Button type="button" variant="outline" onClick={handleCancel} className="mr-4  px-6 text-md py-4">
                  Cancel
                </Button>
                <Button type="submit" className="px-6 py-4 text-md">Submit</Button>
              </div>
            </form>

          </Form>


        </CardContent>
      </Card>

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">

          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
