"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

interface WorldBankIndicator {
  country: { id: string; value: string };
  date: string;
  value: number | null;
  indicator: { id: string; value: string };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WorldBankResponse = [any, WorldBankIndicator[]];

const fetchWorldBankData = async (
  country: string
): Promise<WorldBankResponse | null> => {
  if (!country) return null;
  const url = `https://api.worldbank.org/v2/country/${country}/indicator/NY.GDP.MKTP.CD?format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function WorldBankPage() {
  const [country, setCountry] = useState("");

  const { data, error, isLoading, refetch } =
    useQuery<WorldBankResponse | null>({
      queryKey: ["worldbank", country],
      queryFn: () => fetchWorldBankData(country.toUpperCase()),
      enabled: false, // Fetch only when button is clicked
    });

  return (
    <div className="p-8 flex flex-col md:flex-row items-start gap-6">
      {/* Left Side */}
      <div className="md:w-1/2 space-y-4">
        <h1 className="text-2xl font-bold">World Bank Economic Data</h1>
        <ThemeToggle />
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <input
            type="text"
            placeholder="Enter Country Code (e.g., US, IN, GB)"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full p-2 border rounded bg-white dark:bg-gray-700"
          />
          <button
            onClick={() => refetch()}
            disabled={!country.trim()}
            className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Get Data
          </button>
        </div>
        {data && <WorldBankCard worldBankData={data} />}
      </div>

      {/* Right Side - API Response */}
      <div className="w-full md:w-1/2">
        <h2 className="text-xl font-semibold">Response:</h2>
        <pre className="mt-3 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-x-auto text-sm">
          {isLoading
            ? "Loading..."
            : error
            ? "Error fetching data"
            : JSON.stringify(data, null, 2)}
        </pre>
      </div>
    </div>
  );
}

const WorldBankCard = ({
  worldBankData,
}: {
  worldBankData: WorldBankResponse | null;
}) => {
  if (!worldBankData || !worldBankData[1]?.length) {
    return <p className="text-center text-red-500">No data available</p>;
  }

  const latestData = worldBankData[1][0];

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-xl shadow-lg p-6 mt-4">
      <h2 className="text-2xl font-bold text-center">
        {latestData.country.value}
      </h2>
      <p className="text-center text-lg">{latestData.indicator.value}</p>
      <div className="mt-4 text-center text-lg">
        <p>
          Year: <span className="font-bold">{latestData.date}</span>
        </p>
        <p>
          Value:{" "}
          <span className="font-bold">
            {latestData.value ? latestData.value.toLocaleString() : "N/A"}
          </span>
        </p>
      </div>
    </div>
  );
};
