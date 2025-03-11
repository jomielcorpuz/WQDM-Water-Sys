import TableHeading from "@/Components/TableHeading";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import Swal from 'sweetalert2';
import { useEffect, useState } from "react";
import { WATER_STATUS_CLASS_MAP, WATER_STATUS_TEXT_MAP } from "@/constants";
import { ACTIVE_STATUS_CLASS_MAP, ACTIVE_STATUS_TEXT_MAP } from "@/constants";
import { Button } from "@/Components/ui/button";
import { FilePenLine, Plus, Trash2, Upload } from "lucide-react";
import { Toaster } from "@/Components/ui/sonner";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Components/ui/select";
import { Card } from "@/Components/ui/card";
import { Separator } from "@/Components/ui/separator";

export default function Index({ auth, sites_data, sites_data_all, queryParams = null, success }) {
  useEffect(() => {
    if (success) {
      toast.success(success.message, {
        description:
          success.type === "create"
            ? "The site has been successfully added."
            : success.type === "update"
              ? "The site has been successfully updated."
              : success.type === "delete"
                ? "The site has been deleted."
                : "The site has been restored.",
      });
    }
  }, [success]);


  const [selectedSites, setSelectedSites] = useState([]);

  queryParams = queryParams || {};
  console.log(sites_data);


  const totalPotable = sites_data_all.data.filter(site => site.status === 'Potable').length;
  const totalNonPotable = sites_data_all.data.filter(site => site.status === 'Non-potable').length;



  const searchFieldChanged = (name, value) => {
    const newQueryParams = { ...queryParams }; // Create a new object to avoid direct mutation

    if (value && value !== "all") {
      newQueryParams[name] = value;
    } else {
      delete newQueryParams[name]; // Remove status if "All" is selected
    }

    router.get(route("sitesdata.index"), newQueryParams, { preserveState: true });
  };



  const onKeyPress = (name, e) => {
    if (e.key !== "Enter") return;

    searchFieldChanged(name, e.target.value);
  };

  const sortChanged = (name) => {
    if (name === queryParams.sort_field) {
      if (queryParams.sort_direction === "asc") {
        queryParams.sort_direction = "desc";
      } else {
        queryParams.sort_direction = "asc";
      }
    } else {
      queryParams.sort_field = name;
      queryParams.sort_direction = "asc";
    }
    router.get(route("sitesdata.index"), queryParams);
  };


  const handleEditClick = (sites) => {
    if (!sites) {
      console.error("Site is null or undefined");
      return;
    }
    setSelectedSites([sites.id]); // For single site, update directly
    console.log(`Editing site: ${sites.name} (ID: ${sites.id})`);
    router.get(route("sitesdata.edit", { sitesdatum: sites.id }));
  };

  const deleteSite = (sites) => {
    console.log(sites);
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'swal-confirm-btn',
        cancelButton: 'swal-cancel-btn',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        router.delete(route("sitesdata.destroy", { sitesdatum: sites.id }));
      }
    });
  };

  const toggleSelection = (id) => {
    setSelectedSites((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((sid) => sid !== id) : [...prevSelected, id]
    );
  };
  const handleExport = async () => {
    try {
      const response = await fetch(route('sitesdata.export'), {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        // Create a blob from the response
        const blob = await response.blob();
        // Create a link to download the file
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `water_quality_sites_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      } else {
        console.error('Export failed:', response.statusText);
        // Handle error appropriately
      }
    } catch (error) {
      console.error('Export error:', error);
      // Handle error appropriately
    }
  };

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <div className="lg:flex md:flex xl:flex space-y-2 justify-between items-center">
          <h2 className="font-semibold text-xl text-black">Sites</h2>
          <div className="flex space-x-4 justify-center items-center ">
            <Button
              variant="outline"
              onClick={() => router.visit(route("sitesdata.batchupload"))}
              className=" lg:px-6 lg:py-5 md:px-6 md:py-5 transition-all hover:bg-blue-600 hover:text-white"
            >
              <Upload />
              Upload CSV
            </Button>
            <Button
              onClick={() => router.visit(route("sitesdata.create"))}
              className="bg-blue-500 text-white lg:py-5  md:py-5  transition-all hover:bg-blue-600"
            >
              <Plus className="text-white" />
              Add New Sites
            </Button>

          </div>
        </div>
      }
    >

      <Head title="Sites" />

      <Card className="mx-6 my-10 ">
        <div className="py-6 px-6 text-gray-900 text-dark-100">
          <div className="flex  space-x-6 mb-6">
            <TextInput
              className=""
              defaultValue={queryParams.name}
              placeholder="Site Name"
              onBlur={(e) =>
                searchFieldChanged("name", e.target.value)
              }
              onKeyPress={(e) => onKeyPress("name", e)}
            />
            <Select
              value={queryParams.status || "all"}
              onValueChange={(value) => searchFieldChanged("status", value)}
            >
              <SelectTrigger className="h-11 w-[150px] rounded-lg pl-2.5" aria-label="Select status">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent align="end" className="rounded-xl">
                <SelectItem value="all" className="rounded-lg">All</SelectItem>
                <SelectItem value="potable" className="rounded-lg">Potable</SelectItem>
                <SelectItem value="non-potable" className="rounded-lg">Non-Potable</SelectItem>
              </SelectContent>
            </Select>

          </div>
          <div className="overflow-auto border rounded-xl">
            <table className="w-full  text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-600 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-200">
                <tr className="text-nowrap">

                  <TableHeading
                    name="id"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    ID
                  </TableHeading>

                  <TableHeading
                    name="name"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    Name
                  </TableHeading>

                  <TableHeading
                    name="status"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    Condition
                  </TableHeading>

                  <TableHeading
                    name="ph_level"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    PH Level
                  </TableHeading>

                  <TableHeading
                    name="salinity"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    Salinity
                  </TableHeading>

                  <TableHeading
                    name="turbidity"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    Turbidity
                  </TableHeading>
                  <TableHeading
                    name="total_dissolved_solids"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    TDS
                  </TableHeading>
                  <TableHeading
                    name="active_status"
                    sort_field={queryParams.sort_field}
                    sort_direction={queryParams.sort_direction}
                    sortChanged={sortChanged}
                  >
                    Status
                  </TableHeading>
                  <th className="px-3 py-4 text-end flex justify-end">Actions</th>
                </tr>
              </thead>

              <tbody>
                {sites_data.data.map((sites) => (
                  <tr
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={sites.id}
                  >

                    <td className="px-3 py-2">{sites.id}</td>

                    <th className="px-3 py-2 text-gray-500 text-nowrap text-sm hover:underline hover:text-blue-400">
                      <Link href={route("sitesdata.show", sites.id)}>
                        {sites.name}
                      </Link>
                    </th>
                    <td className="px-3 py-2">
                      <span className={"text-nowrap px-2 py-1 rounded-xl font-semibold " + WATER_STATUS_CLASS_MAP[sites.status]}>
                        {WATER_STATUS_TEXT_MAP[sites.status]}
                      </span>
                    </td>
                    <td className="px-3 py-2">{sites.ph_level}</td>
                    <td className="px-3 py-2 ">{sites.salinity} ppt</td>
                    <td className="px-3 py-2">{sites.turbidity.toFixed(1)} NTU</td>
                    <td className="px-3 py-2 text-nowrap ">{sites.total_dissolved_solids} mg/L</td>
                    <td className="px-3 py-2">
                      <span className={"px-2 py-1 rounded-xl " + ACTIVE_STATUS_CLASS_MAP[sites.active_status]}>
                        {ACTIVE_STATUS_TEXT_MAP[sites.active_status]}
                      </span>

                    </td>

                    <td className="px-3 py-2 text-nowrap justify-end flex">
                      <Button

                        className=" text-white py-2 px-2  mx-1 rounded-sm bg-blue-500 hover:bg-blue-600"
                        onClick={() => handleEditClick(sites)}
                      >
                        <FilePenLine />
                        Update
                      </Button>

                      <Button
                        variant="destructive"
                        onClick={() => deleteSite(sites)}
                        className="font-medium hover:bg-red-600 "
                      >
                        <Trash2 />

                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination links={sites_data.meta.links} />
          <Separator className="my-6" />
          <div className="flex justify-between gap-3 items-center" >
            <div className="max-w-7xl sm:px-6 lg:px-2">
              <p className="text-gray-600">
                Total Potable:
                <span className="text-gray-800"> {totalPotable}</span>
              </p>
              <p className="text-gray-600">
                Total Non-Potable:
                <span className="text-gray-800"> {totalNonPotable}</span>
              </p>

            </div>


          </div>

        </div>

      </Card>
    </AuthenticatedLayout>
  );
}
