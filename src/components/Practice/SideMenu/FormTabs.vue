<template lang="">
  <div class="left-backgorund full-height col-4 pt-100">
    <h6 class="text-center">Practice Registration Form</h6>
    <!-- Stepper  -->
    <q-stepper
      v-model="stepper"
      vertical
      color="primary"
      animated
      class="flex justify-center"
    >
      <!-- Each step  -->
      <q-step
        v-for="(item, index) in optionArray"
        :key="index + 1"
        :name="index + 1"
        :title="item.label"
        :prefix="index + 1"
        :done="stepper > index + 1"
        doneColor="primary"
        :activeIcon="`img:${item.image}`"
      >
      </q-step>
      <!-- step ends here  -->
    </q-stepper>
    <!-- Stepper ends here  -->
  </div>
</template>
<script setup>
import { defineProps, computed, defineEmits } from "vue";

const props = defineProps({
  optionArray: Array,
  step: Number,
});

defineEmits(["goToStep"]);

const stepper = computed(() => props.step);
</script>

<style lang="scss" scoped>
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

:deep .q-stepper__tab--done {
  .q-stepper__dot {
    background: $primary;
    border: 1px solid $primary;

    span {
      color: $white;
    }
  }
}

:deep .q-stepper__tab--active {
  .q-icon {
    width: 6px;
    height: 9px;
  }
}
</style>
