<template>
    <div class="reset-password-main">
        <div class="row login-header">
            <!-- <p>Having trouble? Get Help</p> -->
        </div>
        <div :class="$q.screen.width < 790 ? 'row login pt-100':'row login '">
            <div class="col-md-5">
                <div><q-img :src="logo" class="remember-logo"/></div>
                <div class="login-section">
                    <h3>Reset Password</h3>
                    <p>Enter a new password below to change your password</p>
                    <q-form ref="resetPasswordForm">
                        <FormInput @forminputonEnter="doctorResetPassword" @show-password="showPassword" :isPassword="true" :inputType="passwordInputType" :label="'New Password'" v-model="reset.password" :rules="[rules.required,rules.password_length]" :placeHolder="'Enter Password'"></FormInput>
                        <FormInput class="q-mt-sm" @forminputonEnter="doctorResetPassword" @show-password="showConfirmPassword" :isPassword="true" :inputType="confirmPasswordInputTtype" :label="'Re-enter New Password'" v-model="reset.password_confirmation" :rules="[rules.required,rules.password_length]" :placeHolder="'Confirm Password'"></FormInput>
                        <q-btn color="primary" label="Reset Password" @click="doctorResetPassword" />
                    </q-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import {ref} from 'vue';
import FormInput from '@/partials/FormInput.vue';
import { useQuasar } from "quasar";
import {useRouter} from "vue-router";
import {useUserStore} from "@/store/user"

const router = useRouter();
const userStore = useUserStore();
const logo = require("@/assets/logo1.png");
const passwordInputType = ref('password');
const confirmPasswordInputTtype = ref('password');

const $q = useQuasar();
const reset = ref({
    password:'',
    password_confirmation:''
});
const endpoints = ref({
    doctor:'doctors/reset-password',
    practice:'practice/reset-password',
});
const resetPasswordForm = ref([]);
const doctorResetPassword = () => {
    if(reset.value.password == reset.value.password_confirmation){
        resetPasswordForm.value.validate().then((success)=>{
            if(success){
                userStore.resetPassword(reset.value,endpoints.value[userStore.$state.loginUser.role]).then((response) => {
                    if(response.data){
                        $q.notify({
                            type: 'postivie',
                            position: 'top-right',
                            color:"primary",
                            avatar: require("@/assets/svg/success-toast-icon.svg"),
                            message: "Password reset successfully"
                        });
                        userStore.$state.loginUser.is_password_reset = response.data.is_password_reset;
                        router.push({name:'doctor-main'});
                    }
                    // else {
                    //     $q.notify({
                    //         type: 'negative',
                    //         position: 'top-right',
                    //         textColor: "white",
                    //         icon: "warning",
                    //         message: response.response.data.message
                    //     });
                    // }
                }).catch((error) => {
                    console.log(error);
                });
                
            }
        })

    }else{
        $q.notify({
            type: 'negative',
            position: 'top-right',
            textColor: "white",
            icon: "warning",
            message: "Password mismatch"
        });   
    }
}

const showPassword = (showPassword) =>{
    if(showPassword){passwordInputType.value = 'text';}
    else {passwordInputType.value = 'password';}
}
const showConfirmPassword = (showPassword) =>{
    if(showPassword){confirmPasswordInputTtype.value = 'text';}
    else {confirmPasswordInputTtype.value = 'password';}
}
</script>


<style scoped>
.reset-password-main{
    background: #E5E5E5  !important;
}
:deep(.title){
    font-family: Lato;
    font-size: 26px;
    font-weight: 600;
    line-height: 34px;
    letter-spacing: 0px;
    text-align: left;

}
:deep(.description){
    font-family: Lato;
    font-size: 18px;
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
:deep(.login-section){
    background: white;
    box-shadow: 0px 3px 20px rgba(223, 224, 225, 0.3);
    border-radius: 10px;
    padding: 40px;
    padding-bottom: 54px;
}
:deep(.login-section h3){
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    color: #0D0C22;
    text-align: center;
}
:deep(.remember-logo){
    display: block;
    margin: auto;
    margin-bottom: 61px;
    height: 16.7px; 
    max-width: 140px; 
    margin-left: 16px;
}
:deep(.login-section p){
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 12px;
    color: #505050;
    text-align: center;
    margin-bottom: 40px;
}
:deep(.login-section .q-btn){
    height: 50px;
    width: 100%;
    border-radius: 8px;
    padding: 14px 24px 14px 24px;
    margin-top: 20px;

}
:deep(.login-section .q-field__control){
    height: 46px;
    margin-bottom: 18px;
}
/* :deep(.login-section-left){
    margin-top: 10%;
} */

:deep(.login-header){
    padding: 29px;
    position: fixed;
    width: 100%;
    top: 0px;
    justify-content: right;
}
:deep(.login-header p){
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 13px;
    line-height: 12px;
    color: #505050;
}
:deep(.remember-forgot){
    display: flex;
    justify-content: space-between;
}
:deep(.remember-forgot .forgot-password){
    margin-top: 15px;
}
:deep(.login){
    width: 100%;
    height: 100vh;
    justify-content: center;
    align-items: center;
}
:deep(.pt-100){
    padding-top: 100px;
}
</style>