import axios from "axios";
import React, { Component } from "react";
import "../css/EditPhoto.css";

class EditPhoto extends Component {
  state = {
    selectedFile: null,
    errorMessage: "",
  };

  onFileChange = (event) => {
    const file = event.target.files[0];
    const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

    if (file && validImageTypes.includes(file.type)) {
      this.setState({
        selectedFile: file,
        errorMessage: "",
      });
    } else {
      this.setState({
        selectedFile: null,
        errorMessage: "Please select a valid photo file (JPEG, PNG, GIF).",
      });
    }
  };

  onFileUpload = async () => {
    if (!this.state.selectedFile) {
      this.setState({
        errorMessage: "No file selected. Please select a photo file first.",
      });
      return;
    }

    const formData = new FormData();
    formData.append(
      "myFile",
      this.state.selectedFile,
      this.state.selectedFile.name
    );

    try {
      const response = await axios.post("api/uploadfile", formData);

      // Assuming the response contains the URL of the uploaded image
      if (response.data && response.data.fileUrl) {
        this.props.onUploadSuccess(response.data.fileUrl);
      }
    } catch (error) {
      console.error("Error uploading the file", error);
    }
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h4>Detail Photo:</h4>
          <p>File Name: {this.state.selectedFile.name}</p>
          <p>File Type: {this.state.selectedFile.type}</p>
          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>
        </div>
      );
    }
  };

  render() {
    return (
      <div>
        <div className="container-editphoto">
          <input type="file" onChange={this.onFileChange} />
          <button onClick={this.onFileUpload}>Upload!</button>
        </div>
        {this.state.errorMessage && (
          <p style={{ color: "red" }}>{this.state.errorMessage}</p>
        )}
        {this.fileData()}
      </div>
    );
  }
}

export default EditPhoto;
