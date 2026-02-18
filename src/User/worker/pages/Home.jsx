import React, { useState, useEffect } from "react";
import "./Home.css";
import SearchBar from "../componets/Home/SearchBar/Serchbar";
import CategoryFilter from "../componets/Home/Category/categoryFilter";
import WorkerCard from "../componets/Home/WorkerCard/WorkerCard";
import { NavLink } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import { Loader2 } from "../componets/Loder/Loader";
import electrician from "../../../assets/User/Grocery/electrician.jpg";
import plumber from "../../../assets/User/Grocery/Plumber.webp";
import carpenter from "../../../assets/User/Grocery/Carpenter.jpg";
import painter from "../../../assets/User/Grocery/Painter.png";
import driver from "../../../assets/User/Grocery/Driver.jpg";
import  cook from "../../../assets/User/Grocery/cook.jpg";
import cleaner from "../../../assets/User/Grocery/cleaner.jpg";
import acMechanic from "../../../assets/User/Grocery/ac.jpg";



const RAW_WORKERS = [
  {
    _id: "1",
    name: "John Doe",
    categories: "Electrician",
    rating: 4.8,
    address: "123 Street, Amravati, Maharashtra",
    profileImage: electrician,
    description: "Expert electrician with 5 years experience.",
    location: { coordinates: [77.7796, 20.9374] }
  },
  {
    _id: "2",
    name: "Suresh Kumar",
    categories: "Plumber",
    rating: 4.2,
    address: "456 Lane, Amravati, Maharashtra",
    profileImage: plumber ,
    description: "Leaking pipes and bathroom fittings expert.",
    location: { coordinates: [77.7800, 20.9380] }
  },
  {
    _id: "3",
    name: "Ravi Sharma",
    categories: "Carpenter",
    rating: 4.6,
    address: "12 Teakwood Street, Amravati, Maharashtra",
    profileImage: carpenter,
    description: "Skilled carpenter for furniture and wood repairs.",
    location: { coordinates: [77.7812, 20.9391] }
  },
  {
    _id: "4",
    name: "Anil Patil",
    categories: "Painter",
    rating: 4.4,
    address: "88 Color Lane, Amravati, Maharashtra",
    profileImage: painter,
    description: "Interior and exterior painting specialist.",
    location: { coordinates: [77.7825, 20.9402] }
  },
  {

    _id: "5",
    name: "Mahesh Verma",
    categories: "Driver",
    rating: 4.7,
    address: "27 Route View Road, Amravati, Maharashtra",
    profileImage: driver,
    description: "Experienced local driver for city and outstation travel.",
    location: { coordinates: [77.7833, 20.9368] }
  },
  {
    _id: "6",
    name: "Sunita Joshi",
    categories: "Cook",
    rating: 4.5,
    address: "51 Spice Market Street, Amravati, Maharashtra",
    profileImage: cook,
    description: "Home-style cook for daily meals and small gatherings.",
    location: { coordinates: [77.7840, 20.9379] }
  },
  {
    _id: "7",
    name: "Savita More",
    categories: "Cleaner",
    rating: 4.3,
    address: "39 Fresh Breeze Lane, Amravati, Maharashtra",
    profileImage: cleaner,
    description: "Reliable cleaner for homes and office spaces.",
    location: { coordinates: [77.7851, 20.9387] }
  },
  {
    _id: "8",
    name: "Arjun Deshmukh",
    categories: "AC Mechanic",
    rating: 4.8,
    address: "73 Cooling Point Street, Amravati, Maharashtra",
    profileImage: acMechanic,
    description: "AC installation, servicing, and repair expert.",
    location: { coordinates: [77.7860, 20.9395] }
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
