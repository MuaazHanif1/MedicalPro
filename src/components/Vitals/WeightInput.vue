<template>
  <!-- divider -->
  <div class="column">
    <span class="row mb-10">
      <h6>Weight</h6>
      <span class="medium-font" @click="deleteWeightPressure" v-if="vitalIndex !== 0">
        <q-icon class="color-green cursor-pointer" name="delete"></q-icon>
      </span>
    </span>

    <q-form ref="weightForm">
      <!-- Weight and State -->
      <div class="row col-12 flex items-center">
        <div class="column custom-input-selector mb-0 flex col-sm-6 col-12">
          <span class="q-mb-sm input-label">Weight</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-20'" outlined :dense="true" placeHolder="Weight"
            v-model="measureWeightModel" :disable="isPerformingModal"
            :rules="[rules.required, rules.positiveDecimalNumbers]" class="pb-0">
            <template v-slot:append>
              <div class="relative row">
                <span class="border-input-field"></span>
                <div class="small-font relative ml-5">
                  <q-select class="nested-select" borderless :dense="true" v-model="measureWeightUnitsModel"
                    :options="measureWeightUnits"></q-select>
                </div>
              </div>
            </template>
          </q-input>
        </div>

        <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : ' mt-none'" :isInput="false"
          :option="stateOptions" label="State" inputType="select" v-model="stateModel" :isDisable="isPerformingModal" />
      </div>

      <!-- Weight Prepost and Not Performed -->

      <div class="row col-12 flex items-end mt-20">
        <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0' : 'pr-20'" :isInput="false"
          :option="selectOptions" label="Weight prepost" inputType="select" v-model="selectModel"
          :isDisable="isPerformingModal" />
        <div class="col-sm-6 col-12 input-label">
          <q-toggle v-model="isPerformingModal" label="If not performed" left-label></q-toggle>
          <q-select outlined :dense="true" :options-dense="true" v-model="noPerformingModel" label="Select a Reason"
            option-value="id" option-label="name" class="pb-0" :options="noPerformingOptions" behavior="menu"
            :disable="!isPerformingModal" :rules="[rules.required]"></q-select>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script setup>
import FormInput from "@/partials/FormInput.vue";
import { ref } from "vue";
import { defineProps, defineEmits, defineExpose, watch } from "vue";

const props = defineProps({
  vitalIndex: {
    type: Number,
  },
  editableData: {
    type: Object || null,
  },
});

const emit = defineEmits([
  "set-weight-pressure",
  "delete-weight-pressure",
  "create-weight-pressure",
  "on-submit",
]);
const weightForm = ref(null);

const measureWeightUnitsModel = ref("lbs");
const measureWeightUnits = ["lbs", "g", "kg"];

const measureWeightModel = ref(
  props.editableData?.weight_lbs ? props.editableData?.weight_lbs : ""
);

// multiple Decimal placed measureWaistModel
let tempMeasureWeightModel = ref();


const stateModel = ref(
  props.editableData?.type ? props.editableData?.type : ""
);
const stateOptions = [
  {
    id: "",
    name: "Select any option",
  },
  {
    name: "Stated",
    id: "Stated",
  },
  {
    name: "Pre-operative",
    id: "Preoperative",
  },
  {
    name: "Dry",
    id: "Dry",
  },
  {
    name: "With Clothes",
    id: "With clothes",
  },
  {
    name: "First",
    id: "First",
  },
];

const selectModel = ref(
  props.editableData?.weight_prepost ? props.editableData?.weight_prepost : ""
);

const selectOptions = [
  {
    id: "",
    name: "Enter weight prepost",
  },
  {
    name: "Pre-Dialysis",
    id: "Pre-dialysis",
  },
  {
    name: "Post-Dialysis",
    id: "Post-dialysis",
  },
];

const noPerformingModel = ref(
  props.editableData?.reason ? props.editableData?.reason : ""
);

// reason enums
const noPerformingOptions = [
  {
    name: "Select a reason",
    id: "",
  },
  {
    name: "Not Indicated",
    id: "Not indicated",
  },
  {
    name: "Not Tolerated",
    id: "Not tolerated",
  },
  {
    name: "Patient Refused",
    id: "Patient refused",
  },
];

// whether vital's info is taken or not
const isPerformingModal = ref(
  props.editableData?.not_performed ? props.editableData?.not_performed : false
);

