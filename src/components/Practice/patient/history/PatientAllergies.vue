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
        label="Add Allergy"
        no-caps
        @click="() => (add = !add)"
      /> -->
    </div>

    <!-- Editable History component  -->
    <CreateAndEditInfo
      ref="createEdit"
      :heading="inputs.allergy.name"
      :info="section"
      v-for="(inputs, comp_index) in data"
      :data="inputs"
      :key="comp_index"
      class="col-md-8 mb-5"
      :canAdd="comp_index == 0 ? true : false"
      @add-dialog="showAdd"
      @form-submit="saveChanges"
      @delete-record="deleteAllergy"
      addTitle="Add Allergy"
    >
      <template #details="{ info, data }">
        <!-- Detail view  -->

        <div class="row">
          <div
            :class="[
              field.col ? `col-md-${field.col}` : 'col-md-6',
              'col-12',
              'row',
              'mb-15',
            ]"
            :style="field.value == 'note' ? 'order: 1' : ''"
            v-for="(field, index) in info.fields"
            :key="index"
          >
            <div :class="field.col == '12' ? `col-md-2` : 'col-md-5 col-xs-6'">
              <label class="text-weight-bold" style="word-break: break-all">{{ field.label }}:</label>
            </div>
            <div :class="field.col == '12' ? `col-md-9` : 'col-md-6 col-xs-6'">
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
                {{ data[field.value] ? data[field.value] : "-" }}
              </p>
              <p class="mb-0" style="word-break: break-all" v-else>-</p>
            </div>
          </div>

          <!-- Repeated Detail  -->
          <div
            class="col-md-12 col-12"
            v-for="(repeat, index) in info.repeated_fields"
            :key="index"
          >
            <!-- <div
              class="row"
              v-for="(repeat_field, repeat_index) in repeat"
              :key="repeat_index"
            >
              <div class="col-sm-6" v-if="!repeat_field.hidden">
                <label class="text-weight-bold"
                  >{{ repeat_field.label }}:</label
                >
              </div>
              <div class="col-sm-6" v-if="!repeat_field.hidden">
                <p
                  class="mb-0"
                  v-for="reaction in data[repeat_field.key]"
                  :key="reaction"
                >
                  {{
                    `${getName(reaction.reaction_id, )}`
                  }}
                </p>
              </div>
            </div> -->
            <div
              class="row mb-15"
              v-for="reaction in data[index]"
              :key="reaction"
            >
              <div
                class="col-md-6 col-12 row"
                v-for="(repeat_field, repeat_index) in repeat"
                :key="repeat_index"
              >
                <div class="col-sm-5 col-xs-6" v-if="!repeat_field.hidden">
                  <label class="text-weight-bold" style="word-break: break-all"
                    >{{ repeat_field.label }}:</label
                  >
                </div>
                <div class="col-sm-6 col-xs-6" v-if="!repeat_field.hidden">
                  <p class="mb-0" style="word-break: break-all" v-if="repeat_field.helper">
                    {{
                      `${getName(
                        reaction[repeat_field.value],
                        repeat_field.helper
                      )}`
                    }}
                  </p>
                  <p class="mb-0" style="word-break: break-all" v-else>
                    {{ `${reaction[repeat_field.value]}` }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Repeated Details  -->
        </div>
        <!-- Detail End  -->

        <q-separator class="mb-25 mt-10" />
      </template>
      <template #edit="{ info, data, returnedData }">
        <!-- Edit Start  -->
        <div class="row mt-10 q-col-gutter-md">
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
              :max="field.input.max ? field.input.max : null"
              :searchUrl="field.input.search_url"
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
              :searchUrl="field.input.search_url"
              :max="field.input.max ? field.input.max : null"
            ></FormInput>
          </div>
        </div>
        <!-- Normal Fields  -->

        <!-- Repeated Fields  -->
        <div v-for="repeated in info.repeated_fields" :key="repeated">
          <div
            class="row q-col-gutter-md"
            v-for="(cur_reaction, data_index) in returnedData[
              'patient_allergy_reaction'
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
                :max="field.input.max ? field.input.max : null"
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
                :max="field.input.max ? field.input.max : null"
              ></FormInput>
            </div>

            <q-btn
              class="pa-0 pt-30 pl-10"
              icon="cancel"
              unelevated=""
              @click="
                deleteInArray(
                  comp_index,
                  returnedData['patient_allergy_reaction'][data_index].id
                    ? returnedData['patient_allergy_reaction'][data_index].id
                    : returnedData['patient_allergy_reaction'][data_index]
                        .deletable_id
                )
              "
              :ripple="false"
              v-if="data_index"
            ></q-btn>
          </div>

          <q-btn
            class="pa-0 px-4 mt-10"
            unelevated
            icon="add"
            :ripple="false"
            text-color="primary"
            label="Add Reaction"
            padding="xs xl"
            no-caps
            size="md"
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
      <q-card style="max-width: 600px; padding: 0px 40px" class="px-15">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Add Allergy</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="pb-20">
          <q-form ref="createForm" :greedy="true">
            <div class="row q-col-gutter-md">
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
                  :max="add_field.max ? add_field.max : null"
                ></FormInput>
              </div>
            </div>
            <div
              class=""
              v-for="(add_rept, rept_index) in repeated_add_fields"
              :key="rept_index"
            >
              <div
                v-for="(mix_rept, s) in createModel[rept_index]"
                :key="mix_rept"
              >
                <div class="row q-col-gutter-md">
                  <div
                    class="col-12 mt-10"
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
                      :rules="[rules.required]"
                      :searchUrl="single_add.search_url"
                      :placeHolder="single_add.placeholder"
                      :max="single_add.max ? single_add.max : null"
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

              <div class="row justify-between mt-20">
                <q-btn
                  icon="add"
                  :ripple="false"
                  text-color="primary"
                  label="Add Reaction"
                  padding="8px 4px"
                  no-caps
                  size="md"
                  @click="addInCreate"
                  unelevated
                ></q-btn>

                <q-btn
                  unelevated
                  color="primary"
                  label="Add Allergy"
                  :loading="adding"
                  padding="8px 41px"
                  no-caps
                  size="md"
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
import enums from "@/composables/enums";
import CreateAndEditInfo from "@/partials/CreateAndEditInfo.vue";
import FormInput from "@/partials/FormInput.vue";
import CountryPhone from "@/partials/CountryPhone.vue";
import getName from "@/composables/helper";
import rules from "@/composables/validation-rules";
import { useQuasar } from "quasar";
import { date } from "quasar";
import { useUserStore } from "@/store/user";
const userStore = useUserStore();

const $q = useQuasar();
const createEdit = ref(null);
const createForm = ref(null);
const adding = ref(false);
const addInArray = (index) => {
  createEdit.value[index].addInData("patient_allergy_reaction", {
    ...reaction_model,
  });
}; // adding multiple allergies at once
const deleteInArray = (key, index) => {
  createEdit.value[key].deleteInData("patient_allergy_reaction", index);
}; // deleting from multiple allergies
const practiceStore = usePracticeStore();
const generalStore = useGeneralStore();
const loading = ref(true);
const add = ref(false);
const data = computed(() =>
  practiceStore.currentPatient.history.allergies.data
    ? practiceStore.currentPatient.history.allergies.data
    : {}
); // patient allergies data
practiceStore.getCurrentPatientAllergies(userStore.loginUser.id).then(() => {
  loading.value = false;
}); // API call for patient allergies
generalStore
  .getAllergies()
  .then()
  .catch(() => {
    $q.notify({
      position: "top-right",
      message: "Error",
      color: "negative",
      avatar: require("@/assets/svg/error.svg"),
      caption: "Something went wrong",
    });
  });
generalStore.getAllergyReactions(); // Allergy reaction api call
const allergies = computed(() => generalStore.allergies);
const allergy_reactions = computed(() => generalStore.allergy_reactions);
let newDate = date.formatDate(Date.now(), "YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate, "YYYY/MM/DD");

const reaction_model = {
  id: null,
  deletable_id: null,
  reaction_id: null,
  reaction_severity: "",
}; // structure for allergy reaction

const createModel = ref({
  patient_allergy_reaction: [
    {
      id: null,
      deletable_id: 0,
      reaction_id: null,
      reaction_severity: null,
    },
  ],
});

const createInputs = ref([
  {
    label: "Allergy name",
    placeholder: "Select allergy name",
    value: "allergy_id",
    type: "select",
    options: allergies,
    col: "12",
    rules: [rules.required],
    search_url: "/allergies",
  },
  {
    label: "Criticality",
    placeholder: "Select criticality",
    value: "criticality",
    type: "select",
    options: enums.criticality,
  },
  {
    label: "Onset Date",
    placeholder: "Enter onset date",
    value: "onset_date",
    type: "date",
    max: current_date,
    rules: [rules.required],
  },
  {
    label: "Note",
    placeholder: "Write note...",
    value: "note",
    type: "textarea",
    col: "12",
    rules: [(val) => !val || val.length <= 200 || false],
  },
]); // structure for new record

const repeated_add_fields = ref({
  patient_allergy_reaction: [
    {
      label: "Reaction",
      placeholder: "Select reaction",
      value: "reaction_id",
      type: "select",
      col: "5",
      options: allergy_reactions,
    },
    {
      label: "Severity",
      placeholder: "Select severity",
      value: "reaction_severity",
      type: "select",
      col: "5",
      options: enums.allergy_severity,
    },
  ],
}); // repeating allergies reaction structure

const section = ref({
  heading: "Allergy Name",
  fields: [
    {
      label: "Criticality",
      value: "criticality",
      col: "6",
      input: {
        label: "Criticality",
        placeholder: "Select criticality",
        type: "select",
        options: enums.criticality,
      },
    },
    {
      label: "Onset date",
      value: "onset_date",
      col: "6",
      format: "DD MMM YYYY",
      input: {
        label: "Onset date",
        placeholder: "Enter onset date",
        type: "date",
        max: current_date,
        rules: [rules.required],
      },
    },
    {
      label: "Note",
      value: "note",
      input: {
        col: "12",
        label: "Note",
        placeholder: "",
        type: "textarea",
        rules: [(val) => !val || val.length <= 200 || false],
      },
    },
  ],
  repeated_fields: {
    patient_allergy_reaction: [
      {
        key: "patient_allergy_reaction",
        label: "Reaction",
        value: "reaction_id",
        helper: "getAllergy",
        input: {
          label: "Reaction",
          placeholder: "Select reaction",
          type: "select",
          options: allergy_reactions,
          main: "patient_allergy_reaction",
          key: "reaction_id",
          rules: [rules.required],
        },
      },
      {
        key: "patient_allergy_reaction",
        label: "Severity",
        value: "reaction_severity",
        input: {
          label: "Severity",
          placeholder: "Select severity",
          type: "select",
          options: enums.allergy_severity,
          main: "patient_allergy_reaction",
          key: "reaction_severity",
          rules: [rules.required],
        },
      },
    ],
  },
}); // edit and detail structure

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
  practiceStore.updatePatientAllergy({ ...updatedData }).then(() => {});
}; // edit api call

/**
 * @param {index} Number array index to be deleted
 */
const deleteInCreate = (index) => {
  createModel.value.patient_allergy_reaction.splice(index, 1);
};

const addInCreate = () => {
  let object = {
    reaction_id: null,
    reaction_severity: null,
    deletable_id: null,
    id: null,
  };
  object.deletable_id =
    createModel.value.patient_allergy_reaction[
      createModel.value.patient_allergy_reaction.length - 1
    ].deletable_id + 1;

  createModel.value.patient_allergy_reaction.push(object);
};

const validateAndCreate = () => {
  createForm.value.validate().then((success) => {
    if (success) {
      adding.value = true;
      practiceStore
        .updatePatientAllergy(
          { ...createModel.value, patient_id: userStore.loginUser.id },
          true
        )
        .then(() => {
          adding.value = false;
          add.value = false;
          createModel.value = {
            patient_allergy_reaction: [
              {
                id: null,
                deletable_id: 0,
                reaction_id: null,
                reaction_severity: null,
              },
            ],
          };
        });
    }
  });
}; // creating new record

/**
 * @param {deleteRecord} Array Data to be deleted
 */
const deleteAllergy = (deleteRecord) => {
  practiceStore.deletePatientAllergy(deleteRecord.id);
}; // deleting record
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
