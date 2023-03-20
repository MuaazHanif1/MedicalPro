<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <template v-if="isCreatedVitalView">
    <CreatedVitals heading="Pain scale" vitalType="painScale" @show-create-vital="showVitalInput"
      @show-editable-vital="showEditableVitalInput" />
  </template>
  <template v-else>
    <template :key="vital.hash" v-for="(vital, index) in pain">
      <q-separator v-if="index !== 0" class="width-auto my-30" />
      <PainScaleInput @set-pain="setPainScale" @delete-pain="removePainScale" @create-pain="createPainScale"
        @on-submit="apiCall" :vitalIndex="index" :editableData="editableData" ref="painRef" />
    </template>
    <!-- may use in future -->
    <!-- <span
    @click="incrementPainScale()"
    class="medium-font row flex cursor-pointer items-center mt-30"
  >
    <q-icon class="color-green" name="add_circle"></q-icon>
    <p class="pl-5 color-green ma-0 font-small">Add Pain Scale</p>
  </span> -->
    <div class="row flex justify-between  mt-40">
      <div class="col-12 justify-between items-center flex">
        <span @click="showCreatedVitals()" class="cursor-pointer text-green small-font"> Cancel </span>
        <q-btn color="primary" :loading="isSaving" @click="onSubmit()" size="md" class="cursor-pointer col-2">
          Save
        </q-btn>
      </div>
    </div>
  </template>
</template>

<script setup>
import { ref } from "vue";
import { useVitalsStore } from "@/store/vitals";
import PainScaleInput from "./PainScaleInput.vue";
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

const painRef = ref([]);
const pain = ref([{ hash: new Date().getTime() }]);

// Will be used in future
/**  Description: this method adds another vital input section and validates the previous input section.
*/
// const incrementPainScale = () => {
//   console.log(painRef.value[pain.value.length - 1]);

//   painRef.value[pain.value.length - 1].validation();
// };

/**  Description: this method appends the array which inturn stores all vitals info.
    * 1) A unique hash is inserted into the array for VUE to track the reactivity
*/
const createPainScale = () => {
  pain.value.push({ hash: new Date().getTime() });
};

/**  Description: this method sets data recieved from the Vital's Input Fields
  * @param {values} Object the data recieved from the Vital's Input Field
  * @param {index} Number the Array index number to store the data in the array 
 */
const setPainScale = (values, index) => {
  Object.assign(pain.value[index], values);
};

// will be used in future
/**  Description: this method removes vital input field section
 * @param {index} Number Object in Array to be deleted
 */
const removePainScale = (index) => {
  pain.value.splice(index, 1);
};

/**  Description: this method validates the vital's input field when submit button is pressed.
 * 1) Upon Successful validation, It submits the form
 */
const onSubmit = () => {
  painRef.value[pain.value.length - 1].validateAndSubmit();
};

/**  Description: this method adds the vital in the front of its respective array
present in the store
 */
const addVital = (vital) => {
  store.painScale.unshift(vital);
}
/**  Description: this method edits the vital present in its respective array in the store
 */
const editVital = (id, vital) => {
  console.log(id, vital);
  let objIndex = store.painScale.findIndex((obj => obj.id == id));
  store.painScale[objIndex] = vital;
}

// when submit is successful, make the API call
/**  Description: this method send the vital's data to the backend.
     * 1) It starts the loader in the button and stops it if the API call gets executed successfully
     * 2) It deletes those keys which are empty or null
     * 3) It deletes the Hash key (as it is not needed by the backend)
     * 4) It adds the appointment ID key in the object-to-be-sent-to-backend
     * 5) If the API POST request is in success, it loads the created-vital view
     */
const apiCall = async () => {
  isSaving.value = true;
  for (const key in pain.value[0]) {
    if (pain.value[0][key] === "") {
      Reflect.deleteProperty(pain.value[0], key);
    }
  }

  Reflect.deleteProperty(pain.value[0], "hash");

  const painData = pain.value[0];

  painData.appointment_id = store.appointment_id;

  const response = await store.sendPainScaleVital(painData);
  isSaving.value = false;
  if (response.data) {
    if (pain.value[0].id) {
      editVital(pain.value[0].id, response.data.data);
    } else {
      addVital(response.data.data);
    }
    showCreatedVitals();
  }
};
</script>
