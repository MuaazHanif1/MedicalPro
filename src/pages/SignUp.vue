<template>
  <div class="login-main">
    <div class="row login-header">
      <q-img
        :src="logo"
        style="height: 16.7px; max-width: 140px; margin-left: 16px"
      />
      <!-- <p>Having trouble? Get Help</p> -->
    </div>
    <div :class="$q.screen.width < 790 ? 'row login pt-0' : 'row login '">
      <div class="col-md-5 gt-sm left-panel col-12">
        <div class="login-section-left">
          <div class="title">
            Lorem ipsum dolor sit ameto consect adipiscing elit sed eiusme
            tempor.
          </div>
          <div class="description">
            Lorem ipsum dolor sit amet consect adipisce aliqua elit sed eiusmod
            tempor incididunt ut labore et dolore.
          </div>
        </div>
        <q-img
          class="left-panel-bottom-image"
          :src="require('@/assets/svg/left-panel-elipse.png')"
        />
      </div>
      <div class="col-md-1 gt-sm"></div>
      <div class="col-md-6 col-sm-8 col-xs-10 right-side-panel col-12">
        <q-form ref="registerForm" class="row patient-registration">
          <div class="col-md-6 col-sm-8 col-xs-10" v-if="step == 1">
            <div class="phone-verification">
              <div class="section-title">Phone verification</div>
              <FormInput
                :inputType="'text'"
                :label="'Verify phone number'"
                v-model="verification_code"
                :rules="[rules.required]"
                :placeHolder="'Add 6 digit code'"
              >
              </FormInput>
            </div>
          </div>
          <div class="col-md-11" v-if="step == 2">
            <div class="section-title">Basic information</div>
            <div class="section-subtitle">
              Please provide your basic information
            </div>
            <div class="row basis-information">
              <div class="col-md-10 col-xs-12">
                <label
                  class="q-mb-sm phone-number-label d-block q-pt-none text-caption text-grey-9"
                  >Phone number</label
                >
                <CountryPhone
                  v-model="registration.phone_number"
                  :is_disabled="false"
                  :defaultCountry="registration.country_code || '+92'"
                  @selected-country="
                    (code) => (registration.country_code = `+${code.dialCode}`)
                  "
                  :vRules="[rules.required]"
                ></CountryPhone>
              </div>
              <div class="col-md-5 col-xs-12">
                <FormInput
                  :inputType="'text'"
                  :label="'First name'"
                  v-model="registration.first_name"
                  :rules="[rules.required]"
                  :placeHolder="'First name'"
                >
                </FormInput>
              </div>
              <div class="col-md-5 col-xs-12">
                <FormInput
                  :inputType="'text'"
                  :label="'Middle name'"
                  v-model="registration.middle_name"
                  :placeHolder="'Middle name'"
                >
                </FormInput>
              </div>
              <div class="col-md-5 col-xs-12">
                <FormInput
                  :inputType="'text'"
                  :label="'Last name'"
                  v-model="registration.last_name"
                  :rules="[rules.required]"
                  :placeHolder="'Last name'"
                >
                </FormInput>
              </div>
              <div class="col-md-5 col-xs-12">
                <FormInput
                  v-model="registration.gender"
                  placeHolder="Select gender"
                  label="Gender"
                  inputType="select"
                  :tooltipText="''
                  "
                  :isInput="false"
                  :option="enums.gender2"
                  :optionvalue="'id'
                  "
                  :optionlabel="'name'
                  "
                  @dropdown-value-change="
                    dropdownHelper($event, add_field.key),
                      resetField(add_field.value)
                  "
                  :rules="[rules.required]"
                  :reactive_rules="[]"
                ></FormInput>
                <!-- [
                    'Male',
                    'Female',
                    'Transgender',
                    'Prefer not to say',
                    'Other',
                  ] -->
              </div>
              <div class="col-md-5 col-xs-12">
                <FormInput
                  :label="'Date of birth'"
                  :placeHolder="'Enter date'"
                  :max="current_date"
                  :inputType="'date'"
                  v-model="registration.dob"
                  :rules="[rules.required]"
                >
                </FormInput>
              </div>
              <div class="col-md-5 col-xs-12">
                <FormInput
                  :label="'Email address'"
                  :placeHolder="'Enter email'"
                  v-model="registration.email"
                  :rules="[rules.required, rules.email]"
                >
                </FormInput>
              </div>
            </div>
          </div>
          <div class="col-md-8 col-xs-10" v-if="step == 3">
            <div class="phone-verification password-reset">
              <div class="section-title">Reset password</div>
              <div class="section-subtitle">Please enter your password</div>
              <FormInput
                :isPassword="true"
                @show-password="showPassword"
                :inputType="passwordInputType"
                :label="'New password'"
                v-model="password"
                :placeHolder="'Enter password'"
                :rules="[rules.required, rules.password_length]"
              >
              </FormInput>
              <FormInput
                :isPassword="true"
                @show-password="showConfirmPassword"
                :inputType="confirmPasswordInputTtype"
                :label="'Re-enter new password'"
                v-model="confirm_password"
                :placeHolder="'Enter password'"
                :rules="[rules.required, rules.password_length]"
              >
              </FormInput>
            </div>
          </div>
          <div
            :class="
              step == 1
                ? 'col-md-7 col-sm-12 col-xs-12'
                : step == 2
                ? 'col-md-9'
                : 'col-md-8 col-xs-10'
            "
            class="action"
          >
            <div class="cancel" @click="changeStep()" v-if="true">
              {{ step == 2 ? "Back to login" : "Back" }}
            </div>
            <q-btn
              label="Continue"
              class="con-btn"
              @click="save"
              :loading="loading"
              v-if="step < 4"
              color="primary"
            ></q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import FormInput from "@/partials/FormInput.vue";
