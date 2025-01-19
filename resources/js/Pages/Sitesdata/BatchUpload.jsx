import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function BatchUpload({ auth }) {
  const { post, setData, data, processing, errors, reset } = useForm({
    csv_file: null,
  });

  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessages, setErrorMessages] = useState([]);

  const handleFileChange = (e) => {
    setData("csv_file", e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessages([]);

    post(route("sitesdata.batchupload"), {
      onSuccess: () => {
        setSuccessMessage("File uploaded successfully!");
        reset();
      },
      onError: (error) => {
        if (error.errors) {
          setErrorMessages(error.errors);
        }
      },
    });
  };

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Batch Upload" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6 text-gray-900 dark:text-gray-100">
              <h1 className="text-2xl font-semibold mb-4">Batch Upload</h1>

              {successMessage && (
                <div className="bg-green-100 text-green-800 p-4 rounded mb-4">
                  {successMessage}
                </div>
              )}

              {errorMessages.length > 0 && (
                <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                  <ul>
                    {errorMessages.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="csv_file"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Upload CSV File
                  </label>
                  <input
                    type="file"
                    id="csv_file"
                    className="mt-1 block w-full"
                    onChange={handleFileChange}
                    accept=".csv"
                  />
                  {errors.csv_file && (
                    <div className="text-red-600 text-sm mt-1">
                      {errors.csv_file}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={processing}
                  className={`px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 ${
                    processing ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {processing ? "Uploading..." : "Upload"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
