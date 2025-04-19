"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ThemeToggle from "../ThemeToggle";

const fetchJoke = async (category: string) => {
  const url = `https://v2.jokeapi.dev/joke/${category}?type=twopart`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch joke");
  return res.json();
};

export default function JokeApp() {
  const [category, setCategory] = useState("Any");

  const {
    data: jokeData,
    error,
    refetch: fetchNewJoke,
  } = useQuery({
    queryKey: ["joke", category],
    queryFn: () => fetchJoke(category),
    enabled: false,
  });

  return (
    <div className="p-10 flex flex-col items-center gap-6">
      <h1 className="text-2xl font-bold">JokeAPI - Random Jokes</h1>
      <ThemeToggle />
      <select
        className="border p-2 rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="Any">Any</option>
        <option value="Programming">Programming</option>
        <option value="Misc">Miscellaneous</option>
        <option value="Dark">Dark</option>
        <option value="Pun">Pun</option>
      </select>
      <button
        onClick={async () => await fetchNewJoke()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Get Joke
      </button>

      {error && <p className="text-red-500">Error fetching joke.</p>}
      {jokeData && (
        <div className="p-4 bg-gray-100 rounded-lg shadow-md">
          <p className="font-semibold">{jokeData.setup}</p>
          <p className="mt-2 text-gray-600">{jokeData.delivery}</p>
        </div>
      )}
    </div>
  );
}
