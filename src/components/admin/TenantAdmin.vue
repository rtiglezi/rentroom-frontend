<template>
  <div class="tenant-admin">
    <PageTitle main="tenants" />

    <b-modal
      size="lg"
      v-bind:hide-footer="true"
      id="mymodal"
      v-model="modalShow"
      title="Cadastro de Inquilino"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-row>
          <b-col md="3" sm="12" class="box-ico">
            <i class="fa fa-building fa-5x" aria-hidden="true"></i>
            <br />Cadastro de Inquilino
          </b-col>
          <b-col md="9" sm="12">
            <b-form-group label="Apelido do Inquilino *" label-for="tenantAlias">
              <b-form-input
                class="input-text"
                ref="tenantAlias"
                name="Apelido"
                id="tenantAlias"
                v-model="tenant.alias"
                :readonly="mode === 'remove'"
                v-validate="{ required: true, min: 3 }"
              ></b-form-input>
              <span
                ref="spnApelido"
                v-if="showSpanError('Apelido')"
                class="adm-msg-error"
              >{{ errors.first('Apelido') }}</span>
            </b-form-group>

            <b-form-group label="Nome do Inquilino *" label-for="tenantName">
              <b-form-input
                class="input-text"
                ref="tenantName"
                name="Nome"
                id="tenantName"
                v-model="tenant.name"
                :readonly="mode === 'remove'"
                v-validate="{ required: true, min: 3 }"
              ></b-form-input>
              <span
                ref="spnNome"
                v-if="showSpanError('Nome')"
                class="adm-msg-error"
              >{{ errors.first('Nome') }}</span>
            </b-form-group>
          </b-col>
        </b-row>

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
         <div class="titulo">
          Cadastro de Inquilinos
          </div>
        </b-col>
        <b-col md="4"></b-col>
      </b-row>

      <div class="layer-total"><i class="fas fa-building mr-2"></i>{{ totalRows }} registro(s)</div>

      <b-table
        id="my-table"
        :items="tenants"
        :per-page="perPage"
        :current-page="currentPage"
        small
        responsive
        bordered
        stacked
        :filter="filter"
        :fields="items"
        @filtered="onFiltered"
      >

      <template
          slot="created_at"
          slot-scope="row"
        >{{ row.item.created_at | moment("DD/MM/YYYY hh:mm") }}</template>

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

export default {
  name: "tenantAdmin",
  components: { PageTitle },
  data: function() {
    return {
      modalShow: false,
      mode: "save",
      tenants: [],
      tenant: {},
      totalRows: 1,
      filter: null,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      items: [
        {
          key: "alias",
          label: "Apelido:",
          sortable: true,
          thClass: "table-th-first",
          tdClass: "table-td-first"
        },
        {
          key: "name",
          label: "Nome:",
          sortable: true,
          thClass: "table-th",
          tdClass: "table-td"
        },
        {
          key: "created_at",
          label: "Cadastro:",
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
      const url = `${baseApiUrl}/tenants`;
      axios.get(url).then(res => {
        this.tenants = res.data;
        this.totalRows = res.data.length;
      });
    },
    loadResource(tenant, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/tenants/${tenant._id}`;
      axios.get(url).then(res => {
        this.tenant = res.data;
      });
    },
    save() {
      const method = this.tenant._id ? "patch" : "post";
      const id = this.tenant._id ? `/${this.tenant._id}` : "";
      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/tenants${id}`, this.tenant)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.tenant._id;
      axios
        .delete(`${baseApiUrl}/tenants/${id}`)
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
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
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
      this.tenant = {};
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
