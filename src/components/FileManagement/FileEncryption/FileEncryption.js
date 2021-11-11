import { useContext, useState } from "react";
import { Form, Button, Container, Card, Spinner } from "react-bootstrap";
import { AuthContext } from "../../../store/auth-context";
import { KeyContext } from "../../../store/key-management-context";
import { LazyLoadImage } from "react-lazy-load-image-component";

import { FaDownload } from "react-icons/fa";
import cryptoImg from '../../../assets/downloadImg.svg';
import useHttp from "../../hooks/use-http";

const FileEncryption = () => {
    const [file, setFile] = useState([]);
    const { isLoading, error, sendRequest: localCryptographyRequest, setIsLoading, setError } = useHttp();

    const authCtx = useContext(AuthContext);
    const keyCtx = useContext(KeyContext);

    const onChangeFile = e => {
        setFile(e.target.files[0]);
    };

    const handleEncryptResponse = (data, outputData) => {
        let newFileName;

        const oldFileName = file.name;
        const alreadyProcessed = oldFileName.includes("Encrypted") || oldFileName.includes("Decrypted");
        if (alreadyProcessed) {
            newFileName = outputData.outputFileName + ' ' + file.name.slice(9);
        } else {
            newFileName = outputData.outputFileName + ' ' + file.name;
        }
        const csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', newFileName);
        tempLink.click();
    };

    const encryptionHandler = async () => {
        if (file.length === 0) {
            setError('Missing file');
            setIsLoading(false);
            return;
        }
        if (!keyCtx.publicKey) {
            setError('Missing public key! Please generate one in Key management page.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("publicKey", keyCtx.publicKey);

        localCryptographyRequest({
            url: 'http://localhost:8080/api/encrypt',
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + authCtx.accessToken,
                'Accept': 'application/json, text/plain, */*',
                responseType: 'blob'
            }),
            body: formData,
            isBlobOperation: true,
            outputData: { outputFileName: 'Encrypted' }
        }, handleEncryptResponse);
    }

    const decryptionHandler = async () => {
        if (file.length === 0) {
            setError('Missing file');
            setIsLoading(false);
            return;
        }
        if (!keyCtx.publicKey) {
            setError('Missing public key! Please generate one in Key management page.');
            setIsLoading(false);
            return;
        }

        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("privateKey", keyCtx.privateKey);

        localCryptographyRequest({
            url: 'http://localhost:8080/api/decrypt',
            method: 'POST',
            headers: new Headers({
                'Authorization': 'Bearer ' + authCtx.accessToken,
                'Accept': 'application/json, text/plain, */*',
                responseType: 'blob'
            }),
            body: formData,
            isBlobOperation: true,
            outputData: { outputFileName: 'Decrypted' }
        }, handleEncryptResponse);
    }

    return (
        <Container className="mt-3">
            <Card className="shadow-sm mt-4">
                <div className="bg-light py-3 text-center shadow-sm">
                    <LazyLoadImage
                        height={250}
                        width={250}
                        effect="blur"
                        src={cryptoImg}
                    ></LazyLoadImage>
                </div>
                <Card.Body className='p-4'>
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
                            <Button className="me-3 shadow-sm" variant="primary" onClick={encryptionHandler}>
                                <FaDownload className="mb-1"></FaDownload> Encrypt
                            </Button>
                            <Button className="shadow-sm" variant="primary" onClick={decryptionHandler}>
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