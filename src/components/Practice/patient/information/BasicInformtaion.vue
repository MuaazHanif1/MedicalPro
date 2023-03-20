<template>
  <keep-alive>
    <div class="px-40">
      <EditableInfo :updating="updating" @form-submit="saveChanges" :information="section" :data="data"></EditableInfo>
    </div>
  </keep-alive>
</template>
<script setup>
import EditableInfo from "@/partials/EditableInfo.vue";
import { ref, computed } from "vue";
import { usePracticeStore } from "@/store/practice";
import rules from "@/composables/validation-rules";
import enums from "@/composables/enums";
import { date } from 'quasar';

const practiceStore = usePracticeStore();
const data = computed(() => practiceStore.currentPatient.data);
const updating = ref(false);
let newDate = date.formatDate(Date.now(), "YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate, "YYYY/MM/DD");

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  updating.value = true;
  practiceStore.saveBasicInfo({ ...updatedData }).then(() => {
    updating.value = false;
  });
};
const section = ref([
  {
    heading: "Basic Information",
    fields: [
      {
        label: "Legal first name",
        value: "first_name",
        input: {
          label: "Legal first name",
          placeholder: "Enter legal first name",
          type: "text",
          rules: [rules.required, (val) => (!val || val.length <= 29) || false],
        },
      },
      {
        label: "Legal middle name",
        value: "middle_name",
        input: {
          label: "Legal middle name",
          placeholder: "Enter legal middle name",
          type: "text",
          rules: [(val) => (!val || val.length <= 29) || false]
        },
      },
      {
        label: "Legal last name",
        value: "last_name",
        input: {
          label: "Legal last name",
          placeholder: "Enter legal last name",
          type: "text",
          rules: [rules.required, (val) => (!val || val.length <= 29) || false],
        },
      },
      {
        label: "Phone number",
        value: "phone_number",
        prepend_key: "country_code",
        country_code: "country_code",
        disabled: true,
        input: {
          label: "Phone number",
          placeholder: "Enter Phone number",
          type: "phone",
          rules: [rules.required],
        },
      },
      {
        label: "Gender",
        value: "gender",
        input: {
          label: "Gender",
          placeholder: "Select gender",
          type: "select",
          rules: [rules.required],
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
          rules: [rules.required],
        },
      },
    ],
  },
]);
</script>
<style lang="scss" scoped>

</style>
