<template>
    <div class="mx-30">
        <div class="mt-20 dark-black fs-20 font-weight-600">Settingsnpm</div>
        <section class="bg-white height mt-20 row">
            <section class="my-30 width-100" :class="[$q.screen.lt.md ? 'px-15' : 'px-26']">
                <q-splitter v-model="splitterValue" :horizontal="$q.screen.lt.md ? true : false" :disable="true">
                    <template v-slot:before>
                        <q-tabs v-model="tab" :vertical="$q.screen.lt.md ? false : true" align="left"
                            active-color="primary" indicator-color="primary" class="text-grey-6">
                            <q-tab class="tab text-graphite" v-for="(tab, index) in tabs" :key="index" :name="tab.name"
                                :class="{}">
                                <template #default>
                                    <p class="fs-14 font-weight-600 mb-0 text-capitalize">
                                        {{ tab.label }}
                                    </p>
                                </template>
                            </q-tab>
                        </q-tabs>
                    </template>
                    <template v-slot:after>
                        <div>
                            <q-tab-panels v-model="tab" animated class="tab-panel" swipeable inline-label outside-arrows
                                mobile-arrows transition-prev="jump-up" transition-next="jump-up">
                                <q-tab-panel name="number" class="pt-0"
                                    :class="[$q.screen.lt.md ? 'mt-15 px-0' : ' px-35']">
                                    <keep-alive>
                                        <q-form ref="phoneupdateform" class="full-width">
                                            <div class="row phone-section">
                                                <p v-if="is_verification_code_sent" class="code-sent">
                                                    6-Digit verification code has been send to your number
                                                    ({{ new_phone_obj.country_code }}
                                                    {{ new_phone_obj.phone_number }})
                                                </p>
                                                <div class="col-md-4 col-sm-6 col-xs-12">
                                                    <PhoneInput v-if="!is_verification_code_sent"
                                                        v-model="new_phone_number" @selected-country="onCountryChange"
                                                        :rules="[rules.required, rules.phone]" />
                                                    <FormInput v-else :rules="[rules.required]"
                                                        v-model="verification_code"
                                                        :placeHolder="'Enter code to verfiy'"
                                                        :label="'Verification code'" />
                                                </div>
                                                <div class="col-md-6 col-sm-12 col-xs-12 action">
                                                    <q-btn label="Verify" class="verify-btn" :loading="saving"
                                                        color="primary" @click="
                                                            !is_verification_code_sent
                                                                ? sendVerificationCode()
                                                                : updatePhoneNumber()
                                                        ">
                                                    </q-btn>
                                                    <span v-if="is_verification_code_sent"
                                                        class="resend-code q-ml-sm">Did not receive code?
                                                        <strong @click="sendCodeForVerification()"
                                                            class="cursor-pointer">Resend Code</strong>
                                                    </span>
                                                </div>
                                            </div>
                                        </q-form>
                                    </keep-alive>
                                </q-tab-panel>
                                <q-tab-panel name="password" class="pt-0"
                                    :class="[$q.screen.lt.md ? 'mt-15 px-0' : ' px-35']" style="overflow-x: hidden">
                                    <keep-alive>
                                        <q-form ref="passwordreset" class="full-width"
                                            :class="[$q.screen.lt.sm ? 'mt-15' : '']">
                                            <div class="row update-password q-col-gutter-md">
                                                <div class="col-12 col-md-4">
                                                    <FormInput :isPassword="true" @show-password="
                                                        currentPasswordType == 'password'
                                                            ? (currentPasswordType = 'text')
                                                            : (currentPasswordType = 'password')
                                                    " :inputType="currentPasswordType" :label="'Current password'"
                                                        v-model="updatePassword.old_password" :rules="[rules.required]"
                                                        :placeHolder="'Enter current password'" />
                                                </div>
                                                <div class="col-12 col-md-4">
                                                    <FormInput :isPassword="true" @show-password="
                                                        newPasswordType == 'password'
                                                            ? (newPasswordType = 'text')
                                                            : (newPasswordType = 'password')
                                                    " :inputType="newPasswordType" :label="'New password'"
                                                        v-model="updatePassword.new_password"
                                                        :rules="[rules.required, rules.password_length]"
                                                        :placeHolder="'Enter new password'" />
                                                </div>
                                                <div class="col-12 col-md-4">
                                                    <FormInput :isPassword="true" @show-password="
                                                        confirmPasswordType == 'password'
                                                            ? (confirmPasswordType = 'text')
                                                            : (confirmPasswordType = 'password')
                                                    " :inputType="confirmPasswordType" :label="'Confirm password'"
                                                        v-model="updatePassword.confirm_password"
                                                        :rules="[rules.required, rules.password_length]"
                                                        :placeHolder="'Enter confirm password'" />
                                                </div>
                                                <div class="col-12 action">
                                                    <q-btn label="Update" :loading="saving" color="primary"
                                                        @click="changePassword"></q-btn>
                                                </div>
                                            </div>
                                        </q-form>
                                    </keep-alive>
                                </q-tab-panel>
                                <q-tab-panel name="integrate" class="pt-0"
                                    :class="[$q.screen.lt.md ? 'mt-15 px-0' : ' px-35']">
                                    <keep-alive>
                                        <div class="row q-col-gutter-lg">
                                            <CalendarIntegration :connected="isGoogleConnected" calendarName="google"
                                                @button-click="onButtonClick" :isLoading="isGoogleLoading"
                                                :conncetedEmail="
                                                    userStore.$state.calendar.googleCalendar &&
                                                        userStore.$state.calendar.googleCalendar.status
                                                        ? userStore.$state.calendar.googleCalendar
                                                            .login_email
                                                        : ''
                                                " />
                                            <CalendarIntegration :connected="isOutlookConnected" calendarName="outlook"
                                                @button-click="onButtonClick" :isLoading="isOutlookLoading"
                                                :conncetedEmail="
                            userStore.$state.calendar.outlookCalendar &&
                                userStore.$state.calendar.outlookCalendar.status
                                ? userStore.$state.calendar.outlookCalendar
                                    .login_email
                                : ''
                                                " />
                                        </div>
                                    </keep-alive>
                                </q-tab-panel>
                            </q-tab-panels>
                        </div>
                    </template>
                </q-splitter>
            </section>
        </section>
    </div>
