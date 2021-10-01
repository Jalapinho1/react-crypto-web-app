import { useState, useRef, useContext } from "react";
import { Form, Button, Spinner, Card } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

import { AuthContext } from "../../store/auth-context";

const FileSending = () => {
    const receiverInputRef = useRef();
    const [file, setFile] = useState([]);
    const [isLoading, setIsLoading] = useState();
    const [error, setError] = useState();
    const [message, setMessage] = useState();

    const authCtx = useContext(AuthContext);

    const onChangeFile = e => {
        setFile(e.target.files[0]);
    };

    const onSendHandler = async () => {
        setError('');
        setMessage('');
        setIsLoading(true);

        if (file.length === 0) {
            setError('Missing file');
            setIsLoading(false);
            return;
        }
        if (!receiverInputRef.current) {
            setError('Missing username');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("receiver", receiverInputRef.current.value);
        formData.append("sender", authCtx.username);

        let response = await fetch(
            `http://localhost:8080/api/file/send`,
            {
                method: 'POST',
                body: formData,
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken
                })
            }
        );

        if (response.ok) {
            let data = await response.json();
            console.log(data);
            if (data) {
                setMessage('File sent succesfullly!');
                setIsLoading(false);
            } else {
                setError('Receiver doesnt exist!');
                setIsLoading(false);
            }
        } else {
            response.json().then((body) => {
                setError(body.message);
                setIsLoading(false);
            });
        }
    }

    return (
        <Card bg='light' className="light shadow-sm w-75 mx-auto my-4">
            <Card.Body>
                <div>
                    <h4>File Sending</h4>
                </div>
                <Card.Text className="text-justify">
                    Send encrypted files to another users. File will be encrypted with
                    the receiver public key. The receiver will be able to download it
                    from the table located on the right. Files are decrypted on download.
                </Card.Text>
                <Form>
                    <Form.Group controlId="formFile" className="mb-4">
                        <Form.Label>Place receiver username</Form.Label>
                        <Form.Control type="text" placeholder="Username" ref={receiverInputRef} />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-4">
                        <Form.Label>Place your file here</Form.Label>
                        <Form.Control type="file" accept=".txt,.doc,.pdf" onChange={onChangeFile} />
                    </Form.Group>
                    <Form.Group controlId="formFile">
                        <Button className="me-3" variant="primary" onClick={onSendHandler}>
                            <FaDownload className="mb-1"></FaDownload> Send
                        </Button>
                        {isLoading &&
                            <div className="mt-3">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>}
                        <div className="text-danger my-3">
                            {error ? error : null}
                        </div>
                        <div className="text-success my-3">
                            {message ? message : null}
                        </div>
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>);
}

export default FileSending;