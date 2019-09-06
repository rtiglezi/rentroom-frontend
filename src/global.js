import Vue from "vue";

export const userKey = "__ceproc_user";
export const baseApiUrl = "http://localhost:3000";

export function showError(e) {
  Vue.toasted.global.defaultError({ msg: e });
}

export default { baseApiUrl, showError, userKey };
