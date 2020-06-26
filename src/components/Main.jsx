import React, { useState}  from 'react';
import Loader from 'react-loader-spinner';
// import DayTasks from './DayTasks';
import Day from './Day';
import Login from './Login';
import Calendar from 'react-calendar';
import logo from '../images/logo192.png'
import left from '../images/standing-left.png'
import right from '../images/standing-right.png'
import footer from '../images/footer.png'
import '../styles/images.css'
import '../styles/loaders.css';
import '../styles/menu.css';
import '../styles/Calendar.css';

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
function Main() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [tasks, setTasks] = useState([]);
    const [date, setDate] = useState(getProperDate(new Date()));
    const [pageState, changePageState] = useState('day tasks');
    function getProperDate(date){
        let year = date.getFullYear()
        let month = (date.getMonth()+1) < 10? '0' + (date.getMonth()+1+ '') : (date.getMonth()+1+ '')
        let day = date.getDate() < 10? '0' + date.getDate() + '' : date.getDate() + ''
        return year + '-' + month + '-' + day;
    }
    function changeDate(date){
        setDate(getProperDate(date));
        goTasks();
    }
    function getSelectedDate(){
        return date;
    }
    function setTokenValue(token){
        localStorage.setItem('token', token);
        setToken(token);
    }

    function doLogout(){
        changePageState('day tasks')
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
        changePageState('day tasks');
        changeDate(new Date());
    }
    function goCalendar(){
        changePageState('calendar');
    }
    function goTasks(){
        changePageState('day tasks');
    }

    function markTasked(){
        let abrs = document.querySelectorAll('abbr')
        if(abrs[1] !== undefined){
            let days = Array.from(abrs).filter(
                word => word.getAttribute('aria-label') !== 'Sunday'
            ).filter(
                word => word.getAttribute('aria-label') !== 'Monday'
            ).filter(
                word => word.getAttribute('aria-label') !== 'Tuesday'
            ).filter(
                word => word.getAttribute('aria-label') !== 'Wednesday'
            ).filter(
                word => word.getAttribute('aria-label') !== 'Thursday'
            ).filter(
                word => word.getAttribute('aria-label') !== 'Friday'
            ).filter(
                word => word.getAttribute('aria-label') !== 'Saturday'
            )
        
        
            for(let i = 0; i < tasks.length; i++){
                let month = monthNames[new Date(tasks[i].day).getMonth()];
                let year = new Date(tasks[i].day).getFullYear();
                let day = new Date(tasks[i].day).getDate();
                for(let j = 0; j < days.length; j++){
                    if(month + ' ' + day + ', ' + year === days[j].getAttribute('aria-label') && days[j].closest('.react-calendar__tile').childElementCount < 2){
                        let textnode = document.createElement("LI");
                        days[j].closest('.react-calendar__tile').appendChild(textnode)
                    }
                }
                
            }
        }
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
        queryTasks();
        if (tasks.length === 0){
            return(
                <div className = 'CenterLoader'>
                    <Loader
                        type="TailSpin"
                        color="#FF9B21"/>                    
                </div>
            );
        }

        
        else{
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
                                onAdding = {queryTasks} 
                                tasks = {tasks} 
                                day = {getSelectedDate}
                                />
                        </div>
                    );
                case 'calendar':
                    markTasked();
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
