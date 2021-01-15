window.show_prompt = (msg) => {
    console.log(msg);
    //vue.log(msg);
}

window.show_error = (err) => {
    console.error(err);
    //vue.log(err);
}

window.authentication_complete = () => {
    vue.authentication_complete()
}

let vue = new Vue({
    el: '#vueport',
    data: {
        time: "",
        selectedUser: {
            display_name: 'TEMP',
            name: ''
        },
        username: "",
        password: null,
        userList: [],
        hasError: false,
        logMessage:"",
    },
    methods: {
        updateClock() {
            var now = new Date();
            var hours = now.getHours();
            var min = now.getMinutes();
            min = (min<10)?("0"+min):(min);
            this.time = hours+":"+min;
            //console.log(this.time)
        },
        toUpper(str) {
            return !str? null : str.toUpperCase();
        },
        log(msg){
            this.logMessage = msg;
        },
        userChanged() {
            this.hasError = false;
            if(lightdm.username){
                lightdm.cancel_authentication();
            }
            username = this.selectedUser.name;
            if(username !== null) {
                lightdm.respond(username);
            }
        },
        passwordChange() {
            // console.log("changed");
            this.hasError = false;
        },
        passwordPlaceholder() {
            return this.hasError? "No Password Found" : "Enter Password";
        },
        onSubmit() {
            if(this.password !== null) {
                console.log("responding with pswd")
                lightdm.respond(this.password);
            }
        },
        authentication_complete() {
            this.hasError = false;
            if (lightdm.is_authenticated) {
                show_prompt('Logged in');
                lightdm.login(
                    lightdm.authentication_user,
                    lightdm.default_session
                );
            }else{
                show_error("Autentication error for user: "+this.selectedUser.name);
                this.hasError = true
                this.password = "";
                lightdm.respond(this.selectedUser.name);
            }
        }
    },
    mounted() {
        this.updateClock();
        setInterval(() => {
            this.updateClock();
        }, 10000);

        this.userList = lightdm.users;
        this.selectedUser = this.userList[0];
        this.userChanged();
    }
})