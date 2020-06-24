import React, { useState, useEffect  }  from 'react';
import Loader from 'react-loader-spinner';
import DayTasks from './DayTasks';
import AddTask from './AddTask';
import Login from './Login';


function Main() {
    // localStorage.removeItem('token')
    // console.log(sessionStorage.getItem('token'));
    // useEffect(() => {
    //     // Оновлюємо заголовок документа, використовуючи API браузера
    //     let token = 
    // });
    const [token, setToken] = useState(sessionStorage.getItem('token'));
    const [tasks, setTasks] = useState([]);
    function setTokenValue(token){
        sessionStorage.setItem('token', token);
        setToken(token);
    }
    function deleteToken(){
        localStorage.removeItem('token')
        setToken(null)
    }

    if (token === null){
        return (
            <div>
                <Login onAuth = {setTokenValue}/>
            </div>
        );
    }
    else{
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': 'Token ' + token + ''},
            };
            fetch('https://just2do-server.herokuapp.com/get/', requestOptions)
                .then(response => response.json())
                .then(data => setTasks(data));
        if (tasks.length === 0){
            return(
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                    timeout={3000}/>
            );
        }
        else{
            return(
                <div>
                    <button onClick = {deleteToken}>log out</button>
                    <AddTask/>
                    <DayTasks tasks = {tasks}/>
                </div>
            );

        }
    }

}

export default Main;
