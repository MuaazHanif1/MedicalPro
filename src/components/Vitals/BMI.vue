<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <template v-if="isCreatedVitalView">
    <CreatedVitals heading="BMI" vitalType="bmi" @show-create-vital="showVitalInput"
      @show-editable-vital="showEditableVitalInput" />
  </template>
  <template v-else>
    <div class="relative-position">
      <BMIInput @set-bmi-pressure="setBMIValues" @on-submit="apiCall" :editableData="editableData" ref="bmiRef" />

      <div class="row flex justify-between  mt-40">
        <div class="col-sm-6 col-12 justify-between items-center flex">
          <span @click="showCreatedVitals()" class="cursor-pointer text-green small-font"> Cancel </span>
          <q-btn color="primary" :loading="isSaving" @click="onSubmit()" size="md" class="cursor-pointer col-2">
            Save
          </q-btn>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref } from "vue";
import BMIInput from "./BMIInput.vue";
import { useVitalsStore } from "@/store/vitals";
import CreatedVitals from "./CreatedVitals.vue";

// loader for saving vitals
const isSaving = ref(false);

//send editable data to the vital's input form
const editableData = ref(null);

// toggle between Created Vitals and Vital Input Component
let isCreatedVitalView = ref(true);


/**  Description: this method loads the input form vital view.
     */
const showVitalInput = () => {
  editableData.value = null;
  isCreatedVitalView.value = false;
};
/**  Description: this method loads the editable vital view.
    * @param {vitalsData} Object Data to be edited
     */
const showEditableVitalInput = (vitalsData) => {
  editableData.value = vitalsData;
  isCreatedVitalView.value = false;
};
/**  Description: this method loads the created vital view.
     */
const showCreatedVitals = () => {
  isCreatedVitalView.value = true;
};
// store
const store = useVitalsStore();

const bmiRef = ref(null);
const bmi = ref({});


/**  Description: this method sets data recieved from the Vital's Input Fields
  * @param {value} Object the data recieved from the Vital's Input Field
 */
const setBMIValues = (value) => {
  bmi.value = value;
};

/**  Description: this method validates the vital's input field when submit button is pressed.
 * 1) Upon Successful validation, It submits the form
 */
const onSubmit = () => {
  bmiRef.value.validateAndSubmit();
};


/**  Description: this method adds the vital in the front of its respective array
present in the store
 */
const addVital = (vital) => {
  store.bmi.unshift(vital);
}
/**  Description: this method edits the vital present in its respective array in the store
 */
const editVital = (id, vital) => {
  //Find index of specific object using findIndex method.    
  let objIndex = store.bmi.findIndex((obj => obj.id == id));
  store.bmi[objIndex] = vital;
}

/**  Description: this method send the vital's data to the backend.
     * 1) It starts the loader in the button and stops it if the API call gets executed successfully
     * 2) It deletes those keys which are empty or null
     * 3) It deletes the Hash key (as it is not needed by the backend)
     * 4) It adds the appointment ID key in the object-to-be-sent-to-backend
     * 5) If the API POST request is in success, it loads the created-vital view
     */
const apiCall = async () => {
  isSaving.value = true;
  for (const key in bmi.value) {
    if (bmi.value[key] == "") {
      Reflect.deleteProperty(bmi.value, key);
    }
  }

  const bmiData = bmi.value;
  bmiData.appointment_id = store.appointment_id;

  const response = await store.sendBmiVital(bmiData);
  isSaving.value = false;
  if (response.data) {
    if (bmi.value.id) {
      editVital(bmi.value.id, response.data.data);
    } else {
      addVital(response.data.data);
    }
    isSaving.value = false;
    showCreatedVitals();
  }
};
</script>
<style lang="scss" scoped>

</style>
