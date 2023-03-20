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
        label="Add Surgical History"
        no-caps
        @click="() => (add = !add)"
      /> -->
    </div>

    <!-- Editable History component  -->
    <CreateAndEditInfo
      ref="createEdit"
      :heading="inputs.surgery_procedure.surgery_name"
      :info="section"
      v-for="(inputs, comp_index) in data"
      :data="inputs"
      :key="comp_index"
      class="col-md-8"
      :canAdd="comp_index == 0 ? true : false"
      @add-dialog="showAdd"
      @form-submit="saveChanges"
      @delete-record="deleteSurgery"
      addTitle="Add Surgical History"
    >
      <template #details="{ info, data }">
        <!-- Detail view  -->
        <div class="row mb-20">
          <div
            class="row" :class="[
              field.col ? `col-md-${field.col}` : 'col-md-6',
              'col-12',
              'row',
            ]"
            v-for="(field, index) in info.fields"
            :key="index"
          >
            <div class="col-sm-2">
              <label class="text-weight-bold" style="word-break: break-all">{{ field.label }}:</label>
            </div>
            <div class="col-sm-10">
              <p class="mb-0" style="word-break: break-all" v-if="field.value in data && field.helper">
                {{
                  data[field.value]
                    ? getName(data[field.value], field.helper)
                    : "-"
                }}
              </p>
              <p v-else-if="field.format" style="word-break: break-all">
                {{
                  data[field.value]
                    ? $filters.formatDate(data[field.value], field.format)
                    : "-"
                }}
              </p>
              <p class="mb-0" v-else-if="field.value in data" style="word-break: break-all">
                {{ data[field.value] ? data[field.value] : "-" }}
              </p>
              <p class="mb-0" style="word-break: break-all" v-else>-</p>
            </div>
          </div>
        </div>

        <q-separator class="mb-25 mt-10" />
        <!-- Detail view  -->
      </template>
      <template #edit="{ info, data, returnedData }">
        <!-- Edit Start  -->
        <div class="row q-col-gutter-md">
          <!-- Normal Fields  -->
          <div
            class="col-12"
            :class="[
              field.input.col ? `col-md-${field.input.col}` : 'col-md-6',
              index ? '' : '',
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
              :max="field.input.max ? field.input.max : null"
              :rules="field.input.rules"
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
          <div class="text-h6 text-weight-bold">Add Surgical History</div>
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
                  :optionlabel="add_field.optionlabel"
                  :searchUrl="add_field.search_url"
                  :placeHolder="add_field.placeholder"
                  :max="add_field.max ? add_field.max : null"
                ></FormInput>
              </div>
            </div>
            <div class="row justify-end mt-20">
              <q-btn
                unelevated
                color="primary"
                label="Add History"
                :loading="adding"
                padding="8px 41px"
                no-caps
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

const createForm = ref(null);
const practiceStore = usePracticeStore();
const generalStore = useGeneralStore();
const loading = ref(true);
const adding = ref(false);
const add = ref(false);
practiceStore.getPatientSurgicalHistory(userStore.loginUser.id).then(() => {
  loading.value = false;
});
let newDate = date.formatDate(Date.now(), "YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate, "YYYY/MM/DD");
generalStore.getAllSurgery(); // surgeries record api call
const data = computed(() =>
  practiceStore.currentPatient.history.surgical.data
    ? practiceStore.currentPatient.history.surgical.data
    : {}
); // patient surgeries history record
const surgery_procedures = computed(() => generalStore.surgery_procedures); // surgery procedures record api call

const section = ref({
  heading: "Allergy Name",
  fields: [
    {
      label: "Surgery date",
      value: "date",
      format: "DD MMM YYYY",
      col: "12",
      input: {
        label: "Surgery date",
        col: "12",
        placeholder: "",
        type: "date",
        max: current_date,
      },
    },
    {
      label: "Note",
      value: "note",
      col: "12",
      input: {
        col: "12",
        label: "Note",
        placeholder: "Write note...",
        type: "textarea",
        rules: [(val) => (!val || val.length <= 200) || false]
      },
    },
  ],
}); // edit and detail structure

const createModel = ref({});

const createInputs = ref([
  {
    label: "Procedure name",
    placeholder: "Select procedure name",
    value: "surgery_procedure_id",
    type: "select",
    options: surgery_procedures,
    optionlabel: "surgery_name",
    rules: [rules.required],
    search_url: "/surgeries",
  },
  {
    label: "Surgery date",
    placeholder: "",
    value: "date",
    type: "date",
    max: current_date,
  },
  {
    label: "Note",
    placeholder: "Write note...",
    value: "note",
    type: "textarea",
    col: "12",
    rules: [(val) => (!val || val.length <= 200) || false]
  },
]); // create section structure

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
    .updateCurrentPatientSurgicalHistory({
      ...updatedData,
      patient_surgery_id: updatedData.id,
    })
    .then(() => {});
}; // edit record api call

const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .updateCurrentPatientSurgicalHistory(
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
 * @param {deleteRecord} Array Data to be deleted
 */
const deleteSurgery = (deleteRecord) => {
  practiceStore.deletePatientSurgery(deleteRecord.id);
}; // deleting record api call
</script>
<style lang="scss">
:deep(.q-icon.on-left) {
  margin-right: 4px !important;
}
</style>
