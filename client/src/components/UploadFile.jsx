import axios from "axios";
import { useState } from "react";

function UploadFile() {
  const [data, setData] = useState("");
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) {
      console.log("No file selected");
      return;
    }

    const fd = new FormData();
    fd.append("file", file);
    axios.post("http://localhost:3000/api/upload", fd)
      .then((response) => {
        console.log(response.data)
// resonse.data is the array, use the data
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
      });
  };

  return (
    <>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Submit</button>
      </form>
    </>
  );
}

export default UploadFile; 