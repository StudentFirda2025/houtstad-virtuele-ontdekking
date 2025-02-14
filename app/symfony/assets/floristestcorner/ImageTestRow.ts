import $ from "jquery";
import {FileUploader} from "../generic-code/FileUploader";
import {ImageDataHandler} from "../generic-code/datahandler/ImageDataHandler";

export class ImageTestRow{


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

        let imageUploadBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "upload image"
        });


        FileUploader.setImageUploader(imageUploadBtn, (uploadSucces: boolean, file: File)=>{
            console.log("type: ", typeof file);
            console.log("Upload button clicked!", file);
        });

        let inputGetVideo = $("<input/>", {
            class: "control-form",
            placeholder: "image id to get"
        });

        let videoPlayer = $("<img/>", {
        });

        let getVideoFileBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get file"
        }).on("click", ()=> {
            ImageDataHandler.getFile(inputGetVideo.val() as number, (response)=> {
                console.log(typeof response);
                // Create a Blob from the byte array
                let videoBlob = new Blob([response]); // Create a Blob from the byte array
                let imageUrl = URL.createObjectURL(videoBlob); // Create a URL for the Blob

                // Set the video player's source to the Blob URL
                videoPlayer.attr('src', imageUrl);

            });
        });

        let getObjectVideoBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get object"
        }).on("click", ()=> {
            ImageDataHandler.get(inputGetVideo.val() as number, (response)=>{
                console.log("response: ", response);
            });

        });


        let deleteVideoBtn = $("<button/>", {
            class: "btn btn-outline-danger",
            text: "Remove image"
        }).on("click", ()=> {
            ImageDataHandler.delete(inputGetVideo.val() as number, (response)=>{
                console.log("response: ", response);
            });

        });

        let getAllBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get all objects"
        }).on("click", () => {
            ImageDataHandler.getAll((response)=>{
                console.log(response);
            });
        });


        let nameInp = $("<input/>", {
            class: "form-control",
            placeholder: "Name"
        });

        let updateBtn = $("<button/>", {
            class: "btn btn-outline-primary",
            text: "update"
        }).on("click", ()=>{
            ImageDataHandler.update(inputGetVideo.val() as number, nameInp.val() as string, (response)=>{
                console.log(response);
            });
        })


        let videoArea = $("<div/>");
        videoArea.append(
            getAllBtn,
            imageUploadBtn,
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