import axios from "axios";
import { userKey } from "@/global";

const success = res => res;
const error = err => {
  if (400 === err.response.status) {
    alert("Não foi possível realizar a operação.\n" + err);
  } else if (403 === err.response.status) {
    localStorage.removeItem(userKey);
    window.location = "/";
    alert("A sessão expirou.\nVocê será redirecionado à tela de login.");
  } else {
    return Promise.reject(err);
  }
};

axios.interceptors.response.use(success, error);
