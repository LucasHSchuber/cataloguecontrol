import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Ebss = () => {
    // State variables for each form field
    const [productType, setProductType] = useState('');
    const [productionType, setProductionType] = useState('');
    const [template, setTemplate] = useState('');
    const [catalogueFile, setCatalogueFile] = useState(null);
    const [logoActive, setLogoActive] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    const [productionActive, setProductionActive] = useState(false);

  // Handle file changes
  const handleFileChange = (event, setFile) => {
    setFile(event.target.files[0]);
    console.log(event)
  };

  // Handle form submit
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(event)

    console.log({
      productType,
      productionType,
      template,
      catalogueFile,
      logoActive,
      logoFile,
      productionActive,
    });
  };

  useEffect(() => {
    console.log(productType)
  }, [productType]);

  return (
    <div className="page-wrapper">
      <h6>EBSS</h6>

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
            <option value="playercards">Test</option>

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

        <button
            className='button' 
            type="submit"
        >Save
        </button>
      </form>
    </div>
  );
};

export default Ebss;