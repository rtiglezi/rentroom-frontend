<template>
  <div class="header pb-2 mb-2">
    

    <b-navbar fixed toggleable="lg" type="dark" class="header-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title">
        <i class="fa fa-door-open fa-lg mr-1"></i> Salafácil
      </b-navbar-brand>

      <!-- Right aligned nav items -->
      <b-navbar-nav v-if="user.profiles.indexOf('admin')!=-1">
        <div>
          <b-button @click="navigate('/admin')" variant="danger">
            <i class="fa fa-cog fa-lg"></i>
          </b-button>
          <b-button @click="navigate('/admin/users/profile')" variant="danger" class="ml-2">
            <i class="fa fa-user fa-lg"></i>
          </b-button>
        </div>
      </b-navbar-nav>
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
    };
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
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
