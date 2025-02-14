import $ from "jquery";
import {BsAlert} from "./bootstrap/BsAlert";

export class FileUploader{

    public static AJAXUploadAudio(file: File, callback: (response)=>void){
        let formData: FormData = new FormData();
        formData.append("file", file);
        console.log(formData);

        let uploadingAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Audio aan het uploaden..."
        });

        let uploadedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Audio is ge-upload!",
            closeable: true,
            autoHideTimeMS: 4000
        });

        uploadingAlert.show();
        $.ajax({
            url: "/api/audio/upload",
            method: "post",
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set the contentType
            data: formData
        }).done((response) => {
            uploadingAlert.hide();
            uploadedAlert.show();
            callback(response);
        });
    }

    
    public static AJAXUploadVideo(file: File, callback: (response)=>void){
        let formData: FormData = new FormData();
        formData.append("file", file);
        console.log(formData);
        let uploadingAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Video aan het uploaden..."
        });

        let uploadedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Video is ge-upload!",
            closeable: true,
            autoHideTimeMS: 4000
        });

        uploadingAlert.show();
        $.ajax({
            url: "/api/video/upload",
            method: "post",
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set the contentType
            data: formData
        }).done((response) => {
            uploadingAlert.hide();
            uploadedAlert.show();
            callback(response);
    
        });
    }

        
    public static AJAXUploadImage(file: File, callback: (response)=>void){
        let formData: FormData = new FormData();
        formData.append("file", file);
        console.log(formData);

        $.ajax({
            url: "/api/image/upload",
            method: "post",
            processData: false,  // tell jQuery not to process the data
            contentType: false,  // tell jQuery not to set the contentType
            data: formData
        }).done((response) => {
            callback(response);
    
        });
    }


    public static setVideoUploader(htmlHandle: JQuery<HTMLElement>, onUploadDone: (uploadSuccess: boolean, response)=>void){
        FileUploader.setUploader("video/*", htmlHandle, (file)=> {
            FileUploader.AJAXUploadVideo(file, (response) => {
                if(response.status == "success"){
                    onUploadDone(true, response);
                }else{
                    onUploadDone(false, response);
                }
            });
        });
    }
    
    public static setAudioUploader(htmlHandle: JQuery<HTMLElement>, onUploadDone: (uploadSuccess:boolean, response)=>void){
        FileUploader.setUploader("audio/*", htmlHandle, (file)=>{
            FileUploader.AJAXUploadAudio(file, (response)=>{
                if(response.status == "success"){
                    onUploadDone(true, response);
                }else{
                    onUploadDone(false, response);
                }
            })
        });
    }

    public static setImageUploader(htmlHandle: JQuery<HTMLElement>, onUploadDone: (uploadSuccess: boolean, response)=>void){
        FileUploader.setUploader("image/*", htmlHandle, (file)=> {
            FileUploader.AJAXUploadImage(file, (response) => {
                if(response.status == "success"){
                    onUploadDone(true, response);
                }else{
                    onUploadDone(false, response);
                }
            });
        });
    }

    public static setUploader(fileTypes: "video/*" | "audio/*" | "image/*", htmlHandle: JQuery<HTMLElement>, onFileUpload: (file: File)=>void){
        let fileInput: JQuery<HTMLElement> = $("<input/>", {
            class: "d-none",
            type: "file",
            accept: fileTypes,
            name: "file"
        }).on("click", (event)=> {
            event.stopPropagation();
        }).on("input", ()=>{
            onFileUpload(fileInput.prop("files")[0]);
        });
        htmlHandle.append(fileInput);

        
        htmlHandle.on("click", ()=>{
            fileInput.trigger("click");
        });

    }

    



}