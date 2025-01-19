import TableHeading from "@/Components/TableHeading";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import Pagination from "@/Components/Pagination";
import SelectInput from "@/Components/SelectInput";
import Swal from 'sweetalert2';
import { useState } from "react";

export default function Index({auth, sites_data, queryParams = null, success }){
  const [selectedSite, setSelectedSite] = useState(null);

  queryParams = queryParams || {};
  console.log(sites_data);


  const searchFieldChanged = (name, value) => {
    if (value) {
      queryParams[name] = value;
    } else {
      delete queryParams[name];
    }

    router.get(route("sitesdata.index"), queryParams);
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
    setSelectedSite(sites);
    console.log(`Editing site: ${sites.name} (ID: ${sites.id})`);
    router.get(route("sitesdata.edit",{sitesdatum: sites.id}));
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
        router.delete(route("sitesdata.destroy", {sitesdatum: sites.id}));
      }
    });
  };


  return(
    <AuthenticatedLayout
    user={auth.user}
    header={
      <div className="flex justify-between items-center">
      <h2 className=" font-semibold text-xl text-black">
        Sites
      </h2>
        <div className="space-x-4">

      <Link
        href={route("sitesdata.create")}
        className="bg-blue-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-blue-600"
      >
        Add new
      </Link>
      <Link
        href={route("sitesdata.batchupload")}
        className="bg-blue-500 py-2 px-4 text-white rounded shadow transition-all hover:bg-blue-600"
      >
        Upload CSV
      </Link>

          </div>
      </div>
    }
    >
      <Head title="Dashboard" />

      <div className="py-12">
       <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          {success && (
            <div className="bg-emerald-500 py-2 px-4 text-white rounded mb-4">
              {success}
            </div>
          )}
          <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg bg-white-800">
            <div className="p-6 text-gray-900 text-dark-100">
              <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
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
                        name="ph_level"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Condition
                      </TableHeading>

                      <TableHeading
                        name="salinity"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                       PH Level
                      </TableHeading>

                      <TableHeading
                        name="turbidity"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >
                        Salinity
                      </TableHeading>

                      <TableHeading
                        name="total_dissolved_solids"
                        sort_field={queryParams.sort_field}
                        sort_direction={queryParams.sort_direction}
                        sortChanged={sortChanged}
                      >

                        Turbidity
                      </TableHeading>
                      <th className="px-3 py-3"> dissolve solids</th>
                      <th className="px-3 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                    <tr className="text-nowrap">
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3">
                      <TextInput
                          className="w-full"
                          defaultValue={queryParams.name}
                          placeholder="Site Name"
                          onBlur={(e) =>
                            searchFieldChanged("name", e.target.value)
                          }
                          onKeyPress={(e) => onKeyPress("name", e)}
                        />
                      </th>
                      <th className="px-3 py-3">
                      <SelectInput
                          className="w-full"
                          defaultValue={queryParams.status}
                          onChange={(e) =>
                            searchFieldChanged("status", e.target.value)
                          }
                        >
                          <option value="">Select</option>
                          <option value="potable">Potable</option>
                          <option value="non-potable">Non-Potable</option>

                        </SelectInput>
                      </th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                      <th className="px-3 py-3"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sites_data.data.map((sites) => (
                      <tr
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                        key={sites.id}
                      >
                        <td className="px-3 py-2">{sites.id}</td>

                        <th className="px-3 py-2 text-black text-nowrap text-sm  hover:underline hover:text-blue-400">
                          <Link href={route("sitesdata.show", sites.id)}>
                            {sites.name}
                          </Link>
                        </th>
                        <td className="px-3 py-2">
                        {sites.status}
                        </td>
                        <td className="px-3 py-2">
                        {sites.ph_level}
                        </td>

                         <td className="px-3 py-2">
                        {sites.salinity}
                        </td>

                         <td className="px-3 py-2">
                        {sites.turbidity.toFixed(1)} NTU
                        </td>

                         <td className="px-3 py-2">
                        {sites.total_dissolved_solids}
                        </td>


                        <td className="px-3 py-2 text-nowrap">
                          <Link
                            href={route("sitesdata.edit", sites.id)}
                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                            onClick={() => handleEditClick(sites)}
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => deleteSite(sites) }
                            className="font-medium text-red-600 text-red-500 hover:underline mx-1"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
                <Pagination links={sites_data.meta.links} />
                        </div>
                    </div>
                </div>
            </div>

    </AuthenticatedLayout>
  )
}
