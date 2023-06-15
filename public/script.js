console.log("Script is all hooked up and ready to go, cap'n!");

const header = document.getElementById("HEADER");

fetch("/template").then((response) => response.json()).then((data) => {
    header.textContent = data;
});