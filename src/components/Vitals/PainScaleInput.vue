<template>
  <!-- divider -->
  <div class="column">
    <span class="row mb-10">
      <h6>Pain</h6>
      <span class="medium-font" @click="deletePain" v-if="vitalIndex !== 0">
        <q-icon class="color-green cursor-pointer" name="delete"></q-icon>
      </span>
    </span>

    <q-form ref="painForm">
      <div class="row flex items-center">
        <!-- pain -->
        <div class=" column flex col-sm-6 col-12 self-end">
          <span class="q-mb-sm input-label">Pain Scale</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0 mb-10' : 'pr-10'" outlined :dense="true" placeHolder="pain"
            v-model="painScaleModel" :rules="[rules.required, rules.number]" class="pb-0"></q-input>
        </div>
        <!-- note  -->
        <div class=" column flex col-sm-6 col-12 self-end">
          <span class="q-mb-sm input-label">Note</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0 ' : ''" outlined :dense="true" placeHolder="note" v-model="noteModel"
            class="pb-0"></q-input>
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

const emit = defineEmits([
  "set-pain",
  "delete-pain",
  "create-pain",
  "on-submit",
]);
const painForm = ref(null);

const noteModel = ref(
  props.editableData?.notes ? props.editableData?.notes : "",
);

const painScaleModel = ref(
  props.editableData?.pain_scale_vital
    ? props.editableData?.pain_scale_vital
    : ""
);

// Will be used in future
/**  Description: this method calls the vital delete method with input form index to be deleted
 */
const deletePain = () => {
  emit("delete-pain", props.vitalIndex);
};
// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");

/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setPainValues = () => {
  emit(
    "set-pain",
    {
      pain_scale_vital: painScaleModel.value,
      notes: noteModel.value,
      id: id.value,
    },
    props.vitalIndex
  );
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
  painForm.value.validate().then((success) => {
    if (success) {
      setPainValues();
      onSubmit();
    }
  });
};

// Will be used in future
/**  Description: this method validates the vital's input field 
 * 1) Upon Successful validation, It creates another vital input field and sets the vital's data
 */
const validation = () => {
  painForm.value.validate().then((success) => {
    if (success) {
      emit("create-pain");
      setPainValues();
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
