export const getProperDate = (date) => {
    let year = date.getFullYear()
    let month = (date.getMonth()+1) < 10? '0' + (date.getMonth()+1+ '') : (date.getMonth()+1+ '')
    let day = date.getDate() < 10? '0' + date.getDate() + '' : date.getDate() + ''
    return year + '-' + month + '-' + day;
}
export const markTasked = (tasks) => {
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
    ];
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
