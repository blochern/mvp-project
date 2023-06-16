console.log("Script is all hooked up and ready to go, cap'n!");

const header = document.getElementById("HEADER");

fetch("/vehicles").then((data) => response.json()).then((data) => { console.log(data) });