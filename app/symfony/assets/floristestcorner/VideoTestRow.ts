import $ from "jquery";
import {FileUploader} from "../generic-code/FileUploader";
import {VideoDataHandler} from "../generic-code/datahandler/VideoDataHandler";

export class VideoTestRow{



    private _html: JQuery<HTMLElement>;
    constructor() {

        this.html = this.createRow();
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }

    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }


    private createRow(): JQuery<HTMLElement>{
        const s = this;

        let videoUploadBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "upload video"
        });


        FileUploader.setVideoUploader(videoUploadBtn, (uploadSucces: boolean, file: File)=>{
            console.log("type: ", typeof file);
            console.log("Upload button clicked!", file);
        });

        let inputGetVideo = $("<input/>", {
            class: "control-form",
            placeholder: "video id to get"
        });

        let videoPlayer = $("<video/>", {
            controls: true
        });

        let getVideoFileBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get file"
        }).on("click", ()=> {
            VideoDataHandler.getFile(inputGetVideo.val() as number, (response)=> {
                console.log(typeof response);
                // Create a Blob from the byte array
                let videoBlob = new Blob([response], { type: 'video/mp4' });

                // Create a URL for the Blob
                let videoUrl = URL.createObjectURL(videoBlob);

                // Set the video player's source to the Blob URL
                videoPlayer.attr('src', videoUrl);

            });
        });

        let getObjectVideoBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get object"
        }).on("click", ()=> {
            VideoDataHandler.get(inputGetVideo.val() as number, (response)=>{
                console.log("response: ", response);
            });

        });


        let deleteVideoBtn = $("<button/>", {
            class: "btn btn-outline-danger",
            text: "Remove video"
        }).on("click", ()=> {
            VideoDataHandler.delete(inputGetVideo.val() as number, (response)=>{
                console.log("response: ", response);
            });

        });

        let getAllBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get all objects"
        }).on("click", () => {
            VideoDataHandler.getAll((response)=>{
                console.log(response);
            });
        });

        let getAllAsyncBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get all objects with await async"
        }).on("click", async () => {
            console.log("before await");
            
            console.log("after await");
        });


        let nameInp = $("<input/>", {
            class: "form-control",
            placeholder: "Name"
        });

        let updateBtn = $("<button/>", {
            class: "btn btn-outline-primary",
            text: "update"
        }).on("click", ()=>{
            VideoDataHandler.update(inputGetVideo.val() as number, nameInp.val() as string, (response)=>{
                console.log(response);
            });
        })


        let videoArea = $("<div/>");
        videoArea.append(
            getAllBtn,
            getAllAsyncBtn,
            videoUploadBtn,
            inputGetVideo,
            getVideoFileBtn,
            getObjectVideoBtn,
            nameInp,
            updateBtn,
            deleteVideoBtn,
            videoPlayer
        );

        return videoArea;

    }
}