import React, {Component} from 'react';

class DayTasks extends Component{
    constructor(props){
        super(props);
        this.state = {
            tasks: props.tasks
        }
    }


    render(){
        return(
            <div>
                <ul>
                    {this.state.tasks.map((task) =>
                    <li key = {task.id}>
                        {task.description}
                    </li>
                    )}
                </ul>
            </div>
        );
    }
}

export default DayTasks;