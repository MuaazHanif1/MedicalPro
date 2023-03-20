<template>
  <div>
    <q-card class="my-card row justify-center items-center">
      <div class="row no-wrap">
        <div class="col-2">
          <q-img :src="icons" width="32px" height="32px" />
        </div>
        <div class="col-10">
          <q-card-section class="q-pa-none text-capitalize">
            {{ calendarName }}
          </q-card-section>
          <p class="my-card-text mt-7">
            {{ `integrate ${calendarName} calendar into your project.` }}
          </p>
          <q-btn
            color="card-button-padding"
            :class="[connected ? 'connected-button' : 'connect-button']"
            :label="connected ? 'connected' : 'connect'"
            class="text-capitalize"
            :loading="isLoading"
            @click.stop="
              $emit('button-click', {
                iconType: calendarName,
                isAlreadyConnected: connected,
              })
            "
          />
          <p class="my-card-text" v-show="conncetedEmail">
            with <strong class="connected-email">{{ conncetedEmail }}</strong>
          </p>
        </div>
      </div>
    </q-card>
  </div>
</template>
<script setup>
import google from "@/assets/svg/googlecalendar.svg";
import outlook from "@/assets/svg/outlookcalendar.svg";
import { computed, defineProps, defineEmits } from "vue";
defineEmits(["button-click"]);
const props = defineProps({
  calendarName: {
    type: String,
    default: "google",
  },
  connected: {
    type: Boolean,
    default: false,
  },
  icon: {
    type: String,
    default: "google",
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  conncetedEmail: {
    type: String,
    default: "",
  },
});
const icons = computed(() => {
  return props.calendarName == "google" ? google : outlook;
});
</script>
<style lang="scss" scoped>
.my-card {
  width: 100%;
  max-width: 276px;
  height: 200px;
  padding: 15px 24px 15px 14px;
  background: #fdfdfe;
  border-radius: 8px;
  border: 1.07767px solid #f2f2f4;
  box-shadow: none;
  .my-card-heading {
    font-weight: 600;
    font-size: 16px;
    line-height: 19px;
    text-transform: capitalize;
    color: $dark-gray;
  }

  .my-card-text {
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    color: $text-2;
  }
  .connected-email {
    color: $appointmentButtonText;
  }

  // .card-button-padding {
  //     padding: 4px 35px
  // }
  .connect-button {
    background-color: #edf0f7;
    color: $appointmentButtonText !important;
  }

  .connected-button {
    background-color: $appointmentButtonText !important;
    color: #ffffff;
  }
}

:deep(.q-btn) {
  padding: 4px 35px;
}
</style>