// Will be used in future
/**  Description: this method calls the vital delete method with input form index to be deleted
 */
const deleteWeightPressure = () => {
  emit("delete-weight-pressure", props.vitalIndex);
};

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");

/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setWeightValues = () => {
  const weightData = {};

  // add all Enum keys
  weightData.weight_lbs = measureWeightModel.value;
  weightData.type = stateModel.value;
  weightData.weight_prepost = selectModel.value;
  weightData.id = id.value;

  !isPerformingModal.value
    ? (weightData.not_performed = !isPerformingModal.value)
    : (weightData.reason = noPerformingModel.value.id);
  weightData.not_performed = isPerformingModal.value;

  emit("set-weight-pressure", weightData, props.vitalIndex);
};

/**  Description: this method calls the submit method of the vital
 */
const onSubmit = () => {
  emit("on-submit");
};


/**  Description: this method validates the vital's input field and submits the form
 * 1) Upon Successful validation, It sets the vital's data
 */
const validation = () => {
  weightForm.value.validate().then((success) => {
    if (success) {
      emit("create-weight-pressure");
      setWeightValues();
    }
  });
};

// methods for unit conversions

/**  Description: this method converts g into kg
 * 1) If tempWeight and Weight are equal, apply the formula on tempWeight(value on which no rounded off operation is applied)
 * 2) If tempWeight and Weight are not equal, apply the formula on the 2 decimal place rounded off value
 */
const gramsToKg = () => {
  let weight = parseFloat(measureWeightModel.value);
  let tempWeight = parseFloat(tempMeasureWeightModel.value);
  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWeightModel.value = tempWeight / 1000;
    weight = tempMeasureWeightModel.value;
  } else {

    weight = weight / 1000;
    tempMeasureWeightModel.value = weight;
  }

  measureWeightModel.value = Number(weight).toFixed(2)

}

/**  Description: this method converts kg to g
 * 1) If tempWeight and Weight are equal, apply the formula on tempWeight(value on which no rounded off operation is applied)
 * 2) If tempWeight and Weight are not equal, apply the formula on the 2 decimal place rounded off value
 */
const kgtoGrams = () => {
  let weight = parseFloat(measureWeightModel.value);
  let tempWeight = parseFloat(tempMeasureWeightModel.value);

  // if the tempWeight and weight are same
  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWeightModel.value = tempWeight * 1000;
    weight = tempMeasureWeightModel.value;
  } else {

    weight = weight * 1000;
    tempMeasureWeightModel.value = weight;
  }

  measureWeightModel.value = Number(weight).toFixed(2)

}



/**  Description: this method converts lbs to kg
 * 1) If tempWeight and Weight are equal, apply the formula on tempWeight(value on which no rounded off operation is applied)
 * 2) If tempWeight and Weight are not equal, apply the formula on the 2 decimal place rounded off value
 */
const lbsToKg = () => {
  // convert lbs to kg
  let weight = parseFloat(measureWeightModel.value);
  let tempWeight = parseFloat(tempMeasureWeightModel.value);

  // if the tempWeight and weight are same
  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWeightModel.value = tempWeight / 2.205;
    weight = tempMeasureWeightModel.value;
  } else {

    weight = weight / 2.205;
    tempMeasureWeightModel.value = weight;
  }
  measureWeightModel.value = Number(weight).toFixed(2)
}

/**  Description: this method converts kg to lbs
 * 1) If tempWeight and Weight are equal, apply the formula on tempWeight(value on which no rounded off operation is applied)
 * 2) If tempWeight and Weight are not equal, apply the formula on the 2 decimal place rounded off value
 */
const kgToLbs = () => {
  let weight = parseFloat(measureWeightModel.value);
  let tempWeight = parseFloat(tempMeasureWeightModel.value);

  // if the tempWeight and weight are same
  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWeightModel.value = tempWeight * 2.205;
    weight = tempMeasureWeightModel.value;
  } else {

    weight = weight * 2.205;
    tempMeasureWeightModel.value = weight;
  }

  measureWeightModel.value = Number(weight).toFixed(2)


}


/**  Description: this method converts g to lbs
 * 1) If tempWeight and Weight are equal, apply the formula on tempWeight(value on which no rounded off operation is applied)
 * 2) If tempWeight and Weight are not equal, apply the formula on the 2 decimal place rounded off value
 */
