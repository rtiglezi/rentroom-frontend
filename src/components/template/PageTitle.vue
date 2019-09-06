<template>
  <div class="header pb-2 mb-2">
    <b-navbar toggleable="lg" type="dark" class="header-nav" v-if="user">
      <b-navbar-brand href="#" class="header-title"  @click="navigate('/')">
        RentRoom
      </b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-3">
          <b-nav-item-dropdown left>
            <!-- Using 'button-content' slot -->
            <template slot="button-content">
              <i class="fa fa-cogs admin-icon mr-1"></i>
              <span style="color:#eee">Administração</span>
            </template>
            <b-dropdown-item
              v-if="user.profiles.indexOf('master')!=-1"
              href="#"
              @click="navigate('/admin/tenants')"
            >
              <i class="fa fa-building menu-icon"></i> Inquilinos
            </b-dropdown-item>
            <b-dropdown-item
              v-if="user.profiles.indexOf('admin')!=-1"
              href="#"
              @click="navigate('/admin/users')"
            >
              <i class="fa fa-users menu-icon"></i> Usuários
            </b-dropdown-item>
            <b-dropdown-item
              v-if="user.profiles.indexOf('admin')!=-1"
              href="#"
              @click="navigate('/admin/rooms')"
            >
              <i class="far fa-building menu-icon"></i> Salas
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>


        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          

          <b-nav-item-dropdown right>
            <template slot="button-content">
              <i class="fa fa-user admin-icon mr-1"></i>
              <span style="color:#eee">{{ user.name }}</span>
            </template>
            <b-dropdown-item href="#" @click="navigate('/admin/users/profile')">
              <i class="fa fa-user-circle menu-icon"></i> Perfil
            </b-dropdown-item>
            <b-dropdown-item href="#" @click="logout()">
              <i class="fas fa-sign-out-alt menu-icon"></i> Sair
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
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
    },

    getClass(main, button) {
      if (main == button) {
        return "isThePageClass";
      } else {
        return "isNotThePageClass";
      }
    },

    loadrooms() {
      const url = `${baseApiUrl}/rooms`;
      axios.get(url).then(res => {
        this.rooms = res.data;
      });
    },

    changeroom(room) {
      let userObj = {
        lastroom: room
      };
      const url = `${baseApiUrl}/users/${this.user._id}/changeroom`;
      axios.patch(url, userObj).then(() => {
        this.navigate("/redirection/room");
      });
    },

    emitUserToParent() {
      let passedParam = "mine";
      if (passedParam) {
        this.$router.push({ name: "process", params: { passedParam } });
        this.$emit("childToParent", passedParam);
      }
    },

    emitNumberToParent(passedParam) {
      if (passedParam) {
        this.$router.push({ name: "process", params: { passedParam } });
        this.$emit("childToParent", passedParam);
        this.number = "";
      } else {
        this.$toasted.global.defaultWarning({
          msg: `Informe algum parâmetro de busca: número do processo, cidade ou solicitante.`
        });
      }
    }
  },
  mounted() {
    if (this.user) {
      this.loadrooms();
    }
  }
};
</script>

<style>
.header {
  background-color: #eee;
}
.header-nav {
  z-index: 2;
  background-color: #C82333;
}
.header-title {
  font-weight: bold;
}
.header .admin-icon {
  color: yellow;
}
.header .menu-icon {
  color: black;
}
</style>
