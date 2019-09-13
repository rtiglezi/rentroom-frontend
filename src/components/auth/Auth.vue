<template>
  <div class="auth-content" v-on:keyup.enter="submitByKey">
    <div>
      <div class="text-center">
        <span class="auth-logo">
          <i class="fa fa-door-open fa-lg"></i> Salafácil
          </span>
      </div>

      <hr />

       <div v-if="!forgotPass" class="text-center">
        <div class="auth-title">Login</div>

        <b-form-group>
          <b-form-input v-model="user.email" type="text" placeholder="E-mail" />
        </b-form-group>

        <b-form-group>
          <b-form-input
            v-if="!forgotPass"
            v-model="user.password"
            type="password"
            placeholder="Senha"
          />
        </b-form-group>

        <b-button variant="dark" @click="signin" class="mb-3">Entrar</b-button>
        <div>
          <a class="forgot" href="#" @click="forgotPass = true">Esqueci a senha</a>
        </div>
      </div>

      <div v-if="forgotPass" class="text-center">
        <div class="auth-title">Redefinir a Senha</div>
        <b-form-input v-model="user.email" type="text" placeholder="E-mail" />
        <div :class="lblClass">{{txtLabel}}</div>
        <div class="mt-3">
          <b-button variant="dark" @click="forgot" class="mb-3">{{ txtButton }}</b-button>
        </div>
        <div>
          <a class="forgot" href="#" @click="forgotPass = false">Voltar ao login</a>
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
      user: {},
      forgotPass: false,
      queryEmail: "",
      txtButton: "Redefinir",
      txtLabel: "",
      lblClass: ""
    };
  },
  methods: {
    signin() {
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
  background-color: #C82333;
  height: 100%;
  width: 100%;
  color: white;
  padding: 25px;
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
</style>
