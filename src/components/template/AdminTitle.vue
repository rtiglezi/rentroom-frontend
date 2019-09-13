<template>
  <div class="header pb-2 mb-2">
    <b-navbar fixed toggleable="lg" type="dark" class="header-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title">
        <i @click="navigate('/admin')" class="fa fa-arrow-left fa-lg mr-1"></i>
        {{main}}
      </b-navbar-brand>
    </b-navbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { userKey } from "@/global";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "PageTitle",
  props: ["main"],
  computed: mapState(["user"]),
  data: function() {
    return {
      rooms: [],
      number: "",
      processes: []
    };
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    },

    logout() {
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$router.push({ name: "auth" });
    }
  },
  mounted() {}
};
</script>
<style>
.header-nav {
  background-color: rgb(163, 39, 39);
}
.header {
  background-color: #c82333;
}
</style>
