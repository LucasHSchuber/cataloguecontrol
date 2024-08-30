import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faTrash,
} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

import {
	baseURL,
} from '../../../config/env.js';

import { RingLoader } from 'react-spinners';
import { ToastContainer, toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Ebss = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);

    // Retrieve the 'uuid' and 'product' from the query string
    const uuid = query.get('uuid');
    // const uuid = "9fba7984-ff60-4a44-8482-509024feb902";
    const product = query.get('product');
    const name = query.get('name');
    useEffect(() => {
        console.log("Received UUID:", uuid);
        console.log("Received PRODUCT TYPE:", product);
        console.log("Received PROJECT NAME:", name);
        setProductType(product);
    }, [uuid, product, name]);


    // State variables for each form field
    const [productType, setProductType] = useState('');
    const [productionType, setProductionType] = useState('');
    const [template, setTemplate] = useState('');
    const [catalogueFile, setCatalogueFile] = useState(null); 
    const [logoActive, setLogoActive] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [productionActive, setProductionActive] = useState(false);
    //variables
    const [allowSEF, setAllowSEF] = useState(false);
    const [allowReduced, setAllowReduced] = useState(false);
    const [overridePrice, setOverridePrice] = useState(false); 
    const [overrideReducedPrice, setOverrideReducedPrice] = useState(false);
    const [overrideProjectName, setOverrideProjectName] = useState(false);
    const [newPrice, setNewPrice] = useState('');
    const [reducedPrice, setReducedPrice] = useState('');
    const [newProjectName, setNewProjectName] = useState('');

    //new states:
    const [productionTypes, setProductionTypes] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [selectedProductionType, setSelectedProductionType] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('');
    const [formData, setFormData] = useState({});
    const [confirmationStatus, setConfirmationStatus] = useState({});

    const [defaultValuesLoad, setDefaultValuesLoad] = useState(false);
    const [defaultValues, setDefaultValues] = useState({});

    const [formError, setFormError] = useState({});

    const [loading, setloading] = useState(false);


    // Fetch templates and production types
    useEffect(() => {
        const fetchTemplates = async () => {
        try {
            const response = await axios.get(`/api/index.php/rest/pdfgen/productdata`, {
            params: { product_type: product }
            });
            setProductionTypes(response.data.production_types);
            setTemplates(response.data.templates);
            console.log('response:', response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        };
        fetchTemplates();
    }, []);

    // Fetch project data after templates and production types are fetched
    useEffect(() => {
        if (templates) {
        const fetchProjectData = async () => {
            try {
            const responseProjectData = await axios.get(`/api/index.php/rest/pdfgen/projectdata`, {
                params: {
                project_uuid: uuid,
                product_type: product
                }
            });
            console.log('responseProjectData:', responseProjectData.data.result);
            const projectData = responseProjectData.data.result;
            
            if (projectData) {
                console.log("NOT NULL");
                const initialFormVariablesData = {};
                projectData.data.forEach((data) => {
                if (data.variable.type === "file" && data.value) {
                    initialFormVariablesData[data.name] = data.value;
                    setConfirmationStatus((prevStatus) => ({ ...prevStatus, [data.name]: data.value }));
                } else {
                    initialFormVariablesData[data.name] = data.value;
                    setConfirmationStatus((prevStatus) => ({ ...prevStatus, [data.name]: data.value }));
                }
                });
                console.log('initialFormVariablesData', initialFormVariablesData);
                setFormData({
                production_active: projectData.production_active,
                ...initialFormVariablesData
                });
                setSelectedProductionType(projectData.production_type.id);
                setSelectedTemplate(projectData.template.id);
            } else {
                // Use default data for formData 
                console.log("No project data fetched from /projectdata with id:", uuid);
                setDefaultValuesLoad(true);
                const defaultValues = {};
                console.log('templates', templates);
                templates.forEach(template => {
                    if (template.variables && template.variables.length > 0) {
                    // Loop through each variable in the variables array of the template
                    template.variables.forEach(variable => {
                        console.log("name:", variable.name, 'Default Value:', variable.default_value);
                        defaultValues[variable.name] = variable.default_value;
                    });
                    }
                });
                setFormData({
                    ...defaultValues
                });
                setDefaultValues({
                    ...defaultValues
                })
            }
            } catch (error) {
            console.error('Error fetching project data:', error);
            }
        };
        fetchProjectData();
        }
    }, [templates, productionTypes]);

    // // Fetch data from the API
    // useEffect(() => {
    // // Fetch templates and production types
    // const fetchData = async () => {
    //     try {
    //         const response = await axios.get(`/api/index.php/rest/pdfgen/productdata`, {
    //             params: {
    //                 product_type: product
    //             }
    //         });
    //         setProductionTypes(response.data.production_types);
    //         setTemplates(response.data.templates);
    //         console.log('response:', response.data);
    //     } catch (error) {
    //     console.error('Error fetching data:', error);
    //     }
    // };
    // //Fetch current data 
    // const fetcProjecthData = async () => {
    //     try {
    //         const responseProjectData = await axios.get(`/api/index.php/rest/pdfgen/projectdata`, {
    //             params: {
    //                 // project_uuid: "9fba7984-ff60-4a44-8482-509024feb902",
    //                 project_uuid: uuid,
    //                 product_type: product
    //             }
    //         });
    //         console.log('responseProjectData:', responseProjectData.data.result);
    //         const projectData = responseProjectData.data.result;
    //         if (projectData){
    //             console.log("NOT NULL")
    //             const initialFormVariablesData = {};
    //             console.log("projectData:", projectData.data)
    //             projectData.data.forEach((data) => {
    //                 if (data.variable.type === "file" && data.value) {
    //                     initialFormVariablesData[data.name] = data.value;
    //                     console.log(data.name)
    //                     console.log(data.value)
    //                     setConfirmationStatus((prevStatus) => ({...prevStatus, [data.name]: data.value,}));
    //                 }else{
    //                     initialFormVariablesData[data.name] = data.value;
    //                     setConfirmationStatus((prevStatus) => ({...prevStatus, [data.name]: data.value,}));
    //                 }
    //             })
    //             console.log('initialFormVariablesData', initialFormVariablesData);
    //             setFormData({
    //                 production_active: projectData.production_active,
    //                 ...initialFormVariablesData
    //             })
    //             setSelectedProductionType(projectData.production_type.id)
    //             setSelectedTemplate(projectData.template.id)
    //             // projectData.template.variables.forEach((variable))
    //         } else {
    //             console.log("No project data fetched from /projectdata with id:", uuid)

    //             // If no project data, use template data for defaults
    //             console.log('templates', templates);
    //             if (templates && templates.variables) {
    //                 const defaultValues = {};
    //                 templates.variables.forEach(variable => {
    //                     defaultValues[variable.name] = variable.default_value;
    //                 });
    //                 setFormData({
    //                     ...defaultValues
    //                 });
    //             }
    //         }
    //     } catch (error) {
    //     console.error('Error fetching project data:', error);
    //     }
    // };

    // fetchData();
    // fetcProjecthData();
    // }, []);


    // Handle changes in production type select
    const handleProductionTypeChange = (e) => {
        setSelectedProductionType(e.target.value);
        console.log(e.target.value);
        // Clear errorForm
        setFormError((prevData) => ({...prevData, production_type: false}))
    };

    // Handle changes in template select
    const handleTemplateChange = (e) => {
        setSelectedTemplate(e.target.value);
        if (defaultValuesLoad){
            setFormData({...defaultValues}); 
        }
        setConfirmationStatus({}); 
        // Clear errorForm
        setFormError((prevData) => ({...prevData, template: false}))
    };

    // Handle changes in form input fields
    const handleInputChange = (name, value) => {
        setFormData((prevData) => ({...prevData, [name]: value,}));
        setFormError((prevState) => ({ ...prevState, [name]: false }));
        };

    // Handle confirmation checkbox change
    const handleConfirmationChange = (name, value) => {
        setConfirmationStatus((prevStatus) => ({...prevStatus, [name]: value,}));
        if (value === false){
            setFormData((prevStatus) => ({...prevStatus, [name]: null,}));
        }
    };

    // Find the selected template
    const selectedTemplateObj = templates.find(
        (template) => template.id === selectedTemplate
    );

    // Handle file changes
    const handleFileChange = (event, setFile, name) => {
        const file = event.target.files[0];
        console.log("Uploaded File: ", file);
        console.log("All Uploaded File Data: ", event.target.files);
        // setFile(file);
        setFormData((prevData) => ({
            ...prevData,
            [name]: file,
        }));
        if (file) {
            setFormError((prevState) => ({ ...prevState, [name]: false }));
        }
    };
    // handle clear file
    const handleClearFile = (name) => {
        setFormData((prevData) => ({...prevData,[name]: null,}));
        // setFormError((prevState) => ({ ...prevState, [name]: true }));
    };

    useEffect(() => {
            console.log('formData', formData);
    }, [formData]);
    useEffect(() => {
        console.log('confirmationStatus', confirmationStatus);
    }, [confirmationStatus]);
  

    // Handle form submit
    const handleSubmit = async (event) => {
        event.preventDefault();

        // ---Validation checks---
        let hasError = false;
        const missingFields = [];
        // Check if Production Type is selected
        if (!selectedProductionType) {
        missingFields.push("Production type");
        setFormError((prevData) => ({...prevData, production_type: true}));
        hasError = true;
        }
        // Check if Template is selected
        if (!selectedTemplate) {
        missingFields.push("Template");
        setFormError((prevData) => ({...prevData, template: true}));
        hasError = true;
        }
        // Check required variables
        if (selectedTemplateObj) {
        selectedTemplateObj.variables.forEach((variable) => {
            const variableValue = formData[variable.name]
            const variableConfirmed = confirmationStatus[variable.name]

            if (variable.is_required && !variableValue) {
            missingFields.push(variable.display_name);
            setFormError((prevData) => ({...prevData, [variable.name]: true}));
            hasError = true;
            }
            if (variable.require_confirmation && (variableConfirmed && !variableValue)){
                console.error(`${variable.name} is confirmed but has no value.`);
                missingFields.push(variable.display_name);
                setFormError((prevData) => ({...prevData, [variable.name]: true}));
                hasError = true;
            }
        });
        }
        // If error
        if (hasError) {
        console.error("The following fields are missing or incomplete:", missingFields);
        alert(`Please complete the following fields: ${missingFields.join(", ")}`);
        return;
        }

        // --- Form passed Check ---
        setloading(true);

        // Create Variables-array 
        // Create array of files to send to SaveFilesToDisk
        const variables = []
        console.log('selectedTemplateObj', selectedTemplateObj);
        selectedTemplateObj.variables.forEach((variable) => {
            let fileData = formData[variable.name];
            let value;
            let file;
            if (fileData instanceof File) {
                value = fileData.name;
                file = fileData; 
            } else {
                value = fileData || "";
            }
            variables.push({
                name: variable.name,
                value: value,
                type: variable.type,
                file: file 
            });
        });
        console.log("variables: ", variables);

        const files = [];
        variables.forEach((type) => {
            if (type.type === "file" && type.file && type.file instanceof File) {
                console.log("creating files array to send with SaveFilesToDisk");
                files.push(type);
            }
        })
        console.log("files array:", files);

        if (files.length > 0) {
            console.log("FILES LENGTH > 0")
            saveFilesToDisk(files).then(responseSaveFilesToDisk => {
                console.log("responseSaveFilesToDisk: ", responseSaveFilesToDisk);
    
                if (responseSaveFilesToDisk.status === 200) {
                     // Create new variable array to send with in data to restAPI 
                    const variablesArray = [];
                    responseSaveFilesToDisk.files.forEach((file) => {    
                        variablesArray.push({
                            name: file.name,
                            value: file.path,
                        });
                    });

                    // Create a set of existing variable names to avoid duplicates
                    const existingVariableNames = new Set(
                        responseSaveFilesToDisk.files.map(file => file.name)
                    );

                    console.log("selectedTemplateObj.variables", selectedTemplateObj.variables);
                     // Add new variables from selectedTemplateObj.variables if their name is not already in the set
                    selectedTemplateObj.variables.forEach((variable) => {
                        let value = formData[variable.name];
                        if (variable.type === 'bool') {
                            value = value === true ? true : false;
                        }
                        if (!existingVariableNames.has(variable.name)) {
                            variablesArray.push({
                                name: variable.name,
                                value: value, 
                            });
                        }
                    });
                    console.log("variablesArray: ", variablesArray);
                    
                    // Prepare array of data to send to restAPI
                    const data = {
                        project_uuid: uuid,
                        product_type: product,
                        production_type: productionTypes.find((type) => type.id === selectedProductionType)?.name,
                        template: templates.find((type) => type.id === selectedTemplate)?.name,
                        production_active: formData["production_active"] ? formData["production_active"] : false,
                        variables: variablesArray
                    };
                    console.log("data: ", data);

                    // const fileNames = responseSaveFilesToDisk.files.map(file => file.filename).join(', '); // Create the array to display in the toaster
                   // Request to send data to REST API
                    axios.post(`/api/index.php/rest/pdfgen/projectdata`, data)
                    .then(response => {
                        console.log('response:', response.data); 
                        setloading(false);
                        toast.success(`Successfully Saved to EBSS!`);
                    })
                    .catch(error => {
                        console.error('Error posting data:', error);
                        setloading(false);
                        toast.error("Failed to Save to EBSS");
                    });

                } else if (responseSaveFilesToDisk.status === 500){
                    console.log("Upload failed with status 500:", responseSaveFilesToDisk.status, responseSaveFilesToDisk.error);
                    setloading(false);
                    toast.error("File upload failed");
                    setFormError({})
                } else{
                    console.log("Upload failed:", responseSaveFilesToDisk);
                    setloading(false);
                    toast.error("File upload failed");
                }
            }).catch(error => {
                console.error("Error occurred while saving files:", error);
            });
        } else if (files.length === 0) { //if files.length === 0
            console.log("FILES LENGTH === 0")
            console.log("selectedTemplateObj.variables", selectedTemplateObj.variables);
            const variablesArray = [];
            // Add new variables from selectedTemplateObj.variables if their name is not already in the set
            selectedTemplateObj.variables.forEach((variable) => {
                let value = formData[variable.name];
                if (variable.type === 'bool') {
                    value = value === true ? true : false;
                }
                variablesArray.push({
                    name: variable.name,
                    value: value, 
                });
            });
            console.log("variablesArray: ", variablesArray);
            
            // Prepare array of data to send to restAPI
            const data = {
                project_uuid: uuid,
                product_type: product,
                production_type: productionTypes.find((type) => type.id === selectedProductionType)?.name,
                template: templates.find((type) => type.id === selectedTemplate)?.name,
                production_active: formData["production_active"] ? formData["production_active"] : false,
                variables: variablesArray
            };
            console.log("data: ", data);

            // Request to send data to REST API
            axios.post(`/api/index.php/rest/pdfgen/projectdata`, data)
            .then(response => {
                console.log('response:', response.data); 
                setloading(false);
                toast.success(`Successfully Saved to EBSS!`);
                setFormError({})
            })
            .catch(error => {
                console.error('Error posting data:', error);
                setloading(false);
                toast.error("Failed to Save to EBSS");
            });
        }
    };


    // Method to save files to disk
    const saveFilesToDisk = async (files) => {
        const formData = new FormData();
        
        files.forEach(({ file, name }) => {
            if (file instanceof File) {
                formData.append('files', file);  
                formData.append('name', name);   
            } else {
                console.error('Not a valid File object:', file);
            }
        });
        // Log formData entries to see what is being sent
        console.log('FormData contents:');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        try {
            const response = await axios.post(`${baseURL}/api/savefiles`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Files saved:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error saving files:', error);
            return error;
        }
    };

      
    // const saveFilesToDisk = async (files) => {
    //     const formData = new FormData();
    //     console.log('files', files);
        
    //     files.forEach(({ file, name }) => {
    //         if (file instanceof File) {
    //             formData.append('files', file, file.name); 
    //             formData.append('name', name); 
    //             console.log("File: ", file, "Name: ", name);
    //         } else {
    //             console.error('Not a valid File object:', file);
    //         }
    //     });
    //     console.log('formData entries:');
    //     for (const [key, value] of formData.entries()) {
    //         console.log(`${key}: ${value}`);
    //     }
        
    //     try {
    //         const response = await axios.post(`${baseURL}/api/savefiles`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data',
    //             },
    //         });
    //         console.log('Files saved:', response.data);
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error saving files:', error);
    //         return error;
    //     }
    // };
    
    




  return (
    <div className="wrapper">

        {loading && (
            <div className="loader-D2">
                    <h6 className="loader-text">
                            Processing... 
                    </h6>
                    <RingLoader className="loader-spinner" color={'#123abc'} size={50} />
            </div>
        )}

      <div className="page-wrapper"  style={{ opacity: loading ? "0.2" : "" }}>
      <h4 className='' style={{ fontWeight: "700", textDecoration: "underline" }}>EBSS</h4>
      <h6 className='mb-4' style={{ fontSize: "1.1em", fontWeight: "400", width: "70%" }}>
      EBSS is a management interface designed to control and organize variables and data for seamless integration with the PdfGen Engine.
      This tool is essential for optimizing and streamlining the document production pipeline.
      </h6>

      <h6 className='' style={{ fontSize: "1.3em" }}><b>Project name:</b> {name}</h6>
      <h6 className='mb-5' style={{ fontSize: "1.3em"  }}><b>Product type:</b> {productType}</h6>

      <form onSubmit={handleSubmit} className='ebss-form'>

        {/* Production Type Select */}
        <div className="form-group d-flex">
            <div className='label-box'>
                <label className='ebss-label' htmlFor="productionType">Production Type</label>
                <p htmlFor="template">Set internal or external production type</p>
            </div>
            <div className='choice-box'>
                <select
                className={`ebss-selectlist ${formError.production_type ? 'alert-select' : ''}`}
                id="productionType"
                value={selectedProductionType}
                onChange={handleProductionTypeChange}
                >
                <option value="">Select Production Type</option>
                {productionTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                    {type.name}
                    </option>
                ))}
                </select>
                 <div>
                    <p className='mt-1 ml-2'>{productionTypes.find((type) => type.id === selectedProductionType)?.description}</p>
                </div>
            </div>
        </div>

        {/* Template Select */}
        <div className="form-group d-flex">
            <div className='label-box'>
                <label className='ebss-label' htmlFor="template">Template</label>
                <p htmlFor="template">Chooce template for selecting product type "{productType}"</p>
            </div>
            <div className='choice-box'>
                <select
                className={`ebss-selectlist ${formError.template ? 'alert-select' : ''}`}
                id="template"
                value={selectedTemplate}
                onChange={handleTemplateChange}
                >
                <option value="">Select Template</option>
                {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                    {template.name}
                    </option>
                ))}
                </select>
                <div>
                    <p className='mt-1 ml-2'>{templates.find((type) => type.id === selectedTemplate)?.description}</p>
                </div>
            </div>
        </div>


        {/* Dynamic Form Inputs */}
        {selectedTemplateObj && (
            <div className="form-group variable-box">
            {selectedTemplateObj.variables.map((variable) => (
                <div key={variable.name} className="form-field">
                {/* If require_confirmation is true, show the confirmation checkbox */}
                {variable.require_confirmation && (
                    <div className="d-flex form-group">
                        <div className='label-box'>
                            <label className='ebss-label' htmlFor={`${variable.name}_confirmation`}>
                                Confirm {variable.display_name}
                            </label>
                            <input
                                className="ml-2 custom-checkbox"
                                type="checkbox"
                                id={`${variable.name}_confirmation`}
                                checked={confirmationStatus[variable.name] || false}
                                onChange={(e) =>
                                handleConfirmationChange(variable.name, e.target.checked)
                                }
                            />
                        </div>
                    </div>
                )}

                {/* Conditionally render the input field based on confirmation status */}
                {(confirmationStatus[variable.name] || !variable.require_confirmation) && (
                    <>
                    {/* <label htmlFor={variable.name}>{variable.display_name}</label> */}
                    {variable.type === 'bool' && (
                        <div className='form-group d-flex'>
                            <div className='label-box'>
                                <input
                                className="mr-2 custom-checkbox"
                                type="checkbox"
                                id={variable.name}
                                checked={formData[variable.name] || false}
                                onChange={(e) =>
                                    handleInputChange(variable.name, e.target.checked)
                                }
                                />
                                <label className='ebss-label' htmlFor={variable.name}>{variable.display_name}</label>
                            </div>
                            <div className='choice-box'>
                                <p>{formData[variable.name] ? variable.description : ""}</p>
                            </div>
                        </div>
                    )}
                    {variable.type === 'number' && (
                         <div className='form-group d-flex'>
                            <div className='label-box'>
                                <label className='ebss-label' htmlFor={variable.name}>{variable.display_name}</label>
                            </div>
                            <div className='choice-box'>
                                <input
                                className={`form-input ${formError[variable.name] ? 'alert-select' : ''}`}
                                type="number"
                                id={variable.name}
                                value={formData[variable.name] || ''}
                                onChange={(e) =>
                                    handleInputChange(variable.name, e.target.value)
                                }
                                placeholder={variable.display_name}
                                />
                            </div>
                        </div>
                    )}
                    {variable.type === 'text' && (
                        <div className='form-group d-flex'>
                            <div className='label-box'>
                                <label className='ebss-label' htmlFor={variable.name}>{variable.display_name}</label>
                            </div>
                            <div className='choice-box'>
                                <input
                                className={`form-input ${formError[variable.name] ? 'alert-select' : ''}`}
                                type="text"
                                id={variable.name}
                                value={formData[variable.name] || ''}
                                onChange={(e) =>
                                    handleInputChange(variable.name, e.target.value)
                                }
                                placeholder={variable.display_name}
                                />
                            </div>
                        </div>
                    )}
                    {variable.type === 'file' && (
                        <div className='form-group d-flex'>
                            <div className='label-box'>
                                <label className='ebss-label' htmlFor="catalogueFile">{variable.display_name}</label>
                                <p htmlFor="template">{variable.description}</p>
                            </div>
                            <div className='choice-box'>
                                <input
                                className={`ml-2 hidden-file-input ${formError[variable.name] ? 'alert-select' : ''}`}
                                type="file"
                                id={variable.name}
                                onChange={(e) => handleFileChange(e, variable.name === 'catalog_file' ? setCatalogueFile : setLogoFile, variable.name)}
                                // accept={variable.name === 'catalog_file' ? '.pdf' : '.png,.jpeg'}
                                accept={variable.extra}
                                />
                                <label htmlFor={variable.name} 
                                className={`ml-2 custom-file-button ${formError[variable.name] ? 'alert-select' : ''}`}
                                >
                                    Choose File
                                </label>
                                {formData[variable.name] && (
                                <div className='ml-2 selectedfile-box'>
                                    <p>{formData[variable.name]?.name || formData[variable.name].split('/').pop()}
                                    <span
                                            className='ml-4'
                                            onClick={() => handleClearFile(variable.name)}
                                        >
                                        <FontAwesomeIcon icon={faTrash} className='removeFile-button' title="Remove file" />
                                    </span>
                                    </p>
                                </div>
                                )}
                            </div>
                        </div>
                    )}
                    </>
                )}
                <hr></hr>
            </div>
            ))}
            </div>
        )}

        {selectedTemplateObj && (
            <div className="mt-5 form-group d-flex">
                <div className='label-box'>
                    <input
                        className="mr-2 custom-checkbox productionactive-checkbox"
                        id="productionActive"
                        type="checkbox"
                        checked={formData["production_active"] || false}
                        onChange={(e) =>
                        handleInputChange("production_active", e.target.checked)
                        }
                    />
                    <label htmlFor="productionActive" className="ebss-label">Production Active</label>
                    <p htmlFor="template">A check to indicate whether the project should actively process and manage orders.</p>
                 </div>
                 {formData["production_active"] ? (
                 <div className='choice-box'>
                    <h6 style={{ fontSize: "1.1em" }}><i>true</i></h6>
                 </div>   
                 ) : (
                 <div className='choice-box'>
                    <h6 style={{ fontSize: "1.1em" }}><i>false</i></h6>
                 </div>
                 )}
            </div>
        )}
        
        <button
            className='button ebss-button my-4'
            type="submit"
            disabled={selectedTemplate === "" || selectedProductionType === ""}
        >Save To EBSS
        </button>
        <p style={{ marginTop: "-1em" }}><i>{selectedTemplate === "" || selectedProductionType === "" ? "Button is disabled until both Production Type and Template is set" : ""}</i></p>

      </form>
      </div>
      
      <ToastContainer 
        position="bottom-left"
        autoClose={false}
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

export default Ebss;