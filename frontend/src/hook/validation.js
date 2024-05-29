
const ValidationProperty = {

  validateRequired: (value) => {
    if (value === null || value === '') return 'This field is required ! '
    return undefined
  },

  validatePhoneNumber: (value) => {
    const phoneRegex = /^09\d{9}$/; // Regular expression for "09" followed by 9 digits
    if (!phoneRegex.test(value)) {

      return 'Invalid Phone Number format ! '
    }
    return undefined
  },

  validateEmail: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Invalid email format ! ';
    }
    return undefined; // No error if valid
  },


  validateRollno: (value) => {
    const rollRegex = /^(5CS|5CT)[-]\d+$/;
    if (!rollRegex.test(value)) {

      return 'Invalid roll number format ! ';
    }
    return undefined
  },

  validatePassword: (value) => {
    if (!value || value.length < 6) return 'Password must be at least 6 characters long !'
    return undefined
  },

  validateFoundingYear: (value) => {
    const yearRegex = /^\d{4}$/;
    if (yearRegex.test(value)) {
      const year = parseInt(value);
      if (year < 1500 || year > 2024) {
        return 'Founding year must be between 1500 and 2024 ! ';
      }
    }
    return 'Founding year must be a 4-digit number ! ';

  }


}
export default ValidationProperty