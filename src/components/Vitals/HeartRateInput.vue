<template>
  <!-- divider -->
  <div class="column">
    <span class="row mb-10">
      <h6>Heart Rate</h6>
      <span class="medium-font" @click="deleteBloodPressure" v-if="vitalIndex !== 0">
        <q-icon class="color-green cursor-pointer" name="delete"></q-icon>
      </span>
    </span>

    <q-form ref="heartRateForm">
      <div class="row col-12 flex items-center">
        <div class="custom-input-selector column flex col-12 col-sm-6 self-end">
          <span class="q-mb-sm input-label">Heart Rate</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-10'" outlined :dense="true" placeHolder="Enter Heart Rate"
            v-model="measureHeartRateModel" :rules="[rules.required, rules.number]" :disable="isPerformingModal">
            <template v-slot:append>
              <div class="flex">
                <span class="border-input-field"></span>
                <span class="font-small pl-10">{{ measureHeartRate }}</span>
              </div>
            </template>
          </q-input>
        </div>
        <div class="col-sm-6 col-12 input-label" :class="$q.screen.lt.sm ? ' mt-20' : ''">
          <q-toggle v-model="isPerformingModal" label="If not performed" left-label></q-toggle>
          <q-select outlined :dense="true" :options-dense="true" v-model="noPerformingModel" option-value="id"
            option-label="name" label="Select a reason" :options="noPerformingOptions" behavior="menu"
            :disable="!isPerformingModal" :rules="[rules.required]"></q-select>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { defineProps, defineEmits, defineExpose } from "vue";

const props = defineProps({
  vitalIndex: {
    type: Number,
  },
  editableData: {
    type: Object || null,
  },
});

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

const emit = defineEmits([
  "set-heart-rate-pressure",
  "delete-heart-rate-pressure",
  "create-heart-rate-pressure",
  "on-submit",
]);
const heartRateForm = ref(null);

const measureHeartRate = "BPM";

const measureHeartRateModel = ref(
  props.editableData?.rate ? props.editableData?.rate : ""
);

// Will be used in future
/**  Description: this method calls the vital delete method with input form index to be deleted
 */
const deleteBloodPressure = () => {
  emit("delete-heart-rate-pressure", props.vitalIndex);
};

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");

/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setHeartRateValues = () => {
  const heartRateData = {};
  heartRateData.rate = measureHeartRateModel.value;
  heartRateData.id = id.value;

  !isPerformingModal.value
    ? (heartRateData.not_performed = !isPerformingModal.value)
    : (heartRateData.reason = noPerformingModel.value.id);
  heartRateData.not_performed = isPerformingModal.value;
  emit("set-heart-rate-pressure", heartRateData, props.vitalIndex);
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
  heartRateForm.value.validate().then((success) => {
    if (success) {
      setHeartRateValues();
      onSubmit();
    }
  });
};

// Will be used in future
/**  Description: this method validates the vital's input field 
 * 1) Upon Successful validation, It creates another vital input field and sets the vital's data
 */
const validation = () => {
  heartRateForm.value.validate().then((success) => {
    if (success) {
      emit("create-heart-rate-pressure");
      setHeartRateValues();
    }
  });
};

defineExpose({
  validation,
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
