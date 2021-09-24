import { useContext } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { AuthContext } from "../../store/auth-context";

const MainNavigation = () => {

    const authCtx = useContext(AuthContext);

    const isLoggedIn = authCtx.isLoggedIn;

    const logoutHandler = () => {
        authCtx.logout();
    };

    return (
        <header className='shadow-sm'>
            <Navbar className='shadow-sm' bg="primary" variant="dark">
                <Container>
                    <Navbar.Brand to='/'>Crypto web</Navbar.Brand>
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