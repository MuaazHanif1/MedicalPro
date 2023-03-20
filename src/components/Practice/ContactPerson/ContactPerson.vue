<template>
  <div class="full-width" :class="[index == 1 ? 'q-mt-xl' : '']">
    <div class="mb-44">
      <div class="row justify-start items-center">
        <span class="heading">{{ object.heading }}</span>
        <div v-if="index >= 1" class="delete-button-span row justify-center items-center q-ml-md"
          @click="deleteCallToParent(index)">
          <q-icon name="delete" :size="xs" :color="'green-10'"></q-icon>
        </div>
      </div>
      <i class="sub-heading q-mt-md">{{ object.sub_heading }}</i>
    </div>
    <div class="row" :class="[
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-lg'
        : 'q-col-gutter-x-lg q-mt-md',
    ]">
      <div class="col-sm-6 col-12">
        <UserInput :label="'First name'" :dataModel="object.first_name" :placeHolder="'Enter user name'"
          :arrayindex="index" innerProperty="first_name" :mainproperty="mainproperty" @update="updateValue"
          :rules="[rules.required, rules.single_word]"></UserInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Last name'" :placeHolder="'Enter last name'" innerProperty="last_name"
          :dataModel="object.last_name" :arrayindex="index" :id="object.id" :mainproperty="mainproperty"
          @update="updateValue" :rules="[rules.required, rules.single_word]"></UserInput>
      </div>
    </div>
    <div class="row" :class="[
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-xs'
        : 'q-col-gutter-x-lg q-mt-sm',
    ]">
      <div class="col-sm-6 col-12">
        <label class="q-mb-sm phone-number-label d-block q-pt-none">Phone number</label>
        <PhoneInput v-model="phone_number" @selected-country="onCountryChange"></PhoneInput>
      </div>
      <div class="col-sm-6 col-12">
        <UserInput :label="'Email Address'" :dataModel="object.email_address" :placeHolder="'Enter email address'"
          innerProperty="email" :arrayindex="index" :id="object.id" :mainproperty="mainproperty" @update="updateValue"
          :rules="[rules.required, rules.email]"></UserInput>
      </div>
    </div>
    <div class="row" :class="[
      $q.screen.lt.sm
        ? 'q-col-gutter-y-xs q-mt-xs'
        : 'q-col-gutter-x-lg q-mt-sm',
    ]">
      <div class="col-sm-6 col-12">
        <UserInput :label="'Role'" :placeHolder="'Enter your role'" :dataBind="object.role" :arrayindex="index"
          :id="object.id" innerProperty="designation" :mainproperty="mainproperty" @update="updateValue"
          :rules="[rules.required]"></UserInput>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, onMounted, watch } from "vue";
import { usePracticeStore } from "@/store/practice";
import PhoneInput from "@/partials/PhoneInput.vue";
import { phone } from "@/composables/helper-functions";
import UserInput from "@/partials/UserInput.vue";
const props = defineProps({
  mainproperty: {
    type: String,
  },
  index: {
    default: 0,
    type: Number,
  },
  object: {
    type: Object,
  },
});
const updateValue = (data) => {
  store.updatingPracticeRegistrationFormValue(data);
};

// const label = computed(() => {
//   return isMoreThenOneField.value
//     ? "Address Information"
//     : "Contact Person Details";
// });
// const subLabel = computed(() => {
//   return isMoreThenOneField.value
//     ? ""
//     : "'Provide information about Contact Details'";
// });
// const checkIsMoreThenOneField = () => {
//   if (store.practiceRegistrationFormData[0].fields.length > 1) {
//     isMoreThenOneField.value = true;
//   }
// };
onMounted(() => {
  // checkIsMoreThenOneField();
});

const phone_number = ref("");
const phone_number_primary_country_code = ref("");
const store = usePracticeStore();
const deleteCallToParent = (data) => {
  store.deleteContactArrayField(data);
};
const onCountryChange = (country) => {
  phone_number_primary_country_code.value = country;
  store.practiceRegistrationFormData.contact_person[
    props.index
  ].country_code = `+${country.dialCode}`;
};

watch(phone_number, (newValue) => {
  store.practiceRegistrationFormData.contact_person[props.index].phone_number =
    phone(phone_number_primary_country_code.value, newValue).phone_number;
});
</script>
<style lang="scss" scoped>
:deep .vti__dropdown-list {
  max-width: 288px;
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


  /* Text 2 */

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

.delete-button-span {
  width: 30px;
  height: 30px;
  background: #ecefed;
  border-radius: 10px;
  cursor: pointer;

  .delete-button {
    background: #2a6049;
  }
}

:deep(.q-field) {
  padding-bottom: 0px !important;

  .q-field__bottom {
    display: none !important;
  }
}
</style>
