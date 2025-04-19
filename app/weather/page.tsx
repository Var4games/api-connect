"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

type WeatherData = {
  data: {
    city_name: string;
    country_code: string;
    weather: {
      description: string;
      icon: string;
    };
    temp: number;
    app_temp: number;
    wind_spd: number;
    wind_cdir_full: string;
    rh: number;
    precip: number;
    vis: number;
    sunrise: string;
    sunset: string;
  }[];
};

const fetchWeather = async (lat: string, lon: string): Promise<WeatherData> => {
  const apiKey = process.env.NEXT_PUBLIC_WEATHERBIT_API_KEY;
  const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${lon}&key=${apiKey}`;
  const res = await fetch(url);
  return res.json();
};

export default function WeatherPage() {
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["weather", lat, lon],
    queryFn: () => fetchWeather(lat, lon),
    enabled: false, // Only fetch when button is clicked
  });

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Weather API</h1>
        <ThemeToggle />
      </div>

      <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <input
          type="text"
          placeholder="Latitude"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          className="border p-2 mr-2 bg-white dark:bg-gray-700"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={lon}
          onChange={(e) => setLon(e.target.value)}
          className="border p-2 mr-2 bg-white dark:bg-gray-700"
        />
        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 transition"
        >
          Get Weather
        </button>
      </div>

      <h2 className="mt-6 text-xl font-semibold">Response:</h2>
      <pre className="mt-2 p-4 bg-gray-200 dark:bg-gray-700 rounded-lg">
        {isLoading
          ? "Loading..."
          : error
          ? "Error fetching data"
          : JSON.stringify(data, null, 2)}
      </pre>

      {data && data.data && <WeatherCard weatherData={data} />}
    </div>
  );
}

const WeatherCard = ({ weatherData }: { weatherData: WeatherData }) => {
  if (!weatherData || !weatherData.data || !weatherData.data.length) {
    return <p className="text-center">No weather data available</p>;
  }

  const data = weatherData.data[0];

  return (
    <div className="max-w-md mx-auto bg-gradient-to-br from-blue-500 to-purple-500 text-white rounded-xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold text-center">
        {data.city_name}, {data.country_code}
      </h2>
      <p className="text-center text-lg">{data.weather.description}</p>
      <div className="flex justify-center items-center mt-4">
        <img
          src={`https://www.weatherbit.io/static/img/icons/${data.weather.icon}.png`}
          alt={data.weather.description}
          className="w-16 h-16"
        />
        <h1 className="text-5xl font-extrabold ml-4">{data.temp}°C</h1>
      </div>
      <p className="text-center text-sm">Feels like {data.app_temp}°C</p>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <p>Wind</p>
          <p className="font-bold">
            {data.wind_spd} m/s {data.wind_cdir_full}
          </p>
        </div>
        <div className="text-center">
          <p>Humidity</p>
          <p className="font-bold">{data.rh}%</p>
        </div>
        <div className="text-center">
          <p>Precipitation</p>
          <p className="font-bold">{data.precip} mm</p>
        </div>
        <div className="text-center">
          <p>Visibility</p>
          <p className="font-bold">{data.vis} km</p>
        </div>
        <div className="text-center">
          <p>Sunrise</p>
          <p className="font-bold">{data.sunrise}</p>
        </div>
        <div className="text-center">
          <p>Sunset</p>
          <p className="font-bold">{data.sunset}</p>
        </div>
      </div>
    </div>
  );
};
