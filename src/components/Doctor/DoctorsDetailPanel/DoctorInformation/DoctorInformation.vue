<template>
  <div>
    <!--Doctor Detail Personal Information Start Here --->
    <q-form ref="form" class="full-width overflow-auto" :class="$q.screen.lt.md ? 'q-mx-auto' : ''">
      <div class="mt-27 px-20 column">
        <span class="doctor-detail-information-heading">
          About doctor
        </span>
        <span class="mt-13 dark-grey">
          {{ doctorInfo }}
        </span>
      </div>
      <q-separator class="mt-30" />
      <div class="mt-27 px-20">
        <span class="doctor-detail-information-heading">
          Personal information
        </span>
        <div class="row" :class="[
          $q.screen.lt.sm
            ? 'q-col-gutter-y-xs q-mt-lg'
            : 'q-col-gutter-x-lg q-mt-md',
        ]">
          <div class="col-sm-6 col-12 col-xl-3">
            <TextField fieldname="First Name" :fieldvalue="firstName"></TextField>
            <TextField fieldname="Last Name" :fieldvalue="lastName"></TextField>
            <TextField fieldname="Nationality" :fieldvalue="nationality"></TextField>
            <!-- <TextField fieldname="Emirate Id" :fieldvalue="emirateId"></TextField> -->
            <TextField fieldname="Registered ID" :fieldvalue="registeredId"></TextField>
            <TextField fieldname="Specialization" :fieldvalue="practiceStore.getdoctorSpecializations"></TextField>

          </div>
          <div class="col-sm-6 col-12 col-xl-3">
            <TextField fieldname="Middle Name" :fieldvalue="middleName"></TextField>
            <TextField fieldname="Gender" :fieldvalue="gender"></TextField>
            <TextField fieldname="Date of Birth" :fieldvalue="dob"></TextField>
            <TextField fieldname="Marital Status" :fieldvalue="maritalStatus"></TextField>
            <TextField fieldname="Registered Date:" :fieldvalue="createdAt"></TextField>
          </div>
        </div>
      </div>

      <q-separator class="mt-40" />


      <!--Doctor Detail Personal Information End Here --->

      <!--**********************************************--->
      <!--Doctor Detail Contact Information StartHere --->
      <div class="mt-29 px-20">
        <span class="doctor-detail-information-heading">
          Contact Information
        </span>
        <div class="row q-mt-md q-col-gutter-y-md">
          <div class="col-sm-6 col-md-3 col-12 col-xl-3">
            <IconField icon="smartphone" heading="Primary Phone" :value="primaryPhoneNumber">
            </IconField>
            <q-tooltip v-if="!isMobile">
              Primary Phone Number: {{ primaryPhoneNumber }}
            </q-tooltip>
          </div>
          <div class=" col-sm-6 col-md-3 col-12 col-xl-3">
            <IconField icon="smartphone" heading="Secondary Phone" :value="secondaryPhoneNumber">
            </IconField>
            <q-tooltip v-if="!isMobile">
              Secondary Phone Number: {{ secondaryPhoneNumber }}
            </q-tooltip>
          </div>
          <div class="col-sm-6 col-md-3 col-12 col-xl-3">
            <IconField icon="mail" heading="Primary Email" :value="primaryEmail">
            </IconField>
            <q-tooltip v-if="!isMobile">
              {{ primaryEmail }}
            </q-tooltip>
          </div>
          <div class="col-sm-6 col-md-3 col-12 col-xl-3">
            <IconField icon="mail" heading="Secondary Email" :ref="secondaryEmail" :value="secondaryEmail">
            </IconField>
            <q-tooltip v-if="!isMobile">
              {{ secondaryEmail }}
            </q-tooltip>
          </div>
        </div>
      </div>
      <q-separator class="mt-40" />

      <!-- {{ isOverflown(practiceStore.currentDoctor.data.secondary_email) }} -->
      <!--********************************************--->
      <!--Doctor Detail Contact Information EndHere --->

      <!--Doctor Detail Current Address Start Here --->

      <div class="mt-29 px-20">
        <span class="doctor-detail-information-heading"> Current address </span>
        <div class="row" :class="[
          $q.screen.lt.sm
            ? 'q-col-gutter-y-xs q-mt-lg'
            : 'q-col-gutter-x-lg q-mt-md',
        ]">
          <div class="col-sm-6 col-12 col-xl-3">
            <TextField fieldname="Address Line" :fieldvalue="addressLine"></TextField>
            <TextField fieldname="State" :fieldvalue="state"></TextField>
            <TextField fieldname="Zip Code" :fieldvalue="currentZipCode"></TextField>
          </div>
          <div class="col-sm-6 col-12 col-xl-3">
            <TextField fieldname="Country" :fieldvalue="country"></TextField>
            <TextField fieldname="City" fieldvalue="Doloresburyz"></TextField>
          </div>
        </div>
      </div>
      <q-separator class="mt-40" />

      <!--Doctor Detail Current Address End Here --->

      <!--********************************************--->

      <!--Doctor Detail Hometown Address Start Here --->

      <div class="mt-29 px-20">
        <span class="doctor-detail-information-heading">
          Hometown address
        </span>
        <div class="row" :class="[
          $q.screen.lt.sm
            ? 'q-col-gutter-y-xs q-mt-lg'
            : 'q-col-gutter-x-lg q-mt-md',
        ]">
          <div class="col-sm-6 col-12 col-xl-3">
            <TextField fieldname="Address Line" :fieldvalue="homeTownAddress"></TextField>
            <TextField fieldname="State" :fieldvalue="homeTownState"></TextField>
            <TextField fieldname="Zip Code" :fieldvalue="homeTownZipCode"></TextField>
          </div>
          <div class="col-sm-6 col-12 col-xl-3">
            <TextField fieldname="Country" :fieldvalue="homeTownCountry"></TextField>
            <TextField fieldname="City" :fieldvalue="homeTownCity"></TextField>
          </div>
        </div>
      </div>

      <!--Doctor Detail Hometown Address End Here --->
      <!--********************************************--->
    </q-form>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed } from "vue";
