"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import debounce from "lodash.debounce";
import ThemeToggle from "../ThemeToggle";

const GIPHY_API_KEY = "fS9mrEiT6AkF3ScPOcspO13lp2H0hFTu";
const BASE_URL = "https://api.giphy.com/v1/gifs";
const LIMIT = 25;
const REQUEST_DELAY = 300; // Debounce delay in ms

interface Gif {
  id: string;
  title: string;
  images: {
    fixed_height: {
      url: string;
    };
  };
}

const GiphySearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [offset, setOffset] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const cache = useRef<Map<string, Gif[]>>(new Map());

  // Fetch GIFs with caching & pagination
  const fetchGifs = async (
    query: string = "trending",
    newOffset: number = 0
  ) => {
    const cacheKey = `${query}-${newOffset}`;
    if (cache.current.has(cacheKey)) {
      setGifs(cache.current.get(cacheKey) || []);
      return;
    }

    setLoading(true);
    const endpoint = query === "trending" ? "/trending" : "/search";
    const url = `${BASE_URL}${endpoint}?api_key=${GIPHY_API_KEY}&limit=${LIMIT}&offset=${newOffset}&q=${query}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const newGifs = newOffset === 0 ? data.data : [...gifs, ...data.data];
      setGifs(newGifs);
      cache.current.set(cacheKey, newGifs);
    } catch (error) {
      console.error("Error fetching GIFs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedFetchGifs = useCallback(
    debounce((query: string) => {
      setOffset(0);
      fetchGifs(query, 0);
    }, REQUEST_DELAY),
    []
  );

  useEffect(() => {
    fetchGifs();
  }, []);

  // Infinite scrolling (Lazy Loading)
  const loadMore = () => {
    if (!loading) {
      const newOffset = offset + LIMIT;
      setOffset(newOffset);
      fetchGifs(searchTerm || "trending", newOffset);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      debouncedFetchGifs(searchTerm);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
        🔍 Search Giphy GIFs
      </h1>
      <ThemeToggle />
      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6"
      >
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search GIFs..."
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-lg w-full sm:w-80 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Search
        </button>
      </form>
      y
      {loading && (
        <p className="text-center text-gray-600 dark:text-gray-400">
          Loading...
        </p>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {gifs.length > 0 ? (
          gifs.map((gif, index) => (
            <div
              key={`${gif.id}-${index}`} // Ensure unique keys
              className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <img
                src={gif.images.fixed_height.url}
                alt={gif.title}
                className="rounded-lg w-full h-auto"
              />
              <p className="text-center text-gray-800 dark:text-white mt-2">
                {gif.title || "Untitled"}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
            No GIFs found.
          </p>
        )}
      </div>
      <div className="flex justify-center mt-6">
        <button
          onClick={loadMore}
          disabled={loading}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default React.memo(GiphySearch);
