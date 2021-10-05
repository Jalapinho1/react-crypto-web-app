import { Fragment, useContext, useEffect, useState } from "react";
import { Button, Card, CardGroup, Col, Container, Row, Spinner } from "react-bootstrap";
import { AuthContext } from "../../store/auth-context";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { KeyContext } from "../../store/key-management-context";


const KeyManagement = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const authCtx = useContext(AuthContext);
    const keyCtx = useContext(KeyContext);

    useEffect(() => {
        if (!keyCtx.publicKey && !keyCtx.privateKey) {
            setIsLoading(true);

            fetch(`http://localhost:8080/api/getkeys`,
                {
                    method: 'GET',
                    headers: new Headers({
                        'Authorization': 'Bearer ' + authCtx.accessToken
                    })
                }
            ).then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    throw res;
                }
            }).then(data => {
                if (data.publicK && data.privateK) {
                    keyCtx.storeKeys(data.publicK, data.privateK);
                }
                setIsLoading(false);
            }).catch(err => {
                err.json().then((body) => {
                    setError(body.message);
                    setIsLoading(false);
                });
            });
        }
    }, [authCtx.accessToken, keyCtx]);

    const onGenerateKeysHandler = () => {
        setIsLoading(true);

        fetch(`http://localhost:8080/api/generatekeys`,
            {
                method: 'GET',
                headers: new Headers({
                    'Authorization': 'Bearer ' + authCtx.accessToken
                })
            }
        ).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        }).then(data => {
            keyCtx.storeKeys(data.publicK, data.privateK);
            setIsLoading(false);
        }).catch(err => {
            err.json().then((body) => {
                setError(body.message);
                setIsLoading(false);
            });
        });
    }

    let content;
    if (keyCtx.publicKey && keyCtx.privateKey) {
        content = <CardGroup className="mt-4">
            <Card>
                <Card.Header as="h5">Public key</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {keyCtx.publicKey}
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                    <CopyToClipboard
                        options={{ message: 'Whoa!' }}
                        text={keyCtx.publicKey}>
                        <Button>Copy Public Key To Clipboard </Button>
                    </CopyToClipboard>
                </Card.Footer>
            </Card>
            <Card>
                <Card.Header as="h5">Private key</Card.Header>
                <Card.Body>
                    <Card.Text>
                        {keyCtx.privateKey}
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                    <CopyToClipboard
                        options={{ message: 'Whoa!' }}
                        text={keyCtx.privateKey}>
                        <Button>Copy Private Key To Clipboard</Button>
                    </CopyToClipboard>
                </Card.Footer>
            </Card>
        </CardGroup>;
    } else if (!isLoading) {
        content = <Fragment>
            <Row>
                <Col className="fw-bold">
                    <p>No public key available!</p>
                </Col>
                <Col className="fw-bold">
                    <p>No private key available!</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button variant="primary" onClick={onGenerateKeysHandler}>
                        Generate keys
                    </Button>
                </Col>
            </Row>
        </Fragment>;
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col className="text-center " as="h4">
                    <p className="shadow-sm bg-primary text-white py-3 rounded" >
                        Here you have access to your keys
                    </p>
                    {isLoading &&
                        <div className="mb-3">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>}
                </Col>
            </Row>
            <hr className="mt-0" />
            {content}
            {error && <div className="text-danger my-3">
                {error}
            </div>}
        </Container >
    );
}

export default KeyManagement;