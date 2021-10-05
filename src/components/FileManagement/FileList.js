import { useContext, useEffect, useState } from "react";
import { OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap";
import { AuthContext } from "../../store/auth-context";

import { FaDownload } from "react-icons/fa";
import FileItemModal from './FileItem/FileItemModal';

import classes from './FileList.module.css';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

    const [selectedFileId, setSelectedFileId] = useState(0);
    const [lgShow, setLgShow] = useState(false);

    const authCtx = useContext(AuthContext);

    useEffect(() => {
        setIsLoading(true);

        fetch(
            `http://localhost:8080/api/file/getrestriced?username=` + authCtx.username,
            {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken
                })
            }
        ).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw response;
            }
        }).then(response => {
            setFiles(response);
            setIsLoading(false);
        }).catch(err => {
            err.json().then((body) => {
                setError(body.message);
                setIsLoading(false);
            });
        });
    }, []);

    const onDownloadHandler = async (fileData) => {
        setError('');
        setIsLoading(true);

        const formData = new FormData();
        formData.append("file", fileData);

        let response = await fetch(
            `http://localhost:8080/api/file/download`,
            {
                method: 'POST',
                body: JSON.stringify(fileData),
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                })
            }
        );

        if (response.ok) {
            let data = await response.blob();

            const csvURL = window.URL.createObjectURL(data);
            const tempLink = document.createElement('a');
            tempLink.href = csvURL;
            tempLink.setAttribute('download', fileData.filename);
            tempLink.click();
            setIsLoading(false);
        } else {
            response.json().then((body) => {
                setError(body.message);
                setIsLoading(false);
            });
        }
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
                <div>
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
            {selectedFileId != 0 &&
                <FileItemModal lgShow={lgShow} setLgShow={setLgShow} id={selectedFileId}></FileItemModal>}
        </Row>
    );
}

export default FileList;