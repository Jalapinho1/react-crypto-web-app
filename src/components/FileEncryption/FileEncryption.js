import { useContext, useState } from "react";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import { AuthContext } from "../../store/auth-context";
import { KeyContext } from "../../store/key-management-context";

import { FaDownload } from "react-icons/fa";

const FileEncryption = () => {
    const [file, setFile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const authCtx = useContext(AuthContext);
    const keyCtx = useContext(KeyContext);

    const onChangeFile = e => {
        setFile(e.target.files[0]);
    };

    const encryptionHandler = async () => {
        setError('');
        setIsLoading(true);

        if (file.length === 0) {
            setError('Missing file');
            setIsLoading(false);
            return;
        }
        if (!keyCtx.publicKey) {
            setError('Missing public key');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("publicKey", keyCtx.publicKey);

        let response = await fetch(
            `http://localhost:8080/api/encrypt`,
            {
                method: 'POST',
                body: formData,
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken,
                    'Accept': 'application/json, text/plain, */*',
                    responseType: 'blob'
                })
            }
        );

        if (response.ok) {
            let fileType = response.headers.get('content-disposition');
            fileType = fileType.substr(fileType.length - 5);
            fileType = fileType.slice(0, -1);

            let data = await response.blob();

            const csvURL = window.URL.createObjectURL(data);
            const tempLink = document.createElement('a');
            tempLink.href = csvURL;
            tempLink.setAttribute('download', 'encrypted' + fileType);
            tempLink.click();
            setIsLoading(false);
        } else {
            response.json().then((body) => {
                setError(body.message);
                setIsLoading(false);
            });
        }

    }

    const decryptionHandler = async () => {
        setError('');
        setIsLoading(true);

        if (file.length === 0) {
            setError('Missing file');
            setIsLoading(false);
            return;
        }
        if (!keyCtx.publicKey) {
            setError('Missing public key');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("privateKey", keyCtx.privateKey);

        let response = await fetch(
            `http://localhost:8080/api/decrypt`,
            {
                method: 'POST',
                body: formData,
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken,
                    'Accept': 'application/json, text/plain, */*',
                    responseType: 'blob'
                })
            }
        );

        if (response.ok) {
            let fileType = response.headers.get('content-disposition');
            fileType = fileType.substr(fileType.length - 5);
            fileType = fileType.slice(0, -1);

            let data = await response.blob();

            const csvURL = window.URL.createObjectURL(data);
            const tempLink = document.createElement('a');
            tempLink.href = csvURL;
            tempLink.setAttribute('download', 'decrypted' + fileType);
            tempLink.click();
            setIsLoading(false);
        } else {
            response.json().then((body) => {
                setError(body.message);
                setIsLoading(false);
            });
        }
    }

    return (
        <Container className="mt-3">
            <Card bg='light' className="shadow-sm light w-75 mx-auto mt-4">
                <Card.Body>
                    <div>
                        <h4>File Encryption & Decryption</h4>
                    </div>
                    <Card.Text>
                        Here you can encrypt and decrypt your files (.txt/.doc/.pdf).
                        Asymetric cryptography (RSA 512 will be used).
                        Your file will be downloaded after encryption. Please make sure
                        you generated your public-private key pair.
                    </Card.Text>
                    <Form>
                        <Form.Group controlId="formFile" className="mb-4">
                            <Form.Label>Place your file here</Form.Label>
                            <Form.Control type="file" accept=".txt,.doc,.pdf" onChange={onChangeFile} />
                        </Form.Group>
                        <Form.Group controlId="formFile">
                            <Button className="me-3" variant="primary" onClick={encryptionHandler}>
                                <FaDownload className="mb-1"></FaDownload> Encrypt
                            </Button>
                            <Button variant="primary" onClick={decryptionHandler}>
                                <FaDownload className="mb-1"></FaDownload> Decrypt
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
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>

        </Container >
    );
}

export default FileEncryption;