import TextField from "../NameAndValue.vue";
import IconField from "./iconAndValue.vue";
import { usePracticeStore } from "@/store/practice.js";
const $q = useQuasar();
const practiceStore = usePracticeStore();
const firstName = computed(() =>
  practiceStore.currentDoctor.data.first_name
    ? practiceStore.currentDoctor.data.first_name
    : "_"
);
const lastName = computed(() =>
  practiceStore.currentDoctor.data.last_name
    ? practiceStore.currentDoctor.data.last_name
    : "_"
);
const nationality = computed(() =>
  practiceStore.currentDoctor.data.nationality
    ? practiceStore.currentDoctor.data.nationality
    : "_"
);
// const emirateId = computed(() => {
//   return practiceStore.currentDoctor.data.legal_information &&
//     practiceStore.currentDoctor.data.legal_information.emirate_id
//     ? practiceStore.currentDoctor.data.legal_information.emirate_id
//     : "_";
// });
const registeredId = computed(() =>
  practiceStore.currentDoctor.data.id ? practiceStore.currentDoctor.data.id : ""
);
const middleName = computed(() => {
  return practiceStore.currentDoctor.data.middle_name
    ? practiceStore.currentDoctor.data.middle_name
    : "_";
});
const gender = computed(() =>
  practiceStore.currentDoctor.data.gender
    ? practiceStore.currentDoctor.data.gender
    : "_"
);

const dob = computed(() =>
  practiceStore.currentDoctor.data.dob
    ? practiceStore.currentDoctor.data.dob
    : "_"
); //practiceStore.currentDoctor.data.marital_status

const maritalStatus = computed(() => {
  return practiceStore.currentDoctor.data.marital_status
    ? practiceStore.currentDoctor.data.marital_status
    : "_";
});
const createdAt = computed(() => {
  return practiceStore.currentDoctor.data.created_at
    ? practiceStore.currentDoctor.data.created_at
    : "_";
});

// current address //
const addressLine = computed(() => {
  return practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.current_address_1
    : "_";
});
const state = computed(() => {
  return practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.current_state_id.name
    : "_";
});
const country = computed(() => {
  return practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.current_country_id.name
    : "_";
});
const currentZipCode = computed(() => {
  return practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.current_zip_code
    : "_";
});
//hometown
const homeTownZipCode = computed(() =>
  practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.home_town_zip_code
    : "_"
);
const homeTownCountry = computed(() =>
  practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.home_town_country_id.name
    : "_"
);
const homeTownState = computed(() =>
  practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.home_town_state_id.name
    : "_"
);
const homeTownCity = computed(() =>
  practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.home_town_city_id.name
    : "_"
);
const homeTownAddress = computed(() =>
  practiceStore.currentDoctor.data.address
    ? practiceStore.currentDoctor.data.address.home_town_address_1
    : "_"
);

// contact information
const primaryPhoneNumber = computed(() =>
  practiceStore.currentDoctor.data.primary_phone_number
    ? practiceStore.currentDoctor.data.primary_phone_number
    : "_"
);
const secondaryPhoneNumber = computed(() =>
  practiceStore.currentDoctor.data.secondary_phone_number
    ? practiceStore.currentDoctor.data.secondary_phone_number
    : "_"
);
const primaryEmail = computed(() =>
  practiceStore.currentDoctor.data.primary_email
    ? practiceStore.currentDoctor.data.primary_email
    : "_"
);
const secondaryEmail = computed(() =>
  practiceStore.currentDoctor.data.secondary_email
    ? practiceStore.currentDoctor.data.secondary_email
    : "_"
);

const doctorInfo = computed(() =>
  practiceStore.currentDoctor.data.about_me
    ? practiceStore.currentDoctor.data.about_me
    : "_"
);

const isMobile = computed(() => {
  return $q.screen.lt.sm
    ? true
    : false
})

</script>

<style>
</style>
