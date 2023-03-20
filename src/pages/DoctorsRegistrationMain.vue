<template>
  <header class="row justify-between align-center fixed-top q-px-lg q-py-md">
    <q-img :src="logo" style="height: 32px; max-width: 117px" />
    <p class="text-caption q-mb-none">Privacy Policy</p>
  </header>
  <div class="row window-height overflow-hidden full-width">
    <div class="col-md-4 col-lg-3 col-12" id="practice-reg-sidebar">
      <FormTabs :optionArray="optionArray" @goToStep="goToStep" :step="step"></FormTabs>
    </div>

    <div class="right-background overflow-auto window-height col-md-8 col-lg-9 col-12 pt-60" v-if="is_ready">
      <div class="row column justify-start no-wrap q-pa-xl min-height-window"
        :class="$q.screen.lt.md ? 'items-center' : ''">
        <keep-alive>
          <ContactPersonal label="Contact Information Details" subLabel="Provide information about contact details"
            v-if="step === 1" ref="doctor_registration" :object="store.doctorRegistrationFormData.contact_person"
            mainproperty="contact_person"></ContactPersonal>
        </keep-alive>
        <keep-alive>
          <AddressInformation label="Address Information" ref="doctor_registration"
            subLabel="Provide information about Address" v-if="step === 2" mainproperty="address"
            :array="store.doctorRegistrationFormData.address">
          </AddressInformation>
        </keep-alive>
        <keep-alive>
          <LegalInformationVue label="Legal information" subLabel="Provide information about legal information"
            ref="doctor_registration" v-if="step === 3" :object="store.doctorRegistrationFormData.legal_information"
            mainproperty="legal_information"></LegalInformationVue>
        </keep-alive>
        <KeepAlive>
          <ConsentForm ref="doctor_registration" v-if="step === 4"></ConsentForm>
        </KeepAlive>
        <keep-alive>
          <AttachDocument ref="doctor_registration" v-if="step === 5"></AttachDocument>
        </keep-alive>
        <SubmitAndReview :data="store.doctorRegistrationFormData" v-if="step === 6"></SubmitAndReview>
        <!-- <SubmitAndReview
          v-if="step === 6"
          :object="store.doctorRegistrationFormData"
          ref="doctor_registration"
        ></SubmitAndReview> -->
        <SubmittedPractice v-if="step === 7" ref="doctor_registration"></SubmittedPractice>
        <div class="row q-mt-lg" style="max-width: 600px" :class="[
          step > 1 ? 'justify-between' : 'justify-end',
          step > 6 ? 'hidden' : '',
        ]">
          <q-btn flat color="gray-1" class="no-hover" label="back" text-color="primary" @click="backToPrev"
            v-if="step > 1" />
          <q-btn color="primary" :loading="store.isRequesting" :disable="step == 6 ? isSubmitted : false"
            :label="step < 6 ? 'Continue' : 'Submit'" @click="nextStep" class="q-py-sm next-button"
            icon-right="arrow_forward" size="md"></q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
import { useGeneralStore } from "@/store/general";
import { ref, onMounted, computed } from "vue";
import FormTabs from "@/components/Doctor/DoctorsRegistrationForm/SideMenu/FormTabs";
import ContactPersonal from "@/components/Doctor/DoctorsRegistrationForm/ContactPerson/ContactPerson";
import AddressInformation from "@/components/Doctor/DoctorsRegistrationForm/AddressInformation/AddressInformation";
import LegalInformationVue from "@/components/Doctor/DoctorsRegistrationForm/LegalInformation/LegalInformation";
import ConsentForm from "@/components/Doctor/DoctorsRegistrationForm//Consent/ConsentForm";
import AttachDocument from "@/components/Doctor/DoctorsRegistrationForm/Attachment/AttachDocument";
import SubmitAndReview from "@/components/Doctor/DoctorsRegistrationForm/SubmitAndReview/SubmitAndReview";
import SubmittedPractice from "@/components/Doctor/DoctorsRegistrationForm/SubmittedPractice/SubmittedPractice";
import useEmitter from "@/composables/useEmitter";
const is_ready = ref(false);
onMounted(() => {
  emitter.on("update", update);
  store.getDoctorAgreement();
  storeGeneral.getCountryRequest();
  store.getDoctorSpecialization().then(() => {
    store.getDoctorRegistrationData().then(async () => {
      if (
        store.doctorRegistrationFormData.address[0].current_state_id &&
        store.doctorRegistrationFormData.address[0].current_city_id
      ) {
        store.doctor_country_state_country_information.current.current_state =
          await storeGeneral.getStateRequest(
            store.doctorRegistrationFormData.address[0].current_country_id
          );

        store.doctor_country_state_country_information.current.current_city =
          await storeGeneral.getCityRequest(
            store.doctorRegistrationFormData.address[0].current_state_id
          );
      }
      if (
        store.doctorRegistrationFormData.address[1].home_town_state_id &&
        store.doctorRegistrationFormData.address[1].home_town_city_id
      ) {
        store.doctor_country_state_country_information.hometown.hometown_state =
          await storeGeneral.getStateRequest(
            store.doctorRegistrationFormData.address[1].home_town_country_id
          );

        store.doctor_country_state_country_information.hometown.hometown_city =
          await storeGeneral.getCityRequest(
            store.doctorRegistrationFormData.address[1].home_town_state_id
          );
      }
      is_ready.value = true;
    });
  });
});
const store = useDoctorsRegistrationStore();
const storeGeneral = useGeneralStore();
const emitter = useEmitter();
const $q = useQuasar();
const doctor_registration = ref(null);
const step = ref(1);
const logo = require("@/assets/logo1.png");
const isSubmitted = computed(() => {
  return !optionArray.value.slice(0, 5).every(checkAge);
});

