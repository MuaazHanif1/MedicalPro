<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <template v-if="isCreatedVitalView">
    <CreatedVitals heading="Inhaled O2" vitalType="inhaledO2" @show-create-vital="showVitalInput"
      @show-editable-vital="showEditableVitalInput" />
  </template>
  <template v-else>
    <div class="relative-position">
      <InhaledO2Input @set-inhaled-o-pressure="setInhaledOValues" @on-submit="apiCall" :editableData="editableData"
        ref="inhaledRef" />

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
import InhaledO2Input from "./InhaledO2Input.vue";
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

const inhaledRef = ref(null);
const inhaledO = ref({});

/**  Description: this method sets data recieved from the Vital's Input Fields
  * @param {value} Object the data recieved from the Vital's Input Field
 */
const setInhaledOValues = (value) => {
  inhaledO.value = value;
};

/**  Description: this method validates the vital's input field when submit button is pressed.
 * 1) Upon Successful validation, It submits the form
 */
const onSubmit = () => {
  inhaledRef.value.validateAndSubmit();
};

/**  Description: this method adds the vital in the front of its respective array
present in the store
 */
const addVital = (vital) => {
  store.inhaledO2.unshift(vital);
}
/**  Description: this method edits the vital present in its respective array in the store
 */
const editVital = (id, vital) => {
  //Find index of specific object using findIndex method.    
  let objIndex = store.inhaledO2.findIndex((obj => obj.id == id));
  store.inhaledO2[objIndex] = vital;
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
  for (const key in inhaledO.value) {
    if (inhaledO.value[key] == "") {
      Reflect.deleteProperty(inhaledO.value, key);
    }
  }

  const inhaledOData = inhaledO.value;

  inhaledOData.appointment_id = store.appointment_id;

  const response = await store.sendInhaledO2Vital(inhaledOData);
  isSaving.value = false;
  if (response.data) {
    if (inhaledO.value.id) {
      editVital(inhaledO.value.id, response.data.data);
    } else {
      addVital(response.data.data);
    }
    showCreatedVitals();
  }
};
</script>
