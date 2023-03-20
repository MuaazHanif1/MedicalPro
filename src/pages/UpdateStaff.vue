<template lang="">
  <div class="row justify-center py-10" v-if="loading">
    <q-spinner-dots color="primary" size="3em" :thickness="2" />
  </div>
  <q-form ref="createForm" class="pa-30" :greedy="true" v-else>
    <p class="text-h5">Update Employee</p>

    <div class="mb-30" v-for="(create, index) in createInputs" :key="index">
      <p class="text-body1 mb-10 text-weight-bold">{{ create.heading }}</p>

      <div class="row q-col-gutter-sm">
        <!-- Repeating over input fields -->
        <div
          class="col-12 mb-3 mr-10"
          :class="[add_field.col ? `col-md-${add_field.col}` : 'col-md-3']"
          v-for="(add_field, add_index) in create.fields"
          :key="add_index"
        >
          <label
            class="q-mb-sm phone-number-label d-block q-pt-none text-caption text-grey-9"
            v-if="add_field.type === 'phone'"
            >{{ add_field.label }}</label
          >
          <CountryPhone
            v-if="add_field.type === 'phone'"
            v-model="createModel[add_field.value]"
            :is_disabled="add_field.disabled"
              :defaultCountry="createModel[add_field.country_code]"
            @selected-country="
              (code) =>
                (createModel[add_field.country_code] = `+${code.dialCode}`)
            "
            :vRules="add_field.rules"
          ></CountryPhone>
          <FormInput
            v-else-if="add_field.next_dropdown_required"
            v-model="createModel[add_field.value]"
            :label="add_field.label"
            :inputType="add_field.type"
            :isInput="add_field.type === 'select' ? false : true"
            :option="add_field.type === 'select' ? add_field.options : []"
            :optionvalue="
              add_field.type === 'select' ? add_field.optionvalue : 'id'
            "
            :optionlabel="
              add_field.type === 'select' ? add_field.optionlabel : 'name'
            "
            :rules="add_field.rules"
            @dropdown-value-change="
              dropdownHelper($event, add_field.key), resetField(add_field.value)
            "
            :placeHolder="add_field.placeholder"
            :max="add_field.max ? add_field.max : null"
          ></FormInput>
          <FormInput
            v-else
            v-model="createModel[add_field.value]"
            :placeHolder="add_field.placeholder"
            :label="add_field.label"
            :inputType="add_field.type"
            :isInput="add_field.type === 'select' ? false : true"
            :option="add_field.type === 'select' ? add_field.options : []"
            :optionvalue="
              add_field.type === 'select' ? add_field.optionvalue : 'id'
            "
            :optionlabel="
              add_field.type === 'select' ? add_field.optionlabel : 'name'
            "
            @dropdown-value-change="
              dropdownHelper($event, add_field.key), resetField(add_field.value)
            "
            :rules="add_field.rules"
            :max="add_field.max"
          ></FormInput>
        </div>

        <!-- Repeating over input fields -->
      </div>
    </div>

    <div class="row justify-start mt-20">
      <q-btn
        unelevated
        color="primary"
        label="Add Staff"
        padding="8px 41px"
        no-caps
        :loading="adding"
        @click="validateAndCreate"
      />
    </div>
  </q-form>
</template>
<script setup>
import { ref, computed } from "vue";
import rules from "@/composables/validation-rules";
import { useGeneralStore } from "@/store/general";
import { usePracticeStore } from "@/store/practice";
import enums from "@/composables/enums";
import FormInput from "@/partials/FormInput.vue";
import CountryPhone from "@/partials/CountryPhone.vue";
import { useRoute, useRouter } from "vue-router";
import dropdownHelper from "@/composables/dropdown-helper";
import { date } from "quasar";

