import React, {Component} from 'react';
import Loader from 'react-loader-spinner';

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
            response.json()
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
                        response.json()
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
            <div>
                <Current date = {this.props.day()}/>
                <form>
                    <input onChange = {this.handleChange}/>
                    <button onClick = {this.handleSubmit}>
                        Add Task
                    </button>
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
        );
        else{
            return(
                <Loader
                type="Puff"
                color="#00BFFF"
                height={100}
                width={100}
                timeout={3000}/>
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
    const deleteTask = props.onDelete(props.taskId);
    const updateTask = props.onUpdate(props.taskId);
    const changeTaskStatus = props.onBeingDone(props.taskId)
    let index = props.taskId + ''
    let checkIndex = props.taskId + 'check'
    return(
        <div>
            <form onSubmit = {updateTask}>
                <input type = 'checkbox' id = {`${checkIndex}`} onChange = {changeTaskStatus} defaultChecked = {props.isCheched}/>
                <input defaultValue = {`${props.description}`} id = {`${index}`}/>
                <input type="submit" value="Submit"/>
                <button onClick = {deleteTask}>
                    delete task
                </button>
            </form>
        </div>
        
    );
}

const Current = (props) => {
    return(
        <span>
            {props.date}
        </span>
    );
}

export default Day;