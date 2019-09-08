<template>
  <div class="tenant-admin">
    <PageTitle main="balances" />

    <!-- INÍCIO DA LISTA -->
    <div>
      <b-row>
        <b-col md="4">
          <div style="text-align:left">
            <b-button class="mb-2 mr-2" variant="link" v-b-modal="'mymodal'"></b-button>
          </div>
        </b-col>
        <b-col md="4">
          <div class="titulo">Listas de saldos</div>
        </b-col>
        <b-col md="4"></b-col>
      </b-row>

      <div class="layer-total">
        <i class="fas fa-hand-holding-usd mr-2"></i>
        {{ totalRows }} registro(s)
      </div>

      <b-table
        id="my-table"
        :items="balances"
        :per-page="perPage"
        :curbalance-page="curbalancePage"
        responsive
        small
        stacked
        :fields="items"
      ></b-table>
    </div>

    <b-row>
      <b-col>
        <b-pagination
          small
          align="right"
          v-model="curbalancePage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
      </b-col>
    </b-row>

    <!-- FINAL DA LISTA -->
  </div>
</template>

<script>
import { baseApiUrl } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  name: "BalanceAdmin",
  components: { PageTitle },
  data: function() {
    return {
      balances: [],
      totalRows: 1,
      curbalancePage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      items: [
        {
          key: "date",
          label: "Data:",
          sortable: true,
          class: "text-left",
          thClass: "table-th-first",
          tdClass: "table-td-first"
        },
        {
          key: "value",
          label: "Valor:",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        }
      ]
    };
  },
  methods: {
    loadBalances() {
      const url = `${baseApiUrl}/balances`;
      axios.get(url).then(res => {
        this.balances = res.data;
        this.totalRows = this.balances.length;
      });
    }
  },
  mounted() {
    this.loadBalances();
  }
};
</script>

<style>
</style>
