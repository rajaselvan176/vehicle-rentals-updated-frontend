import React, { useState, useEffect } from "react";
import axios from "axios";
import VehicleCard from "../components/VehicleCard";

const VehicleList = ({ userId }) => {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    priceMin: 0,
    priceMax: 10000,
  });

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get("/api/vehicles");
        setVehicles(response.data);
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    fetchVehicles();
  }, []);

  const filteredVehicles = vehicles.filter((vehicle) => {
    return (
      (filters.type ? vehicle.type.toLowerCase() === filters.type.toLowerCase() : true) &&
      (filters.location
        ? vehicle.location.toLowerCase().includes(filters.location.toLowerCase())
        : true) &&
      vehicle.pricePerDay >= filters.priceMin &&
      vehicle.pricePerDay <= filters.priceMax
    );
  });

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Available Vehicles</h1>

      {/* 🔍 Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div>
          <label className="block text-sm font-semibold">Type</label>
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="border px-3 py-1 rounded w-48"
          >
            <option value="">All</option>
            <option value="SUV">SUV</option>
            <option value="Van">Van</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold">Location</label>
          <input
            type="text"
            placeholder="Enter your location"
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="border px-3 py-1 rounded w-48"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Min Price</label>
          <input
            type="number"
            value={filters.priceMin}
            onChange={(e) =>
              setFilters({ ...filters, priceMin: parseInt(e.target.value) || 0 })
            }
            className="border px-3 py-1 rounded w-24"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Max Price</label>
          <input
            type="number"
            value={filters.priceMax}
            onChange={(e) =>
              setFilters({ ...filters, priceMax: parseInt(e.target.value) || 10000 })
            }
            className="border px-3 py-1 rounded w-24"
          />
        </div>

          {/* 🎯 Clear Filters Button */}
  <div className="mt-4 sm:mt-0">
    <button
      onClick={() =>
        setFilters({ type: "", location: "", priceMin: 0, priceMax: 10000 })
      }
      className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
    >
      Clear Filters
    </button>
  </div>
      </div>

      {/* 🚗 Vehicles Display */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.length > 0 ? (
          filteredVehicles.map((vehicle) => (
            <VehicleCard key={vehicle._id} vehicle={vehicle} userId={userId} />
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-3">No vehicles found.</p>
        )}
      </div>
    </div>
  );
};

export default VehicleList;
