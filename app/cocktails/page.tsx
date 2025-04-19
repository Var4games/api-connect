"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

// Define types for API response
interface Cocktail {
  idDrink: string;
  strDrink: string;
  strCategory: string;
  strGlass: string;
  strDrinkThumb: string;
}

interface CocktailResponse {
  drinks: Cocktail[] | null;
}

const fetchCocktails = async (query: string): Promise<CocktailResponse> => {
  if (!query) return { drinks: null }; // Prevent unnecessary API calls

  const url = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch cocktails");

  return res.json();
};

export default function CocktailsPage() {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  const { data, error, isLoading, refetch } = useQuery<CocktailResponse>({
    queryKey: ["cocktails", query],
    queryFn: () => fetchCocktails(query),
    enabled: false, // Fetch only when search is triggered
  });

  return (
    <div className="p-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold text-center mb-6">
        🍹 Find Your Cocktail
      </h1>
      <div className="flex justify-center mb-6">
        <ThemeToggle />
      </div>

      <div className="flex justify-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search for a cocktail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-3 rounded-lg w-80 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        <button
          onClick={() => {
            setQuery(search);
            refetch();
          }}
          disabled={!search.trim()} // Prevent empty searches
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {isLoading && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      )}
      {error && (
        <p className="text-center text-red-500">Error fetching data.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data?.drinks ? (
          data.drinks.map((drink) => (
            <CocktailCard key={drink.idDrink} drink={drink} />
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
            No cocktails found.
          </p>
        )}
      </div>
    </div>
  );
}

const CocktailCard = ({ drink }: { drink: Cocktail }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition">
      <img
        src={drink.strDrinkThumb}
        alt={drink.strDrink}
        className="w-full h-48 object-cover rounded-lg mb-3"
      />
      <h2 className="text-xl font-semibold">{drink.strDrink}</h2>
      <p className="text-gray-600 dark:text-gray-400">{drink.strCategory}</p>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Glass: {drink.strGlass}
      </p>
      <a
        href={`https://www.thecocktaildb.com/drink/${drink.idDrink}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block mt-3 text-blue-600 hover:underline"
      >
        View Recipe →
      </a>
    </div>
  );
};
