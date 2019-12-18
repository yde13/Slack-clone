const registerForm = document.getElementById("register__form");
const registerHeaderBtn = document.querySelectorAll(".register");
const loginHeaderBtn = document.querySelectorAll(".login");
const loginForm = document.getElementById("login__form");
const loginErr = document.getElementById("login__error");
const registerErr = document.getElementById("register__error");
const loginSucc = document.getElementById("login__success");
const headerH1 = document.getElementsByClassName("header__h1")[0];
const headerP = document.getElementsByClassName("header__p")[0];
const headerH1Strings = ["Register to Instado","Login to Instado"];
const headerPStrings = ["Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quidem, dolore. Placeat eius excepturi sint nisi fugit esse, modi voluptates.", "Lorem ipsum, dolor sit amet consectetur adipisicing elit."];

window.addEventListener('load', () => {
    let successText = document.getElementById('login__success').innerText;
    if(successText != ""){
        loginHeaderBtn[0].click();
    }
    else{
        if(localStorage.getItem("pageCheck") == "register"){
            registerHeaderBtn[0].click();
        }
        else{
            loginHeaderBtn[0].click();
        }
    }
});

registerHeaderBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        loginForm.style.display = "none";
        registerForm.style.display = "flex";
        loginHeaderBtn[0].classList.remove("active");
        registerHeaderBtn[0].classList.add("active");
        headerH1.innerText = headerH1Strings[0];
        headerP.innerText = headerPStrings[0];
        loginErr.innerText = "";
        loginSucc.innerText = ""
        localStorage.setItem("pageCheck","register")
    });
});

loginHeaderBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        registerForm.style.display = "none";
        loginForm.style.display = "flex";
        registerHeaderBtn[0].classList.remove("active");
        loginHeaderBtn[0].classList.add("active");
        headerH1.innerText = headerH1Strings[1];
        headerP.innerText = headerPStrings[1];
        registerErr.innerText = "";
        localStorage.setItem("pageCheck","login")
    });
});