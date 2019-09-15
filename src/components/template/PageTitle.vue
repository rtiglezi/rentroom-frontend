<template>
  <div class="page pb-2 mb-2">
    <b-navbar fixed toggleable="lg" type="dark" class="page-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title">
        <i @click="navigate('/')" class="fa fa-arrow-left fa-lg mr-2"></i>
        {{main}}
      </b-navbar-brand>
    </b-navbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { userKey } from "@/global";

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
.page-nav {
  background-color: brown;
}
.page {
  background-color: rgb(196, 66, 66);
}
</style>
