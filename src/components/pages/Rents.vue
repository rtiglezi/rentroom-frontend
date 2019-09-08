<template>
  <div class="rents">
    <PageTitle main="rents" />

    <b-modal
      v-bind:hide-footer="true"
      id="mymodalconfirm"
      v-model="modalConfirm"
      title="Cancelar esta reserva agora?"
    >
      <b-row>
        <b-col>
          Sala:
          <strong>{{ rent.roomName }}</strong>
          <br />Data:
          <strong>{{ rent.date | moment("DD/MM/YYYY") }}</strong>
          <br />Hora:
          <strong>{{ rent.hour }}h</strong>
          <br />Valor:
          <input
            type="text"
            readonly
            style="background: transparent; border: none; width: 85px"
            v-money="money"
            v-model="valueBR"
          />
        </b-col>
        <b-col>
          <i class="far fa-calendar-times fa-5x" aria-hidden="true"></i>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <hr />Ao clicar no botão de confirmação abaixo você efetivará o cancelamento desta reserva. O valor selecionado será creditado de seu saldo.
          <br />Após confirmar, não será possível reativar esta reserva.
        </b-col>
      </b-row>

      <hr />
      <div class="text-center">
        <b-button class="mr-2" variant="warning" @click="cancel(rent)">OK, cancelar agora.</b-button>
        <b-button @click="clickModalBtnConfirm">Voltar</b-button>
      </div>
    </b-modal>

    <div class="text-center" v-if="totalRows > 0">Total de agendamentos até agora: {{ totalRows }}</div>
    <div class="text-center" v-else>
      Você não tem nenhuma reserva.
      <br />
      <b-button @click="navigate('/')" variant="link">Realizar uma reserva agora.</b-button>
    </div>

    <b-card v-for="rent in rents" :key="rent._id" class="mb-2">
      <div class="rentBox">
        <b-row>
          <b-col cols="2">
            <i class="fa fa-clock fa-2x mt-1"></i>
          </b-col>
          <b-col cols="6" class="mt-1">{{ rent.date | moment("DD/MM/YYYY")  }}</b-col>
          <b-col cols="4" class="mt-1 text-right">{{ rent.hour }}h</b-col>
        </b-row>
      </div>

      <b-row>
        <b-col cols="12">
          <div class="detailsBox">
            <strong>Sala:</strong>
            {{ rent.roomName }}
            <br />
            <strong>Paciente:</strong>
            {{ rent.patient }}
            <br />
            <strong>Obs.:</strong>
            {{ rent.obs }}
          </div>
          <div class="text-right">
            <b-button
              @click="chooseRent(rent)"
              v-b-modal="'mymodalconfirm'"
              variant="link"
              class="mt-1 mb-1 mr-1"
            >Cancelar este agendamento</b-button>
          </div>
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "Rents",
  components: { PageTitle },
  data: function() {
    return {
      valueBR: null,
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false
      },
      totalRows: 0,
      rents: [],
      rent: {},
      modalConfirm: false
    };
  },
  watch: {},
  methods: {
    loadRents() {
      const url = `${baseApiUrl}/rents`;
      axios.get(url).then(res => {
        this.rents = res.data;
        this.totalRows = this.rents.length;
      });
    },
    clickModalBtnConfirm() {
      this.modalConfirm = false;
    },
    chooseRent(rent) {
      this.rent = rent;
      this.valueBR = rent.value.toFixed(2);
    },
    cancel(rent) {
      axios
        .delete(`${baseApiUrl}/rents/${rent._id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess({
            msg: `Reserva cancelada com sucesso.`
          });
          this.loadRents();
          this.clickModalBtnConfirm();
        })
        .catch();
    },
    navigate(link) {
      this.$router.push(link);
    }
  },
  mounted() {
    this.loadRents();
  }
};
</script>

<style>
.rentBox {
  border-radius: 5px;
  background-color: green;
  color: white;
  padding: 3px 10px 3px 10px;
  margin-bottom: 10px;
}
.detailsBox {
  border-radius: 3px;
  background-color: rgba(255, 255, 255, 0.616);
  color: rgba(0, 0, 0, 0.644);
  padding: 3px 10px 3px 10px;
  margin-bottom: 5px;
  font-size: 0.9em;
}
</style>
