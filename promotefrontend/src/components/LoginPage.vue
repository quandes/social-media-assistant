<template lang="">
<div class="login-page">
   <transition name="fade">
      <div v-if="!registerActive" class="wallpaper-login"></div>
   </transition>
   <div class="wallpaper-register"></div>
   <div id="welcomeText">
    <h1 id="welcome">Quandes Social Media Assistent</h1>
    <h3>Der Quandes Social Media Assistent ist ein open Source Tool zur generierung von social media Content</h3>
    <p>Wir nutzen Open Ais gpt-3-5-turbo</p>
    <p>Bei der Nutzung unserers Tools folgen wir dem Ansatz "bring your own Key"</p>
    <p>Der Benutzer verwendet somit seinen eigenen GPT-API Schlüssel </p>
    <p>GPT Schlüssel können unter folgender Webseite erstellt werden</p>
    <p style="color:blue">https://openai.com/</p>
    <p>Achten Sie bei der Nutzung des Tools darauf, dass nicht alle Antworten der GPT gibt, der Warheit entsprechen</p>
   </div>
   <div class="container">
      <div class="row">
         <div class="col-lg-4 col-md-6 col-sm-8 mx-auto">
            <div v-if="!registerActive" class="card login" v-bind:class="{ error: emptyFields }">
               <h1>Anmelden</h1>

               <form class="form-group">
                  <input v-model="emailLogin" type="email" class="form-control" placeholder="Email" required>
                  <input v-model="passwordLogin" type="password" class="form-control" placeholder="Passwort" required>
                  <p>Noch keinen Account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Melde dich hier an</a>
                  </p>
                  <p><a href="#">Passwort vergessen?</a></p>
               </form>
               <button class="btn btn-primary" @click="doLogin">ANMELDEN</button>
            </div>
            <div v-else class="card register" v-bind:class="{ error: emptyFields }">
               <h1>Registrieren</h1>
               <form class="form-group">
                  <input v-model="emailReg" type="email" class="form-control" placeholder="Email" required>
                  <input v-model="passwordReg" type="password" class="form-control" placeholder="Password" required>
                  <input v-model="confirmReg" type="password" class="form-control" placeholder="Confirm Password" required>
                  <input type="submit" class="btn btn-primary" @click="doRegister" id='registerButton'>
                  <p>hast du breits einen Account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Hier anmelden</a>
                  </p>
               </form>
            </div>
         </div>
      </div>
   </div>
</div>
</template>
<script>
import axios from "axios";
export default {

    data() {
        return {
            registerActive: false,
            emailLogin: "",
            passwordLogin: "",
            emailReg: "",
            passwordReg: "",
            confirmReg: "",
            emptyFields: false,
            loggedin: false
        }
    },
    mounted() {
        if (this.$store.state.authToken != null) {
            this.$router.push('/GenCompWrapper');
        }
    },
    methods: {
        async checkUserData() {
            try {
                const response = await axios
                    .post(`${process.env.VUE_APP_BASE_URL}/userCheckUp`, {
                        email: this.emailLogin,
                        password: this.passwordLogin
                    }
                    )
                if (response.status == 201) {
                    const authToken = response.data.token;
                    this.$store.commit('setAuthToken', authToken)
                    return true;
                }
                return false;
            } catch (err) {
                console.log(err)
            }

        },
        async doLogin() {
            if (this.emailLogin === "" || this.passwordLogin === "") {
                this.emptyFields = true;
            } else {
                if (await this.checkUserData()) {
                    this.$router.push('/GenCompWrapper')
                }

            }
        },


        doRegister() {
            if (this.emailReg === "" || this.passwordReg === "" || this.confirmReg === "") {
                this.emptyFields = true;
            }
            if (this.passwordReg != this.confirmReg) {
                alert("Passwort stimmt nicht überein");
            }
            else {
                this.sendUserData()
                alert("Benutzer angelegt")
                this.registerActive = !this.registerActive
                this.emptyFields = false
            }
        },
        sendUserData() {
            axios
                .post(`${process.env.VUE_APP_BASE_URL}/newUser`, {
                    email: this.emailReg,
                    password: this.passwordReg,
                }
                )
                .then((response) => {
                    this.localResponse = response
                })
                .catch((error) => console.log(error));
        },
    }

}
</script>
<style>
p {
    line-height: 1rem;
}

.card {
    padding: 20px;
}

.login-page {
    display: grid;
    justify-content: center;
    align-content: center;
    height: 100vh;
    width: 100vw;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity .5s;
}

#registerButton{
    width: 200px;
    height: 25px;
    margin-bottom: 7px
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}

.btn-primary{
    color:#155252;
    border-radius: 30px;
    margin: 15px;
    background-color: whitesmoke;
    width: 200px;
    height: 25px;
}

.wallpaper-register {
    background: url(https://images.pexels.com/photos/533671/pexels-photo-533671.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260) no-repeat center center;
    background-size: cover;
    height: 100%;
    position: absolute;
    width: 100%;
    z-index: -1;
}

.form-control {
    border-radius: 30px;
    width: 100%;
    border: none;
    margin: 5px;
    background-color: rgb(221, 219, 219);
    height: 25px
}

h1 {
    margin-bottom: 1.5rem;
}

.error {
    animation-name: errorShake;
    animation-duration: 0.3s;
}

.container {
    display: grid;
    justify-content: center;
    align-content: center;
}

@keyframes errorShake {
    0% {
        transform: translateX(-25px);
    }

    25% {
        transform: translateX(25px);
    }

    50% {
        transform: translateX(-25px);
    }

    75% {
        transform: translateX(25px);
    }

    100% {
        transform: translateX(0);
    }
}

.login-page {
    background-color: #478080;
}

.wallpaper-login {
    height: auto;
    background-color: #155252;
}

#welcome {
    color: #892323ff;
}
</style>