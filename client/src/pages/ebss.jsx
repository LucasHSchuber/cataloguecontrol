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


const Ebss = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    // Retrieve the 'uuid' and 'product' from the query string
    const uuid = query.get('uuid');
    const product = query.get('product');


    useEffect(() => {
        console.log("Received UUID:", uuid);
        console.log("Received PRODUCT TYPE:", product);
        setProductType(product);
    }, [uuid, product]);



    // State variables for each form field
    const [productType, setProductType] = useState('');
    const [productionType, setProductionType] = useState('');
    const [template, setTemplate] = useState('');
    const [catalogueFile, setCatalogueFile] = useState(null); //variable for duocat & school catalogue
    const [logoActive, setLogoActive] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [productionActive, setProductionActive] = useState(false);

    //variables
    const [allowSEF, setAllowSEF] = useState(false);
    const [allowReduced, setAllowReduced] = useState(false);
    const [overridePrice, setOverridePrice] = useState(false); //variable for duocat & photobook
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

    const [formError, setFormError] = useState({});

    // useEffect(() => {
    //     setSelectedProductionType(1)
    // }, []);




    // Fetch data from the API
    useEffect(() => {
    const fetchData = async () => {
        try {
        const response = await axios.get(`/api/index.php/rest/pdfgen/productdata`, {
            params: {
                product_type: product
            }
        });
        setProductionTypes(response.data.production_types);
        setTemplates(response.data.templates);
        console.log('response:', response.data);
        } catch (error) {
        console.error('Error fetching data:', error);
        }
    };
    const fetcProjecthData = async () => {
        try {
        const responseProjectData = await axios.get(`/api/index.php/rest/pdfgen/projectdata`, {
            params: {
                project_uuid: "9fba7984-ff60-4a44-8482-509024feb902",
                // project_uuid: uuid,
                product_type: product
            }
        });
        console.log('responseProjectData:', responseProjectData.data);
        if (responseProjectData.data.result !== null){
            console.log("NOT NULL")
            console.log("Result:", responseProjectData.data.result)
        } 
        } catch (error) {
        console.error('Error fetching project data:', error);
        }
    };
    fetchData();
    fetcProjecthData();
    }, []);


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
    setFormData({}); 
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
    setConfirmationStatus((prevStatus) => ({
      ...prevStatus,
      [name]: value,
    }));
  };

  // Find the selected template
  const selectedTemplateObj = templates.find(
    (template) => template.id === selectedTemplate
  );

  // Handle file changes
  const handleFileChange = (event, setFile, name) => {
    const file = event.target.files[0];
    console.log("Filename: ", file);
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
  



  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    let hasError = false;
    const missingFields = [];
    // Check if Production Type is selected
    if (!selectedProductionType) {
      missingFields.push("production_type");
      setFormError((prevData) => ({...prevData, production_type: true}));
      hasError = true;
    }
    // Check if Template is selected
    if (!selectedTemplate) {
      missingFields.push("template");
      setFormError((prevData) => ({...prevData, template: true}));
      hasError = true;
    }
    // Check required variables
    if (selectedTemplateObj) {
      selectedTemplateObj.variables.forEach((variable) => {
        const variableValue = formData[variable.name]
        const variableConfirmed = confirmationStatus[variable.name]

        if (variable.is_required && !variableValue) {
          missingFields.push(variable.name);
          setFormError((prevData) => ({...prevData, [variable.name]: true}));
          hasError = true;
        }
        if (variable.require_confirmation && (variableConfirmed && !variableValue)){
            console.error(`${variable.name} is confirmed but has no value.`);
            missingFields.push(variable.name);
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

    const jsonData = JSON.stringify({
        logo_file: formData["logo_file"]?.name,
        catalog_file: formData["catalog_file"]?.name,
        allow_sef: formData["allow_sef"],
        allow_reduced: formData["allow_reduced"],
        override_price: formData["override_price"],
        override_project_name: formData["override_project_name"],
        override_reduced_price: formData["override_reduced_price"],
    })
    console.log("jsonData: ", jsonData)

    const data = {
        project_uuid: uuid,
        product_type: product,
        production_type: productionTypes.find((type) => type.id === selectedProductionType)?.name,
        template: templates.find((type) => type.id === selectedTemplate)?.name,
        production_active: formData["production_active"],
        data: jsonData
    };
    console.log("data: ", data);

    try {
        const response = await axios.post(`${baseURL}/api/pdfgen_ebss`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
         })
          console.log('Successfully submitted form:', response.data);
          alert(`Succesfully sent data!`);

    } catch (error) {
        console.log('Error when submitted form:', error);
        console.log('Error: ', error.response.data.error);

    }
  };

    useEffect(() => {
      console.log('formData: ', formData);
    }, [formData]);

    useEffect(() => {
        console.log("FormError:", formError)
    }, [formError]);




  return (
    <div className="page-wrapper">
      <h4 className='' style={{ fontWeight: "700", textDecoration: "underline" }}>EBSS</h4>
      <h6 className='mb-5' style={{ fontSize: "1.1em", fontWeight: "400" }}>Lorem impus text place some text here</h6>

      <h6 className='mb-5' style={{ fontSize: "1.5em", fontWeight: "600" }}>Product type: {productType}</h6>

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
                                // className='ml-2 hidden-file-input'
                                className={`ml-2 hidden-file-input ${formError[variable.name] ? 'alert-select' : ''}`}
                                type="file"
                                id={variable.name}
                                // onChange={(e) =>
                                //     handleInputChange(variable.name, e.target.files[0])
                                // }
                                onChange={(e) => handleFileChange(e, variable.name === 'catalog_file' ? setCatalogueFile : setLogoFile, variable.name)}
                                accept={variable.name === 'catalog_file' ? '.pdf' : '.png,.jpeg'}
                                />
                                <label htmlFor={variable.name} 
                                // className="ml-2 custom-file-button"
                                className={`ml-2 custom-file-button ${formError[variable.name] ? 'alert-select' : ''}`}
                                >
                                    Choose File
                                </label>
                                {formData[variable.name] && (
                                <div className='ml-2 selectedfile-box'>
                                    <p>{formData[variable.name]?.name}
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
                    <p htmlFor="template">Lorem impsum text here to show what this means</p>
                 </div>
                 {formData["production_active"] ? (
                 <div className='choice-box'>
                    <h6>TRUE</h6>
                 </div>   
                 ) : (
                 <div className='choice-box'>
                    <h6>FALSE</h6>
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
  );
};

export default Ebss;