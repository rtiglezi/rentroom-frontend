<template>
  <div class="auth-content" v-on:keyup.enter="submitByKey">
    <div>
      <div class="text-center">
        <span style="color:crimson" class="auth-logo">
          <i class="fa fa-door-open fa-lg"></i> SalaSol
        </span>
      </div>

      <hr />

      <div v-if="!forgotPass" class="text-center">
        <div class="auth-title"></div>

        <div style="color:#333" class="mb-2">
          Login
          <br />Informe seus dados de acesso:
        </div>

        <b-input-group class="mb-2">
          <b-input-group-prepend>
            <span class="input-group-text">
              <i class="fa fa-at fa-lg"></i>
            </span>
          </b-input-group-prepend>
          <b-form-input @keyup="min($event)" v-model="user.email" type="text" placeholder="E-mail" />
        </b-input-group>

        <b-input-group class="mb-3">
          <b-input-group-prepend>
            <span class="input-group-text">
              <i class="fa fa-lock fa-lg"></i>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model="user.password" type="password" placeholder="Senha" />
        </b-input-group>

        <b-button v-if="logando" block variant="danger" disabled class="mb-3">
          <b-spinner small type="grow"></b-spinner>Logando...
        </b-button>
        <b-button v-else block variant="danger" @click="signin" class="mb-3">Entrar</b-button>

        <b-button block variant="info" @click="forgotPass = true" class="mb-3">Esqueci a Senha</b-button>
      </div>

      <div v-if="forgotPass" class="text-center">
        <div v-if="forgotPass" style="color:#333" class="mb-2">
          Redefinir senha.
          <br />Informe seu e-mail:
        </div>

        <b-input-group class="mb-2">
          <b-input-group-prepend>
            <span class="input-group-text">
              <i class="fa fa-at fa-lg"></i>
            </span>
          </b-input-group-prepend>
          <b-form-input v-model="user.email" type="text" placeholder="E-mail" />
        </b-input-group>

        <div :class="lblClass">{{txtLabel}}</div>
        <div class="mt-3">
          <b-button block variant="dark" @click="forgot" class="mb-3">{{ txtButton }}</b-button>
        </div>
        <div>
          <b-button block variant="info" @click="forgotPass = false" class="mb-3">Voltar ao login</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { baseApiUrl, showError, userKey } from "@/global";
import axios from "axios";

export default {
  name: "Auth",
  data: function() {
    return {
      logando: false,
      user: {},
      forgotPass: false,
      queryEmail: "",
      txtButton: "Redefinir Senha",
      txtLabel: "",
      lblClass: ""
    };
  },
  methods: {
    signin() {
      this.logando = true;
      axios
        .post(`${baseApiUrl}/users/authenticate`, this.user)
        .then(res => {
          this.$store.commit("setUser", res.data);
          localStorage.setItem(userKey, JSON.stringify(res.data));
          this.$router.push({ path: "/" });
          this.$toasted.global.defaultSuccess({
            msg: `Bem-vindo, ${res.data.name}.`
          });
        })
        .catch(e => {
          if (e) {
            showError("Credenciais inválidas.");
            this.logando = false;
          }
        });
    },
    forgot() {
      this.txtButton = "Enviando...";
      const email = this.user.email;
      const url = `${baseApiUrl}/users/forgotpass/${email}/localhost:8081`;
      axios
        .get(url)
        .then(() => {
          this.txtLabel = "E-mail enviado. Consulte sua caixa de mensagens.";
          this.txtButton = "Redefinir";
          this.lblClass = "lblSuccess";
        })
        .catch(e => {
          this.txtLabel = `Ocorreu um erro ao tentar eviar o e-mail: ${e.response.data.message}`;
          this.txtButton = "Tentar novamente";
          this.lblClass = "lblErr";
        });
    },
    submitByKey() {
      if (!this.forgotPass) {
        this.signin();
      } else {
        this.forgot();
      }
    },
    min(event) {
      event.target.value = event.target.value.toLowerCase();
    }
  },
  mounted() {
    if (this.$route.query.email) {
      this.forgotPass = true;
      this.email = this.$route.query.email;
      this.user.email = this.$route.query.email;
    }
  }
};
</script>

<style>
.auth-content {
  background-color: white;
  height: 100%;
  width: 100%;
  color: white;
  padding: 0px;
}

.auth-logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.auth-title {
  font-size: 1.2rem;
  font-weight: 100;
  margin-top: 10px;
  margin-bottom: 15px;
}

.forgot {
  color: white;
}

.lblSuccess {
  color: green;
}

.lblErr {
  color: red;
}
</style>
