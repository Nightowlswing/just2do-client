import React, {Component} from 'react';
import {sendCredentionals}from '../api/api';
import '../styles/login.css'
import '../styles/loaders.css';
import Loader from 'react-loader-spinner';

const formValid = formErrors =>{
    let valid = true;

    Object.values(formErrors).forEach(val => {
        val.length > 0 && (valid = false)
    });

    return valid;
}

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            email: null,
            password: null,
            formErrors:{
                email: "",
                password: ""
            },
            isWaiting: false,
            status: ''
        };
        
    }
    handleSubmit = e => {
        e.preventDefault();
        this.setState({isWaiting: true}); 

        if (formValid(this.state.formErrors)) {
          sendCredentionals(this.state.email, this.state.password, this.setState.bind(this), this.props.onAuth.bind(this))
        }
        else {
          alert('FORM IS INVALID');
        }
    };
    handleChange = e => {
        e.preventDefault();
        const {name, value} = e.target;
        let formErrors = this.state.formErrors;

        switch(name) {
            case 'Username':
                formErrors.email = 
                    value.length > 3 && value.length < 20
                        ?""
                        :'invalid email';
                this.setState({email: value});
                break;
            case 'Password':
                formErrors.password = 
                    value.length < 6 && value.length > 0 && value.length < 64
                        ?'minimum 6 characters'
                        : "";
                this.setState({password: value});
                break;
            default:
        }
       
        this.setState({formErrors, [name]: value});
    }
    render(){
        if(!this.state.isWaiting){
        return(
            <div className = 'SingIn'>
                <div>
                    <div className ='UpperLabel'>Sing in</div>
                    <div className ='LowerLabel'>Hi there! Nice to see you again</div>
                    
                </div>
                <form onSubmit = {this.handleSubmit} onChange = {this.handleChange} noValidate>
                  <Input onChange = {this.handleChange} name = 'Username' type = 'username'/>
                  <Input name = 'Password' type = 'password'/>
                  <div className = 'UserNotFound'>{this.state.status}</div>
                  <Button divclassname = 'SingIn' buttonclassname = 'SubmitButton' type = 'submit' name = 'sing in'/>
                </form>
                
            </div>
        );
        }else{
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

const Input = props => (
    <div>
        <div class="group">
            
            <input 
            defaultValue = ''
            type = {props.type}
            className = 'FormInput' 
            name = {`${props.name}`}
            noValidate
            onChange ={props.handleChange}
            required
            />
            <span class="highlight"></span>
            <span class="bar"></span>
            <label className = 'FormLabel'>{props.name}</label>
        </div>
    </div>
    );
  
const Button = props => (
    <div >
        <button  type = {`${props.type}`} className = 'SubmitButton'>Sign in</button>
    </div>
)

export default Login;