import axios from "axios";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
      if (user) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${user.accessToken}`;
        state.isMenuVisible = true;
      } else {
        delete axios.defaults.headers.common["Authorization"];
        state.isMenuVisible = false;
      }
    }
  }
});
