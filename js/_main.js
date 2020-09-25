var lightdm = lightdm;
var $ = jQuery;
var selected_user = null;
var password = null;
var $user = $('#user');
var $pass = $('#pass');

/* clock */
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var min = now.getMinutes();
    min = (min<10)?("0"+min):(min);
    $('#clock').html(hours+":"+min);
    console.log(hours+":"+min);
};

function init() {
    setInterval(() => {
        updateClock();
    }, 5000);
    updateClock();
    setup_users_list();
    //this.select_user_from_list();

    this.$user.on('change', function (e) {
        e.preventDefault();
        var idx = e.currentTarget.selectedIndex;
        select_user_from_list(idx);
    });

    $('form').on('submit', function (e) {
        e.preventDefault();
        window.provide_secret();
    });
}

function setup_users_list() {
    lightdm.users.forEach(elem => {
        console.log("Appending")
        $user.append('<option value="' +elem.name +'">' +elem.display_name +'</option>');
    });
    console.log($user)
}

function select_user_from_list(idx) {
    var idx = idx || 0;

    if(lightdm._username){
        lightdm.cancel_authentication();
    }

    selected_user = lightdm.users[idx].name;
    if(selected_user !== null) {
        window.start_authentication(selected_user);
    }

    $pass.trigger('focus');
};

// Functions that lightdm needs
window.start_authentication = function (username) {
    lightdm.cancel_timed_login();
    lightdm.start_authentication(username);
};
window.provide_secret = function () {
    password = $pass.val() || null;

    if(password !== null) {
        lightdm.provide_secret(password);
    }
};
window.authentication_complete = function () {
    if (lightdm.is_authenticated) {
        show_prompt('Logged in');
        lightdm.login(
            lightdm.authentication_user,
            lightdm.default_session
        );
    }else{
        show_error("Autentication error for user: "+$user.val());
        $pass.val('');
        $pass.trigger('focus');

        lightdm.start_authentication($user.val());
    }
};
// These can be used for user feedback
window.show_error = function (e) {
    console.log('Error: ' + e);
    $("#error-show").html(e);
};
window.show_prompt = function (e) {
    console.log('Prompt: ' + e);
};

console.log($user.html())
init();




/*
var login = (function (lightdm, $) {
    var selected_user = null;
    var password = null
    var $user = $('#user');
    var $pass = $('#pass');

    // private functions
    var setup_users_list = function () {
        var $list = $user;
        var to_append = null;
        $.each(lightdm.users, function (i) {
            var username = lightdm.users[i].name;
            var dispname = lightdm.users[i].display_name;
            $list.append('<option value="' +username +'">' +dispname +'</option>');
        });
    };

    var select_user_from_list = function (idx) {
        var idx = idx || 0;

        find_and_display_user_picture(idx);

        if(lightdm._username){
            lightdm.cancel_authentication();
        }

        selected_user = lightdm.users[idx].name;
        if(selected_user !== null) {
            window.start_authentication(selected_user);
        }

        $pass.trigger('focus');
    };
    //set image
    var find_and_display_user_picture = function (idx) {
        if(lightdm.users[idx].image === ""){
            $('.profile-img').attr('src',"assets/img/avatar.jpg");
        }else{
            $('.profile-img').attr('src',lightdm.users[idx].image);
        }
    };

    // Functions that lightdm needs
    window.start_authentication = function (username) {
        lightdm.cancel_timed_login();
        lightdm.start_authentication(username);
    };
    window.provide_secret = function () {
        password = $pass.val() || null;

        if(password !== null) {
            lightdm.provide_secret(password);
        }
    };
    window.authentication_complete = function () {
        if (lightdm.is_authenticated) {
            show_prompt('Logged in');
            lightdm.login(
                lightdm.authentication_user,
                lightdm.default_session
            );
        }else{
            show_error("Autentication error for user: "+$user.val());
            $pass.val('');
            $pass.trigger('focus');

			lightdm.start_authentication($user.val());
        }
    };
    // These can be used for user feedback
    window.show_error = function (e) {
        console.log('Error: ' + e);
        $("#error-show").html(e);
    };
    window.show_prompt = function (e) {
        console.log('Prompt: ' + e);
    };


} (lightdm, jQuery));
*/
