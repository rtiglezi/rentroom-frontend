<template>
  <div class="room-admin">
    <PageTitle main="rooms" />
    <b-modal
      size="lg"
      v-bind:hide-footer="true"
      id="mymodal"
      v-model="modalShow"
      title="Cadastro de Sala"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-row>
          <b-col md="3" sm="12" class="box-ico">
            <i class="far fa-building fa-5x" aria-hidden="true"></i>
            <br />Cadastro de Sala
          </b-col>
          <b-col md="9" sm="12">
            <b-form-group label="Nome da Sala *" label-for="roomName">
              <b-form-input
                class="input-text"
                ref="roomName"
                name="Nome"
                id="roomName"
                v-model="room.name"
                :readonly="mode === 'remove'"
                v-validate="{ required: true, min: 3 }"
              ></b-form-input>
              <span
                ref="spnNome"
                v-if="showSpanError('Nome')"
                class="adm-msg-error"
              >{{ errors.first('Nome') }}</span>
            </b-form-group>

            <b-form-group label="Valor de locação *" label-for="roomValue">
              <input v-model="room.value" v-money="money" />
            </b-form-group>

            <b-form-checkbox v-model="room.isActive" name="isActive">Sala ativa para locação</b-form-checkbox>
          </b-col>
        </b-row>

        <br />

        <div class="text-right">
          <b-button class="btn-main ml-2" v-if="mode === 'save'" @click="save">
            <i class="fa fa-send fa-lg"></i>
            Inserir
          </b-button>
          <b-button class="btn-main ml-2" v-if="mode === 'edit'" @click="save">
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

    <!-- INÍCIO DA LISTA -->
    <div>
      <b-row>
        <b-col md="4">
          <div style="text-align:left">
            <b-button
              class="mb-2 mr-2"
              variant="outline-secondary"
              size="sm"
              v-b-modal="'mymodal'"
              @click="clearForm"
            >
              <i class="fas fa-plus"></i> Adicionar
            </b-button>
            <b-button
              class="mb-2 mr-2"
              variant="outline-secondary"
              size="sm"
              v-b-modal="'mymodal'"
              @click="clearForm"
            >
              <i class="fas fa-search"></i> Pesquisar
            </b-button>
          </div>
        </b-col>
        <b-col md="4">
          <div class="titulo">Cadastro de Salas</div>
        </b-col>
        <b-col md="4"></b-col>
      </b-row>

      <div class="layer-total">
        <i class="far fa-building mr-2"></i>
        {{ totalRows }} registro(s)
      </div>

      <b-table
        id="my-table"
        :items="rooms"
        :per-page="perPage"
        :current-page="currentPage"
        small
        stacked
        responsive
        bordered
        :fields="items"
      >
        <template
          slot="created_at"
          slot-scope="row"
        >{{ row.item.created_at | moment("DD/MM/YYYY hh:mm") }}</template>

        <template slot="value" slot-scope="row">R$ {{ row.item.value }}</template>

        <template slot="actions" slot-scope="data">
          <b-button v-b-modal="'mymodal'" @click="loadResource(data.item, 'edit')">
            <i class="fas fa-pen-square" title="Editar o registro."></i>
          </b-button>

          <b-button
            v-b-modal="'mymodal'"
            variant="danger"
            class="ml-1"
            @click="loadResource(data.item, 'remove')"
          >
            <i class="far fa-trash-alt" title="Excluir o registro."></i>
          </b-button>
        </template>
      </b-table>
    </div>

    <b-row>
      <b-col>
        <b-pagination
          small
          align="right"
          v-model="currentPage"
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
import { baseApiUrl, showError } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";
import { Money } from "v-money";

export default {
  name: "roomAdmin",
  components: { PageTitle, Money },
  data: function() {
    return {
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false
      },

      modalShow: false,
      mode: "save",
      rooms: [],
      room: {
        isActive: true
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      items: [
        {
          key: "name",
          label: "Sala:",
          sortable: true,
          thClass: "table-th-first",
          tdClass: "table-td-first"
        },
        {
          key: "value",
          label: "Valor:",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "isActive",
          label: "Ativo?",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "actions",
          label: "Ações:",
          sortable: false,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        }
      ]
    };
  },
  methods: {
    clickModalBtn() {
      this.modalShow = false;
    },
    loadResources() {
      const url = `${baseApiUrl}/rooms`;
      axios.get(url).then(res => {
        this.rooms = res.data;
        this.totalRows = res.data.length;
      });
    },
    loadResource(room, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/rooms/${room._id}`;
      axios.get(url).then(res => {
        this.room = res.data;
        this.room.value = this.room.value.toFixed(2);
      });
    },
    save() {
      let val = this.room.value;
      val = val
        .replace("R$ ", "")
        .replace(/\./g, "")
        .replace(/,/g, ".");

      this.room.value = val;

      const method = this.room._id ? "patch" : "post";
      const id = this.room._id ? `/${this.room._id}` : "";
      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/rooms${id}`, this.room)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.room._id;
      axios
        .delete(`${baseApiUrl}/rooms/${id}`)
        .then(() => {
          this.refresh();
        })
        .catch(showError);
    },
    showSpanError(campo) {
      let obj = this.errors.items;
      let index = obj.findIndex(val => val.field == campo);
      if (index < 0) {
        return false;
      } else {
        return true;
      }
    },
    refresh() {
      switch (this.mode) {
        case "save":
          this.$toasted.global.defaultSuccess({
            msg: `Registro inserido com sucesso. ${this.totalRows +
              1} registro(s) até agora.`
          });
          break;
        case "edit":
          this.$toasted.global.defaultSuccess({
            msg: "Registro editado com sucesso."
          });
          break;
        case "remove":
          this.$toasted.global.defaultSuccess({
            msg: "Registro excluído do sistema com sucesso."
          });
          break;
      }
      this.clearForm();
    },
    clearForm() {
      this.clickModalBtn();
      this.loadResources();
      this.room = {
        isActive: true
      };
      this.mode = "save";
    },
    submitByKey() {
      if (this.mode === "save" || this.mode === "edit") {
        this.save();
      } else if (this.mode === "remove") {
        this.remove();
      }
    }
  },
  mounted() {
    if (!this.mode) {
      this.mode = "save";
    }
    this.loadResources();
  }
};
</script>

<style>
</style>