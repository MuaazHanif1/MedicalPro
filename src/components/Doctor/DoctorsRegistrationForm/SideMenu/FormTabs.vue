<template lang="">
  <div class="left-backgorund full-height col-4 pt-100">
    <h6 class="text-center">Doctors Registration Form</h6>
    <q-stepper
      v-model="stepper"
      vertical
      header-nav
      color="primary"
      animated
      class="flex justify-center"
      @update:model-value="$emit('goToStep', $event)"
      :greedy="true"
    >
      <q-step
        v-for="(item, index) in optionArray"
        :key="index + 1"
        :name="index + 1"
        :error="item.isError"
        error-color="$primary"
        :title="item.label"
        :prefix="index + 1"
        :done="item.isDone"
        doneColor="primary"
        :activeIcon="`img:${item.image}`"
      >
      </q-step>
    </q-stepper>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";

const props = defineProps({
  optionArray: Array,
  step: Number,
});

defineEmits(["goToStep"]);

const stepper = ref(props.step);
watch(
  () => props.step,
  (newVal) => {
    stepper.value = newVal;
  }
);
</script>

<style lang="scss" scoped>
//border: 1px solid #808192;
:deep .q-stepper {
  box-shadow: none;
  border-radius: 0px;
  background: transparent;
}
:deep .q-stepper--vertical .q-stepper__dot:after,
:deep .q-stepper--vertical .q-stepper__dot:before {
  background: transparent;
  border-left: 1px dashed $gray;
}
:deep .q-stepper__dot {
  background: transparent;
  border: 1px solid $gray;

  span {
    color: $gray;
  }
}
:deep .q-stepper__tab--error {
  .q-stepper__dot {
    i {
      color: $red-9;
      font-size: 15px !important;
      //border: 1px solid $red-9; //q-stepper__label
    }
  }
}

:deep .q-stepper__tab--error {
  .q-stepper__label {
    color: $primary;
  }
}
:deep .q-stepper__tab--done {
  .q-stepper__dot {
    background: $primary;
    border: 1px solid $primary;

    span {
      color: $white;
    }
  }
}
:deep .q-stepper__tab--active .q-stepper__dot {
  background: none !important;
}

:deep .q-stepper__tab--active {
  .q-icon {
    width: 6px;
    height: 9px;
  }
}
</style>
