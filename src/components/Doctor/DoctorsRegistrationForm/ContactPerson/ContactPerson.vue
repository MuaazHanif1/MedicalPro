<template>
  <q-form ref="form" class="full-width" style="max-width: 600px" :class="$q.screen.lt.md ? 'q-mx-auto' : ''"
    :greedy="true">
    <div class="full-width">
      <div class="mb-44">
        <div class="row justify-start items-center">
          <span class="heading">{{ object.heading }}</span>
        </div>
        <i class="sub-heading q-mt-md">{{ object.sub_heading }}</i>
      </div>

      <div class="row mt-10" :class="[
        $q.screen.lt.sm
          ? 'q-col-gutter-y-xs q-mt-lg'
          : 'q-col-gutter-x-lg q-mt-md',
      ]">
        <div class="col-sm-6 col-12">
          <UserInput :label="'Suffix'" :placeHolder="'Enter suffix'" :dataModel="object.suffix" :arrayindex="index"
            :inputType="'single-selector'" :innerProperty="'suffix'" :option="suffix_list" :mainproperty="mainproperty"
            :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'First name'" :dataModel="object.first_name" :placeHolder="'Enter first name'"
            :arrayindex="index" :mainproperty="mainproperty" innerProperty="first_name" :rules="[rules.required]"
            @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row mt-10" :class="[$q.screen.lt.sm ? 'q-col-gutter-y-xs' : 'q-col-gutter-x-lg']">
        <div class="col-sm-6 col-12">
          <UserInput :label="'Middle name'" :placeHolder="'Enter middle name'" :dataModel="object.middle_name"
            :id="object.id" innerProperty="middle_name" :mainproperty="mainproperty" @update="updateProperty">
          </UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'Last name'" :dataModel="object.last_name" :placeHolder="'Enter last name'"
            :arrayindex="index" :mainproperty="mainproperty" innerProperty="last_name" :rules="[rules.required]"
            @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row mt-10" :class="[$q.screen.lt.sm ? 'q-col-gutter-y-xs' : 'q-col-gutter-x-lg']">
        <div class="col-sm-6 col-12">
          <label class="q-mb-sm phone-number-label d-block q-pt-none">
            Primary phone number</label>
          <PhoneInput v-model="phone_number" @selected-country="onCountryChange"></PhoneInput>
        </div>
        <div class="col-sm-6 col-12">
          <label class="q-mb-sm phone-number-label d-block q-pt-none">Secondary phone number</label>
          <PhoneInput v-model="phone_number_secondary" @selected-country="onCountryChangeSecodnary"></PhoneInput>
        </div>
      </div>
      <div class="row mt-10" :class="[$q.screen.lt.sm ? 'q-col-gutter-y-xs' : 'q-col-gutter-x-lg']">
        <div class="col-sm-6 col-12">
          <UserInput :label="'Primary mail'" :dataModel="object.primary_email" :placeHolder="'Enter primary email'"
            :arrayindex="index" :isDisable="true" innerProperty="primary_email" :mainproperty="mainproperty"
            :rules="[rules.required, rules.email, rules.email_same_for_primary]" @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'Secondary email'" :placeHolder="'Enter secondary email'"
            :dataModel="object.secondary_email" :arrayindex="index" :id="object.id" :mainproperty="mainproperty"
            innerProperty="secondary_email" :rules="[
              rules.required,
              rules.email,
              rules.email_same_for_secondary,
            ]" @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row mt-10" :class="[$q.screen.lt.sm ? 'q-col-gutter-y-xs' : 'q-col-gutter-x-lg']">
        <div class="col-sm-6 col-12">
          <UserInput :label="'Date of birth'" :dataModel="getDateFormat" :placeHolder="'Enter date of birth'"
            :arrayindex="index" :innerProperty="'dob'" :inputType="'date'" dateLimited="lower then current date"
            :mainproperty="mainproperty" :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
        <div class="col-sm-6 col-12">
          <UserInput :label="'Gender'" :placeHolder="'Enter gender'" :dataModel="object.gender" :id="object.id"
            :option="gender_option" :mainproperty="mainproperty" innerProperty="gender" :inputType="'single-selector'"
            :rules="[rules.required]" @update="updateProperty"></UserInput>
        </div>
      </div>
      <div class="row mt-10" :class="[$q.screen.lt.sm ? 'q-col-gutter-y-xs' : 'q-col-gutter-x-lg']">
        <div class="col-sm-6 col-12">
          <UserInput :label="'Marital status'" :placeHolder="'Enter marital status'" :dataModel="object.marital_status"
            :arrayindex="index" :id="object.id" :inputType="'single-selector'" :innerProperty="'marital_status'"
            :option="marital_status" :mainproperty="mainproperty" :rules="[rules.required]" @update="updateProperty">
          </UserInput>
        </div>
        <div class="col-sm-6 col-12"></div>
      </div>
      <div class="row mt-10" :class="[$q.screen.lt.sm ? 'q-col-gutter-y-xs' : 'q-col-gutter-x-lg']">
        <div class="col-sm-12 col-12 field-border">
          <UserInput :label="'Specialization'" :placeHolder="'Enter your specialization'"
            :dataModel="getSpecilizationDoctor" :arrayindex="index" :id="object.id"
            :option="store.specialization_option" :inputType="'multi-selector'" :innerProperty="'specialization_id'"
            :mainproperty="mainproperty" @update="updateProperty" :rules="[rules.required]"></UserInput>
        </div>
      </div>
    </div>
  </q-form>
