<template>
  <div class="column">
    <span class="row mb-10">
      <h6>Body Mass Index</h6>
    </span>

    <q-form ref="bmiForm">
      <div class="row col-12 flex items-center">
        <div class="column custom-input-selector mb-0 flex col-sm-6 col-12">
          <span class="q-mb-sm input-label">BMI</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-10'" outlined :dense="true" placeHolder="Enter BMI"
            v-model="measureBmiModel" :rules="[rules.required, rules.number]" class="pb-0">
          </q-input>
        </div>
        <!-- May be used in future -->
        <!-- <div
          class="col-sm-6 col-12 input-label"
          :class="$q.screen.lt.sm ? 'pb-0 mt-20' : 'pb-13'"
        >
          <q-toggle
            v-model="isPerformingModal"
            label="If Not Performed"
            left-label
          ></q-toggle>
          <q-select
            outlined
            :dense="true"
            :options-dense="true"
            v-model="noPerformingModel"
            label="Select a Reason"
            class="custom-input-selector"
            :options="noPerformingOptions"
            behavior="menu"
            :disable="!isPerformingModal"
          ></q-select>
        </div> -->
      </div>
    </q-form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { defineEmits, defineExpose, defineProps } from "vue";

const props = defineProps({
  editableData: {
    type: Object || null,
  },
});
const emit = defineEmits(["set-bmi-pressure", "on-submit"]);

const bmiForm = ref(null);

const measureBmiModel = ref(
  props.editableData?.bmi_vital ? props.editableData?.bmi_vital : null
);
// Will be used in future
// const noPerformingModel = ref(null);
// const noPerformingOptions = ["Option1", "Option 2", "Option 3"];
// const isPerformingModal = ref(false);

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");


/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setBmiValues = () => {
  const bmiData = {};

  // add all keys
  bmiData.bmi_vital = measureBmiModel.value;
  bmiData.id = id.value;

  // !isPerformingModal.value
  //   ? (bmiData.not_performed = !isPerformingModal.value)
  //   : (bmiData.reason = noPerformingModel.value.id);
  // bmiData.not_performed = isPerformingModal.value;

  emit("set-bmi-pressure", bmiData);
};


/**  Description: this method calls the submit method of the vital
 */
const onSubmit = () => {
  emit("on-submit");
};
/**  Description: this method validates the vital's input field and submits the form
 * 1) Upon Successful validation, It sets the vital's data
 */
const validateAndSubmit = () => {
  bmiForm.value.validate().then((success) => {
    if (success) {
      setBmiValues();
      onSubmit();
    }
  });
};

defineExpose({
  validateAndSubmit,
});
</script>

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

