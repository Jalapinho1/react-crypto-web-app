import { Fragment, useContext, useEffect, useState } from "react";
import { Button, Card, CardGroup, Container, Figure, Spinner } from "react-bootstrap";
import { AuthContext } from "../../store/auth-context";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { KeyContext } from "../../store/key-management-context";

import key from "../../assets/keyYellow.png";
import empty from "../../assets/emptyNotes.svg";
import classes from "./KeyManagement.module.css";

const KeyManagement = () => {
    const [imageDidLoad, setImageDidLoad] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const authCtx = useContext(AuthContext);
    const keyCtx = useContext(KeyContext);

    const onLoad = () => {
        setImageDidLoad(true);
    }

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
        content = <CardGroup className="my-4 shadow-sm">
            <Card>
                <Card.Header as="h5" className="text-center">
                    <Figure className={imageDidLoad ? classes.fadeIn + " " + classes.imageHome : classes.imageHome}>
                        <Figure.Image
                            className="shadow-sm"
                            width={230}
                            height={230}
                            alt="171x180"
                            src={key}
                            onLoad={onLoad}
                            roundedCircle
                        />
                    </Figure>
                    <Card.Title className="text-center">Public key</Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Text className={classes.keyDiv}>
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
                <Card.Header as="h5" className="text-center">
                    <Figure className={imageDidLoad ? classes.fadeIn + " " + classes.imageHome : classes.imageHome}>
                        <Figure.Image
                            className="shadow-sm"
                            width={230}
                            height={230}
                            alt="171x180"
                            src={key}
                            onLoad={onLoad}
                            roundedCircle
                        />
                    </Figure>
                    <Card.Title className="text-center">Private key</Card.Title>
                </Card.Header>
                <Card.Body className={classes.keyDiv}>
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
    } else {
        content = <Fragment>
            <div className="fw-bold text-center mx-auto">
                <h2>No keys available!</h2>
            </div>
            <div className="text-center mx-auto my-4">
                <Figure className={imageDidLoad ? classes.fadeIn + " " + classes.imageHome : classes.imageHome}>
                    <Figure.Image
                        width={250}
                        height={250}
                        alt="171x180"
                        src={empty}
                        onLoad={onLoad}
                    />
                </Figure>
            </div>
            <div className="text-center mx-auto">
                <Button variant="primary" size="lg" onClick={onGenerateKeysHandler}>
                    Generate keys
                </Button>
            </div>
        </Fragment >;
    }

    return (
        <Container className="mt-3">
            {content}
            {isLoading &&
                <div className="text-center my-3">
                    <Spinner animation="border" role="status" variant="warning">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>}
            {error && <div className="text-danger my-3">
                {error}
            </div>}
        </Container >
    );
}

export default KeyManagement;