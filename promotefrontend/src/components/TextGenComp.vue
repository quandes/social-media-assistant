<template>
  <main id="container">
    <div>
      <KeyComp v-if="this.keyValid" @confirmed="() => onModalConfirmed()"></KeyComp>
    </div>
    <div id="wrapper">
      <div id="headline">
        <h1 class="heading">Quandes-</h1>
        <h1 class="heading" style="color:#892323;"> Social Media Assistant</h1>
      </div>
    </div>
    <div id="pagecontent">
      <div id="control">
        <div class="selectionInput" id="linkSource">
          <p class="textfildheading">link als Datenquelle:</p>
          <input v-model="link" placeholder="Link" id="linkInput" />
        </div>
        <div class="selectionInput" id="plattform">
          <p class="textfildheading">Plattform:</p>
          <select v-model="platform">
            <option disabled value="">keine ausgewählt</option>
            <option>Blogartikel</option>
            <option>LinkedIn</option>
            <option>Instagram</option>
          </select>
        </div>

        <div class="selectionInput" id="jargon">
          <p class="textfildheading">Stiel:</p>
          <select v-model="jargon">
            <option disabled value="">Standardwert</option>
            <option>umgangssprachlich</option>
            <option>geschäftlich</option>
            <option>reimend</option>
          </select>
        </div>

        <div class="selectionInput" id="creativity">
          <p class="textfildheading">Kreativitäts Level:</p>
          <select v-model="creativity">
            <option disabled value="">Standardwert</option>
            <option>standard</option>
            <option>niedrig</option>
            <option>mittel</option>
            <option>hoch</option>
            <option>sehr hoch</option>
          </select>
        </div>
        <div class="slidecontainer selectionInput">
          <p class="textfildheading">Anzahl der Token: {{ this.sliderValue }}</p>
          <vue-slider v-model="sliderValue" max="4000" min="10"></vue-slider>
        </div>
        <div id="eingabeSection">
          <div id="titelInputContainer">
            <p>Textgrundlage für Generierung</p>
            <input id="titelInput" class="inputClass" v-model="pragraphTitel" placeholder="Titel" />
          </div>
          <input id="keywordsInput" class="inputClass" v-model="keywords"
            placeholder="weitere Stichpunkte zur Textgenerierung" />
          <div id="buttonWrapper">
            <button class="style_button" @click="gptRequest">Text generieren</button>
            <button class="style_button" @click="getHistory">Verlauf Anzeigen</button>
            <button class="style_button" @click="showKeyModal">API-Key angeben</button>
          </div>
        </div>
      </div>

      <div id="context-menu">
        <button class="item" @click="writePoste">Absatz verfassen</button>
        <button class="item" @click="gptRewriting">umformulieren</button>
        <button class="item" @click="addEmoji">Emoji hinzufügen</button>
      </div>
      <RichTextComp id="editor" v-if="showEditor" />
      <div class="historyRenderig" v-if="showHistory">
        <div id="historyContainer">
          <li id="historyList" v-for="( item, index ) in  this.historyData " :key=index>
            <p class="historyElem" @click="specificHistory(item.id)">{{ item.response }}</p>
          </li>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import axios from "axios";
import RichTextComp from "./RichTextComp.vue";
import VueSlider from 'vue-slider-component'
import KeyComp from './KeyComp.vue'
import 'vue-slider-component/theme/default.css'