const generalStore = useGeneralStore();
const practiceStore = usePracticeStore();
const roles = computed(() => practiceStore.practice.roles);
const departments = computed(() => practiceStore.practice.departments);
const route = useRoute();
const router = useRouter();
const createForm = ref(null);
const createModel = ref({});
const adding = ref(false);
const loading = ref(true);
practiceStore.getAllRole();
const types = ref([]);
const home_town_states = ref([]);
const home_town_cities = ref([]);
const current_states = ref([]);
const current_cities = ref([]);
let newDate = date.formatDate(Date.now(),"YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate,"YYYY/MM/DD");

practiceStore.getSingleStaff(route.params.id).then(() => {
  createModel.value = { ...practiceStore.currentStaff };
  Promise.allSettled([
    generalStore.getStateRequest(createModel.value.home_town_country_id),
    generalStore.getCityRequest(createModel.value.home_town_state_id),
    generalStore.getStateRequest(createModel.value.current_country_id),
    generalStore.getCityRequest(createModel.value.current_state_id),
    practiceStore.getAllDepartments()
  ]).then((res) => {
    home_town_states.value = res[0].value;
    home_town_cities.value = res[1].value;
    current_states.value = res[2].value;
    current_cities.value = res[3].value;
    types.value = departments.value.find(
        (d) => d.id == createModel.value.department_id
      ).employee_type.filter((e) => e.status == true);
    loading.value = false;
  });
});

/**
 * structure for creating record
 */
const createInputs = ref([
  {
    heading: "Contact Info:",
    fields: [
      {
        label: "First name",
        placeholder: "Enter first name",
        value: "first_name",
        rules: [rules.required, (val) => (val.length <= 29) || false],
      },
      {
        label: "Middle name",
        placeholder: "Enter middle name",
        value: "middle_name",
        rules: [(val) => (!val || val.length <= 29) || false]
      },
      {
        label: "Last name",
        placeholder: "Enter last name",
        value: "last_name",
        rules: [rules.required, (val) => (!val || val.length <= 29) || false],
      },
      {
        label: "Email",
        placeholder: "Enter email",
        value: "email",
        type: "email",
        rules: [rules.required, rules.email],
      },
      {
        label: "Secondary email",
        placeholder: "Enter secondary email",
        value: "secondary_email",
        type: "email",
        rules: [rules.email],
      },
      {
        label: "Date of birth",
        placeholder: "Enter DOB",
        value: "dob",
        type: "date",
        max: current_date,
      },
      {
        label: "Phone number",
        placeholder: "Enter phone number",
        value: "phone_number",
        country_code: "country_code_phone_number",
        type: "phone",
        rules: [rules.required],
      },
      {
        label: "Secondary phone number",
        placeholder: "Enter secondary phone number",
        country_code: "country_code_secondary_phone_number",
        value: "secondary_phone_number",
        type: "phone",
      },
      {
        label: "Gender",
        placeholder: "Select gender",
        value: "gender",
        type: "select",
        rules: [rules.required],
        options: enums.gender2,
      },
    ],
  },
  {
    heading: "Hometown Address:",
    fields: [
      {
        label: "Address 1",
        placeholder: "Enter address 1",
        value: "home_address_1",
        type: "text",
        rules: [rules.required, (val) => (!val || val.length <= 200) || false],
      },
      {
        label: "Address 2",
        placeholder: "Enter home address 2",
        value: "home_address_2",
        type: "text",
        rules: [rules.required, (val) => (!val || val.length <= 200) || false],
      },
      {
        label: "Zip code",
        placeholder: "Enter home zip code",
        value: "home_zip_code",
        type: "text",
        rules: [rules.required, (val) => (!val || val.length <= 13) || false],
      },
      {
        label: "Country",
        placeholder: "Select country",
        value: "home_town_country_id",
        key: "country_id",
        type: "select",
        options: computed(() => generalStore.countries),
        next_dropdown_required: true,
        rules: [rules.required],
      },
      {
        label: "State",
        placeholder: "Select state",
        value: "home_town_state_id",
        key: "state_id",
        type: "select",
        options: home_town_states,
        next_dropdown_required: true,
        rules: [rules.required],
      },
      {
        label: "City",
        placeholder: "Select city",
        value: "home_town_city_id",
        type: "select",
        options: home_town_cities,
        next_dropdown_required: true,
        rules: [rules.required],
      },
    ],
  },
  {
    heading: "Current Address:",
    fields: [
      {
        label: "Address 1",
        placeholder: "Enter current address 1",
        value: "current_address_1",
        type: "text",
        rules: [rules.required, (val) => (!val || val.length <= 200) || false],
      },
      {
        label: "Address 2",
        placeholder: "Enter current address 2",
        value: "current_address_2",
        type: "text",
        rules: [rules.required, (val) => (!val || val.length <= 200) || false],
      },
      {
        label: "Zip code",
        placeholder: "Enter current zip code",
        value: "current_zip_code",
        type: "text",
        rules: [rules.required, (val) => (!val || val.length <= 13) || false],
      },
      {
        label: "Country",
        placeholder: "Select country",
        value: "current_country_id",
        key: "country_id",
        type: "select",
        options: computed(() => generalStore.countries),
        rules: [rules.required],
      },
      {
        label: "State",
        placeholder: "Select state",
        value: "current_state_id",
        key: "state_id",
        type: "select",
        options: current_states,
        rules: [rules.required],
      },
      {
        label: "City",
        placeholder: "Select city",
        value: "current_city_id",
        type: "select",
        options: current_cities,
        rules: [rules.required],
      },
    ],
  },
  {
    heading: "Department:",
    fields: [
      {
        label: "Department",
        placeholder: "Select department",
        value: "department_id",
        key: "department_employee_type_id",
        type: "select",
        options: departments,
        rules: [rules.required],
      },
      {
        label: "Type",
        placeholder: "Select type",
        value: "department_employee_type_id",
        type: "select",
        options: types,
        rules: [rules.required],
      },
    ],
  },
  {
    heading: "Roles:",
    fields: [
      {
        label: "Role",
        placeholder: "Select role",
        value: "role_id",
        type: "select",
        options: roles,
        rules: [rules.required],
      },
    ],
  },
]);

/**
 * creating new record
 */
const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .addStaff({ ...createModel.value, user_id: route.params.id }, true)
        .then(() => {
          adding.value = false;
          createModel.value = {};
          console.log(router);
          router.push({ path: `/practice/staff/detail/${route.params.id}` });
        })
        .catch(() => {
          adding.value = false;
        });
    }
  });
};

