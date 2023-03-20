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
        label="Add History"
        no-caps
        @click="() => (add = !add)"
      /> -->
    </div>

    <!-- Editable History component  -->
    <CreateAndEditInfo
      ref="createEdit"
      :heading="inputs.medical_problem.name"
      :info="section"
      v-for="(inputs, comp_index) in data"
      :data="inputs"
      :key="comp_index"
      class="col-md-8"
      :canAdd="comp_index == 0 ? true : false"
      @add-dialog="showAdd"
      @form-submit="saveChanges"
      @delete-record="deleteFamilyHistory"
      addTitle="Add History"
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
              <label class="text-weight-bold mb-5" style="word-break: break-all">{{ field.label }}:</label>
            </div>
            <div class="col-sm-6 col-xs-6">
              <p class="mb-5" style="word-break: break-all" v-if="field.value in data && field.helper">
                {{ data[field.value] ? getName(data[field.value], field.helper) : '-' }}
              </p>
              <p class="mb-5" style="word-break: break-all" v-else-if="field.value in data">
                {{ data[field.value] ? data[field.value] : '-' }}
              </p>
              <p class="mb-5" style="word-break: break-all" v-else></p>
            </div>
          </div>

          <!-- Repeated Detail  -->
          <div
            class="row col-12 mb-5"
            v-for="(repeat, index) in info.repeated_fields"
            :key="index"
          >
            <div
              class="col-12 row mb-10"
              v-for="(reaction, family_index) in data[index]"
              :key="family_index"
            >
              <div
                class="row col-md-6 col-12"
                v-for="(repeat_field, repeat_index) in repeat"
                :key="repeat_index"
              >
                <div class="col-sm-5 col-xs-6 mb-5" v-if="!repeat_field.hidden">
                  <label class="text-weight-bold" style="word-break: break-all"
                    >{{ repeat_field.label }}:</label
                  >
                </div>
                <div class="col-sm-6 col-xs-6" v-if="!repeat_field.hidden">
                  <p class="mb-5" style="word-break: break-all" v-if="repeat_field.helper">
                    {{
                      reaction[repeat_field.value] ? `${getName(
                        reaction[repeat_field.value],
                        repeat_field.helper
                      )}` : '-'
                    }}
                  </p>
                  <p class="mb-5" style="word-break: break-all" v-else>{{ reaction[repeat_field.value] || '-' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Repeated Details  -->
        </div>
        
    <q-separator class="mb-25 mt-10" />
        <!-- Detail End  -->
      </template>
      <template #edit="{ info, data, returnedData }">
        <!-- Edit Start  -->
        <div class="row q-col-gutter-sm">
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
            ></FormInput>
          </div>
        </div>
        <!-- Normal Fields  -->

        <!-- Repeated Fields  -->
        <div v-for="repeated in info.repeated_fields" :key="repeated">
          <div
            class="row q-col-gutter-sm mb-10"
            v-for="(cur_reaction, data_index) in returnedData[
              'patient_family_history'
            ]"
            :key="data_index"
          >
            <div
              class="col-10 mb-10"
              :class="[
                field.input.col ? `col-md-${field.input.col}` : 'col-md-5',
              ]"
              v-for="(field, index) in repeated"
              :key="index"
            >
              <label
                class="q-mb-sm phone-number-label d-block q-pt-none text-caption text-grey-9"
                v-if="field.input.type === 'phone'"
                >{{ field.input.label
                }}{{ returnedData[field.input.main] }}</label
              >
              <CountryPhone
                v-if="field.input.type === 'phone'"
                v-model="
                  returnedData[field.input.main][data_index][field.input.key]
                "
                :defaultCountry="data[field.country_code]"
                :is_disabled="field.disabled"
                @selected-country="
                  (code) => (returnedData[field.country_code] = code.dialCode)
                "
              ></CountryPhone>
              <FormInput
                v-else-if="field.input.next_dropdown_required"
                v-model="
                  returnedData[field.input.main][data_index][field.input.key]
                "
                :placeHolder="field.input.placeholder"
                :label="field.input.label"
                :inputType="field.input.type"
                :isInput="field.input.type === 'select' ? false : true"
                :option="
                  field.input.type === 'select' ? field.input.options : []
                "
                :optionvalue="
                  field.input.type === 'select' ? field.input.optionvalue : 'id'
                "
                :optionlabel="
                  field.input.type === 'select'
                    ? field.input.optionlabel
                    : 'name'
                "
                :rules="field.input.rules"
                @dropdown-value-change="
                  dropdownHelper($event, field.input.key),
                    resetfield(field.input.key)
                "
              ></FormInput>

              <FormInput
                v-else
                v-model="
                  returnedData[field.input.main][data_index][field.input.key]
                "
                :placeHolder="field.input.placeholder"
                :label="field.input.label"
                :inputType="field.input.type"
                :isInput="field.input.type === 'select' ? false : true"
                :option="
                  field.input.type === 'select' ? field.input.options : []
                "
                :optionvalue="
                  field.input.type === 'select' ? field.input.optionvalue : 'id'
                "
                :optionlabel="
                  field.input.type === 'select'
                    ? field.input.optionlabel
                    : 'name'
                "
                :rules="field.input.rules"
              ></FormInput>
            </div>

            <q-btn
              class="pa-0 pt-15 pl-10"
              icon="cancel"
              unelevated=""
              @click="
                deleteInArray(
                  comp_index,
                  returnedData['patient_family_history'][data_index].id
                    ? returnedData['patient_family_history'][data_index].id
                    : returnedData['patient_family_history'][data_index]
                        .deletable_id
                )
              "
              v-if="data_index"
            ></q-btn>
          </div>

          <q-btn
            class="pa-0 px-4 mt-10"
            unelevated
            icon="add"
            :ripple="false"
            text-color="primary"
            label="Add Relative"
            no-caps
            @click="addInArray(comp_index)"
          ></q-btn>
        </div>

        <!-- Repeated Fields  -->

        <!-- Edit End  -->
      </template>
    </CreateAndEditInfo>
    <!-- Editable History component ends here  -->

    <!-- Popup for creating new record -->
    <q-dialog v-model="add" no-backdrop-dismiss>
      <q-card style="max-width: 600px; padding: 0px 40px;" class="px-15">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add History</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="createForm" :greedy="true">
            <div class="row q-col-gutter-md mb-10">
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
                  :placeHolder="add_field.placeholder"
                ></FormInput>
              </div>
            </div>
            <div
              v-for="(add_rept, rept_index) in repeated_add_fields"
              :key="rept_index"
            >
              <div
              class=" mb-10"
                v-for="(mix_rept, s) in createModel[rept_index]"
                :key="mix_rept"
              >
                <div class="row q-col-gutter-sm">
                  <div
                    class="col-12"
                    :class="[
                      single_add.col ? `col-md-${single_add.col}` : 'col-md-6',
                    ]"
                    v-for="(single_add, single_index) in add_rept"
                    :key="single_index"
                  >
                    <FormInput
                      :inputType="single_add.type"
                      :isInput="single_add.type === 'select' ? false : true"
                      :label="single_add.label"
                      :option="single_add.options"
                      v-model="createModel[rept_index][s][single_add.value]"
                      :rules="single_add.rules"
                      :optionlabel="single_add.optionlabel"
                      :placeHolder="single_add.placeholder"
                    ></FormInput>
                  </div>

                  <q-btn
                    class="pa-0 pt-30 pl-10"
                    icon="cancel"
                    unelevated=""
                    :ripple="false"
                    @click="deleteInCreate(s)"
                    v-if="s"
                  ></q-btn>
                </div>
              </div>

              <div class="row justify-between mt-25">
                <q-btn
                  padding="8px 4px"
                  no-caps
                  unelevated
                  icon="add"
                  :ripple="false"
                  text-color="primary"
                  label="Add Relative"
                  @click="addInCreate"
                ></q-btn>

                <q-btn
                  unelevated
                  color="primary"
                  no-caps
                  label="Add History"
                  padding="8px 41px"
                  :loading="adding"
                  @click="validateAndCreate"
                />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Popup for creating new record -->
  </div>
