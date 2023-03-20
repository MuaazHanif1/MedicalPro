<template>
  <!-- divider -->
  <div class="column">
    <span class="row mb-10">
      <h6>Temperature</h6>
      <span class="medium-font" @click="deleteTemperature" v-if="vitalIndex !== 0">
        <q-icon class="color-green cursor-pointer" name="delete"></q-icon>
      </span>
    </span>

    <q-form ref="temperatureForm">
      <div class="row flex items-center">
        <!-- temperature -->
        <div class="custom-input-selector column flex col-sm-6 col-12 self-end">
          <span class="q-mb-sm input-label">Temperature</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-10'" outlined :dense="true" placeHolder="Temperature"
            :disable="isPerformingModal" v-model="measureTemperatureModel"
            :rules="[rules.required, rules.positiveDecimalNumbers]" class="pb-0">
            <template v-slot:append>
              <div class="row">
                <span class="border-input-field mr-5"></span>
                <div class="small-font relative">
                  <q-select class="nested-select" :dense="true" v-model="measureTemperatureUnitsModel"
                    :options="measureTemperatureUnits"></q-select>
                </div>
              </div>
            </template>
          </q-input>
        </div>
        <!-- examine location -->
        <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : 'pr-10 mt-none'" :isInput="false"
          :isDisable="isPerformingModal" :option="siteOptions" label="Examine location" inputType="select"
          v-model="siteModel" />
      </div>
      <!-- not performed  -->
      <div class="row col-12 flex items-end mt-20">
        <div class="col-sm-6 col-12 input-label" :class="$q.screen.lt.sm ? 'pr-0' : 'pr-10'">
          <q-toggle v-model="isPerformingModal" label="If not performed" left-label></q-toggle>
          <q-select outlined :dense="true" :options-dense="true" v-model="noPerformingModel" label="Select a reason"
            :options="noPerformingOptions" behavior="menu" :disable="!isPerformingModal" option-value="id"
            option-label="name" class="pb-0" :rules="[rules.required]"></q-select>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { defineProps, defineEmits, defineExpose, watch } from "vue";
import FormInput from "@/partials/FormInput.vue";

const props = defineProps({
  vitalIndex: {
    type: Number,
  },
  editableData: {
    type: Object || null,
  },
});

const emit = defineEmits([
  "set-temperature",
  "delete-temperature",
  "create-temperature",
  "on-submit",
]);
const temperatureForm = ref(null);

const measureTemperatureUnitsModel = ref("F");
const measureTemperatureUnits = ["F", "C"];

const measureTemperatureModel = ref(
  props.editableData?.temperature_f ? props.editableData?.temperature_f : ""
);

// multiple Decimal placed measureWaistModel
let tempTemperatureMeasureModel = ref();

const siteModel = ref(
  props.editableData?.examine_location
    ? props.editableData?.examine_location
    : ""
);
const siteOptions = [
  {
    id: "",
    name: "Select a position",
  },
  {
    id: "oral",
    name: "Oral",
  },
  {
    id: "ear",
    name: "Ear",
  },
  {
    id: "axillary",
    name: "Axillary",
  },
  {
    id: "rectal",
    name: "Rectal",
  },
  {
    id: "temporal artery",
    name: "Temporal Artery",
  },
];

const noPerformingModel = ref(
  props.editableData?.reason ? props.editableData?.reason : ""
);
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

const isPerformingModal = ref(
  props.editableData?.not_performed ? props.editableData?.not_performed : false
);
// Will be used in future
/**  Description: this method calls the vital delete method with input form index to be deleted
 */
const deleteTemperature = () => {
  emit("delete-temperature", props.vitalIndex);
};

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");

/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setTemperatureValues = () => {
  const temperatureData = {};

  // add all Enum keys
  temperatureData.temperature_f = measureTemperatureModel.value;
  temperatureData.examine_location = siteModel.value;
  temperatureData.id = id.value;

  !isPerformingModal.value
    ? (temperatureData.not_performed = !isPerformingModal.value)
    : (temperatureData.reason = noPerformingModel.value.id);
  temperatureData.not_performed = isPerformingModal.value;
  emit("set-temperature", temperatureData, props.vitalIndex);
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
  temperatureForm.value.validate().then((success) => {
    if (success) {
      emit("create-temperature");
      setTemperatureValues();
    }
  });
};
/**  Description: this method converts F to C
 * 1) If tempTemperature and Temperature are equal, apply the formula on tempTemperature(value on which no rounded off operation is applied)
 * 2) If tempTemperature and Temperature are not equal, apply the formula on the 2 decimal place rounded off value
 */
const fahrenheitToCelsius = () => {

  let temperature = parseFloat(measureTemperatureModel.value);
  let tempTemperature = parseFloat(tempTemperatureMeasureModel.value);
  // if the tempTemperature and temperature are same
  if (Number(temperature) == Number(tempTemperature).toFixed(2)) {
    tempTemperatureMeasureModel.value = (tempTemperature - 32) * 5 / 9;
    temperature = tempTemperatureMeasureModel.value;
  } else {
    temperature = (temperature - 32) * 5 / 9;
    tempTemperatureMeasureModel.value = temperature;
  }
  measureTemperatureModel.value = Number(temperature).toFixed(2);

}

/**  Description: this method converts C to F
 * 1) If tempTemperature and Temperature are equal, apply the formula on tempTemperature(value on which no rounded off operation is applied)
 * 2) If tempTemperature and Temperature are not equal, apply the formula on the 2 decimal place rounded off value
 */
const celsiusToFahrenheit = () => {

  let temperature = parseFloat(measureTemperatureModel.value);
  let tempTemperature = parseFloat(tempTemperatureMeasureModel.value);
  // if the tempTemperature and temperature are same
  if (Number(temperature) == Number(tempTemperature).toFixed(2)) {
    tempTemperatureMeasureModel.value = tempTemperature * 9 / 5 + 32;
    temperature = tempTemperatureMeasureModel.value;
  } else {
    temperature = temperature * 9 / 5 + 32;
    tempTemperatureMeasureModel.value = temperature;
  }
  measureTemperatureModel.value = Number(temperature).toFixed(2);

}

/**  Description: this method validates the vital's input field and submits the form
 * 1) Upon Successful validation, It sets the vital's data
 */
const validateAndSubmit = () => {
  temperatureForm.value.validate().then((success) => {
    if (success) {
      // coverts the temperature measuring unit to Celcius
      if (measureTemperatureUnitsModel.value === "C") {
        celsiusToFahrenheit();
      }
      setTemperatureValues();
      onSubmit();
    }
  });
};

/**  Description: this watcher calls the respective unit conversion method
 */
watch(measureTemperatureUnitsModel, (newUnit, oldUnit) => {
  console.log(newUnit, oldUnit);
  if (measureTemperatureModel.value !== "") {
    if (newUnit === "C" && oldUnit === "F") {
      // converts Fahrenheit to Celcius
      fahrenheitToCelsius();

    } else if (newUnit === "F" && oldUnit === "C") {
      // converts Celcius to Fahrenheit
      celsiusToFahrenheit();
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

