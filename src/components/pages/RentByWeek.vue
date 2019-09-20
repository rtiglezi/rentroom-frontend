<template>
  <div class="rentByWeek">
    <PageTitle main="Pesquisar na semana" />

    <b-modal
      v-bind:hide-footer="true"
      id="mymodalconfirm"
      v-model="modalConfirm"
      title="Confirma a Reserva?"
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
        <b-col class="box-ico">
          <i class="far fa-calendar-check fa-5x" aria-hidden="true"></i>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <hr />Ao clicar no botão de confirmação abaixo você efetivará essa reserva. O valor selecionado será debitado de seu saldo.
          <br />Após confirmar, o cancelamento será possível em até duas horas antes da hora reservada.
        </b-col>
      </b-row>

      <hr />
      <div class="text-center">
        <b-button class="mr-2" variant="danger" @click="save">OK, reservar agora!</b-button>
        <b-button @click="clickModalBtnConfirm">Cancelar</b-button>
      </div>
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
              <strong>{{ rent.date | moment("DD/MM/YYYY") }}</strong>,
              às
              <strong>{{ rent.hour }}h</strong>,
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
                label="Paciente (opcional):"
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
                label="Observações (opcional):"
                label-for="rentObs"
                description="Esta informação só será visível para você."
              >
                <b-form-textarea class="input-text" ref="rentObs" id="rentObs" v-model="rent.obs"></b-form-textarea>
              </b-form-group>
            </div>
          </b-col>
        </b-row>

        <div class="text-right">
          <b-button variant="danger" v-b-modal="'mymodalconfirm'" class="btn-main ml-2" v-if="mode === 'save'">
            <i class="fa fa-check fa-lg"></i>
            Prosseguir
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
      <div class="mb-2">
        <i class="far fa-building"></i> Escolha uma sala:
      </div>
      <b-button
        :variant="getVariant(item._id)"
        class="mr-1"
        v-for="item in rooms"
        :key="item._id"
        @click="setRoom(item)"
      >{{ item.name }}</b-button>
     
      <div v-if="rentEnabled" class="mt-4 mb-2">
        <b-button @click="previousWeek()" variant="outline-danger" size="sm">
          <i class="fas fa-arrow-left"></i> semana anterior
        </b-button>
        <b-button class="ml-2" @click="nextWeek()" variant="outline-danger" size="sm">
          próxima semana
          <i class="fas fa-arrow-right"></i>
        </b-button>
      </div>

      <div class="container">
        <div v-if="rentEnabled" class="tabContainer" id="lista">
          <table>
            <thead>
              <tr style="background-color:grey; color: white; font-size: .9em">
                <td>[Hr]</td>
                <td class="tabela-coluna1" v-for="itemCol in daysOnWeek" :key="itemCol">
                  <div v-if="isItToday(itemCol)" style="color:white; background-color: #333">
                    {{ getWeekDayName(itemCol) }} <br>
                    {{ itemCol | moment("DD") }} <br>
                    {{ getMonthName(itemCol) }}<br>
                    {{ itemCol | moment("YYYY") }}
                  </div>
                  <div v-else>
                    {{ getWeekDayName(itemCol) }} <br>
                    {{ itemCol | moment("DD") }} <br>
                    {{ getMonthName(itemCol) }}<br>
                    {{ itemCol | moment("YYYY") }}
                  </div>
                </td>
              </tr>
            </thead>
          </table>

          <div class="scrollContainer">
            <table border="0">
              <tbody>
                <tr v-for="itemRow in schedule" :key="itemRow.hour">
                  <td
                    class="tabela-coluna0"
                    style="background-color: grey; color: white; font-size: .9em"
                  >{{ itemRow.hour.substring(0,2) }}h</td>
                  <td class="tabela-coluna1" v-for="itemCol in daysOnWeek" :key="itemCol">
                    <i
                      v-if="getStatus(itemRow.hour, itemCol)"
                      class="fa fa-calendar-check fa-2x unavaiable"
                    ></i>
                    <i
                      v-else-if="!itemRow.isActive"
                      class="fa fa-calendar-check fa-2x inactive"
                    ></i>
                    <i
                      v-else
                      @click="reserv(itemRow.value, itemRow.hour, itemCol)"
                      v-b-modal="'mymodal'"
                      class="fa fa-calendar-check fa-2x avaiable"
                    ></i>
                    <br />
                    <div style="font-size: .7em">{{ itemRow.value }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageTitle from "../template/PageTitle";
import { baseApiUrl } from "@/global";
import axios from "axios";

export default {
  name: "RentByWeek",
  components: { PageTitle },
  data: function() {
    return {
      rentEnabled: false,
      today: new Date(),
      daysOnWeek: [],
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
    setDate() {
      this.schedule = null;
      this.rent.room = null;
    },
    setRoom(room) {
      this.daysOnWeek = [];
      this.selectedRoom = room;
      this.rent.room = room._id;
      this.rent.roomName = room.name;
      this.getWeek(room);
    },
    getStatus(hourReserved, day) {
      let reserved = false;
      if (this.rents) {
        this.rents.map(r => {
          let hourMap = r.hour;
          if (hourMap.toString() === hourReserved.toString() && day == r.date) {
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
    reserv(value, hour, date) {
      this.mode = "save";
      this.rent.patient = null;
      this.rent.obs = null;
      this.rent.value = this.formatCurrencyFromRealToMongoNumber(value);
      this.rent.date = date;
      this.rent.hour = hour;
      this.valueBR = this.rent.value;
    },
    save() {
      this.rent.roomName = this.selectedRoom.name;
      axios
        .post(`${baseApiUrl}/rents`, this.rent)
        .then(() => {
          this.$toasted.global.defaultSuccess({
            msg: `Reserva efetuada com sucesso.`
          });
          this.setRoom(this.selectedRoom);
          this.refresh();
        })
        .catch();
    },
    refresh() {
      this.loadRooms();
      this.clickModalBtn();
      this.clickModalBtnConfirm();
    },
    getVariant(selectedRoom) {
      if (selectedRoom === this.rent.room) {
        return "secondary";
      } else {
        return "outline-secondary";
      }
    },
    getWeek(room) {
      let today = this.today;

      let weekDay = today.getDay();

      let initialDate = null;

      if (weekDay == 0) {
        initialDate = today;
      } else if (weekDay == 1) {
        initialDate = today.setDate(today.getDate() - 1);
      } else if (weekDay == 2) {
        initialDate = today.setDate(today.getDate() - 2);
      } else if (weekDay == 3) {
        initialDate = today.setDate(today.getDate() - 3);
      } else if (weekDay == 4) {
        initialDate = today.setDate(today.getDate() - 4);
      } else if (weekDay == 5) {
        initialDate = today.setDate(today.getDate() - 5);
      } else if (weekDay == 6) {
        initialDate = today.setDate(today.getDate() - 6);
      }

      let finalDate = new Date(initialDate).setDate(
        new Date(initialDate).getDate() + 6
      );

      let dt = new Date(initialDate);

      for (let x = 1; x < 8; x++) {
        this.daysOnWeek.push(this.$moment(dt).format("YYYY-MM-DD"));
        dt = new Date(dt.setDate(dt.getDate() + 1));
      }

      initialDate = this.$moment(new Date(initialDate)).format("YYYY-MM-DD");
      finalDate = this.$moment(new Date(finalDate)).format("YYYY-MM-DD");

      const url = `${baseApiUrl}/rents?room=${room._id}&dates=${this.daysOnWeek}`;

      console.log(url)

      axios.get(url).then(res => {
        this.rents = res.data;
        this.schedule = room.schedule;
        this.rentEnabled = true;
      });
    },
    getWeekDayName(val) {
      let weekDayName = "";
      let n = this.$moment(val).format("E");
      if (n == 7) {
        weekDayName = "D";
      }
      if (n == 1) {
        weekDayName = "S";
      }
      if (n == 2) {
        weekDayName = "T";
      }
      if (n == 3) {
        weekDayName = "Q";
      }
      if (n == 4) {
        weekDayName = "Q";
      }
      if (n == 5) {
        weekDayName = "S";
      }
      if (n == 6) {
        weekDayName = "S";
      }
      return weekDayName;
    },
     getMonthName(val) {
      let monthName = "";
      let n = this.$moment(val).format("MM");
      if (n == 1) {
        monthName = "Jan";
      }
       if (n == 2) {
        monthName = "Fev";
      }
       if (n == 3) {
        monthName = "Mar";
      }
       if (n == 4) {
        monthName = "Abr";
      }
       if (n == 5) {
        monthName = "Mai";
      }
       if (n == 6) {
        monthName = "Jun";
      }
       if (n == 7) {
        monthName = "Jul";
      }
       if (n == 8) {
        monthName = "Ago";
      }
       if (n == 9) {
        monthName = "Set";
      }
       if (n == 10) {
        monthName = "Out";
      }
       if (n == 11) {
        monthName = "Nov";
      }
       if (n == 12) {
        monthName = "Dez";
      }
      return monthName;
    },
    previousWeek() {
      this.today = this.today.setDate(this.today.getDate() - 7);
      this.today = new Date(this.today);
      this.setRoom(this.selectedRoom);
      this.refresh();
    },
    nextWeek() {
      this.today = this.today.setDate(this.today.getDate() + 7);
      this.today = new Date(this.today);
      this.setRoom(this.selectedRoom);
      this.refresh();
    },
    isItToday(dt) {
      let today = new Date();
      if (
        dt.toString() ===
        this.$moment(today)
          .format("YYYY-MM-DD")
          .toString()
      ) {
        return true;
      }
    }
  },
  mounted() {
    this.refresh();
    this.getWeek();
  }
};
</script>
<style>
.inputDate {
  background-color: white;
  border-color: brown;
}

table {
  margin: 0px;
}

table,
th,
td {
  border-collapse: collapse;
}

th {
  border-top: 1px solid #000000;
}

th,
td {
  border-bottom: 1px solid #000000;
  border-right: 1px solid #000000;
  padding: 0px;
}

th span,
td span {
  display: block;
  padding: 3px;
}

#lista table {
  width: 330px;
}

#lista th {
  color: #ffffff;
  background-color: #e92345;
  text-align: left;
}

#lista.tabContainer {
  border: 1px solid #000000;
  border-right: 1px;
  border-top: 0px;
}

.container {
  width: 90vw;
  height: 300px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

#lista .scrollContainer {
  width: 350px;
  height: 210px;
  overflow: auto;
}

#lista .tabela-coluna1 {
  width: 90px;
  padding-top: 2px;
}

.unavaiable {
  color: rgba(165, 42, 42, 0.13);
}
.avaiable {
  color: brown;
  cursor: pointer;
}
.inactive {
  color: #ddd;
}

</style>
