import Vue from 'vue'
import Toasted from 'vue-toasted'

Vue.use(Toasted, {
    iconPack: 'fontawesome',
    duration: 3500,
    position: "bottom-center",
    theme: "bubble"
})

Vue.toasted.register(
    'defaultSuccess', 
    payload => !payload.msg ? 'Operação realizada com sucesso!' : payload.msg,
    { type: 'success', icon: 'check' }
)

Vue.toasted.register(
    'defaultError', 
    payload => !payload.msg ? 'Oops... Erro inesperdado.' : payload.msg,
    { type: 'error', icon: 'times' }
)

Vue.toasted.register(
    'defaultInfo', 
    payload => !payload.msg ? 'Tudo certo! Pode prosseguir.' : payload.msg,
    { type: 'info', icon: 'info' }
)

Vue.toasted.register(
    'defaultWarning', 
    payload => !payload.msg ? 'Tudo certo! Pode prosseguir.' : payload.msg,
    { type: 'warning', icon: 'warning' }
)