</template>

<script setup>
import CalendarIntegration from "@/partials/CalendarIntegration/CalendarIntegration.vue";
import { ref, onMounted, watch } from "vue";
import { useUserStore } from "@/store/user";
import FormInput from "@/partials/FormInput.vue";
import PhoneInput from "@/partials/PhoneInput.vue";
import { usePatientStore } from "@/store/patient";
import { phone } from "@/composables/helper-functions";
import notify from "@/composables/notify";
import axiosApiClient from "@/axios";

onMounted(() => {
    // userStore.getLoginUser.outlook_calendar && (isOutlookConnected.value = userStore.getLoginUser.outlook_calendar.status)
    // userStore.getLoginUser.google_calendar && (isGoogleConnected.value = userStore.getLoginUser.google_calendar.status)
    // patientStore.$state.googleCalendarIntegration && (isGoogleConnected.value = patientStore.$state.googleCalendarIntegration.status)
    // patientStore.$state.outlookCalendarIntegration && (isOutlookConnected.value = patientStore.$state.outlookCalendarIntegration.status)
    userStore.$state.calendar.googleCalendar &&
        (isGoogleConnected.value = userStore.$state.calendar.googleCalendar.status);
    userStore.$state.calendar.outlookCalendar &&
        (isOutlookConnected.value =
            userStore.$state.calendar.outlookCalendar.status);
});
const splitterValue = ref(20);
const userStore = useUserStore();
const patientStore = usePatientStore();
const currentPasswordType = ref("password");
const newPasswordType = ref("password");
const confirmPasswordType = ref("password");
const saving = ref(false);
const updatePassword = ref({
    old_password: "",
    new_password: "",
    confirm_password: "",
});
const new_phone_number = ref("");
const new_phone_obj = ref("");
const passwordreset = ref("");
const phoneObj = ref("");
const phoneupdateform = ref("");
const verification_code = ref("");
const is_verification_code_sent = ref(false);
const tabs = ref([
    {
        label: "Change Number",
        name: "number",
    },
    {
        label: "Change Password",
        name: "password",
    },
    {
        label: "Integrate Calendar",
        name: "integrate",
    },
]);
const tab = ref("number");
let isGoogleConnected = ref(false);
let isOutlookConnected = ref(false);
let isOutlookLoading = ref(false);
let isGoogleLoading = ref(false);

