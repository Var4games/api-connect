"use client";

import Link from "next/link";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

const apis = [
  { id: "weather", name: "Weather API", img: "/weather.png", url: "/weather" },
  {
    id: "cocktails",
    name: "Cocktail API",
    img: "/cocktail.png",
    url: "/cocktails",
  },
  { id: "bankapi", name: "Bank API", img: "/bankapi.png", url: "/bankdata" },
  {
    id: "geonameapi",
    name: "Geoname API",
    img: "/geoname.png",
    url: "/geoname",
  },
  {
    id: "restapi",
    name: "REST Countries API",
    img: "/restapi.png",
    url: "/restcountryapi",
  },
  { id: "joke", name: "Joke API", img: "/joke.png", url: "/joke" },
  { id: "giphy", name: "Giphy API", img: "/giphy.png", url: "/giphy" },
  { id: "healthapi", name: "Health API", img: "/covid.png", url: "/healthapi" },
  { id: "nasa", name: "NASA API", img: "/nasa.png", url: "/nasa" },
];

export default function Home() {
  return (
    <div className="p-10 min-h-screen">
      {/* Theme Toggle Button */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">API Showcase Project</h1>
        <ThemeToggle />
      </div>

      <p className="mt-2 text-lg dark:text-gray-300">
        Explore real-time data from various public APIs, including weather
        updates, space exploration, country details, and more. Click on any API
        below to discover its features!
      </p>

      {/* API Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {apis.map((api) => (
          <Link
            key={api.id}
            href={api.url}
            className="border rounded-lg p-4 shadow-lg hover:shadow-2xl transition duration-700 ease-in-out transform hover:-translate-y-3 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="relative w-full h-80">
              <Image
                src={api.img}
                alt={api.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h2 className="text-lg font-bold mt-2 text-center">{api.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
