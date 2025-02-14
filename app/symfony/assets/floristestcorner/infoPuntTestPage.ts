import $ from "jquery";
import "./bootstrap.scss";
import { FileUploader } from "../generic-code/FileUploader";

import {VideoTestRow} from "./VideoTestRow";
import {AudioTestRow} from "./AudioTestRow";
import {InfoPunt} from "../generic-code/InfoPunt";
import {InfoPuntDataHandler} from "../generic-code/datahandler/InfoPuntDataHandler";
import {UserManager} from "../generic-code/User/UserManager";
import { ImageTestRow } from "./ImageTestRow";
import { StoryTestRow } from "./StoryTestRow";

UserManager.getCurrentUser((curUser)=>{
   console.log(curUser);    
});


let logoutBtn = $("<button/>", {
    class: "btn btn-outline-dark",
    text: "logout"
}).on("click", ()=>{
    $.ajax({
        url: "/api/logout",
        method: "post"
    }).done((response) => {
        console.log(response);
    });
});

let register = $("<button/>", {
    class: "btn btn-outline-dark",
    text: "register"
}).on("click", ()=>{
    $.ajax({
        url: "/register",
        method: "post",
        // dataType: "json",
        data: {
            email: emailInp.val(),
            password: passwordInp.val()
        },
        contentType: "application/x-www-form-urlencoded"
    }).done((response) => {
        console.log("register resposne: ", response);
    });
});

let emailInp = $("<input/>", {
    class: "form-controll",
    placeholder: "email"
});

let passwordInp = $("<input/>", {
    class: "form-controll",
    placeholder: "password"
});



let nameInp = $("<input/>", {
    class: "form-control",
    placeholder: "Name"
});
let textInp = $("<textarea/>", {
    class: "form-control",
    placeholder: "Text"
});
let videoIdInp = $("<input/>", {
    class: "form-control",
    placeholder: "Video ID"
});
let audioIdInp = $("<input/>", {
    class: "form-control",
    placeholder: "Audio ID"
});
let imgIdInp = $("<input/>", {
    class: "form-control",
    placeholder: "Image ID"
});

let confirmBtn = $("<button/>", {
    class: "btn btn-outline-success",
    text: "CONFIRM"
}).on("click", () => {
    let name = nameInp.val();
    let text = textInp.val();
    let videoId = videoIdInp.val();
    let audioId = audioIdInp.val();
    let imageId = imgIdInp.val();
    console.log(name);
    console.log(text);
    console.log(videoId);
    console.log(audioId);
    console.log(imageId);

    InfoPuntDataHandler.create({
        infopuntnaam: name,
        text: text,
        videoId: videoId,
        audioId: audioId,
        imageId: imageId
    }, (response) => {
        console.log(response);
    });
});

let updateBtn = $("<button/>", {
    class: "btn btn-outline-primary",
    text: "UPDATE"
}).on("click", () => {
    let id = getIdInp.val();
    let name = nameInp.val();
    let text = textInp.val();
    let videoId = videoIdInp.val();
    let audioId = audioIdInp.val();
    let imageId = imgIdInp.val();

    console.log(name);
    console.log(text);
    console.log(videoId);
    console.log(audioId);

    InfoPuntDataHandler.update({
        id: id,
        infopuntnaam: name,
        text: text,
        videoId: videoId,
        audioId: audioId,
        imageId: imageId
    }, (response) => {
        console.log(response);
    });
});

let deleteBtn = $("<button/>", {
    class: "btn btn-outline-danger",
    text: "DELETE"
}).on("click", () => {
    let id: number = parseInt(getIdInp.val() as string);

    InfoPuntDataHandler.delete(id, (response) => {
        console.log(response);
    });
});

let getAllBtn = $("<button/>", {
    class: "btn btn-outline-dark",
    text: "GET-ALL"
}).on("click", () => {
    InfoPuntDataHandler.getAll((response) => {
        console.log(response);
    });
});

let addArea = $("<div/>");
addArea.append(
    nameInp,
    textInp,
    videoIdInp,
    audioIdInp,
    imgIdInp,
    confirmBtn,
    updateBtn,
    deleteBtn,
    getAllBtn
);


let getIdInp = $("<input/>", {
    class: "form-control",
    placeholder: "info-punt to get (id)"
});

let searchBtn = $("<button/>", {
    class: "btn btn-outline-primary"
}).html("Search").on("click", () => {
    let id: number = parseInt(getIdInp.val() as string);
    InfoPuntDataHandler.get(id, (response)=>{
        console.log(response);
    })
});

let searchArea = $("<div/>");

searchArea.append(
    getIdInp,
    searchBtn
);

let videoArea = new VideoTestRow();
let audioArea = new AudioTestRow();
let imageArea = new ImageTestRow();
let storyArea = new StoryTestRow();


$("body").empty();

$("body").append(
    logoutBtn,
    register,
    emailInp,
    passwordInp,
    $("<hr/>"),
    addArea,
    $("<hr/>"),
    searchArea,
    $("<hr/>"),
    videoArea.html,
    $("<hr/>"),
    audioArea.html,
    $("<hr/>"),
    imageArea.html,
    $("<hr/>"),
    storyArea.html
);


















