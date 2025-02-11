import { useState, useEffect } from "react";

export default function useSiteStatus() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        console.log("Fetching site data..."); // 🛠 Debugging log
        const response = await fetch("/api/sitestatus");

        if (!response.ok) throw new Error("Failed to fetch");

        const result = await response.json();
        console.log("Fetched data:", result); // 🛠 Debugging log

        // Ensure the data is in the expected format
        if (!Array.isArray(result)) {
          throw new Error("Unexpected data format");
        }

        // Process and set data
        setData(result.map(item => ({
          ...item,
          potable: Number(item.potable),
          nonpotable: Number(item.nonpotable)
        })));

      } catch (err) {
        console.error("Error fetching data:", err); // 🛠 Debugging log
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
