<template>
  <keep-alive>
    <div class="px-40">
      <EditableInfo
        :updating="updating"
        @form-submit="saveChanges"
        :information="section"
        :data="data"
        :model="model"
      ></EditableInfo>
    </div>
  </keep-alive>
</template>
<script setup>
import EditableInfo from "@/partials/EditableInfo.vue";
import { ref, computed } from "vue";
import { usePracticeStore } from "@/store/practice";
import enums from "@/composables/enums";
import { useGeneralStore } from "@/store/general";
import rules from "../../../../composables/validation-rules";
import moment from "moment";
import { date } from "quasar";
import maskings from "@/composables/masking";
import { useUserStore } from "@/store/user";
import useCountryData from "@/composables/country-related-data";

const userStore = useUserStore();

const storeGeneral = useGeneralStore();
const practiceStore = usePracticeStore();
const updating = ref(false);
const data = computed(() => {
  let object = {};
  practiceStore.currentPatient.data?.common_contact?.forEach((contact) => {
    if (contact.contact_reference === "emergency contact") {
      if (contact.country_id) {
        storeGeneral.getStateRequest(contact.country_id);
      }
      if (contact.state_id) {
        storeGeneral.getCityRequest(contact.state_id);
      }
      object = JSON.parse(JSON.stringify(contact));
      return object;
    }
  });
  return object ? object : {};
});
let newDate = date.subtractFromDate(moment().format("YYYY/MM/DD"), {
  hours: 24,
});
const current_date = date.formatDate(newDate, "YYYY/MM/DD");

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  updating.value = true;
  practiceStore
    .saveReferenceContactInfo({
      ...updatedData,
      patient_id: userStore.loginUser.id,
      contact_reference: "emergency contact",
      contact_id: data.value.id,
    })
    .then(() => {
      updating.value = false;
    })
    .catch(() => {
      updating.value = false;
    });
};
const model = ref({});
const section = ref([
  {
    heading: "Emergency Contact",
    fields: [
      {
        label: "Patient relationship",
        value: "patient_relationship",
        input: {
          label: "Select patient relationship",
          placeholder: "Select patient relationship",
          type: "select",
          options: enums.patient_relationship,
          rules: [rules.required],
        },
      },
      {
        label: "Suffix",
        value: "suffix",
        input: {
          label: "Suffix",
          placeholder: "Select suffix",
          type: "select",
          options: enums.suffix,
        },
      },
      {
        label: "First name",
        value: "first_name",
        input: {
          label: "First name",
          placeholder: "Enter first name",
          type: "text",
          rules: [rules.required, (val) => !val || val.length <= 29 || false],
        },
      },
      {
        label: "Middle name",
        value: "middle_name",
        input: {
          label: "Middle name",
          placeholder: "Enter middle name",
          type: "text",
          rules: [(val) => !val || val.length <= 29 || false],
        },
      },
      {
        label: "Last name",
        value: "last_name",
        input: {
          label: "Last name",
          placeholder: "Enter last name",
          type: "text",
          rules: [rules.required, (val) => !val || val.length <= 29 || false],
        },
      },
      {
        label: "Email",
        value: "email",
        input: {
          label: "Email",
          placeholder: "Enter email",
          type: "email",
          rules: [rules.email],
        },
      },
      {
        label: "Date of birth",
        value: "dob",
        format: "DD MMM YYYY",
        input: {
          label: "Date of birth",
          placeholder: "Enter date of birth",
          type: "date",
          max: current_date,
        },
      },
      {
        label: "Zip code",
        value: "zip_code",
        input: {
          label: "Zip code",
          placeholder: "Enter zip code",
          type: "text",
          rules: [(val) => !val || val.length <= 14 || false],
        },
      },
      {
        label: "Country",
        value: "country_id",
        helper: "getCountry",
        input: {
          label: "Country",
          placeholder: "Select country",
          type: "select",
          next_dropdown_required: true,
          key: "country_id",
          options: storeGeneral.countries,
        },
      },
      {
        label: "State",
        value: "state_id",
        helper: "getState",
        input: {
          label: "State",
          placeholder: "Select state",
          type: "select",
          next_dropdown_required: true,
          key: "state_id",
          options: computed(() => storeGeneral.states),
        },
      },
      {
        label: "City",
        value: "city_id",
        helper: "getCity",
        input: {
          label: "City",
          placeholder: "Select city",
          type: "select",
          options: computed(() => storeGeneral.cities),
        },
      },
      {
        label: "Phone number",
        value: "phone",
        prepend_key: "country_code",
        country_code: "country_code",
        input: {
          label: "Phone number",
          placeholder: "",
          type: "phone",
        },
      },
      {
        label: "Home address",
        value: "address",
        input: {
          label: "Home address",
          placeholder: "Enter home address",
          type: "text",
          rules: [(val) => !val || val.length <= 200 || false],
        },
      },
      {
        label: useCountryData(userStore.loginUser.practice_country_name, 'nic'),
        value: "emirates_id",
        input: {
          label: useCountryData(userStore.loginUser.practice_country_name, 'nic'),
          placeholder: useCountryData(userStore.loginUser.practice_country_name, 'nic_placeholder'),
          type: "text",
          rules: [(val) => !val || val.length <= 16 || false],
          mask: maskings.emirates_id,
        },
      },
    ],
  },
]);
</script>
<style lang="scss" scoped></style>
