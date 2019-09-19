import Vue from "vue";

export const userKey = "__ceproc_user";
export const baseApiUrl = "http://localhost:3000"
//export const baseApiUrl = "http://192.168.15.27:3000";
//export const baseApiUrl = "http://192.168.43.101:3000";
//export const baseApiUrl = "http://salasol-com-br.umbler.net";

export function showError(e) {
  Vue.toasted.global.defaultError({ msg: e });
}

export default { baseApiUrl, showError, userKey };
