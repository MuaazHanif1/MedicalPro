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
import enums from "../../../../composables/enums";
import { useQuasar } from "quasar";
import snack_error from "@/composables/error-snack";
import rules from "../../../../composables/validation-rules";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const $q = useQuasar();
const storeGeneral = useGeneralStore();
const practiceStore = usePracticeStore();
const data = computed(() => {
  if (practiceStore.currentPatient.data.patient_contact) {
    if (practiceStore.currentPatient.data.patient_contact.country_id) {
      storeGeneral.getStateRequest(
        practiceStore.currentPatient.data.patient_contact.country_id
      );
    }
    if (practiceStore.currentPatient.data.patient_contact.state_id) {
      storeGeneral.getCityRequest(
        practiceStore.currentPatient.data.patient_contact.state_id
      );
    }
    return practiceStore.currentPatient.data.patient_contact;
  } else {
    return {};
  }
});
const model = ref({});
const updating = ref(false);
storeGeneral.cities = [];
storeGeneral.states = [];

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  updating.value = true;
  practiceStore
    .saveContactInfo({ ...updatedData, patient_id: userStore.loginUser.id })
    .then(() => {
      updating.value = false;
    })
    .catch((err) => {
      updating.value = false;
      $q.notify({
        position: "top-right",
        message: snack_error(err),
        color: "negative",
        avatar: require("@/assets/svg/error.svg"),
        caption: "Please try again",
      });
    });
};

const section = ref([
  {
    heading: "Contact Information",
    fields: [
      {
        label: "Home address",
        value: "address_line_1",
        input: {
          label: "Home address",
          placeholder: "Enter home address",
          type: "text",
          rules: [(val) => (!val || val.length <= 50) || false]
        },
      },
      {
        label: "Home phone",
        value: "home_phone_number",
        prepend_key: "home_country_code",
        country_code: 'home_country_code',
        input: {
          label: "Home phone",
          placeholder: "Enter home phone",
          type: "phone",
        },
      },
      {
        label: "Zip code",
        value: "zip_code",
        input: {
          label: "Zip code",
          placeholder: "Enter zip code",
          type: "text",
          rules: [(val) => (!val || val.length <= 29) || false]
        },
      },
      {
        label: "Country",
        value: "country_id",
        helper: "getCountry",
        input: {
          label: "Country",
          placeholder: "Select country",
          next_dropdown_required: true,
          key: "country_id",
          type: "select",
          options: computed(() => storeGeneral.countries),
        },
      },
      {
        label: "State",
        value: "state_id",
        helper: "getState",
        input: {
          label: "State",
          placeholder: "Select state",
          next_dropdown_required: true,
          key: "state_id",
          type: "select",
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
        label: "Consent to text",
        value: "consent_to_text",
        input: {
          label: "Consent to text",
          placeholder: "Select consent to text",
          type: "select",
          options: enums.home_bound,
        },
      },
      {
        label: "Work phone",
        value: "work_phone_number",
        prepend_key: "work_country_code",
        country_code: "work_country_code",
        input: {
          label: "Work phone",
          placeholder: "",
          type: "phone",
        },
      },
      {
        label: "Patient email",
        value: "patient_email",
        input: {
          label: "Patient email",
          placeholder: "Enter email",
          type: "email",
          rules: [rules.email]
        },
      },
      {
        label: "Contact preference",
        value: "contact_preference",
        input: {
          label: "Contact preference",
          placeholder: "Select contact preference",
          type: "select",
          options: enums.contact_preference,
        },
      },
    ],
  },
]);
</script>
<style lang="scss" scoped></style>
