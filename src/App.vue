<template>
  <div id="app">
    <Loading v-if="validatingToken"/>
    <Content v-else/>
  </div>
</template>


<script>
import { userKey } from "@/global";
import { mapState } from "vuex";
import Header from "@/components/template/Header";
import Content from "@/components/template/Content";
import Loading from "@/components/template/Loading";

export default {
  name: "App",
  components: { Header, Content, Loading },
  computed: mapState(["user"]),
  data: function() {
    return {
      validatingToken: true
    };
  },
  methods: {
    async validateToken() {
      this.validatingToken = true;

      const json = localStorage.getItem(userKey);

      const userData = JSON.parse(json);
      this.$store.commit("setUser", null);

      if (!userData) {
        this.validatingToken = false;
        localStorage.removeItem(userKey);
        this.$router.push({ name: "auth" });
      } else {
        this.$store.commit("setUser", userData);
      }

      this.validatingToken = false;
    }
  },
  created() {
    this.validateToken();
  }
};
</script>

<style>
* {
  font-family: "Lato", sans-serif;
}

body {
  margin-left: 0;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  display: grid;
  grid-template-rows: 1fr;
  grid-template-columns: 1fr;
  grid-template-areas:
    "content"
}

.adm-msg-error {
  margin-left: 5px;
  color: #6d630e;
  font-size: 11px;
  font-weight: normal;
  background-color: #fff3cd;
  background-image: url(~@/assets/alert-icon-red.png);
  background-size: 15px 15px;
  background-repeat: no-repeat;
  background-position: 2px;
  padding: 3px;
  border-radius: 5px 5px 5px;
  border: 1px solid #dce0be;
  padding-left: 20px;
  position: relative;
}

.box-out {
  background-color: #eee;
}

.box {
  background-color: rgba(253, 253, 253, 0.9);
  color: black;
  font-weight: 300;
}
.box-ico {
  color: #C82333;
  text-align: center;
}


.table-th {
  background-color: #eee;
  color: black;
  font-weight: 100;
  white-space: nowrap;
}

.table-td {
  background-color: white;
  color: black;
}


.table-td-first {
  background-color: white;
  color: brown;  
}


.layer-total {
  background-color: #C82333;
  color: #333;
  text-align: center;
  font-weight: 100;
  color: white;
}


.input-text {
  border: 1px solid #ccc;
}

.titulo {
text-align:center; 
color: #555; 
font-weight:bold
}

</style>

