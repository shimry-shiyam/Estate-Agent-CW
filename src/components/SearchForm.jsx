import { useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function SearchForm({ onSearch }) {
    const [type, setType] = useState('Any');
    const [bedrooms, setBedrooms] = useState('Any');
    const [priceRange, setPriceRange] = useState([0, 1500000]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({
            type,
            bedrooms,
            minPrice: priceRange[0],
            maxPrice: priceRange[1],
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{
            padding: '20px',
            backgroundColor: 'rgb(236, 230, 230)',
            borderRadius: '10px',
            marginBottom: '30px'
        }}>
            <h3>Filter Properties</h3>

            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                {/* Type Dropdown */}
                <div style={{ flex: 1 }}>
                    {/* htmlFor connects to the ID below */}
                    <label htmlFor="typeSelect" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Type</label>
                    <select
                        id="typeSelect" // Added ID
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                    >
                        <option value="Any">Any</option>
                        <option value="House">House</option>
                        <option value="Flat">Flat</option>
                    </select>
                </div>

                {/* Bedrooms Dropdown */}
                <div style={{ flex: 1 }}>
                    {/* htmlFor connects to the ID below */}
                    <label htmlFor="bedSelect" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Min Bedrooms</label>
                    <select
                        id="bedSelect" // Added ID
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value)}
                        style={{ width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
                    >
                        <option value="Any">Any</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4+</option>
                    </select>
                </div>
            </div>

            {/* Price Slider */}
            <div style={{ marginTop: '20px', marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                    Price Range: LKR {priceRange[0].toLocaleString()} - LKR {priceRange[1].toLocaleString()}
                </label>
                <div style={{ padding: '0 10px' }}>
                    <Slider
                        range
                        min={0}
                        max={2000000}
                        step={10000}
                        defaultValue={[0, 1500000]}
                        onChange={(val) => setPriceRange(val)}
                        trackStyle={[{ backgroundColor: '#007bff' }]}
                        handleStyle={[{ borderColor: '#007bff' }, { borderColor: '#007bff' }]}
                    />
                </div>
            </div>

            <button type="submit" style={{
                width: '100%',
                padding: '12px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer'
            }}>
                Search Properties
            </button>

        </form>
    );
}

export default SearchForm;