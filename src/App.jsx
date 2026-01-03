import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import data from './data/properties.json';
import SearchForm from './components/SearchForm';
import PropertyPage from './components/PropertyPage';

function App() {
  // 1. STATE: We keep favourites here so it persists across pages
  const [favourites, setFavourites] = useState([]);

  // 2. HELPER: Add to favourites (Prevent Duplicates)
  const handleAddToFavourites = (property) => {
    // Check if it already exists
    if (!favourites.some(fav => fav.id === property.id)) {
      setFavourites([...favourites, property]);
    } else {
      alert("Property already in favourites!");
    }
  };

  // 3. HELPER: Remove from favourites
  const handleRemoveFromFavourites = (id) => {
    setFavourites(favourites.filter(fav => fav.id !== id));
  };

  // 4. HELPER: Clear all
  const handleClearFavourites = () => {
    setFavourites([]);
  };

  return (
    <BrowserRouter basename="/Estate-Agent-CW">
      <Routes>
        <Route
          path="/"
          element={
            <SearchPage
              favourites={favourites}
              onAdd={handleAddToFavourites}
              onRemove={handleRemoveFromFavourites}
              onClear={handleClearFavourites}
            />
          }
        />
        <Route
          path="/property/:id"
          element={
            <PropertyPage
              onAddToFavourites={handleAddToFavourites}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

// --- SEARCH PAGE COMPONENT (Now with Drag & Drop) ---
function SearchPage({ favourites, onAdd, onRemove, onClear }) {
  const initialData = data.properties ? data.properties : data;
  const [allProperties] = useState(initialData);
  const [filteredProperties, setFilteredProperties] = useState(initialData);

  const handleSearch = (criteria) => {
    const results = allProperties.filter(property => {
      const typeMatch = criteria.type === 'Any' || property.type === criteria.type;
      const bedMatch = criteria.bedrooms === 'Any' || property.bedrooms >= parseInt(criteria.bedrooms);
      const priceMatch = property.price >= criteria.minPrice && property.price <= criteria.maxPrice;
      return typeMatch && bedMatch && priceMatch;
    });
    setFilteredProperties(results);
  };

  // DRAG AND DROP LOGIC

  // When you start dragging a property Card
  const handleDragStart = (e, property) => {
    e.dataTransfer.setData("propertyId", property.id);
    e.dataTransfer.setData("source", "results"); // Mark where it came from
  };

  // When you drag over the Favourites Box (Must prevent default to allow dropping)
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // When you DROP into the Favourites Box
  const handleDrop = (e) => {
    e.preventDefault();
    const propertyId = e.dataTransfer.getData("propertyId");
    const property = allProperties.find(p => p.id === propertyId);
    if (property) {
      onAdd(property);
    }
  };

  return (
    <div>
      <header style={{ textAlign: 'center', marginBottom: '30px', padding: '20px', background: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Premium Estate Agents</h1>
      </header>

      {/* VIVA: "I used the 'app-container' class to control the responsive grid layout" */}
      <div className="app-container">

        {/* --- LEFT COLUMN: Search & Results --- */}
        <div>
          <SearchForm onSearch={handleSearch} />

          <h3 style={{ marginTop: 0 }}>Results: {filteredProperties.length} Properties</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
            {filteredProperties.map(property => (
              <div
                key={property.id}
                className="property-card" // New CSS class for styling
                draggable
                onDragStart={(e) => handleDragStart(e, property)}
              >
                <img
                  // FIX: Prepend the Base URL so it always finds the image
                  src={`${import.meta.env.BASE_URL}${property.picture}`}
                  alt={property.type}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem' }}>{property.type}</h3>
                  <h4 style={{ margin: '0 0 10px 0', color: '#27ae60' }}>LKR{property.price.toLocaleString()}</h4>
                  <p style={{ color: '#666' }}>📍 {property.location}</p>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <Link to={`/property/${property.id}`} style={{ flex: 1 }}>
                      <button style={{ width: '100%', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>View</button>
                    </Link>
                    <button
                      onClick={() => onAdd(property)}
                      style={{ flex: 1, padding: '10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Favourites Sidebar --- */}
        <div
          className="favourites-sidebar" // Class for mobile ordering
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{ background: 'white', padding: '20px', borderRadius: '10px', border: '2px dashed #ccc', height: 'fit-content' }}
        >
          <h3 style={{ marginTop: 0, color: '#d35400' }}>Favourites Zone</h3>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>Drag & Drop properties here</p>

          {favourites.length === 0 && <div style={{ padding: '20px', textAlign: 'center', background: '#f9f9f9', borderRadius: '5px', color: '#999' }}>List is empty</div>}

          {favourites.map(fav => (
            <div key={fav.id} style={{ background: '#fff', border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <img
                  // FIX: Prepend the Base URL here too
                  src={`${import.meta.env.BASE_URL}${fav.picture}`}
                  style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{fav.type}</div>
                  <div style={{ fontSize: '0.8rem', color: '#27ae60' }}>LKR{fav.price.toLocaleString()}</div>
                </div>
              </div>
              <button
                onClick={() => onRemove(fav.id)}
                style={{ background: '#ffeded', color: '#dc3545', border: '1px solid #ffcccc', borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                ✕
              </button>
            </div>
          ))}

          {favourites.length > 0 && (
            <button
              onClick={onClear}
              style={{ width: '100%', marginTop: '15px', padding: '10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Clear List
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;