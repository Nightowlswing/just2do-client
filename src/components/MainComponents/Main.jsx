import React, { useState}  from 'react';
import Loader from 'react-loader-spinner';
import {getTasks} from '../../api/api';
import Day from '../Day';
import Login from '../Login';
import Calendar from 'react-calendar';
import logo from '../../images/logo192.png'
import left from '../../images/standing-left.png'
import right from '../../images/standing-right.png'
import footer from '../../images/footer.png'
import {getProperDate, markTasked} from './MainAdditions';
import '../../styles/images.css'
import '../../styles/loaders.css';
import '../../styles/menu.css';
import '../../styles/Calendar.css';

//the main 'entrence' to website
function Main() {
    //here we need user token, tasks, selected date and page(calendar ot tasks)
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState(getProperDate(new Date()));
    const [pageState, changePageState] = useState('day tasks');
    //function that changes selected date. Activates on date picking in calendar
    function changeDate(date){
        setDate(getProperDate(date));
        goTasks();
    }
    //function wich returns current date in global namespace
    function getSelectedDate(){
        return date;
    }
    //function that save token after user singed in
    function setTokenValue(token){
        localStorage.setItem('token', token);
        setToken(token);
    }
    //function that deletes token and then logout happens
    function doLogout(){
        changePageState('day tasks')
        localStorage.removeItem('token')
        setToken(null)
    }

    //function for getting whell displayed date string for the page
    function getCurrentDate(){
        return getProperDate(new Date());
    };
    //sets date to current
    function setDateToCurrent(){
        changePageState('day tasks');
        changeDate(new Date());
    }
    //function that changes state to calendar so calendar start rendering
    function goCalendar(){
        changePageState('calendar');
    }
    //function that changes state to tasks so calendar start rendering
    function goTasks(){
        changePageState('day tasks');
    }

    if (token === null || token === 'undefined' || token === undefined){
        return (
            <div>
                <Logo className = 'Logo'/>
                <Login onAuth = {setTokenValue}/>
                <Footer/>
            </div>
        );
    }
    else{
        getTasks(token, setTasks);
            switch(pageState){
                case 'day tasks':
                    return(
                        <div>
                            <Logo className = 'InLogo'/>
                            <div className = 'Menu'>
                                <button className ='MenuItem' onClick = {goTasks}><label className = 'Selected'>Day Tasks</label></button>
                                <button className ='MenuItem' onClick = {goCalendar}><label>Calendar</label></button>
                                <button className ='MenuItem' onClick = {setDateToCurrent}><label>Today</label></button>
                                <button className ='MenuItem'  onClick = {doLogout}><label>Log Out</label></button>
                            </div>
                            <div className = 'Today'>today is {getCurrentDate()}</div>
                            <Day 
                                token = {token} 
                                // onAdding = {queryTasks} 
                                tasks = {tasks} 
                                day = {getSelectedDate}
                                />
                        </div>
                    );
                case 'calendar':
                    markTasked(tasks);
                    return(
                    <div>
                        <Logo className = 'InLogo'/>
                        <div className = 'Menu'>
                            <button className ='MenuItem' onClick = {goTasks}><label>Day Tasks</label></button>
                            <button className ='MenuItem' onClick = {goCalendar}><label className = 'Selected'>Calendar</label></button>
                            <button className ='MenuItem' onClick = {setDateToCurrent}><label>Today</label></button>
                            <button className ='MenuItem'  onClick = {doLogout}><label>Log Out</label></button>
                        </div>

                        <div className = 'Today'>today is {getCurrentDate()}</div>
                        <div style = {{minHeight: '800px'}}>
                            <Calendar
                                onChange = {changeDate}
                            />
                        </div>

                    </div>);
                default:
                    changePageState('day tasks')
                    return (
                        <div className = 'CenterLoader'>
                        <Loader
                            type="TailSpin"
                            color="#FF9B21"/>                    
                    </div>
                    );
        }
        
    }
}

const Logo = (props) =>(
        <img src = {logo} alt = "Logo" className = {props.className}/>

);

const Footer = () =>(
    <div className = 'Relative'>
        <img src = {footer} alt = "FooterImage" className = 'Footer'/>
        <img src = {left} alt = "LeftImage" className = 'LeftStanding'/>
        <img src = {right} alt = "RightImage" className = 'RightStanding'/>
    </div>   
);

export default Main;
