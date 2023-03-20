<template lang="">
  <div>
    <div class="row justify-between">
      <!-- Appointment Heading with view  -->
      <h2 class="text-h6" :style="$q.screen.lt.sm ? 'order: 1' : ''">
        {{ heading_date }} &nbsp;
        <router-link :to="{ name: 'appointment-detail', params: { id: appointment.id } }">
          <q-btn
            class="px-9 mr-10"
            size="sm"
            unelevated
            color="light-green"
            text-color="primary"
            label="View Appointment"
            square
            no-caps
            @click="() => (editable = true)"
          >
          </q-btn>
        </router-link>
      </h2>
      <!-- Appointment Heading with view ends here  -->
      <div v-if="index == 0" class="row">
        <q-input
          :class="$q.screen.lt.md  ? 'col-12': 'mr-10'"
          outlined
          :modelValue="modelValue"
          @update:modelValue="$emit('update:modelValue', $event)"
          @keyup.enter="$emit('search-by-id', appointment_id)"
          :dense="true"
          placeholder="Appointment ID"
          autofocus
        />
        <!-- Year change  -->
        <q-btn-dropdown
          :class="[$q.screen.lt.md ? 'mt-10 mb-20' : '', $q.screen.lt.md  ? 'col-12': '']"
          class="px-10 py-0"
          color="light-green"
          text-color="primary"
          unelevated
          icon="calendar_month"
          size="md"
          label="Select Year"
          no-caps
          @click="$emit('add-dialog', !add)"
          style="height: 40px"
        >
          <q-list>
            <q-item
              clickable
              v-close-popup
              @click="$emit('year-change', index + 2019)"
              v-for="index in 31"
              :key="index"
            >
              <q-item-section>
                <q-item-label>{{ index + 2019 }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <!-- Year change  -->
      </div>
    </div>
    <!-- Appointment Detail  -->
    <div class="row mt-20 pb-15">
      <div
        class="col-md-6 col-12 row mb-15"
        v-for="(field, index) in details"
        :key="index"
      >
        <div class="col-sm-5 col-xs-6">
          <label class="text-weight-bold">{{ field.label }}:</label>
        </div>
        <div class="col-sm-6 col-xs-6">
          <p class="mb-0" v-if="field.value in appointment && field.helper">
            {{ getName(appointment[field.value], field.helper) }}
          </p>
          <p class="mb-0" v-else-if="field.nested_object">
            {{
              appointment[field.nested_object]
                ? appointment[field.nested_object][field.nested_key]
                : ""
            }}
          </p>
          <p class="mb-0" v-else-if="field.format">
            {{ $filters.formatDate(`${appointment[field.value]} ${appointment['start_time']}`, field.format) }}
          </p>
          <p class="mb-0" v-else-if="field.value in appointment">
            {{ appointment[field.value] }}
          </p>
          <p v-else></p>
        </div>
      </div>
    </div>
    <!-- Appointment Detail  -->
    <q-separator inset />
  </div>
</template>
<script setup>
import { defineProps, ref, defineEmits } from "vue";
import moment from "moment";

defineEmits(["update:modelValue", "search-by-id", "year-change"]); //Event Emits
const props = defineProps({
  appointment: {
    type: Object,
    default: () => {},
  },
  index: {
    type: Number,
  },
  modelValue: String,
});

// Detail view loop over 
const details = [
  {
    label: "Doctor name",
    value: "",
    nested_object: "doctor",
    nested_key: "first_name",
  },
  {
    label: "Date/Time",
    value: "date",
    format: "DD-MM-YYYY hh:mm A",
  },
  {
    label: "Appointment ID",
    value: "appointment_key",
  },
  //   {
  //     label: "Last Visit",
  //     value: "",
  //   },
  {
    label: "Status",
    value: "status",
  },
];

const appointment_id = ref(null);
const heading_date = moment(props.appointment.date).format(
  "DD MMM YYYY - dddd"
);
</script>
<style lang="scss" scoped>
:deep .q-field__control {
  height: 40px !important;
}
:deep .q-item {
  min-height: 40px !important;
}
</style>
