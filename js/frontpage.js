var username;

$(function(){
    setTimeout(function(){$('.loader-container').fadeOut('slow')}, 1000);
    username = $('#username');
    var user = localStorage.getItem('username');
    if(user) {
        username.html(`Welcome, ${user} <i class='fa fa-caret-down'></i>`);
    }
    else{
        username.html(('<a href="index.html">Login / SignUp <i class="fa fa-caret-down"></i></a>'))
    }
});