
function show_prompt(msg) {
    console.log(msg);
}

function show_error(err) {
    console.error(err);
}

function authentication_complete() {
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
        userList: []
    },
    methods: {
        updateClock() {
            var now = new Date();
            var hours = now.getHours();
            var min = now.getMinutes();
            min = (min<10)?("0"+min):(min);
            this.time = hours+":"+min;
            console.log(this.time)
        },
        toUpper(str) {
            return !str? null : str.toUpperCase();
        },
        userChanged() {
            if(lightdm._username){
                lightdm.cancel_authentication();
            }
            username = this.selectedUser.name;
            if(username !== null) {
                lightdm.start_authentication(username);
            }
        },
        onSubmit() {
            console.log(this.password)
            if(this.password !== null) {
                lightdm.provide_secret(this.password);
            }
        },
        authentication_complete() {
            if (lightdm.is_authenticated) {
                show_prompt('Logged in');
                console.log(lightdm.authentication_user, lightdm.default_session);
                lightdm.login(
                    lightdm.authentication_user,
                    lightdm.default_session
                );
            }else{
                show_error("Autentication error for user: "+this.selectedUser.name);
                this.password = "";
                lightdm.start_authentication(this.selectedUser.name);
            }
        }
    },
    mounted() {
        this.updateClock();
        setInterval(() => {
            this.updateClock();
        }, 5000);

        this.userList = lightdm.users;
        this.selectedUser = this.userList[0];
        this.userChanged();
    }
})