export default {
  components: {
    RichTextComp,
    VueSlider,
    KeyComp
  },
  data() {
    return {
      platform: "",
      jargon: "",
      localResponse: "",
      keywords: "",
      sliderValue: 50,
      creativity: "",
      temperature: 0.3,
      pragraphTitel: "",
      historyData: [],
      link: "",
      keyStored: true,
      showHistory: false,
      showEditor: true,
      historyRequest: '',
      keyValid: !this.$cookies.isKey("apiKey")
    };
  },
  watch: {
    sliderValue() {
      this.$store.commit('setMaxTokens', this.sliderValue)
    }
  },
  methods: {
    onModalConfirmed() {
      this.keyValid = false;
    },
    showKeyModal() {
      this.keyValid = true
    },
    isInEditor(elem) {
      const editor = document.getElementById("editor")
      return editor.contains(elem);
    },

    gptRequest() {
      this.showEditor = true
      this.showHistory = false
      if (this.creativity == 'sehr niedrig') {
        this.temperature = 0
      } else if (this.creativity == 'mittel') {
        this.temperature = 0.5
      } else if (this.creativity == 'hoch') {
        this.temperature = 0.7
      } else if (this.creativity == 'sehr hoch') {
        this.temperature = 1
      }
      console.log(this.creativity)
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/gpt`, {
          keyword_url: this.link,
          prompt: this.keywords,
          platform: this.platform,
          max_tokens: this.sliderValue,
          temperature: this.temperature,
          pragraphTitel: this.pragraphTitel,
          stiel: this.jargon,
          apiKey: this.$cookies.get('apiKey')
        },
          {
            headers: {
              "Authentication": this.$store.state.authToken
            }
          }
        )
        .then((response) => {
          this.$store.commit('setText', response.data)
          this.localResponse = response
        })
        .catch((error) => console.log(error));
    },

    addEmoji() {
      this.showEditor = true
      this.showHistory = false
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/gpt`, {

          prompt: 'füge dem Text zwschen den $ Zeichen,an passenden Stellen emojis hinzu aber verändere den Urspungstext sonst nicht $' + this.$store.state.gptResponse.text + '$',
          platform: this.platform,
          max_tokens: parseInt(this.sliderValue * 1.10),
          temperature: 0,
          pragraphTitel: this.pragraphTitel,
          stiel: this.jargon,
          apiKey: this.$cookies.get('apiKey')
        },
          {
            headers: {
              "Authentication": this.$store.state.authToken
            }
          }
        )
        .then((response) => {
          this.$store.commit('setText', response.data)
          this.localResponse = response
        })
        .catch((error) => console.log(error));
    },

    gptRewriting() {
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/gpt`, {
          prompt: 'rewrite the following text in a better way: ' + this.$store.state.gptResponse.text,
          platform: this.platform,
          max_tokens: this.sliderValue,
          temperature: this.temperature,
          pragraphTitel: this.pragraphTitel,
          stiel: this.jargon,
          apiKey: this.$cookies.get('apiKey')
        },
          {
            headers: {
              "Authentication": this.$store.state.authToken
            }
          }
        )
        .then((response) => {
          this.$store.commit('setText', response.data)
          this.localResponse = response
        })
        .catch((error) => console.log(error));
    },
    writePoste() {
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/gpt`, {
          prompt: 'rewrite the following text in a better way: ' + this.$store.state.gptResponse.text,
          platform: this.platform,
          max_tokens: 4000,
          temperature: this.temperature,
          pragraphTitel: this.pragraphTitel,
          stiel: this.jargon,
          apiKey: this.$cookies.get('apiKey')
        },
          {
            headers: {
              "Authentication": this.$store.state.authToken
            }
          }
        )
        .then((response) => {
          this.$store.commit('setText', response.data)
          this.localResponse = response
        })
        .catch((error) => console.log(error));
    }
    ,

    async getHistory() {
      this.showHistory = !this.showHistory
      this.showEditor = !this.showEditor
      const response = await axios.get(`${process.env.VUE_APP_BASE_URL}/getHistory`, {
        headers: {
          "Authentication": this.$store.state.authToken
        }
      });
      console.log(response);
      this.historyData = response.data;
    },

    specificHistory(index) {
      this.showEditor = true
      this.showHistory = false
      console.log(index)
      this.historyRequest = index
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/specificHistory`, {
          historyIndex: this.historyRequest
        }
        )
        .then((response) => {
          this.$store.commit('setText', response.data.response)
          this.localResponse = response
          console.log('store' + this.$store.state.gptResponse.text)
        })
        .catch((error) => console.log(error));
    },

  },
  mounted() {
    if (this.$store.state.authToken == undefined) {
      this.$router.push("/");
      return;
    }

    const contextMenu = document.getElementById("context-menu");
    const scope = document.querySelector("body");

    scope.addEventListener("contextmenu", (event) => {
      if (this.isInEditor(event.target)) {
        event.preventDefault();
        const { clientX: mouseX, clientY: mouseY } = event;
        contextMenu.style.top = `${mouseY}px`;
        contextMenu.style.left = `${mouseX}px`;
        contextMenu.classList.add("visible");
        return
      }
    });
    scope.addEventListener("click", (e) => {
      if (e.target.offsetParent != contextMenu) {
        contextMenu.classList.remove("visible");
      }
    });
  }
}
</script>

<style scoped>
body {
  background-color: var(--background);
  color: var(--text);
  display: flex;
  flex: 1 1;
  margin: 0;
  padding: 0;
}

#container {
  display: flex;
  flex: 1 1;
  flex-direction: column;
}

#pagecontent {
  overflow: hidden;
  position: relative;
  display: inherit;
}

#control {
  border-right: 1px solid var(--border);
  overflow: hidden;
  padding: 1rem 1.5rem;
  width: 25%;
  padding-top: 0;
  min-width: 300px;
}

.slider {
  width: 200px;
}

#keywords {
  margin-left: 2%;
  height: 30%;
}

#headline {
  display: inline-flex;
}

.heading {
  font-size: 35px;
  font-weight: bold;
  text-align: center;
}

#wrapper {
  width: 100%;
  text-align: center;
  margin-top: -1.3%;
  margin-bottom: 0.3%;
}

#titelInputContainer {
  height: 10%;
  padding-top: 1.5%;
  text-align: center
}

#eingabeHeading {
  text-align: center
}

#titelInput {
  margin-top: 1.5%;
}

.inputClass {
  text-align: center;
  height: 30px;
}

#keywordsInput {
  margin-top: 4.5%;
  width: 100%
}

.selectionInput {
  margin-bottom: 25px;
}

.selectionInput input,
.selectionInput select {
  height: 30px;
}


.style_button {
  border-radius: 1.4rem;
  font-size: var(--font-size-small);
  padding: .5rem 1rem;
  background-color: #155252;
  color: white;
  margin-top: 15px;
  width: 55%;
}

#buttonWrapper {
  text-align: center;
}

#introtext {
  margin-top: 0.5%;
}

#distanceElement {
  height: 2%;
}

.textfildheading {
  height: 20px;
}

#eingabeSection {
  border-top: solid grey 2pt;
  padding-top: 1.5%;
}

#context-menu {
  position: fixed;
  z-index: 10000;
  width: 150px;
  background: #1b1a1a;
  border-radius: 5px;
  display: none;
}

#context-menu.visible {
  display: block;
}

#context-menu .item {
  padding: 8px 10px;
  font-size: 15px;
  color: #eee;
  cursor: pointer;
  border-radius: inherit;
}

#context-menu .item:hover {
  background: #343434;
}

.navigationStyle {
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  padding: .75rem 1.5rem;
}

.style_left__tUxEg {
  align-items: center;
  display: flex;
  flex: 1 1;
  flex-direction: row;
  flex-wrap: wrap;
}

#style_list__70Ikr {
  display: flex;
  flex: 1 1;
  flex-shrink: 1;
  flex-direction: column;
  flex-shrink: 0;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 1.5rem 1rem;
}

#editor {
  height: 500px;
}

.historyRenderig {
  height: 70%;
  width: 100%;
}

#historyList {
  border: solid black 0.5px;
  list-style-type: none;
  margin: 4px;
  border-radius: 30px
}

.historyElem {
  padding: 0.6%;
}

@media (max-width: 800px) {
  #pagecontent {
    display: block;
  }

  #control {
    width: 100%;
  }

  .selectionInput {
    display: inline-block;
    width: 100%;
  }
}
</style>
