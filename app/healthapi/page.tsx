"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

type CovidData = {
  country: string;
  cases: number;
  deaths: number;
  recovered: number;
  active: number;
  critical: number;
  todayCases: number;
  todayDeaths: number;
  countryInfo: {
    flag: string;
  };
};

const fetchCovidStats = async (country: string): Promise<CovidData | null> => {
  if (!country) return null;
  const url = `https://disease.sh/v3/covid-19/countries/${country}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function CovidPage() {
  const [country, setCountry] = useState("");

  const { data, error, isLoading, refetch } = useQuery<CovidData | null>({
    queryKey: ["covid", country],
    queryFn: () => fetchCovidStats(country),
    enabled: false, // Fetch only when button is clicked
  });

  return (
    <div className="p-10 flex flex-col md:flex-row items-start gap-6">
      {/* Left Side - UI */}
      <div className="md:w-1/2">
        <h1 className="text-2xl font-bold">COVID-19 Stats</h1>
        <ThemeToggle />
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <input
            type="text"
            placeholder="Enter Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border p-2 w-full"
          />
          <button
            onClick={() => refetch()}
            className="mt-2 w-full px-3 py-1 bg-blue-500 text-white rounded"
          >
            Get Stats
          </button>
        </div>
        {data && <CovidCard covidData={data} />}
      </div>

      {/* Response Below */}
      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <h2 className="text-xl font-semibold">Response:</h2>
        <pre className="mt-2 p-4 bg-gray-200 rounded-lg overflow-x-auto">
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

type CovidCardProps = {
  covidData: CovidData;
};

const CovidCard = ({ covidData }: CovidCardProps) => {
  if (!covidData) return <p className="text-center">No data available</p>;

  return (
    <div className="max-w-2xl mx-auto bg-gradient-to-br from-red-500 to-purple-500 text-white rounded-xl shadow-lg p-6">
      <div className="flex flex-col items-center">
        <img
          src={covidData.countryInfo.flag}
          alt={covidData.country}
          className="w-32 h-20 mb-4"
        />
        <h2 className="text-2xl font-bold">{covidData.country}</h2>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-lg">
        <p>
          Cases: <span className="font-bold">{covidData.cases}</span>
        </p>
        <p>
          Deaths: <span className="font-bold">{covidData.deaths}</span>
        </p>
        <p>
          Recovered: <span className="font-bold">{covidData.recovered}</span>
        </p>
        <p>
          Active: <span className="font-bold">{covidData.active}</span>
        </p>
        <p>
          Critical: <span className="font-bold">{covidData.critical}</span>
        </p>
        <p>
          Today&apos;s Cases:{" "}
          <span className="font-bold">{covidData.todayCases}</span>
        </p>
        <p>
          Today&apos;s Deaths:{" "}
          <span className="font-bold">{covidData.todayDeaths}</span>
        </p>
      </div>
    </div>
  );
};
