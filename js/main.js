"use strict";

var loginButton;
var modalHead;
var modalBody;
var modalContinue;
var userData = {};
var username;
var password;
var matched = false;

$(function () {
    setTimeout(function(){$('.loader-container').fadeOut('slow')}, 1000);
    fetchUserData();
    modalHead = $('#modal-title');
    modalBody = $('#modal-body');
    modalContinue = $('#continue-button');
    loginButton = $('#login-button');
    loginButton.click(login);
    $('#guest-button').click(function(){localStorage.removeItem('username');});
    $('#username,#password').on('keypress', function(event){
        if(event.keyCode==13){
            loginButton.click();
        }
    });
});

function login(){
    username = $('#username').val();
    password = $('#password').val();

    for (var user in userData) {
        if(userData[user]==password){
            matched = true;
            break;
        }
    }

    if(matched){
        modalHead.html('Success');
        modalHead.addClass('text-success');
        modalBody.text(`Welcome ${username}, You are successfully logged in. Press Continue to Go to Website.`);
        modalBody.css('color','black');
        modalContinue.attr('hidden', false);
        localStorage.setItem('username', username);

    }
    else{
        modalHead.text('Wrong Credentials');
        modalHead.addClass('text-danger');
        modalBody.html('Oops, The username and password does not match.....!!<br>Try again or Continue as a guest')
        modalBody.css('color','black');
        modalContinue.attr('hidden', true);
    }

}

function fetchUserData() {
    $.getJSON("data/passwords.json", function (data) {
        userData = data;
    });
}