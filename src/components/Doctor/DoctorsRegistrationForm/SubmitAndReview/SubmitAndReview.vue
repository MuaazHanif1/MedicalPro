<template>
  <q-form ref="form" style="width: 600px" class="selector" :class="$q.screen.lt.md ? 'q-mx-auto' : ''" :greedy="true">
    <div class="mb-20">
      <h1 class="detail-page-heading">Review and Submit</h1>
      <h4 class="lato-sub-heading mt-10">Form submitted status</h4>
    </div>
    <div class="" v-for="(section, index) in sections" :key="index">
      <h1 class="doctor-submit-review-heading mb-17 mt-30">
        {{ section.heading }}
      </h1>

      <div class="row ml-10 file items-center" v-for="(detail, index) in section.details" :key="index">
        <div class="row col-12 col-md-8 col-xl-6 items-center">
          <div class="col-sm-2 col-xs-2 col-md-2 col-lg-2 col-xl-2" v-if="section.file">
            <q-icon :name="`img:${require('@/assets/files/' +
            data[detail.object][detail.inner_object][detail.label] +
            '.png')}`" size="40px" class="material-symbols-outlined"></q-icon>
          </div>
          <label for="" class="col-12 col-md-6 property-name" v-else>
            {{ detail.label }}:</label>
          <div class="col-12 col-md-6" v-if="detail.repeated_field">
            <div class="row">
              <p v-for="(repeat, index) in data[detail.object][detail.value]" :key="index"
                class="lato-sub-heading q-ma-none last-content">
                {{
                detail.helper
                ? getName(
                data[detail.object][detail.value][index],
                detail.helper
                )
                : data[detail.object][detail.value][index]
                }}
              </p>
            </div>
          </div>
          <div class="col-12 col-md-6" v-else-if="detail.isPhone">
            <span class="lato-sub-heading">{{
            `${data[detail.object][detail.prepend_key]}-${
            data[detail.object][detail.value]
            }`
            }}</span>
          </div>
          <div class="col-12 col-md-6" v-else-if="section.isArray">
            <div class="col-md-6">
              <div class="row">
                <p class="col-md-6 lato-sub-heading q-ma-none">
                  {{
                  detail.is_id
                  ? getNameValue(
                  data[detail.object][section.arrayIndex][detail.value],
                  detail.helper,
                  detail.address,
                  detail.location
                  )
                  : data[detail.object][section.arrayIndex][detail.value]
                  }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6" v-else-if="section.file">
            <div class="row items-center justify-center no-wrap">
              <div class="col-9 lato-sub-heading content-min-height ellipsis">
                {{ data[detail.object][detail.inner_object][detail.name] }}
              </div>
              <div class="col-3">
                <a class="ml-5 link" target="_blank"
                  :href="data[detail.object][detail.inner_object][detail.url]">view</a>
              </div>
            </div>
          </div>

          <p class="col-6 col-md-6 lato-sub-heading q-ma-none" v-else>
            {{ data[detail.object][detail.value] }}
          </p>
        </div>
      </div>
      <div class="border-line" v-if="index < 4"></div>
    </div>
  </q-form>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
import getName from "@/composables/helper";

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
const store = useDoctorsRegistrationStore();
const sections = ref([
  {
    heading: "Contact Information",
    details: [
      {
        label: "suffix",
        value: "suffix",
        object: "contact_person",
      },
      {
        label: "First name",
        value: "first_name",
        object: "contact_person",
      },
      {
        label: "Middle name",
        value: "middle_name",
        object: "contact_person",
      },
      {
        label: "Last name",
        value: "last_name",
        object: "contact_person",
      },
      {
        label: "Gender",
        value: "gender",
        object: "contact_person",
      },
      {
        label: "Primary phone number",
        value: "primary_phone_number",
        isPhone: true,
        object: "contact_person",
        prepend_key: "country_code_primary_phone_number",
      },
      {
        label: "Secondary phone number",
        value: "secondary_phone_number",
        isPhone: true,
        object: "contact_person",
        prepend_key: "country_code_secondary_phone_number",
      },
      {
        label: "Primary email",
        value: "primary_email",
        object: "contact_person",
      },
      {
        label: "Secondary email",
        value: "secondary_email",
        object: "contact_person",
      },
      {
        label: "Date of birthday",
        value: "dob",
        object: "contact_person",
      },
      {
        label: "Specialization",
        value: "specialization_id",
        object: "contact_person",
        repeated_field: true,
        helper: "getSpecialization",
      },
      {
        label: "Marital status",
        value: "marital_status",
        object: "contact_person",
      },
    ],
  },
  {
    heading: "Current address",
    arrayIndex: 0,
    isArray: true,
    details: [
      {
        label: "Address",
        value: "current_address_1",
        object: "address",
      },
      {
        label: "Address 2",
        value: "current_address_2",
        object: "address",
      },
      {
        label: "Country",
        value: "current_country_id",
        object: "address",
        helper: "getCountry",
        is_id: true,
      },
      {
        label: "State",
        value: "current_state_id",
        object: "address",
        helper: "getState",
        address: "current",
        location: "current_state",
        is_id: true,
      },
      {
        label: "City",
        value: "current_city_id",
        object: "address",
        helper: "getCity",
        address: "current",
        location: "current_city",
        is_id: true,
      },
      {
        label: "Zip code",
        value: "current_zip_code",
        object: "address",
      },
    ],
  },
  {
    heading: "Home town address",
    arrayIndex: 1,
    isArray: true,
    details: [
      {
        label: "Address",
        value: "home_town_address_1",
        object: "address",
      },
      {
        label: "Address 2",
        value: "home_town_address_2",
        object: "address",
      },
      {
        label: "Country",
        value: "home_town_country_id",
        object: "address",
        helper: "getCountry",
        is_id: true,
      },
      {
        label: "State",
        value: "home_town_state_id",
        object: "address",
        helper: "getState",
        address: "hometown",
        location: "hometown_state",
        is_id: true,
      },
      {
        label: "City",
        value: "home_town_city_id",
        object: "address",
        address: "hometown",
        location: "hometown_city",
        helper: "getCity",
        is_id: true,
      },
      {
        label: "Zip code",
        value: "home_town_zip_code",
        object: "address",
      },
    ],
  },
  {
    heading: "Legal Information",
    details: [
      {
        label: "License number",
        value: "license_number",
        object: "legal_information",
      },
      {
        label: "Emirate id",
        value: "emirate_id",
        object: "legal_information",
      },
      {
        label: "Passport number",
        value: "passport_number",
        object: "legal_information",
      },
    ],
  },
  {
    heading: "Attached documents",
    file: true,
    details: [
      {
        label: "type",
        name: "name",
        url: "url",
        inner_object: "file1",
        object: "file_attached",
      },
      {
        label: "type",
        name: "name",
        url: "url",
        inner_object: "file2",
        object: "file_attached",
      },
      {
        label: "type",
        name: "name",
        url: "url",
        inner_object: "file3",
        object: "file_attached",
      },
    ],
  },
]);
const getNameValue = (id, helpername, address, location) => {
  if (helpername == "getCountry") {
    return store.doctor_country_state_country_information.country.find(
      (x) => x.id === id
    )?.name;
  } else if (helpername == "getState") {
    return store.doctor_country_state_country_information[address][
      location
    ].find((x) => x.id === id)?.name;
  } else if (helpername == "getCity") {
    return store.doctor_country_state_country_information[address][
      location
    ].find((x) => x.id === id)?.name;
  }
};
</script>
<style lang="scss" scoped>
.block:not(:first-child) {
  margin-top: 30px;
}

.file:not(:first-child) {
  margin-top: 10px;
}

.link {
  cursor: pointer;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  color: $secondary;
}

.p {
  margin: 0 !important;
}

.content-min-height {
  min-height: 14px;
}

.border-line:not(:first-child) {
  max-width: 606px;
  height: 1px;
  background: $strokes;
  margin-top: 30px;
  margin-bottom: 30px;
}

.last-content:not(:last-child):after {
  content: ",";
  margin-left: 2px;
  margin-right: 2px;
}
</style>
