import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.scss";
import { createStore } from "vuex";
import { vfmPlugin } from "vue-final-modal";

import VueCookies from 'vue-cookies'


const app = createApp(App);
// Neue Store Instanze erstellen
const store = createStore({
  state() {
    return {
      gptResponse: {
        text: "",
        id: 0,
        selectedText: "",
        history: [],
      },
      gptConfig: {
        maxTokens: 250,
      },
      authToken: localStorage.getItem("authToken") ?? null,
    };
  },
  mutations: {
    increment(state) {
      state.gptResponse.id++;
    },
    setText(state, text) {
      state.gptResponse.text = text;
    },
    setHistory(state, text) {
      state.gptResponse.history = text;
    },
    setMaxTokens(state, maxTokens) {
      state.gptResponse.maxTokens = maxTokens;
    },
    setAuthToken(state, authToken) {
      state.authToken = authToken;
      localStorage.setItem("authToken", authToken);
    },
  },
  getters: {},
});

app.use(router).use(store).use(vfmPlugin).use(VueCookies, { expires: '7d'}).mount("#app");
export const serverURL = "BACKEND_URL";

