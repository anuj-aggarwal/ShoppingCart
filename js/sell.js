var username;

$(function(){
    username = $('#username');
    username.html("Welcome, " + localStorage.getItem('username')+" <i class='fa fa-caret-down'></i>");
});