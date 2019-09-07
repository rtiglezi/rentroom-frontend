<template>
  <div class="home">
    <PageTitle main="home" />


    <b-modal v-bind:hide-footer="true" id="mymodalconfirm" v-model="modalConfirm" title="Confirma a Reserva?">
      Ao clicar no botão de confirmação abaixo, você efetivará a reserva e o valor selecionado será debitado de seu saldo.<br />
      Essa reserva poderá ser cancelada em até duas horas antes da hora reservada.  

      <hr>
      <b-button class="mr-2" @click="save" variant="danger">OK, reservar agora!</b-button>
      <b-button @click="clickModalBtnConfirm">Cancelar</b-button>
    
    </b-modal>
   

    <b-modal v-bind:hide-footer="true" id="mymodal" v-model="modalShow" title="Reserva de Sala">
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit">
        <b-row>
          <b-col sm="12">
            <div style="text-align:center" class="mt-2 mb-3">
              Reservando a sala
              <strong>{{ rent.roomName }}</strong>,
              <br />para
              <strong>{{ rent.date | moment("L") }}</strong>,
              às
              <strong>{{ rent.date | moment("HH:mm") }}h</strong>,
              <br />ao valor de
              <strong>
                <input
                  type="text"
                  readonly
                  style="background: transparent; border: none; width: 85px"
                  v-money="money"
                  v-model="valueBR"
                />
              </strong>
              <hr />
            </div>
            <div>
              <b-form-group
                label="Paciente:"
                label-for="rentPatient"
                description="Esta informação só será visível para você."
              >
                <b-form-input
                  class="input-text"
                  ref="rentPatient"
                  id="rentPatient"
                  v-model="rent.patient"
                ></b-form-input>
              </b-form-group>
              <b-form-group
                label="Observações:"
                label-for="rentObs"
                description="Esta informação só será visível para você."
              >
                <b-form-textarea class="input-text" ref="rentObs" id="rentObs" v-model="rent.obs"></b-form-textarea>
              </b-form-group>
            </div>
          </b-col>
        </b-row>

        <div class="text-right">
          <b-button  v-b-modal="'mymodalconfirm'" class="btn-main ml-2" v-if="mode === 'save'">
            <i class="fa fa-send fa-lg"></i>
            Inserir
          </b-button>
          <b-button class="btn-main ml-2" v-if="mode === 'edit'">
            <i class="fas fa-save fa-lg"></i>
            Salvar Edição
          </b-button>
          <b-button variant="danger" class="ml-2" v-if="mode === 'remove'" @click="remove">
            <i class="far fa-trash-alt fa-lg"></i>
            Excluir?
          </b-button>
          <b-button class="ml-2" variant="secondary" @click="clickModalBtn()">Cancelar</b-button>
        </div>
      </b-form>
      <!-- FINAL FORMULÁRIO DE CADASTRO -->
    </b-modal>

    <div style="text-align:center">
      <div class="mb-2">Data desejada:</div>
      <datetime v-model="selectedDate" placeholder="busque a data aqui..."></datetime>
      <hr />
    </div>

    <div v-if="rent.date" style="text-align:center">
      <div class="mb-2">Selecione uma sala:</div>
      <b-button
        :variant="getVariant(item._id)"
        class="mr-1"
        v-for="item in rooms"
        :key="item._id"
        @click="setRoom(item)"
      >{{ item.name }}</b-button>
      <hr />
    </div>
    <div>
      <b-table
        class="mt-3"
        v-if="schedule"
        id="my-table"
        :items="schedule"
        small
        responsive
        bordered
        :fields="items"
      >
        <template slot="hour" slot-scope="row">
          <div v-if="getStatus(row.item.hour) || !row.item.isActive ">
            <div style="color:#bbb">
              <strong>{{ row.item.hour }}</strong>
              <br />(indisponível)
            </div>
          </div>
          <div v-else>
            <div style="color:green">
              <strong>{{ row.item.hour }}</strong>
              <br />(disponível)
            </div>
          </div>
        </template>
        <template slot="actions" slot-scope="row">
          <div v-if="getStatus(row.item.hour)">
            <span style="color:grey; font-size:.9em; font-weight: bold">Reservado</span>
          </div>
          <div v-else>
            <b-button
              v-if="row.item.isActive"
              v-b-modal="'mymodal'"
              size="sm"
              variant="success"
              @click="reserv(row.item.value, row.item.hour)"
            >Reservar a {{ row.item.value }}</b-button>

            <span v-else style="color:grey; font-size: .9em">Desativado pelo locatário</span>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "Home",
  components: { PageTitle },
  data: function() {
    return {
      valueBR: null,
      selectedRoom: null,
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false
      },
      selectedDate: null,
      mode: null,
      rent: {
        date: null,
        room: null,
        roomName: null,
        value: null,
        user: null,
        patient: null,
        obs: null
      },
      modalShow: false,
      modalConfirm: false,
      rooms: [],
      users: [],
      schedule: [],
      items: []
    };
  },
  watch: {
    selectedDate: function(val) {
      this.setDate(val.toString().replace("T00:00:00.000Z", ""));
    }
  },
  methods: {
    loadRooms() {
      const url = `${baseApiUrl}/rooms`;
      axios.get(url).then(res => {
        this.rooms = res.data;
      });
    },
    loadUsers() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
        this.users = res.data;
      });
    },
    setDate(selectedDate) {
      this.selectedDate = selectedDate;
      this.rent.date = this.selectedDate;
      this.schedule = null;
      this.rent.room = null;
    },
    setRoom(room) {
      this.selectedRoom = room;
      this.rent.room = room._id;
      this.rent.roomName = room.name;
      const url = `${baseApiUrl}/rents?room=${room._id}&date=${this.selectedDate}`;
      axios.get(url).then(res => {
        this.rents = res.data;

        this.items = [
          {
            key: "hour",
            label: "Horário",
            class: "text-center",
            sortable: false,
            thClass: "table-th",
            tdClass: "table-td"
          },
          {
            key: "actions",
            label: "Reserva",
            class: "text-center",
            sortable: false,
            thClass: "table-th",
            tdClass: "table-td"
          }
        ];

        this.schedule = room.schedule;
      });
    },
    getStatus(hourReserved) {
      let reserved = false;
      if (this.rents) {
        this.rents.map(r => {
          let hourMap = this.$moment(r.date).format("HH:mm");
          if (hourMap.toString() === hourReserved.toString()) {
            reserved = true;
          }
        });
      }
      return reserved;
    },
    clickModalBtn() {
      this.modalShow = false;
    },
    clickModalBtnConfirm() {
      this.modalConfirm = false;
    },
    formatCurrencyFromRealToMongoNumber(val) {
      val = val
        .replace("R$", "")
        .replace(",", "*")
        .replace(/\./, "")
        .replace("*", ".");
      return val;
    },
    reserv(value, hour) {
      this.mode = "save";
      this.rent.patient = null;
      this.rent.obs = null;
      this.rent.value = this.formatCurrencyFromRealToMongoNumber(value);
      this.rent.date = this.selectedDate + " " + hour;
      this.valueBR = this.rent.value;
    },
    save() {
      axios
        .post(`${baseApiUrl}/rents`, this.rent)
        .then(() => {
          this.$toasted.global.defaultSuccess({
            msg: `Reserva efetuada com sucesso.`
          });
          this.refresh();
          this.setRoom(this.selectedRoom);
        })
        .catch();
    },
    refresh() {
      this.loadRooms();
      this.loadUsers();
      this.clickModalBtn();
      this.clickModalBtnConfirm();
    },
    getVariant(selectedRoom) {
      if (selectedRoom === this.rent.room) {
        return "primary";
      } else {
        return "light";
      }
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style>
</style>
