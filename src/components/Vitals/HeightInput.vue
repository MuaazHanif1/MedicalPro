<template>
  <!-- divider -->
  <div class="column">
    <span class="row mb-10">
      <h6>Height</h6>
      <span class="medium-font" @click="deleteHeightPressure" v-if="vitalIndex !== 0">
        <q-icon class="color-green cursor-pointer" name="delete"></q-icon>
      </span>
    </span>

    <q-form ref="heightForm">
      <!-- Height and Position -->
      <div class="row col-12 flex items-center">
        <div class="column custom-input-selector mb-0 flex col-sm-6 col-12">
          <span class="q-mb-sm input-label">Height</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-20'" :dense="true" outlined placeHolder="Height"
            v-model="measureHeightModel" :disable="isPerformingModal"
            :rules="[rules.required, rules.positiveDecimalNumbers]" class="pb-0">
            <template v-slot:append>
              <div class="row">
                <span class="border-input-field mr-5"></span>
                <div class="small-font relative">
                  <q-select class="nested-select" :dense="true" v-model="measureHeightUnitsModel"
                    :options="measureHeightUnits" @click="unitCoversion"></q-select>
                </div>
              </div>
            </template>
          </q-input>
        </div>

        <!-- position -->
        <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : ' mt-none'" :isInput="false"
          :option="positionOptions" label="Position" inputType="select" v-model="positionModel"
          :isDisable="isPerformingModal" />
      </div>

      <!-- Not Performed -->

      <div class="row col-12 flex items-end mt-20">
        <div class="col-sm-6 col-12 input-label" :class="$q.screen.lt.sm ? 'pr-0' : 'pr-20'">
          <q-toggle v-model="isPerformingModal" label="If Not Performed" left-label></q-toggle>
          <q-select outlined :dense="true" :options-dense="true" v-model="noPerformingModel" label="Select a reason"
            :options="noPerformingOptions" behavior="menu" :disable="!isPerformingModal" option-value="id"
            option-label="name" class="pb-0" :rules="[rules.required]"></q-select>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script setup>
import FormInput from "@/partials/FormInput.vue";
import { ref } from "vue";
import { defineProps, defineEmits, defineExpose, watch } from "vue";
import useDecimalPart from "@/composables/decimal";

const props = defineProps({
  vitalIndex: {
    type: Number,
  },
  editableData: {
    type: Object || null,
  },
});

const emit = defineEmits([
  "set-height-pressure",
  "delete-height-pressure",
  "create-height-pressure",
  "on-submit",
]);
const heightForm = ref(null);

const measureHeightUnitsModel = ref("in");
const measureHeightUnits = ["cm", "in", "ft/in"];

const measureHeightModel = ref(
  props.editableData?.height_inches ? props.editableData?.height_inches : ""
);

// multiple Decimal placed measureWaistModel
let tempMeasureHeightUnitsModel = ref();

