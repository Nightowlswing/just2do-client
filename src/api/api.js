// import {GET_TODOS_URL}from '../urls/urls';
// import {LOGIN_URL}from '../urls/urls';
import {PUT_TODO_URL, POST_TODO_URL, LOGIN_URL, GET_TODOS_URL} from '../urls/urls';
export const getTasks = (token, setter) =>{
    const requestOptions = {
        method: 'GET',
        headers: {'Authorization': 'Token ' + token + ''},
        };
    fetch(GET_TODOS_URL, requestOptions)
        .then(response => response.json())
        .then(data => setter(data));
}

export const sendCredentionals = (name, pass, setter, handler) =>{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pass, username: name})
    };
    
    fetch(LOGIN_URL, requestOptions)
        .then(response => {
            if (!response.ok){
                if(response.status === 400){
                    setter({status: 'Sorry, user not found'});
                    console.log(response);
                }
                else{
                    alert(response.status + '' + response.statusText)
                }
            }
            return response.json()})
        .then(data => {handler(data.token); setter({isWaiting: false}); });
}

export const handleData = (task, token, day) => {

    const requestOptions = {
        method: 'POST',
        headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
        body: JSON.stringify({ description: task, day: day})
    };
    fetch(POST_TODO_URL, requestOptions)
    .then(response => {
        if(!response.ok){
            alert('sorry' + response.status + ' status code returned')
        }
    })   
    }

export const removeTask = (token, index, setter) => {
    setter({isWaiting: true});
    const requestOptions = {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
    };
    fetch(PUT_TODO_URL + index + "", requestOptions)
    .then(response => {
        if(!response.ok){
            alert('sorry' + response.status + ' status code returned')
        }
    })
    setTimeout(() => {
        setter({isWaiting: false});
    }, 1000)
}

export const updateTaskDesc = (token, index, value, day) => {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
        body: JSON.stringify({ description: value, day: day})
    };
    
    fetch(PUT_TODO_URL + index + "", requestOptions)
    .then(response => {
        response.json()
        if(!response.ok){
            alert('sorry' + response.status + ' status code returned')
        }
    })
}

export const updateTaskStatus = (token, index, value, day, status) => {
    const requestOptions = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json' ,'Authorization': 'Token ' + token + ''},
        body: JSON.stringify({description: value, day: day, status: status})
    };
    
    fetch(PUT_TODO_URL + index + "", requestOptions)
    .then(response => {
        response.json()
        if(!response.ok){
            alert('sorry' + response.status + ' status code returned')
        }
    })
}