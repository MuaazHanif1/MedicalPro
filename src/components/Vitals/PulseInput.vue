<template>
  <!-- divider -->
  <div class="column">
    <span class="row mb-10">
      <h6>Pulse</h6>
      <span class="medium-font" @click="deletePulse" v-if="vitalIndex !== 0">
        <q-icon class="color-green cursor-pointer" name="delete"></q-icon>
      </span>
    </span>

    <q-form ref="pulseForm">
      <div class="row flex items-center">
        <div class="custom-input-selector column flex col-sm-6 col-12 self-end">
          <span class="q-mb-sm input-label">Pulse Rate</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-10'" outlined :dense="true" placeHolder="Pulse"
            :disable="isPerformingModal" v-model="measurePulseModel" :rules="[rules.required, rules.number]"
            class="pb-0">
            <template v-slot:append>
              <div class="flex">
                <span class="border-input-field"></span>
                <span class="font-small pl-10">{{ measurePulse }}</span>
              </div>
            </template>
          </q-input>
        </div>
        <!-- position -->
        <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : 'pr-10 mt-none'" :isInput="false"
          :option="positionOptions" label="Position" inputType="select" v-model="typeModel"
          :isDisable="isPerformingModal" />
      </div>
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
import { defineProps, defineEmits, defineExpose } from "vue";
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
  "set-pulse",
  "delete-pulse",
  "create-pulse",
  "on-submit",
]);
const pulseForm = ref(null);

const measurePulse = "BPM";
const measurePulseModel = ref(
  props.editableData?.rate ? props.editableData?.rate : ""
);

const typeModel = ref(props.editableData?.type ? props.editableData?.type : "");
const positionOptions = [
  {
    id: "",
    name: "Select a position",
  },
  {
    id: "regular",
    name: "Regular",
  },
  {
    id: "irregular",
    name: "Irregular",
  },
  {
    id: "regularly irregular",
    name: "Regularly Irregular",
  },
  {
    id: "irregularly irregular",
    name: "Irregularly Irregular",
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
const deletePulse = () => {
  emit("delete-pulse", props.vitalIndex);
};

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");

/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setPulseValues = () => {
  const pulseData = {};

  // add all keys
  pulseData.rate = measurePulseModel;
  pulseData.type = typeModel.value;
  pulseData.id = id.value;

  !isPerformingModal.value
    ? (pulseData.not_performed = !isPerformingModal.value)
    : (pulseData.reason = noPerformingModel.value.id);
  pulseData.not_performed = isPerformingModal.value;

  emit("set-pulse", pulseData, props.vitalIndex);
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
  pulseForm.value.validate().then((success) => {
    if (success) {
      setPulseValues();
      onSubmit();
    }
  });
};
// Will be used in future
/**  Description: this method validates the vital's input field 
 * 1) Upon Successful validation, It creates another vital input field and sets the vital's data
 */
const validation = () => {
  pulseForm.value.validate().then((success) => {
    if (success) {
      emit("create-pulse");
      setPulseValues();
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
