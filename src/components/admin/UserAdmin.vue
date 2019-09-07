<template>
  <div class="tenant-admin">
    <PageTitle main="users" />

    <b-modal
      size="lg"
      v-bind:hide-footer="true"
      id="mymodal"
      v-model="modalShow"
      title="Cadastro de Usuário"
    >
      <!-- INICIO FORMULÁRIO DE CADASTRO -->
      <b-form v-on:submit.prevent="onSubmit" v-on:keyup.enter="submitByKey">
        <b-row>
          <b-col md="12" sm="12">
            <b-card class="mb-2 box-out">
              <b-row>
                <b-col md="3" sm="12" class="box-ico">
                  <i class="fa fa-users fa-5x" aria-hidden="true"></i>
                  <br />Dados Cadastrais
                </b-col>
                <b-col md="9" sm="12">
                  <b-form-group label="Nome *" label-for="userName">
                    <b-form-input
                      ref="userName"
                      name="Nome"
                      id="userName"
                      class="input-text"
                      v-model="user.name"
                      :readonly="mode === 'remove'"
                      v-validate="{ required: true, min: 3 }"
                    ></b-form-input>
                    <span
                      ref="spnNome"
                      v-if="showSpanError('Nome')"
                      class="adm-msg-error"
                    >{{ errors.first('Nome') }}</span>
                  </b-form-group>

                  <b-form-group label="E-mail *" label-for="user-email">
                    <b-form-input
                      class="input-text"
                      prepend="@"
                      name="E-mail"
                      id="user-email"
                      v-model="user.email"
                      :readonly="mode === 'remove'"
                      v-validate="'required|email'"
                    ></b-form-input>
                    <span
                      v-if="showSpanError('E-mail')"
                      class="adm-msg-error"
                    >{{ errors.first('E-mail') }}</span>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-card>
          </b-col>
          <b-col md="12" sm="12">
            <b-card class="mb-3 box-out">
              <b-row>
                <b-col md="3" sm="12" class="box-ico">
                  <i class="fas fa-key fa-5x" aria-hidden="true"></i>
                  <br />Permissões
                </b-col>

                <b-col md="8" sm="12">
                  <b-row>
                    <b-col>
                      <div>Usuário pertencente à empresa:</div>
                      <b-form-select
                        ref="inquilino"
                        name="Inquilino"
                        id="inquilino"
                        :disabled="mode === 'remove'"
                        v-model="user.tenant"
                        @change="loadRooms($event)"
                        v-validate="{ required: true }"
                      >
                        <option
                          v-for="tenant in tenants"
                          :value="tenant._id"
                          :key="tenant._id"
                        >{{tenant.alias}}</option>
                      </b-form-select>
                      <span
                        v-if="showSpanError('Inquilino')"
                        class="adm-msg-error"
                      >{{ errors.first('Inquilino') }}</span>
                    </b-col>
                  </b-row>
                  <hr />
                  <b-row>
                    <b-col>
                      <b-form-group
                        label="Tem acesso à(s) unidade(s):"
                        label-for="user-allowedRooms"
                      >
                        <b-form-checkbox-group
                          stacked
                          id="user-allowedRooms"
                          v-model="user.allowedRooms"
                          name="rooms"
                        >
                          <b-form-checkbox
                            :disabled="mode === 'remove'"
                            v-for="room in rooms"
                            :key="room._id"
                            :value="room._id"
                          >{{ room.name }}</b-form-checkbox>
                        </b-form-checkbox-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                  <hr />
                  <b-row>
                    <b-col>
                      <b-form-group label="Perfil de acesso:" label-for="user-profiles">
                        <b-form-checkbox-group
                          stacked
                          id="user-profiles"
                          v-model="user.profiles"
                          name="profiles"
                        >
                          <b-form-checkbox disabled value="user">user</b-form-checkbox>
                          <b-form-checkbox
                            :disabled="mode === 'remove'"
                            v-for="profile in profiles"
                            :key="profile.name"
                            :value="profile.name"
                          >{{ profile.name }}</b-form-checkbox>
                        </b-form-checkbox-group>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </b-card>
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
              @click="firstForm"
            >
              <i class="fas fa-plus"></i> Adicionar
            </b-button>
            <b-button class="mb-2 mr-2" variant="outline-secondary" size="sm" v-b-modal="'mymodal'">
              <i class="fas fa-search"></i> Pesquisar
            </b-button>
          </div>
        </b-col>
        <b-col md="4">
          <div class="titulo">Cadastro de Usuários</div>
        </b-col>
        <b-col md="4"></b-col>
      </b-row>

      <div class="layer-total">
        <i class="fas fa-users mr-2"></i>
        {{ totalRows }} registro(s)
      </div>

      <b-table
        id="my-table"
        :items="users"
        :per-page="perPage"
        :current-page="currentPage"
        responsive
        stacked
        small
        :fields="items"
      >
       

        <template slot="tenantDetails" slot-scope="row">
          <div
            v-for="(item, index) in row.item.tenantDetails"
            :key="item.id"
            :index="index"
          >{{row.item.tenantDetails[index].alias}}</div>
        </template>

       

        <template slot="actions" slot-scope="data">
          <b-button v-b-modal="'mymodal'" @click="loadResource(data.item, 'edit')">
            <i class="fas fa-pen-square" title="Editar o registro."></i> Editar
          </b-button>

          <b-button
            v-b-modal="'mymodal'"
            variant="danger"
            class="ml-1"
            @click="loadResource(data.item, 'remove')"
          >
            <i class="far fa-trash-alt" title="Excluir o registro."></i> Excluir
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
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";
import PageTitle from "../template/PageTitle";

