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
import { ref, computed, onMounted } from "vue";
import { usePracticeStore } from "@/store/practice";
import { useGeneralStore } from "@/store/general";
import rules from "@/composables/validation-rules";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const storeGeneral = useGeneralStore();
const practiceStore = usePracticeStore();

storeGeneral.cities = [];
storeGeneral.states = [];
const updating = ref(true);
const data = computed(() =>
  practiceStore.currentPatient.data.patient_employment
    ? practiceStore.currentPatient.data.patient_employment
    : {}
);
const model = ref({});
const section = ref([
  {
    heading: "Employment",
    fields: [
      {
        label: "Occupation",
        value: "occupation",
        input: {
          label: "Occupation",
          placeholder: "Enter occupation",
          type: "text",
          rules: [rules.required, (val) => val.length <= 29 || false],
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
        label: "Employer name",
        value: "employer_name",
        input: {
          label: "Employer name",
          placeholder: "Enter employer name",
          type: "text",
          rules: [rules.required, (val) => val.length <= 29 || false],
        },
      },
      {
        label: "Industry",
        value: "industry",
        input: {
          label: "Industry",
          placeholder: "Enter industry",
          type: "text",
          rules: [(val) => !val || val.length <= 29 || false],
        },
      },
      {
        label: "Zip code",
        value: "zip_code",
        input: {
          label: "Zip code",
          placeholder: "Enter zip code",
          type: "text",
          rules: [(val) => !val || val.length <= 13 || false],
        },
      },
      {
        label: "Phone number",
        value: "phone",
        prepend_key: "country_code",
        country_code: "country_code",
        input: {
          label: "Phone number",
          placeholder: "Enter phone number",
          type: "phone",
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
        label: "Employer address",
        value: "employer_address",
        input: {
          label: "Employer address",
          placeholder: "Enter employer address",
          type: "text",
          rules: [(val) => !val || val.length <= 200 || false],
        },
      },
    ],
  },
]);

onMounted(() => {
  Promise.allSettled([
    storeGeneral.getStateRequest(data.value.country_id),
    storeGeneral.getCityRequest(data.value.state_id),
  ]).then(() => {
    updating.value = false;
  });
});

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  updating.value = true;
  practiceStore
    .saveEmployeeInfo({ ...updatedData, patient_id: userStore.loginUser.id })
    .then(() => {
      updating.value = false;
    })
    .catch(() => {
      updating.value = false;
    });
};
</script>
<style lang="scss" scoped></style>
