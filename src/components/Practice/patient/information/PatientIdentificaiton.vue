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
import rules from "@/composables/validation-rules";
import {date} from 'quasar';
import maskings from "@/composables/masking";
import { useUserStore } from "@/store/user";
import useCountryData from "@/composables/country-related-data";

const userStore = useUserStore();

const practiceStore = usePracticeStore();
const data = computed(() =>
  practiceStore.currentPatient.data.patient_identification
    ? practiceStore.currentPatient.data.patient_identification
    : {}
);
const updating = ref(false);
let newDate = date.formatDate(Date.now(),"YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate,"YYYY/MM/DD");
const model = ref({});
const section = ref([
  {
    heading: "Identification",
    fields: [
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
        label: "Legal first name",
        value: "legal_first_name",
        input: {
          label: "Legal first name",
          placeholder: "Enter legal first name",
          type: "text",
          rules: [rules.required, (val) => (!val || val.length <= 29) || false],
        },
      },
      {
        label: "Legal middle name",
        value: "legal_middle_name",
        input: {
          label: "Legal middle name",
          placeholder: "Enter legal middle name",
          type: "text",
          rules: [(val) => (!val || val.length <= 29) || false]
        },
      },
      {
        label: "Legal last name",
        value: "legal_last_name",
        input: {
          label: "Legal last name",
          placeholder: "Enter legal last name",
          type: "text",
          rules: [rules.required, (val) => (!val || val.length <= 29) || false],
        },
      },
      {
        label: "Previous name",
        value: "previous_name",
        input: {
          label: "Previous name",
          placeholder: "Enter previous name",
          type: "text",
          rules: [(val) => (!val || val.length <= 29) || false]
        },
      },
      {
        label: "Legal sex",
        value: "legal_sex",
        input: {
          label: "Legal sex",
          placeholder: "Select legal sex",
          type: "select",
          options: enums.gender1,
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
        label: useCountryData(userStore.loginUser.practice_country_name, 'nic'),
        value: "emirates_id",
        input: {
          label:  useCountryData(userStore.loginUser.practice_country_name, 'nic'),
          placeholder: useCountryData(userStore.loginUser.practice_country_name, 'nic_placeholder'),
          type: "text",
          rules: [(val) => (!val || val.length <= 29) || false],
          mask: maskings.emirates_id,
        },
      },
      {
        label: "Mother name",
        value: "mother_name",
        input: {
          label: "Mother name",
          placeholder: "Enter mother name",
          type: "text",
          rules: [(val) => (!val || val.length <= 29) || false]
        },
      },
    ],
  },
]);

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  updating.value = true;
  practiceStore
    .saveIdentificationInfo({ ...updatedData, patient_id: userStore.loginUser.id })
    .then(() => {
      updating.value = false;
    })
    .catch(() => {
      updating.value = false;
    });
};
</script>
<style lang="scss" scoped></style>
