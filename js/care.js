var username;

$(function(){
    $('.loader-container').fadeOut('slow');
    username = $('#username');
    username.html("Welcome, " + localStorage.getItem('username')+" <i class='fa fa-caret-down'></i>");
});