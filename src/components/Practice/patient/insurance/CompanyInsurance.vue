<template lang="">
  <div class="px-40">
    <!-- detail view  -->
    <q-form
      ref="form"
      v-for="(insurance, index) in data"
      :key="index"
      :class="[index > 0 ? 'mt-10' : '']"
    >
      <div class="row justify-between">
        <h2 class="text-h6">{{ insurance.company }} &nbsp;</h2>
        <div v-if="index < 1">
          <q-btn
            color="light-green"
            text-color="primary"
            unelevated
            icon="add"
            size="md"
            label="Add Insurance Provider"
            no-caps
            @click="$emit('show-dialog', true)"
          />
        </div>
      </div>
      <div class="row mt-20">
        <div
          class="col-md-6 col-12 row mb-0"
          v-for="(field, d) in section"
          :key="d"
        >
          <div class="col-sm-5 col-xs-6">
            <label class="text-weight-bold">{{ field.label }}:</label>
          </div>
          <div class="col-sm-6 col-xs-6">
            <p v-if="field.value in data && field.helper">
              {{ getName(insurance[d], field.helper) }}{{ field.append ? field.append : null }}
            </p>
            <p v-else-if="field.value in insurance">
              {{ insurance[field.value] }}{{ field.append ? field.append : null }}
            </p>
            <p v-else></p>
          </div>
        </div>
      </div>
    </q-form>
    <!-- detail view  -->
  </div>
</template>
<script setup>
import { defineProps, computed, ref, defineEmits } from "vue";
import { usePracticeStore } from "@/store/practice";

const practiceStore = usePracticeStore();
const props = defineProps({
  company: {
    type: Object,
    default: () => {},
  },
});

defineEmits(["show-dialog"]);

const data = computed(() =>
  practiceStore.currentPatient.insurance.data.filter((i) => {
    return i.company == props.company.name;
  })
); // getting insurance related to company

const section = ref([
  {
    label: "Insurance name",
    value: "insurance_name",
  },
  {
    label: "Company",
    value: "company",
  },
  {
    label: "Percentage",
    value: "percentage",
    append: '%',
  },
  {
    label: "Amount",
    value: "amount",
    append: ' DH'
  },
]);
</script>
<style lang="scss" scoped>
:deep .on-left {
  margin-right: 3px;
}
</style>
