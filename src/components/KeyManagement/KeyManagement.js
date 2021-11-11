import { Fragment, useContext, useEffect } from "react";
import { Button, Card, CardGroup, Container, Spinner } from "react-bootstrap";
import { AuthContext } from "../../store/auth-context";

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { KeyContext } from "../../store/key-management-context";
import { LazyLoadImage } from "react-lazy-load-image-component";

import key from "../../assets/keyYellow.png";
import empty from "../../assets/emptyNotes.svg";
import classes from "./KeyManagement.module.css";
import useHttp from "../hooks/use-http";

const KeyManagement = () => {
    const { isLoading, error, sendRequest: keysRequest } = useHttp();

    const authCtx = useContext(AuthContext);
    const keyCtx = useContext(KeyContext);

    const handleResponseGenerateKeys = (data) => {
        keyCtx.storeKeys(data.publicK, data.privateK);
    };

    useEffect(() => {
        const handleResponseGetKeys = (data) => {
            if (data && data.publicK && data.privateK) {
                keyCtx.storeKeys(data.publicK, data.privateK);
            }
        };

        keysRequest({
            url: 'http://localhost:8080/api/getkeys',
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + authCtx.accessToken
            })
        }, handleResponseGetKeys);
    }, [authCtx.accessToken, keyCtx.publicKey, keyCtx.privateKey, keyCtx, keysRequest]);


    const onGenerateKeysHandler = () => {
        keysRequest({
            url: 'http://localhost:8080/api/generatekeys',
            method: 'GET',
            headers: new Headers({
                'Authorization': 'Bearer ' + authCtx.accessToken
            })
        }, handleResponseGenerateKeys);
    }

    let content;
    if (keyCtx.publicKey && keyCtx.privateKey) {
        content = <CardGroup className="my-4 shadow-sm">
            <Card>
                <Card.Header as="h5" className="text-center">
                    <LazyLoadImage
                        height={230}
                        width={230}
                        className="shadow-sm rounded-circle"
                        effect="blur"
                        src={key}
                    ></LazyLoadImage>
                    <Card.Title className="text-center mt-4">Public key</Card.Title>
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
                    <LazyLoadImage
                        height={230}
                        width={230}
                        className="shadow-sm rounded-circle"
                        effect="blur"
                        src={key}
                    ></LazyLoadImage>
                    <Card.Title className="text-center mt-4">Private key</Card.Title>
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
                <LazyLoadImage
                    width={250}
                    className="w-100"
                    effect="blur"
                    src={empty}
                ></LazyLoadImage>
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