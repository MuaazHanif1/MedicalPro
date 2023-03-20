<template>
  <div class="column">
    <span class="row mb-10">
      <h6>Blood Pressure</h6>
      <span class="medium-font" @click="deleteBloodPressure" v-if="vitalIndex !== 0">
        <q-icon class="color-green cursor-pointer" name="delete"></q-icon>
      </span>
    </span>
    <q-form ref="bloodPressureForm">
      <!-- Temperatures -->
      <div class="row col-12 flex items-end">
        <div class="column flex col-sm-6 col-12 self-end">
          <span class="q-mb-sm input-label">Systolic</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-20'" outlined :dense="true" placeHolder="Enter systolic"
            v-model="measureBloodPressureModel['systole']" :disable="isPerformingModal"
            :rules="[rules.required, rules.number]">
            <template v-slot:append>
              <div class="flex">
                <span class="border-input-field"></span>
                <span class="font-small pl-10">{{ measureBP }}</span>
              </div>
            </template>
          </q-input>
        </div>

        <div class="column flex col-sm-6 col-12 self-end">
          <span class="q-mb-sm input-label">Diastolic</span>
          <q-input outlined :dense="true" placeHolder="Enter diastolic" v-model="measureBloodPressureModel['diastole']"
            :disable="isPerformingModal" :rules="[rules.required, rules.number]">
            <template v-slot:append>
              <div class="flex">
                <span class="border-input-field"></span>
                <span class="font-small pl-10">{{ measureBP }}</span>
              </div>
            </template>
          </q-input>
        </div>
      </div>
      <!-- Position and Side -->
      <div class="row col-12 flex items-center" :class="$q.screen.lt.sm ? 'mt-0' : 'mt-16'">
        <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 ' : 'pr-20'" :isInput="false"
          :option="positionOptions" label="Position" inputType="select" v-model="positionModel"
          :isDisable="isPerformingModal" />
        <FormInput :class="$q.screen.lt.sm ? ' mt-20' : ''" class="col-sm-6 col-12" :isInput="false"
          :option="sideOptions" label="Side" inputType="select" v-model="sideModel" :isDisable="isPerformingModal" />
      </div>
      <!-- Age Group and Not Performed -->
      <div class="row col-12 flex items-end" :class="$q.screen.lt.sm ? 'mt-0' : 'mt-3'">
        <FormInput class="col-sm-6 col-12" :class="$q.screen.lt.sm ? 'pr-0 mt-20' : 'pr-20'" :isInput="false"
          :option="ageGroupOptions" label="Age Group" inputType="select" v-model="ageGroupModel"
          :isDisable="isPerformingModal" />
        <div class="col-sm-6 col-12 input-label" :class="$q.screen.lt.sm ? ' mt-20' : ''">
          <q-toggle v-model="isPerformingModal" label="If not performed" left-label></q-toggle>
          <q-select outlined :dense="true" :options-dense="true" v-model="noPerformingModel" option-value="id"
            option-label="name" label="Select a reason" class="pb-0" :options="noPerformingOptions" behavior="menu"
            :disable="!isPerformingModal" :rules="[rules.required]"></q-select>
        </div>
      </div>
    </q-form>
  </div>
</template>
<script setup>
import FormInput from "@/partials/FormInput.vue";
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

const emit = defineEmits([
  "set-blood-pressure",
  "delete-blood-pressure",
  "create-blood-pressure",
  "on-submit",
]);
const bloodPressureForm = ref(null);

// systolic, Dystolic measuring units
const measureBP = "mm Hg";

const measureBloodPressureModel = ref({
  systole: props.editableData?.systole ? props.editableData?.systole : "",
  diastole: props.editableData?.diastole ? props.editableData?.diastole : "",
});

const positionModel = ref(
  props.editableData?.type ? props.editableData?.type : ""
);
const positionOptions = [
  {
    id: "",
    name: "Select a position",
  },
  {
    id: "sitting",
    name: "Sitting",
  },
  {
    id: "standing",
    name: "Standing",
  },
  {
    id: "supine",
    name: "Supine",
  },
  {
    id: "lying on side",
    name: "Laying On Side",
  },
  {
    id: "prone",
    name: "Prone",
  },
];

const sideModel = ref(props.editableData?.site ? props.editableData?.site : "");
const sideOptions = [
  {
    id: "",
    name: "Select a side",
  },
  {
    id: "L arm",
    name: "Left Arm",
  },
  {
    id: "R arm",
    name: "Right Arm",
  },
  {
    id: "L leg",
    name: "Left Leg",
  },
  {
    id: "R leg",
    name: "Right Leg",
  },
  {
    id: "L wrist",
    name: "Left Wrist",
  },
  {
    id: "R wrist",
    name: "Right wrist",
  },
];

const ageGroupModel = ref(
  props.editableData?.cuffsize ? props.editableData?.cuffsize : ""
);
const ageGroupOptions = [
  {
    id: "",
    name: "Select age group",
  },
  {
    name: "Neonatal",
    id: "neonatal",
  },
  {
    name: "Infant",
    id: "infant",
  },
  {
    name: "Small Pediatric",
    id: "small pediatric",
  },
  {
    name: "Pediatric",
    id: "pediatric",
  },
  {
    name: "Small Adult",
    id: "small adult",
  },
  {
    name: "Large Adult",
    id: "large adult",
  },
  {
    name: "Child Thigh",
    id: "child thigh",
  },
  {
    name: "Adult Thigh",
    id: "adult thigh",
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

// whether vital's info is taken or not

const isPerformingModal = ref(
  props.editableData?.not_performed ? props.editableData?.not_performed : false
);

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");

// Will be used in future
/**  Description: this method calls the vital delete method with input form index to be deleted
 */
const deleteBloodPressure = () => {
  emit("delete-blood-pressure", props.vitalIndex);
};


/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setBloodPressureValues = () => {
  const bloodPressureData = {};

  // add all keys
  bloodPressureData.systole = measureBloodPressureModel.value["systole"];
  bloodPressureData.diastole = measureBloodPressureModel.value["diastole"];
  bloodPressureData.type = positionModel.value;
  bloodPressureData.site = sideModel.value;
  bloodPressureData.cuffsize = ageGroupModel.value;
  bloodPressureData.id = id.value;

  !isPerformingModal.value
    ? (bloodPressureData.not_performed = !isPerformingModal.value)
    : (bloodPressureData.reason = noPerformingModel.value.id);
  bloodPressureData.not_performed = isPerformingModal.value;

  console.log("///ID", bloodPressureData.id);
  emit("set-blood-pressure", bloodPressureData, props.vitalIndex);
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
  bloodPressureForm.value.validate().then((success) => {
    if (success) {
      setBloodPressureValues();
      onSubmit();
    }
  });
};

// Will be used in future
/**  Description: this method validates the vital's input field 
 * 1) Upon Successful validation, It creates another vital input field and sets the vital's data
 */
const validation = () => {
  bloodPressureForm.value.validate().then((success) => {
    if (success) {
      emit("create-blood-pressure");
      setBloodPressureValues();
    }
  });
};


console.log("////EDITABLE DATA/////", props.editableData);
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