</template>
<script setup>
import { usePracticeStore } from "@/store/practice";
import { useGeneralStore } from "@/store/general";
import { ref, computed } from "vue";
import CreateAndEditInfo from "@/partials/CreateAndEditInfo.vue";
import FormInput from "@/partials/FormInput.vue";
import CountryPhone from "@/partials/CountryPhone.vue";
import getName from "@/composables/helper";
import rules from "@/composables/validation-rules";
import { useQuasar } from "quasar";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const $q = useQuasar();
const createEdit = ref(null);
const createForm = ref(null);
const adding = ref(false);
const addInArray = (index) => {
  createEdit.value[index].addInData("patient_family_history", {
    ...reaction_model,
  });
}; // add multiple relatives at once

const deleteInArray = (key, index) => {
  console.log(key, index);
  createEdit.value[key].deleteInData("patient_family_history", index);
}; // delete from multiple relatives array

const practiceStore = usePracticeStore();
const generalStore = useGeneralStore();
const loading = ref(true);
const add = ref(false);
const data = computed(() =>
  practiceStore.currentPatient.history.family_history.data
    ? practiceStore.currentPatient.history.family_history.data
    : {}
); // family history data
practiceStore.getPatientFamilyHistory(userStore.loginUser.id).then(() => {
  loading.value = false;
}); // API call for family history

generalStore.getAllergies(); // allergies API call
generalStore.getAllRelations(); // relations API call
const relations = computed(() => generalStore.family_relations);

const reaction_model = {
  id: null,
  deletable_id: null,
  patient_relationship_id: null,
  died: null,
  onset_age: null,
  note: null,
}; //model for adding multiple relatives

