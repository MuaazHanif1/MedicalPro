<template>
    <q-dialog persistent>
        <q-card>
            <q-card-section class="row title-section items-center q-pb-none">
                <div class="register-title q-ml-sm">Register New Patient</div>
                <q-space />
                <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
            <q-card-section class="q-pt-none">
                <q-form ref="registerform" class="q-mt-sm">
                    <div class="row">
                        <div class="col-12 q-pa-sm phone-field">
                            <label>Phone Number</label>
                            <PhoneInput v-model="phone_number" :defaultCountry="defaultCountry" is_disabled="true">
                            </PhoneInput>
                        </div>
                        <div class="col-md-6 q-pa-sm col-12">
                            <FormInput :label="'Legal First Name'" :placeHolder="'Enter First Name'"
                                v-model="register.first_name" :rules="[rules.required, rules.single_word]"></FormInput>
                        </div>
                        <div class="col-md-6 q-pa-sm col-12">
                            <FormInput :label="'Legal Middle Name'" :placeHolder="'Enter Middle Name'"
                                v-model="register.middle_name" :rules="[rules.single_word]"></FormInput>
                        </div>
                        <div class="col-md-6 q-pa-sm col-12">
                            <FormInput :label="'Legal Last Name'" :placeHolder="'Enter Last Name'"
                                v-model="register.last_name" :rules="[rules.required, rules.single_word]"></FormInput>
                        </div>
                        <div class="col-md-6 q-pa-sm col-12">
                            <FormInput label="Gender" :labelColor="'#484848'" :labelWeight="'400'"
                                :labelFontSize="'13px'" :labelFontFamily="'lato'"
                                :option="['Male', 'Female', 'Transgender', 'Prefer not to say', 'Other']"
                                v-model="register.gender" :placeHolder="'Select'" :isInput="false"
                                :rules="[rules.required]"></FormInput>
                        </div>
                        <div class="col-md-6 q-pa-sm col-12">
                            <FormInput :label="'Date of Birth'" :placeHolder="'Enter'" :max="current_date" :inputType="'date'"
                                v-model="register.dob" :rules="[rules.required]"></FormInput>
                        </div>
                        <div class="col-md-6 q-pa-sm col-12">
                            <FormInput :label="'Email Address'" :placeHolder="'Enter Email'" v-model="register.email"
                                :rules="[rules.required, rules.email]"></FormInput>
                        </div>
                    </div>
                </q-form>
            </q-card-section>
            <q-card-actions align="right" class="q-mr-md">
                <q-btn flat label="Register" :loading="is_submit" class="green-background-btn register-btn"
                    @click="registerPatient" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
<script setup>
import { ref, defineProps, computed } from "vue";
import FormInput from '@/partials/FormInput.vue';
import PhoneInput from "@/partials/PhoneInput.vue";
import { usePracticeStore } from "@/store/practice";
import { useUserStore } from "@/store/user";
import { useQuasar } from "quasar";
import { useRouter } from 'vue-router';
import { date } from "quasar";
const router = useRouter();
const userStore = useUserStore();
const $q = useQuasar();
const registerform = ref(null);
const is_submit = ref(false);
const props = defineProps({
    phone_number: String,
    phone: Object,
    defaultCountry: String
});
const store = usePracticeStore();
const phone_number = computed(() => {
    return props.phone_number;
});
const defaultCountry = computed(() => {
    return props.defaultCountry;
});

// previous day date
let newDate = date.formatDate(Date.now(),"YYYY/MM/DD");
newDate = date.subtractFromDate(newDate, { hours: 24 });
const current_date = date.formatDate(newDate,"YYYY/MM/DD");

const register = ref({
    first_name: '',
    middle_name: '',
    last_name: '',
    gender: '',
    dob: current_date,
    email: '',
    phone_number: props.phone.phone_number,
    practice_id: userStore.getLoginUser.id,
    country_code: props.phone.country_code,
});
const registerPatient = () => {
    registerform.value.validate().then((success) => {
        if (success) {
            is_submit.value = true;
            store.practiceCreatePatient(register.value).then((res) => {
                if (res.data) {
                    $q.notify({
                        position: 'top-right',
                        message: "Success",
                        color: "primary",
                        avatar: require("@/assets/svg/success-toast-icon.svg"),
                        caption: 'Patient Registered Successfully',
                    })
                    is_submit.value = false;
                    router.push({ name: 'all-patients' });
                } else {
                    $q.notify({
                        type: 'negative',
                        position: 'top-right',
                        textColor: "white",
                        icon: "warning",
                        message: "The email has already been taken.",
                    })
                    is_submit.value = false;
                }
            });
        }
    });
}
</script>
<style scoped lang="scss">
:deep(.q-card){
    width: 592px;
    height: 501px;
    background: #FFFFFF;
    box-shadow: 0px 4px 15px rgba(12, 29, 22, 0.1);
    border-radius: 6px;
}
:deep(.q-card__section--vert) {
    padding-left: 32px;
    padding-right: 32px;
}
:deep(.register-btn){
    height: 40px;
    width: 112px;
    border-radius: 6px;
    margin-right: 16px;
}
:deep(.phone-field label){
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 16px;
    color: #484848;
}
:deep(.phone-field .q-field){
    margin-bottom: 0px;
    padding-bottom: 0px;
    margin-top: 6px;
}
:deep(.register-title){
    font-family: 'Lato';
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;
    color: #0D0C22;
}
:deep(.title-section .q-btn){
    height: 10px;
    width: 10px;
}
// :deep(.q-btn) {
//     box-shadow: none !important;
// }
</style>







