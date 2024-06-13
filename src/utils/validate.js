export const checkValidData = (email, password) => {
    // if this regex is pass then it will return TRUE inside it or FALSE inside "isEmailValid"
    const isEmailValid = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,})$/.test(
        email
    );

    // if this regex is pass then it will return TRUE inside it or FALSE inside "isPasswordValid"
    const isPasswordValid =
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);


    // const isNameValid = /\b([A-Z][-,a-z. ']+[ ]*)+/.test(name)

    // return's Error Message
    if (!isEmailValid) return "Email ID is not valid";
    if (!isPasswordValid) return "Password is not valid";
    // if (!isNameValid) return "Name is not valid";

    //if both are valid then return null i.e. No Error
    return null;
};