/**
 * function for resetting states and cities on country change
 * @param {String} key
 */
const resetField = (key) => {
  if (key == "home_town_country_id") {
    createModel.value.home_town_state_id ? (createModel.value.home_town_state_id = "") : "";
    createModel.value.home_town_city_id ? (createModel.value.home_town_city_id = "") : "";
    home_town_states.value = [];
    home_town_cities.value = [];
    generalStore.getStateRequest(createModel.value.home_town_country_id).then((res) => {
      home_town_states.value = res;
    });
  } else if (key == "home_town_state_id") {
    createModel.value.home_town_city_id ? (createModel.value.home_town_city_id = "") : "";
    home_town_cities.value = [];
    generalStore.getCityRequest(createModel.value.home_town_state_id).then((res) => {
      home_town_cities.value = res;
    });
  } else if (key == "current_country_id") {
    createModel.value.current_state_id
      ? (createModel.value.current_state_id = "")
      : "";
    createModel.value.current_city_id ? (createModel.value.current_city_id = "") : "";
    current_states.value = [];
    current_cities.value = [];
    generalStore.getStateRequest(createModel.value.current_country_id).then((res) => {
      current_states.value = res;
    });
  } else if (key == "current_state_id") {
    createModel.value.current_city_id ? (createModel.value.current_city_id = "") : "";
    current_cities.value = [];
    generalStore.getCityRequest(createModel.value.current_state_id).then((res) => {
      current_cities.value = res;
    });
  } else if (key == "department_id") {
    createModel.value.department_employee_type_id
      ? (createModel.value.department_employee_type_id = "")
      : "";
    if (createModel.value.department_id) {
      types.value = departments.value.find(
        (d) => d.id == createModel.value.department_id
      ).employee_type.filter((e) => e.status == true);
    } else {
      types.value = [];
    }
  }
};
</script>

<style lang="scss" scoped>
:deep(.q-table--horizontal-separator tbody tr:not(:last-child) > td),
:deep(.q-table--horizontal-separator thead th) {
  border-bottom-width: 10px;
}
:deep(.q-table tr) {
  background: white;
  border-radius: 8px;
}
:deep(.q-table thead),
:deep(.q-table tr),
:deep(.q-table th),
:deep(.q-table td) {
  border-color: rgb(249 249 251);
}

:deep .q-field {
  padding-bottom: 0px !important;
  background: white;

  .q-field__native {
    flex-wrap: nowrap;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .q-field__bottom {
    display: none !important;
  }
}
</style>
