// src/pages/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import baseURL from '../../../config/env.js'; 

const Index = () => {
  // Define state to store fetched data
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndices, setSelectedIndices] = useState([]); 

  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');



  useEffect(() => {

      const fetchProjects = async () => {
        try {
          const response = await axios.get(`${baseURL}/api/projects`);
          console.log('Fetched projects:', response.data);
          setProjects(response.data);
          setLoading(false)
        } catch (error) {
          console.error('Error fetching projects:', error);
          if (error.response) {
            console.error('Server responded with:', error.response.data);
            console.error('Status code:', error.response.status);
            console.error('Headers:', error.response.headers);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
          } else {
            console.error('Error setting up the request:', error.message);
          }
        }
      };
      
    fetchProjects();
  }, []); 

  const AddRow = (index) => {
    setSelectedIndices(prevSelectedIndices => {
      if (prevSelectedIndices.includes(index)) {
        return prevSelectedIndices.filter(i => i !== index);
      } else {
        return [...prevSelectedIndices, index];
      }
    });
  };

  const ClearAllSelected = () => {
    setSelectedIndices([])
  }


  return (
    <div className="page-wrapper">
      <h6> <b>Catalog control</b></h6>

      <div className="filter-container">
        <label>
          Year:
          <select className='ml-2' value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All</option>
            <option value="2022">2017</option>
            <option value="2023">2018</option>
            <option value="2024">2019</option>
            <option value="2024">2020</option>
            <option value="2024">2021</option>
            <option value="2024">2022</option>
            <option value="2024">2023</option>
            <option value="2024">2024</option>
            <option value="2024">2025</option>
          </select>
        </label>
        <label>
          Country:
          <select className='ml-2'  value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="">All</option>
            <option value="SE">Sweden</option>
            <option value="NO">Norway</option>
            <option value="DK">Denmark</option>
            <option value="FI">Finland</option>
            <option value="DE">Germany</option>
          </select>
        </label>
        <label>
          Status:
          <select className='ml-2'  value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="">New</option>
            <option value="">D2/Exported</option>
            <option value="">Archived</option>
            <option value="">CWS ready</option>
          </select>
        </label>
      </div>

      <div className="scrollable-table-wrapper">

        <table className="result_table">
          <thead >
            <tr>
              {/* Conditionally render a column for developers */}
              {/* false && <th></th> */} {/* Replace 'false' with your condition */}
              <th>Project</th>
              <th>D2</th>
              <th>Orders</th>
              <th>New orders</th>
              <th>CWS type</th>
              <th>Last updated</th>
            </tr>
          </thead>

          {loading ? (
      <div style={{ padding: "3em 2em 3em 1em" }}>
          <h6 style={{ fontSize: "1em" }}>Loading table...</h6>
      </div>
  ) : (
              <tbody className="table-body">
            {projects.map((p, index) => (
              <tr 
                key={index} 
                data-has_d2={p.D2 ? '1' : '0'} 
                data-can_wrap={p.new_orders > 0 ? '1' : '0'} 
                style={{ backgroundColor: selectedIndices.includes(index) ? 'gray' : '' }}
                onClick={() => AddRow(index)}
              >                {/* Conditionally render a cell for developers */}
                {/* false && (
                  <td>
                    {/* Your developer links and buttons */}
                    {/* <pre style={{ display: 'none' }}>{JSON.stringify(p, null, 2)}</pre>
                    <a className="x_link_button" title="Open and edit this project in EBSS" href={`ebss:action=setwrapperdata|uuid=${p.data.uuid}`} target="_blank">
                      Open in EBSS
                    </a>
                    {p.new_orders > 0 && (
                      <a className="x_link_button" title="Send this project to CWS" href={`ebss:action=sendtowrapper|uuids=${p.data.uuid}`} target="_blank">
                        Send to CWS
                      </a>
                    )}
                  </td>
                )} */}
                <td data-uuid={p.uuid}>
                  {p.name}
                  {(!p.catalogues || p.catalogues.length === 0) && (
                    <span style={{ fontStyle: 'italic', color: 'grey', fontSize: '0.8em' }}>(No catalogues)</span>
                  )}
                </td>
                <td  >{p.D2 !== null ? p.D2 : '---'}</td>
                <td >{p.num_orders}</td>
                <td style={{ color: p.D2 !== null && p.new_orders > 0 ? 'red' : '' }}  >{p.D2 ? p.new_orders : p.num_orders}</td>
                <td >{p.production_type !== null ? p.production_type : '---'}</td>
                <td >{p.last_updated}</td>
              </tr>
            ))}
          </tbody>
            )}
        </table>

        
      </div>

      <div className='mt-3 d-flex justify-content-center' style={{ textAlign: "center" }}>
        <div>
         <h6 style={{ fontSize: "0.95em" }}>Amount selected: <br></br> <b>{selectedIndices.length}</b></h6>
         {selectedIndices.length > 0 && (
          <div>
            <button className='' onClick={ClearAllSelected}>Clear all</button>
         </div>
         )}
         </div>
      </div>
        
    </div>
  );
  
};

export default Index;