export default {
  name: "UserAdmin",
  components: { PageTitle },
  data: function() {
    return {
      profilesLoggedUser: [],
      modalShow: false,
      btnCancelDisabled: false,
      mode: "save",
      rooms: [],
      tenants: [],
      profiles: [],
      user: {
        profiles: ["user"]
      },
      totalRows: 1,
      currentPage: 1,
      perPage: 7,
      pageOptions: [5, 10, 15],
      options: [],
      users: [],
      items: [
        {
          key: "name",
          label: "Usuário:",
          sortable: true,
          class: "text-left",
          thClass: "table-th-first",
          tdClass: "table-td-first"
        },
        {
          key: "email",
          label: "E-mail:",
          sortable: true,
          class: "text-left",
          thClass: "table-th",
          tdClass: "table-td"
        },
        
        {
          key: "actions",
          label: "",
          sortable: false,
          class: "text-center",
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
    loadTenants() {
      const url = `${baseApiUrl}/tenants`;
      axios.get(url).then(res => {
        this.tenants = res.data;

        if (this.tenants.length === 1) {
          this.loadRooms(this.tenants[0]._id);
          this.user.tenant = this.tenants[0]._id;
        }

      });
    },
    loadRooms(tenant) {
      const url = `${baseApiUrl}/rooms?tenant=${tenant}`;
      axios.get(url).then(res => {
        this.rooms = res.data;
      });
    },
    loadResource(user, mode) {
      this.mode = mode;
      const url = `${baseApiUrl}/users/${user._id}`;
      axios.get(url).then(res => {
        this.user = res.data;
        this.loadRooms(this.user.tenant);
      });
    },
    save() {
      const method = this.user._id ? "patch" : "post";
      const id = this.user._id ? `/${this.user._id}` : "";

      if (this.mode === "save") {
        let aleatoryPass = Math.floor(Math.random() * 99999999);
        this.user.password = aleatoryPass;
      }

      this.$validator.validateAll().then(success => {
        if (!success) {
          return;
        }
        axios[method](`${baseApiUrl}/users${id}`, this.user)
          .then(() => {
            this.refresh();
          })
          .catch();
      });
    },
    remove() {
      const id = this.user._id;
      axios
        .delete(`${baseApiUrl}/users/${id}`)
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
    loadResources() {
      const url = `${baseApiUrl}/users`;
      axios.get(url).then(res => {
        this.users = res.data;
        this.totalRows = res.data.length;
      });
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
      this.firstForm();
    },

    submitByKey() {
      if (this.mode === "save" || this.mode === "edit") {
        this.save();
      } else if (this.mode === "remove") {
        this.remove();
      }
    },

    firstForm() {
      this.clickModalBtn();
      this.mode = "save";
      this.loadTenants();
      this.loadResources();
      this.getProfilesLoggedUser();

      if (this.profilesLoggedUser.indexOf("master") != -1) {
        this.profiles = [{ name: "admin" }];
      } else {
        this.profiles = [];
      }

      this.user = {
        profiles: ["user"]
      };
    },

    getProfilesLoggedUser() {
      let loggedUser = JSON.parse(localStorage.getItem(userKey));
      this.profilesLoggedUser = loggedUser.profiles;
    }
  },
  mounted() {
    this.firstForm();
  }
};
</script>

<style>
</style>
