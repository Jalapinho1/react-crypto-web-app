import { useContext, useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
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

    let buttons;
    let keyContent;
    if (keyCtx.publicKey && keyCtx.privateKey) {
        keyContent = <Row>
            <Col className="text-break">
                {keyCtx.publicKey}
            </Col>
            <Col className="text-break">
                {keyCtx.privateKey}
            </Col>
        </Row>;
        buttons = <Row className="mb-3">
            <Col xs={6}>
                <CopyToClipboard
                    // onCopy={this.onCopyPublicKey}
                    options={{ message: 'Whoa!' }}
                    text={keyCtx.publicKey}>
                    <Button>Copy Public Key To Clipboard </Button>
                </CopyToClipboard>
            </Col>
            <Col>
                <CopyToClipboard
                    // onCopy={this.onCopyPrivateKey}
                    options={{ message: 'Whoa!' }}
                    text={keyCtx.privateKey}>
                    <Button>Copy Private Key To Clipboard</Button>
                </CopyToClipboard>
            </Col>
        </Row >
    } else if (!isLoading) {
        keyContent = <Row>
            <Col className="text-break">
                <p>No public key available!</p>
            </Col>
            <Col className="text-break">
                <p>No public key available!</p>
            </Col>
        </Row>;
        buttons = <Row>
            <Col>
                <Button variant="primary" onClick={onGenerateKeysHandler}>
                    Generate keys
                </Button>
            </Col>
        </Row>;
    }

    return (
        <Container className="mt-3">
            <Row>
                <Col className="fw-bold">
                    <p>Here you have access to your keys</p>
                    {isLoading &&
                        <div className="mb-3">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>}
                </Col>
            </Row>
            <Row>
                <Col className="fw-bold">
                    <p>Public key</p>
                </Col>
                <Col className="fw-bold">
                    <p>Private key</p>
                </Col>
            </Row>
            {keyContent}
            {buttons}
            <div className="text-danger my-3">
                {error ? error : null}
            </div>
        </Container>
    );
}

export default KeyManagement;