<template>
  <div class="">
    <header class="row justify-between align-center fixed-top q-px-lg q-py-md">
      <q-img :src="logo" style="height: 16.7px; max-width: 140px; margin-left: 16px;"  />
      <p class="text-caption q-mb-none">Privacy Policy</p>
    </header>
    <!-- Header End Here  -->

    <!-- Content  -->
    <div class="row window-height overflow-hidden full-width">
      <!-- Sidebar   -->
      <div class="col-md-4 col-lg-3 col-12" id="practice-reg-sidebar">
        <FormTabs :optionArray="optionArray" @goToStep="goToStep" :step="step"></FormTabs>
      </div>
      <!-- Sidebar Ends Here  -->

      <!-- Main Content  -->

      <div class="right-background overflow-auto window-height col-md-8 col-lg-9 col-12 pt-60">
        <div class="row column justify-start no-wrap q-pa-xl min-height-window"
          :class="$q.screen.lt.md ? 'items-center' : ''">
          <!-- Contact Person Component  -->
          <keep-alive>
            <ContactPersonal v-if="step === 1" ref="contact_form"
              :array="store.practiceRegistrationFormData.contact_person" mainproperty="contact_person">
            </ContactPersonal>
          </keep-alive>

          <!-- Address Component  -->

          <keep-alive>
            <AddressInformation label="Address information" ref="contact_form"
              subLabel="Provide information about address" v-if="step === 2"
              :object="store.practiceRegistrationFormData.address" mainproperty="address">
            </AddressInformation>
          </keep-alive>

          <!-- Billing Component  -->
          <keep-alive>
            <BillingInformation label="Billing Information" subLabel="Provide information about billing address"
              ref="contact_form" v-if="step === 3" :object="store.practiceRegistrationFormData.billing"
              mainproperty="billing"></BillingInformation>
          </keep-alive>

          <!-- Legal Information Component  -->
          <keep-alive>
            <LegalInformationVue label="Legal Information" subLabel="Provide information about legal information"
              ref="contact_form" v-if="step === 4" :object="store.practiceRegistrationFormData.legal_information"
              mainproperty="legal_information"></LegalInformationVue>
          </keep-alive>

          <!-- Consent Form Component  -->
          <KeepAlive>
            <ConsentForm ref="contact_form" v-if="step === 5"></ConsentForm>
          </KeepAlive>

          <!-- Attach Document Component  -->
          <keep-alive>
            <AttachDocument ref="contact_form" v-if="step === 6"></AttachDocument>
          </keep-alive>

          <!-- Summary  -->
          <SubmitAndReview v-if="step === 7" :data="store.practiceRegistrationFormData" ref="contact_form">
          </SubmitAndReview>

          <!-- Form Submit Component  -->
          <SubmittedPractice v-if="step === 8" ref="contact_form"></SubmittedPractice>

          <!-- Navigation buttons  -->
          <div class="row q-mt-lg" :class="[
            step > 1 ? 'justify-between' : 'justify-end',
            $q.screen.lt.sm ? 'full-width' : '',
            step > 7 ? 'hidden' : '',
          ]" style="max-width: 600px">
            <q-btn flat color="gray-1" class="no-hover" label="Back" padding="0px" no-caps="" @click="backToPrev"
              v-if="step > 1" size="md" />
            <q-btn color="primary" :label="step < 7 ? 'Continue' : 'Submit'" @click="nextStep" class="q-py-sm"
              icon-right="arrow_forward" size="md"></q-btn>
          </div>
          <!-- Navigation Buttons Ends Here  -->
        </div>
      </div>
      <!-- Main Content Ends Here  -->
    </div>
    <!-- Content Ends Here  -->
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { usePracticeStore } from "@/store/practice";
import { ref } from "vue";

