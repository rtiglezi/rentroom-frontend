<template>
  <div class="admin">
    <PageTitle main="Administrar o sistema" />
    <b-card>
      <b-button  v-if="user.profiles.indexOf('master')!=-1" @click="navigate('/admin/tenants')" block variant="outline-danger">
        <i class="fa fa-building fa-lg"></i>
        <br />Inquilinos
      </b-button>
      <b-button @click="navigate('/admin/users')" block variant="outline-danger">
        <i class="fa fa-user fa-lg"></i>
        <br />Usuários
      </b-button>
      <b-button @click="navigate('/admin/rooms')" block variant="outline-danger">
        <i class="fa fa-building fa-lg"></i>
        <br />Salas
      </b-button>
    </b-card>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: { PageTitle },
  computed: mapState(["user"]),
  data: function() {
    return {};
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
</style>
