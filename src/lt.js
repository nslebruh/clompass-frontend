import React from 'react';
import {Offcanvas, Image, ListGroup, DropdownButton, Dropdown, Button} from 'react-bootstrap';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Parse from 'html-react-parser';

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
            type_sort: false,
            type_sort_type: '',
        }
        this.statuses = ["Pending", "On time", "Recieved late", "Overdue"];
        this.types = ["cat ", "pt", "hw"];
        this.options = {weekday: "long", year: 'numeric', month: 'long', day: 'numeric', hour: "numeric", minute: "2-digit"};
    }
    

    handleSortChange = (sort, sort_type = null) => {
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
        if (sort === "status") {
            this.setState({status_sort: true, status_sort_type: sort_type})
        }
        if (sort === "subject") {
            this.setState({subject_sort: true, subject_sort_type: sort_type})
        }
        if (sort === "type") {
            this.setState({type_sort: true, type_sort_type: sort_type})
        } 
    }

    handleOffcanvasChange = (id, change) => {
        this.setState(prevState => ({
            offcanvasList: {                   
                ...prevState.offcanvasList,   
                [id]: change      
            }
        }))
    }
    renderTasks = () => {
        let tasks = this.sortTasks();
        return (
            <div className="container">
                {`You currently have ${this.overdue} overdue learning tasks`}
                <br/>
                {`You currently have ${this.late} late learning tasks`}
                <br/>
                {`You currently have ${this.pending} pending learning tasks`}
                <br/>
                {`You currently have ${this.ontime} on time learning tasks`}
                <br/>
                <Button type="button" onClick={() => this.handleSortChange("name")}>Sort by name</Button>
                <Button type="button" onClick={() => this.setState({subject_sort: false, subject_sort_type: '', name_sort: false, name_sort_type: 0, date_sort: false, date_sort_type: 0, status_sort: false, status_sort_type: '', empty_tasks: false, type_sort: false, type_sort_type: '',})}>Reset sort</Button>
                <Button type="button" onClick={() => this.handleSortChange("date")}>Sort by date</Button>
                <br/>
                <DropdownButton id="task-type-sort" title="Sort by task type">
                    {this.types.map((type, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange("type", type)} key={index}>
                            {type.toUpperCase()}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton id="class-sort" title="Sort by class">
                    {this.classes.map((class_code, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange("subject", class_code)} key={index}>
                            {class_code}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                <DropdownButton id="status-sort" title="Sort by submission status">
                    {this.statuses.map((status, index) => 
                        <Dropdown.Item onClick={() => this.handleSortChange("status", status)} key={index}>
                            {status}
                        </Dropdown.Item>
                    )}
                </DropdownButton>
                {tasks.length <= 0 ? "No tasks" : 
                    <ListGroup variant="flush" className="border-bottom scrollarea">
                        {tasks.map((task, index) => (
                            <ListGroup.Item as="button" action onClick={() => this.handleOffcanvasChange(task.id, true)}>
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
                                        <Image src={task.submission_svg_link} alt={task.submission_status} width="25" height="25"/>
                                    </span>
                                </div> 
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                }
            </div>
        )
    }
    renderOffcanvas = () => {
        let tasks = this.data;
        return (
            <div>
                {tasks.map((task, index) => 
                    <Offcanvas show={this.state.offcanvasList[task.id]} onHide={() => this.handleOffcanvasChange(task.id, false)} key={index}>
                    <Offcanvas.Header closeButton>
                    <Offcanvas.Title>{task.name}</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                    Subject: {task.subject_name} - {task.subject_code}
                            <br/>
                            Submission status: {task.submission_status}
                            <br/>
                            Due date: {new Date(task.individual_due_date).toLocaleDateString("en-US", this.options)}
                            <br/>
                            <br/>
                            Description:
                            <br/>
                            {Parse(task.description)}
                            <br/>
                            <br/>
                            Attachments: {task.attachments === "None" ? "None" : null}
                            {task.attachments !== "None" ? task.attachments.map((attachment, index) => 
                                <div>
                                    <a key={index} href={attachment.link}>{attachment.name}</a>
                                    <br/>
                                </div>
                                ) : null}
                            
                            <br/>
                            <br/>
                            Submissions: {task.submissions === "None" ? "None" : null}
                            {task.submissions !== "None" ? task.submissions.map((submission, index) => 
                                <div>
                                    <a key={index }href={submission.link}>{submission.name}</a>
                                    <br/>
                                </div>
                            ) : null}
                    </Offcanvas.Body>
                </Offcanvas>
                )}
            </div>
        )
    }
    sortTasks = () => {
        let tasks = this.data;
        if (this.state.status_sort === true) {
            tasks = tasks.filter(i => {
                return i.submission_status === this.state.status_sort_type;
            })
        }
        if (this.state.subject_sort === true) {
            tasks = tasks.filter(i => {
                return i.subject_code === this.state.subject_sort_type;
            })
        }
        if (this.state.type_sort === true) {
            tasks = tasks.filter(i => {
                return (i.name.toLowerCase()).includes(this.state.type_sort_type);
            })
        }
        if (this.state.name_sort === true) {
            if (this.state.name_sort_type === 0) {
                tasks = tasks.sort((a,b) => 
                    (a.name < b.name) - (a.name > b.name)
                ) 
            } else {
                tasks = tasks.sort((a,b) => 
                    (a.name > b.name) - (a.name < b.name)
                ) 
            }       
        }
        if (this.state.date_sort === true) {
            if (this.state.date_sort_type === 0) {
                tasks = tasks.sort((a,b) => 
                    (a.individual_due_date < b.individual_due_date) - (a.individual_due_date > b.individual_due_date)
                )
            } else {
                tasks = tasks.sort((a,b) => 
                    (a.individual_due_date > b.individual_due_date) - (a.individual_due_date < b.individual_due_date)
                )
            }
        }
        return tasks;
    }
    renderOverdueTasks = () => {
        let tasks = this.data.filter(i => {
            return i.submission_status === "Overdue"
        })
        return (
            <div>
                <ListGroup variant="flush" className="border-bottom scrollarea">
                    {tasks.map((task, index) =>
                        <ListGroup.Item as="button" action onClick={() => this.handleOffcanvasChange(task.id, true)} className="lh-tight">
                                <div className="d-flex w-100 align-items-center justify-content-between">
                                    <strong className="mb-1">
                                        {task.name}
                                      </strong>
                                </div>
                                <div className="d-flex w-100 align-items-center justify-content-between text-center">
                                    <div className="mb-1">
                                        Due by {new Date(task.individual_due_date).toLocaleDateString("en-us", this.options)}
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
        return (
            <div>
                {tasks.map((task, index) => 
                    <Offcanvas show={this.state.offcanvasList[task.id]} onHide={() => this.handleOffcanvasChange(task.id, false)} key={index}>
                        <Offcanvas.Header closeButton>
                        <Offcanvas.Title>{task.name}</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            Subject: {task.subject_name} - {task.subject_code}
                            <br/>
                            Submission status: {task.submission_status}
                            <br/>
                            Due date: {new Date(task.individual_due_date).toLocaleDateString("en-US", this.options)}
                            <br/>
                            <br/>
                            Description:
                            <br/>
                            {Parse(task.description)}
                            <br/>
                            <br/>
                            Attachments: {task.attachments === "None" ? "None" : null}
                            {task.attachments !== "None" ? task.attachments.map((attachment, index) => 
                                <div>
                                    <a key={index} href={attachment.link}>{attachment.name}</a>
                                    <br/>
                                </div>
                                ) : null}
                            
                            <br/>
                            <br/>
                            Submissions: {task.submissions === "None" ? "None" : null}
                            {task.submissions !== "None" ? task.submissions.map((submission, index) => 
                                <div>
                                    <a key={index }href={submission.link}>{submission.name}</a>
                                    <br/>
                                </div>
                            ) : null}

                        </Offcanvas.Body>
                    </Offcanvas>
                )}
            </div>
        ) 
    }
    render() {
        return (
            <div>
                {this.renderType === "overdue" ? this.renderOverdueTasks() : this.renderTasks()}
                {this.renderType === "overdue" ? this.renderOverdueOffcanvas() : this.renderOffcanvas()}
            </div>
        )
    }
}