// src/pages/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const NewsDetail = () => {
  // Define state to store fetched data
  const [data, setData] = useState(null);


  useEffect(() => {
    const fetchNetorders = async () => {
        const orderuuid = 'cbd4c667-69d4-4fd0-8deb-0f94d03cbaf6';
      try {
        const response = await axios.get(`http://localhost:3001/api/data/uuid/?orderuuid=${orderuuid}`);
        setData(response.data);
        console.log('Fetched net_orders:', response.data); 
      } catch (error) {
        console.error('Error fetching net_orders:', error);
      }
    };

    const fetchNeoactivites = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/neo_activities`);;
        console.log('Fetched neo_activities:', response.data); 
      } catch (error) {
        console.error('Error fetching neo_activities:', error);
      }
    };

    const fetchNeoProjects = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/neo_activities`);;
          console.log('Fetched neo_activities:', response.data); 
        } catch (error) {
          console.error('Error fetching neo_activities:', error);
        }
      };

      const fetchNetcatalogprojects = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/net_catalogue_projects`);;
          console.log('Fetched net_catalogue_projects:', response.data); 
        } catch (error) {
          console.error('Error fetching net_catalogue_projects:', error);
        }
      };
 
      const fetchNetCatalogOrders = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/net_catalogue_orders`);;
          console.log('Fetched net_catalogue_orders:', response.data); 
        } catch (error) {
          console.error('Error fetching net_catalogue_orders:', error);
        }
      };
      

    fetchNeoactivites();
    fetchNeoProjects();
    fetchNetCatalogOrders();
    fetchNetcatalogprojects();
    fetchNetorders(); 
  }, []); 

  return (
    <div className="page-wrapper">
      <h6>sdfsdfsdf</h6>
      {data && (
        <pre>
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      )}
    </div>
  );
};

export default NewsDetail;