const gramsToLbs = () => {
  let weight = parseFloat(measureWeightModel.value);
  let tempWeight = parseFloat(tempMeasureWeightModel.value);

  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWeightModel.value = tempWeight / 453.592;
    weight = tempMeasureWeightModel.value;
  } else {

    weight = weight / 453.592;
    tempMeasureWeightModel.value = weight;
  }

  measureWeightModel.value = Number(weight).toFixed(2)

}


/**  Description: this method converts lbs to g
 * 1) If tempWeight and Weight are equal, apply the formula on tempWeight(value on which no rounded off operation is applied)
 * 2) If tempWeight and Weight are not equal, apply the formula on the 2 decimal place rounded off value
 */
const lbsToGrams = () => {
  let weight = parseFloat(measureWeightModel.value);
  let tempWeight = parseFloat(tempMeasureWeightModel.value);

  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWeightModel.value = tempWeight * 453.592;
    weight = tempMeasureWeightModel.value;
  } else {

    weight = weight * 453.592;
    tempMeasureWeightModel.value = weight;
  }

  measureWeightModel.value = Number(weight).toFixed(2)

}

/**  Description: this method validates the vital's input field and submits the form
 * 1) Upon Successful validation, It sets the vital's data
 */
const validateAndSubmit = () => {
  weightForm.value.validate().then((success) => {
    if (success) {
      // coverts the weight measuring unit to pounds
      if (measureWeightUnitsModel.value === "g") {
        gramsToLbs();
      } else if (measureWeightUnitsModel.value === "kg") {
        kgToLbs();
      }
      setWeightValues();
      onSubmit();
    }
  });
};


/**  Description: this watcher calls the respective unit conversion method
 */
watch(measureWeightUnitsModel, (newUnit, oldUnit) => {

  if (measureWeightModel.value !== "") {
    if (newUnit === "kg" && oldUnit === "g") {
      // convert g into kg
      gramsToKg();
    } else if (newUnit === "g" && oldUnit === "kg") {
      // convert kg to g
      kgtoGrams();
    } else if (newUnit === "kg" && oldUnit === "lbs") {
      // convert lbs to kg
      lbsToKg();
    } else if (newUnit === "lbs" && oldUnit === "kg") {
      // convert kg to lbs
      kgToLbs();
    } else if (newUnit === "lbs" && oldUnit === "g") {
      // convert g to lbs
      gramsToLbs();
    } else if (newUnit === "g" && oldUnit === "lbs") {
      // convert lbs to g
      lbsToGrams();
    }
  }

});

defineExpose({
  validation,
  validateAndSubmit,
});
</script>

<style lang="scss" scoped>
:deep .nested-select .q-field__control::before {
  border: none !important;
}

:deep .nested-select .q-field__control::after {
  border: none !important;
}

.border-input-field {
  border-left: 1px solid #9b96a0;
  font-size: $medium-font;
}

.nested-select {
  width: 50px;
}
</style>

<style scoped lang="scss">
:deep .q-field--outlined .q-field__control {
  border-radius: 8px !important;
}

:deep .q-field__control {
  color: $text-2;
}

:deep .q-field--outlined .q-field__control:hover:before {
  border-color: #d2d5e0 !important;
}
</style>

<style lang="scss" scoped>
:deep .q-field--outlined>.q-field__control {
  border-radius: 8px;
}

:deep .q-textarea .q-field__control {
  height: auto !important;
}

:deep .q-field__control {
  color: $text-2;
  height: 40px;
}

:deep .q-field--outlined .q-field__control:hover:before {
  border-color: #d2d5e0;
}

:deep .q-field__marginal {
  height: 40px;
}

:deep .custom-input-select .q-field__append {

  &,
  .q-field__control {
    width: 55px;
  }
}

:deep .q-field--borderless .q-field__control {

  &:after,
  &:before {
    border: none !important;
  }

  .q-field__control-container {
    flex-basis: 25px;
  }

  .q-field__append {
    justify-content: space-around;
  }
}

:deep .q-menu .q-item__label {
  text-transform: capitalize;
}

:deep .q-field {
  padding-bottom: 0px !important;

  .q-field__bottom {
    display: none !important;
  }
}

.border-input-field {
  border-left: 1px solid #9b96a0;
  font-size: $medium-font;
}
</style>