const changePassword = () => {
    passwordreset.value.validate().then((success) => {
        if (success) {
            saving.value = true;
            patientStore.updatePatientPassword(updatePassword.value).then((res) => {
                if (res.data) {
                    notify("Password updated successfully", "primary");
                    setTimeout(function () {
                        location.reload(true);
                    }, 500);
                }
                saving.value = false;
            });
        }
    });
};
const onCountryChange = (countryObj) => {
    phoneObj.value = countryObj;
};
const onButtonClick = (object) => {
    if (!object.isAlreadyConnected) {
        object.iconType == "google" &&
            window.open(
                `${process.env.VUE_APP_API_URL_CALENDAR_PATIENT}google/callback`,
                "_parent"
            ) &&
            setVariableForGoogle(object.isAlreadyConnected);
        object.iconType == "outlook" &&
            window.open(
                `${process.env.VUE_APP_API_URL_CALENDAR_PATIENT}outlook/callback`,
                "_parent"
            ) &&
            setVariableForOutlook(object.isAlreadyConnected);
    } else {
        object.iconType == "google" &&
            setVariableForGoogle(object.isAlreadyConnected);
        object.iconType == "outlook" &&
            setVariableForOutlook(object.isAlreadyConnected);
    }
};
const setVariableForOutlook = (isConnected) => {
  isOutlookLoading.value = true;

  axiosApiClient
    .post(isConnected ? `remove-outlook-calendar` : `doctor-email`, {
      email: userStore.$state.loginUser.email,
    })
    .then(
      () =>
        isConnected &&
        (isGoogleConnected.value = false) &&
        (userStore.$state.calendar.googleCalendar = null)
    )
    .catch((error) => console.log(error))
    .finally(() => {
      setTimeout(() => {
        isOutlookLoading.value = false;
      }, 3000);
    });
};
const setVariableForGoogle = (isConnected) => {
    isGoogleLoading.value = true;
    axiosApiClient
        .post(isConnected ? `remove-google-calendar` : `gdoctor-email`, {
            email: userStore.$state.loginUser.email,
        })
        .then(
            () => () =>
                isConnected &&
                (isGoogleConnected.value = false) &&
                (userStore.$state.calendar.googleCalendar = null)
        )
        .catch((error) => console.log(error))
        .finally(() => {
            setTimeout(() => {
                isGoogleLoading.value = false;
            }, 3000);
        });
};
const updatePhoneNumber = async () => {
    console.log("updatePhoneNumber");
    phoneupdateform.value.validate().then((success) => {
        if (success) {
            saving.value = true;
            patientStore
                .updatePatientPhoneNumber({
                    phone_number: userStore.loginUser.phone_number,
                    verified_code: verification_code.value,
                    new_phone_number: new_phone_obj.value.phone_number,
                    country_code: new_phone_obj.value.country_code,
                })
                .then((res) => {
                    if (res.data) {
                        userStore.$state.loginUser.phone_number =
                            new_phone_obj.value.phone_number;
                        notify("phone number changed successfully", "primary");
                        setTimeout(function () {
                            location.reload(true);
                        }, 500);
                    }
                    saving.value = false;
                })
                .catch(() => {
                    saving.value = false;
                });
        }
    });
};
const sendVerificationCode = async () => {
    phoneupdateform.value.validate().then((success) => {
        if (success) {
            sendCodeForVerification();
        }
    });
};
const sendCodeForVerification = () => {
    const phone_num = phone(phoneObj.value, new_phone_number.value);
    new_phone_obj.value = phone_num;
    saving.value = true;
    patientStore
        .changePatientPhoneNumber({
            phone_number: userStore.loginUser.phone_number,
            new_phone_number: phone_num.phone_number,
            country_code: phone_num.country_code,
        })
        .then((res) => {
            if (res.data.success) {
                is_verification_code_sent.value = true;
                notify(res.data.message, "primary");
                saving.value = false;
            }
            saving.value = false;
        })
        .catch(() => {
            saving.value = false;
        });
};
watch(
    () => userStore.$state.calendar.outlookCalendar,
    () => {
        userStore.$state.calendar.outlookCalendar &&
            (isOutlookConnected.value =
                userStore.$state.calendar.outlookCalendar.status);
    },
    { deep: true }
);
watch(
    () => userStore.$state.calendar.googleCalendar,
    () => {
        userStore.$state.calendar.googleCalendar &&
            (isGoogleConnected.value =
                userStore.$state.calendar.googleCalendar.status);
    },
    { deep: true }
);
</script>
<style lang="scss" scoped>
:deep(.q-tab) {
    justify-content: start !important;
    min-height: 35px;
    font-weight: 600;
}

:deep(.q-panel) {
    overflow-x: hidden;
    overflow-y: auto;
}

:deep(.listing) {
    padding-top: 0px !important;
}

.height {
    height: 70vh;
}

:deep(.update-password) {
    justify-content: space-around;

    .action {
        display: flex;
        justify-content: end;
        padding: 10px;
        border-radius: 7px;
    }
}

:deep(.rounded-borders) {
    border: none !important;
}

:deep(.phone-section) {
    display: flex;
    flex-direction: column;

    .action {
        margin-top: 10px;
    }
}

:deep(.code-sent) {
    color: $primary;
}
</style>
