import { useState, useRef, useContext } from "react";
import { Form, Button, Spinner, Card, Col, Row, Modal } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

import { AuthContext } from "../../../store/auth-context";

const FileSending = (props) => {
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
                props.onSuccessHandler();
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
        <Modal
            size="lg"
            show={props.lgShow}
            onHide={() => props.setLgShow(false)}
            aria-labelledby="example-modal-sizes-title-lg"
        >
            <Modal.Header closeButton>
                <Modal.Title id="example-modal-sizes-title-lg">
                    File Sending
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Card.Text className="text-justify">
                    Send encrypted files to another users. File will be encrypted with
                    the receiver public key. The receiver will be able to download it
                    from the table below. Files are decrypted on download.
                </Card.Text>
                <Form>
                    <Form.Group as={Col} controlId="formFile" className="mb-3" >
                        <Form.Label>Place receiver username</Form.Label>
                        <Form.Control type="text" placeholder="Username" ref={receiverInputRef} />
                    </Form.Group>
                    <Form.Group as={Col} controlId="formFile" className="mb-3" >
                        <Form.Label>Place your file here</Form.Label>
                        <Form.Control type="file" accept=".txt,.doc,.pdf" onChange={onChangeFile} />
                    </Form.Group>

                    <Form.Group controlId="formFile" className="mb-3" >
                        <Button className="" variant="primary" onClick={onSendHandler}>
                            <FaDownload className="mb-1"></FaDownload> Send
                        </Button>
                        {isLoading &&
                            <div className="mt-3">
                                <Spinner animation="border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </Spinner>
                            </div>}
                        {error && <div className="text-danger mt-3">
                            {error}
                        </div>}
                        {message && <div className="text-success mt-3">
                            {message}
                        </div>}
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default FileSending;