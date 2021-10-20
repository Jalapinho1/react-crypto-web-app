import { useContext, useRef, useState } from "react";
import { Card, Container, Form, Spinner, Image } from "react-bootstrap";

import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";
import { KeyContext } from "../../store/key-management-context";

import classes from "./Auth.module.css";
import lock2 from "../../assets/authIlustrYellow.svg";
import useHttp from "../hooks/use-http";

const Login = () => {
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [imageDidLoad, setImageDidLoad] = useState(false);;
    const { isLoading, error, sendRequest: loginRequest, setIsLoading, setError } = useHttp();

    const authCtx = useContext(AuthContext);
    const keyCtx = useContext(KeyContext);

    const handleLoginResponse = (data) => {
        const accessToken = data.accessToken;
        const expirationDate = new Date(new Date().getTime() + 500 * 1000);

        authCtx.login(usernameInputRef.current.value, accessToken, "", expirationDate.toString());
        keyCtx.removeKeys();
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const username = usernameInputRef.current.value;
        const password = passwordInputRef.current.value;

        const userNameObject = {
            "username": username,
            "password": password
        };

        loginRequest({
            url: 'http://localhost:8080/api/auth/signin',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: userNameObject
        }, handleLoginResponse);
    }

    const togglePasswordVisibility = () => {
        setIsPasswordShown((prevState) => !prevState);
    }

    const onLoad = () => {
        setImageDidLoad(true);
    }

    let imageClasses;
    if (imageDidLoad) {
        imageClasses = classes.fadeIn + " " + classes.imageHome + " " + classes.logo;
    } else {
        imageClasses = classes.imageHome + " " + classes.logo;
    }

    return (
        <Container>
            <Card bg='light' className="shadow-sm light w-50 mx-auto mt-5">
                <Card.Body>
                    <Form className={classes.formSignin}>
                        <div className="text-center mx-auto" >
                            <Image
                                className={imageClasses}
                                src={lock2}
                                onLoad={onLoad}
                                rounded />
                        </div>
                        <h1 className="h3 my-4 text-center">Please login</h1>
                        <Form.Group controlId="formBasicUsername" className="mb-3 shadow-sm">
                            <Form.Control type="text" placeholder="Username" ref={usernameInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mb-3 shadow-sm">
                            <Form.Control type={isPasswordShown ? "text" : "password"} placeholder="Password" ref={passwordInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox" className="mb-3">
                            <Form.Check type="checkbox" label="Check me out"
                                onChange={() => togglePasswordVisibility()} />
                        </Form.Group>
                        <Form.Group>
                            <Button className="mb-2 w-100 shadow" variant="primary" type="submit" onClick={(event) => submitHandler(event)}>
                                Login
                            </Button>
                            {isLoading ?
                                <div className="mt-3">
                                    <span>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        Loading...
                                    </span>
                                </div>
                                : null}
                            <div className="text-danger my-2">
                                {error ? error : null}
                            </div>
                            <hr></hr>
                            <div className="text-center mt-4">
                                <span className="me-2">
                                    Dont have an account yet?
                                </span>
                                <Link className='btn btn-warning px-3 mx-auto shadow-sm' to={`/register`}>
                                    Register
                                </Link>
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Login;