const positionModel = ref(
  props.editableData?.type ? props.editableData?.type : ""
);
// type enum
const positionOptions = [
  {
    name: "Select a position",
    id: "",
  },
  {
    name: "Stated",
    id: "Stated",
  },
  {
    name: "Laying",
    id: "Lying",
  },
  {
    name: "Standing",
    id: "Standing",
  },
  {
    name: "Pre-operative",
    id: "Preoperative",
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
const deleteHeightPressure = () => {
  emit("delete-height-pressure", props.vitalIndex);
};

// ID used for updating the editableData object
const id = ref(props.editableData?.id ? props.editableData?.id : "");


/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setHeightValues = () => {
  const heightData = {};

  // add all Enum keys
  heightData.height_inches = measureHeightModel.value;
  heightData.id = id.value;
  heightData.type = positionModel.value;

  !isPerformingModal.value
    ? (heightData.not_performed = !isPerformingModal.value)
    : (heightData.reason = noPerformingModel.value.id);
  heightData.not_performed = isPerformingModal.value;

  emit("set-height-pressure", heightData, props.vitalIndex);
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
  heightForm.value.validate().then((success) => {
    if (success) {
      emit("create-height-pressure");
      setHeightValues();
    }
  });
};


// methods for unit conversions

/**  Description: this method converts ft/in into cm
 * 1) If tempHeight and Height are equal, apply the formula on tempHeight(value on which no rounded off operation is applied)
 * 2) If tempHeight and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const feetInchesToCm = () => {
  let height = parseFloat(measureHeightModel.value);
  let tempHeight = parseFloat(tempMeasureHeightUnitsModel.value);

  // if the tempHeight and height are same
  if (Number(height) == Number(tempHeight).toFixed(2)) {

    let ft = Math.floor(tempHeight);
    let inches = useDecimalPart(tempHeight);
    const cmTotal = ((ft * 12) + parseInt(inches)) * 2.54;
    tempMeasureHeightUnitsModel.value = cmTotal;
    height = tempMeasureHeightUnitsModel.value;
  } else {

    let ft = Math.floor(height);
    let inches = useDecimalPart(height);
    const cmTotal = ((ft * 12) + parseInt(inches)) * 2.54;
    tempMeasureHeightUnitsModel.value = cmTotal;
    height = cmTotal;
  }
  measureHeightModel.value = Number(height).toFixed(2)
}
/**  Description: this method converts cm to inches
 * 1) If tempHeight and Height are equal, apply the formula on tempHeight(value on which no rounded off operation is applied)
 * 2) If tempHeight and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const cmToFeetIches = () => {

  let height = parseFloat(measureHeightModel.value);
  let tempHeight = parseFloat(tempMeasureHeightUnitsModel.value);

  // if the tempHeight and height are same
  if (Number(height) == Number(tempHeight).toFixed(2)) {

    let realFeet = ((tempHeight * 0.393700) / 12);
    let feet = Math.floor(realFeet);
    let inches = Math.round((realFeet - feet) * 12);
    tempMeasureHeightUnitsModel.value = feet + '.' + inches;
    height = tempMeasureHeightUnitsModel.value;
  } else {

    let realFeet = ((height * 0.393700) / 12);
    let feet = Math.floor(realFeet);
    let inches = Math.round((realFeet - feet) * 12);
    tempMeasureHeightUnitsModel.value = feet + '.' + inches;
    height = tempMeasureHeightUnitsModel.value;
  }

  measureHeightModel.value = Number(height).toFixed(2)


}

/**  Description: this method converts cm to in
 * 1) If tempHeight and Height are equal, apply the formula on tempHeight(value on which no rounded off operation is applied)
 * 2) If tempHeight and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const cmToInches = () => {
  let height = parseFloat(measureHeightModel.value);
  let tempHeight = parseFloat(tempMeasureHeightUnitsModel.value);

  // if the tempHeight and height are same
  if (Number(height) == Number(tempHeight).toFixed(2)) {

    tempMeasureHeightUnitsModel.value = tempHeight / 2.54;
    height = tempMeasureHeightUnitsModel.value;
  } else {

    height = height / 2.54;
    tempMeasureHeightUnitsModel.value = height;
  }

  measureHeightModel.value = Number(height).toFixed(2)


}

/**  Description: this method converts in to cm
 * 1) If tempHeight and Height are equal, apply the formula on tempHeight(value on which no rounded off operation is applied)
 * 2) If tempHeight and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const inchesToCm = () => {
  let height = parseFloat(measureHeightModel.value);
  let tempHeight = parseFloat(tempMeasureHeightUnitsModel.value);

  // if the tempHeight and height are same
  if (Number(height) == Number(tempHeight).toFixed(2)) {

    tempMeasureHeightUnitsModel.value = tempHeight * 2.54;
    height = tempMeasureHeightUnitsModel.value;
  } else {

    height = height * 2.54;
    tempMeasureHeightUnitsModel.value = height;
  }

  measureHeightModel.value = Number(height).toFixed(2)
}

/**  Description: this method converts ft/in to in
 * 1) If tempHeight and Height are equal, apply the formula on tempHeight(value on which no rounded off operation is applied)
 * 2) If tempHeight and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const feetIchestoInches = () => {
  let height = parseFloat(measureHeightModel.value);
  let tempHeight = parseFloat(tempMeasureHeightUnitsModel.value);

  // if the tempHeight and height are same
  if (Number(height) == Number(tempHeight).toFixed(2)) {

    let ft = Math.floor(tempHeight);
    let inches = useDecimalPart(tempHeight);
    tempMeasureHeightUnitsModel.value = (ft * 12) + inches;
    height = tempMeasureHeightUnitsModel.value;
  } else {

    let ft = Math.floor(height);
    let inches = useDecimalPart(height);
    height = (ft * 12) + inches;
    tempMeasureHeightUnitsModel.value = height;
  }

  measureHeightModel.value = Number(height).toFixed(2)


}

/**  Description: this method converts in to ft/in
 * 1) If tempHeight and Height are equal, apply the formula on tempHeight(value on which no rounded off operation is applied)
 * 2) If tempHeight and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const inchesToFeetIches = () => {

  let height = parseFloat(measureHeightModel.value);
  let tempHeight = parseFloat(tempMeasureHeightUnitsModel.value);

  // if the tempHeight and height are same
  if (Number(height) == Number(tempHeight).toFixed(2)) {
    let feet = Math.floor(tempHeight / 12);
    let inches = (tempHeight - (feet * 12));
    tempMeasureHeightUnitsModel.value = feet + '.' + inches;
    height = tempMeasureHeightUnitsModel.value;
  } else {

    let feet = Math.floor(height / 12);
    let inches = (height - (feet * 12));
    tempMeasureHeightUnitsModel.value = feet + '.' + inches;
    height = feet + '.' + inches;
  }
  measureHeightModel.value = Number(height).toFixed(2)
}

/**  Description: this method validates the vital's input field and submits the form
 * 1) Upon Successful validation, It sets the vital's data
 */
const validateAndSubmit = () => {
  heightForm.value.validate().then((success) => {
    if (success) {
      // coverts the height measuring unit to Inches
      if (measureHeightUnitsModel.value === "cm") {
        cmToInches();
      } else if (measureHeightUnitsModel.value === "ft/in") {
        feetIchestoInches();
      }
      setHeightValues();
      onSubmit();
    }
  });
};


/**  Description: this watcher calls the respective unit conversion method
 */
watch(measureHeightUnitsModel, (newUnit, oldUnit) => {

  if (measureHeightModel.value !== "") {
    if (newUnit === "cm" && oldUnit === "ft/in") {
      // convert ft/in into cm
      feetInchesToCm();
    } else if (newUnit === "ft/in" && oldUnit === "cm") {
      // convert cm to ft/in
      cmToFeetIches();
    } else if (newUnit === "in" && oldUnit === "cm") {
      // cm to in
      cmToInches();
    } else if (newUnit === "cm" && oldUnit === "in") {
      // in to cm
      inchesToCm();
    } else if (newUnit === "in" && oldUnit === "ft/in") {
      // ft/in to in
      feetIchestoInches();
    } else if (newUnit === "ft/in" && oldUnit === "in") {
      // in to ft/in
      inchesToFeetIches();
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