import CountryPhone from "@/partials/CountryPhone.vue";
import { date } from "quasar";
import { useUserStore } from "@/store/user";
import { usePatientStore } from "@/store/patient";
import { useRouter } from "vue-router";
import notify from "@/composables/notify";
import enums from "@/composables/enums.js";

const logo = require("@/assets/logo1.png");
const step = ref(0);
const registerForm = ref([]);
const verification_code = ref("");
const passwordInputType = ref("password");
const confirmPasswordInputTtype = ref("password");
const password = ref("");
const confirm_password = ref("");
const userStore = useUserStore();
const patientStore = usePatientStore();
const router = useRouter();
const loading = ref(false);
const goToLogin = ref(false);

const registration = ref({
  first_name: "",
  last_name: "",
  patient_key: "",
});

const changeStep = () => {
  if (step.value == 2) {
    router.push({ name: "login" });
  } else if (step.value == 1) {
    if (!goToLogin.value) {
      step.value = 2;
      userStore.registeringUserPhone.phone_number = "";
      userStore.registeringUserPhone.country_code = "";
    } else {
      router.push({ name: "login" });
    }
  } else {
    step.value--;
  }
};
onMounted(() => {
  if (!userStore.$state.registeringUserPhone.phone_number) {
    // router.push({ name: "login" });
    step.value = 2;
  } else {
    step.value = 1;
    goToLogin.value = true;
    registration.value = userStore.registeringUser
      ? userStore.registeringUser
      : {};
  }
});

let newDate = date.formatDate(Date.now(), "YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate, "YYYY/MM/DD");

const showPassword = (showPassword) => {
  if (showPassword) {
    passwordInputType.value = "text";
  } else {
    passwordInputType.value = "password";
  }
};
const showConfirmPassword = (showPassword) => {
  if (showPassword) {
    confirmPasswordInputTtype.value = "text";
  } else {
    confirmPasswordInputTtype.value = "password";
  }
};

const save = () => {
  registerForm.value.validate().then(async (success) => {
    if (success) {
      console.log({...userStore.$state.registeringUserPhone})
      loading.value = true;
      if (step.value == 1) {
        //console.log(...userStore.$state.registeringUserPhone)
        const response = await patientStore.verifyVerificationCode({
          ...userStore.$state.registeringUserPhone,
          verified_code: verification_code.value,
        });
        loading.value = false;
        if (response.data) {
          step.value = 3;
          return;
        } else {
          notify("Invalid code or something went wrong", "negative");
          return;
        }
      }
      if (step.value == 2) {
        const response = await patientStore.registerPatient({
          ...userStore.$state.registeringUserPhone,
          ...registration.value,
        });
        loading.value = false;
        if (response.data) {
          userStore.registeringUser = registration.value;
          userStore.registeringUserPhone.phone_number =
            userStore.registeringUser.phone_number;
          userStore.registeringUserPhone.country_code =
            userStore.registeringUser.country_code;
          step.value = 1;
          return;
        }
      }
      if (step.value == 3) {
        if (password.value == confirm_password.value) {
          const response = await patientStore.resetPatientPassword({
            ...userStore.$state.registeringUserPhone,
            password: password.value,
            confirm_password: confirm_password.value,
          });
          loading.value = false;
          if (response.data.is_password_reset) {
            userStore
              .Login(
                {
                  phone_number:
                    userStore.$state.registeringUserPhone.phone_number,
                  password: password.value,
                  country_code: userStore.$state.registeringUserPhone.country_code,
                },
                "patient/login"
              )
              .then((response) => {
                if (response.data) {
                  notify("Login successfully", "primary");
                  userStore.$state.loginUser = response.data;
                  userStore.$state.loginUser.role = "patient";

                  userStore.registeringUser = {};
                  userStore.registeringUserPhone.phone_number = "";
                  userStore.registeringUserPhone.country_code = "";
                  router.push({ name: "dashboard" });
                }
              })
              .catch((error) => {
                console.log(error);
              });
          }
        } else {
          notify("Password mismatch", "negative");
        }
      }
    }
    loading.value = false;
  });
};
</script>
<style scoped lang="scss">
.login-main {
  background: white;
}

:deep(.left-panel) {
  background: url("@/assets/svg/left-panel-background.svg");
  height: 100vh;
  display: grid;
  position: relative;
}
:deep(.left-panel-bottom-image) {
  position: absolute;
  height: 300px;
  width: 300px;
  right: 0;
  bottom: 0;
}
:deep(.title) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 22px;
  line-height: 32px;
  text-transform: capitalize;
  color: #0d0c22;
}

