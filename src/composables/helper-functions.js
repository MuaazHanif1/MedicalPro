import moment from "moment";

// helper functions for display values in place of their ids
const phone = (countryobj, phone) => {
    console.log('phone')
    const countrycode = '+' + countryobj.dialCode;
    let phone_num = phone.replace(/\s/g, '').replace(countrycode, '');
    return { country_code: '+' + countryobj.dialCode, phone_number: phone_num };
}

// get all dates between two dates
/**
 * 
 * @param {*} start_date 
 * @param {*} end_date 
 * @param {*} days 
 * @returns array of dates between start date and end date
 */
const datesbetween = (start_date, end_date, days = '') => {

    let date = moment(start_date).format('YYYY/MM/DD');
    end_date = moment(end_date).format('YYYY/MM/DD');
    let dates = [];
    while (date <= end_date) {
        dates.push(date);
        date = moment(date).add(1, 'days').format('YYYY/MM/DD');
    }
    if (days) {
        days = days.map(a => a.day.toLowerCase());
        var includedaydates = [];
        for (let i = 0; i < dates.length; i++) {
            var weekDayName = moment(dates[i]).format('dddd').toLowerCase();
            if (days.includes(weekDayName)) {
                includedaydates.push(dates[i]);
            }
        }
        if (includedaydates.length) {
            dates = includedaydates;
        }
    }
    //remove all dates previous then today
    dates = dates.filter(date => date >= moment().format('YYYY/MM/DD'));
    return dates;

}
// const timeSlots = (start_time,end_time,duration) =>{

//     let timeslots = [];
//     while (start_time <= end_time){
//         timeslots.push(start_time);
//         start_time = moment(start_time, "hh:mm:ss").add(duration, 'minutes').format('hh:mm:ss');
//     }
//     let timeslotsArray = [];
//     for(let i = 0; i<timeslots.length; i++){
//         if(timeslots[i+1]){
//             timeslotsArray.push({'start_time':timeslots[i],'end_time':timeslots[i+1]});
//         }
//     }
//     return timeslotsArray;
// }


//create time slots
/**
 * 
 * @param {*} start_time 
 * @param {*} end_time 
 * @param {*} duration 
 * @param {*} appointments 
 * @param {*} id 
 * @returns slots array
 */
const usetimeSlotsWithAppointments = (start_time, end_time, duration, appointments = [], id = '') => {
    let timeslots = [];
    end_time = addMinutes(end_time, 1);
    while (start_time <= end_time) {
        timeslots.push(start_time);
        start_time = addMinutes(start_time, duration);
    }
    if (appointments) {
        for (let j = 0; j < appointments.length; j++) {
            for (let k = 0; k < timeslots.length; k++) {
                if (timeslots[k] == appointments[j].start_time) {
                    timeslots[k] = { 'time': timeslots[k], 'is_booked': true }
                }
            }
        }
    }
    let timeslotsArray = [];
    for (let i = 0; i < timeslots.length; i++) {
        if (timeslots[i + 1]) {
            timeslotsArray.push({
                'id': id,
                'start_time': timeslots[i].time ? timeslots[i].time : timeslots[i],
                'is_booked': timeslots[i].time ? timeslots[i].is_booked : false,
                'end_time': timeslots[i + 1].time ? timeslots[i + 1].time : timeslots[i + 1]
            });

        }
    }
    return timeslotsArray;
}

// get time by adding minutes
/**
 * 
 * @param {*} time 
 * @param {*} minsToAdd 
 * @returns time
 */
const addMinutes = (time, minsToAdd) => {
    function D(J) { return (J < 10 ? '0' : '') + J }
    var piece = time.split(':')
    var mins = piece[0] * 60 + +piece[1] + +minsToAdd
    return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60) + ':00';
}

// format time   
const timeFormatFilter = (time) => {
    //change 09:00:00 to 09:00 AM
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];
    if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join('').replace(/(\d{1,2}:\d{2}):\d{2}/, "$1");

}
const getCurrentCountry = () => {
    return fetch('https://ip2c.org/s')
        .then((response) => response.text())
        .then((response) => {
            const result = (response || '').toString();

            if (!result || result[0] !== '1') {
                throw new Error('unable to fetch the country');
            }

            return result.substr(2, 2);
        });
}
export {
    phone,
    datesbetween,
    // timeSlots,
    timeFormatFilter,
    usetimeSlotsWithAppointments,
    getCurrentCountry
};

