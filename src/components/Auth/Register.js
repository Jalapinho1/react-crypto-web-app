import { useContext, useRef, useState } from "react";
import { Card, Container, Form, Image, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";

import classes from "./Auth.module.css";
import register from "../../assets/register.png";

const Register = () => {
    const usernameInputRef = useRef();
    const passwordInputRef = useRef();
    const passwordRepeatInputRef = useRef();
    const [isPasswordShown, setIsPasswordShown] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const history = useHistory();

    const authCtx = useContext(AuthContext);

    const submitHandler = (event) => {
        event.preventDefault();

        setIsLoading(true);
        setError('');

        const username = usernameInputRef.current.value;
        const password = passwordInputRef.current.value;
        const passwordRepeat = passwordRepeatInputRef.current.value;

        if (password != passwordRepeat) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        const userNameObject = {
            "username": username,
            "password": password
        };

        console.log(username);
        console.log(password);

        fetch(
            `http://localhost:8080/api/auth/signup`,
            {
                method: 'POST',
                body: JSON.stringify(userNameObject),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        ).then(res => {
            if (res.ok) {
                return res.json();
            } else {
                throw res;
            }
        }).then(res => {
            alert(res.message);
            history.push("/login");
        }).catch(err => {
            console.log('Error!');
            err.json().then((body) => {
                setError(body.message);
                setIsLoading(false);
            });
        });
    }

    const togglePasswordVisibility = () => {
        setIsPasswordShown((prevState) => !prevState);
    }

    return (
        <Container>
            <Card bg='light' className="light w-50 mx-auto mt-5">
                <Card.Body>
                    <Form className={classes.formSignin}>
                        <div className="text-center mx-auto" >
                            <Image className={classes.logo} src={register} rounded />
                        </div>
                        <h1 class="h3 my-4 text-center">Please register</h1>
                        <Form.Group controlId="formBasicUsername" className="mb-3">
                            <Form.Control type="text" placeholder="Username" ref={usernameInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Control type={isPasswordShown ? "text" : "password"} placeholder="Password" ref={passwordInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Control type={isPasswordShown ? "text" : "password"} placeholder="Repeat Password" ref={passwordRepeatInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox" className="mb-3">
                            <Form.Check type="checkbox" label="Check me out"
                                onChange={() => togglePasswordVisibility()} />
                        </Form.Group>
                        <Form.Group>
                            <Button className="mr-3 w-100" variant="primary" type="submit" onClick={(event) => submitHandler(event)}>
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
                                <Link className='btn btn-success px-3 mx-auto' to={`/login`}>
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