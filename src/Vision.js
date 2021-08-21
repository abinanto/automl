import axios from "axios";
import React, { Component } from "react";
import "antd/dist/antd.css"; // or 'antd/dist/antd.less'
import { Carousel, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import ReactJson from "react-json-view";

const { Dragger } = Upload;

class Vision extends Component {
  state = {
    selectedFile: null,
    response:{payload:null,isLeft:false},
  };

  contentStyle = {
    height: "100%",
    color: "black",
    lineHeight: "160px",
    textAlign: "center",
  };

  fileData = () => {
    if (this.state.selectedFile) {
      return (
        <div>
          <h2>File Details:</h2>

          <p>File Name: {this.state.selectedFile.name}</p>

          <p>File Type: {this.state.selectedFile.type}</p>

          <p>
            Last Modified:{" "}
            {this.state.selectedFile.lastModifiedDate.toDateString()}
          </p>

          <p>Image response: {this.state.response}</p>
        </div>
      );
    } else {
      return (
        <div>
          <br />
          <h4>Choose before Pressing the Upload button</h4>
        </div>
      );
    }
  };

  onCarouselChange = (a, b, c) => {
    console.log(a, b, c);
  };

  onFileChange = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      selectedFilePath: (window.URL || window.webkitURL).createObjectURL(
        event.target.files[0]
      ),
    });
  };

  onFileUpload = () => {
    const formData = new FormData();
    formData.append("myFile", this.state.selectedFile);
    formData.append("path", this.state.selectedFilePath);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post("/uploadfile", formData, config).then((response) => {
      this.setState({ response });
      console.log(response, response.data.labels.isLeft ? "LEFT" : "RIGHT");
      response.data.labels.isLeft ? this.carousel.prev() : this.carousel.next();
    });
  };

  render() {
    return (
      <div>
        <div style={{ height: 50, width: "100%" }}>
          <button onClick={() => this.carousel.prev()}>Previous</button>
          <button onClick={() => this.carousel.next()}>Next</button>
        </div>
        <div style={{ height: 250, width: "100%", display: "inline-flex" }}>
          <div style={{ height: 250, width: "50%", display: "inline-flex" }}>
            <Dragger
              style={{ height: 150, width: "100%" }}
              name="file"
              showUploadList={false}
              customRequest={this.onFileUpload}
              onDrop={(e) => {
                console.log("Dropped files", e.dataTransfer.files[0]);
                this.setState({
                  selectedFile: e.dataTransfer.files[0],
                  selectedFilePath: (
                    window.URL || window.webkitURL
                  ).createObjectURL(e.dataTransfer.files[0]),
                });
              }}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from
                uploading company data or other band files
              </p>
            </Dragger>
          </div>
          <div
            style={{
              height: 250,
              width: "50%",
              display: "inline-flex",
              overflowY: "scroll",
              overflowX: "scroll",
            }}
          >
            <ReactJson
              collapsed={true}
              src={this.state.response.payload !== null ? this.state.response.payload : this.state.response}
              style={{ height: 250, width: "100%", display: "inline-flex" }}
            />
          </div>
        </div>
        <div style={{ height: "100%", width: "100%" }}>
          <Carousel
            ref={(node) => (this.carousel = node)}
            afterChange={this.onCarouselChange}
          >
            <div>
              <h3
                style={{
                  ...this.contentStyle,
                  background: "blue",
                  fontSize: 100,
                }}
              >
                1
              </h3>
            </div>
            <div style={{ height: "100%", width: "100%" }}>
              <h3
                style={{
                  ...this.contentStyle,
                  background: "red",
                  fontSize: 100,
                }}
              >
                2
              </h3>
            </div>
            <div style={{ height: "100%", width: "100%" }}>
              <h3
                style={{
                  ...this.contentStyle,
                  background: "yellow",
                  fontSize: 100,
                }}
              >
                3
              </h3>
            </div>
            <div style={{ height: "100%", width: "100%" }}>
              <h3
                style={{
                  ...this.contentStyle,
                  background: "green",
                  fontSize: 100,
                }}
              >
                4
              </h3>
            </div>
          </Carousel>
        </div>
      </div>
    );
  }
}

export default Vision;
