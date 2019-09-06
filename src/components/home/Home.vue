<template>
  <div class="home">
    <PageTitle main="home" />
    <b-modal v-bind:hide-footer="true" id="mymodal" v-model="modalShow" title="Reserva de Sala">
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit">
        <b-row>
          <b-col md="3" sm="12" class="box-ico">
            <i class="fa fa-building fa-2x" aria-hidden="true"></i>
            Reserva da sala
            <strong>{{ rent.roomName }}</strong>
          </b-col>
          <b-col md="9" sm="12">
            <div style="text-align:center" class="mt-2 mb-3">
              Data:
              <strong>{{ rent.date }}</strong>
              | Hora:
              <strong>{{ rent.hour }}</strong>
              | Valor:
              <strong>{{ rent.value }}</strong>
            </div>
            <div>
              <b-form-group label="Profissional:" label-for="rentUser">
                <b-form-select ref="rentUser" id="rentUser" v-model="rent.user">
                  <option v-for="user in users" :value="user._id" :key="user._id">{{user.name}}</option>
                </b-form-select>
              </b-form-group>

              <b-form-group label="Paciente:" label-for="rentPatient">
                <b-form-input
                  class="input-text"
                  ref="rentPatient"
                  id="rentPatient"
                  v-model="rent.patient"
                ></b-form-input>
              </b-form-group>
              <b-form-group label="Observações:" label-for="rentObs">
                <b-form-textarea class="input-text" ref="rentObs" id="rentObs" v-model="rent.obs"></b-form-textarea>
              </b-form-group>
            </div>
          </b-col>
        </b-row>

        <div class="text-right">
          <b-button class="btn-main ml-2" v-if="mode === 'save'" @click="save">
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

    <b-form-group label="Informe a data:" label-for="date">
      <b-form-input type="date" ref="date" id="date" class="input-text" @change="setDate($event)"></b-form-input>
    </b-form-group>

    <div v-if="rent.date" style="text-align:center">
      Selecione a sala:
      <br />
      <b-button
        class="mr-1"
        v-for="item in rooms"
        :key="item._id"
        @click="setRoom(item._id, item.name)"
      >{{ item.name }}</b-button>
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
          <div v-if="getStatus(row.item.hour)">
            <div style="color:red">
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
            <b-button size="sm" variant="danger" disabled>Horário já reservado</b-button>
          </div>
          <div v-else>
            <b-button
              v-b-modal="'mymodal'"
              size="sm"
              variant="success"
              @click="reserv(row.item.value, row.item.hour)"
            >Reservar a R$ {{ row.item.value.toFixed(2) }}</b-button>
          </div>
        </template>
        <template slot="value" slot-scope="row">{{row.item.value.toFixed(2)}}</template>
      </b-table>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl, showError } from "@/global";
import axios from "axios";

export default {
  name: "Home",
  components: { PageTitle },
  data: function() {
    return {
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
      rooms: [],
      users: [],
      schedule: [],
      items: []
    };
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
    setRoom(room, roomName) {
      this.rent.room = room;
      this.rent.roomName = roomName;
      const url = `${baseApiUrl}/rents?room=${room}&date=${this.selectedDate}`;
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

        this.schedule = [
          {
            hour: "04:00",
            value: 15.0
          },
          {
            hour: "05:00",
            value: 20.0
          },
          {
            hour: "06:00",
            value: 25.0
          },
          {
            hour: "07:00",
            value: 30.0
          },
          {
            hour: "08:00",
            value: 30.0
          },
          {
            hour: "09:00",
            value: 30.0
          },
          {
            hour: "10:00",
            value: 30.0
          },
          {
            hour: "11:00",
            value: 25.0
          },
          {
            hour: "12:00",
            value: 25.0
          },
          {
            hour: "13:00",
            value: 25.0
          },
          {
            hour: "14:00",
            value: 25.0
          },
          {
            hour: "15:00",
            value: 25.0
          },
          {
            hour: "16:00",
            value: 30.0
          },
          {
            hour: "17:00",
            value: 30.0
          },
          {
            hour: "18:00",
            value: 35.0
          },
          {
            hour: "19:00",
            value: 35.0
          },
          {
            hour: "20:00",
            value: 30.0
          },
          {
            hour: "21:00",
            value: 25.0
          },
          {
            hour: "22:00",
            value: 20.0
          },
          {
            hour: "23:00",
            value: 20.0
          }
        ];
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
    reserv(value, hour) {
      this.mode = "save";
      this.rent.value = value;
      this.rent.date = this.selectedDate + " " + hour;
    },
    save() {
      axios
        .post(`${baseApiUrl}/rents`, this.rent)
        .then(() => {
          this.$toasted.global.defaultSuccess({
            msg: `Reserva efetuada com sucesso.`
          });
          this.refresh();
          this.setRoom(this.rent.room, this.rent.roomName);
        })
        .catch();
    },
    refresh() {
      this.loadRooms();
      this.loadUsers();
      this.clickModalBtn();
    }
  },
  mounted() {
    this.refresh();
  }
};
</script>

<style>
</style>
