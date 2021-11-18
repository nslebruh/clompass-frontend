import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Navbar, Nav, Form, Button, Offcanvas, Image, Container, Row, Col, Spinner } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import LearningTasks from './lt';
class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            loggingIn: false, 
            username: '',
            password: '',
            show: false,
            navbar: false,
            data: [],
        };
        this.options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit", second: "2-digit"};
    }

    loggingIn = () => {
        this.setState({loggingIn: true})
    }
    handleShow = () => {
        this.setState({ show: true });
    }

    handleClose = () => {
        this.setState({ show: false });
    }

    handleSubmit = () => {
        fetch(`https://clompass-backend.herokuapp.com/puppeteer?username=${this.state.username}&password=${this.state.password}`)
        .then(res => res.json())
        .then(data => this.setState({data: data, loggedIn: true, navbar: true, show: false, loggingIn: false}))
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    studentNavbar = () => {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                    <Navbar.Brand>
                        <Image src="https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/icon.svg" fluid height="48" width="60"/> Clompass
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <LinkContainer to="/dashboard">
                                <Nav.Link>Dashboard</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/dashboard/learningtasks">
                                <Nav.Link>Learning Tasks</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/dashboard/schedule">
                                <Nav.Link>Schedule</Nav.Link>
                            </LinkContainer>
                            <LinkContainer to="/dashboard/studentinfo">
                                <Nav.Link>Profile</Nav.Link>
                            </LinkContainer>
                            {this.state.loggedIn ? <LinkContainer to="/"><Nav.Link onClick={() => this.setState({navbar: false})}>Return to landing page</Nav.Link></LinkContainer> : null}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
        )
    }
    visitorNavbar = () => {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand>
                    <Image src="https://cdn.jsdelivr.net/gh/clompass/clompass@main/public/svg/icon.svg" fluid height="48" width="60"/> Clompass
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/about">
                            <Nav.Link>About</Nav.Link>
                        </LinkContainer>
                        <Nav.Link onClick={this.handleShow}>Login</Nav.Link>
                        <LinkContainer to="/pricing">
                            <Nav.Link>Pricing</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/reviews">
                            <Nav.Link>Reviews</Nav.Link>
                        </LinkContainer>
                        {this.state.loggedIn ? <LinkContainer to="/dashboard"><Nav.Link onClick={() => this.setState({navbar: true})}>Return to dashboard</Nav.Link></LinkContainer> : null}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        )
    }
    about = () => {
        return (
            <div>
                <h1>About</h1>
            </div>
        ) 
    }
    pricing = () => {
        return (
            <div>
                <h1>Pricing</h1>
            </div>
        )
    }
    dashboard = () => {
        return (
            <div>
                <h1>Dashboard</h1>
                <Container>
                    <Row>
                    <Col className="text-center">
                        Subjects
                      </Col>
                      <Col className="text-center">
                        <h1>Overdue learning tasks</h1> 
                        <LearningTasks data={this.state.data} renderType="overdue" /> 
                      </Col>
                      <Col className="text-center">
                        My Tasks
                      </Col>
                    </Row>
                </Container>
            </div>
        )
    }
    studentinfo = () => {
        return (
            <div>
                <h1>Student Info</h1>
            </div>
        )
    }
    schedule = () => {
        return (
            <div>
                <h1>Schedule</h1>
            </div>
        )
    }
    home = () => {
        return (
            <div>
                <h1>Home</h1>
            </div>
        )
    }
    reviews = () => {
        return (
            <div>
                <h1>
                    Reviews
                </h1>
            </div>
        ); 
    }
    notLoggedIn = () => {
        return (
            <div>
                <h1>You are not logged in</h1>
            </div>
        );
    }
    render() {
        if (this.state.loggingIn) {
            this.handleSubmit()
        }
        return (
            <Router>
                {this.state.navbar ? this.studentNavbar() : this.visitorNavbar()}
                {!this.state.navbar ? (
                    <Offcanvas show={this.state.show} onHide={this.handleClose}>
                        <Offcanvas.Header closeButton>
                          <Offcanvas.Title>Log in</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                          <Form>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Username" name="username" id="username" onChange={this.handleChange}></Form.Control>
                            <br/>
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="password" name="password" id="password" onChange={this.handleChange}></Form.Control>
                            <br/>
                            {this.state.loggingIn ? <Button disabled><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true"/></Button> : this.state.loggedIn ? <Button disabled>Log In</Button> : <Button variant="primary" type="button" onClick={() => this.loggingIn()}>Log in</Button>}
                          </Form>
                        </Offcanvas.Body>
                    </Offcanvas>
                ) : null}
                <Switch>
                    <Route exact path="/about">
                        {this.state.loggedIn && this.state.navbar ? <Redirect to="/dashboard"/> : this.about()}
                    </Route>
                    <Route exact path="/pricing">
                        {this.state.loggedIn && this.state.navbar ? <Redirect to="/dashboard"/> : this.pricing()}
                    </Route>
                    <Route exact path="/dashboard">
                        {this.state.loggedIn ? this.dashboard() : this.notLoggedIn()}
                    </Route>
                    <Route exact path="/reviews">
                    {this.state.loggedIn && this.state.navbar ? <Redirect to="/dashboard"/> : this.reviews()}
                    </Route>
                    <Route exact path="/dashboard/learningtasks">
                        {this.state.loggedIn ? <LearningTasks data={this.state.data}/> : this.notLoggedIn()}
                    </Route>
                    <Route exact path="/dashboard/studentinfo">
                        {this.state.loggedIn? this.studentinfo() : this.notLoggedIn()}
                    </Route>
                    <Route exact path="/dashboard/schedule">
                        {this.state.loggedIn ? this.schedule() : this.notLoggedIn()}
                    </Route>
                    <Route exact path="/">
                        {this.state.loggedIn && this.state.navbar ? <Redirect to="/dashboard"/> : this.home()}
                    </Route>
                </Switch>
            </Router>
        )
    }
}

ReactDOM.render(<Test />, document.getElementById('root'));