const createModel = ref({
  patient_family_history: [
    {
      id: null,
      deletable_id: 0,
      patient_relationship_id: null,
      died: null,
      onset_age: null,
      note: null,
    },
  ],
});
generalStore.getAllMedicalProblems(); // medical problem API call
const medical_problems = computed(() => generalStore.medical_problems);
const createInputs = ref([
  {
    label: "Problem name",
    placeholder: "Select problem name",
    value: "medical_problem_id",
    type: "select",
    options: medical_problems,
    col: "12",
    rules: [rules.required],
  },
]);

const repeated_add_fields = ref({
  patient_family_history: [
    {
      label: "Relative relation",
      value: "patient_relationship_id",
      placeholder: 'Select relative relation',
      type: "select",
      col: "12",
      options: relations,
      optionlabel: "relationship",
      rules: [rules.required],
    },
    {
      label: "Onset age",
      placeholder: 'Enter onset age',
      value: "onset_age",
      type: "text",
      col: "6",
      rules: [rules.number, (val) => (!val || parseInt(val) < 1000) || false],
    },
    {
      label: "Died",
      placeholder: 'Enter died age',
      value: "died",
      type: "text",
      col: "6",
      rules: [rules.number, (val) => (!val || parseInt(val) < 1000) || false],
    },
    {
      label: "Note",
      placeholder: "Write note...",
      value: "note",
      type: "textarea",
      col: "10",
      rules: [(val) => (!val || val.length <= 200) || false],
    },
  ],
}); // repeated fields structure for add form

const section = ref({
  heading: "",
  fields: [],
  repeated_fields: {
    patient_family_history: [
      {
        key: "patient_family_history",
        label: "Relative relation",
        value: "patient_relationship_id",
        helper: "getRelation",
        input: {
          label: "Relative relation",
          placeholder: "Select relative relation",
          type: "select",
          options: relations,
          optionlabel: "relationship",
          main: "patient_family_history",
          key: "patient_relationship_id",
          rules: [rules.required],
        },
      },
      {
        key: "patient_family_history",
        label: "Onset age",
        value: "onset_age",
        input: {
          label: "Onset age",
          placeholder: "Enter onset age",
          main: "patient_family_history",
          key: "onset_age",
          rules: [rules.number, (val) => (!val || parseInt(val) < 1000) || false],
        },
      },
      {
        key: "patient_family_history",
        label: "Died",
        value: "died",
        input: {
          label: "Died",
          placeholder: "Enter died age",
          main: "patient_family_history",
          key: "died",
          rules: [rules.number, (val) => (!val || parseInt(val) < 1000) || false],
        },
      },
      {
        key: "patient_family_history",
        label: "Note",
        value: "note",
        input: {
          label: "Note",
          placeholder: "Write note...",
          main: "patient_family_history",
          key: "note",
          rules: [(val) => (!val || val.length <= 200) || false],
        },
      },
    ],
  },
}); // structure for detail and edit section

/**
 * @param {value} Boolean toggle view
 */
const showAdd = (value) => {
  add.value = value;
}; //  toggle between edit and

/**
 * @param {updatedData} Array Data to be updated
 */
const saveChanges = (updatedData) => {
  practiceStore
    .updateCurrentPatientFamilyHistory({
      ...updatedData,
      patient_medical_history_id: updatedData.id,
    })
    .then(() => {});
}; // Edit API call

/**
 * @param {index} Number array index to be deleted
 */
const deleteInCreate = (index) => {
  createModel.value.patient_family_history.splice(index, 1);
};

const addInCreate = () => {
  let object = {
    reaction_id: null,
    reaction_severity: null,
    deletable_id: null,
    id: null,
  };
  object.deletable_id =
    createModel.value.patient_family_history[
      createModel.value.patient_family_history.length - 1
    ].deletable_id + 1;

  createModel.value.patient_family_history.push(object);
};

const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .updateCurrentPatientFamilyHistory(
          { ...createModel.value, patient_id: userStore.loginUser.id },
          true
        )
        .then(() => {
          add.value = false;
          adding.value = false;
          createModel.value = {
            patient_family_history: [
              {
                id: null,
                deletable_id: 0,
                patient_relationship_id: null,
                died: null,
                onset_age: null,
                note: null,
              },
            ],
          };
        })
        .catch(() => {
          add.value = false;
          adding.value = false;
        });
    }
  });
}; // create new record API call

/**
 * @param {deleteRecord} Array Data to be deleted
 */
const deleteFamilyHistory = (deleteRecord) => {
  console.log(deleteRecord);
  practiceStore.deleteFamilyHistory(deleteRecord.id);
}; // delete record API call
</script>
<style lang="scss" scoped>
:deep(.q-icon.on-left) {
  margin-right: 4px;
}
:deep(.q-hoverable:hover > .q-focus-helper),
:deep(.q-focusable:focus > .q-focus-helper) {
  opacity: 0 !important;
}

</style>
