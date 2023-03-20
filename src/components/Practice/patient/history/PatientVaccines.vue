<template lang="">
  <div class="row justify-center" v-if="loading">
    <q-spinner-dots color="primary" size="3em" :thickness="2" />
  </div>
  <div :class="$q.screen.lt.sm ? 'px-15' : 'px-40'" v-else>
    <div v-if="data.length == 0">
      <!-- <q-btn
        color="light-green"
        text-color="primary"
        unelevated
        icon="add"
        size="md"
        label="Add Vaccine"
        no-caps
        @click="() => (add = !add)"
      /> -->
    </div>

    <!-- Editable History component  -->
    <CreateAndEditInfo
      ref="createEdit"
      :heading="inputs.vaccine.name"
      :info="section"
      v-for="(inputs, comp_index) in data"
      :data="inputs"
      :key="comp_index"
      class="col-md-8 mb-10"
      :canAdd="comp_index == 0 ? true : false"
      @add-dialog="showAdd"
      @form-submit="saveChanges"
      @delete-record="deleteVaccines"
      addTitle="Add Vaccine"
    >
      <template #details="{ info, data }">
        <!-- Detail view  -->
        <div class="row">
          <div
            class="col-md-6 col-12 row mb-15"
            v-for="(field, index) in info.fields"
            :key="index"
          >
            <div class="col-sm-5 col-xs-6">
              <label class="text-weight-bold" style="word-break: break-all">{{ field.label }}:</label>
            </div>
            <div class="col-sm-6 col-xs-6">
              <p class="mb-0" style="word-break: break-all" v-if="field.value in data && field.helper">
                {{
                  data[field.value]
                    ? getName(data[field.value], field.helper)
                    : "-"
                }}
              </p>
              <p class="mb-0" style="word-break: break-all" v-else-if="field.nested_object">
                {{
                  data[field.value]
                    ? data[field.nested_object][field.nested_key]
                    : "-"
                }}
              </p>
              <p class="mb-0" style="word-break: break-all" v-else-if="field.format">
                {{
                  data[field.value]
                    ? $filters.formatDate(data[field.value], field.format)
                    : "-"
                }}
              </p>
              <p class="mb-0" style="word-break: break-all" v-else-if="field.value in data">
                {{ data[field.value] ? data[field.value] : "-" }}
              </p>
              <p class="mb-0" style="word-break: break-all" v-else>-</p>
            </div>
          </div>
        </div>

        <q-separator class="mb-25 mt-10" />
      </template>
      <template #edit="{ info, data, returnedData }">
        <!-- Edit Start  -->
        <div class="row q-col-gutter-md">
          <!-- Normal Fields  -->
          <div
            class="col-12"
            :class="[
              field.input.col ? `col-md-${field.input.col}` : 'col-md-6',
            ]"
            v-for="(field, index) in info.fields"
            :key="index"
          >
            <label
              class="q-mb-sm phone-number-label d-block q-pt-none text-caption text-grey-9" style="word-break: break-all"
              v-if="field.input.type === 'phone'"
              >{{ field.input.label }}</label
            >
            <CountryPhone
              v-if="field.input.type === 'phone'"
              v-model="returnedData[field.value]"
              :defaultCountry="data[field.country_code]"
              :is_disabled="field.disabled"
              @selected-country="
                (code) => (returnedData[field.country_code] = code.dialCode)
              "
            ></CountryPhone>
            <FormInput
              v-else-if="field.input.next_dropdown_required"
              v-model="returnedData[field.value]"
              :placeHolder="field.input.placeholder"
              :label="field.input.label"
              :inputType="field.input.type"
              :isInput="field.input.type === 'select' ? false : true"
              :option="field.input.type === 'select' ? field.input.options : []"
              :optionvalue="
                field.input.type === 'select' ? field.input.optionvalue : 'id'
              "
              :optionlabel="
                field.input.type === 'select' ? field.input.optionlabel : 'name'
              "
              :rules="field.input.rules"
              @dropdown-value-change="
                dropdownHelper($event, field.input.key),
                  resetfield(field.input.key)
              "
              :isDepended="field.input.dependent_key ? false : false"
              :dependentOn="
                field.input.dependent_key
                  ? returnedData[field.input.dependent_key]
                  : null
              "
              :dependentRule="
                field.input.dependent_key ? field.input.dependent_rules : []
              "
              :max="field.input.max ? field.input.max : null"
            ></FormInput>
            <FormInput
              v-else
              v-model="returnedData[field.value]"
              :placeHolder="field.input.placeholder"
              :label="field.input.label"
              :inputType="field.input.type"
              :isInput="field.input.type === 'select' ? false : true"
              :option="field.input.type === 'select' ? field.input.options : []"
              :optionvalue="
                field.input.type === 'select' ? field.input.optionvalue : 'id'
              "
              :optionlabel="
                field.input.type === 'select' ? field.input.optionlabel : 'name'
              "
              :rules="field.input.rules"
              :isDepended="field.input.dependent_key ? true : false"
              :dependentOn="
                field.input.dependent_key
                  ? returnedData[field.input.dependent_key]
                  : null
              "
              :dependentRule="
                field.input.dependent_key ? field.input.dependent_rules : []
              "
              :max="field.input.max ? field.input.max : null"
            ></FormInput>
          </div>
        </div>
        <!-- Normal Fields  -->

        <!-- Edit End  -->
      </template>
    </CreateAndEditInfo>
    <!-- Editable History component ends here  -->

    <!-- Popup for creating new record -->
    <q-dialog v-model="add" no-backdrop-dismiss>
      <q-card
        style="max-width: 600px; padding: 0px 40px; width: 100%"
        class="px-15"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add Vaccine</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="createForm" :greedy="true">
            <div class="row q-col-gutter-sm">
              <div
                class="col-12"
                :class="[
                  add_field.col ? `col-md-${add_field.col}` : 'col-md-6',
                  createModel['vaccine_id'] ? '' : 'pa-0',
                ]"
                v-for="(add_field, add_index) in createInputs"
                :key="add_index"
              >
                <keep-alive>
                  <FormInput
                    v-if="add_index == 0 || createModel['vaccine_id']"
                    :inputType="add_field.type"
                    :isInput="
                      add_field.type === 'select' ||
                      add_field.type == 'multi_input'
                        ? false
                        : true
                    "
                    :select_default_value="add_field.type == 'multi_input' ? add_field.default_select : ''"
                    :label="add_field.label"
                    :option="add_field.options"
                    v-model="createModel[add_field.value]"
                    @selected-value="
                      updateModelValue($event, add_field.other_value)
                    "
                    :other_options="add_field.options"
                    :searchUrl="add_field.search_url"
                    :rules="add_field.rules"
                    :placeHolder="add_field.placeholder"
                    :max="add_field.max ? add_field.max : null"
                  ></FormInput>
                </keep-alive>
              </div>
            </div>
            <div class="row justify-end mt-25">
              <q-btn
                unelevated
                color="primary"
                label="Add History"
                padding="8px 41px"
                no-caps
                :loading="adding"
                size="md"
                @click="validateAndCreate"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- Popup for creating new record -->
  </div>
