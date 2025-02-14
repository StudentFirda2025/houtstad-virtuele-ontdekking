import $ from "jquery";
import {FileUploader} from "../generic-code/FileUploader";
import {AudioDataHandler} from "../generic-code/datahandler/AudioDataHandler";
import {Audio} from "../generic-code/Audio";


export class AudioTestRow{

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


    private createRow():JQuery<HTMLElement>{
        const s = this;

        let getAllBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get all objects"
        }).on("click", () => {
            AudioDataHandler.getAll((response)=>{
                console.log(response);
            });
        });

        let audioUploadBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "upload audio"
        });


        FileUploader.setAudioUploader(audioUploadBtn, (uploadSucces: boolean, file: File)=>{
            console.log("type: ", typeof file);
            console.log("Upload button clicked!", file);

        });

        let inputGetAudio = $("<input/>", {
            class: "control-form",
            placeholder: "audio id to get"
        });

        let audioPlayer = $("<audio/>", {
            controls: true
        });

        let getAudioFileBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get file"
        }).on("click", ()=> {
            AudioDataHandler.getFile(inputGetAudio.val() as number, (response)=> {
                console.log(typeof response);
                // Create a Blob from the byte array
                let videoBlob = new Blob([response], { type: 'video/mp4' });

                // Create a URL for the Blob
                let videoUrl = URL.createObjectURL(videoBlob);

                // Set the video player's source to the Blob URL
                audioPlayer.attr('src', videoUrl);

            });
        });

        let getObjectAudioBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get object"
        }).on("click", ()=> {
            AudioDataHandler.get(inputGetAudio.val() as number, (response)=>{
                console.log("response: ", response);
            });

        });


        let deleteAudioBtn = $("<button/>", {
            class: "btn btn-outline-danger",
            text: "Remove audio"
        }).on("click", ()=> {
            AudioDataHandler.delete(inputGetAudio.val() as number, (response)=>{
                console.log("response: ", response);
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
            AudioDataHandler.update(inputGetAudio.val() as number, nameInp.val() as string,(response)=>{
                console.log(response);
            });
        })



        let audioArea = $("<div/>");


        audioArea.append(
            getAllBtn,
            audioUploadBtn,
            inputGetAudio,
            getAudioFileBtn,
            getObjectAudioBtn,
            nameInp,
            updateBtn,
            deleteAudioBtn,
            audioPlayer
        );


        return audioArea;
    }

}

