import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import { Navbar, Nav, Form, Button, Dropdown, Offcanvas, Image, ListGroup, DropdownButton, Container, Row, Col } from 'react-bootstrap';
import { LinkContainer } from "react-router-bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import LearningTasks from './lt';
class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            username: '',
            password: '',
            show: false,
            navbar: false,
            data : [],
            ltSort: '',
            ltSortType: 0,
        };
        this.options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit", second: "2-digit"};
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
        .then(data => this.setState({data: data, loggedIn: true, navbar: true, show: false}))
    }
    
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        })
    }
    handleltSortChange = (sort) => {
        if (this.state.ltSort === sort) {
            var sortType = this.state.ltSortType === 0 ? 1 : 0;
            this.setState({ltSortType: sortType});
        } else {
            this.setState({ltSort: sort, ltSortType: 0});
        }
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
    renderLearningTasks = () => {
        let tasks;
        if (this.state.ltSort === "name") {
            if (this.state.ltSortType === 0) {
                tasks = this.state.data.sort((a,b) => 
                    (a.name < b.name) - (a.name > b.name)
                ) 
            } else {
                tasks = this.state.data.sort((a,b) => 
                    (a.name > b.name) - (a.name < b.name)
                ) 
            }              
        } else if (this.state.ltSort === "date") {
            if (this.state.ltSortType === 0) {
                tasks = this.state.data.sort((a,b) => 
                    (a.individual_due_date < b.individual_due_date) - (a.individual_due_date > b.individual_due_date)
                )
            } else {
                tasks = this.state.data.sort((a,b) => 
                    (a.individual_due_date > b.individual_due_date) - (a.individual_due_date < b.individual_due_date)
                )
            }
        } else {
            tasks = this.state.data
        }
        return (
            <div className="list-group list-group-flush border-bottom scrollarea">
                {tasks.map((task, index) => (
                    <a key={index} href={"#offcanvas" + index} className="list-group-item list-group-item-action lh-tight" data-bs-target={"#offcanvas" + index} data-bs-toggle="offcanvas">
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">
                                {task.name}
                              </strong>
                            <small>
                                Due by {task.individual_due_date}
                              </small>
                        </div>
                        <div className="d-flex w-100 align-items-center justify-content-betweean">
                            <div className="mb-1">
                                {task.subject_name} - {task.subject_code}
                            </div>
                            <span>
                                <small>
                                    {"Submission Status: " + task.submission_status}
                                </small>
                                <img src={task.submission_svg_link} alt={task.submission_status} width="25" height="25"/>
                            </span>
                        </div> 
                    </a>
                ))}
        </div>
        )
    }
    renderOverdueLearningTasks = () => {
        let data = this.state.data;
        let tasks = data.filter(i => {
            return i.submission_status === "Overdue"
        })
        return (
            <div className="list-group list-group-flush border-bottom scrollarea">
                {tasks.map((task, index) => 
                    <a key={index} href={"#offcanvas" + index} className="list-group-item list-group-item-action lh-tight" data-bs-target={"#offcanvas" + index} data-bs-toggle="offcanvas" aria-controls={"#offcanvas" + index}>
                        <div className="d-flex w-100 align-items-center justify-content-between">
                            <strong className="mb-1">
                                {task.name}
                              </strong>
                        </div>
                        <div className="d-flex w-100 align-items-center justify-content-between text-center">
                            <div className="mb-1">
                                Due by {task.individual_due_date}
                            </div>
                        </div> 
                    </a>
                            )}
            </div>
        )
    }
    renderOverdueLearningTasksOffcanvas = () => {
        let data = this.state.data;
        let tasks = data.filter(i => {
            return i.submission_status === "Overdue"
        })
        return (
            <div>
                {tasks.map((tasks, index) => 
                    <div class="offcanvas offcanvas-start" tabindex="-1" id={"#offcanvas" + index} aria-labelledby="offcanvasLabel">
                        <div class="offcanvas-header">
                          <h5 class="offcanvas-title" id="offcanvasLabel">{index}</h5>
                          <button type="button" class="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                          Content for the offcanvas goes here. You can place just about any Bootstrap component or custom elements here.
                        </div>
                    </div>
                )}
            </div>
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
    learningtasks = () => {
        let overdue = 0;
        let pending = 0;
        let ontime = 0;
        let late = 0;
        for (var i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].submission_status === "Overdue") {
                overdue++
            } else if (this.state.data[i].submission_status === "Pending") {
                pending++
            } else if (this.state.data[i].submission_status === "On time") {
                ontime++
            } else if (this.state.data[i].submission_status === "Recieved late") {
                late++
            }
        }
        return (
            <div>
                <h1>Learning Tasks</h1>
                You currently have {overdue} overdue tasks
                <br/>
                You currently have {pending} pending tasks
                <br/>
                You currently have {late} tasks submitted late
                <br/>
                You currently have {ontime} tasks submitted on time
                <br/>
                <Button type="button" onClick={() => {console.log("sorting by date");this.handleltSortChange("date")}}>Sort by date</Button>
                <Button type="button" onClick={() => {console.log("sorting by name");this.handleltSortChange("name")}}>Sort by name</Button>
                <Dropdown>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Dropdown Button
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {this.renderLearningTasks()}
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
        return (
            <Router>
                {this.state.navbar ? this.studentNavbar() : this.visitorNavbar()}
                {!this.state.navbar ? (<Offcanvas show={this.state.show} onHide={this.handleClose}>
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
                        <Button variant="primary" type="button" onClick={() => this.handleSubmit()}>Log in</Button>
                      </Form>
                    </Offcanvas.Body>
                </Offcanvas>) : null}
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

