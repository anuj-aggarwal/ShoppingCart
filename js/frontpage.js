var username;

$(function(){
    setTimeout(function(){$('.loader-container').fadeOut('slow')}, 1000);
    username = $('#username');
    username.html("Welcome, " + localStorage.getItem('username')+" <i class='fa fa-caret-down'></i>");
});