import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchBar.css';

const SearchBar = ({ SerachWorkers ,fetchWorkers}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const serchSugetionWorkers = async (text) => {
    try {
      const res = await axios.get(`${BASE_URL}/workers/getSuggestion`, {
        params: {
          keyword: text,
        },
      });
      let suggetions = res.data || [];

      // flatten if nested arrays exist
      if (Array.isArray(suggetions[0])) {
        suggetions = suggetions[0];
      }
      setSuggestions(suggetions);
      setShowSuggestions(true);
    } catch (err) {
      console.error("❌ Failed to load suggestions:", err);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const keyword = typeof query === "string" ? query.trim() : "";

    if (keyword === "") {
      setSuggestions([]);
      fetchWorkers();
      setShowSuggestions(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      serchSugetionWorkers(keyword);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = (text) => {
    if (!text || typeof text !== "string") return;

    SerachWorkers(text);
    setQuery(text);
    setShowSuggestions(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleSuggestionClick = (item) => {
    const keyword =
      typeof item === "string"
        ? item
        : item?.name || item?.category || item?.description || item?.address || "";

    if (!keyword) {
      console.warn("❌ No keyword found for clicked suggestion.");
      return;
    }

    handleSearch(keyword);
  };

  return (
    <div className="search-bar-wrapper" style={{ position: 'relative' }}>
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="🔍 Search for a worker or skill..."
          value={typeof query === "string" ? query : ""}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
        />
        <button type="submit">Search</button>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestion-list">
          {suggestions.map((item, index) => {
            const keyword =
              typeof item === "string"
                ? item
                : item?.name || item?.category || item?.description || item?.address || "";

            return (
              <li
                key={index}
                onClick={() => handleSuggestionClick(item)}
                className="suggestion-item"
              >
                {keyword}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
