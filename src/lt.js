import React from 'react';
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
        this.data = props.data;
        this.renderType = props.renderType
        for (var i = 0; i < props.data.length; i++) {
            this.offcanvasList[props.data[i].id] = false;
        }
        for (i = 0; i < props.data.length; i++) {
            if (this.classes.includes(props.data[i].subject_code) === false) {
                this.classes.push(props.data[i].subject_code);
            }
        }
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
        this.state = {
            offcanvasList: this.offcanvasList,
            subject_sort: false,
            subject_sort_type: '',
            name_sort: false,
            name_sort_type: 0,
            date_sort: false,
            date_sort_type: 0,
            status_sort: false,
            status_sort_type: '',
            empty_tasks: false,

        }
        this.options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit", second: "2-digit"};
    }
    

    handleSortChange = (sort, sort_type = null) => {
        let sort_type;
        if (sort === "name") {
            if (this.state.name_sort === true) {
                sort_type = this.state.name_sort_type === 0 ? 1 : 0
                this.setState({name_sort_type: sort_type})
            } else {
                this.setState({name_sort: true})
            }
        }
        if (sort === "date") {
            if (this.state.date_sort === true) {
                sort_type = this.state.date_sort_type === 0 ? 1 : 0
                this.setState({date_sort_type: sort_type})
            } else {
                this.setState({date_sort: true})
            }
        }
        if (sort === "subject") {
            if (this.state.subject_sort === true) {
                this.setState({subject_sort: false})
            } else {
                this.setState({subject_sort: true, subject_sort_type: sort_type})
            }
        }
        if (sort === "status") {
            if (this.state.status_sort === true) {
                this.setState({status_sort: false})
            } else {
                this.setState({status_sort: true, status_sort_type: sort_type})
            }
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
        let tasks = this.sortTasks();
        return (
            <div>
                {`You currently have ${this.overdue} overdue learning tasks`}
                <br/>
                {`You currently have ${this.late} late learning tasks`}
                <br/>
                {`You currently have ${this.pending} pending learning tasks`}
                <br/>
                {`You currently have ${this.ontime} on time learning tasks`}
                <br/>
                <Button type="button" onClick={() => this.handleSortChange("name")}>Sort by name</Button>
                <Button type="button" onClick={() => this.setState({subject_sort: false, subject_sort_type: '', name_sort: false, name_sort_type: 0, date_sort: false, date_sort_type: 0, status_sort: false, status_sort_type: '', empty_tasks: false,})}>Reset sort</Button>
                <Button type="button" onClick={() => this.handleSortChange("date")}>Sort by date</Button>
                <DropdownButton id="class-sort" title="Sort by class">
                    {this.classes.map((class_code, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange(class_code, "class")} key={index}>
                            {class_code}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton id="status-sort" title="Sort by submission status">
                    {["Pending", "On time", "Recieved late", "Overdue"].map((status, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange("status", status)}>
                            {status}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <div className="list-group list-group-flush border-bottom scrollarea">
                    {this.state.empty_tasks ? "No tasks" : tasks.map((task, index) => (
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
    sortTasks = () => {
        let tasks = this.data;
        if (this.state.empty_tasks) {
            return
        }
        if (tasks.length !== 0) {
            if (this.state.subject_sort) {
                if (this.state.subject_sort_type !== "") {
                    tasks = tasks.filter(i => {
                        return i === this.state.subject_sort_type;
                    })
                }
            }
            if (this.state.status_sort) {
                if (tasks.length !== 0) {
                    if (this.state.status_sort_type !== "") {
                        tasks = tasks.filter(i => {
                            return i === this.state.status_sort_type;
                        })
                    }
                } else {
                    this.setState({empty_tasks: true})
                }
            }
            if (this.state.name_sort) {
                if (tasks.length !== 0) {
                    if (this.state.name_sort_type === 0) {
                        tasks = tasks.sort((a,b) => 
                        (a.name < b.name) - (a.name > b.name)
                    ) 
                    } else {
                        tasks = tasks.sort((a, b) => 
                        (a.name > b.name) - (a.name < b.name)
                        )
                    }
                } else {
                    this.setState({empty_tasks: true})
                }
                
            }
            if (this.state.date_sort) {
                if (tasks.legnth !== 0) {
                    if (this.state.date_sort_type === 0) {
                        tasks = tasks.sort((a, b) => 
                            (a.individual_due_date < b.individual_due_date) - (a.individual_due_date > b.individual_due_date)
                        )
                        
                    } else {
                        tasks = tasks.sort((a, b) => 
                        (a.individual_due_date > b.individual_due_date) - (a.individual_due_date < b.individual_due_date)
                    )
                        
                    }
                } else {
                    this.setState({empty_tasks: true})
                }
            } 
        } else {
            this.setState({empty_tasks: true})
        }
        return tasks
    }
    renderOverdueTasks = () => {
        let tasks = this.data.filter(i => {
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
        let tasks = this.data.filter(i => {
            return i.submission_status === "Overdue"
        })
        return 
    }
    render() {
        return (
            <div>
                {this.renderType === "overdue" ? this.renderOverdueTasks() : this.renderTasks()}
            </div>
        )
    }
}