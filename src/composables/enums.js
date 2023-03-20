const marital_status = [
  { id: "Unknown", name: "Unknown" },
  { id: "Married", name: "Married" },
  { id: "Single", name: "Single" },
  { id: "Divorced", name: "Divorced" },
  { id: "Separated", name: "Separated" },
  { id: "Widowed", name: "Widowed" },
  { id: "Partner", name: "Partner" },
];

const home_bound = [
  {
    id: 'No',
    name: "No",
  },
  {
    id: 'Yes',
    name: "Yes",
  },
];

const sexual_orientation = [
  { id: "Lesbian, gay or homosexual", name: "Lesbian, gay or homosexual" },
  { id: "Straight or heterosexual", name: "Straight or heterosexual" },
  { id: "Bisexual", name: "Bisexual" },
  {
    id: "Something else, please describe",
    name: "Something else, please describe",
  },
  { id: "Do not know", name: "Do not know" },
  { id: "Choose not to disclose", name: "Choose not to disclose" },
];

const gender_identity = [
  { id: "Identifies as Male", name: "Identifies as Male" },
  { id: "Identifies as Female", name: "Identifies as Female" },
  {
    id: "Transgender Male/Female-to-Male (FTM)",
    name: "Transgender Male (FTM)",
  },
  {
    id: "Transgender Female/Male-to-Female (MTF)",
    name: "Transgender Female (MTF)",
  },
  {
    id: "Gender non-conforming (neither exclusively male nor female)",
    name: "non-conforming",
  },
  {
    id: "Additional gender category / other, please specify",
    name: "Other gender category",
  },
  { id: "Choose not to disclose", name: "Choose not to disclose" },
];


const income_define_per = [
  { id: "Year", name: "Year" },
  { id: "Month", name: "Month" },
  { id: "2 Weeks", name: "2 Weeks" },
  { id: "Week", name: "Week" },
  { id: "Hourly", name: "Hourly" },
  { id: "Choose not to disclose", name: "Choose not to disclose" },
];

const contact_reference = [
  { id: "guarantor", name: "guarantor" },
  { id: "gardian", name: "gardian" },
  { id: "next to kin", name: "next to kin" },
  { id: "emergency contact", name: "emergency contact" },
];
const gender = [
  { id: "Male", name: "Male" },
  { id: "Female", name: "Female" },
  { id: "Choose not to disclose", name: "Choose not to disclose" },
  { id: "Other", name: "Other" },
];

const criticality = [
  {
    id: "Low",
    name: "Low",
  },
  {
    id: "High",
    name: "High",
  },
  {
    id: "Unable to assess",
    name: "Unable to assess",
  },
];

const allergy_severity = [
  {
    id: "Mild",
    name: "Mild",
  },
  {
    id: "Moderate",
    name: "Moderate",
  },
  {
    id: "Severe",
    name: "Severe",
  },
];

const assigned_sex_at_birth = [
  { id: "Male", name: "Male" },
  { id: "Female", name: "Female" },
  { id: "Choose not to disclose", name: "Choose not to disclose" },
  { id: "unknown", name: "unknown" },
];

const patient_relationship = [
  { id: "Spouse", name: "Spouse" },
  { id: "Parent", name: "Parent" },
  { id: "Child", name: "Child" },
  { id: "Sibling", name: "Sibling" },
  { id: "Friend", name: "Friend" },
  { id: "Cousin", name: "Cousin" },
  { id: "Guardian", name: "Guardian" },
  { id: "Other", name: "Other" },
];

const contact_preference = [
  {
    id: "Home phone",
    name: "Home phone",
  },
  {
    id: "Work phone",
    name: "Work phone",
  },
  {
    id: "Mobile phone",
    name: "Mobile phone",
  },
  {
    id: "Mail",
    name: "Mail",
  },
  {
    id: "Portal",
    name: "Portal",
  },
];

const Boolean = [
  {
    id: true,
    name: "Yes",
  },
  {
    id: false,
    name: "No",
  },
];

const gender1 = [
  {
    id: "Male",
    name: "Male",
  },
  {
    id: "Female",
    name: "Female",
  },
  {
    id: "Other",
    name: "Other",
  },
];

const gender2 = [
  {
    id: "Male",
    name: "Male",
  },
  {
    id: "Female",
    name: "Female",
  },
  {
    id: 'Transgender',
    name: 'Transgender',
  },
  {
    id: 'Prefer not to say',
    name: 'Prefer not to say',
  },
  {
    id: "Other",
    name: "Other",
  },
];

const suffix = [
  {
    id: "Miss",
    name: "Miss",
  },
  {
    id: "Mrs",
    name: "Mrs",
  },
  {
    id: "Ms",
    name: "Ms",
  },
  {
    id: "Mr",
    name: "Mr",
  },
];

const allergy_reactions = [
  {
    id: 1,
    name: "reaction 1",
  },
  {
    id: 2,
    name: "reaction 2",
  },
];
//drug reptitions
const repetitions = [
  "every day",
  "twice a day",
  "3 times a day",
  "4 times a day",
  "5 times a day",
  "5 times a day",
  "every other day",
  "every 2 hours",
  "every 3 hours",
  "every 3-4 hours",
  "every 4 hours",
  "every 4-6 hours",
  "every 6 hours",
  "every 6-8 hours",
  "every 8 hours",
  "every 12 hours",
  "every 24 hours",
  "every 72 hours",
  "every week",
  "twice a week",
  "3 times a week",
  "every 2 weeks",
  "every 3 weeks",
  "every 4 weeks",
  "every month",
  "every 2 months",
  "every 3 months",
  "as needed",
];

// drug when to take
const when = [
  "before meals",
  "with meals",
  "after meals",
  "in the morning",
  "in the evening",
  "at noon",
  "at dinner",
  "at bedtime",
  "around the clock",
  "as directed",
  "as needed",
];
const pronoun = [
  { id: "he/him", name: "he/him" },
  { id: "she/her", name: "she/her" },
  { id: "they/them", name: "they/them" },
];

const permissions = {
  doctor: {
    role: "doctor",
    reset_password: "reset-password",
    doctor_registration: "doctor-main",
    kyc_approval: "kyc-approval",
  },
  practice: {
    role: "practice",
    reset_password: "reset-password",
  },
  all: {
    reset_password: "reset-password",
  },
};


const decision = [
  {
    id: "Yes",
    name: "Yes",
  },
  {
    id: "No",
    name: "No",
  },
  {
    id: "Patient Declined",
    name: "Patient Declined",
  },
];

export default {
  marital_status,
  sexual_orientation,
  gender_identity,
  pronoun,
  home_bound,
  income_define_per,
  contact_reference,
  gender,
  assigned_sex_at_birth,
  patient_relationship,
  contact_preference,
  Boolean,
  gender1,
  gender2,
  suffix,
  criticality,
  allergy_reactions,
  allergy_severity,
  repetitions,
  when,
  permissions,
  decision,
};
