import ReactDOM from 'react-dom';
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import {Offcanvas, Image, ListGroup, DropdownButton, Dropdown, Button} from 'react-bootstrap';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";

export default class LearningTasks extends React.Component {
    constructor(props) {
        super(props);
        this.offcanvasList = {};
        this.overdue = 0;
        this.ontime = 0;
        this.late = 0;
        this.pending = 0;
        this.classes = [];
        for (var i = 0; i < props.data.length; i++) {
            this.offcanvasList[props.data[i].id] = false;
        }
        for (i = 0; i < props.data.length; i++) {
            if (this.classes.includes(props.data[i].subject_code) === false) {
                this.classes.push(props.data[i].subject_code);
            }
        }
        if (props.renderType !== "overdue") {
            for (i = 0; i < this.props.data.length; i++) {
                if (props.data[i].submission_status === "Overdue") {
                    this.overdue++
                } else if (props.data[i].submission_status === "Pending") {
                    this.pending++
                } else if (props.data[i].submission_status === "On time") {
                    this.ontime++
                } else if (props.data[i].submission_status === "Recieved late") {
                    this.late++
                }
            }
        }
        this.state = {
            data: props.data,
            renderType: props.renderType,
            offcanvasList: this.offcanvasList,
            overdue: (props.renderType !== "overdue" ? this.overdue : null),
            ontime: (props.renderType !== "overdue" ? this.ontime : null),
            late: (props.renderType !== "overdue" ? this.late : null),
            pending: (props.renderType !== "overdue" ? this.pending : null),
            sort: false,
            sortType: false,
            sort2: 0,
            classes: this.classes,
        }
        this.options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit", second: "2-digit"};
    }
    handleSortChange = (sort, sortType, sortType2 = 0) => {
        if (this.state.sort === sort && sortType === false) {
            var sortType2 = this.state.sortType2 === 0 ? 1 : 0;
            this.setState({sortType2: sortType2})
        } else {
            this.setState({sort: sort, sortType: sortType, sortType2: sortType2})
        }
    }
    handleOffcanvasChange = (id) => {
        this.setState(prevState => ({
            offcanvasList: {                   
                ...prevState.offcanvasList,   
                [id]: true      
            }
        }))
    }
    renderTasks = () => {
        let tasks = this.sortTasks(this.state.data, this.state.sort, this.state.sortType, this.state.sort2)
        return (
            <div>
                {`You currently have ${this.state.overdue} overdue learning tasks`}
                <br/>
                {`You currently have ${this.state.late} late learning tasks`}
                <br/>
                {`You currently have ${this.state.pending} pending learning tasks`}
                <br/>
                {`You currently have ${this.state.ontime} on time learning tasks`}
                <br/>
                <Button type="button" onClick={() => this.handleSortChange("name", false)}>Sort by name</Button>
                <Button type="button" onClick={() => this.setState({sort: false, sortType: false, sort2: 0})}>Reset sort</Button>
                <Button type="button" onClick={() => this.handleSortChange("date", false)}>Sort by date</Button>
                <DropdownButton id="class-sort" title="Sort by class">
                    {this.state.classes.map((class_code, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange(class_code, "class")} key={index}>
                            {class_code}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton id="status-sort" title="Sort by submission status">
                    {["Pending", "On time", "Recieved late", "Overdue"].map((status, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange(status, "status")}>
                            {status}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <div className="list-group list-group-flush border-bottom scrollarea">
                    {tasks.map((task, index) => (
                        <a key={index} href={"#offcanvas" + index} className="list-group-item list-group-item-action lh-tight" data-bs-target={"#offcanvas" + index} data-bs-toggle="offcanvas">
                            <div className="d-flex w-100 align-items-center justify-content-between">
                                <strong className="mb-1">
                                    {task.name}
                                  </strong>
                                <small>
                                    Due by {new Date(task.individual_due_date).toLocaleDateString("en-US", this.options)}
                                  </small>
                            </div>
                            <div className="d-flex w-100 align-items-center justify-content-between">
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
        </div>
        )
    }
    sortTasks = (data, sort, sortType, sort2) => {
        let task;
        let tasks;
        if (sortType === "status") {
            tasks = data.filter(i => {
                return i.submission_status === sort
            })
        } else if (sortType === "class") {
            tasks = data.filter(i => {
                return i.subject_code === sort
            })
        } else if (sortType === "date") {
            if (sort2 === 0) {
                tasks = this.state.data.sort((a,b) => 
                    (a.individual_due_date < b.individual_due_date) - (a.individual_due_date > b.individual_due_date)
                )
            } else {
                tasks = this.state.data.sort((a,b) => 
                    (a.individual_due_date > b.individual_due_date) - (a.individual_due_date < b.individual_due_date)
                )
            }
        } else if (sortType === "name") {
            if (sort2 === 0) {
                tasks = this.state.data.sort((a,b) => 
                    (a.name < b.name) - (a.name > b.name)
                ) 
            } else {
                tasks = this.state.data.sort((a,b) => 
                    (a.name > b.name) - (a.name < b.name)
                ) 
            }              
        } else {
                tasks = data;
        }
        return tasks
    }
    renderOverdueTasks = () => {
        let tasks = this.state.data.filter(i => {
            return i.submission_status === "Overdue"
        })
        return (
            <div>
                <ListGroup variant="flush" className="border-bottom scrollarea">
                    {tasks.map((task, index) =>
                        <ListGroup.Item as="button" action onClick={() => this.handleOffcanvasChange(task.id)} className="lh-tight">
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
                        </ListGroup.Item>
                                )}
                </ListGroup>
            </div>
        )
    }
    renderOverdueOffcanvas = () => {
        let tasks = this.state.data.filter(i => {
            return i.submission_status === "Overdue"
        })
        return 
    }
    render() {
        return (
            <div>
                {this.state.renderType === "overdue" ? this.renderOverdueTasks() : this.renderTasks()}
            </div>
        )
    }
}