// src/pages/NewsDetail.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios, { Axios } from 'axios';

import { library } from '@fortawesome/fontawesome-svg-core';
import {
	faTimes,
	faDownload,
	faSort,
	faCheck,
	faC,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RingLoader } from 'react-spinners';

import {
	baseURL,
	apiUsername,
	apiPassword,
	apiUsernameSE,
	apiUsernameFI,
	apiUsernameNO,
	apiUsernameDK,
	apiUsernameDE,
	apiPasswordGeneral,
	ocrreserveToken,
} from '../../../config/env.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//importet images
import clearFilter from '../assets/images/clear-filter.png';

//imported css files
import "../assets/css/buttons.css"

const Index = () => {
	// Define state to store fetched data
	const [projects, setProjects] = useState([]);
	
	const [loading, setLoading] = useState(false);
	const [loadingD2, setLoadingD2] = useState(false);
	const [loadingLivonia, setLoadingLivonia] = useState(false);
	const [loadingSendToEngine, setLoadingSendToEngine] = useState(false);
	
	const [processedCount, setProcessedCount] = useState(0);
	
	const [selectedIndices, setSelectedIndices] = useState([]);
	const [selectedData, setSelectedData] = useState([]);
	// const [selectedData2, setSelectedData2] = useState([]);
	const [updatedData, setUpdatedData] = useState([]);
	const [updatedDataMessage, setUpdatedDataMessage] = useState([]);
	const [updatedDataLength, setUpdatedDataLength] = useState(0);
	const [updatedDataMessageLivonia, setUpdatedDataMessageLivonia] = useState([]);
	const [updatedDataLivoniaLength, setUpdatedDataLivoniaLength] = useState(0);
	const [updatedDataMessageSendToEngine, setUpdatedDataMessageSendToEngine] = useState([]);
	const [updatedDataSendToEngineLength, setUpdatedDataSendToEngineLength] = useState(0);
	const [uuidArray, setUuidArray] = useState([]);

	const [isProcessingComplete, setIsProcessingComplete] = useState(false);

	const [csvDataHolder, setCsvDataHolder] = useState([]);
	const [isSeparateCSV, setIsSeparateCSV] = useState(false);

	const [year, setYear] = useState('');
	const [country, setCountry] = useState('');
	const [status, setStatus] = useState('');
	const [isUnorderedList, setIsUnorderedList] = useState(true);
	const [searchString, setSearchString] = useState('');

	const [sortColumn, setSortColumn] = useState('last_updated');
	const [sortDirection, setSortDirection] = useState('desc');

	const [showAddedRowMessage, setShowAddedRowMessage] = useState(false);
	const [showRemovedRowMessage, setShowRemovedRowMessage] = useState(false);
	const [showD2SuccessMessage, setShowD2SuccessMessage] = useState(false);
	const [showErrorLivoniaMessage, setShowErrorLivoniaMessage] = useState(false);
	const [showSuccessLivoniaMessage, setShowSuccessLivoniaMessage] = useState(false);

	const [refreshProjects, setRefreshProjects] = useState(false);

	const [triggerSource, setTriggerSource] = useState(false);

	const [errorMessageLivoniaButton, setErrorMessageLivoniaButton] = useState(false);
	const [errorMessageRunD2Button, setErrorMessageRunD2Button] = useState('');

	//import useNavigate
	const navigate = useNavigate();


	// method to fetch all projects from database
	const fetchProjects = async () => {
		setLoading(true);
		try {
			const response = await axios.get(`${baseURL}/api/projects`, {
				params: { year, country, status, isUnorderedList, searchString },
			});
			console.log('Fetched projects:', response.data);
			setProjects(response.data);
			setLoading(false);

			//  // Map UUIDs to projects and include a data array
			//  const matchingProjects = uuidArray.map(uuid => {
			//   const project = response.data.find(project => project.uuid === uuid)
			//   return {
			//     data: {
			//       ...project,
			//     },
			//   };
			// });
			// console.log("Recent updated data:", matchingProjects);
			// setSelectedData(matchingProjects);
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
	}, [year, country, status, searchString, isUnorderedList, refreshProjects]);
	// }, [year, country, status, searchString, isUnorderedList]);



	//---------------------------------------- D2 FUNCTION ----------------------------------------

	const runD2 = async () => {
		console.log('-----------------------------');
		console.log('-----------------------------');
		console.log('D2 TRIGGERED');
		console.log('-----------------------------');
		console.log('-----------------------------');
		setLoadingD2(true);
		setUuidArray([]);

		try {
			// Using Promise.all to await all requests concurrently
			await Promise.all(
				selectedData.map(async (data) => {
					const job_uuid = data.data.uuid;
					// console.log(data.data.uuid)
					// console.log(data.data.portaluuid)
					// console.log(data.data)

					let response; 

					try {
						if (
							data.data.portaluuid === '2dba368b-6205-11e1-b101-0025901d40ea'
						) {
							// Sweden
							response = await axios.get(
								`https://shop.expressbild.se/api/v1/jobs/${job_uuid}/subjects`,
								{
									auth: {
										username: apiUsername,
										password: apiPassword,
									},
									headers: {
										'Content-Type': 'application/json',
									},
								}
							);
						} else if (
							data.data.portaluuid === 'f41d5c48-5af3-94db-f32d-3a51656b2c53'
						) {
							// Norway
							response = await axios.get(
								`https://shop.fotoexpressen.no/api/v1/jobs/${job_uuid}/subjects`,
								{
									auth: {
										username: apiUsernameNO,
										password: apiPasswordGeneral,
									},
									headers: {
										'Content-Type': 'application/json',
									},
								}
							);
						} else if (
							data.data.portaluuid === '8d944c93-9de4-11e2-882a-0025901d40ea'
						) {
							// Denmark
							response = await axios.get(
								`https://shop.billedexpressen.dk/api/v1/jobs/${job_uuid}/subjects`,
								{
									auth: {
										username: apiUsernameDK,
										password: apiPasswordGeneral,
									},
									headers: {
										'Content-Type': 'application/json',
									},
								}
							);
						} else if (
							data.data.portaluuid === '1cfa0ec6-d7de-11e1-b101-0025901d40ea'
						) {
							// Finland
							response = await axios.get(
								`https://shop.expresskuva.fi/api/v1/jobs/${job_uuid}/subjects`,
								{
									auth: {
										username: apiUsernameFI,
										password: apiPasswordGeneral,
									},
									headers: {
										'Content-Type': 'application/json',
									},
								}
							);
						} else if (
							data.data.portaluuid === 'da399c45-3cf2-11ea-b287-ac1f6b419120'
						) {
							// Germany
							response = await axios.get(
								`https://shop.bildexpressen.de/api/v1/jobs/${job_uuid}/subjects`,
								{
									auth: {
										username: apiUsernameDE,
										password: apiPasswordGeneral,
									},
									headers: {
										'Content-Type': 'application/json',
									},
								}
							);
						}

						if (response) {
							const responseArray = response.data
								.filter((d) => d.data_2 === '1')
								.map((item) => ({
									job_uuid: job_uuid,
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
							console.log(
								'Netlife response array: ',
								responseArray,
								'Length array: ',
								responseArray.length
							);
							if (responseArray.length > 0) {
								await fetchNeoProjectsForOrders(responseArray);
							} else {
								console.log(
									'Error: Netlife response array length < 1 ',
									responseArray
								);
							}
						} else {
							console.log('No response: ', response);
							console.log('No response received for job_uuid:', job_uuid);
							// uppdateNetCatalogueProjects(responseArray)

							setLoadingD2(false)
						}
					} catch (error) {
						console.log('Error fetching data from Netlife: ', error);
					}
				})
			);
		} catch (error) {
			console.log('Error in runD2 function: ', error);
			return [];
		} 
	};

	//fetch neo_projects and update responseArray
	const fetchNeoProjectsForOrders = async (responseArray) => {
		if (responseArray.length === 0) return; // Skip if responseArray is empty

		try {
			const response = await axios.get(`${baseURL}/api/neo_projects`);
			// console.log('Fetched neo_projects:', response.data);
			responseArray.forEach((item) => {
				const matchingProject = response.data.find(
					(project) => project.uuid === item.job_uuid
				);
				if (matchingProject) {
					// console.log("MATCHED!!!")
					item.projectname = matchingProject.name; // Add projectName
					// Parse catalogues JSON string
					try {
						const catalogues = JSON.parse(matchingProject.catalogues);
						item.catalogues = catalogues.map((catalogue) => ({
							name: catalogue.name,
							price: catalogue.price,
							vatvalue: catalogue.price - catalogue.price * 0.9434,
						}));
					} catch (error) {
						console.error('Error parsing catalogues JSON:', error);
					}
				} else {
					console.log(`No match found for orderuuid: ${item.jobuuid}`);
				}
			});
			fetchCatalogProjects(responseArray);
			// console.log('Updated responseArray:', responseArray);
		} catch (error) {
			console.error('Error fetching neo_projects:', error);
		}
	};


	//fetch net_cataloue_projects and update responseArray
	const fetchCatalogProjects = async (responseArray) => {
		if (responseArray.length === 0) return; // Skip if responseArray is empty
		
		try {
			// Fetch net_catalogue_projects data
			const response = await axios.get(`${baseURL}/api/net_catalogue_projects`);

			// console.log('Fetched net_catalogue_projects:', response.data);

			// Update responseArray with portaluuid and uuid based on matching orderuuid
			responseArray.forEach((item) => {
				const matchingProject = response.data.find(
					(project) => project.uuid === item.job_uuid
				);
				if (matchingProject) {
					item.portaluuid = matchingProject.portaluuid;
					item.project_id = matchingProject.uuid;
				} else {
					console.log(`No match found for orderuuid: ${item.orderuuid}`);
				}
			});

			saveJoinedArray(responseArray);
			// console.log('Updated responseArray:', responseArray);
		} catch (error) {
			console.error('Error fetching net_catalogue_projects:', error);
		}
	};

	const saveJoinedArray = (responseArray) => {
		const allItemsHaveProjectIdAndCatalogues = responseArray.every(
			(item) => item.project_id && item.catalogues
		);
		if (allItemsHaveProjectIdAndCatalogues) {
			console.log('FINAL RESPONSE ARRAY', responseArray);
			addTuppleToNetCatalogueOrders(responseArray);
		} else {
			console.log(
				'ERROR JOINING AND WILL NOT PROCEED TO ADD TUPLE TO NET_CATALOGUES_ORDER'
			);
		}
	};

	// Function to add tuples to net_catalogue_orders
	const addTuppleToNetCatalogueOrders = async (responseArray) => {
		const batchSize = 100;

		try {
			// Fetch existing subjectUUIDs
			const existingSubjectUUIDs = await fetchExistingProjects(responseArray);
			console.log('fetchExistingProjects: ', existingSubjectUUIDs);

			// Filter responseArray for items with subjectUUIDs not in existingSubjectUUIDs
			const newOrders = responseArray.filter(
				(item) => !existingSubjectUUIDs.includes(item.subjectuuid)
			);
			console.log('New orders: ', newOrders, "New orders length:", newOrders.length);

			let startIndex = 0;
			if (newOrders.length > 0) {
				while (startIndex < newOrders.length) {
					const batch = newOrders.slice(startIndex, startIndex + batchSize);

					const responseAddTuppel = await axios.post(
						`${baseURL}/api/net_catalogue_orders`,
						batch
					);

					// const insertedOrders = responseAddTuppel.data.insertedOrders;
					// const message = responseAddTuppel.data.message;
					// const insertedOrdersAmount = responseAddTuppel.data.insertedOrders.length;

					console.log(responseAddTuppel);
					const insertedOrders = responseAddTuppel.data?.insertedOrders || [];
					const message = responseAddTuppel.data?.message || '';
					const insertedOrdersAmount = insertedOrders.length || 0;

					console.log(insertedOrders.length); 
					console.log(responseAddTuppel);
					console.log(responseAddTuppel.data.message);
					// console.log(responseAddTuppel.data.insertedOrders.length);
					console.log('insertedOrdersAmount', insertedOrdersAmount);
					if (insertedOrders.length > 0) {
						// Create an object with job_uuid and message
						const messageObject = {
							job_uuid: insertedOrders[0].job_uuid,
							message: message,
							insertedOrdersAmount: insertedOrdersAmount,
							dateTime: new Date().toLocaleString(),
							selectedData:
								selectedData.find(
									(data) =>
										data.data.uuid ===
										responseAddTuppel.data.insertedOrders[0].job_uuid
								) || {},
						};
						console.log(messageObject);

						//update message with data to display on interface
						setUpdatedDataMessage((prevState) => {
							const existingIndex = prevState.findIndex(
								(item) => item.job_uuid === messageObject.job_uuid
							);
					
							if (existingIndex !== -1) {
								const updatedMessages = [...prevState];
								updatedMessages[existingIndex] = {
									...updatedMessages[existingIndex],
									insertedOrdersAmount: updatedMessages[existingIndex].insertedOrdersAmount + insertedOrdersAmount,
								};
								return updatedMessages; 
							} else {
								return [...prevState, messageObject]; 
							}
						});
						console.log(
							`Successfully sent batch of ${batch.length} and ${responseAddTuppel.data.insertedOrders.length} tuples were inserted`,
							responseAddTuppel
						);
					} else {
						const messageObject = {
							job_uuid: newOrders[0].job_uuid,
							message: message,
							insertedOrdersAmount: 0,
							dateTime: new Date().toLocaleString(),
							selectedData:
								selectedData.find(
									(data) =>
										data.data.uuid ===
										newOrders[0].job_uuid
								) || {},
						};
						console.log(messageObject);
						// setUpdatedDataMessage((prevState) => [...prevState, messageObject]);
						//update message with data to display on interface
						setUpdatedDataMessage((prevState) => {
							const existingIndex = prevState.findIndex(
								(item) => item.job_uuid === messageObject.job_uuid
							);
					
							if (existingIndex !== -1) {
								const updatedMessages = [...prevState];
								updatedMessages[existingIndex] = {
									...updatedMessages[existingIndex],
									insertedOrdersAmount: updatedMessages[existingIndex].insertedOrdersAmount + insertedOrdersAmount,
								};
								return updatedMessages; 
							} else {
								return [...prevState, messageObject]; 
							}
						});
						console.log(
							`Successfully sent batch of ${batch.length} but no information about inserted orders was provided`,
							responseAddTuppel
						);
					}
					startIndex += batchSize;
				}
			} else {
				console.log("Neworders.length is 0, no new orders to insert");
				// uppdateNetCatalogueProjects(responseArray)
			}
			uppdateNetCatalogueProjects(responseArray);
			console.log('All tuples added successfully!');
			console.log('---');
		} catch (error) {
			console.error('Error adding tuples to net_catalogue_order', error);
			// setLoadingD2(false);
		}
	};


	// Function to fetch existing subjectUUIDs from net_catalogue_orders
	const fetchExistingProjects = async (responseArray) => {
		try {
			console.log("project_id: ", responseArray[0].project_id)
			const response = await axios.get(
				`${baseURL}/api/net_catalogue_orders`,
				{
					params: {
						project_id: responseArray[0].project_id,
					},
				}
			);
			console.log('fetchExistingProjects response array: ', response);
			return response.data;
		} catch (error) {
			console.error('Error fetching existing projects:', error);
			return [];
		}
	};

	//update field status and D2 in net_catalogue_projects
	const uppdateNetCatalogueProjects = async (responseArray) => {
		console.log(
			'project_id sent to net_catalogue_projects',
			responseArray[0].job_uuid
		);
		try {
			const updatePromises = responseArray.map((item) =>
				axios.post(`${baseURL}/api/net_catalogue_projects`, {
					project_id: item.job_uuid,
				})
			);
			await Promise.all(updatePromises);
			setProcessedCount((prevCount) => prevCount + 1);
			// finishD2();
		} catch (error) {
			console.error('Error updating net_catalogue_projects', error);
			// setLoadingD2(false);
		}
	};


	useEffect(() => {
		if (processedCount === selectedData.length && selectedData.length > 0) {
			finishD2();
		}
	}, [processedCount, selectedData.length]);


	const finishD2 = () => {
		console.log('All objects have been processed. Triggering finishD2.');
		console.log('---');
		setUpdatedDataMessageLivonia([]);
		setUpdatedDataMessageSendToEngine([]);

		setProcessedCount(0);
		setUpdatedData(selectedData);
		setUpdatedDataLivoniaLength(0);
		setUpdatedDataSendToEngineLength(0);

		setSearchString('');
		setRefreshProjects(!refreshProjects);
		setTimeout(() => {
			setLoadingD2(false);
			setUpdatedDataLength((prevState) => prevState + selectedData.length);
			setSelectedData([]);
			setSelectedIndices([]);
		}, 1000);
		// setShowD2SuccessMessage(true);
		// setTimeout(() => {
		// 	setShowD2SuccessMessage(false);
		// }, 2000);
		toast.success(`D2: D2 has run successfully!`);


		console.log("updatedDataMessage: (after D2 triggered and run)", updatedDataMessage);
		console.log("updatedDataMessage.selectedData: (after D2 triggered and run)", updatedDataMessage.map((data) => data.selectedData));
	};




	 //---------------------------------------- LIVONIA FUNCTION  ----------------------------------------

	const runLivonia = async (data) => {
		console.log('-----------------------------');
		console.log('-----------------------------');
		console.log('LIVONIA TRIGGGERED');
		console.log('-----------------------------');
		console.log('-----------------------------');
		console.log('selectedData', data);

		//loopa igenom selecteddata (data) och plocka ut varje tuppel från net_catalogue_orders
		for (const item of data) {
			let project_id = item.data.uuid;
			console.log(`project_id of index ${item.index}:` , project_id);
			let orders = [];
			try {
				const response = await axios.get(
					`${baseURL}/api/net_catalogue_orders/livonia`,
					{
						params: {
							project_id: project_id
						},
					}
				); 
				// console.log('Response', response.data);
				orders = response.data;       
				console.log('amount orders', orders.length);

				//If orders are 0, print error
				if (orders.length === 0) {
					console.log("There are no current orders to process!");
					toast.error("Livonia Error: There are no current orders to process");
					setLoadingLivonia(false);
					return;
				} else {
					setLoadingLivonia(true);
				}

				//Array to hold CSV data
				let csvData = [
					["ExternalId", "Co", "Belopp", "Subject Namn", "Namn", "Adress", "Postnr", "Ort", "Projekt", "Lag"]
				]

				//Anropar REST API för att hämta OCR-nummer
				let ocrArray = [];
				let token = ocrreserveToken;
				try {
					const data = {
						portaluuid: item.data.portaluuid,
						count: orders.length,
						group_id: 3,
						test_mode: true,
					};
					const respOcArray = await axios.post(
						"/api/index.php/rest/ocr/reserve",
							data,
						{
							headers: {
								Authorization: `Token ${token}`, 
							},
						}
					);
					// console.log("respOcArray", respOcArray);
					ocrArray = respOcArray.data.result;
				} catch (error) {
					console.log("Error getting OCRnumbers from rest API", error);
				}
				console.log("ocrArray", ocrArray);

				
				const deliveryNameFix = {
					"2dba368b-6205-11e1-b101-0025901d40ea": "Till målsman för ",
					"1cfa0ec6-d7de-11e1-b101-0025901d40ea": "",
					"8d944c93-9de4-11e2-882a-0025901d40ea": "",
					"f41d5c48-5af3-94db-f32d-3a51656b2c53": "",
					"da399c45-3cf2-11ea-b287-ac1f6b419120": ""
				};

				let cc = "se";
				if (item.data.portaluuid === "1cfa0ec6-d7de-11e1-b101-0025901d40ea") {
					cc = 'fi';
				} else if (item.data.portaluuid === "8d944c93-9de4-11e2-882a-0025901d40ea") {
						cc = 'dk';
				} else if (item.data.portaluuid === "f41d5c48-5af3-94db-f32d-3a51656b2c53") {
						cc = 'no';
				} else if (item.data.portaluuid === "da399c45-3cf2-11ea-b287-ac1f6b419120") {
						cc = 'de';
				}
				console.log("country code: ", cc);


	      		let i = 0;
				for (const order of orders) {
					// console.log("orders length:", orders.length)
					const invoicenumber = await getInvoiceNumber(order.portaluuid);
					// console.log("Invoice number from getInvoiceNumber method:", invoicenumber);

					if (order.subjectname === order.deliveryname) {
							order.deliveryname = deliveryNameFix[order.portaluuid] + order.subjectname;
							console.log("ALERT! subjectname = deliveryname");
					}

					// Insert into net_orders
					const orderData = {
						orderuuid: ocrArray[i].slice(0,8) + "-cat",
						portaluuid: order.portaluuid,
						externalid: ocrArray[i].slice(0,8),
						co: ocrArray[i],
						invoicenumber: invoicenumber, 
						countrycode:  cc,
						originating: order.originating,
						override_sum: null,
						baseprice: order.price,
						discount: 0,
						deliveryprice: order.deliveryprice,
						fee: 0,
						paid: 0,
						vatprocent: order.vatprocent,
						vatvalue: order.vatvalue,
						deliveryname: order.deliveryname,
						deliveryaddress: order.deliveryaddress,
						deliverypostalcode: order.deliverypostalcode,
						deliverycity: order.deliverycity,
						deliverytype: "BYMAIL",
						paymenttype: "INVOICE",
						socialnumber: order.socialnumber,
						subjectuuid: order.subjectuuid,
						subjectname: order.subjectname,
						subjectemail: null,
						subjectphone: null,
						project: order.project,
						project_id: order.project_id,
						team: order.team,
						username: order.username,
						useremail: order.useremail,
						usermobile: order.usermobile,
						sheet_count: 0,
						printed: null,
						posted: null, 
						post_weight: null,
						cancelled: null,
						expiration_days: 30,
						debtfeedate: null,
						debtfeedate2: null,
						collection: null,
						tags: null,
						notes: null
					};
					console.log("orderData", orderData);
          
					try {
						const responseOrder = await axios.post(`${baseURL}/api/net_orders`, {
							orderData
						})
						// console.log("response orderData", responseOrder);
					} catch (error) {
						console.log("Error inserting orderData to database", error);
					}

					//insert into net_products
					const productData = {
						orderuuid: ocrArray[i].slice(0,8) + "-cat",
						packagedescription: null,
						description: 'Catalog',
						price: order.price,
						quantity: 1,
						vatprocent: 6,
						vatvalue:  order.vatvalue, 
						return_factor: 1,
						package_num: 0,
						deleted: 0,
						created: new Date().toISOString()
					};
					console.log('productData', productData);

					try {
						const responseProduct = await axios.post(`${baseURL}/api/net_products`, {
							productData: productData
						})
						// console.log("Response productData", responseProduct);
					} catch (error) {
						console.log("Error inserting productData into database", error);
					}

					//Updating status in net_catalogue_orders
					try {
						const responseStatus = await axios.post(`${baseURL}/api/net_catalogue_orders/statusupdate`, {
							orderuuid: order.orderuuid
						})
						// console.log("Successfully update status in net_catalogue_orders", responseStatus);
					} catch (error) {
						console.log("Error updating status in net_catalogue_orders", error);
					}

					//pushing each order to csvData array
					csvData.push([
						ocrArray[i].slice(0,8),
						ocrArray[i],
						order.price,
						order.subjectname,
						order.deliveryname,
						order.deliveryaddress,
						order.deliverypostalcode,
						order.deliverycity,
						order.project,
						order.team
					])

					if (isSeparateCSV && orders.length + 1 === csvData.length) {
						// console.log("csvData:", csvData);
						downloadCSVdata(csvData, project_id);
						csvData = [];
					}
					else if (!isSeparateCSV && orders.length + 1 === csvData.length) {
						setCsvDataHolder(prevState => [...prevState, ...csvData]);
					}

					i = i + 1; // increase counter

				}
			} catch (error) {
				console.log('Error fetching project data from net_catalogue_orders', error);
			}

			console.log(item.data.name + "done!");
			console.log("------------------------------------");
			const dataMessage = {
				job_uuid: item.data.uuid,
				insertedOrdersAmount: orders.length,
				message: orders.length > 0 ? orders.length + " orders inserted successfully" : "Error: 0 orders inserted",
				dateTime: new Date().toLocaleString(),
				selectedData: item
			}
			console.log("dataMessage: ", dataMessage);
			setUpdatedDataMessageLivonia((prevState) => [...prevState, dataMessage]);
			
		}
		// Indicate processing is complete if csv.file
		if (!isSeparateCSV) {
			setIsProcessingComplete(true);
		}
		//Finish Livonia function
		finishLivonia()
	}

	// UseEffect to handle csv-downlad if single-file.csv 
	useEffect(() => {
		if (isProcessingComplete) {
				let project_id = "0";
				downloadCSVdata(csvDataHolder, project_id);
				setCsvDataHolder([]); 
				setIsProcessingComplete(false);
		}
	}, [isProcessingComplete]);

  	//method triggered when livonia function is done running
	const finishLivonia = () => {
		console.log("------------------------------------");
		console.log("Livonia finished running!");
		console.log("------------------------------------");
		setUpdatedDataMessage([]);
		setUpdatedDataMessageSendToEngine([]);

		setUpdatedDataLength(0);
		setUpdatedDataSendToEngineLength(0);
		
		setTimeout(() => {
			setLoadingLivonia(false);
			setUpdatedDataLivoniaLength((prevState) => prevState + selectedData.length);
			setSelectedData([]);
			setSelectedIndices([]);
			setTriggerSource(false);
			setIsSeparateCSV(false);
		}, 1000);
		// setShowSuccessLivoniaMessage(true);
		// setTimeout(() => {
		// 	setShowSuccessLivoniaMessage(false);
		// }, 3000);
		toast.success(`Livonia: Livonia has run successfully!`);

		setRefreshProjects(!refreshProjects);
	}

	//method to retrieve invoice number
	async function getInvoiceNumber(portaluuid) {
    try {
        const response = await axios.post(`${baseURL}/api/get_invoice_number`, { portaluuid });
        return response.data.invoicenumber;
    } catch (error) {
        console.error("Error fetching invoice number:", error);
        throw new Error("Unable to fetch invoice number");
    }
  }

	//method to download csv data to computer
	const downloadCSVdata = (csvData, project_id) => {
		console.log("csvData:", csvData);

		// Convert the array to a CSV string
		const csvContent = csvData.map(row => row.join(",")).join("\n");
		// Create a Blob from the CSV string
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);
		link.setAttribute("href", url);
	
		const now = new Date().toISOString();
		const formattedDateTime = formatDateTime(now).replace(/:/g, '-'); 
		link.setAttribute("download", `csvData-projectid:${project_id}-date:${formattedDateTime}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		//method to save csv.file on server
		saveCSVOnServer(csvContent, project_id);
	}

	//method to save csv data on server
	const saveCSVOnServer = async (csvContent, project_id) => {
		try {
			const response = await axios.post(`${baseURL}/api/save-csv`, { csvContent: csvContent, project_id: project_id });
			console.log("CSV saved on server:", response.data);
		} catch (error) {
			console.error("Error saving CSV on server:", error);
		}
	};



	
	 //---------------------------------------- SEND TO ENGINE FUNCTION  ----------------------------------------

	 const runSendToEngine = async (data) => {
		console.log('-----------------------------');
		console.log('-----------------------------');
		console.log('SEND TO ENGINE TRIGGGERED');
		console.log('-----------------------------');
		console.log('-----------------------------');
		console.log('selectedData', data);

		// getting all project_uuid from data array
		const dataUuids = data.map(item => item.data.uuid);
		console.log("Sending dataUuids to backend:", dataUuids);
		let token = ocrreserveToken;		
		try {
			const response = await axios.post(
				`${baseURL}/api/pdfgen_project_data`,
				{ dataUuids },
				{
				  headers: {
					Authorization: `Token ${token}`,
				  },
				}
			);
			console.log('Response from pdfgen_project_data:', response.data);
			if (response.data.length < data.length){
				toast.error("All selected projects must first go through EBSS and be production active ")
				return;
			}
		} catch (error) {
			console.log('Error fetching data from pdfgen_project_data', error);
			toast.error("Send to Engine: Error fetching data from pdfgen_project_data")
			return;
		}	


		//loopa igenom selecteddata (data) och plocka ut varje tuppel från net_catalogue_orders
		for (const item of data) {
			let project_id = item.data.uuid;
			console.log(`project_id of index ${item.index}:` , project_id);
			let orders = [];
			try {
				const response = await axios.get(
					`${baseURL}/api/net_catalogue_orders/livonia`,
					{
						params: {
							project_id: project_id
						},
					}
				); 
				// console.log('Response', response.data);
				orders = response.data;       
				console.log('amount orders', orders.length);

				//If orders are 0, print error
				if (orders.length === 0) {
					console.log("There are no current orders to process!");
					toast.error("Send to Engine Error: There are no current orders to process");
					setLoadingSendToEngine(false);
					return;
				} else {
					setLoadingSendToEngine(true);
				}

				//Anropar REST API för att hämta OCR-nummer
				let ocrArray = [];
				let token = ocrreserveToken;
				try {
					const data = {
						portaluuid: item.data.portaluuid,
						count: orders.length,
						group_id: 3,
						test_mode: true,
					};
					const respOcArray = await axios.post(
						"/api/index.php/rest/ocr/reserve",
							data,
						{
							headers: {
								Authorization: `Token ${token}`, 
							},
						}
					);
					// console.log("respOcArray", respOcArray);
					ocrArray = respOcArray.data.result;
				} catch (error) {
					console.log("Error getting OCRnumbers from rest API", error);
				}
				console.log("ocrArray", ocrArray);

				const deliveryNameFix = {
					"2dba368b-6205-11e1-b101-0025901d40ea": "Till målsman för ",
					"1cfa0ec6-d7de-11e1-b101-0025901d40ea": "",
					"8d944c93-9de4-11e2-882a-0025901d40ea": "",
					"f41d5c48-5af3-94db-f32d-3a51656b2c53": "",
					"da399c45-3cf2-11ea-b287-ac1f6b419120": ""
				};

				let cc = "se";
				if (item.data.portaluuid === "1cfa0ec6-d7de-11e1-b101-0025901d40ea") {
					cc = 'fi';
				} else if (item.data.portaluuid === "8d944c93-9de4-11e2-882a-0025901d40ea") {
						cc = 'dk';
				} else if (item.data.portaluuid === "f41d5c48-5af3-94db-f32d-3a51656b2c53") {
						cc = 'no';
				} else if (item.data.portaluuid === "da399c45-3cf2-11ea-b287-ac1f6b419120") {
						cc = 'de';
				}
				console.log("country code: ", cc);


	      		let i = 0;
				for (const order of orders) {
					// console.log("orders length:", orders.length)
					const invoicenumber = await getInvoiceNumber(order.portaluuid);
					// console.log("Invoice number from getInvoiceNumber method:", invoicenumber);

					if (order.subjectname === order.deliveryname) {
							order.deliveryname = deliveryNameFix[order.portaluuid] + order.subjectname;
							console.log("ALERT! subjectname = deliveryname");
					}

					// Insert into net_orders
					const orderData = {
						orderuuid: ocrArray[i].slice(0,8) + "-cat",
						portaluuid: order.portaluuid,
						externalid: ocrArray[i].slice(0,8),
						co: ocrArray[i],
						invoicenumber: invoicenumber, 
						countrycode:  cc,
						originating: order.originating,
						override_sum: null,
						baseprice: order.price,
						discount: 0,
						deliveryprice: order.deliveryprice,
						fee: 0,
						paid: 0,
						vatprocent: order.vatprocent,
						vatvalue: order.vatvalue,
						deliveryname: order.deliveryname,
						deliveryaddress: order.deliveryaddress,
						deliverypostalcode: order.deliverypostalcode,
						deliverycity: order.deliverycity,
						deliverytype: "BYMAIL",
						paymenttype: "INVOICE",
						socialnumber: order.socialnumber,
						subjectuuid: order.subjectuuid,
						subjectname: order.subjectname,
						subjectemail: null,
						subjectphone: null,
						project: order.project,
						project_id: order.project_id,
						team: order.team,
						username: order.username,
						useremail: order.useremail,
						usermobile: order.usermobile,
						sheet_count: 0,
						printed: null,
						posted: null, 
						post_weight: null,
						cancelled: null,
						expiration_days: 30,
						debtfeedate: null,
						debtfeedate2: null,
						collection: null,
						tags: null,
						notes: null
					};
					console.log("orderData", orderData);
          
					try {
						const responseOrder = await axios.post(`${baseURL}/api/net_orders`, {
							orderData
						})
						// console.log("response orderData", responseOrder);
					} catch (error) {
						console.log("Error inserting orderData to database", error);
					}

					//insert into net_products
					const productData = {
						orderuuid: ocrArray[i].slice(0,8) + "-cat",
						packagedescription: null,
						description: 'Catalog',
						price: order.price,
						quantity: 1,
						vatprocent: 6,
						vatvalue:  order.vatvalue, 
						return_factor: 1,
						package_num: 0,
						deleted: 0,
						created: new Date().toISOString()
					};
					console.log('productData', productData);

					try {
						const responseProduct = await axios.post(`${baseURL}/api/net_products`, {
							productData: productData
						})
						// console.log("Response productData", responseProduct);
					} catch (error) {
						console.log("Error inserting productData into database", error);
					}

					// Adding tupples to rest API "/pdfgen/enqueue" 
					try {
						const dataToSend = {
							project_uuid: order.project_id,
							product_type: "Catalogue",
							identifier: ocrArray[i].slice(0,8) + "-cat",
							priority: 0,
							force: 0
						};
						console.log("Data sending to /pdfgen/enqueue", dataToSend);
						let token = ocrreserveToken;
						let respEnqueue = await axios.post(
							"/api/index.php/rest/pdfgen/enqueue",
							dataToSend,
							{
								headers: {
									Authorization: `Token ${token}`, 
								},
							}
						);
						// console.log("respOcArray", respOcArray);
						respEnqueue = respEnqueue.data;
						console.log("respEnqueue", respEnqueue);
					} catch (error) {
						console.log("Error adding tupples to rest API /pdfgen/enqueue", error);
						toast.error(`Send to Engine: Error adding tupples to rest API /pdfgen/enqueue!`);
					}
					

					//Updating status in net_catalogue_orders
					try {
						const responseStatus = await axios.post(`${baseURL}/api/net_catalogue_orders/statusupdate`, {
							orderuuid: order.orderuuid
						})
						// console.log("Successfully update status in net_catalogue_orders", responseStatus);
					} catch (error) {
						console.log("Error updating status in net_catalogue_orders", error);
					}

					i = i + 1; // increase counter

				}
			} catch (error) {
				console.log('Error fetching project data from net_catalogue_orders', error);
			}

			console.log(item.data.name + "done!");
			console.log("------------------------------------");
			const dataMessage = {
				job_uuid: item.data.uuid,
				insertedOrdersAmount: orders.length,
				message: orders.length > 0 ? orders.length + " orders inserted successfully" : "Error: 0 orders inserted",
				dateTime: new Date().toLocaleString(),
				selectedData: item
			}
			console.log("dataMessage: ", dataMessage);
			setUpdatedDataMessageSendToEngine((prevState) => [...prevState, dataMessage]);
		}

		//Finish Send to Engine function
		finishSendToEngine()
	}


	//method triggered when send to engine function is done running
	const finishSendToEngine = () => {
		console.log("------------------------------------");
		console.log("Send to Engine finished running!");
		console.log("------------------------------------");
		setUpdatedDataMessage([]);
		setUpdatedDataMessageLivonia([]);

		setUpdatedDataLength(0);
		setUpdatedDataLivoniaLength(0);
		
		setTimeout(() => {
			setLoadingSendToEngine(false);
			setUpdatedDataSendToEngineLength((prevState) => prevState + selectedData.length);
			setSelectedData([]);
			setSelectedIndices([]);
			setTriggerSource(false);
		}, 1000);
		toast.success(`Send to Engine: Send to Engine has run successfully!`);

		setRefreshProjects(!refreshProjects);
	}



	//-------- CHECKING D2 COLUMN  --------

	// Function to check if any object in selectedData has D2 === null
	const checkD2Null = () => {
		let D2isNull = '';
		let NoneNulls = '';
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
			setErrorMessageLivoniaButton(true);
			// console.log('D2 is null: one or more items have D2 as null');
		} else {
			setErrorMessageLivoniaButton(false);
			// console.log('No nulls: no item has D2 as null');
		}

		if (NoneNulls) {
			setErrorMessageRunD2Button(true);
		} else {
			setErrorMessageRunD2Button(false);
		}
	};

	// useEffect to call checkD2Null whenever selectedData changes
	useEffect(() => {
		checkD2Null();
	}, [selectedData]);


	//-------- ADDING PROJECT TO SELECTEDDATA ARRAY --------

	const AddRow = (index, data) => {
		console.log("Added index: ", index);
		console.log("Added row: ", data);

		setSelectedIndices((prevSelectedIndices) => {
			if (prevSelectedIndices.includes(data.uuid)) {
				return prevSelectedIndices.filter((i) => i !== data.uuid);
			} else {
				return [...prevSelectedIndices, data.uuid];
			}
		});
		console.log("selectedIndices:", selectedIndices);

		setSelectedData((prevSelectedData) => {
			if (selectedIndices.includes(data.uuid)) {
				// Remove data if index is already selected
				return prevSelectedData.filter((item) => item.data.uuid !== data.uuid);
			} else {
				// Add data if index is newly selected
				console.log('selected data', selectedData);
				return [...prevSelectedData, { index, data }];
			}
		});
		console.log(selectedData);
	};

	//-------- FORMAT TIME --------
	//foramt time
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


	//-------- CLEARING DATA --------

	const ClearAllSelected = () => {
		setSelectedIndices([]);
		setUuidArray([]);
		setSelectedData([]);
	};

	const removeSelectedData = (indexToRemove) => {
		console.log('Index to remove:', indexToRemove);
		setSelectedData((prevSelectedData) =>
			prevSelectedData.filter((item) => item.data.uuid !== indexToRemove)
		);
		setSelectedIndices((prevSelectedIndices) =>
			prevSelectedIndices.filter((index) => index !== indexToRemove)
		);
	};

	//-------- SORTING AND SEARCHING TABLE --------
	// handle sorting
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
	
	const handleSCVCheckboxChange = (e) => {
        setIsSeparateCSV(e.target.checked);
    };


	//open project in EBSS
	const openInEBSS = (uuid, name) => {
		console.log("uuid:", uuid);
		console.log("name:", name);
		// const url = `${window.location.origin}/#/ebss?uuid=${encodeURIComponent(uuid)}`;
		const url = `${window.location.origin}/#/ebss?uuid=${encodeURIComponent(uuid)}&product=Catalogue&name=${encodeURIComponent(name)}`;
		console.log("Opening URL:", url);
		window.open(url, '_blank');
	}

	
	return (
		<div className="wrapper">
			{(loadingD2 || loadingLivonia || loadingSendToEngine ) && (
					<div className="loader-D2">
							<h6 className="loader-text">
									Please wait while {loadingD2 ? "D2 is running..." : loadingLivonia ? "Livonia is running..." : "sending to Engine..."}  
							</h6>
							{loadingD2 ? <p>{updatedDataMessage.length}/{selectedData.length + updatedDataLength} </p> : loadingLivonia ? <p> {updatedDataMessageLivonia.length}/{triggerSource ? updatedDataMessage.length + updatedDataLivoniaLength : selectedData.length + updatedDataLivoniaLength} </p> : loadingSendToEngine ? <p> {updatedDataMessageSendToEngine.length}/{triggerSource ? updatedDataMessage.length + updatedDataSendToEngineLength : selectedData.length + updatedDataSendToEngineLength} </p> : "" }
							<RingLoader className="loader-spinner" color={'#123abc'} size={50} />
					</div>
			)}

			<div className="page-wrapper" style={{ opacity: loadingD2 || loadingLivonia || loadingSendToEngine ? '0.1' : '' }}>
				<h4 className='' style={{ fontWeight: "700", textDecoration: "underline" }}>Catalogue Control</h4>
				<h6 className='mb-5' style={{ fontSize: "1.1em", fontWeight: "400" }}>D2, Send to Engine, D2 and EBBS</h6>

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
							<option value="f41d5c48-5af3-94db-f32d-3a51656b2c53">
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
							className="mr-1 custom-checkbox"
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
										key={p.uuid}
										data-has_d2={p.D2 ? '1' : '0'}
										data-can_wrap={p.new_orders > 0 ? '1' : '0'}
										style={{
											backgroundColor: selectedIndices.includes(p.uuid)
												? '#ececec'
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
										<td title={p.D2 !== null ? formatDateTime(p.D2) : 'null'}>
											{p.D2 !== null ? (
												<FontAwesomeIcon icon={faCheck} />
											) : (
												'---'
											)}
										</td>
										<td>{p.num_orders}</td>
										<td>{p.D2 ? p.new_orders : p.num_orders}</td>
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
				{/* amount selcted and clear all button		 */}
				{/* <div
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
				</div> */}

				{/* updated data table (LIVONIA AND D2 AND SEND TO ENGINE) */}
				{((updatedDataMessage && updatedDataMessage.length > 0) || (updatedDataMessageLivonia && updatedDataMessageLivonia.length > 0) || (updatedDataMessageSendToEngine && updatedDataMessageSendToEngine.length > 0)) && (
					<div className="mt-4 updated-data-box">
						<div className=' mb-3 d-flex justify-content-between'>
							<h6 style={{ textDecoration: "underline" }}><b>{updatedDataMessage.length > 0 ? "D2 log:" : updatedDataMessageLivonia.length > 0 ? "Livonia log:" : updatedDataMessageSendToEngine.length > 0 ? "Send to Engine Log:" : ""}</b></h6>
							<button
								style={{ float: 'right', border: 'none' }}
								onClick={() => {
									setUpdatedDataMessage([]);
									setUpdatedDataMessageLivonia([]);
									setUpdatedDataMessageSendToEngine([]);
									setUpdatedDataLength(0);
									setUpdatedDataLivoniaLength(0);
									setUpdatedDataSendToEngineLength(0);
								}}
								className="remove-selected-data-button"
							>
								<FontAwesomeIcon icon={faTimes} title="Remove list" />
							</button>
						</div>
						<table className="updated-data-table">
							<thead>
								<tr>
									{updatedDataMessage && updatedDataMessage.length > 0 ? (
									<>
										<th>Project ({updatedDataMessage.length})</th>
										<th>D2</th>
										<th>Orders</th>
										<th>New orders</th>
										<th></th>
										<th>Inserted</th>
										<th>Msg</th>
										<th>Completed</th>
									</>
									) : updatedDataMessageLivonia && updatedDataMessageLivonia.length > 0 ? (
									<>
										<th>Project ({updatedDataMessageLivonia.length})</th>
										<th>Inserted orders</th>
										<th></th>
										<th>Msg</th>
										<th>Completed</th>
									</>
									) : updatedDataMessageSendToEngine && updatedDataMessageSendToEngine.length > 0 ? (
										<>
											<th>Project ({updatedDataMessageSendToEngine.length})</th>
											<th>Inserted orders</th>
											<th></th>
											<th>Msg</th>
											<th>Completed</th>
										</>
									) : null}
								</tr>
							</thead>
							<tbody className="selected-data-table-body">
								{updatedDataMessage && updatedDataMessage.map((data) => (
									<tr key={data.selectedData.data.uuid}>
										<td data-uuid={data.selectedData.data.uuid}>
											{data.selectedData.data.name}
										</td>
										<td
											title={
												data.insertedOrdersAmount > 0
													? new Date().toLocaleString()
													: 'null'
											}
										>
											{data.insertedOrdersAmount > 0 ? <FontAwesomeIcon icon={faCheck} /> : "---" }
										</td>
										<td>{data.selectedData.data.num_orders}</td>
										<td>
											{data.selectedData.data.D2
												? data.selectedData.data.new_orders
												: data.selectedData.data.num_orders}
										</td>
										<td>
											<button className="mr-2 table-button" onClick={() => openInEBSS(data.selectedData.data.uuid, data.selectedData.data.name)}>
												Open in EBSS
											</button>
										</td>
										<td>{data.insertedOrdersAmount}</td>
										<td>{data.insertedOrdersAmount} {data.message}</td>
										<td>at {data.dateTime.substring(11,19).replace(/-/g, '/')}</td>
									</tr>
								))}
								{updatedDataMessageLivonia && updatedDataMessageLivonia.map((data) => (
									<tr key={data.selectedData.data.uuid}>
										<td data-uuid={data.selectedData.data.uuid}>
											{data.selectedData.data.name}
										</td>
										<td>
											{data.insertedOrdersAmount} 
										</td>
										<td>
											<button className="mr-2 table-button" onClick={() => openInEBSS(data.selectedData.data.uuid)}>
												Open in EBSS
											</button>
										</td>
										<td>{data.message}</td>
										<td>at {data.dateTime.substring(11,19).replace(/-/g, '/')}</td>
									</tr>
								))}
								{updatedDataMessageSendToEngine && updatedDataMessageSendToEngine.map((data) => (
									<tr key={data.selectedData.data.uuid}>
										<td data-uuid={data.selectedData.data.uuid}>
											{data.selectedData.data.name}
										</td>
										<td>
											{data.insertedOrdersAmount} 
										</td>
										<td>
											<button className="mr-2 table-button" onClick={() => openInEBSS(data.selectedData.data.uuid)}>
												Open in EBSS
											</button>
										</td>
										<td>{data.message}</td>
										<td>at {data.dateTime.substring(11,19).replace(/-/g, '/')}</td>
									</tr>
								))}
							</tbody>
						</table>
						<div className="mt-3">
							<hr></hr>
							<button
								className="mr-2 button runD2"
								disabled={
									updatedDataMessage.some((item) => item.insertedOrdersAmount > 0) ||
									updatedDataMessageLivonia.length > 0 ||
									updatedDataMessageSendToEngine.length > 0
								}		
							>
								Run D2
							</button>
							<button
								className="mr-2 button"
								disabled={
									updatedDataMessageSendToEngine.length > 0 ||
									updatedDataMessageLivonia.length > 0
								}								
								onClick={() => {
									setTriggerSource(true);
									const dataToSend = updatedDataMessage.length > 0 ? updatedDataMessage : updatedDataMessageSendToEngine;
									runSendToEngine(dataToSend.map(data => data.selectedData));
								}}
							>
								Send to Engine
							</button>
							<button
								className="button"
								disabled={
									updatedDataMessageLivonia.length > 0 || 
									updatedDataMessageSendToEngine.length > 0
								}								
								onClick={() => {
									setTriggerSource(true);
									const dataToSend = updatedDataMessage.length > 0 ? updatedDataMessage : updatedDataMessageLivonia;
									runLivonia(dataToSend.map(data => data.selectedData));
								}}
							>
								Livonia
							</button>
							<div className='mt-2'>
								<input
									className='custom-checkbox'
									type="checkbox"
									id="separateCSVCheckbox"
									checked={isSeparateCSV}
									onChange={handleSCVCheckboxChange}
								/>
								<label className='ml-1' htmlFor="separateCSVCheckbox">Livonia: Separate CSV files</label>
							</div>
						</div>
					</div>
				)}
			</div>

			{/* selected data table */}
			{selectedData && selectedData.length > 0 && (
				<div
					className="mt-3 selected-data-box"
					style={{ opacity: loadingD2 || loadingLivonia || loadingSendToEngine ? '0.1' : '' }}
				>
					<table className="selected-data-table">
						<thead>
							<tr>
								<th 
									className='clearall-link'
									onClick={ClearAllSelected}
									>	
									Clear all
								</th>
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
											onClick={() => removeSelectedData(data.data.uuid)}
											title="Remove project"
										/>
									</td>
									<td data-uuid={data.data.uuid}>{data.data.name}</td>
									<td
										title={
											data.data.D2 !== null
												? formatDateTime(data.data.D2)
												: 'null'
										}
										style={{ color: data.data.D2 === null ? 'red' : '' }}
									>
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
										<button className="mr-2 table-button" onClick={() => openInEBSS(data.data.uuid, data.data.name)}>Open in EBSS</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="mt-3">
						<hr></hr>
						<button
							onClick={runD2}
							className="mr-2 button runD2"
							disabled={errorMessageRunD2Button}
							title={
								errorMessageRunD2Button
									? 'Some choosen projects has already been run by D2'
									: 'Run D2'
							}
						>
							Run D2
						</button>
						<button 
							className="mr-2 button"
							onClick={() => runSendToEngine(selectedData)}
							disabled={errorMessageLivoniaButton}
							title={
								errorMessageLivoniaButton
									? "At least one of your selected projects needs to be run by D2 in order to run 'Send to Engine'"
									: 'Send to Engine'
							}
						>Send to Engine</button>
						<button
							className="button"
							disabled={errorMessageLivoniaButton}
							onClick={() => runLivonia(selectedData)}
							title={
								errorMessageLivoniaButton
									? "At least one of your selected projects needs to be run by D2 in order to run 'Livonia'"
									: 'Livonia'
							}
						>
							Livonia
						</button>
						<div className='mt-2'>
							<input
								className='custom-checkbox'
								type="checkbox"
								id="separateCSVCheckbox"
								checked={isSeparateCSV}
								onChange={handleSCVCheckboxChange}
							/>
							<label className='ml-1' htmlFor="separateCSVCheckbox">Livonia: Separate CSV files</label>
						</div>
						{errorMessageLivoniaButton && (
							<div>
								<h6
									className="mt-2"
									style={{ color: 'black', fontSize: '0.9em' }}
								>
									*Livonia button: Not all projects has been run by D2
								</h6>
								<h6
									className="mt-2"
									style={{ color: 'black', fontSize: '0.9em' }}
								>
									*Send to Engine button: Not all projects has been run by D2
								</h6>
							</div>
						)}
						{errorMessageRunD2Button && (
							<div>
								<h6
									className="mt-2"
									style={{ color: 'black', fontSize: '0.9em' }}
								>
									*RunD2 button: Some choosen projects has already been run by D2
								</h6>
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
			{showD2SuccessMessage && (
				<div
					className="alert-message"
					style={{ backgroundColor: '#C8FFAB', border: '0.5px solid green' }}
				>
					D2: D2 has run successfully
				</div>
			)}
			{/* Showing alert message for LIVONIA function  */}
			{showErrorLivoniaMessage && (
				<div
					className="alert-message"
					style={{ backgroundColor: '#FFBCAB', border: '0.5px solid green' }}
				>
					Livonia Error: There are no current orders to process
				</div>
			)}
			{showSuccessLivoniaMessage && (
				<div
					className="alert-message"
					style={{ backgroundColor: '#C8FFAB', border: '0.5px solid green' }}
				>
					Livonia: Livonia has run successfully
				</div>
			)}

			<ToastContainer 
				position="bottom-left"
				autoClose={6000}
				hideProgressBar={false}
				// transition={Slide}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="colored"
				style={{ fontSize: '14px', height: "3em", margin: "0 0 3em 0" }}
			/>
		</div>
	);
};

export default Index;
