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
    fetchUserData();
    modalHead = $('#modal-title');
    modalBody = $('#modal-body');
    modalContinue = $('#continue-button');
    loginButton = $('#login-button');
    loginButton.click(login);
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
        modalBody.text('Oops, The username and password does not match.....!!')
        modalBody.css('color','black');
        modalContinue.attr('hidden', true);
    }

}

function fetchUserData() {
    $.getJSON("data/passwords.json", function (data) {
        userData = data;
    });
}