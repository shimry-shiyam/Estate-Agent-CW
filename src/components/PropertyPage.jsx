import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css'; //Importing CSS for tabs
import { FaArrowLeft } from 'react-icons/fa'; //Adding an arrow icon
import data from '../data/properties.json';

function PropertyPage({ onAddToFavourites }) {
    const { id } = useParams(); //Get the ID from the URL

    //Handling data safety
    const allProperties = data.properties ? data.properties : data;
    const property = allProperties.find(p => p.id === id);

    //State for the Gallery
    const [mainImage, setMainImage] = useState(property ? property.picture : '');
    if (!property) return <div style={{ padding: 20 }}>Property not found</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '20px auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>

            {/* Back Button */}
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <FaArrowLeft style={{ marginRight: '5px' }} /> Back to Search
            </Link>

            {/* GALLERY SECTION */}
            <div style={{ marginBottom: '30px' }}>
                <img
                    // FIX: Add the Base URL
                    src={`${import.meta.env.BASE_URL}${mainImage}`}
                    alt={property.type}
                    style={{ width: '100%', height: '500px', objectFit: 'cover', borderRadius: '10px' }}
                />

                {/* Thumbnails */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', overflowX: 'auto' }}>
                    {property.images && property.images.map((img, index) => (
                        <img
                            key={index}
                            // FIX: Add the Base URL
                            src={`${import.meta.env.BASE_URL}${img}`}
                            alt="thumbnail"
                            onClick={() => setMainImage(img)}
                            style={{
                                width: '100px', height: '80px', objectFit: 'cover',
                                cursor: 'pointer', borderRadius: '5px',
                                border: mainImage === img ? '3px solid #007bff' : '1px solid #ccc'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/*TABS SECTION*/}
            <div>
                <h1>{property.type} in {property.location}</h1>
                <h2 style={{ color: '#27ae60' }}>LKR {property.price.toLocaleString()}</h2>

                {/* Adding a 'save to fav.' button */}
                <button
                    onClick={() => {
                        onAddToFavourites(property);
                        alert('Added to favourites');
                    }}
                    style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
                >
                    Add to Favourites
                </button>
                <Tabs style={{ marginTop: '20px' }}>
                    <TabList>
                        <Tab>Description</Tab>
                        <Tab>Floor Plan</Tab>
                        <Tab>Map</Tab>
                    </TabList>

                    <TabPanel>
                        <h3>Property Details</h3>
                        <p style={{ lineHeight: '1.6' }}>{property.description}</p>
                    </TabPanel>

                    <TabPanel>
                        <h3>Floor Plan</h3>
                        <div style={{ background: '#f4f4f4', padding: '50px', textAlign: 'center', borderRadius: '10px' }}>
                            <p>Floor Plan Image</p>
                        </div>
                    </TabPanel>

                    <TabPanel>
                        <h3>Location</h3>
                        {/* Simple Google Map Embed */}
                        <iframe
                            width="100%" height="400" style={{ border: 0, borderRadius: '10px' }} loading="lazy"
                            src={`https://maps.google.com/maps?q=${property.location}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                        ></iframe>
                    </TabPanel>
                </Tabs>
            </div>
        </div>
    );
}

export default PropertyPage;