const optionArray = ref([
  {
    isError: false,
    isDone: false,
    label: "Contact Information",
    image: require("@/assets/numbers/1.png"),
  },
  {
    isError: false,
    isDone: false,
    label: "Address Information",
    image: require("@/assets/numbers/2.png"),
  },

  {
    isError: false,
    isDone: false,
    label: "Legal Information",
    image: require("@/assets/numbers/3.png"),
  },
  {
    isError: false,
    isDone: false,
    label: "Agreement form",
    image: require("@/assets/numbers/4.png"),
  },
  {
    isError: false,
    isDone: false,
    label: "Attach Documents",
    image: require("@/assets/numbers/5.png"),
  },
  {
    isError: false,
    isDone: false,
    label: "Review and Submit",
    image: require("@/assets/numbers/6.png"),
  },
]);
const nextStep = async () => {
  if (step.value == 4) {
    store.setDoctorAgreement();
  }
  if (step.value != 6) store.requestDoctorDraftRegistrationForm();
  if (step.value == 6) {
    store
      .requestDoctorRegistrationForm()
      .then(() => {

        $q.notify({
          type: "postivie",
          position: "top-right",
          color: "primary",
          avatar: require("@/assets/svg/success-toast-icon.svg"),
          message: "Doctor Created successfully",

        });
        optionArray.value[step.value - 1].isError = false;
        optionArray.value[step.value - 1].isDone = true;
        step.value++;
      })
      .catch((error) => {
        $q.notify({
          color: "red-5",
          position: "top-right",
          textColor: "white",
          icon: "warning",
          message: `Try Again Some Thing Went Wrong : ${error}`,
        });
      });
  } else if (doctor_registration.value.validate) {
    if (doctor_registration.value.validate() === 0) {
      optionArray.value[step.value - 1].isError = false;
      optionArray.value[step.value - 1].isDone = true;
    } else {
      optionArray.value[step.value - 1].isError = true;
      optionArray.value[step.value - 1].isDone = false;
    }

    step.value++;
  } else if (doctor_registration.value.uploadFilecheker) {
    if (doctor_registration.value.uploadFilecheker()) {
      optionArray.value[step.value - 1].isError = false;
      optionArray.value[step.value - 1].isDone = true;
      step.value++;
    } else {
      // $q.notify({
      //   color: "red-5",
      //   textColor: "white",
      //   position: "top-right",
      //   icon: "warning",
      //   message: "Upload all three document document",
      // });
      optionArray.value[step.value - 1].isError = true;
      optionArray.value[step.value - 1].isDone = false;

      step.value++;
    }
  } else {
    doctor_registration.value.form.validate().then((success) => {
      if (success) {
        if (step.value <= optionArray.value.length) {
          optionArray.value[step.value - 1].isError = false;
          optionArray.value[step.value - 1].isDone = true;
          step.value++;
        }
      } else {
        optionArray.value[step.value - 1].isError = true;
        optionArray.value[step.value - 1].isDone = false;
        step.value++;
      }
    });
  }
};
const checkAge = (obj) => {
  return obj.isDone == true;
};
const nextStepByTab = async () => {
  store.requestDoctorDraftRegistrationForm();
  if (doctor_registration.value && doctor_registration.value.validate) {
    if (doctor_registration.value.validate() === 0) {
      optionArray.value[step.value - 1].isError = false;
      optionArray.value[step.value - 1].isDone = true;
    } else {
      optionArray.value[step.value - 1].isError = true;
      optionArray.value[step.value - 1].isDone = false;
      // $q.notify({
      //   color: "red-5",
      //   textColor: "white",
      //   position: "top-right",
      //   icon: "warning",
      //   message: "You need to accept all agreements",
      // });
    }

    step.value++;
  } else if (
    doctor_registration.value &&
    doctor_registration.value.uploadFilecheker
  ) {
    doctor_registration.value.uploadFilecheker();
    if (doctor_registration.value.uploadFilecheker()) {
      optionArray.value[step.value - 1].isError = false;
      optionArray.value[step.value - 1].isDone = true;
    } else {
      // $q.notify({
      //   color: "red-5",
      //   textColor: "white",
      //   position: "top-right",
      //   icon: "warning",
      //   message: "Upload all three document document",
      // });
      optionArray.value[step.value - 1].isError = true;
      optionArray.value[step.value - 1].isDone = false;
    }
  } else {
    if (doctor_registration.value) {
      await doctor_registration.value.form.validate().then((success) => {
        if (success) {
          if (step.value <= optionArray.value.length) {
            optionArray.value[step.value - 1].isError = false;
            optionArray.value[step.value - 1].isDone = true;
          }
        } else {
          optionArray.value[step.value - 1].isError = true;
          optionArray.value[step.value - 1].isDone = false;
        }
      });
    }
  }
};

const backToPrev = () => {
  if (step.value > 1) {
    step.value--;
  }
};

const goToStep = async (index) => {
  await nextStepByTab(step.value);
  step.value = index;
};
const update = () => { };
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
  border: 1px solid #e8ebf6;
  border-radius: 6px;
}

:deep .q-panel.scroll {
  overflow: hidden;
}

:deep .on-right {
  margin-left: 6px;
}

:deep .q-hoverable:hover>.q-focus-helper,
:deep .q-focusable:focus>.q-focus-helper {
  opacity: 0 !important;
}
</style>
