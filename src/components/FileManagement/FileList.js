import { Fragment, useContext, useEffect, useState } from "react";
import { Card, OverlayTrigger, Row, Spinner, Table, Tooltip } from "react-bootstrap";
import { AuthContext } from "../../store/auth-context";

import { FaDownload } from "react-icons/fa";

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();

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

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Download - file sent to you
        </Tooltip>
    );

    return (
        <Card bg='light' className="shadow-sm my-4">
            <Card.Body>
                <Row>
                    <h4 className="text-left mt-2">File list</h4>
                </Row>
                <Row>
                    {isLoading &&
                        <div>
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>}
                    <div>
                        <Table className="shadow-sm bg-white mt-3" bordered hover>
                            <thead>
                                <tr>
                                    <th>File name</th>
                                    <th>Sender</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {files.map(file => <tr key={file.id}>
                                    <td>{file.filename}</td>
                                    <td>{file.senderUsername}</td>
                                    <OverlayTrigger
                                        placement="top"
                                        delay={{ show: 250, hide: 400 }}
                                        overlay={renderTooltip}>
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
                </Row>
            </Card.Body>
        </Card>
    );
}

export default FileList;