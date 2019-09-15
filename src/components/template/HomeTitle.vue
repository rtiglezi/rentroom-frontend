<template>
  <div class="home pb-2 mb-2">
    <b-navbar fixed toggleable="lg" type="dark" class="home-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title">
        <i class="fa fa-door-open fa-lg mr-1"></i> Salafácil
      </b-navbar-brand>

      <!-- Right aligned nav items -->
      <b-navbar-nav>
        <div>
          <b-button @click="navigate('/admin')" variant="danger" v-if="user.profiles.indexOf('admin')!=-1">
            <i class="fa fa-cog fa-lg"></i>
          </b-button>
          <b-button @click="navigate('/admin/users/profile')" variant="info" class="ml-2">
            <i class="fa fa-user fa-lg"></i>
          </b-button>
        </div>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "PageTitle",
  props: ["main"],
  computed: mapState(["user"]),
  data: function() {
    return {};
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    }
  },
  mounted() {
    axios.get(`${baseApiUrl}/users/acceptedcontract`).then(r => {
      if (!r.data.acceptedContract) {
        this.navigate("/contract");
      }
    });
  }
};
</script>
<style>
.home-nav {
  background-color: brown;
}
.home {
  background-color: rgb(196, 66, 66);
}
</style>
