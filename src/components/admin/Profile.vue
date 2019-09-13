<template>
  <div class="profile">
    <PageTitle main="Meu perfil" />

    <b-modal
      v-bind:hide-footer="true"
      id="mymodalconfirm"
      v-model="modalConfirm"
      title="Confirma o logout?"
    >
      <b-row>
        <b-col>Finalizar a sessão?</b-col>
      </b-row>

      <hr />
      <div class="text-center">
        <b-button class="mr-2" @click="logout" variant="danger">Sim</b-button>
        <b-button @click="clickModalBtnConfirm">Cancelar</b-button>
      </div>
    </b-modal>

    <b-row>
      <b-col>
        <b-card>
          <div>
            <div class="box">Perfil de Usuário</div>
          </div>

          <div>
            <i class="fa fa-user mr-1"></i>
            {{ user.name }}
          </div>
          <div>
            <i class="fa fa-at mr-1"></i>
            {{ user.email }}
          </div>
          <div>
            <i class="fa fa-building mr-1"></i>
            {{ user.tenantAlias }}
          </div>
          <div>
            <i class="fa fa-id-badge mr-1"></i>
            {{ user.profiles }}
          </div>
          <hr>
          <b-button v-b-modal="'mymodalconfirm'" variant="danger" class="ml-2">
            <i class="fa fa-times-circle fa-lg"></i> Sair
          </b-button>
        </b-card>
      </b-col>

      <b-col>
        <b-card>
          <div>
            <div class="box">Troca de Senha</div>
          </div>
          <p>
            Ao clicar no botão abaixo, você será redirecionado à área de reconfiguração de senha.
            <br />Um e-mail será encaminhado ao seu endereço, contendo o link para a tela de alteração.
            <br />A senha atual não sofrerá nenhuma mudança até que a troca seja confirmada no final do procedimento.
            <br />Por motivo de segurança, esta sessão será finalizada. Certifique-se de já ter salvo os seus trabalhos.
          </p>
          <div>
            <b-button @click="goToChangePass()" variant="danger">Ok, iniciar a reconfiguração agora.</b-button>
          </div>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { userKey } from "@/global";
import PageTitle from "../template/PageTitle";

export default {
  name: "Profile",
  data: function() {
    return {
       modalConfirm: false
    };
  },
  computed: mapState(["user"]),
  components: { PageTitle },
  methods: {
    goToChangePass() {
      let email = this.user.email;
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$router.push(`/auth?email=${email}`);
    },
    logout() {
      localStorage.removeItem(userKey);
      this.$store.commit("setUser", null);
      this.$router.push({ name: "auth" });
    },
    clickModalBtnConfirm() {
      this.modalConfirm = false;
    }
  }
};
</script>

<style>
.profile {
  text-align: center;
  border-radius: 5px;
}
.profile .box {
  text-align: center;
  font-size: 30px;
}
</style>
