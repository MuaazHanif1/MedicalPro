<template>
  <div class="column">
    <span class="row mb-10">
      <h6>Inhaled O2 Concentration</h6>
    </span>

    <q-form ref="inhaledOForm">
      <div class="row flex items-center">
        <div class="column custom-input-selector mb-0 flex col-sm-6 col-12">
          <span class="q-mb-sm input-label">Inhaled O2 conc.</span>
          <q-input :class="$q.screen.lt.sm ? 'pr-0' : 'pr-10'" outlined :dense="true" placeHolder="O2 levels"
            v-model="measureinhaledOModel" :disable="isPerformingModal" :rules="[rules.required, rules.number]"
            class="pb-0">
            <template v-slot:append>
              <div class="flex">
                <span class="border-input-field"></span>
                <span class="font-small pl-10">
                  <q-icon name="percent"></q-icon>
                </span>
              </div>
            </template>
          </q-input>
        </div>
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

const emit = defineEmits(["set-inhaled-o-pressure", "on-submit"]);

const inhaledOForm = ref(null);

const measureinhaledOModel = ref(
  props.editableData?.inhaled_o2_concentration_vital
    ? props.editableData?.inhaled_o2_concentration_vital
    : null
);

// ID used for updating the object
const id = ref(props.editableData?.id ? props.editableData?.id : "");


/**  Description: this method adds all the enums keys required by the backend
 * 1) If the vital's info wasn't taken then not_performed key is assigned with a reason (why that vital's info wasn't taken)
 */
const setInhaledO2Values = () => {
  const inhaledO2Data = {};
  inhaledO2Data.inhaled_o2_concentration_vital = measureinhaledOModel.value;
  inhaledO2Data.id = id.value;
  emit("set-inhaled-o-pressure", inhaledO2Data);
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
  inhaledOForm.value.validate().then((success) => {
    if (success) {
      setInhaledO2Values();
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

