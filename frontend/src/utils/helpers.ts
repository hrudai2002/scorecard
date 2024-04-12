export const validateEmail = (email: string) => {
    const regex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/; 
    return regex.test(email) && email.trim().length > 0;
}

export const validatePassword = (password: string) => {
    return password.length >= 6 && password.trim().length >= 0;
}