"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

// Define types for API responses
interface CountryInfo {
  countryName: string;
  capital: string;
  continentName: string;
  population: number;
  currencyCode: string;
}

interface CountryResponse {
  geonames: CountryInfo[];
}

interface CityInfo {
  geonameId: number;
  name: string;
  adminName1: string;
  population: number;
}

interface CitiesResponse {
  geonames: CityInfo[];
}

const fetchCountryInfo = async (
  countryCode: string
): Promise<CountryResponse> => {
  const username = "reactprod"; // Replace with your Geonames username
  const url = `https://secure.geonames.org/countryInfoJSON?country=${countryCode}&username=${username}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch country info");
  return res.json();
};

const fetchCities = async (countryCode: string): Promise<CitiesResponse> => {
  const username = "reactprod";
  const url = `https://secure.geonames.org/searchJSON?country=${countryCode}&featureClass=P&maxRows=10&username=${username}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch cities");
  return res.json();
};

export default function GeoNamesPage() {
  const [countryCode, setCountryCode] = useState<string>("");

  const { data: countryData, refetch: fetchCountry } =
    useQuery<CountryResponse>({
      queryKey: ["geonames", countryCode],
      queryFn: () => fetchCountryInfo(countryCode),
      enabled: false,
    });

  const { data: citiesData, refetch: fetchCitiesList } =
    useQuery<CitiesResponse>({
      queryKey: ["geonames_cities", countryCode],
      queryFn: () => fetchCities(countryCode),
      enabled: false,
    });

  return (
    <div className="p-10 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        🌍 Geonames Country & Cities
      </h1>
      <ThemeToggle />

      <div className="flex flex-col items-center gap-4 mt-6">
        <input
          type="text"
          placeholder="Enter Country Code (e.g., US)"
          value={countryCode}
          onChange={(e) => setCountryCode(e.target.value.toUpperCase())}
          className="border border-gray-400 p-3 rounded-lg w-80 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => {
            fetchCountry();
            fetchCitiesList();
          }}
          disabled={!countryCode.trim()}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          Get Info
        </button>
      </div>

      {countryData && <CountryCard countryData={countryData} />}
      {citiesData && <CitiesList citiesData={citiesData} />}
    </div>
  );
}

const CountryCard = ({ countryData }: { countryData?: CountryResponse }) => {
  if (!countryData?.geonames?.length) {
    return <p className="text-center">No data available</p>;
  }
  const country = countryData.geonames[0];
  return (
    <div className="mt-6 mx-auto max-w-2xl bg-gradient-to-br from-green-500 to-blue-500 text-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center">
        {country.countryName || "Unknown Country"}
      </h2>
      <p className="text-center text-lg">Capital: {country.capital || "N/A"}</p>
      <p className="text-center text-lg">
        Continent: {country.continentName || "N/A"}
      </p>
      <p className="text-center text-lg">
        Population: {country.population?.toLocaleString() || "N/A"}
      </p>
      <p className="text-center text-lg">
        Currency: {country.currencyCode || "N/A"}
      </p>
    </div>
  );
};

const CitiesList = ({ citiesData }: { citiesData?: CitiesResponse }) => {
  if (!citiesData?.geonames?.length) {
    return <p className="text-center mt-6">No cities available</p>;
  }
  return (
    <div className="mt-6 mx-auto max-w-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-center">🏙️ Top Cities</h2>
      <ul className="mt-4 space-y-2">
        {citiesData.geonames.map((city) => (
          <li key={city.geonameId} className="text-lg text-center">
            {city.name} ({city.adminName1}) - Population:{" "}
            {city.population.toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};
