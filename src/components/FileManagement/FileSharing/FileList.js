import { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap";
import { AuthContext } from "../../../store/auth-context";

import { FaDownload } from "react-icons/fa";
import FileItemModal from './FileItem/FileItemModal';

import classes from './FileList.module.css';
import useHttp from "../../hooks/use-http";

const FileList = (props) => {
    const [files, setFiles] = useState([]);
    const [downloadedFile, setDownloadedFile] = useState();
    const [selectedFileId, setSelectedFileId] = useState(0);
    const [lgShow, setLgShow] = useState(false);

    const { isLoading, sendRequest: getFilesRequest } = useHttp();

    const authCtx = useContext(AuthContext);

    const handleFilesResponse = (data) => {
        setFiles(data);
    };

    const handleDownloadResponse = (data) => {
        const csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', downloadedFile.filename);
        tempLink.click();
        setDownloadedFile(null);
    };

    useEffect(() => {
        getFilesRequest({
            url: `http://localhost:8080/api/file/getrestriced?username=` + authCtx.username,
            headers: new Headers({
                'Authorization': 'Bearer ' + authCtx.accessToken
            })
        }, handleFilesResponse);
    }, [props.wasFileSent, authCtx.accessToken, authCtx.username, getFilesRequest]);

    useEffect(() => {
        if (downloadedFile) {
            getFilesRequest({
                url: "http://localhost:8080/api/file/download",
                method: 'POST',
                body: downloadedFile,
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }),
                isBlobOperation: true
            }, handleDownloadResponse)
        }
    }, [downloadedFile, authCtx.accessToken, getFilesRequest])

    const onDownloadHandler = (fileData) => {
        const formData = new FormData();
        formData.append("file", fileData);
        setDownloadedFile(fileData);
    }

    const renderTooltipOpen = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Open comments
        </Tooltip>
    );

    const renderTooltipDownload = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Download - file sent to you
        </Tooltip>
    );

    const onFileItemOpenHandler = (file) => {
        setSelectedFileId(file.id);
        setLgShow(true);
    }

    return (
        <Row className="mt-3">
            {isLoading &&
                <div className="text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>}
            <div>
                <Table className={classes.tableLong + " shadow-sm bg-white mt-1"} bordered hover>
                    <thead>
                        <tr>
                            <th>File name</th>
                            <th>Sender</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map(file => <tr key={file.id}>
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 200, hide: 200 }}
                                overlay={renderTooltipOpen}>
                                <td
                                    className={classes.pointercursor}
                                    onClick={() => onFileItemOpenHandler(file)}>
                                    {file.filename}
                                </td>
                            </OverlayTrigger>
                            <td>{file.senderUsername}</td>
                            <OverlayTrigger
                                placement="top"
                                delay={{ show: 250, hide: 400 }}
                                overlay={renderTooltipDownload}>
                                <td className="text-center">
                                    {file.downloadable &&
                                        <FaDownload
                                            onClick={() => onDownloadHandler(file)}>
                                        </FaDownload>
                                    }
                                </td>
                            </OverlayTrigger>
                        </tr>)}
                    </tbody>
                </Table>
            </div>
            {selectedFileId !== 0 &&
                <FileItemModal lgShow={lgShow} setLgShow={setLgShow} id={selectedFileId}></FileItemModal>}
        </Row>
    );
}

export default FileList;