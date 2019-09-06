<template>
  <div class="header">
    <b-navbar toggleable="lg" type="dark" class="header-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title">
        <img src="@/assets/c-proc.png" alt="Logo" width="30" />ceproc
      </b-navbar-brand>

      <span class="client">[{{ user.tenantAlias }}]</span>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form class="mr-5">
            
            <span style="color: white" class="mr-2">Pesquisar:</span>
            
            <b-form-input
              style="border-width:2px; 
                     border-color: #C8A741; 
                     border-radius: 3px;"
              class="mr-1"
              placeholder="número do processo..."
            ></b-form-input>

            <b-button style="background-color: orange">
              <i class="fas fa-search"></i>
            </b-button>

          </b-nav-form>

          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <i class="fa fa-user admin-icon"></i>
              {{ user.name }}
            </template>
            <b-dropdown-item href="#" @click="navigate('/admin/users/profile')">
              <i class="fa fa-user-circle admin-icon"></i> Perfil
            </b-dropdown-item>
            <b-dropdown-item href="#" @click="logout()">
              <i class="fas fa-sign-out-alt admin-icon"></i> Sair
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
import { userKey } from "@/global";
import { mapState } from "vuex";

export default {
  name: "Header",
  computed: mapState(["user"]),
  props: {
    title: String
  },
  data: function() {
    return {
      divisions: []
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
  }
};
</script>

<style>
.header {
  background-color: #ccc;
}
.header-nav {
  z-index: 2;
  background-color: #006999;
}
.header-title {
  font-weight: bold;
}
.header .admin-icon {
  color: #c8a741;
}
.header .client {
  text-align: center;
  color: white;
  font-weight: bold;
}
</style>
