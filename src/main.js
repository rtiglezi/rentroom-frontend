import Vue from "vue";

import App from "./App";
import "./config/bootstrap";
import "./config/msgs";
import "./config/axios";
import store from "./config/store";
import router from "./config/router";

import VeeValidate from "vee-validate";
import pt_BR from "vee-validate/dist/locale/pt_BR";
import VueDraggable from "vue-draggable";
import VueTheMask from 'vue-the-mask'

import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import Fieldset from 'primevue/fieldset';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import OverlayPanel from 'primevue/overlaypanel';
import MultiSelect from 'primevue/multiselect';
import InputSwitch from 'primevue/inputswitch';

import money from 'v-money' 
Vue.use(money, {precision: 4})


Vue.component('InputText', InputText);
Vue.component('Button', Button);
Vue.component('Menu', Menu);
Vue.component('Fieldset', Fieldset);
Vue.component('Accordion', Accordion);
Vue.component('AccordionTab', AccordionTab);
Vue.component('OverlayPanel', OverlayPanel);
Vue.component('MultiSelect', MultiSelect);
Vue.component('InputSwitch', InputSwitch);

import 'primevue/resources/themes/nova-light/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

Vue.use(require('vue-moment'));
Vue.use(VueTheMask)
Vue.use(VueDraggable);

import { Datetime } from 'vue-datetime';
Vue.component('datetime', Datetime);
import 'vue-datetime/dist/vue-datetime.css'

Vue.use(VeeValidate, {
  fieldsBagName: "formFields",
  locale: "pt_BR",
  dictionary: {
    pt_BR: pt_BR
  }
});

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
