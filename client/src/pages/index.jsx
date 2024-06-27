// src/pages/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsDetail = () => {
  // Define state to store fetched data
  const [data, setData] = useState(null);

  // Use useEffect to fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
        const orderuuid = 'cbd4c667-69d4-4fd0-8deb-0f94d03cbaf6';
      try {
        const response = await axios.get(`http://localhost:3001/api/data/uuid/?orderuuid=${orderuuid}`);
        setData(response.data);
        console.log('Fetched data:', response.data); // Log fetched data to the console
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(); // Call the fetchData function
  }, []); // Empty dependency array ensures useEffect runs only once on component mount

  return (
    <div className="page-wrapper">
      <h6>sdfsdfsdf</h6>
      {/* Display fetched data */}
      {data && (
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )}
    </div>
  );
};

export default NewsDetail;
