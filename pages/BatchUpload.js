import React, { Component, useCallback, useMemo, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { FadeLoader } from "react-spinners";
import {
  FormHelperText,
  Button,
  IconButton,
} from "@material-ui/core";
import 'abortcontroller-polyfill';
import { useDropzone } from "react-dropzone";
var controller = new AbortController();
let signal = controller.signal;
import CloseIcon from "@material-ui/icons/Close";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import _ from "lodash";
import CircularProgress from "../components/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
class SnackBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      open: this.props.open,
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({ open: nextProps.open });
  }
  handleClose = () => {
    this.setState((prevState) => {
      return {
        open: !prevState.open,
      };
    });
  };
  render() {
    return (
      <Snackbar
        open={this.state.open}
        autoHideDuration={this.props.timer?this.props.timer:6000}
        onClose={this.props.handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        className={this.props.className?this.props.className:""}
      >
        <Alert onClose={this.props.handleClose} severity={this.props.severity}>
          {this.props.alertmsg}
        </Alert>
      </Snackbar>
    );
  }
}

function Dropzone(props) {

    const [draggedFiles,setDraggedFiles] = useState([]);

    const onDrop = useCallback((files) => { files.map(file=> {
        draggedFiles.push(file)     
   }) 
      !files.length ? props.FileError("Multiple files are not supported.") : props.fileData(draggedFiles,"");
  });
   
  const onDropRejected = (rejectedFiles) => {
    return (
      rejectedFiles &&
      rejectedFiles.length &&
      rejectedFiles[0].errors.map((item) => {
        if (item.code === "file-too-large")
          props.FileError(
            "File is too large. The maximum file size allowed is 1 GB."
          );
        else return null;
      })
    );
  };

  const activeStyle = {
    backgroundColor: "#79B3C6",
  };

  let {
    getRootProps,
    getInputProps,
    open,
    acceptedFiles,
    fileRejections,
    isBatchActive,
    isBatchAccept,
    isBatchReject,
  } = useDropzone({
    // Disable click and keydown behavior
    noClick: true,
    noKeyboard: true,
    onDrop,
    onDropRejected,
    multiple: true,
    accept: ".jpeg, .jpg, .png, .dcm, .dicom, .zip, .mp3, .rar, .mp4",
    maxSize: 1073741824,
  });

  const [showProgress, setShowProgress] = useState(false);
 
  const style = useMemo(
    () => ({
      ...(isBatchActive ? activeStyle : {}),
    }),
    [isBatchActive, isBatchReject, isBatchAccept]
  );

  const formatBytes = (bytes, decimals = 2) =>{
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  const files =  acceptedFiles.map((file) => (
          <li key={file.path}>
            <span>
              {file.path} - {formatBytes(file.size)}
            </span>{" "}
            <IconButton
              onClick={(e) => {
                acceptedFiles.splice(acceptedFiles.indexOf(file), 1);
                props.removeFile(file);
              }}
            >
              <CloseIcon />
            </IconButton>
          </li>
        ));
  
  return (
    <div className="container">
      <div {...getRootProps({ className: "dropzone", style })}>
        <input {...getInputProps()} accept = ".jpeg, .jpg, .png, .dcm, .dicom, .zip, .rar, .mp3, .mp4" />
        <CloudUploadIcon />
        <p>Drag & Drop file here</p>
        <p>or</p>
        <Button onClick={()=>open()} disabled={showProgress}>Browse File</Button>
        {files.length && !props.removeAllFile && !showProgress? (
          <div className="fileContainer">
            <ul>{files}</ul>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

class BatchUpload extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading: false,
          open: false,
          severity: "",
          alertmsg: "",
          siteOptions: [],
          files: "",
          errors: {},
          errorMessages: {},
          isFileUpload: false,
          saveButtonDisabled: false,
          rescanmodal: false,
          uploading: false,
          fileCount: 0,
          showProgress:false,
        }; 
    }

    openDropZone = (items) => {
        return (
          <div className="UploadCt">
            <Dropzone
              fileData={(file, error) => this.fileData(file, items, error)}
              removeAllFile={!this.state.files.length}
              FileError={(err) => this.fileError(err)}
              removeFile={(file) => this.removeFile(file)}
              fileSaveButton={(val)=>this.setState({saveButtonDisabled:val})}
              uploadError={(error)=>this.setState({
                open: true,
                severity: "error",
                alertmsg: error,
                loading: false,
                isFileUpload: false,
                saveButtonDisabled: false,
                timer: 3000,
              })}
            />
            {this.state.fileErrorMsg ? (
              <FormHelperText>{this.state.fileErrorMsg}</FormHelperText>
            ) : (
              ""
            )}
          </div>
        );
    };

    fileError = (err) => {
        this.setState({ fileErrorMsg: err });
    };
    removeFile = (file) => {
        let { filename, files } = this.state;
        filename = filename.filter((item) => item.file.name !== file.name);
        files = files.filter((item) => item.name !== file.name);
        // console.log(filename,"Filename")
        if (files && !files.length)
          this.fileError("A file is mandatory.");
        this.setState({ filename, files ,rescanIntervaporId:undefined ,  rescan:false});
    };
    fileData = (file, formData, error) => {
        let noErrors = true;
        this.setState(
          {
            // errors,
            // errorMessages,
            files: file,
            fileErrorMsg: error ? error : "",
            saveButtonDisabled: error,
            uploading: error,
          },
          () => {
            if (noErrors) this.handleFileUpload();
          }
        );
    };
    fileType = (file) => {
        const filereader = new FileReader();
        const blob = file[0];
        filereader.onloadend = function (evt) {
          if (evt.target.readyState === FileReader.DONE) {
            const uint = new Uint8Array(evt.target.result);
            let bytes = [];
            uint.forEach((byte) => {
              bytes.push(byte.toString(16));
            });
            const hex = bytes.join("").toUpperCase();
            console.log(hex, "Hex code ");
          }
    
          console.timeEnd("FileOpen");
        };
    
        filereader.readAsArrayBuffer(blob);
    };


    fileUploadQuery = (url, request) =>
    fetch(url, request)
      .then((response) => response.json())
      .then((res) => { console.log(res)
        if (res.result && res.result.files) {
          if (res.result.files.ctscans.length) {
            const fileData = res.result.files.ctscans.map(
              (ctItem) => ctItem.name
            );
            return { fileData, error: null, apiCall: true };
          } else {
            return { fileData: [], error: null, apiCall: true };
          }
        } else {
          let message = res.error ? res.error.message : res.message;
          this.setState({
            open: true,
            severity: "error",
            alertmsg: message,
            uploading: false,
            isFileUpload: false,
            saveButtonDisabled: true,
            timer: 3000,
          });
          return { fileData: [], error: message, apiCall: true };
        }
      })
      .catch((error) => {
        this.setState({
          open: true,
          severity: "error",
          alertmsg: error.message,
          uploading: false,
          isFileUpload: false,
          saveButtonDisabled: true,
          timer: 3000,
        });
        return { fileData: [], error: error.message, apiCall: true };
    });

    cancelFileUpload = (e) => {
        controller.abort();
        this.setState((prevState) => {
          return { files: [], filename: null, saveButtonDisabled: false };
        });
      };

    handleFileUpload = async (fileStatus = [], UploadedFile = []) => {
        let { files } = this.state;
        if (files && files.length) {
          let formData = new FormData();
          let batchfiles = _.chunk(files, 20);
          let FileStatus = !fileStatus.length
            ? batchfiles.map((item) => {
                return { status: false, item };
              })
            : fileStatus;
          let uploadedFiles = UploadedFile;
          if (signal.aborted) {
            controller = new AbortController();
            signal = controller.signal;
          }
          var requestOptions = {
            method: "POST",
            body: formData,
            redirect: "follow",
            // headers: {
            //   access_token: localStorage.getItem("token"),
            // },
           signal: signal,
          };
          this.setState({
            saveButtonDisabled: true,
            uploading: true,
            filename: [],
          });
          await Promise.all(
            batchfiles.map(async (batchItem, batchIndex) => {
              formData.delete("ctscans");
              await Promise.all(
                batchItem.map(async (fileItem, index, arr) => {
                  if (arr.length === index + 1) {
                    formData.append("ctscans", fileItem);
                    if (
                      !FileStatus[batchIndex].status &&
                      (batchIndex === 0 ||
                        (FileStatus[batchIndex - 1] &&
                          FileStatus[batchIndex - 1].status === true))
                    ) {
                      let queryData = await this.fileUploadQuery(
                        "http://79a862d240df.ngrok.io/api/Containers/images/upload",
                        requestOptions
                      );
                      FileStatus[batchIndex].status = queryData.apiCall
                        ? true
                        : false;
                      if (FileStatus[batchIndex].status) {
                        uploadedFiles = [...uploadedFiles, ...queryData.fileData];
                        this.setState({ fileCount: uploadedFiles.length }, () =>
                          this.handleFileUpload(FileStatus, uploadedFiles)
                        );
                      }
                    }
                  } else {
                    formData.append("ctscans", fileItem);
                    return fileItem;
                  }
                })
              );
    
              return batchItem;
            })
          );
    
          if (FileStatus.filter((item) => item.status).length == FileStatus.length)
            this.setState({
              filename: uploadedFiles.map((item, index) => {
                return { uploadedFilename: item, file: files[index] };
              }),
              uploading: false,
              saveButtonDisabled: !(
                FileStatus.map((item) => item.item).flat().length === files.length
              ),
            });
        } else {
          this.setState({
            fileErrorMsg:
            files && files.length ? "" : "A file is mandatory",
            uploading: false,
            isFileUpload: false,
            saveButtonDisabled: false,
            filename: null,
            files: files,
          });
        }
    };

    render(){
        return(
            <div className="uploadCT">
                <div className="UploadForm">
                {this.state.uploading ? (
                <div className={`Loader Upload`}>
                    {!this.state.fileCount && (
                    <FadeLoader
                        style={{ height: "15", width: "5", radius: "2" }}
                        color={"#6FABF0"}
                        loading={this.state.uploading}
                    />
                    )}
                    <div>
                    {this.state.fileCount ? (
                        <div>
                        <CircularProgress
                            value={
                            (this.state.fileCount / this.state.files.length) * 100
                            }
                            className="uploadingLoader"
                        />
                        <h4>
                            Uploaded {this.state.fileCount} out of{" "}
                            {this.state.files.length} files
                        </h4>
                        </div>
                    ) : (
                        <h4>Uploading...</h4>
                    )}
                    <a onClick={this.cancelFileUpload} className="canceluploadbtn">
                        Cancel
                    </a>
                    </div>
                </div>
                ) : (
                ""
                )}
                
                {this.state.open ? (
                <SnackBarComponent
                    severity={this.state.severity}
                    open={this.state.open}
                    alertmsg={this.state.alertmsg}
                    timer={this.state.timer}
                    handleClose={this.handleSnackBarClose}
                    className="addUserSnackBar"
                />
                ) : (
                ""
                )}
                <h2>Upload Files</h2>
                    <div className="formComponent">
                        {
                            this.openDropZone()
                        }
                    </div>
                
                </div>
                
            </div>


        )
    }
}

export default BatchUpload;


