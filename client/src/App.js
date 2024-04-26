import React from "react";
import FileUpload from "./FileUpload/fileUploader";

function App() {


  return (
    <div  style={{background: '#33E6FF', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
     
      <FileUpload/>
    
    </div>
  );
}

export default App;
