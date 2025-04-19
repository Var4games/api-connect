"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

const NASA_API_KEY = "1BHIwuHwWzMGY0l5GRASiQhoHS7CraTPKZsohdnL";
const APOD_URL = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
const PLANETS_URL = `https://api.le-systeme-solaire.net/rest/bodies/`;

type ApodData = {
  title: string;
  url: string;
  explanation: string;
};

type Planet = {
  id: string;
  englishName: string;
  gravity: number;
};

type PlanetsData = {
  bodies: Planet[];
};

const fetchAPOD = async (): Promise<ApodData> => {
  const res = await fetch(APOD_URL);
  if (!res.ok) throw new Error("Failed to fetch Astronomy Picture");
  return res.json();
};

const fetchPlanets = async (): Promise<PlanetsData> => {
  const res = await fetch(PLANETS_URL);
  if (!res.ok) throw new Error("Failed to fetch Planets data");
  return res.json();
};

export default function NasaApp() {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data: apodData,
    error: apodError,
    refetch: fetchApod,
  } = useQuery({
    queryKey: ["nasa_apod"],
    queryFn: fetchAPOD,
    enabled: false,
  });

  const {
    data: planetsData,
    error: planetsError,
    refetch: fetchPlanetsList,
  } = useQuery({
    queryKey: ["nasa_planets"],
    queryFn: fetchPlanets,
    enabled: false,
  });

  const filteredPlanets = planetsData?.bodies?.filter((planet) =>
    planet.englishName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-10 flex flex-col md:flex-row items-start gap-6">
      <div className="md:w-1/2">
        <h1 className="text-2xl font-bold">NASA API - Astronomy & Planets</h1>
        <ThemeToggle />
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <button
            onClick={() => {
              fetchApod();
              fetchPlanetsList();
            }}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded"
          >
            Fetch Data
          </button>
          <input
            type="text"
            placeholder="Search for a planet..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-2 w-full p-2 border rounded"
          />
        </div>
        {apodData && <APODCard apodData={apodData} />}
        {planetsData && <PlanetsList planets={filteredPlanets} />}
      </div>

      <div className="w-full md:w-1/2 mt-6 md:mt-0">
        <h2 className="text-xl font-semibold">Response:</h2>
        <pre className="mt-2 p-4 bg-gray-200 rounded-lg overflow-x-auto">
          {apodError
            ? "Error fetching APOD"
            : JSON.stringify(apodData, null, 2)}
          {planetsError
            ? "\nError fetching planets"
            : JSON.stringify(planetsData, null, 2)}
        </pre>
      </div>
    </div>
  );
}

const APODCard = ({ apodData }: { apodData: ApodData }) => (
  <div className="max-w-2xl mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-center">{apodData.title}</h2>
    <img src={apodData.url} alt={apodData.title} className="mt-4 rounded-lg" />
    <p className="mt-2 text-center">{apodData.explanation}</p>
  </div>
);

const PlanetsList = ({ planets }: { planets?: Planet[] }) => (
  <div className="mt-6 max-w-2xl mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 text-white rounded-xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-center">Planets</h2>
    {planets && planets.length > 0 ? (
      <ul className="mt-4 space-y-2">
        {planets.map((planet) => (
          <li key={planet.id} className="text-lg text-center">
            {planet.englishName} - Gravity: {planet.gravity} m/s²
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-center">No planets found</p>
    )}
  </div>
);
