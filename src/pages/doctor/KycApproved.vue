<template>
  <div>
    <div class="kyc">
    <div class="row kyc-inner">
      <div class="title">Registration Completed Successfully</div>
      <p>Your Registration has been successfully completed. Please complete your verification process by clicking on the Button Below.</p>
      <label><strong>Kyc Status:</strong>{{ userStore.$state.loginUser.kyc_status }}</label>
      <q-btn
        color="primary"
        class="q-mt-md q-pl-lg q-pr-lg"
        label="KYC Verification"
        @click="kycApproval"
      />
    </div>
  </div>
  </div>
</template>
<script setup>
import { useUserStore } from "@/store/user";

const userStore = useUserStore();

const kycApproval = () => {
  const url = userStore.$state.loginUser.kyc_verification_url;
  userStore.$state.loginUser = {};
  window.location.href = url;
};
</script>
<style scoped lang="scss">
:deep(.kyc) {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background: #E5E5E5  !important;
    .kyc-inner {
      display: flex;
      align-items: center;
      flex-direction: column;
      border: 1px solid black;
      padding: 20px;
      max-width: 565px;
      background: #FFFFFF;
      border: 1px solid #F3F2F8;
      box-shadow: 0px 4px 4px rgba(9, 11, 33, 0.02);
      border-radius: 12px;
    }
  .title {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 140%;
    color: #0D0C22;
  }
  p {
    font-family: 'Lato';
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 141%;
    color: #505050;
    max-width: 500px;
    text-align: center;
  }
  .q-btn {
    text-transform: capitalize;
    height: 48px;
    border-radius: 6px;
  }
}
</style>
