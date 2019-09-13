<template>
  <div class="home">
    <HomeTitle main="home" />
    <b-card>
      <b-button @click="navigate('/rentbyday')" block variant="info">
        <i class="fa fa-calendar-check fa-lg"></i>
        <br />Pesquisa por dia
      </b-button>
      <b-button @click="navigate('/rentbyweek')" block variant="danger">
        <i class="fa fa-calendar fa-lg"></i>
        <br />Pesquisa por semana
      </b-button>

      <b-button @click="navigate('/rents')" block variant="success">
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
  mounted() {}
};
</script>
<style>
</style>
