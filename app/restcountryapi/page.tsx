"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

const fetchCountryInfo = async (countryCode: string) => {
  if (!countryCode) throw new Error("Country code is required");
  const url = `https://restcountries.com/v3.1/alpha/${countryCode}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch country info");
  return res.json();
};

type Country = {
  name: { common: string };
  capital?: string[];
  region: string;
  population: number;
  currencies?: { [key: string]: { name: string } };
};

export default function RestCountriesPage() {
  const [countryCode, setCountryCode] = useState("");

  const {
    data: countryData,
    error,
    isLoading,
    refetch,
  } = useQuery<Country[]>({
    queryKey: ["restcountries", countryCode],
    queryFn: () => fetchCountryInfo(countryCode),
    enabled: false,
  });

  return (
    <div className="p-10 flex flex-col md:flex-row items-start gap-6">
      <div className="md:w-1/2">
        <h1 className="text-2xl font-bold">REST Countries API</h1>
        <ThemeToggle />
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <input
            type="text"
            placeholder="Enter Country Code (e.g., US)"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
            className="border p-2 w-full"
          />
          <button
            onClick={() => countryCode && refetch()}
            className="mt-2 w-full px-3 py-1 bg-blue-500 text-white rounded"
          >
            Get Info
          </button>
        </div>
        {countryData && <CountryCard countryData={countryData} />}
      </div>
      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <h2 className="text-xl font-semibold">Response:</h2>
        <pre className="mt-2 p-4 bg-gray-200 rounded-lg overflow-x-auto">
          {isLoading
            ? "Loading..."
            : error
            ? "Error fetching data"
            : JSON.stringify(countryData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

const CountryCard = ({ countryData }: { countryData: Country[] }) => {
  if (!countryData || countryData.length === 0)
    return <p className="text-center">No data available</p>;

  const country = countryData[0];

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center">{country.name.common}</h2>
      <p className="text-center text-lg">
        Capital: {country.capital?.[0] || "N/A"}
      </p>
      <p className="text-center text-lg">Region: {country.region}</p>
      <p className="text-center text-lg">
        Population: {country.population.toLocaleString()}
      </p>
      <p className="text-center text-lg">
        Currency: {Object.values(country.currencies || {})[0]?.name || "N/A"}
      </p>
    </div>
  );
};
