import { createApp } from "vue";
import   App from "./App.vue";
import { Quasar } from "quasar";
import mitt from 'mitt';
import router from "./router";
import quasarUserOptions from "./quasar-user-options";
import VueTelInput from "vue-tel-input";
import "vue-tel-input/dist/vue-tel-input.css";
import rules from "./composables/validation-rules";
import enums from "./composables/enums";
import moment from "moment";
import pinia from "@/pinia";
import './registerServiceWorker'

// Disabling console statements in production
if(process.env.NODE_ENV === 'production') {
   console.log = function() {}
}

// phone input with flags configuration
const VueTelInputOptions = {
  inputOptions: {
    required: true,
  },
  dropdownOptions: {
    showDialCodeInSelection: false,
    showSearchBox: true,
  },
  invalidMsg: "Invalid Phone Number",
};

const app = createApp(App);

app.config.globalProperties.$filters = {
  formatDate(value, format = "YYYY-MM-DD hh:mm:ss") {
    if (value) {
      return moment(String(value)).format(format);
    }
  }
}


// configration of EventBus
const emitter = mitt();
app.config.globalProperties.emitter = emitter;

// defining global validation rules
app.config.globalProperties.rules = rules;

// defining global enums
app.config.globalProperties.enums = enums;

app
  .use(Quasar, quasarUserOptions)
  .use(pinia)
 .use(router)
  .use(VueTelInput, VueTelInputOptions)
  .mount("#app");
