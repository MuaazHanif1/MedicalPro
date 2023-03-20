<template>
  <q-card class="my-card q-pa-md card-width card-height q-card-border">
    <div class="row q-mt-xs">
      <div class="col-1">
        <span class="span-icon-background row justify-center items-center">
          <q-icon name="send" size="12px" />
        </span>
      </div>
      <div class="col-11">
        <q-card-section class="submit-card-heading">
          Request Submitted Successfully!
        </q-card-section>
        <q-card-section class="submit-card-sub-heading q-mt-xs">
          We’ve recived your form and will get back to you within 24 hours.
          <br />For further queries contact us at
          <a href="" target="_blank" @click="() => false">icarepro@gmail.com</a>
        </q-card-section>
        <q-card-section>
          <div class="row q-mt-md">
            <span class="col-4 submit-card-request-id">Request ID:</span>
            <span class="col-2 submit-card-request-content">08768</span>
          </div>
          <div class="row q-mt-sm">
            <span class="col-4 submit-card-request-id">Practice Legal Name:</span>
            <span class="col-4 submit-card-request-content">Forest Health Community</span>
          </div>
          <div class="row q-mt-sm">
            <span class="col-4 submit-card-request-id">Forest Health Community:</span>
            <span class="col-2 submit-card-request-content">13-07-2022</span>
          </div>
          <div class="row q-mt-sm">
            <span class="col-4 submit-card-request-id">Request time:</span>
            <span class="col-2 submit-card-request-content">04:30 PM</span>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {};
</script>

<style scoped lang="scss">
.span-icon-background {
  width: 34px;
  height: 34px;
  left: 168px;
  top: 11.5px;
  background: #ecefed;
  border-radius: 12px;
  cursor: pointer;
}

.submit-card-heading {
  font-family: "Lato";
  font-style: normal;
  font-weight: 500;
  font-size: 14.5px;
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
</style>
