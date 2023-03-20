<template>
  <div class="login-main">
    <q-img class="elipse" :src="elipse" />
    <div class="row login-header">
      <q-img
        :src="logo"
        style="height: 16.7px; max-width: 140px; margin-left: 16px"
      />
      <!-- <p>Having trouble? Get Help</p> -->
    </div>
    <div :class="$q.screen.width < 790 ? 'row login pt-100' : 'row login '">
      <div class="col-md-4 gt-sm">
        <div class="login-section-left">
          <div class="title">iCare Pro</div>
          <div class="description">
            iCarePro is one of the best EMRs/EHRs in the market. Our goal is to
            provide clinicians and patients the support they're looking for with
            structured, flexible experiences that work the way they do. Our
            user-oriented system can help accelerate your entire revenue cycle
            and maximize your financial outcomes.
          </div>
        </div>
      </div>
      <div class="col-md-5 offset-md-1 col-xs-11 login-div">
        <div class="login-section">
          <h3>Login To Continue</h3>
          <p>Enter your credentials to access your account.</p>
          <q-form ref="loginForm">
            <CountryPhone
              v-model="login.phone_number"
              @selected-country="
                (code) => (login.country_code = `+${code.dialCode}`)
              "
              :vRules="[rules.required]"
              :is_disabled="patient_exists"
            ></CountryPhone>
            <!-- <PhoneInput v-model="login.phone_number" @selected-country="onCountryChange"
              :rules="[rules.required, rules.phone]" /> -->
            <FormInput
              v-if="patient_exists"
              @forminputonEnter="
                patient_exists ? loginFunction() : checkPatient()
              "
              :isPassword="true"
              @show-password="showPassword"
              :inputType="passwordInputType"
              :label="'Password'"
              v-model="login.password"
              :rules="patient_exists ? [rules.required] : '[]'"
              :placeHolder="'Enter Password'"
            ></FormInput>
            <q-btn
              class="login-btn"
              color="primary"
              :loading="loading"
              :label="patient_exists ? 'Login' : 'Verify'"
              @click="patient_exists ? loginFunction() : checkPatient()"
            />
            <q-btn
              label="Register now"
              @click="signUpNow"
              un-elevated
              no-caps
              class="mt-10"
              flat
              color="white"
              text-color="primary"
            ></q-btn>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import FormInput from "@/partials/FormInput.vue";
// import PhoneInput from "@/partials/PhoneInput.vue";
import CountryPhone from "@/partials/CountryPhone.vue";
import { useUserStore } from "@/store/user.js";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { phone } from "@/composables/helper-functions";
import { usePatientStore } from "@/store/patient";
import notify from "../composables/notify";

const logo = require("@/assets/logo1.png");
const elipse = require("@/assets/elipse.svg");
const patient_exists = ref(false);
//const phoneObj = ref("");
const router = useRouter();
const loading = ref(false);

const userStore = useUserStore();
const patientStore = usePatientStore();
const $q = useQuasar();
const login = ref({
  phone_number: "",
  password: "",
  country_code: "",
});
// const remember = ref(false);
const loginForm = ref([]);
const passwordInputType = ref("password");
onMounted(() => {
  if (userStore.loginUserToken) {
    router.push({ name: "dashboard" });
  }
});
const showPassword = (showPassword) => {
  if (showPassword) {
    passwordInputType.value = "text";
  } else {
    passwordInputType.value = "password";
  }
};
const checkPatient = () => {
  console.log('checkPatient')
  loginForm.value.validate().then((success) => {
    if (success) {
      loading.value = true;
      const phone_obj = {
        phone_number : login.value.phone_number,
        country_code:  login.value.country_code
      
      }
       

      userStore.$state.registeringUser = {};
      userStore
        .Login(
          {
            phone_no: phone_obj.phone_number,
            phone_no_code: login.value.country_code,
          },
          "patient/send-OTP"
        )
        .then(async (response) => {
          if (
            response.data &&
            response.patient_condition_status.is_password_reset
          ) {
            loading.value = false;
            patient_exists.value = true;
          //  console.log('response.patient_condition_status.is_password_reset')
          } else if (response.data) {
            loading.value = false;
            userStore.$state.registeringUser = response.data;
            userStore.$state.registeringUserPhone = phone_obj;
            await patientStore.sendVerificationCode({
              phone_number: login.value.phone_number,
              country_code: login.value.country_code,
            });
            router.push({ name: "signup" });
          } else {
            loading.value = false;
            userStore.$state.registeringUserPhone = phone_obj;
            // await patientStore.sendVerificationCode(phone_obj);
            // router.push({ name: "signup" });
            notify("Not registered yet", "negative", "error");
          }
        })
        .catch((error) => {
          loading.value = false;
          console.log(error);
        });
    }
  });
};
const loginFunction = () => {
  console.log('loginFunction')
  loginForm.value.validate().then((success) => {
    if (success) {
      loading.value = true;
      const phone_obj = phone( 
       login.value.country_code,
        login.value.phone_number,
        
      );
      userStore
        .Login(
          {
            phone_number: phone_obj.phone_number,
            country_code: login.value.country_code,
            password: login.value.password,
          },
          "patient/login"
        )
        .then((response) => {
          if (response.data) {
            $q.notify({
              type: "postivie",
              position: "top-right",
              color: "primary",
              avatar: require("@/assets/svg/success-toast-icon.svg"),
              message: "Login successfully",
            });
            userStore.$state.loginUser = response.data;
            userStore.$state.loginUser.role = "patient";
            router.push({ name: "dashboard" });
          }
        })
        .catch((error) => {
          console.log(error);
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
};

const signUpNow = () => {
  userStore.registeringUserPhone.phone_number = "";
  userStore.registeringUserPhone.country_code = "";
  router.push({ path: "signup" });
};
// const onCountryChange = (countryObj) => {
//   phoneObj.value = countryObj;
// };
</script>

<style scoped lang="scss">
.login-main {
  background: url("@/assets/login-background.svg");

  .elipse {
    width: 500px;
    position: absolute;
    right: 0px;
  }
}

:deep(.title) {
  font-family: "Lato";
  font-size: 25px;
  font-weight: 600;
  line-height: 34px;
  letter-spacing: 0px;
  text-align: left;
}

:deep(.login-div) {
  z-index: 1;
}

:deep(.description) {
  font-family: Lato;
  font-size: 17px;
  font-weight: 500;
  line-height: 27px;
  letter-spacing: 0px;
  text-align: left;
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
  max-width: 500px;
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
  margin-bottom: 35px;
  margin-top: 10px;
}

:deep(.login-section .login-btn) {
  height: 50px;
  width: 100%;
  margin-top: 20px;
  padding: 14px 24px;
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

/* :deep(.login-section-left){
  margin-top: 10%;
} */

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
  align-items: center;
}

:deep(.pt-100) {
  padding-top: 100px;
}

:deep(.q-field--error .q-field__bottom) {
  display: none;
}

:deep(.login-section .register) {
  font-family: Lato;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  letter-spacing: 0em;
  text-align: left;
  margin-top: 11px;
  text-align: center;

  span {
    color: $primary;
    cursor: pointer;
  }
}

@media (max-width: 390px) {
  .pt-100 {
    padding-top: 0px !important;
  }
}

@media (max-width: 400px) {
  .login-section {
    padding: 55px 35px;
  }
}

:deep(.vti__input) {
  background: white;
}
</style>
