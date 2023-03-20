<template>
  <q-form ref="form" style="width: 600px" class="selector" :class="$q.screen.lt.md ? 'q-mx-auto' : ''">
    <div>
      <h1 class="detail-page-heading">Review and Submit</h1>
      <h4 class="lato-sub-heading mt-10">Form submitted status</h4>
    </div>
    <div class="" v-for="(section, index) in sections" :key="index">
      <h1 class="doctor-submit-review-heading mb-17 mt-30">
        {{ section.heading }}
      </h1>

      <div class="row ml-10 file items-center " v-for="(detail, index) in section.details" :key="index">
        <div class="row col-12 col-md-8 col-xl-6 items-center">
          <div class="col-sm-2 col-xs-2 col-md-2 col-lg-2 col-xl-2" v-if="section.file">
            <q-icon :name="`img:${require('@/assets/files/' +
            data[detail.object][detail.index][detail.label] +
            '.png')}`" size="40px" class="material-symbols-outlined"></q-icon>
          </div>
          <label for="" class="col-12 col-md-6 property-name" v-else>
            {{ detail.label }}</label>
          <div class="col-12 col-md-6" v-if="detail.isPhone">
            <span class="lato-sub-heading">{{
            `${data[detail.object][section.arrayIndex][detail.prepend_key]}-${data[detail.object][section.arrayIndex][detail.value]
            }`
            }}</span>
          </div>
          <div class="col-12 col-md-6" v-else-if="section.isArray">
            <div class="col-md-6">
              <div class="row">
                <p class="col-md-6 lato-sub-heading q-ma-none">
                  {{ data[detail.object][section.arrayIndex][detail.value] }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6" v-if="detail.is_id">
            <div class="col-md-6">
              <div class="row">
                <p class="col-md-6 lato-sub-heading q-ma-none">
                  {{ getNameValue(data[detail.object][detail.value], detail.helper,
                  detail.address, detail.location)
                  }}
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6" v-else-if="section.file">
            <div class="row items-center justify-center no-wrap">
              <div class="col-9 lato-sub-heading content-min-height ellipsis">
                {{ data[detail.object][detail.index][detail.name] }}
              </div>
              <div class="col-3">
                <a class="ml-5 link" target="_blank" :href="data[detail.object][detail.index][detail.url]">view</a>
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
import { ref, defineProps, onMounted } from "vue";
import { usePracticeStore } from "@/store/practice";
//import getName from "@/composables/helper";

defineProps({
  data: {
    type: Array,
    default: () => [],
  },
});
onMounted(() => {
  store.practiceRegistrationFormData.contact_person.forEach((cur, index) => {
    sections.value.splice(index, 0, {
      heading: index == 0 ? "Contact information " : "Other detail",
      isArray: true,
      arrayIndex: index,
      details: [
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
          label: "Phone Number",
          value: "phone_number",
          object: "contact_person",
          isPhone: true,
          prepend_key: "country_code",
        },
        {
          label: "Designation",
          value: "designation",
          object: "contact_person",
        },
        {
          label: "Email",
          value: "email",
          object: "contact_person",
        },
      ],
    })
  })
  if (store.practiceRegistrationFormData.file_attached.length > 0) {
    store.practiceRegistrationFormData.file_attached.forEach((cur, ind) => {
      sections.value[sections.value.length - 1].details.push({
        label: "type",
        name: "name",
        url: "url",
        object: "file_attached",
        index: ind
      })
    })
  }

})
const store = usePracticeStore();
const sections = ref([
  {
    heading: "Address information",
    details: [
      {
        label: "Address",
        value: "address_line_1",
        object: "address",
      },
      {
        label: "Address 2",
        value: "address_line_2",
        object: "address",
      },
      {
        label: "Country",
        value: "country_id",
        object: "address",
        helper: "getCountry",
        is_id: true,
      },
      {
        label: "State",
        value: "state_id",
        object: "address",
        helper: "getState",
        address: "address",
        location: "address_state",
        is_id: true,
      },
      {
        label: "City",
        value: "city_id",
        object: "address",
        helper: "getCity",
        address: "address",
        location: "address_city",
        is_id: true,
      },
      {
        label: "Zip code",
        value: "zip_code_id",
        object: "address",
      },
      {
        label: "Location",
        value: "location",
        object: "address",
      },
    ],
  },
  {
    heading: "Billing information",
    details: [
      {
        label: "Address",
        value: "billing_address_line_1",
        object: "billing",
      },
      {
        label: "Address 2",
        value: "billing_address_line_2",
        object: "billing",
      },
      {
        label: "Country",
        value: "billing_country_id",
        object: "billing",
        helper: "getCountry",
        is_id: true,
      },
      {
        label: "State",
        value: "billing_state_id",
        object: "billing",
        helper: "getState",
        address: "billing",
        location: "billing_state",
        is_id: true,
      },
      {
        label: "City",
        value: "billing_city_id",
        object: "billing",
        helper: "getCity",
        address: "billing",
        location: "billing_city",
        is_id: true,
      },
      {
        label: "Zip code",
        value: "billing_zip_code",
        object: "billing",
      },
      {
        label: "Location",
        value: "billing_location",
        object: "billing",
      },
    ],
  },
  {
    heading: "Legal Information",
    details: [
      {
        label: "Practice legal name",
        value: "practice_name",
        object: "legal_information",
      },
      {
        label: "Tax Id",
        value: "tax_id",
        object: "legal_information",
      },
      {
        label: "Practice npi",
        value: "practice_npi",
        object: "legal_information",
      },
      {
        label: "Facility id",
        value: "facility_id",
        object: "legal_information",
      },
      {
        label: "Practice taxonomy",
        value: "practice_taxonomy",
        object: "legal_information",
      },
      {
        label: "CLIA number",
        value: "clia_number",
        object: "legal_information",
      },
      {
        label: "Oid",
        value: "oid",
        object: "legal_information",
      },
    ],
  },
  {
    heading: "Attached documents",
    file: true,
    details: [],
  },
]);
const getNameValue = (id, helpername, address, location) => {
  if (helpername == "getCountry") {
    return store.practice_country_state_country_information.country.find(
      (x) => x.id === id
    )?.name;
  } else if (helpername == "getState") {
    return store.practice_country_state_country_information[address][
      location
    ].find((x) => x.id === id)?.name;
  } else if (helpername == "getCity") {
    return store.practice_country_state_country_information[address][
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
