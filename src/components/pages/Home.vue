<template>
  <div>
    <HomeTitle main="home" />
    <b-card>
      <b-button @click="navigate('/rentbyday')" block variant="outline-danger">
        <i class="fa fa-calendar-check fa-lg"></i>
        <br />Pesquisar dia específico
      </b-button>
      <b-button @click="navigate('/rentbyweek')" block variant="outline-danger">
        <i class="fa fa-calendar fa-lg"></i>
        <br />Pesquisar na semana
      </b-button>
      <b-button @click="navigate('/rents')" block variant="outline-info">
        <i class="fa fa-user-clock fa-lg"></i>
        <br />Minhas Reservas
      </b-button>
    </b-card>
  </div>
</template>

<script>
import HomeTitle from "../template/HomeTitle";

export default {
  name: "Home",
  components: { HomeTitle },
  data: function() {
    return {};
  },
  methods: {
    navigate(link) {
      this.$router.push(link);
    }
  },
  mounted() {    
  }
};
</script>
<style>
</style>
