import { useRef, useState } from "react";
import { Card, Container, Form, Image, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

import classes from "./Auth.module.css";
import register from "../../assets/securityIlustrYellow.svg";
import useHttp from "../hooks/use-http";

const Register = () => {
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const passwordRepeatInputRef = useRef();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [imageDidLoad, setImageDidLoad] = useState(false);

    const { isLoading, error, sendRequest: registerRequest, setIsLoading, setError } = useHttp();

    const history = useHistory();

    const handleRegisterResponse = (data) => {
        alert(data.message);
        history.push("/login");
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const username = usernameInputRef.current.value;
        const password = passwordInputRef.current.value;
        const passwordRepeat = passwordRepeatInputRef.current.value;

        if (password !== passwordRepeat) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const userNameObject = {
            "username": username,
            "password": password
        };


        registerRequest({
            url: 'http://localhost:8080/api/auth/signup',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: userNameObject
        }, handleRegisterResponse);
    }

    const togglePasswordVisibility = () => {
        setIsPasswordShown((prevState) => !prevState);
    }

    const onLoad = () => {
        setImageDidLoad(true);
    }

    let imageClasses;
    if (imageDidLoad) {
        imageClasses = classes.fadeIn + " " + classes.imageHome + " " + classes.logo2;
    } else {
        imageClasses = classes.imageHome + " " + classes.logo2;
    }

    return (
        <Container>
            <Card bg='light' className="shadow-sm light w-50 mx-auto mt-5">
                <Card.Body>
                    <Form className={classes.formSignin} onSubmit={submitHandler} autoComplete="off">
                        <div className="text-center mx-auto" >
                            <Image
                                className={imageClasses}
                                src={register}
                                onLoad={onLoad}
                                rounded
                            />
                        </div>
                        <h1 className="h3 my-4 text-center">Please register</h1>
                        <Form.Group controlId="formBasicUsername" className="mb-3 shadow-sm">
                            <Form.Control type="text" placeholder="Username" ref={usernameInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mb-3 shadow-sm">
                            <Form.Control type={isPasswordShown ? "text" : "password"} placeholder="Password" ref={passwordInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mb-3 shadow-sm">
                            <Form.Control type={isPasswordShown ? "text" : "password"} placeholder="Repeat Password" ref={passwordRepeatInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox" className="mb-3">
                            <Form.Check type="checkbox" label="Check me out"
                                onChange={() => togglePasswordVisibility()} />
                        </Form.Group>
                        <Form.Group>
                            <Button className="mb-2 w-100 shadow" variant="primary" type="submit" >
                                Register
                            </Button>
                            {isLoading ?
                                <div className="ml-2 mt-3">
                                    <span>
                                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                        Loading...
                                    </span>
                                </div>
                                : null}
                            <div className="text-danger my-3">
                                {error ? error : null}
                            </div>
                            <hr></hr>
                            <div className="text-center mx-auto">
                                <span className="me-2">
                                    Already have an account?
                                </span>
                                <Link className='btn btn-warning px-3 mx-auto shadow-sm' to={`/login`}>
                                    Login
                                </Link>
                            </div>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Register;