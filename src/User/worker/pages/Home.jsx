import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import SearchBar from "../componets/Home/SearchBar/Serchbar";
import CategoryFilter from "../componets/Home/Category/categoryFilter";
import WorkerCard from "../componets/Home/WorkerCard/WorkerCard";
import { NavLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "../componets/Loder/Loader";

const RAW_WORKERS = [
  {
    _id: "1",
    name: "John Doe",
    categories: "Electrician",
    rating: 4.8,
    address: "123 Street, Amravati, Maharashtra",
    profileImage: "https://placehold.co/150",
    description: "Expert electrician with 5 years experience.",
    location: { coordinates: [77.7796, 20.9374] }
  },
  {
    _id: "2",
    name: "Suresh Kumar",
    categories: "Plumber",
    rating: 4.2,
    address: "456 Lane, Amravati, Maharashtra",
    profileImage: "https://placehold.co/150",
    description: "Leaking pipes and bathroom fittings expert.",
    location: { coordinates: [77.7800, 20.9380] }
  }
];

const Home = () => {
  const [workersData, setWorkersData] = useState(RAW_WORKERS);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hasMore, setHasMore] = useState(false);

  // Mock user data (replacing Redux)
  const userData = {
    _id: "user123",
    name: "Guest User",
    location: { coordinates: [77.7796, 20.9374] }
  };

  const categoryWorkers = () => {
    if (selectedCategory === "All") {
      setWorkersData(RAW_WORKERS);
    } else {
      setWorkersData(RAW_WORKERS.filter(w => w.categories === selectedCategory));
    }
  };

  const SerachWorkers = (keyword) => {
    const filtered = RAW_WORKERS.filter(w => 
      w.name.toLowerCase().includes(keyword.toLowerCase()) || 
      w.categories.toLowerCase().includes(keyword.toLowerCase())
    );
    setWorkersData(filtered);
  };

  useEffect(() => {
    categoryWorkers();
  }, [selectedCategory]);

  return (
    <div className="home-container">
      <div className="Seach-Category">
        <SearchBar SerachWorkers={SerachWorkers} fetchWorkers={() => setWorkersData(RAW_WORKERS)} />
        <div className="category-filter">
          <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
        </div>
      </div>
      <div className="home-layout">
        <InfiniteScroll
          dataLength={workersData.length}
          next={() => {}}
          hasMore={hasMore}
          loader={<Loader2/>}
        >
          <div className="worker-list">
            {workersData.map((worker) => (
              <NavLink 
                key={worker._id} 
                to="sendRequest" 
                state={{ worker, data: userData }} 
                style={{ textDecoration: "none" }}
              >
                <WorkerCard worker={worker} />
              </NavLink>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default Home;