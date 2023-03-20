import { defineStore } from "pinia";
import axiosApiClient from "@/axios";
import { date } from "quasar";

import { useUserStore } from "./user";
// import { useRouter } from "vue-router";

//import { createFormData } from "@/composables/useFormData";

// import { createFormData } from "@/composables/useFormData";

export const useDoctorsRegistrationStore = defineStore("doctors_registration", {
  state: () => ({
    doctorRegistrationFormData: {
      contact_person: {
        heading: "Contact person details",
        sub_heading: "Provide information about contact details",
        suffix: "Mr",
        first_name: "",
        middle_name: "",
        last_name: "",
        gender: "Male",
        country_code_primary_phone_number: "",
        country_code_secondary_phone_number: "",
        primary_phone_number: "",
        secondary_phone_number: "",
        primary_email: "",
        secondary_email: "",
        dob: date.formatDate(
          date.subtractFromDate(Date.now(), { years: 18 }),
          "DD MMMM YYYY"
        ),
        marital_status: "Single",
        specialization_id: [],
      },
      address: [
        {
          current_address_1: "",
          current_address_2: "",
          current_country_id: "",
          current_state_id: "",
          current_city_id: "",
          current_zip_code: "",
        },
        {
          home_town_address_1: "",
          home_town_address_2: "",
          home_town_country_id: "",
          home_town_state_id: "",
          home_town_city_id: "",
          home_town_zip_code: "",
        },
      ],
      legal_information: {
        license_number: "",
        emirate_id: "",
        passport_number: "",
      },
      attached_documents: {
        license_photo_url: "",
        passport_photo_url: "",
        emirate_photo_url: "",
      },
      file_attached: {
        file1: {
          type: "png",
          size: "",
          name: "",
          url: "",
        },
        file2: {
          type: "png",
          size: "",
          url: "",
        },
        file3: {
          type: "png",
          size: "",
          url: "",
        },
      },
    },
    specialization_option: [
      { id: 1, name: "Dermatology" },
      { id: 2, name: "Neurology" },
      { id: 3, name: "Internal medicine" },
      { id: 14, name: "Dermatology" },
    ],
    token:
      "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxIiwianRpIjoiNzJjZGQ2MmFmN2FmYThmZWM1YzlhMjdkNTE1MjIwZWZmMzhiNGY4Y2ViNjhiMzVjM2MyZTkwM2FlMjc3NDhlMWYwMmRiMDk1NTA4ODMxZTkiLCJpYXQiOjE2NjAzMDM0NzYuNDk2ODY4LCJuYmYiOjE2NjAzMDM0NzYuNDk2ODY5LCJleHAiOjE2OTE4Mzk0NzYuNDg4NjQ0LCJzdWIiOiIxIiwic2NvcGVzIjpbXX0.VU_fwv39GLXo9PsGsQ7A9g-Jd-rHXx1YR-O3zByaZuMwgtQ4kJdORHCpgyEMIWkwrd2f6635tVHQlrMghagUpAsQqkGKAqw_VIBEnVDUi0TfIJGnjnL6vO1nnI4h-lUIycaF3q2IWLnh737PSXNWi6dZ9fuiw6bLtRqFd--up3lmYI-0FeU6FZxvAq1igYNtEewYGTHGBn90wTrdgaFGLgIl7mV2EKmfBYI0MwJwNeFA7cFrszitZHCB1TWu0NbosNqUa4GXgsyqEe_a35_YanjUIFavahYOlGXyvdXXN_F4lH_FvNq-FgYg9YCokCSPkP28Aw-F6aoHaEy307583kUNi1faNQU2KJG3gB7gT7jpnpMafVJw6nH97JtkZTXyZ6ftjsNxVZwH3cG1IUQAmoAKtRrq9rzmEam_Oi7S0LkduiBF68EjCpwvQrgyOkZ0X6BseCIX-PIzuS_IHWYA4aQTdD65fSpig9cqNzPxIJp0uzVmxLJVqU_arSeC8C2IJP5fhs62rxOGtDwDkLKmfIr1N5OL3M724WdFzamSaIDvZicIwd5m4JiEWi0brGy83ckak5lAdFBbGLXaWmoQdToipg8DJJxw3sv6O2ORhN5g3WNEQKENn1Vn0ymDeT8QKfKQqamwd3ikYSR0HgJkFHLKUfFVtDJ9bu3jn8SsOwc",
    uploadPercentage: 0,
    consent_form: [],
    doctor_response_after_create: {}, // this variable used for the store data when the request is submitted for doctor registration
    isRequesting: false,
    doctor_country_state_country_information: {
      country: [],
      current: {
        current_state: [],
        current_city: [],
      },
      hometown: {
        hometown_state: [],
        hometown_city: [],
      },
    },
  }),
  getters: {
    getCurrentCountry(state) {
      return state.doctorRegistrationFormData.address[0].current_country_id
        ? state.doctorRegistrationFormData.address[0].current_country_id
        : true;
    },
    getCurrentState(state) {
      return state.doctorRegistrationFormData.address[0].current_state_id
        ? state.doctorRegistrationFormData.address[0].current_state_id
        : true;
    },
    getHometownCountry(state) {
      return state.doctorRegistrationFormData.address[1].home_town_country_id
        ? state.doctorRegistrationFormData.address[1].home_town_country_id
        : true;
    },
    getHometownState(state) {
      return state.doctorRegistrationFormData.address[1].home_town_state_id
        ? state.doctorRegistrationFormData.address[1].home_town_state_id
        : true;
    },
  },
  actions: {
     /**
     * Description: get the updated value from the text field and  update the main object. 
     * @param {object} index ,value,mainProperty,innerPropert of object
     * @returns {null} no return for this function
     */
    updatingDoctorsRegistrationFormValue(value) {
      if (value._arrayindex !== -1) {
        this.doctorRegistrationFormData[value.mainProperty][value._arrayindex][
          value.property
        ] = value.updatedData;
      } else {
        this.doctorRegistrationFormData[value.mainProperty][value.property] =
          value.updatedData;
      }
    },
         /**
     * Description:This function is used to get all specilization. 
     * @param {object} index ,value,mainProperty,innerPropert of object
     * @returns {null} no return for this function
     */
    async getDoctorSpecialization() {
      const data = await axiosApiClient
        .get("doctor-specializations")
        .then((res) => {
          this.specialization_option = res.data.data;
        })
        .catch((error) => {
          console.log(error);
        });
      return data;
    },
    async getDoctorAgreement() {
      const data = await axiosApiClient
        .get("doctors/register-doctor-publish-consent-forms")
        .then((res) => {
          this.consent_form = res.data;
          return res.data;
        })
        .catch((error) => {
          throw error;
        });
      return data;
    },
    async setDoctorAgreement() {
      const temp = [];
      const userStore = useUserStore();
      if (this.consent_form.data.length) {
        this.consent_form.data.forEach((element) => {
          const obj = {
            consent_form_id: element.publish_consent_form.id,
            consent_form_type_id:
              element.publish_consent_form.consent_form_type_id,
            category_id: userStore.$state.loginUser.id,
            consent_status: element.is_agree ? element.is_agree:"AGREE",
            category: element.category,
          };
          temp.push(obj);
        });
      }
      const data = await axiosApiClient
        .post("doctors/add-consent-log", temp)
        .then((res) => {
          return res.data;
        })
        .catch((error) => {
          console.log(error);
        });
      // location.reload();
      return data;
    },
    async requestDoctorRegistrationForm() {
      this.isRequesting = true;
      let temp = {
        ...this.doctorRegistrationFormData.contact_person,
        ...this.doctorRegistrationFormData.address[0],
        ...this.doctorRegistrationFormData.address[1],
        ...this.doctorRegistrationFormData.legal_information,
        ...this.doctorRegistrationFormData.attached_documents,
      };
      temp.dob = this.getDateFormat(temp.dob);
      const userStore = useUserStore();
      temp.practice_id = userStore.$state.loginUser.practice_id;
      temp.doctor_key = userStore.$state.loginUser.doctor_key;
      temp.doctor_id = userStore.$state.loginUser.id;
      delete temp.heading;
      delete temp.sub_heading;
      //const formData = createFormData(temp);
      const data = await axiosApiClient
        .post("/doctors/store-doctor-draft-by-doctor", temp)
        .then((res) => {
          if (res) {
            this.doctor_response_after_create.doctor_id = res.data.doctor.id;
            this.doctor_response_after_create.created_date = date.formatDate(
              res.data.doctor.created_at,
              "YYYY-MM-DD"
            );
            this.doctor_response_after_create.created_time = date.formatDate(
              res.data.doctor.created_at,
              "hh:mm A"
            );
            // res.data.doctor.created_at;
            this.setDoctorAgreement(res.data.doctor.id);
            userStore.$state.loginUser.kyc_verification_url =
              res.data.verification_url;
              // const router = useRouter();
              location.reload();
          }
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          userStore.$state.loginUser.account_registration = true;
          this.isRequesting = false;
        });
      return data;
    },
    async requestDoctorDraftRegistrationForm() {
      let temp = {
        ...this.doctorRegistrationFormData.contact_person,
        ...this.doctorRegistrationFormData.address[0],
        ...this.doctorRegistrationFormData.address[1],
        ...this.doctorRegistrationFormData.legal_information,
        ...this.doctorRegistrationFormData.attached_documents,
      };
      delete temp.heading;
      delete temp.sub_heading;
      const userStore = useUserStore();
      temp.practice_id = userStore.$state.loginUser.practice_id;
      temp.doctor_key = userStore.$state.loginUser.doctor_key;
      temp.doctor_id = userStore.$state.loginUser.id;
      const data = await axiosApiClient
        .post("/doctors/update-doctor-draft", temp)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {});
      return data;
    },
    //doctors/update-doctor-draft
    async getDoctorRegistrationData() {
      //this.isRequesting = true;
      const data = await axiosApiClient
        .get("doctors/doctor-registration-details")
        .then((res) => {
          this.setDoctorData(res.data.data);
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          // this.isRequesting = false;
        });
      return data;
    },
    // function for formating the date for backends store
    getDateFormat(tempdate) {
      return tempdate ? date.formatDate(new Date(tempdate), "YYYY-MM-DD") : "";
    },
     // function for formating the date for view
   
    setDoctorData(data) {
      const contactPerson = [
        "suffix",
        "first_name",
        "middle_name",
        "last_name",
        "gender",
        "country_code_primary_phone_number",
        "country_code_secondary_phone_number",
        "primary_phone_number",
        "secondary_phone_number",
        "primary_email",
        "dob",
        "marital_status",
        "specialization_id",
        "secondary_email",
      ];
      const address = [
        "current_address_1",
        "current_address_2",
        "current_country_id",
        "current_state_id",
        "current_city_id",
        "current_zip_code",
        "home_town_address_1",
        "home_town_address_2",
        "home_town_country_id",
        "home_town_state_id",
        "home_town_city_id",
        "home_town_zip_code",
      ];
      const legalInformation = [
        "license_number",
        "emirate_id",
        "passport_number",
      ];
      const attacheDocuments = [
        "license_photo_url",
        "passport_photo_url",
        "emirate_photo_url",
      ];

      for (const property in data) {
        if (contactPerson.includes(property)) {
          this.doctorRegistrationFormData.contact_person[property] = data[
            property
          ]
            ? data[property]
            : "";
        } else if (address.includes(property)) {
          if (address.slice(0, 6).includes(property)) {
            this.doctorRegistrationFormData.address[0][property] = data[
              property
            ]
              ? data[property]
              : "";
          } else {
            this.doctorRegistrationFormData.address[1][property] = data[
              property
            ]
              ? data[property]
              : "";
          }
        } else if (legalInformation.includes(property)) {
          this.doctorRegistrationFormData.legal_information[property] = data[
            property
          ]
            ? data[property]
            : "";
        } else if (attacheDocuments.includes(property)) {
          this.doctorRegistrationFormData.attached_documents[property] = data[
            property
          ]
            ? data[property]
            : "";
        }
      }
    },
    getNameValue(id, helpername, address, location) {
      if (helpername == "getCountry") {
        return this.doctor_country_state_country_information.country.find(
          (x) => x.id === id
        )?.name;
      } else if (helpername == "getState") {
        return this.doctor_country_state_country_information[address][
          location
        ].find((x) => x.id === id)?.name;
      } else if (helpername == "getCity") {
        return this.doctor_country_state_country_information[address][
          location
        ].find((x) => x.id === id)?.name;
      }
    },
    async getAgreeConstentForms() {
      //this.isRequesting = true;
      const data = await axiosApiClient
        .get("doctors/consent-log-response")
        .then((res) => {
          return res?.data?.data;
        })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          // this.isRequesting = false;
        });
      return data;
    },
  },
});
