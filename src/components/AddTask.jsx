import React, {Component} from 'react';

class AddTask extends Component{
    constructor(props){
        super(props);
        this.state = {
            task: '',
            isWaiting: false
        }
    }
    handleChange = e => {
        e.preventDefault();
        const {value} = e.target;
        this.setState({task: value});
    }

    handleSubmit = e => {
        e.preventDefault();
        this.setState({isWaiting: true}); 

        setTimeout(() => {
            this.setState({isWaiting: false});
        }, 2000)

        console.log(this.state.task)

    };
    render(){
        return(
            <div>
                <form>
                    <input onChange = {this.handleChange}/>
                    <button />
                </form>
            </div>
        );
    }
 
}

export default AddTask;