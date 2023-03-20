<!-- eslint-disable no-unused-vars -->
<template>
  <div class="column">
    <span class="row mb-10">
      <h6>Waist Circumference</h6>
    </span>

    <q-form ref="waistForm">
      <div class="row col-12 flex items-center">
        <!-- waist input field -->
        <div class="column custom-input-selector mb-0 flex col-sm-6 col-12">
          <span class="q-mb-sm input-label">Waist</span>
          <q-input v-model="measureWaistModel" :class="$q.screen.lt.sm ? 'pr-0' : 'pr-10'" :dense="true" outlined
            placeHolder="waist" :rules="[rules.required, rules.positiveDecimalNumbers]" class="pb-0">
            <template v-slot:append>
              <div class="row">
                <span class="border-input-field mr-5"></span>
                <div class="small-font relative">
                  <q-select class="nested-select" :dense="true" v-model="measureWaistUnitsModel"
                    :options="measureWaistUnits"></q-select>
                </div>
              </div>
            </template>
          </q-input>
        </div>
        <!-- may use in future -->
        <!-- <FormInput
          class="col-sm-6 col-12"
          :class="$q.screen.lt.sm ? 'pr-0 mt-20' : 'pr-10 mt-none'"
          :isInput="false"
          :option="siteOptions"
          label="Inches"
          inputType="select"
          v-model="siteModel"
        /> -->
      </div>
    </q-form>
  </div>
</template>
<script setup>
// eslint-disable-next-line no-unused-vars
import useDecimalPart from "@/composables/decimal";
import { ref, watch } from "vue";
import { defineEmits, defineExpose, defineProps } from "vue";

// import FormInput from "@/partials/FormInput.vue";

const props = defineProps({
  editableData: {
    type: Object || null,
  },
});


const emit = defineEmits(["set-waist-circumference", "on-submit", 'update']);

const waistForm = ref(null);

const measureWaistModel = ref(
  props.editableData?.wc_vital_inches ? props.editableData?.wc_vital_inches : ""
);


// multiple Decimal placed measureWaistModel
let tempMeasureWaistModel = ref();

const measureWaistUnitsModel = ref("in");
const measureWaistUnits = ["ft", "in"];

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");

/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setWaistCircumferenceValues = () => {
  emit("set-waist-circumference", {
    wc_vital_inches: measureWaistModel.value,
    measuringUnit: measureWaistUnitsModel.value,
    id: id.value,
  });
};

/**  Description: this method calls the submit method of the vital
 */
const onSubmit = () => {
  emit("on-submit");
};


/**  Description: this method converts in into ft
 * 1) If tempWaist and Waist are equal, apply the formula on tempWaist(value on which no rounded off operation is applied)
 * 2) If tempWaist and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const inchesToFeet = () => {
  let weight = parseFloat(measureWaistModel.value);
  let tempWeight = parseFloat(tempMeasureWaistModel.value);

  // if the tempWeight and weight are same
  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWaistModel.value = tempWeight / 12;
    weight = tempMeasureWaistModel.value;
  } else {

    weight = weight / 12;
    tempMeasureWaistModel.value = weight;
  }

  measureWaistModel.value = Number(weight).toFixed(2)


}

/**  Description: this method converts ft to in
 * 1) If tempWaist and Waist are equal, apply the formula on tempWaist(value on which no rounded off operation is applied)
 * 2) If tempWaist and Height are not equal, apply the formula on the 2 decimal place rounded off value
 */
const feetToIches = () => {
  let weight = parseFloat(measureWaistModel.value);
  let tempWeight = parseFloat(tempMeasureWaistModel.value);

  // if the tempWeight and weight are same
  if (Number(weight) == Number(tempWeight).toFixed(2)) {

    tempMeasureWaistModel.value = tempWeight * 12;
    weight = tempMeasureWaistModel.value;
  } else {


    weight = weight * 12;
    tempMeasureWaistModel.value = weight;
  }
  measureWaistModel.value = Number(weight).toFixed(2);


}

/**  Description: this method validates the vital's input field and submits the form
 * 1) Upon Successful validation, It sets the vital's data
 */
const validateAndSubmit = () => {
  waistForm.value.validate().then((success) => {
    if (success) {
      // coverts the weight measuring unit to Inches
      if (measureWaistUnitsModel.value === "ft") {
        // converts Ft into Inches
        feetToIches();
      }
      setWaistCircumferenceValues();
      onSubmit();
    }
  });
};

/**  Description: this watcher calls the respective unit conversion method
 */
watch(measureWaistUnitsModel, (newUnit, oldUnit) => {

  if (measureWaistModel.value !== "") {
    if (newUnit === "ft" && oldUnit === "in") {
      // converts in into ft

      inchesToFeet();
    } else if (newUnit === "in" && oldUnit === "ft") {
      // converts ft to in
      feetToIches();
    }
  }
});

defineExpose({
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