</template>

<script setup>
import { defineProps, ref, defineExpose, watch, computed } from "vue";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
import { date } from "quasar";
import moment from "moment";
import { phone } from "@/composables/helper-functions";
import PhoneInput from "@/partials/PhoneInput.vue";
import UserInput from "@/partials/UserInput.vue";
const props = defineProps({
  mainproperty: {
    type: String,
  },
  index: {
    default: -1,
    type: Number,
  },
  object: {
    type: Object,
  },
});
const store = useDoctorsRegistrationStore();
const updateProperty = (value) => {
  store.updatingDoctorsRegistrationFormValue(value);
};
const phone_number_secondary = ref(
  store.doctorRegistrationFormData.contact_person.secondary_phone_number ? store.doctorRegistrationFormData.contact_person.country_code_secondary_phone_number + store.doctorRegistrationFormData.contact_person.secondary_phone_number : ''
);
const phone_number = ref(
  store.doctorRegistrationFormData.contact_person.primary_phone_number ? store.doctorRegistrationFormData.contact_person.country_code_primary_phone_number + store.doctorRegistrationFormData.contact_person.primary_phone_number : ''
);

const phone_number_primary_country_code = ref({});
const phone_number_secondary_country_code = ref({});
const gender_option = [
  "Male",
  "Female",
  "Transgender",
  "Prefer not to say",
  "Other",
];
const onCountryChange = (country) => {
  phone_number_primary_country_code.value = country;
  store.doctorRegistrationFormData.contact_person.country_code_primary_phone_number = `+${country.dialCode}`;
};

const onCountryChangeSecodnary = (country) => {
  phone_number_secondary_country_code.value = country;
  store.doctorRegistrationFormData.contact_person.country_code_secondary_phone_number = `+${country.dialCode}`;
};
const getSpecilizationDoctor = computed(() => {
  const data = [];
  if (props.object.specialization_id.length > 0)
    props.object.specialization_id.forEach((cur) => {
      data.push(
        store.specialization_option.filter((element) => element.id == cur)[0]
      );
    });
  return data;
});
const getDateFormat = computed(() => {
  console.log(moment(new Date(props.object.dob)).format("Do MMMM YYYY"));
  return date.formatDate(new Date(props.object.dob), "DD MMMM YYYY");
});
const suffix_list = ["Miss", "Mrs", "Ms", "Mr"];
const marital_status = [
  "Unknown",
  "Married",
  "Single",
  "Divorced",
  "Separated",
  "Widowed",
  "Partner",
];
const form = ref(null);
defineExpose({
  form,
});
watch(phone_number, (valueN) => {
  store.doctorRegistrationFormData.contact_person.primary_phone_number = phone(
    phone_number_primary_country_code.value,
    valueN
  ).phone_number;
});
watch(phone_number_secondary, (valueN) => {
  store.doctorRegistrationFormData.contact_person.secondary_phone_number =
    phone(phone_number_secondary_country_code.value, valueN).phone_number;
});
</script>
<style lang="scss" scoped>
.vti__dropdown-list {
  max-width: 246px;
}

.phone-number-label {
  color: #484848;
  font-weight: 400;
  font-family: "lato";
}
</style>
<style scoped lang="scss">
.heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;
  /* identical to box height */

  /* Text */

  color: #0d0c22;
}

.sub-heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 12px;
  /* identical to box height, or 92% */
  display: block;
  color: #7d8693;
}

.drop-down {
  width: 562px;
  height: 57px;
  border: 1px dashed #d2d5e0;
  border-radius: 12px;
}

.drop-down-button {
  width: 34px;
  height: 34px;
  left: 168px;
  top: 11.5px;
  background: #ecefed;
  border-radius: 12px;
  cursor: pointer;

  .drop-down-button-text {
    font-family: "lato";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 140%;
    color: #0d0c22;
  }
}

:deep .vti__input {
  background: none !important;
}

:deep(.q-field) {
  padding-bottom: 0px !important;

  .q-field__bottom {
    display: none !important;
  }
}
</style>