</template>
<script setup>
import { computed, ref } from "@vue/reactivity";
import CreateAndEditInfo from "@/partials/CreateAndEditInfo.vue";
import { usePracticeStore } from "@/store/practice";
import FormInput from "@/partials/FormInput.vue";
import CountryPhone from "@/partials/CountryPhone.vue";
import rules from "@/composables/validation-rules";
import { useGeneralStore } from "@/store/general";
import { date } from "quasar";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();


const practiceStore = usePracticeStore();
const generalStore = useGeneralStore();
const createForm = ref(null);
const loading = ref(true);
const add = ref(false);
const adding = ref(false);
let newDate = date.formatDate(Date.now(), "YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate, "YYYY/MM/DD");
const data = computed(() => practiceStore.currentPatient.history.vaccines.data);
const vaccines = computed(() => generalStore.vaccines);
const NDCs = computed(() => generalStore.NDCs);
const manufacturers = computed(() => generalStore.manufacturers);
const sites = computed(() => generalStore.sites);
const routes = computed(() => generalStore.routes);

const section = ref({
  heading: "Vaccine Name",
  fields: [
    {
      label: "Administer date",
      value: "administer_date",
      format: "DD MMM YYYY",
      input: {
        label: "Administer date",
        placeholder: "Enter administer date",
        col: "12",
        type: "date",
        rules: [rules.required],
        max: current_date,
        search_url: "/vaccines",
      },
    },
    {
      label: "Amount/Unit",
      value: "amount",
      input: {
        label: "Amount/Unit",
        placeholder: "Enter amount and unit",
        other_value: "unit",
        type: "multi_input",
        rules: [rules.number],
        options: [
          {
            id: "ml",
            name: "ml",
          },
          {
            id: "mg",
            name: "mg",
          },
          {
            id: "mcg",
            name: "mcg",
          },
          {
            id: "capsule",
            name: "capsule",
          },
        ],
      },
    },
    {
      label: "Administered by",
      value: "administer_by",
      input: {
        label: "Administered by",
        placeholder: "Enter administered by",
        type: "text",
        rules: [(val) => !val || val.length <= 29 || false],
      },
    },
    {
      label: "NDC",
      placeholder: "",
      value: "national_drug_code_id",
      nested_object: "national_drug_code",
      nested_key: "name",
      input: {
        label: "NDC",
        placeholder: "Select NDC",
        type: "select",
        options: NDCs,
        search_url: "/ndcs",
      },
    },
    {
      label: "Route",
      value: "route_id",
      nested_object: "route",
      nested_key: "name",
      input: {
        label: "Route",
        placeholder: "Select route",
        type: "select",
        options: routes,
      },
    },
    {
      label: "Site",
      placeholder: "",
      value: "site_id",
      nested_object: "site",
      nested_key: "name",
      input: {
        label: "Site",
        placeholder: "Select site",
        type: "select",
        options: sites,
      },
    },
    {
      label: "Lot#",
      value: "lot_number",
      input: {
        label: "Lot#",
        placeholder: "Enter lot number",
        type: "text",
        rules: [(val) => !val || val.length <= 29 || false],
      },
    },
    {
      label: "Manufacturer",
      value: "manufacture_id",
      nested_object: "manufacture",
      nested_key: "name",
      input: {
        label: "Manufacturer",
        placeholder: "Select manufacturer",
        type: "select",
        options: manufacturers,
        search_url: "/manufactures",
      },
    },
    {
      label: "Expiration date",
      placeholder: "",
      value: "expiry_date",
      format: "DD MMM YYYY",
      input: {
        label: "Expiration date",
        placeholder: "Enter expiration date",
        type: "date",
      },
    },
    {
      label: "Date on VIS",
      placeholder: "",
      value: "date_on_vaccine",
      format: "DD MMM YYYY",
      input: {
        label: "Date on VIS",
        placeholder: "Enter date on VIS",
        type: "date",
        max: current_date,
      },
    },
    {
      label: "VIS given date",
      placeholder: "",
      value: "vaccine_given_date",
      format: "DD MMM YYYY",
      input: {
        label: "VIS given date",
        placeholder: "Enter VIS given date",
        type: "date",
        max: current_date,
      },
    },
  ],
}); // edit and detail section structure
generalStore.getVaccines(); // vaccines record api
generalStore.getAllNDCs(); // NCD record api
generalStore.getAllManufacturers(); // manufacturers record
generalStore.getAllSites(); // sites record
generalStore.getAllRoutes(); // routes record
practiceStore.getPatientVaccines(userStore.loginUser.id).then(() => {
  loading.value = false;
});
const createModel = ref({});
const createInputs = ref([
  {
    label: "Vaccine name",
    placeholder: "Select vaccine name",
    value: "vaccine_id",
    type: "select",
    col: "12",
    options: vaccines,
    rules: [rules.required],
    search_url: "/vaccines",
  },
  {
    label: "Administer date",
    placeholder: "Enter administer date",
    value: "administer_date",
    type: "date",
    max: current_date,
    rules: [rules.required],
  },
  {
    label: "Amount/Unit",
    placeholder: "Enter amount and unit",
    value: "amount",
    other_value: "unit",
    default_select: 'mg',
    type: "multi_input",
    rules: [rules.number],
    options: [
      {
        id: "ml",
        name: "ml",
      },
      {
        id: "mg",
        name: "mg",
      },
      {
        id: "mcg",
        name: "mcg",
      },
      {
        id: "capsule",
        name: "capsule",
      },
    ],
  },
  {
    label: "Administered by",
    placeholder: "Enter administrator",
    value: "administer_by",
    type: "text",
    rules: [(val) => !val || val.length <= 29 || false],
  },
  {
    label: "NDC",
    placeholder: "Select NDC",
    value: "national_drug_code_id",
    type: "select",
    options: NDCs,
    search_url: "/ndcs",
  },
  {
    label: "Route",
    placeholder: "Select route",
    value: "route_id",
    type: "select",
    options: routes,
  },
  {
    label: "Site",
    placeholder: "Select site",
    value: "site_id",
    type: "select",
    options: sites,
  },
  {
    label: "Lot#",
    placeholder: "Select lot number",
    value: "lot_number",
    type: "text",
    rules: [(val) => !val || val.length <= 29 || false],
  },
  {
    label: "Manufacturer",
    placeholder: "Select manufacturer",
    value: "manufacture_id",
    type: "select",
    options: manufacturers,
    search_url: "/manufactures",
  },
  {
    label: "Expiration date",
    placeholder: "Enter expiration date",
    value: "expiry_date",
    min: current_date,
    type: "date",
  },
  {
    label: "Date on VIS",
    placeholder: "Enter date on VIS",
    value: "date_on_vaccine",
    max: current_date,
    type: "date",
  },
  {
    label: "VIS given date",
    placeholder: "Enter VIS given date",
    value: "vaccine_given_date",
    type: "date",
    max: current_date,
    col: "12",
  },
]); // create structure

/**
 * @param {value} Boolean toggle view
 */
const showAdd = (value) => {
  add.value = value;
};

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  practiceStore
    .updateCurrentPatientVaccines({
      ...updatedData,
      patient_vaccine_id: updatedData.id,
    })
    .then(() => {});
}; // edit record api call

const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .updateCurrentPatientVaccines(
          { ...createModel.value, patient_id: userStore.loginUser.id },
          true
        )
        .then(() => {
          adding.value = false;
          add.value = false;
          createModel.value = {};
        });
    }
  });
}; // creating record api call

/**
 * @param {value} String Data to be updated
 * @param {key} String Array key
 */
const updateModelValue = (value, key) => {
  createModel.value[key] = value;
};

/**
 * @param {deleteRecord} Array Data to be deleted
 */
const deleteVaccines = (deleteRecord) => {
  practiceStore.deletePatientVaccines(deleteRecord.id);
}; // deleting record api call
</script>
<style lang="scss">
:deep(.q-icon.on-left) {
  margin-right: 4px;
}
</style>
