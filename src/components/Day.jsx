import React, {Component} from 'react';
import Loader from 'react-loader-spinner';
import '../styles/tasks.css';
import "font-awesome/css/font-awesome.css"
import plant from '../images/plant.png';


class Day extends Component{
    constructor(props){
        super(props);
        
        this.state = {
            task: '',
            isWaiting: false,
            token: props.token,
            tasks: props.tasks
        }
    }
    handleChange = e => {
        e.preventDefault();
        const value = e.target.value;
        this.setState({task: value});
    }

    addElement(array, element){
        let newArray = array;
        newArray.push(element);
        return newArray
    }

    handleSubmit = e => {
        if (this.state.task.length > 0){
            
            e.preventDefault();
            this.setState({isWaiting: true}); 
            this.setState({
                tasks: 
                this.addElement(this.state.tasks,
                    {
                        day: this.props.day(),
                        description: this.state.task,
                        id: 'not-added-yet',
                        user: 'not-added-yet'
                    }),
                task: ''})
            setTimeout(() => {
                this.setState({isWaiting: false});
            }, 800)
            this.handleData(this.state.task, this.state.token)
        }
        else{
            alert('empty input');
        }

        
    };
    handleData(task, token){

        const requestOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
            body: JSON.stringify({ description: task, day: this.props.day()})
        };
        fetch('https://just2do-server.herokuapp.com/add/', requestOptions)
        .then(response => {
            if(!response.ok){
                alert('sorry' + response.status + ' status code returned')
            }
        })
            
        }
    
    deleteTask = (id) => {
        let index = id + "";
        let token = this.state.token;
        return (
            () => {
                if (id !== 'not-added-yet'){
                    this.setState({isWaiting: true});
                    const requestOptions = {
                        method: 'DELETE',
                        headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
                    };
                    fetch('https://just2do-server.herokuapp.com/edit/' + index + "", requestOptions)
                    .then(response => {
                        if(!response.ok){
                            alert('sorry' + response.status + ' status code returned')
                        }
                    })
                    setTimeout(() => {
                        this.setState({isWaiting: false});
                    }, 1000)
                }
                else{
                    alert("Sorry, u cant delete this task right now")
                }
            }
        );
    }
    updateTask = (id) => {
        let index = id + "";
        let token = this.state.token;
        return (
            e => {
                e.preventDefault()
                let value = document.getElementById(index + '').value;
                let element = document.getElementById('save' + index + '');
                element.classList.add("Invisable");
                if (id !== 'not-added-yet'){
                    
                    const requestOptions = {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
                        body: JSON.stringify({ description: value, day: this.props.day()})
                    };
                    
                    fetch('https://just2do-server.herokuapp.com/edit/' + index + "", requestOptions)
                    .then(response => {
                        response.json()
                        if(!response.ok){
                            alert('sorry' + response.status + ' status code returned')
                        }
                    })
                 
                }
                else{
                    alert("Sorry, u cant edit this task right now")
                }
            }
        );
    }

    setTaskDone = (id) => {
        let index = id + "";
        let token = this.state.token;
        return (
            () => {
                //e.preventDefault()
                let checkbox = document.getElementById(index + 'check')
                let value = document.getElementById(index + '').value;
                // checkbox.checked = !checkbox.checked
                // let value = checkbox.value;
                // console.log(checkbox.checked);
                if (id !== 'not-added-yet'){
                    const requestOptions = {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
                        body: JSON.stringify({description: value, day: this.props.day(), status: checkbox.checked})
                    };
                    
                    fetch('https://just2do-server.herokuapp.com/edit/' + index + "", requestOptions)
                    .then(response => {
                        response.json()
                        if(!response.ok){
                            alert('sorry' + response.status + ' status code returned')
                        }
                    })
                 
                }
                else{
                    alert("Sorry, u cant edit this task right now")
                }
            }
        );
    }

    render(){
        if(!this.state.isWaiting)
        return(
            <div className = 'TasksBox'>
                <Current date = {this.props.day()}/>

                <div className = 'TaskAndForm'>
                    <form>
                        <button onClick = {this.handleSubmit} className = 'AddTaskButton    '>
                            <svg id="search-icon" class="search-icon">
                            <line y1="15" x1="3" y2="15" x2="27" stroke="white" />
                            <line x1="15" y1="3" x2="15" y2="27" stroke="white" />
                            
                            </svg>
                        </button>
                        <input className ='TaskInput' onChange = {this.handleChange}/>
                    </form>
                    <div>
                        <DayTasks 
                            tasks = {this.props.tasks} 
                            onDelete = {this.deleteTask} 
                            getDay = {this.props.day}
                            onUpdate = {this.updateTask}
                            onBeingDone = {this.setTaskDone}/>
                    </div>
                </div>
                <Plant/>
            </div>
        );
        else{
            return(
                <div className = 'CenterLoader'>
                    <Loader
                        type="TailSpin"
                        color="#FF9B21"/>                    
                </div> 
            );
        }
    }
}

function DayTasks(props){
    // let tasks = []
    // tasks = props.tasks.filter(task => task.day === props.getDay())
    return(
        <div>
                {props.tasks.slice(0).reverse().map((task, index) => {
                    if(task.day === props.getDay() && !task.status){
                        return(
                            <Task 
                            index = {index} 
                            taskId = {task.id} 
                            description = {task.description}
                            onDelete = {props.onDelete}
                            onUpdate = {props.onUpdate}
                            onBeingDone = {props.onBeingDone}/>
                        );
                    }
                    else{
                        return (<div/>)
                    }
                })}
                {props.tasks.slice(0).reverse().map((task, index) => {
                    if(task.day === props.getDay() && task.status){
                        return(
                            <Task 
                            index = {index} 
                            taskId = {task.id} 
                            description = {task.description}
                            onDelete = {props.onDelete}
                            onUpdate = {props.onUpdate}
                            onBeingDone = {props.onBeingDone}
                            isCheched = {task.status}/>
                        );
                    }
                    else{
                        return (<div/>)
                    }
                })}
           
        </div>
    );
}

const Task = (props) => {
    let index = props.taskId + ''
    let checkIndex = props.taskId + 'check'
    const deleteTask = props.onDelete(props.taskId);
    const updateTask = props.onUpdate(props.taskId);
    const changeTaskStatus = props.onBeingDone(props.taskId)
    const onChange = () => {
        let element = document.getElementById('save' + index);
        element.classList.remove("Invisable");
    }
    
    return(
        <div className = 'Task'>
            <form onSubmit = {updateTask}>
                <input class = 'CheckBox' type = 'checkbox' id = {`${checkIndex}`} onChange = {changeTaskStatus} defaultChecked = {props.isCheched}/>
                <label for={`${checkIndex}`}/>
                <input className ='TaskInput' defaultValue = {`${props.description}`} id = {`${index}`} onChange = {onChange}/>
                <button className = 'TaskButton Invisable' type="submit" id= {`save${index}`}>
                    <i className = 'fa fa-check IconSize'></i>
                </button>
                <button className = 'TaskButton' onClick = {deleteTask}>
                    <i className="fa fa-trash IconSize"></i>
                </button>
            </form>
        </div>
        
    );
}

const Current = (props) => {
    return(
        <div className = 'SelectedDate'>
            {props.date}
        </div>
    );
}

const Plant = () => (

    <img src={plant} alt="Background plant" className = 'Plant  '/>

);

export default Day;