// defining global validation rules
import pinia from "@/pinia";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";

const store = useDoctorsRegistrationStore(pinia);

const rules = {
  required: (val) => !!val || "Field is required",
  number: (val) => {
    if (val) {
      return val.match(/^[0-9]+$/) != null || "Field must be number";
    }

    return true;
  },
  single_word: (val) =>
    val.match(/^(([A-Za-z]+)?)$/) != null ||
    "Only contains alphabets and must be single word",
  email: (val) => {
    if (val) {
      return (
        /^\S+@\S+\.\S+$/.test(
          val
        ) || "Invalid email format"
      );
    }
    return true;
  },
  email_same_for_secondary: (val) =>
    val !== store.doctorRegistrationFormData.contact_person.primary_email ||
    "The secondary email should not match with primary email.",
  email_same_for_primary: (val) =>
    val !== store.doctorRegistrationFormData.contact_person.secondary_email ||
    "The secondary email should not match with primary email.",
    less_then_29_character: (val) =>
    val.length <= 29 ||
    "The clia number must not be greater than 29",
    password_length: (val) => val.length > 7 || "The password length must be greater than equal to 8 digits",
    less_then_14_character: (val) =>
    val.length <= 14 ||
    "The clia number must not be greater than 14",
    less_then_200_character:(val) =>
          val.length <= 200 ||
          "The clia number must not be greater than 14",
          accept_positive_value:(val) =>
          val.length > 0 ||
          "The clia number must not be greater than 14",
  alphabets: (val) =>
    val.match(/^[A-Za-z\s]+$/) != null || "Value can only contain alphabets",
  alphanumeric: (val) =>
    val.match(/^[a-zA-Z\s0-9]+$/) != null ||
    "Value can only contain numbers, alphabets and spaces",
  string: (val) =>
    val.match(/[a-z0-9][a-z]+[0-9]+/) != null ||
    "Value can only contain numbers and alphabets",
  phone: (val) =>
    val.match(
      /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/
    ) != null || "Invalid valid phone number",
  phone_optional: (val) => {
    if (val) {
      return (
        val.match(
          /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/
        ) != null || "Invalid valid phone number"
      );
    }
    return true;
  },
  note_max_length: (val) => val.length <= 150 || "Note length must be less than 150 digits",
  positiveDecimalNumbers: (val) => {
    return (
      String(val).match(/^(0|[1-9]\d*)(\.\d+)?$/) != null ||
      "Value can only contain positive decimal numbers"
    );
  },
  bloodPressure: (val) => {
    return (
      val >=0 && val <= 380 ? true :
      "Value should be between 0 and 380"
    );
  },
  heightInCm: (val) => {
    return (
      val >=1 && val <= 304.80 ? true :
      "Value should be between 1 and 304.80 cm"
    );
  },
  heightInInch: (val) => {
    return (
      val >=1 && val <= 120 ? true :
      "Value should be between 1 and 120 inches"
    );
  },
  heightInFtIn: (val) => {
    return (
      val >=0 && val <= 10 ? true :
      "Value should be between 0 and 10 ft/in"
    );
  },
  weightInPound: (val) => {
    return (
      val >=1 && val <= 1543.24 ? true :
      "Value should be between 1 and 1543.24 lbs"
    );
  },
  weightInGram: (val) => {
    return (
      val >=1 && val <= 700000 ? true :
      "Value should be between 1 and 700,000 g"
    );
  },
  weightInKg: (val) => {
    return (
      val >=1 && val <= 700 ? true :
      "Value should be between 1 and 700 kgs"
    );
  },
  bmi: (val) => {
    return (
      val >=1 && val <= 99 ? true :
      "Value should be between 1 and 99"
    );
  },
  heartRate: (val) => {
    return (
      val >=1 && val <= 300 ? true :
      "Value should be between 1 and 300"
    );
  },
  inhaledO: (val) => {
    return (
      val >=0 && val <= 100 ? true :
      "Value should be between 0 and 100"
    );
  },
  pulse: (val) => {
    return (
      val >=1 && val <= 300 ? true :
      "Value should be between 1 and 300"
    );
  },
  respiratoryRate: (val) => {
    return (
      val >=1 && val <= 300 ? true :
      "Value should be between 1 and 300"
    );
  },
  waistCircuminInches: (val) => {
    return (
      val <= 200 ? true :
      "Value shouldn't be more than 200 inches"
    );
  },
  waistCircuminFt: (val) => {
    return (
      val <= 16.67 ? true :
      "Value shouldn't be more than 16.67 ft"
    );
  },
  temperatureInF: (val) => {
    return (
      val >=1 && val <= 122.00 ? true :
      "Value shouldn't be more than 122 F"
    );
  },
  temperatureInC: (val) => {
    return (
      val >=1 && val <= 50 ? true :
      "Value shouldn't be more than 50 C"
    );
  },
  note: (val) => {
   return [...val].length <=254 ? true : "Note should be less than 254 characters"
  },
  twoDecimalPlace: (val) => {
    if (val) {
      return val.match(/^(?:\d*\.\d{1,2}|\d+)$/) != null || "Value cannot have more than 2 decimal places";
    }
    return true;
  },
  dateSlash: (val) => {
    if (val) {
      let my_date = new Date(val);
      return (
        (String(val).match(
          /^\d{4}\/(0?[1-9]|1[012])\/(0?[1-9]|[12][0-9]|3[01])$/
        ) != null &&
          parseInt(my_date.getFullYear()) <= 2050) ||
        "false"
      );
    }

    return true;
  },
};

export default rules;