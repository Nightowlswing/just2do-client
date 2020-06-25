import React, { useState}  from 'react';
import Loader from 'react-loader-spinner';
// import DayTasks from './DayTasks';
import Day from './Day';
import Login from './Login';
import Calendar from 'react-calendar';

function Main() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState(getProperDate(new Date()));

    function getProperDate(date){
        let year = date.getFullYear()
        let month = (date.getMonth()+1) < 10? '0' + (date.getMonth()+1+ '') : (date.getMonth()+1+ '')
        let day = date.getDate() < 10? '0' + date.getDate() + '' : date.getDate() + ''
        return year + '-' + month + '-' + day;
    }
    function changeDate(date){
        setDate(getProperDate(date));
    }
    function getSelectedDate(){
        return date;
    }
    function setTokenValue(token){
        localStorage.setItem('token', token);
        setToken(token);
    }
    function deleteToken(){
        localStorage.removeItem('token')
        setToken(null)
    }
    function queryTasks(task){
        const requestOptions = {
            method: 'GET',
            headers: {'Authorization': 'Token ' + token + ''},
            };
        fetch('https://just2do-server.herokuapp.com/get/', requestOptions)
            .then(response => response.json())
            .then(data => setTasks(data));
    }
    function getCurrentDate(){
        return getProperDate(new Date());
    };
    function setDateToCurrent(){
        changeDate(new Date());
    }

    if (token === null){
        return (
            <div>
                <Login onAuth = {setTokenValue}/>
            </div>
        );
    }
    else{
        queryTasks();
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
                    <button onClick = {setDateToCurrent}>go current</button>
                    <span>today is {getCurrentDate()}</span>
                    <Day 
                        token = {token} 
                        onAdding = {queryTasks} 
                        tasks = {tasks} 
                        day = {getSelectedDate}
                        />
                    <Calendar
                        onChange = {changeDate}
                    />
                </div>
            );

        }
    }

}

export default Main;