:deep(.description) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  line-height: 26px;
  color: #505050;
}

:deep(.vertical-center) {
  position: absolute;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  width: 100%;
}

:deep(.login-section) {
  background: white;
  width: 500px;
  box-shadow: 0px 3px 20px rgba(223, 224, 225, 0.3);
  border-radius: 10px;
  padding: 55px 55px 75px 55px;
}

:deep(.login-section h3) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 24px;
  line-height: 29px;
  color: #0d0c22;
  text-align: center;
}

:deep(.login-section p) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 12px;
  color: #505050;
  text-align: center;
  margin-bottom: 40px;
}

:deep(.login-section .q-btn) {
  height: 50px;
  width: 100%;
  margin-top: 20px;
  padding: 14px 24px;
  gap: 10px;
  box-shadow: 0px 3px 12px #f1f1f5;
  border-radius: 8px;

  .q-btn__content {
    height: 17px;
    font-family: "Lato";
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
    color: #ffffff;
    text-transform: capitalize;
  }
}

:deep(.login-section .q-field__control) {
  height: 46px;
  margin-bottom: 18px;
}

:deep(.login-section-left) {
  position: absolute;
  top: 196px;
  z-index: 1;
  padding: 0px 107px 0px 64px;
}

:deep(.login-header) {
  padding: 29px;
  position: fixed;
  width: 100%;
  top: 0px;
  justify-content: space-between;
}

:deep(.login-header p) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 12px;
  color: #505050;
}

:deep(.remember-forgot) {
  display: flex;
  justify-content: space-between;
}

:deep(.remember-forgot .forgot-password) {
  margin-top: 15px;
}

:deep(.login) {
  width: 100%;
  height: 100vh;
  justify-content: center;
  overflow: hidden;
}

:deep(.pt-100) {
  padding-top: 100px;
}
::v-deep .q-stepper {
  box-shadow: none;
  border-radius: 0px;
  background: transparent;
}

::v-deep .q-stepper--vertical .q-stepper__dot:after,
::v-deep .q-stepper--vertical .q-stepper__dot:before {
  background: transparent;
  border-left: 1px dashed $gray;
}

::v-deep .q-stepper__dot {
  background: transparent;
  border: 1px solid $gray;

  span {
    color: $gray;
  }
}

::v-deep .q-stepper__tab--done {
  .q-stepper__dot {
    background: $primary;
    border: 1px solid $primary;

    span {
      color: $white;
    }
  }
}

::v-deep .q-stepper__tab--active {
  .q-icon {
    width: 6px;
    height: 9px;
  }
}
:deep(.section-title) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 24px;
  color: #0d0c22;
  margin-bottom: 12px;
}
:deep(.section-subtitle) {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 12px;
  text-transform: inherit;
  margin-bottom: 25px;
  color: #7d8693;
}
:deep(.patient-registration .action) {
  display: flex;
  justify-content: space-between;
  .q-btn {
    background: $primary;
    border: 1px solid #e8ebf6;
    border-radius: 6px;
    height: 44px;
    margin-top: 10px;
  }
  .cancel {
    font-family: "Inter";
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 12px;
    text-transform: capitalize;
    color: #2a6049;
    margin-top: 25px;
    cursor: pointer;
  }
}
:deep(.basis-information .q-field) {
  margin-right: 20px;
  margin-bottom: 10px;
}
:deep(.right-side-panel) {
  position: relative;
  top: 196px;
}
:deep(.password-reset .custom-input-selector) {
  margin-top: 10px;
}
@media (max-width: 736px) {
  .right-side-panel {
    margin-left: 20px;
  }
}
.con-btn {
  text-transform: capitalize;
}
</style>
