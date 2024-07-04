// src/pages/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTimes,
  faDownload,
  faSort,
  faCheck,
  faC,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { baseURL, apiUsername, apiPassword } from '../../../config/env.js';

import clearFilter from '../assets/images/clear-filter.png';

const Index = () => {
  // Define state to store fetched data
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [selectedData, setSelectedData] = useState([]);

  const [year, setYear] = useState('');
  const [country, setCountry] = useState('');
  const [status, setStatus] = useState('');
  const [isUnorderedList, setIsUnorderedList] = useState(true);
  const [searchString, setSearchString] = useState('');

  const [sortColumn, setSortColumn] = useState('last_updated'); // Initial sort column
  const [sortDirection, setSortDirection] = useState('desc'); // Initial sort direction

  const [showAddedRowMessage, setShowAddedRowMessage] = useState(false);
  const [showRemovedRowMessage, setShowRemovedRowMessage] = useState(false);

  const [errorMessageLivoniaButton, setErrorMessageLivoniaButton] = useState(false);
  const [errorMessageRunD2Button, setErrorMessageRunD2Button] = useState("");

  // const [disableButton, setDisableButton] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/projects`, {
        params: { year, country, status, isUnorderedList, searchString },
      });
      console.log('Fetched projects:', response.data);
      setProjects(response.data);
      setLoading(false);
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

  useEffect(() => {
    fetchProjects();
  }, [year, country, status, searchString, isUnorderedList]);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }

    const sortedProjects = [...projects].sort((a, b) => {
      if (column === 'production_type') {
        // Handle sorting for 'CWS type' column specifically
        if (sortDirection === 'asc') {
          if (a[column] === 'internal' && b[column] !== 'internal') return -1;
          if (a[column] !== 'internal' && b[column] === 'internal') return 1;
          return a[column] > b[column] ? 1 : -1;
        } else {
          if (a[column] === 'internal' && b[column] !== 'internal') return 1;
          if (a[column] !== 'internal' && b[column] === 'internal') return -1;
          return a[column] < b[column] ? 1 : -1;
        }
      } else {
        // Default sorting for other columns
        if (sortDirection === 'asc') {
          return a[column] > b[column] ? 1 : -1;
        } else {
          return a[column] < b[column] ? 1 : -1;
        }
      }
    });

    setProjects(sortedProjects);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

    // Function to check if any object in selectedData has D2 === null
    const checkD2Null = () => {
      let D2isNull = "";
      let NoneNulls = "";
      for (let i = 0; i < selectedData.length; i++) {
        if (selectedData[i].data.D2 === null) {
          D2isNull = true;
          console.log(selectedData[i]);
          // break; 
        } else if (selectedData[i].data.D2 !== null) {
          NoneNulls = true;
        }
      }
      if (D2isNull) {
        // setDisableButton(true);
        setErrorMessageLivoniaButton(true);
        // setErrorMessageRunD2Button(true);
        console.log('D2 is null: one or more items have D2 as null');
      } else {
        // setDisableButton(false);
        setErrorMessageLivoniaButton(false);
        // setErrorMessageRunD2Button(false);
        console.log('No nulls: no item has D2 as null');
      }

      if (NoneNulls) {
        setErrorMessageRunD2Button(true);
      }else{
        setErrorMessageRunD2Button(false);
      }
    };
    // useEffect to call checkD2Null whenever selectedData changes
    useEffect(() => {
      checkD2Null();
    }, [selectedData]);

  const AddRow = (index, data) => {
    console.log(index);
    console.log(data);

    setSelectedIndices((prevSelectedIndices) => {
      if (prevSelectedIndices.includes(index)) {
        return prevSelectedIndices.filter((i) => i !== index);
      } else {
        return [...prevSelectedIndices, index];
      }
    });
    console.log(selectedIndices);

    setSelectedData((prevSelectedData) => {
      if (selectedIndices.includes(index)) {
        // Remove data if index is already selected
        setShowRemovedRowMessage(true);
        setTimeout(() => {
          setShowRemovedRowMessage(false);
        }, 500);
        return prevSelectedData.filter((item) => item.index !== index);
      } else {
        setShowAddedRowMessage(true);
        setTimeout(() => {
          setShowAddedRowMessage(false);
        }, 500);
        // Add data if index is newly selected
        return [...prevSelectedData, { index, data }];
      }
    });
    console.log(selectedData);
  };

  const ClearAllSelected = () => {
    setSelectedIndices([]);
    setSelectedData([]);
    // setDisableButton(false);
    setShowRemovedRowMessage(true);
    setTimeout(() => {
      setShowRemovedRowMessage(false);
    }, 500);
  };

  const removeSelectedData = (indexToRemove) => {
    console.log('Index to remove:', indexToRemove);

    setShowRemovedRowMessage(true);
    setTimeout(() => {
      setShowRemovedRowMessage(false);
    }, 500);

    setSelectedData((prevSelectedData) =>
      prevSelectedData.filter((item) => item.index !== indexToRemove)
    );
    setSelectedIndices((prevSelectedIndices) =>
      prevSelectedIndices.filter((index) => index !== indexToRemove)
    );
  };

  const filterYear = (newValue) => {
    setYear(newValue);
    setSelectedIndices([]);
  };
  const filterCountry = (newValue) => {
    setCountry(newValue);
    setSelectedIndices([]);
  };
  const filterStatus = (newValue) => {
    setStatus(newValue);
    setSelectedIndices([]);
  };
  const handleSearchString = (search) => {
    setSearchString(search);
    setSelectedIndices([]);
  };
  const resetFilter = () => {
    setYear('');
    setCountry('');
    setStatus('');
    setSearchString('');
    setIsUnorderedList(true);
  };

  const handleCheckboxChange = () => {
    setIsUnorderedList(!isUnorderedList);
    console.log(isUnorderedList);
  };

  const runD2 = async () => {
    console.log("D2 triggered");

    try {
      // Using Promise.all to await all requests concurrently
      console.log(apiUsername, apiPassword)
      await Promise.all(selectedData.map(async (data) => {
        const job_uuid = data.data.uuid;
        console.log(job_uuid);
        
        try {
          const response = await axios.get(
            `https://shop.expressbild.se/api/v1/jobs/${job_uuid}/subjects`,
            {
              auth: {
                username: apiUsername,
                password: apiPassword
              },
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          // const responseArray = response.data
          // .filter(d => d.data_2 === "1")
          // console.log(responseArray);
          // return responseArray;

          const responseArray = response.data
          .filter(d => d.data_2 === "1")
          .map(item => ({
            data_2: item.data_2,
            orderuuid: item.uuid,
            subjectuuid: item.uuid,
            deliveryname: item.delivery_1.name,
            deliveryaddress: item.delivery_1.address,
            deliverypostalcode: item.delivery_1.postal_code,
            deliverycity: item.delivery_1.city,
            useremail: item.delivery_1.email_address,
            usermobile: item.delivery_1.mobile_phone,
            socialnumber: item.pid_number,
            subjectname: item.name,
            team: item.group,
            username: item.name,
          }));
          console.log(responseArray);
          return responseArray;

        } catch (error) {
          console.log("Error fetching data from Netlife: ", error);
        }
      }));
    } catch (error) {
      console.log("Error in runD2 function: ", error);
      return [];
    }
  };
  


  return (
    <div className="wrapper">
      <div className="page-wrapper">
        <h6>
          {' '}
          <b>Catalog control</b>
        </h6>

        <div className="filter-container">
          <label>
            Year:
            <select
              className="ml-2 select-box"
              value={year}
              onChange={(e) => filterYear(e.target.value)}
            >
              <option value="">All</option>
              <option value="2017">2017</option>
              <option value="2018">2018</option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
              <option value="2025">2025</option>
            </select>
          </label>
          <label>
            Country:
            <select
              className="ml-2 select-box"
              value={country}
              onChange={(e) => filterCountry(e.target.value)}
            >
              <option value="">All</option>
              <option value="2dba368b-6205-11e1-b101-0025901d40ea">
                Sweden
              </option>
              <option value="da399c45-3cf2-11ea-b287-ac1f6b419120">
                Norway
              </option>
              <option value="8d944c93-9de4-11e2-882a-0025901d40ea">
                Denmark
              </option>
              <option value="1cfa0ec6-d7de-11e1-b101-0025901d40ea">
                Finland
              </option>
              <option value="da399c45-3cf2-11ea-b287-ac1f6b419120">
                Germany
              </option>
            </select>
          </label>
          <label>
            Status:
            <select
              className="ml-2 select-box"
              value={status}
              onChange={(e) => filterStatus(e.target.value)}
            >
              <option value="">All</option>
              <option value="1">New</option>
              <option value="2">D2/Exported</option>
              <option value="3">Archived</option>
              <option value="">CWS ready</option>
            </select>
          </label>

          <div className="mt-1 mr-1 ml-2 checkbox-container">
            <input
              className="mr-2"
              type="checkbox"
              checked={isUnorderedList}
              onChange={handleCheckboxChange}
            />
            <label>Ordered list</label>
          </div>

          <div>
            <label>
              Search:
              <input
                placeholder="Search for project..."
                className="ml-2 seach-bar"
                value={searchString}
                onChange={(e) => handleSearchString(e.target.value)}
              ></input>
            </label>
          </div>
          <div>
            <img
              className="ml-4 clear-filter-button"
              src={clearFilter}
              alt="clear filter icon"
              icon={faTimes}
              onClick={() => resetFilter()}
              title="Clear filter"
            ></img>
          </div>
        </div>

        <div className="scrollable-table-wrapper">
          <table className="result-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('name')}>
                  Project (Results: {projects.length}){' '}
                  <FontAwesomeIcon icon={faSort} />
                </th>
                <th onClick={() => handleSort('D2')}>
                  D2 <FontAwesomeIcon icon={faSort} />
                </th>
                <th onClick={() => handleSort('num_orders')}>
                  Orders <FontAwesomeIcon icon={faSort} />
                </th>
                <th onClick={() => handleSort('new_orders')}>
                  New orders <FontAwesomeIcon icon={faSort} />
                </th>
                <th onClick={() => handleSort('production_type')}>
                  CWS type <FontAwesomeIcon icon={faSort} />
                </th>
                <th onClick={() => handleSort('last_updated')}>
                  Last updated <FontAwesomeIcon icon={faSort} />
                </th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan="6" style={{ padding: '3em 2em 3em 1em' }}>
                    <h6 style={{ fontSize: '1em' }}>Loading table...</h6>
                  </td>
                </tr>
              </tbody>
            ) : projects.length > 0 ? (
              <tbody className="table-body">
                {projects.map((p, index) => (
                  <tr
                    key={index}
                    data-has_d2={p.D2 ? '1' : '0'}
                    data-can_wrap={p.new_orders > 0 ? '1' : '0'}
                    style={{
                      backgroundColor: selectedIndices.includes(index)
                        ? '#ECFFE8'
                        : '',
                    }}
                    onClick={() => AddRow(index, p)}
                  >
                    <td data-uuid={p.uuid}>
                      {p.name}
                      {(!p.catalogues || p.catalogues.length === 0) && (
                        <span
                          style={{
                            fontStyle: 'italic',
                            color: 'grey',
                            fontSize: '0.8em',
                          }}
                        >
                          (No catalogues)
                        </span>
                      )}
                    </td>
                    <td title={p.D2 !== null ? formatDateTime(p.D2) : "null"}>
                      {p.D2 !== null ? (
                        <FontAwesomeIcon icon={faCheck} />
                      ) : (
                        '---'
                      )}
                    </td>
                    <td>{p.num_orders}</td>
                    <td
                      style={{
                        color: p.D2 !== null && p.new_orders > 0 ? 'red' : '',
                      }}
                    >
                      {p.D2 ? p.new_orders : p.num_orders}
                    </td>
                    <td>
                      {p.production_type !== null ? p.production_type : '---'}
                    </td>
                    <td>{formatDateTime(p.last_updated)}</td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td colSpan="6" style={{ padding: '2em 1em' }}>
                    No projects found
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>

        <div
          className="mt-3 d-flex justify-content-center"
          style={{ textAlign: 'center' }}
        >
          <div>
            <h6 style={{ fontSize: '1.2em' }}>
              Amount selected: <br></br> <b>{selectedData.length}</b>
            </h6>
            {selectedData.length > 0 && (
              <div>
                <button className="clearall-button" onClick={ClearAllSelected}>
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* selected data table */}
      {selectedData.length > 0 && (
        <div className="mt-3 selected-data-box">
          <table className="selected-data-table">
            <thead>
              <tr>
                <th></th>
                <th>Project ({selectedData.length})</th>
                <th>D2</th>
                <th>Orders</th>
                <th>New orders</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody className="selected-data-table-body">
              {selectedData.map((data) => (
                <tr key={data.data.uuid}>
                  <td>
                    <FontAwesomeIcon
                      className="remove-selected-data-button"
                      icon={faTimes}
                      onClick={() => removeSelectedData(data.index)}
                      title="Remove project"
                    />
                  </td>
                  <td data-uuid={data.data.uuid}>{data.data.name}</td>
                  <td title={data.data.D2 !== null ? formatDateTime(data.data.D2) : "null"} style={{ color: data.data.D2 === null ? 'red' : '' }}>
                    {data.data.D2 !== null ? (
                      <FontAwesomeIcon icon={faCheck} />
                    ) : (
                      '---'
                    )}
                  </td>
                  <td>{data.data.num_orders}</td>
                  <td>
                    {data.data.D2 ? data.data.new_orders : data.data.num_orders}
                  </td>
                  <td>
                    <button className="mr-2 table-button">Open in EBSS</button>
                  </td>
                  {/* <td>
                    <button className="mr-2 table-button">Send to Engine</button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <hr></hr>
            <button onClick={runD2} className="mr-2 button runD2" disabled={errorMessageRunD2Button} title={errorMessageRunD2Button ? "Some choosen projects has already been run by D2" : "Run D2"}>Run D2</button>
            <button className="mr-2 button">Send to Engine</button>
            <button className="button" disabled={errorMessageLivoniaButton} title={errorMessageLivoniaButton ? "At least one of your selected projects needs to be run by D2 in order to click 'Livonia'" : "Livonia"}>
              Livonia
            </button>
            {errorMessageLivoniaButton && (
              <div>
              <h6 className='mt-2' style={{ color: "black", fontSize: "0.9em" }} >Livonia button: Not all projects has been run by D2</h6>
              </div>
            )}
             {errorMessageRunD2Button && (
              <div>
              <h6 className='mt-2' style={{ color: "black", fontSize: "0.9em" }} >RunD2 button: Some choosen projects has already been run by D2</h6>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Showing alert message when removing and adding project to/from selected project list  */}
      {showAddedRowMessage && (
        <div
          className="alert-message"
          style={{ backgroundColor: '#C8FFAB', border: '0.5px solid green' }}
        >
          Project added
        </div>
      )}
      {showRemovedRowMessage && (
        <div
          className="alert-message"
          style={{ backgroundColor: '#FFBCAB', border: '0.5px solid red' }}
        >
          Project removed
        </div>
      )}
    </div>
  );
};

export default Index;
