<template>
    <div>
        <vue-final-modal v-model="isShown" classes="modal-container" content-class="modal-content">
            <button class="modal__close">
                <mdi-close></mdi-close>
            </button>
            <div id="modalheading">
                <span class="modal__title">Nutze deinen eigenen OpenAI GPT Schlüssel</span>
                <h3 id="openAiLink">https://openai.com/</h3>
            </div>
            <input v-model="gptKey" placeholder="Dein Key" id="keywordsInput" />
            <div class="modal__action">
                <v-button class="modalbutton" @click="setGptKey()">confirm</v-button>
            </div>
        </vue-final-modal>
    </div>
</template>
  

<script>
import { VueFinalModal, } from 'vue-final-modal'
export default {
    components: {
        VueFinalModal,
    },
    data: () => ({
        gptKey: "",
        isShown: true
    }),
    methods: {
        setGptKey() {
            this.$cookies.set("apiKey", this.gptKey)
            this.$emit("confirmed")
        }
    }
}
</script>
<style scoped>
::v-deep .modal-container {    display: flex;
    justify-content: center;
    align-items: center;
}

::v-deep .modal-content {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 18%;
    margin: 0 1rem;
    padding: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.25rem;
    background: #fff;
}

.modal__title {
    margin: 0 2rem 0 0;
    font-size: 1.5rem;
    font-weight: 700;
    padding-bottom: 1.5%;
}

#openAiLink {
    padding-bottom: 1.5%;
}

.modal__action {
    margin-top: 5px;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    padding: 1rem 0 0;
    text-align: center;
    height: inherit;
}

.modalbutton {
    border-radius: 1.4rem;
    font-size: var(--font-size-small);
    padding: .5rem 1rem;
    margin-top: 50px;
    background-color: #155252;
    color: white;
    width: 55%;
}

#modalheading {
    text-align: center;
}

#keywordsInput {
    height: 33px;
}

.modal__close {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
}

#gptKey {
    border-radius: 30px;
    width: 100%;
    height: 70%;
    border: none;
    padding: 0 10px;
    background-color: rgb(221, 219, 219);
    height: 33px;
}
</style>

<style scoped>
.dark-mode div::v-deep .modal-content {
    border-color: #2d3748;
    background-color: #1a202c;
}
</style>