import AddressInformation from "@/components/Practice/AddressInformation/AddressInformation.vue";
import ContactPersonal from "@/components/Practice/ContactPerson/ContactPersonal.vue";
import LegalInformationVue from "@/components/Practice/LegalInformation/LegalInformation.vue";
import FormTabs from "@/components/Practice/SideMenu/FormTabs";
import ConsentForm from "@/components/Practice/Consent/ConsentForm";
import BillingInformation from "@/components/Practice/BillingInformation/BillingInformation.vue";
import SubmitAndReview from "@/components/Practice/SubmitAndReview/SubmitAndReview.vue";
import SubmittedPractice from "@/components/Practice/SubmittedPractice/SubmittedPractice.vue";
import AttachDocument from "@/components/Practice/Attachment/AttachDocument.vue";
import { useRoute } from "vue-router";
//mport useEmitter from "@/composables/useEmitter";

const store = usePracticeStore();
const $q = useQuasar();
const contact_form = ref(null);
const step = ref(1);
const route = useRoute();
const logo = require("@/assets/logo1.png");
const optionArray = ref([
  {
    label: "Contact Person",
    image: require("@/assets/numbers/1.png"),
  },
  {
    label: "Address Information",
    image: require("@/assets/numbers/2.png"),
  },
  {
    label: "Billing Information",
    image: require("@/assets/numbers/3.png"),
  },
  {
    label: "Legal Information",
    image: require("@/assets/numbers/4.png"),
  },
  {
    label: "Consent Form",
    image: require("@/assets/numbers/5.png"),
  },
  {
    label: "Attach Documents",
    image: require("@/assets/numbers/6.png"),
  },
  {
    label: "Review and Submit",
    image: require("@/assets/numbers/7.png"),
  },
]);

// Function for next step and validation
const nextStep = async () => {
  if (step.value == 7) {
    await store.createPracticeFormData(route.params.id).then(() => {
      $q.notify({
        type: "postivie",
        position: "top-right",
        color: "primary",
        avatar: require("@/assets/svg/success-toast-icon.svg"),
        message: "Request Accepted",
      });
      step.value++;
    }).catch(() => {
      $q.notify({
        color: "red-5",
        textColor: "white",
        position: "top-right",

        icon: "warning",
        message: "Request Rejected",
      });
    })
  }
  if (contact_form.value.validate) {
    contact_form.value.validate()
      ? $q.notify({
        color: "red-5",
        textColor: "white",
        position: "top-right",
        icon: "warning",
        message: "You need to accept all agreements",
      })
      : step.value++;
  } else if (contact_form.value.filesToUpload) {
    contact_form.value.filesToUpload.length
      ? step.value++
      : $q.notify({
        color: "red-5",
        textColor: "white",
        position: "top-right",

        icon: "warning",
        message: "Upload minimum one document",
      });
  } else {
    contact_form.value.form.validate().then((success) => {
      if (success) {
        // yay, models are correct
        if (step.value <= optionArray.value.length) {
          step.value++;
        }
      }
    });
  }
};

// previouse step
const backToPrev = () => {
  if (step.value > 1) {
    step.value--;
  }
};

// sidebar navigation
const goToStep = (index) => {
  step.value = index;
};
</script>

<style lang="scss" scoped>
#practice-reg-sidebar {
  @media (max-width: $breakpoint-sm-max) {
    display: none;
  }
}

.width {
  width: 100%;
}

.height {
  height: 100vh;
}

.right-background {
  background: #ffffff;
}

.left-backgorund {
  background: #e5e5e5;
}

.q-mt-xl {
  margin-top: 150px !important;
}

:deep .q-option-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

:deep .left-backgorund {
  display: flex;
  flex-direction: column;
  justify-content: start;
}

.next-button {
  margin-right: 60px;
}

:deep .q-panel.scroll {
  overflow: hidden;
}

:deep .q-hoverable:hover>.q-focus-helper,
:deep .q-focusable:focus>.q-focus-helper {
  opacity: 0 !important;
}

:deep .q-icon.on-right {
  margin-left: 4px;
}
</style>
