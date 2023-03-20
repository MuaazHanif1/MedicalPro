<template>
  <div class="column mt-10">
    <span class="submit-heading">Submit</span>
    <span class="lato-sub-heading mt-14">Successfully Submit !</span>
  </div>
  <q-card class="mt-40 my-card q-pa-md card-width q-card-border">
    <div class="row q-mt-xs">
      <div class="col-1 mr-20">
        <span class="row justify-center items-center">
          <q-icon class="send-icon" name="send" size="1.2rem" color="primary" />
        </span>
      </div>
      <div class="col-10">
        <q-card-section class="submit-card-heading">
          Request Submitted Successfully!
        </q-card-section>
        <q-card-section class="q-mt-xs dark-grey">
          Your Registration has been successfully completed. Please complete your verification process by clicking on
          the Button Below.
          <!-- Your Registration has been successfully completed. We will get back to you within 24 hours. For further
          queries
          contact us at
          <a href="" target="_blank" @click="() => false">icarepro@gmail.com</a>. -->
          <q-btn @click="redirectToKYC()" color="primary" :loading="isSpinning" size="md"
            class="q-p-md px-20 text-lower-case mt-25 mb-15">
            KYC Verification
          </q-btn>
        </q-card-section>
        <!-- <q-card-section>
          <div class="row q-mt-md">
            <span class="col-4 submit-card-request-id">Request ID:</span>
            <span class="col-2 submit-card-request-content">{{
            store.doctor_response_after_create.doctor_id
            }}</span>
          </div>
          <div class="row q-mt-sm">
            <span class="col-4 submit-card-request-id">Request Date:</span>
            <span class="col-2 submit-card-request-content">{{
            store.doctor_response_after_create.created_date
            }}</span>
          </div>
          <div class="row q-mt-sm">
            <span class="col-4 submit-card-request-id">Request time:</span>
            <span class="col-2 submit-card-request-content">{{
            store.doctor_response_after_create.created_time
            }}</span>
          </div>
        </q-card-section> -->
      </div>
    </div>
  </q-card>
  <!-- <span class=" mt-20">
    <a class="back-dash-btn" href="/" target="_blank">
      Back to Dashboard
    </a>
  </span> -->
</template>

<script setup>
// import { useDoctorsRegistrationStore } from "@/store/doctors_registration";
// const store = useDoctorsRegistrationStore();

const redirectToKYC = () => {
  location.reload();
}
</script>

<style scoped lang="scss">
:deep .send-icon {
  background: #ECEFED;
  border-radius: 12px;
  font-size: 18px;
  padding: 10px;
  cursor: pointer;
}


.submit-card-heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 140%;
  color: #0d0c22;
}

.submit-card-sub-heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 141%;
  color: #808192;

  a {
    text-decoration: none;
    color: $primary;
  }
}

.submit-card-request-id {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  text-transform: capitalize;

  /* Text */

  color: #0d0c22;
}

.submit-heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
}

.submit-card-request-content {
  font-family: "Lato";
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  /* identical to box height */

  text-transform: capitalize;

  /* Text 2 */

  color: #7d8693;
}

.card-width {
  max-width: 565px;
}

.card-height {
  min-height: 210px;
}

:deep .q-card__section--vert {
  padding: 0px;
}

.q-card-border {
  border: 1px solid #f3f2f8 !important;
  box-shadow: 0px 4px 4px rgba(9, 11, 33, 0.02) !important;
  border-radius: 12px !important;
}

.back-dash-btn {
  color: $primary;
  border-bottom: 2px solid $primary;
  width: fit-content;
  cursor: pointer;
}
</style>
