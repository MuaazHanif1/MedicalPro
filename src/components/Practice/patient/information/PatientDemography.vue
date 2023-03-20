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
import { useGeneralStore } from "@/store/general";
import enums from "@/composables/enums";
import { useRoute } from "vue-router";
import rules from "../../../../composables/validation-rules";

const route = useRoute();
const practiceStore = usePracticeStore();
const storeGeneral = useGeneralStore();
const data = computed(() =>
  practiceStore.currentPatient.data.patient_demography
    ? practiceStore.currentPatient.data.patient_demography
    : {}
);
const updating = ref(false);
const model = ref({});
const section = ref([
  {
    heading: "Demographics",
    fields: [
      {
        label: "Language",
        value: "language_id",
        helper: "getLanguage",
        input: {
          label: "Language",
          placeholder: "Select language",
          type: "select",
          options: storeGeneral.languages,
          optionvalue: "id",
          optionlabel: "language",
        },
      },
      {
        label: "Assigned birth sex",
        value: "assigned_sex_at_birth",
        input: {
          label: "Assigned birth sex",
          placeholder: "Select assigned birth Sex",
          type: "select",
          options: enums.assigned_sex_at_birth,
        },
      },
      {
        label: "Race",
        value: "race_id",
        helper: "getRace",
        input: {
          label: "Race",
          placeholder: "Select race",
          type: "select",
          options: storeGeneral.races,
          optionvalue: "id",
          optionlabel: "name",
        },
      },
      {
        label: "Pronoun",
        value: "pronoun",
        input: {
          label: "Pronoun",
          placeholder: "Select pronoun",
          type: "select",
          options: enums.pronoun,
        },
      },
      {
        label: "Ethnicity",
        value: "ethnicity_id",
        helper: "getEthnicity",
        input: {
          label: "Ethnicity",
          placeholder: "Select ethnicity",
          type: "select",
          options: storeGeneral.ethnicities,
          optionvalue: "id",
          optionlabel: "name",
        },
      },
      {
        label: "Home bound",
        value: "home_bound",
        input: {
          label: "Home bound",
          placeholder: "Select home bound",
          type: "select",
          options: enums.home_bound,
        },
      },
      {
        label: "Sexual orientation",
        value: "sexual_orientation",
        input: {
          label: "Sexual orientation",
          placeholder: "Select sexual orientation",
          type: "select",
          options: enums.sexual_orientation,
        },
      },
      {
        label: "Gender identity",
        value: "gender_identity",
        input: {
          label: "Gender identity",
          placeholder: "Gender identity",
          type: "select",
          options: enums.gender_identity,
        },
      },
      {
        label: "Marital status",
        value: "marital_status",
        input: {
          label: "Marital status",
          placeholder: "Select marital status",
          type: "select",
          options: enums.marital_status,
        },
      },
      {
        label: "Homeless status",
        value: "homeless_status",
        input: {
          label: "Homeless status",
          placeholder: "Enter homeless status",
          type: "select",
          options: enums.decision,
        },
      },
      {
        label: "Family size",
        value: "family_size",
        input: {
          label: "Family size",
          placeholder: "Enter your family size",
          type: "text",
          rules: [rules.number, (val) => !val || parseInt(val) <= 100 || false],
        },
      },
      {
        label: "School based health",
        value: "school_based_health_center_patient",
        input: {
          label: "School based health",
          placeholder: "Enter your school based health",
          type: "select",
          options: enums.decision,
        },
      },
      {
        label: "Income",
        value: "income",
        input: {
          label: "Income",
          placeholder: "Enter income",
          type: "text",
          rules: [rules.number],
        },
      },
      {
        label: "Per",
        value: "income_define_per",
        input: {
          label: "Per",
          placeholder: "Select per",
          type: "select",
          options: enums.income_define_per,
        },
      },
      {
        label: "Veteran",
        value: "veteran_status",
        input: {
          label: "Veteran",
          placeholder: "Enter veteran",
          type: "select",
          options: enums.decision,
        },
      },
      {
        label: "Agricultural worker",
        value: "agricultural_worker",
        input: {
          label: "Agricultural worker",
          placeholder: "Enter your agricultural worker",
          type: "select",
          options: enums.decision,
        },
      },
      {
        label: "Public housing",
        value: "public_housing_patient",
        input: {
          label: "Public housing",
          placeholder: "Enter your public housing",
          type: "select",
          options: enums.decision,
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
    .saveDemographicInfo({ ...updatedData, patient_id: route.params.id })
    .then(() => {
      updating.value = false;
    })
    .catch(() => {
      updating.value = false;
    });
};
</script>
<style lang="scss" scoped></style>
