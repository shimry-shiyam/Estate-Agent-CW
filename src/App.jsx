import { useState } from 'react';
import data from './data/properties.json';

function App() {
  const [properties] = useState(data.properties);

  return (
    <div className="App">
      <h1>Estate Agent App</h1>
      <p>Loaded {properties.length} properties from JSON</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {properties.map(property => (
          <div key={property.id} style={{ border: '8px solid #ccc', padding: '10px' }}>
            <img src={property.picture} alt={property.type} style={{ width: '100%' }} />
            <h3>{property.type} - LKR {property.price.toLocaleString()}</h3>
            <p>{property.location}</p>
            <p>{property.bedrooms} Bedrooms</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;