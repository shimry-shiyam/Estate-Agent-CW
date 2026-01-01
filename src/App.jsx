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
    <BrowserRouter>
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

  // --- DRAG AND DROP LOGIC (VIVA: Native HTML5 API) ---

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
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Estate Agent App</h1>
      </header>

      {/* GRID LAYOUT: Left (Search/Results) - Right (Favourites) */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '20px' }}>

        {/* --- LEFT COLUMN: Search & Results --- */}
        <div>
          <SearchForm onSearch={handleSearch} />

          <h3>Results: {filteredProperties.length} Properties</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
            {filteredProperties.map(property => (
              <div
                key={property.id}
                draggable // Enable dragging
                onDragStart={(e) => handleDragStart(e, property)} // Start drag
                style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden', cursor: 'grab' }}
              >
                <img src={property.picture} alt={property.type} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                <div style={{ padding: '10px' }}>
                  <h4>{property.type} - £{property.price.toLocaleString()}</h4>
                  <Link to={`/property/${property.id}`}>
                    <button style={{ padding: '5px 10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '3px' }}>View</button>
                  </Link>
                  {/* Heart Button (Requirement: Add by button) */}
                  <button
                    onClick={() => onAdd(property)}
                    style={{ marginLeft: '10px', padding: '5px 10px', background: '#28a745', color: 'white', border: 'none', borderRadius: '3px' }}
                  >
                    ♥ Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- RIGHT COLUMN: Favourites Sidebar (Drop Zone) --- */}
        <div
          onDragOver={handleDragOver} // Allow dropping here
          onDrop={handleDrop}         // Handle the drop
          style={{ background: '#f8f9fa', padding: '15px', borderRadius: '10px', border: '2px dashed #ccc', height: 'fit-content' }}
        >
          <h3 style={{ marginTop: 0 }}>Favourites (Drag Here)</h3>

          {favourites.length === 0 && <p style={{ color: '#999' }}>Drag properties here to save them.</p>}

          {favourites.map(fav => (
            <div key={fav.id} style={{ background: 'white', padding: '10px', marginBottom: '10px', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{fav.type}</div>
                <div style={{ fontSize: '0.8rem' }}>£{fav.price.toLocaleString()}</div>
              </div>
              {/* Remove Button */}
              <button
                onClick={() => onRemove(fav.id)}
                style={{ background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
              >
                X
              </button>
            </div>
          ))}

          {favourites.length > 0 && (
            <button
              onClick={onClear}
              style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}
            >
              Clear Favourites
            </button>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;