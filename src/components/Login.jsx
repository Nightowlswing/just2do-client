import React, {Component} from 'react';

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
        };
        
    }
    handleSubmit = e => {
        e.preventDefault();
        this.setState({isWaiting: true}); 

        setTimeout(() => {
            this.setState({isWaiting: false});
        }, 2000)

        if (formValid(this.state.formErrors)) {
          this.handleUserData(this.state.email,this.state.password)
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
    handleUserData(name, pass){
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: pass, username: name})
        };
        fetch('https://just2do-server.herokuapp.com/api-token-auth/', requestOptions)
            .then(response => response.json())
            .then(data => this.props.onAuth(data.token));
            
      }
    render(){
        return(
            <div className = 'SingIn'>
                <form onSubmit = {this.handleSubmit} onChange = {this.handleChange} noValidate>
                  <Input onChange = {this.handleChange} name = 'Username' placeholder = 'username' type = 'username'/>
                  <Input name = 'Password' placeholder = '••••••••' type = 'password'/>
                  <Button divclassname = 'SingIn' buttonclassname = 'SubmitButton' type = 'submit' name = 'sing in'/>
                </form>
            </div>
        );
            }
    
}

const Input = props => (
    <div>
      
      <div className = {`${props.name}`}>
          <label className= 'FormLabel'>{props.name}</label><br/>
          <input 
          type = {`${props.type}`}
          className = 'FormInput' 
          placeholder = {`${props.placeholder}`}
          name = {`${props.name}`}
          noValidate
          onChange ={props.handleChange}
          />
      </div>
    </div>
    );
  
const Button = props => (
    <div className = {`${props.divclassname}`}>
    <button className = {`${props.buttonclassname}`} type = {`${props.type}`}>{props.name}</button>
    </div>
)

export default Login;