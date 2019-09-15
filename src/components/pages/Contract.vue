<template>
  <div class="contract">
    <b-card>
      <div>
        CONTRATO
        <br />
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />Termos do contrato termos do contrato termos do contrato termos do contrato.
        <br />
Termos do contrato termos do contrato termos do contrato termos do contrato.
      </div>
    </b-card>
    <hr />
    <b-form-checkbox v-model="user.acceptedContract" name="isActive">Aceito os termos do contrato</b-form-checkbox>
    <hr />
    <b-button @click="acceptContract" block :disabled="!user.acceptedContract">Continuar</b-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "Home",
  components: {},
  computed: mapState(["user"]),
  data: function() {
    return {};
  },
  methods: {
    acceptContract() {
      const url = `${baseApiUrl}/users/acceptcontract`;
      axios
        .post(url, this.user)
        .then(() => {
          this.$router.push("/");
        })
        .catch();
    }
  },
  mounted() {}
};
</script>
<style>
</style>
