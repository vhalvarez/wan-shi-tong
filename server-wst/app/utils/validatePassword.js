import validator from 'validator';

const validatePassword = (password) => {
    const minLength = 8;
    return (
        validator.isLength(password, { min: minLength }) &&
        validator.matches(password, /[A-Z]/) &&  // Al menos una letra mayúscula
        validator.matches(password, /[a-z]/) &&  // Al menos una letra minúscula
        validator.matches(password, /[0-9]/) &&  // Al menos un número
        validator.matches(password, /[!@#$%^&*(),.?":{}|<>]/)  // Al menos un carácter especial
    );
}

export default validatePassword;
