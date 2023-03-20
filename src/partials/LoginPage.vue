<template>
    <div class="login-main">
        <q-img class="elipse" :src="elipse" />
        <div class="row login-header">
            <q-img :src="logo" style="height: 16.7px; max-width: 140px; margin-left: 16px;" />
            <!-- <p>Having trouble? Get Help</p> -->
        </div>
        <div :class="$q.screen.width < 790 ? 'row login pt-100':'row login '">
            <div class="col-md-4" :style="$q.screen.lt.md ? 'display: none;' : ''">
                <div class="login-section-left">
                    <div class="title">
                        iCare Pro
                    </div>
                    <div class="description">
                        iCarePro is one of the best EMRs/EHRs in the market. Our goal is to provide clinicians and patients the support they're looking for with structured, flexible experiences that work the way they do. Our user-oriented system can help accelerate your entire revenue cycle and maximize your financial outcomes.
                    </div>
                </div>
            </div>
            <div class="col-md-5 offset-md-1 login-div">
                <div class="login-section">
                    <h3>Login To Continue</h3>
                    <p>Enter your credentials to access your account.</p>
                    <!-- <q-img :src="logo" style="height: 32px; max-width: 117px" /> -->
                    <q-form ref="loginForm">
                        <FormInput @forminputonEnter="loginFunction" :inputType="'email'" :label="'Email Address'"
                            v-model="login.email" :rules="[rules.required,rules.email]" :placeHolder="'Enter Email'">
                        </FormInput>
                        <FormInput @forminputonEnter="loginFunction" :isPassword="true" @show-password="showPassword"
                            :inputType="passwordInputType" :label="'Password'" v-model="login.password"
                            :rules="[rules.required]" :placeHolder="'Enter Password'"></FormInput>
                        <!-- <div class="remember-forgot">
                            <q-checkbox v-model="remember" label="Remember Me" />
                            <div class="forgot-password">Forgot Password?</div>
                        </div> -->
                        <q-btn color="primary" label="Login" @click="loginFunction" />
                        <p @click.stop="signUpFunction">Sign Up</p>
                    </q-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { onMounted, ref, defineProps } from 'vue';
import FormInput from '@/partials/FormInput.vue';
import { useUserStore } from "@/store/user.js";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";


const props = defineProps({
    information: {
        type: Object
    }
});
const logo = require("@/assets/logo1.png");
const elipse = require("@/assets/elipse.svg");
const router = useRouter();

const userStore = useUserStore();
const $q = useQuasar();
const login = ref({
    email: '',
    password: ''
});
// const remember = ref(false);
const loginForm = ref([]);
const passwordInputType = ref('password');
onMounted(() => {
    if (userStore.loginUserToken) {
        router.push({ name: props.information.redirect_route_name });
    }
})
const showPassword = (showPassword) => {
    if (showPassword) { passwordInputType.value = 'text'; }
    else { passwordInputType.value = 'password'; }
}
const loginFunction = () => {
    loginForm.value.validate().then((success) => {
        if (success) {
            login.value.primary_email = login.value.email;
            userStore.Login(login.value, props.information.api_end_point).then((response) => {
                if (response.data) {
                    $q.notify({
                        type: 'postivie',
                        position: 'top-right',
                        color: "primary",
                        avatar: require("@/assets/svg/success-toast-icon.svg"),
                        message: "Login successfully"
                    });
                    userStore.$state.loginUser = response.data;
                    userStore.$state.loginUser.role = props.information.role;
                    router.push({ name: props.information.redirect_route_name });
                }
                // else {
                //     $q.notify({
                //         type: 'negative',
                //         position: 'top-right',
                //         textColor: "white",
                //         icon: "warning",
                //         message: response.response.data.message ? response.response.data.message : "Something went wrong"
                //     });
                // }
            }).catch((error) => {
                console.log(error);
            });

        }
    })
}
const signUpFunction = () => {

    router.push({ name: 'signup' });
}
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
    font-family: Lato;
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
    width: 100%;
    max-width: 500px;
    box-shadow: 0px 3px 20px rgba(223, 224, 225, 0.3);
    border-radius: 10px;
    padding: 55px 55px 75px 55px;
}

:deep(.login-section h3) {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 700;
    font-size: 24px;
    line-height: 29px;
    color: #0D0C22;
    text-align: center;
}

:deep(.login-section p) {
    font-family: 'Lato';
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
    box-shadow: 0px 3px 12px #F1F1F5;
    border-radius: 8px;

    .q-btn__content {
        height: 17px;
        font-family: 'Lato';
        font-style: normal;
        font-weight: 600;
        font-size: 14px;
        line-height: 17px;
        color: #FFFFFF;
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
    font-family: 'Lato';
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
</style>