import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import axios from 'axios';

const Ebss = () => {
    const location = useLocation();
    const { uuid } = location.state || {};  // Retrieve uuid from state
  
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

    //variables for ducoat
    const [allowSEF, setAllowSEF] = useState(false);
    const [allowReduced, setAllowReduced] = useState(false);
    const [overridePrice, setOverridePrice] = useState(false); //variable for duocat & photobook
    const [overrideReducedPrice, setOverrideReducedPrice] = useState(false);
    const [overrideProductName, setOverrideProductName] = useState(false);
    const [newPrice, setNewPrice] = useState('');
    const [reducedPrice, setReducedPrice] = useState('');
    const [newProductName, setNewProductName] = useState('');
    

    //variables for school photobook

    

  // Handle file changes
  const handleFileChange = (event, setFile) => {
    setFile(event.target.files[0]);
    console.log(event)
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)

    const status = formCheck();

    console.log({
      uuid,  
      productType,
      productionType,
      template,
      catalogueFile,
      logoActive,
      logoFile,
      productionActive,
      allowSEF,
      allowReduced,
      overridePrice,
      overrideProductName,
      overrideReducedPrice,
      newPrice,
      reducedPrice,
      newProductName
    });
  };

  //checking values in form 
  const formCheck = () => {
    if (productType === "duocat"){
        if(productionType === ""){
            console.log("ALERT missing productiontype");
        }
        if(template === ""){
            console.log("ALERT missing template");
        }
        if (allowReduced && overrideReducedPrice && reducedPrice === "") {
            console.log("ALERT missing overrideprice");
        }
        if(!catalogueFile){
            console.log("ALERT missing catalogue file");
        }   
        if(overrideProductName && newProductName === ""){
            console.log("ALERT missing catalogue new product name");
        }   
        if(overridePrice && newPrice === ""){
            console.log("ALERT missing new price");
        }   
    } else if (productType === "photobook"){
        if(productionType === ""){
            console.log("ALERT missing productiontype");
        }
        if(template === ""){
            console.log("ALERT missing template");
        }
        if(!catalogueFile){
            console.log("ALERT missing catalogue file");
        }   
        if(overridePrice && newPrice === ""){
            console.log("ALERT missing new price");
        }   
    } else if (productType === "schoolcatalogue"){
        if(productionType === ""){
            console.log("ALERT missing productiontype");
        }
        if(template === ""){
            console.log("ALERT missing template");
        }
        if(!catalogueFile){
            console.log("ALERT missing catalogue file");
        }   
    }
  };

  useEffect(() => {
    console.log(productType)
  }, [productType]);

  return (
    <div className="page-wrapper">
      <h5>EBSS</h5>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productType">Product Type</label>
          <select
            className='ebss-selectlist'
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

        <div className="form-group">
          <label htmlFor="productionType">Production Type</label>
          <select
            className='ebss-selectlist'
            id="productionType"
            value={productionType}
            onChange={(e) => setProductionType(e.target.value)}
          >
            <option value="">Select Production Type</option>
            <option value="internal">Internal</option>
            <option value="external">External</option>
          </select>
        </div>

        <hr className='mt-4'></hr>

        {productType !== "" && (
        <h6 className='mb-3' >{productType.charAt(0).toUpperCase() + productType.slice(1)} ({productionType ? productionType : "?"})</h6>
        )}

        {productType !== "" && (
        <div>
            <div className="form-group">
            <label htmlFor="template">Template</label>
            <select
                className='ebss-selectlist'
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

            <div className="form-group">
            <label htmlFor="catalogueFile">Catalogue File</label>
            <input
                className='ml-2'
                id="catalogueFile"
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, setCatalogueFile)}
            />
            </div>

            {productType === "duocat" && (   
            <div className="form-group">
            <label htmlFor="logoActive" className="custom-checkbox-label">Logo Active</label>
            <input
                className="custom-checkbox"
                id="logoActive"
                type="checkbox"
                checked={logoActive}
                onChange={(e) => setLogoActive(e.target.checked)}
            />
            </div>
            )}

            {logoActive && (
            <div className="form-group">
                <label htmlFor="logoFile">Logo File</label>
                <input
                className='ml-2'
                id="logoFile"
                type="file"
                accept=".png,.jpeg"
                onChange={(e) => handleFileChange(e, setLogoFile)}
                />
            </div>
            )}

            <div className="form-group">
            <label htmlFor="productionActive" className="custom-checkbox-label">Production Active</label>
            <input
                className="custom-checkbox"
                id="productionActive"
                type="checkbox"
                checked={productionActive}
                onChange={(e) => setProductionActive(e.target.checked)}
            />
            </div>
            </div>
            )}

            {/* ------------------------------- VARIABLES FOR DUCOAT ------------------------------- */}
            {productType === "duocat" && (
            <div>
            {/* Allow SEF Checkbox */}
            <div className="form-group">
                <label htmlFor="allowSEF">Allow SEF</label>
                <input
                className="custom-checkbox"
                id="allowSEF"
                type="checkbox"
                checked={allowSEF}
                onChange={(e) => setAllowSEF(e.target.checked)}
                />
            </div>

            {/* Allow Reduced Checkbox */}
            <div className="" style={{ marginBottom: allowReduced ? "0" : "1em" }}>
            <label htmlFor="allowReduced">Allow Reduced</label>
                <input
                className="custom-checkbox"
                id="allowReduced"
                type="checkbox"
                checked={allowReduced}
                onChange={(e) => setAllowReduced(e.target.checked)}
                />
            </div>

            {/* Override Reduced Price Checkbox & Number Input (Only show if Allow Reduced is checked) */}
            {allowReduced && (
                <div className="form-group">
                <label htmlFor="overrideReducedPrice">Override Reduced Price</label>
                <input
                    className="custom-checkbox"
                    id="overrideReducedPrice"
                    type="checkbox"
                    checked={overrideReducedPrice}
                    onChange={(e) => setOverrideReducedPrice(e.target.checked)}
                />
                {overrideReducedPrice && (
                    <input
                    type="number"
                    className="reduced-price-input"
                    value={reducedPrice}
                    onChange={(e) => setReducedPrice(e.target.value)}
                    placeholder="Enter Reduced Price"
                    />
                )}
                </div>
            )}

            {/* Override Product Name Checkbox & Number Input */}
            <div className="form-group">
                <label htmlFor="overrideProductName">Override Product Name</label>
                <input
                className="custom-checkbox"
                id="overrideProductName"
                type="checkbox"
                checked={overrideProductName}
                onChange={(e) => setOverrideProductName(e.target.checked)}
                />
                {overrideProductName && (
                <input
                    type="text"
                    className="new-product-name-input"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    placeholder="Enter Product Name"
                />
                )}
            </div>
                    
        </div>
        )}

        {(productType === "duocat" || productType === "photobook") && (
            <div className="form-group">
                <label htmlFor="overridePrice">Override Price</label>
                <input
                    className="custom-checkbox"
                    id="overridePrice"
                    type="checkbox"
                    checked={overridePrice}
                    onChange={(e) => setOverridePrice(e.target.checked)}
                />
                {overridePrice && (
                    <input
                        type="number"
                        className="price-input"
                        value={newPrice}
                        onChange={(e) => setNewPrice(e.target.value)}
                        placeholder="Enter Price"
                    />
                )}
            </div>
        )}

    


        {/* ------------------------------- VARIABLES FOR SCHOOL CATALOGUE ------------------------------- */}

        {/* ------------------------------- VARIABLES FOR SCHOOL PHOTOBOOK ------------------------------- */}

        <button
            className='button' 
            type="submit"
            disabled={productType === ""}
        >Save
        </button>
      </form>
    </div>
  );
};

export default Ebss;