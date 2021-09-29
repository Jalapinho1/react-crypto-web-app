import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AuthContext } from "../../store/auth-context";
import { KeyContext } from "../../store/key-management-context";

import { RiLockPasswordFill } from "react-icons/ri";

const MainNavigation = () => {

    const authCtx = useContext(AuthContext);
    const keyCtx = useContext(KeyContext);

    const isLoggedIn = authCtx.isLoggedIn;

    const logoutHandler = () => {
        authCtx.logout();
        keyCtx.removeKeys();
    };

    return (
        <header className='shadow-sm'>
            <Navbar className='shadow-sm' bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand to='/'>
                        <RiLockPasswordFill className="mb-1 me-1"></RiLockPasswordFill>
                        Crypto web
                    </Navbar.Brand>
                    <Nav className="me-auto" >
                        {!isLoggedIn &&
                            <LinkContainer to="/login" exact={true}>
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        }
                        {!isLoggedIn &&
                            <LinkContainer to="/register" exact={true}>
                                <Nav.Link>Register</Nav.Link>
                            </LinkContainer>
                        }
                        {isLoggedIn &&
                            <LinkContainer to="/keys" exact={true}>
                                <Nav.Link>Key management</Nav.Link>
                            </LinkContainer>
                        }
                        {isLoggedIn &&
                            <LinkContainer to="/crypto" exact={true}>
                                <Nav.Link>File encryption</Nav.Link>
                            </LinkContainer>
                        }
                    </Nav>
                    <Nav>
                        {isLoggedIn &&
                            <Nav.Link onClick={logoutHandler}>Logout</Nav.Link>
                        }
                    </Nav>
                </Container>
            </Navbar>
        </header >
    );
}

export default MainNavigation;