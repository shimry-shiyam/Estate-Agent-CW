import { useState } from 'react';
import data from './data/properties.json';
import SearchForm from './components/SearchForm';

function App() {
  const [allProperties] = useState(data.properties);
  const [filteredProperties, setFilteredProperties] = useState(data.properties);

  const handleSearch = (criteria) => {
    const results = allProperties.filter(property => {
      // 1. Filter by Type
      const typeMatch = criteria.type === 'Any' || property.type === criteria.type;

      // 2. Filter by Bedrooms (Greater than or equal to selection)
      const bedMatch = criteria.bedrooms === 'Any' || property.bedrooms >= parseInt(criteria.bedrooms);

      // 3. Filter by Price (Between min and max)
      const priceMatch = property.price >= criteria.minPrice && property.price <= criteria.maxPrice;

      // All must be true to show the property
      return typeMatch && bedMatch && priceMatch;
    });

    setFilteredProperties(results);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50' }}>Premium Estates</h1>
      </header>

      {/* Search Section */}
      <SearchForm onSearch={handleSearch} />

      {/* Results Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h3>Results: {filteredProperties.length} Properties</h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' }}>
        {filteredProperties.length === 0 ? (
          <p>No properties found matching your criteria.</p>
        ) : (
          filteredProperties.map(property => (
            <div key={property.id} style={{ border: '1px solid #e1e1e1', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <img
                src={property.picture}
                alt={property.type}
                style={{ width: '100%', height: '220px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{property.type}</h3>
                  <span style={{ fontWeight: 'bold', color: '#27ae60', fontSize: '1.1rem' }}>£{property.price.toLocaleString()}</span>
                </div>
                <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '10px' }}>📍 {property.location}</p>
                <div style={{ display: 'flex', gap: '15px', color: '#555', fontSize: '0.9rem' }}>
                  <span>🛏 {property.bedrooms} Beds</span>
                  <span>📅 {property.dateAdded}</span>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#777', marginTop: '10px', lineHeight: '1.4' }}>
                  {property.description.substring(0, 80)}...
                </p>
                <button style={{ width: '100%', marginTop: '10px', padding: '10px', background: 'white', border: '1px solid #007bff', color: '#007bff', borderRadius: '5px', cursor: 'pointer' }}>
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;