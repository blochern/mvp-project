console.log("Script is all hooked up and ready to go, cap'n!");

const header = document.getElementById("HEADER");

fetch("/vehicles").then((response) => response.json()).then((data) => { console.log(data) });