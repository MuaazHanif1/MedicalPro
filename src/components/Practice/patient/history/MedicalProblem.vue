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
        label="Add Problem"
        no-caps
        @click="() => (add = !add)"
      /> -->
    </div>

    <!-- Editable History componet  -->
    <CreateAndEditInfo
      ref="createEdit"
      :heading="inputs.medical_problem.name"
      :info="section"
      v-for="(inputs, comp_index) in data"
      :data="inputs"
      :key="comp_index"
      class="col-md-8 mb-15"
      :canAdd="comp_index == 0 ? true : false"
      @add-dialog="showAdd"
      @form-submit="saveChanges"
      @delete-record="deleteSurgery"
      addTitle="Add Problem"
    >
      <template #details="{ info, data }">
        <!-- Detail view  -->
        <div class="row">
          <div
            class="col-md-6 col-12 row"
            v-for="(field, index) in info.fields"
            :key="index"
          >
            <div class="col-sm-5 col-xs-6">
              <label class="text-weight-bold mb-10 d-block" style="word-break: break-all"
                >{{ field.label }}:</label
              >
            </div>
            <div class="col-sm-6 col-xs-6">
              <p class="mb-0" style="word-break: break-all" v-if="field.value in data && field.helper">
                {{
                  data[field.value]
                    ? getName(data[field.value], field.helper)
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
                {{ data[field.value] || "-" }}
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
              class="q-mb-sm phone-number-label d-block q-pt-none text-caption text-grey-9"
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
              :disabled="field.input.disabled"
              :isInput="field.input.type === 'select' ? false : true"
              :option="field.input.type === 'select' ? field.input.options : []"
              :optionvalue="
                field.input.type === 'select' ? field.input.optionvalue : 'id'
              "
              :optionlabel="
                field.input.type === 'select' ? field.input.optionlabel : 'name'
              "
              :max="field.input.max ? field.input.max : null"
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
      <q-card style="max-width: 600px; padding: 0px 40px" class="px-15">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add Problem</div>
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
                ]"
                v-for="(add_field, add_index) in createInputs"
                :key="add_index"
              >
                <FormInput
                  :inputType="add_field.type"
                  :isInput="add_field.type === 'select' ? false : true"
                  :label="add_field.label"
                  :option="add_field.options"
                  v-model="createModel[add_field.value]"
                  :rules="add_field.rules"
                  :searchUrl="add_field.search_url"
                  :placeHolder="add_field.placeholder"
                  :disabled="add_field.disabled"
                  :max="add_field.max ? add_field.max : null"
                ></FormInput>
              </div>
            </div>
            <div class="row justify-end mt-20">
              <q-btn
                unelevated
                color="primary"
                label="Add History"
                padding="8px 41px"
                no-caps
                :loading="adding"
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

let newDate = date.formatDate(Date.now(), "YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate, "YYYY/MM/DD");
const createForm = ref(null);
const practiceStore = usePracticeStore();
const generalStore = useGeneralStore();
const loading = ref(true);
const adding = ref(false);
const add = ref(false);
practiceStore.getPatientMedicalProblems(userStore.loginUser.id).then(() => {
  loading.value = false;
});
generalStore.getAllMedicalProblems(); //  medical problems API call
const data = computed(() =>
  practiceStore.currentPatient.history.medical_problems.data
    ? practiceStore.currentPatient.history.medical_problems.data
    : {}
); // medical history data

const medical_problems = computed(() => generalStore.medical_problems);

const section = ref({
  heading: "Allergy Name",
  fields: [
    {
      label: "Status",
      value: "status",
      input: {
        label: "Status",
        placeholder: "Select status",
        type: "select",
        options:  [
      {
        id: "Historical",
        name: "Historical",
      },
      {
        id: "Active",
        name: "Active",
      },
    ]
      },
    },
    {
      label: "Onset date",
      value: "onset_date",
      format: "DD MMM YYYY",
      input: {
        label: "Onset Date",
        placeholder: "",
        type: "date",
        rules: [rules.required],
        max: current_date,
      },
    },
    {
      label: "Removal reason",
      value: "removal_reason",
      input: {
        label: "Removal reason",
        placeholder: "Enter removal reason",
        type: "text",
        rules: [(val) => (!val || val.length <=  29) || false],
        dependent_rules: [
          {
            value: '0',
            rules: [rules.required],
          },
          {
            value: '1',
            rules: [],
          },
        ],
        dependent_key: "status",
      },
    },
    {
      label: "Last occurrence",
      value: "last_occurrence",
      format: "DD MMM YYYY",
      input: {
        label: "Last occurrence",
        placeholder: "Enter last Occurrence",
        type: "date",
        max: current_date,
      },
    },
    {
      label: "Type",
      value: "type",
      input: {
        label: "Type",
        placeholder: "Select type",
        type: "select",
        options: [     
          {
            id: "Acute",
            name: "Acute",
          },
          {
            id: "Chronic",
            name: "Chronic",
          },
        ]
      },
    },
    {
      label: "Note",
      value: "note",
      input: {
        col: "12",
        label: "Note",
        placeholder: "Write note...",
        type: "textarea",
    rules: [(val) => (!val || val.length <=  200) || false]
      },
    },
  ],
}); // structure for edit and detail view

const createModel = ref({});

const createInputs = ref([
  {
    label: "Problem name",
    placeholder: "Select problem name",
    value: "medical_problem_id",
    type: "select",
    options: medical_problems,
    optionlabel: "surgery_name",
    search_url: "/medical-problems",
    rules: [rules.required],
  },
  {
    label: "Onset Date",
    placeholder: "Enter onset Date",
    value: "onset_date",
    type: "date",
    rules: [rules.required],
    max: current_date,
  },
  {
    label: "Status",
    placeholder: "Select status",
    value: "status",
    type: "select",
    options: [
      {
        id: "Historical",
        name: "Historical",
      },
      {
        id: "Active",
        name: "Active",
      },
    ],
    optionlabel: "surgery_name",
  },
  {
    label: "Removal reason",
    placeholder: "Enter removal reason",
    value: "removal_reason",
    type: "text",
    // disabled: createModel.value.status == 'Historical' ? true : false,
    rules: [(val) => (!val || val.length <=  200) || false,]
  },
  {
    label: "Last occurrence",
    placeholder: "Enter Last occurrence",
    value: "last_occurrence",
    type: "date",
    max: current_date,
  },
  {
    label: "Type",
    placeholder: "Enter type",
    value: "type",
    type: "select",
    options: [
      {
        id: "Acute",
        name: "Acute",
      },
      {
        id: "Chronic",
        name: "Chronic",
      },
    ],
  },
  {
    label: "Note",
    placeholder: "Enter note",
    value: "note",
    type: "textarea",
    col: "12",
    rules: [(val) => (!val || val.length <=  200) || false]
  },
]); //structure for creating record

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
    .updateCurrentPatientMedicalHistory({
      ...updatedData,
      patient_medical_problem_id: updatedData.id,
    })
    .then(() => {});
}; // edit record API call

const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .updateCurrentPatientMedicalHistory(
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
}; // creating new record

/**
 * @param {deleteRecord} Array Data to be deleted
 */
const deleteSurgery = (deleteRecord) => {
  practiceStore.deletePatientMedicalProblem(deleteRecord.id);
}; // deleting record
</script>
<style lang="scss">
:deep(.q-icon.on-left) {
  margin-right: 4px;
}
</style>
