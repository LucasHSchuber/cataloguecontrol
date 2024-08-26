import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import axios from 'axios';

import {
	baseURL,
} from '../../../config/env.js';


const Ebss = () => {

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const uuid = query.get('uuid');

    useEffect(() => {
        console.log("Received UUID:", uuid);
    }, [uuid]);

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

    const [formError, setFormError] = useState({
        productType: false,
        productionType: false,
        template: false,
        catalogueFile: false,
        logoActive: false,
        logoFile: false,
        productionActive: false,
        allowSEF: false,
        allowReduced: false,
        overridePrice: false,
        overrideReducedPrice: false,
        overrideProjectName: false,
        newPrice: false,
        reducedPrice: false,
        newProjectName: false
    });


  // Handle file changes
  const handleFileChange = (event, setFile, fileType) => {
    const file = event.target.files[0];
    setFile(file);

    if (file) {
        setFormError((prevState) => ({ ...prevState, [fileType]: false }));
    }
  };

  // Handle form submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = formCheck()

    const hasError = Object.values(errors).some((error) => error === true);
    console.log(hasError)
    if (hasError){
        console.log("Form submission cancelled due to errors.");
        console.log(hasError)
        console.log(formError)
        return; 
    } else {
        
    }

    const jsonData = JSON.stringify({
        logoActive: logoActive,
        allowSEF: allowSEF,
        allowReduced: allowReduced,
        overridePrice: overridePrice,
        overrideProjectName: overrideProjectName,
        overrideReducedPrice: overrideReducedPrice,
        newPrice: newPrice,
        reducedPrice: reducedPrice,
        newProjectName: newProjectName
    })
    console.log("jsonData: ", jsonData)

    const data = {
        project_uuid: uuid,
        product_type: productType,
        production_type: productionType,
        template_name: template,
        production_active: productionActive ? 1 : 0,
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
    } catch (error) {
        console.log('Error when submitted form:', error);
        console.log('Error: ', error.response.data.error);

    }
  };

  //checking values in form 
  const formCheck = () => {
    let errors = {}; // Local object to track errors
  
    if (productType === "duocat") { 
      if (productionType === "") {
        console.log("ALERT missing productiontype");
        errors.productionType = true;
      }
      if (template === "") {
        console.log("ALERT missing template");
        errors.template = true;
      }
      if (allowReduced && overrideReducedPrice && reducedPrice === "") {
        console.log("ALERT missing overrideprice");
        errors.reducedPrice = true;
      }
      if (!catalogueFile) {
        console.log("ALERT missing catalogue file");
        errors.catalogueFile = true;
      }
      if (overrideProjectName && newProjectName === "") {
        console.log("ALERT missing new product name");
        errors.newProjectName = true;
      }
      if (overridePrice && newPrice === "") {
        console.log("ALERT missing new price");
        errors.newPrice = true;
      }
    } else if (productType === "photobook") {
      if (productionType === "") {
        console.log("ALERT missing productiontype");
        errors.productionType = true;
      }
      if (template === "" || !template) {
        console.log("ALERT missing template");
        errors.template = true;
      }
      if (!catalogueFile) {
        console.log("ALERT missing catalogue file");
        errors.catalogueFile = true;
      }
      if (overridePrice && newPrice === "") {
        console.log("ALERT missing new price");
        errors.newPrice = true;
      }
    } else if (productType === "schoolcatalogue") {
      if (productionType === "") {
        console.log("ALERT missing productiontype");
        errors.productionType = true;
      }
      if (template === "") {
        console.log("ALERT missing template");
        errors.template = true;
      }
      if (!catalogueFile) {
        console.log("ALERT missing catalogue file");
        errors.catalogueFile = true;
      }
    }
  
    setFormError(errors); 
    return errors; 
  };
  
    //remove alert-border
    useEffect(() => {
        // If the user selects a valid product type, remove the error border
        if (productType !== "") {
            setFormError((prevState) => ({ ...prevState, productType: false }));
        }
        if (productionType !== "") {
            setFormError((prevState) => ({ ...prevState, productionType: false }));
        }
        if (template !== "") {
            setFormError((prevState) => ({ ...prevState, template: false }));
        }
        if (catalogueFile) {
            setFormError((prevState) => ({ ...prevState, catalogueFile: false }));
        }
        if (reducedPrice !== "") {
            setFormError((prevState) => ({ ...prevState, reducedPrice: false }));
        }
        if (newProjectName !== "") {
            setFormError((prevState) => ({ ...prevState, newProjectName: false }));
        }
        if (newPrice !== "") {
            setFormError((prevState) => ({ ...prevState, newPrice: false }));
        }
        if (reducedPrice !== "") {
            setFormError((prevState) => ({ ...prevState, reducedPrice: false }));
        }
        if (newProjectName !== "") {
            setFormError((prevState) => ({ ...prevState, newProjectName: false }));
        }
    }, [productType, productionType, template, reducedPrice, newProjectName, newPrice, reducedPrice, newProjectName]);
        


  useEffect(() => {
    console.log(productType);
    console.log("FormError:", formError);
  }, [productType, formError]);

  return (
    <div className="page-wrapper">
      <h4 className='' style={{ fontWeight: "700", textDecoration: "underline" }}>EBSS</h4>
      <h6 className='mb-5' style={{ fontSize: "1.1em", fontWeight: "400" }}>Lorem impus text place some text here</h6>

      <form onSubmit={handleSubmit} className='ebss-form'>

        <div className="form-group d-flex">
             <div className='label-box'>
                    <label className='ebss-label' htmlFor="productType">Product Type</label>
                    <p htmlFor="template">Choose a product type</p>
            </div>
            <div className='choice-box'>
                <select
                    className={`ebss-selectlist ${formError.productType ? 'alert-select' : ''}`}
                    id="productType"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                >
                    <option value="">Select Product Type</option>
                    <option value="duocat">DuoCat</option>
                    <option value="schoolcatalogue">School Catalogue</option>
                    <option value="photobook">PhotoBook</option>
                </select>
            </div>
        </div>

        <hr className='mt-4 mb-2' style={{ border: "1px solid gray" }}></hr>
       
        {productType !== "" && (
           <div className='mt-3 mb-5'>
                <h5 style={{ fontWeight: "700", fontSize: "1.2em", }} >Product type: {productType.charAt(0).toUpperCase() + productType.slice(1)}</h5>
                <h6 style={{ fontSize: "1.1em", fontWeight: "400" }}>Enter data for product type {productType}  </h6>
            </div> 
        )}

        {productType !== "" && (
            <div>
                <div className="form-group d-flex">
                    <div className='label-box'>
                        <label className='ebss-label' htmlFor="productionType">Production Type</label>
                        <p htmlFor="template">Set internal or external production type</p>
                    </div>
                    <div className='choice-box'>
                        <select
                            className={`ebss-selectlist ${formError.productionType ? 'alert-select' : ''}`}
                            id="productionType"
                            value={productionType}
                            onChange={(e) => setProductionType(e.target.value)}
                        >
                            <option value="">Select Production Type</option>
                            <option value="internal">Internal</option>
                            <option value="external">External</option>
                        </select>
                    </div>
                </div>
                <hr></hr>

                <div className="form-group d-flex">
                    <div className='label-box'>
                        <label className='ebss-label' htmlFor="template">Template</label>
                        <p htmlFor="template">Chooce template for selecting product type</p>
                    </div>
                    <div className='choice-box'>
                        <select
                            className={`ebss-selectlist ${formError.template ? 'alert-select' : ''}`}
                            id="template"
                            value={template}
                            onChange={(e) => setTemplate(e.target.value)}
                        >
                            <option value="">Select Template</option>
                            {productType === "duocat" && (
                                <option value="playercards">Playercards</option>
                            )}
                        </select>
                    </div>
                </div>
                <hr></hr>

                <div className="form-group d-flex" style={{ height: "6em" }}>
                    <div className='label-box'>
                        <label className='ebss-label' htmlFor="catalogueFile">Catalogue File</label>
                        <p htmlFor="template">Chooce a catalogue file for the product</p>
                    </div>
                    <div className='choice-box'>
                        <input
                            className='ml-2 hidden-file-input'
                            id="catalogueFile"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => handleFileChange(e, setCatalogueFile, 'catalogueFile')}
                        />
                        <label htmlFor="catalogueFile" className="ml-2 custom-file-button">
                            Choose File
                         </label>
                        {/* Display error message if formError.catalogueFile is true */}
                        {formError.catalogueFile ? (
                            <p className='ml-2 mt-1 alert-text'>Missing catalogue file</p>
                        ) : (
                            // Display selected file if available
                            catalogueFile && (
                                <div className='ml-2 mt-1' style={{ fontWeight: "500", fontSize: "1.1em" }}>
                                     <p>
                                        {catalogueFile.name}
                                        <span
                                            className='ml-4'
                                            onClick={() => setCatalogueFile(null)}
                                            style={{ cursor: 'pointer', color: 'red', marginLeft: '15px' }}
                                        >
                                            X
                                        </span>
                                    </p>
                                </div>
                            )
                        )}
                    </div>
                </div>
                <hr></hr>

                {productType === "duocat" && (   
                   <div className='form-group d-flex' style={{ height: "5em" }}> 
                        <div className="label-box">
                            <label htmlFor="logoActive" className="ebss-label">Logo Active</label>
                            <input
                                className="ml-2 custom-checkbox"
                                id="logoActive"
                                type="checkbox"
                                checked={logoActive}
                                onChange={(e) => setLogoActive(e.target.checked)}
                            />
                        </div>
                        {logoActive && (
                        <div className="choice-box">
                            <input
                            className='ml-2 hidden-file-input'
                            id="logoFile"
                            type="file"
                            accept=".png,.jpeg"
                            onChange={(e) => handleFileChange(e, setLogoFile, 'logoFile')}
                            />
                            <label htmlFor="catalogueFile" className="ml-2 custom-file-button">
                            Choose File
                         </label>
                        </div>
                        )}
                    </div>   
                )}
                <hr></hr>
            </div>
            )}

            {/* ------------------------------- VARIABLES FOR DUCOAT ------------------------------- */}
            {productType === "duocat" && (
            <div>
                <div className="form-group d-flex" style={{ height: "3em" }}>
                    <div className='label-box'>
                        <label htmlFor="overrideProjectName" className='ebss-label'>Override Project Name</label>
                        <input
                        className="ml-2 custom-checkbox"
                        id="overrideProjectName"
                        type="checkbox"
                        checked={overrideProjectName}
                        onChange={(e) => setOverrideProjectName(e.target.checked)}
                        />
                    </div>
                    {overrideProjectName && (
                        <div className='choice-box'>
                            <input
                                type="text"
                                className={`form-input ${formError.newProjectName ? 'alert-select' : ''}`}
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                placeholder="Enter Project Name"
                            />
                        </div>   
                    )}
                </div>
                <hr></hr>
            </div>
            )}

            {(productType === "duocat" || productType === "photobook") && (
                <div>
                    <div className="form-group d-flex" style={{ height: "3em" }}>
                        <div className='label-box'>
                            <label htmlFor="overridePrice" className='ebss-label'>Override Price</label>
                            <input
                                className="ml-2 custom-checkbox"
                                id="overridePrice"
                                type="checkbox"
                                checked={overridePrice}
                                onChange={(e) => setOverridePrice(e.target.checked)}
                            />
                        </div>   
                        {overridePrice && (
                        <div className='choice-box'>
                            <input
                                type="number"
                                className={`form-input ${formError.newPrice ? 'alert-select' : ''}`}
                                value={newPrice}
                                onChange={(e) => setNewPrice(e.target.value)}
                                placeholder="Enter Price"
                            />
                        </div>
                        )}
                    </div>
                    <hr></hr>
                </div>
            )}
        

            {productType === "duocat" && (
                <div>
                    <div className='d-flex'>
                        {/* Allow Reduced Checkbox */}
                        <div className="label-box form-group" style={{ marginBottom: allowReduced ? "0" : "0" }}>
                            <label htmlFor="allowReduced" className='ebss-label'>Allow Reduced</label>
                            <input
                                className="ml-2 custom-checkbox"
                                id="allowReduced"
                                type="checkbox"
                                checked={allowReduced}
                                onChange={(e) => setAllowReduced(e.target.checked)}
                            />                        
                            {/* Override Reduced Price Checkbox & Number Input (Only show if Allow Reduced is checked) */}
                            {allowReduced && (
                            <div className="form-group">
                                <input
                                    className="mr-2 custom-checkbox"
                                    id="overrideReducedPrice"
                                    type="checkbox"
                                    checked={overrideReducedPrice}
                                    onChange={(e) => setOverrideReducedPrice(e.target.checked)}
                                />
                                <label htmlFor="overrideReducedPrice">Override Reduced Price</label>
                                
                            </div>
                            )}
                        </div>
                        {overrideReducedPrice && (
                        <div className='choice-box' style={{ marginTop: "1.5em" }}>
                            <input
                            type="number"
                            className={`form-input ${formError.reducedPrice ? 'alert-select' : ''}`}
                            value={reducedPrice}
                            onChange={(e) => setReducedPrice(e.target.value)}
                            placeholder="Enter Reduced Price"
                            />
                        </div>
                        )}
                    </div>
                    <hr></hr>

                     {/* Allow SEF Checkbox */}
                     <div className="form-group">
                        <input
                        className="mr-2 custom-checkbox"
                        id="allowSEF"
                        type="checkbox"
                        checked={allowSEF}
                        onChange={(e) => setAllowSEF(e.target.checked)}
                        />
                        <label htmlFor="allowSEF">Allow SEF</label>
                    </div>
                </div>
            )}

            {productType !== "" && (
            <div className="form-group mt-3">
                <input
                    className="mr-2 custom-checkbox"
                    id="productionActive"
                    type="checkbox"
                    checked={productionActive}
                    onChange={(e) => setProductionActive(e.target.checked)}
                />
                <label htmlFor="productionActive" className="custom-checkbox-label">Production Active</label>
            </div>
            )}
    

        <button
            className='button my-4' 
            type="submit"
            disabled={productType === ""}
        >Save
        </button>
      </form>
    </div>
  );
};

export default Ebss;