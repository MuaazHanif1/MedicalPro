<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <template v-if="isCreatedVitalView">
    <CreatedVitals heading="Weight" vitalType="weight" @show-create-vital="showVitalInput"
      @show-editable-vital="showEditableVitalInput" />
  </template>
  <template v-else>
    <template :key="vital.hash" v-for="(vital, index) in weight">
      <q-separator v-if="index !== 0" class="width-auto my-30" />
      <WeightInput @set-weight-pressure="setWeightValues" @delete-weight-pressure="removeWeightComponent"
        @create-weight-pressure="createWeight" @on-submit="apiCall" :vitalIndex="index" :editableData="editableData"
        ref="weightRef" />
    </template>
    <!-- will be used in future -->
    <!-- <span
    @click="incrementWeight()"
    class="medium-font row flex cursor-pointer items-center mt-10"
  >
    <q-icon class="color-green" name="add_circle"></q-icon>
    <p class="pl-5 color-green ma-0 font-small">Add Weight</p>
  </span> -->
    <div class="row flex justify-between items-center  mt-40">
      <span @click="showCreatedVitals()" class="cursor-pointer text-green small-font"> Cancel </span>
      <q-btn color="primary" :loading="isSaving" @click="onSubmit()" size="md" class="cursor-pointer col-2">
        Save
      </q-btn>
    </div>
  </template>
</template>

<script setup>
import { ref } from "vue";
import { useVitalsStore } from "@/store/vitals";
import WeightInput from "./WeightInput.vue";
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
const store = useVitalsStore();

const weightRef = ref([]);
const weight = ref([{ hash: new Date().getTime() }]);

// Will be used in future
/**  Description: this method adds another vital input section and validates the previous input section.
*/
// const incrementWeight = () => {
//   // console.log("///incrementweight", skipUnwrap);
//   console.log(weightRef.value[weight.value.length - 1]);

//   weightRef.value[weight.value.length - 1].validation();
// };


/**  Description: this method appends the array which inturn stores all vitals info.
    * 1) A unique hash is inserted into the array for VUE to track the reactivity
*/
const createWeight = () => {
  weight.value.push({ hash: new Date().getTime() });
};

/**  Description: this method sets data recieved from the Vital's Input Fields
  * @param {values} Object the data recieved from the Vital's Input Field
  * @param {index} Number the Array index number to store the data in the array 
 */
const setWeightValues = (values, index) => {
  weight[index] = values;
  Object.assign(weight.value[index], values);
};


// will be used in future
/**  Description: this method removes vital input field section
 * @param {index} Number Object in Array to be deleted
 */
const removeWeightComponent = (index) => {
  weight.value.splice(index, 1);
};
/**  Description: this method validates the vital's input field when submit button is pressed.
 * 1) Upon Successful validation, It submits the form
 */
const onSubmit = () => {
  weightRef.value[weight.value.length - 1].validateAndSubmit();
};

/**  Description: this method adds the vital in the front of its respective array
present in the store
 */
const addVital = (vital) => {
  store.weight.unshift(vital);
}
/**  Description: this method edits the vital present in its respective array in the store
 */
const editVital = (id, vital) => {
  //Find index of specific object using findIndex method.    
  let objIndex = store.weight.findIndex((obj => obj.id == id));
  store.weight[objIndex] = vital;
}

/**  Description: this method send the vital's data to the backend.
     * 1) It starts the loader in the button and stops it if the API call gets executed successfully
     * 2) It deletes those keys which are empty or null
     * 3) It deletes the Hash key (as it is not needed by the backend)
     * 4) It adds the appointment ID key in the object-to-be-sent-to-backend
     * 5) If the API POST request is in success, it loads the created-vital view
     * 6) If the vital is performed/taken, remove reason of not performing
     */
const apiCall = async () => {
  isSaving.value = true;
  for (const key in weight.value[0]) {
    if (weight.value[0][key] === "") {
      Reflect.deleteProperty(weight.value[0], key);
    }
  }

  Reflect.deleteProperty(weight.value[0], "hash");
  if (weight.value[0]['not_performed']) {
    for (const key in weight.value[0]) {
      if (key !== 'not_performed' && key !== 'reason' && key !== 'id') {
        Reflect.deleteProperty(weight.value[0], key);
      }
    }
  }

  Reflect.deleteProperty(weight.value[0], "hash");
  if (weight.value[0]['not_performed']) {
    for (const key in weight.value[0]) {
      if (key !== 'not_performed' && key !== 'reason' && key !== 'id') {
        Reflect.deleteProperty(weight.value[0], key);
      }
    }
  }

  if (weight.value[0]['not_performed'] === false) {
    Reflect.deleteProperty(weight.value[0], 'reason');
  }
  const weightData = weight.value[0];

  // out of weight key will be 0 always
  weightData.out_of_range = 0;

  weightData.appointment_id = store.appointment_id;

  const response = await store.sendWeightVital(weightData);
  isSaving.value = false;
  if (response.data) {
    if (weight.value[0].id) {
      editVital(weight.value[0].id, response.data.data);
    } else {
      addVital(response.data.data);
    }
    showCreatedVitals();
  }
};
</script>
<style lang="scss" scoped>

</style>
