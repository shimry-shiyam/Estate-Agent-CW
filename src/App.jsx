import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import data from './data/properties.json';
import SearchForm from './components/SearchForm';
import PropertyPage from './components/PropertyPage'; // Import your new file

// --- COMPONENT 1: The Search Page ---
function SearchPage() {
  // Safety check for data
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

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Estate Agent App</h1>
      </header>

      <SearchForm onSearch={handleSearch} />

      <div style={{ marginTop: '20px' }}>
        <h3>Results: {filteredProperties.length} Properties</h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
          {filteredProperties.map(property => (
            <div key={property.id} style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={property.picture} alt={property.type} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '15px' }}>
                <h3>{property.type}</h3>
                <h4 style={{ color: '#27ae60' }}>£{property.price.toLocaleString()}</h4>
                <p>📍 {property.location}</p>
                <p>🛏 {property.bedrooms} Beds</p>

                {/* VIVA NOTE: This Link is what takes us to the new page */}
                <Link to={`/property/${property.id}`}>
                  <button style={{ width: '100%', marginTop: '10px', padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    View Details
                  </button>
                </Link>

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT 2: The Main App (Traffic Controller) ---
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* If URL is /, show SearchPage */}
        <Route path="/" element={<SearchPage />} />

        {/* If URL is /property/something, show PropertyPage */}
        <Route path="/property/:id" element={<PropertyPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;