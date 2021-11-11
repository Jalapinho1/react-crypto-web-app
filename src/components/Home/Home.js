import { Card, Col, Container, Row } from "react-bootstrap";
import banner from '../../assets/1082blue2.jpg';
import sendImg from '../../assets/sendIlustrYellow.svg';
import encryptImg from '../../assets/encryptIlustrYellow.svg';
import keysImg from '../../assets/keysIlustrYellow.svg';
import { LazyLoadImage } from "react-lazy-load-image-component";

import classes from './Home.module.css';

const Home = () => {
    return (
        <>
            <Row className={classes.titleRow + " g-0 bg-primary text-center shadow-sm d-flex justify-content-center"}>
                <Col md="auto" className="d-flex align-items-center">
                    <h1 className="text-white fw-bold">
                        Cryptography <br /> Web App
                    </h1>
                </Col>
                <Col md="auto" className="pt-1">
                    <LazyLoadImage
                        width={630}
                        effect="blur"
                        src={banner}
                    ></LazyLoadImage>
                </Col>
            </Row>
            <Container className="my-4">
                <Row xs={1} md={2} lg={3} className="g-4">
                    <Col>
                        <Card className="shadow">
                            <Card.Body>
                                <div className="text-center my-2">
                                    <LazyLoadImage
                                        width={220}
                                        effect="blur"
                                        src={encryptImg}
                                    ></LazyLoadImage>
                                </div>
                                <Card.Title>
                                    Encrypt/Decrypt files for yourself
                                </Card.Title>
                                <Card.Text>
                                    Encrypt and decrypt files in seconds with combination
                                    of AES and RSA alghoritms, which are being used by many
                                    modern communication environments, including the internet.
                                    The alghoritms uses the RSA public - private key pair with
                                    the AES secret key.
                                    You can encrypt multiple types of files (.txt, .doc, .pdf).
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow">
                            <Card.Body>
                                <div className="text-center my-2">
                                    <LazyLoadImage
                                        width={220}
                                        effect="blur"
                                        src={sendImg}
                                    ></LazyLoadImage>
                                </div>
                                <Card.Title>Send & Comment files</Card.Title>
                                <Card.Text>
                                    Share files with your friends. Receivers public key will be used
                                    in the encryption process, so he will be the only one who is able
                                    to decrypt it.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className="shadow">
                            <Card.Body>
                                <div className="text-center my-3">
                                    <LazyLoadImage
                                        width={300}
                                        effect="blur"
                                        src={keysImg}
                                    ></LazyLoadImage>
                                </div>
                                <Card.Title>Generate a key pair</Card.Title>
                                <Card.Text>
                                    Generate public-private key pair for RSA encryption.
                                    These keys can be later used for data encryption.
                                    They have a universal use, so you can copy them
                                    for use outside this application.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Home;