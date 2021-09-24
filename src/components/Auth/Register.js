import { useContext, useRef, useState } from "react";
import { Card, Container, Form, Spinner } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";
import { AuthContext } from "../../store/auth-context";

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
                    <div>
                        <h3>Register Form</h3>
                    </div>
                    <Form>
                        <Form.Group controlId="formBasicUsername" className="mb-3">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" ref={usernameInputRef} />
                            <Form.Text className="text-muted">
                                We'll never share your username with anyone else.
                            </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type={isPasswordShown ? "text" : "password"} placeholder="Password" ref={passwordInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicPassword" className="mb-3">
                            <Form.Label>Repeat Password</Form.Label>
                            <Form.Control type={isPasswordShown ? "text" : "password"} placeholder="Repeat Password" ref={passwordRepeatInputRef} />
                        </Form.Group>
                        <Form.Group controlId="formBasicCheckbox" className="mb-3">
                            <Form.Check type="checkbox" label="Check me out"
                                onChange={() => togglePasswordVisibility()} />
                        </Form.Group>
                        <Form.Group>
                            <Button className="mr-3" variant="primary" type="submit" onClick={(event) => submitHandler(event)}>
                                Register
                            </Button>
                            <span className="float-end mx-auto">
                                <span className="me-2">
                                    Already have an account?
                                </span>
                                <Link className='btn btn-primary px-3 mx-auto' to={`/login`}>
                                    Login
                                </Link>
                            </span>
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
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default Register;