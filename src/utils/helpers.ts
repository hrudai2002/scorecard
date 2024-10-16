import moment from "moment";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const validateEmail = (email: string) => {
    const regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/; 
    return regex.test(email) && email.trim().length > 0;
}

export const validatePassword = (password: string) => {
    return password.length >= 6 && password.trim().length >= 0;
}

export const formateDate = (dateString: string) => {
    const date: Date = new Date(dateString);
    const now: Date = new Date();

    const seconds = moment(now).diff(date, 'seconds');
    const minutes = moment(now).diff(date, 'minutes')
    const hours = moment(now).diff(date, 'hours');

    if (seconds < 60) return seconds + "s";
    if (minutes < 60) return minutes + "m";
    if (hours < 24) return hours + "h";

    return date.getDate() + " " + months[date.getMonth()] + ", " + date.getFullYear();
}