import $ from "jquery";
import "@fortawesome/fontawesome-free/js/all";
import { MediaCmsContentArea } from "./MediaCmsContentArea";
import { FileUploader } from "../../generic-code/FileUploader";
import { MediaCmsContentStoryCard } from "./MediaCmsContentStoryCard";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import { BsModal } from "../../generic-code/bootstrap/BsModal";
import { StoryDataHandler } from "../../generic-code/datahandler/StoryDataHandler";
import { Video } from "../../generic-code/Video";
import { Audio } from "../../generic-code/Audio";
import { Story } from "../../generic-code/Story";
import { MediaCmsPage } from "./MediaCmsPage";

export class MediaCmsHeader{

    protected _html: JQuery<HTMLElement>;

    private _videoBtn: JQuery<HTMLElement>;
    private _audioBtn: JQuery<HTMLElement>;
    private _storyBtn: JQuery<HTMLElement>;
    private _videoUploadBtn: JQuery<HTMLElement>;
    private _audioUploadBtn: JQuery<HTMLElement>;
    private _storyUploadBtn: JQuery<HTMLElement>;
    private _contentArea: MediaCmsContentArea;
    public _mediacmscontentstorycard: MediaCmsContentStoryCard;
    public quill: Quill; 
    private _quillModal: BsModal;
    private _inpTitle: JQuery<HTMLElement>;
    private _selectedStoryId: number = -1;

    private _parent: MediaCmsPage;

    public searchFunction;



    constructor(parent: MediaCmsPage){

        this.parent = parent;
        this.contentArea = this.parent.content;

        this.html = this.createHeader();
        this.createQuillEditor();
    }



    public get parent(): MediaCmsPage {
        return this._parent;
    }
    public set parent(value: MediaCmsPage) {
        this._parent = value;
    }

    public get selectedStoryId(): number {
        return this._selectedStoryId;
    }
    public set selectedStoryId(value: number) {
        this._selectedStoryId = value;
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }

    public get videoBtn(): JQuery<HTMLElement> {
        return this._videoBtn;
    }
    public set videoBtn(value: JQuery<HTMLElement>) {
        this._videoBtn = value;
    }

    public get audioBtn(): JQuery<HTMLElement> {
        return this._audioBtn;
    }
    public set audioBtn(value: JQuery<HTMLElement>) {
        this._audioBtn = value;
    }

    public get storyBtn(): JQuery<HTMLElement> {
        return this._storyBtn;
    }
    public set storyBtn(value: JQuery<HTMLElement>) {
        this._storyBtn = value;
    }

    public get contentArea(): MediaCmsContentArea {
        return this._contentArea;
    }
    public set contentArea(value: MediaCmsContentArea) {
        this._contentArea = value;
    }

    public get mediacmscontentstorycard(): MediaCmsContentStoryCard {
        return this._mediacmscontentstorycard;
    }
    public set mediacmscontentstorycard(value: MediaCmsContentStoryCard) {
        this._mediacmscontentstorycard = value;
    }

    public get videoUploadBtn(): JQuery<HTMLElement> {
       return this._videoUploadBtn;
    }
    public set videoUploadBtn(value: JQuery<HTMLElement>) {
       this._videoUploadBtn = value;
    }

    public get audioUploadBtn(): JQuery<HTMLElement> {
        return this._audioUploadBtn;
    }
    public set audioUploadBtn(value: JQuery<HTMLElement>) {
        this._audioUploadBtn = value;
    }

    public get storyUploadBtn(): JQuery<HTMLElement> {
        return this._storyUploadBtn;
    }
    public set storyUploadBtn(value: JQuery<HTMLElement>) {
        this._storyUploadBtn = value;
    }

    public get quillModal(): BsModal {
        return this._quillModal;
    }
    public set quillModal(value: BsModal) {
        this._quillModal = value;
    }

    public get inpTitle(): JQuery<HTMLElement> {
        return this._inpTitle;
    }
    public set inpTitle(value: JQuery<HTMLElement>) {
        this._inpTitle = value;
    }

    
   

    protected createHeader(): JQuery<HTMLElement>{

        let rowHeader: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
            
        });

        let col1: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
            
        });

        let col2: JQuery<HTMLElement> = $("<div/>", {
            class: "col-6"
            
        });

        let col3: JQuery<HTMLElement> = $("<div/>", {
            class: "col-1"
            
        });

        let colBack: JQuery<HTMLElement> = $("<div/>", {
            class: "col-1"
        });

        this.videoBtn = $("<button/>", {
            class: "btn btn-dark fw-bold me-3 ",
            text: "Video   "
        }).on("click", () => {

            this.videoBtn.removeClass("btn-outline-dark");
            this.videoBtn.addClass("btn-dark");

            this.storyBtn.removeClass("btn-dark");
            this.storyBtn.addClass("btn-outline-dark");

            this.audioBtn.removeClass("btn-dark");
            this.audioBtn.addClass("btn-outline-dark");

            this.contentArea.mode = "video";
            this.changeUploudBtn("video");
        });
        
        this.audioBtn = $("<button/>", {
            class: "btn btn-outline-dark fw-bold me-3",
            text: "Audio   "
        }).on("click", () => {

            this.audioBtn.removeClass("btn-outline-dark");
            this.audioBtn.addClass("btn-dark");

            this.storyBtn.removeClass("btn-dark");
            this.storyBtn.addClass("btn-outline-dark");

            this.videoBtn.removeClass("btn-dark");
            this.videoBtn.addClass("btn-outline-dark");

            this.contentArea.mode = "audio";
            this.changeUploudBtn("audio");
        });

        this.storyBtn = $("<button/>", {
            class: "btn btn-outline-dark fw-bold me-3 ",
            text: "Verhalen   "
        }).on("click", () => {

            this.storyBtn.removeClass("btn-outline-dark");
            this.storyBtn.addClass("btn-dark");

            this.audioBtn.removeClass("btn-dark");
            this.audioBtn.addClass("btn-outline-dark");

            this.videoBtn.removeClass("btn-dark");
            this.videoBtn.addClass("btn-outline-dark");
            
            this.contentArea.mode = "story";
            this.changeUploudBtn("story");
        });

        this.videoUploadBtn = $("<button/>", {
            class: "btn btn-outline-dark float-end"
            
        });

        let videoUploadBtnIcon = $("<i/>", {
            class: "fa-solid fa-arrow-up-from-bracket"
        });

        this.audioUploadBtn = $("<button/>", {
            class: "btn btn-outline-dark float-end"
            
        }).hide();

        let audioUploadBtnIcon = $("<i/>", {
            class: "fa-solid fa-arrow-up-from-bracket"
        });

        this.storyUploadBtn = $("<button/>", {
            class: "btn btn-outline-dark float-end"
            
        }).on("click", ()=>{

            this.selectedStoryId = -1;
            this.quill.clipboard.dangerouslyPasteHTML("");
            this.inpTitle.val(null); 
            this.quillModal.show();

        }).hide();

        let storyUploadBtnIcon = $("<i/>", {
            class: "fa-solid fa-plus"
        });

        this.storyUploadBtn.append(storyUploadBtnIcon);
        this.audioUploadBtn.append(audioUploadBtnIcon);
        this.videoUploadBtn.append(videoUploadBtnIcon);
        this.disableAreaBtns();
        

        this.searchFunction = $("<input/>", {
            class: "form-control ",
            placeholder: "Search..",
            type: "text",
            disabled: true
        }).on("input", ()=>{

            let searchVal: string = this.searchFunction.val() as string;

            if(searchVal.trim() != ""){

                switch(this.contentArea.mode){
                    case "audio": {
                        this.contentArea.selectedAudios = this.searchFunctionAudio(this.contentArea.audios, searchVal); 
                        break;
                    };
                    case "video": {
                        this.contentArea.selectedVideos = this.searchFunctionVideo(this.contentArea.videos, searchVal); 
                        break;
                    };
                    case "story": {
                        this.contentArea.selctedStorys = this.searchFunctionStory(this.contentArea.storys, searchVal);
                        break; 
                    };
                    default: console.log("loading"); break;
                }
            }else{
                this.contentArea.selectedVideos = this.contentArea.videos;
                this.contentArea.selectedAudios = this.contentArea.audios;
                this.contentArea.selctedStorys = this.contentArea.storys;
            }

            this.contentArea.changeContentArea();
        });

        

        FileUploader.setAudioUploader(this.audioUploadBtn, (uploadSucces: boolean, file: File)=>{
            console.log("type: ", typeof file);
            console.log("Upload button clicked!", file);
            console.log("uploadAudSatus: ", uploadSucces);
            window.location.reload();
        });


        FileUploader.setVideoUploader(this.videoUploadBtn, (uploadSucces: boolean, file: File)=>{
            console.log("type: ", typeof file);
            console.log("Upload button clicked!", file);
            console.log("uploadVidSatus: ", uploadSucces);
            window.location.reload();
        });
        

        let backBtn = $("<button/>", {
            class: "btn btn-outline-dark float-end"
        }).on("click", ()=> {
            window.location.replace("/overview");
        });

        let backIcon = $("<i/>", {
            class: "fas fa-arrow-left-long"
        });

        backBtn.append(backIcon);
        colBack.append(backBtn);

        col1.append(this.videoBtn, this.audioBtn, this.storyBtn);
        col2.append(this.searchFunction);
        col3.append(this.videoUploadBtn, this.audioUploadBtn, this.storyUploadBtn);

        rowHeader.append(col1, col2, col3, colBack);
       

        return rowHeader;
    }

    public enableAreaBtns(){

        this.storyBtn.removeAttr("disabled");
        this.audioBtn.removeAttr("disabled");
        this.videoBtn.removeAttr("disabled");
    }
    
    public disableAreaBtns(){
        
        this.storyBtn.attr("disabled", "disabled");
        this.audioBtn.attr("disabled", "disabled");
        this.videoBtn.attr("disabled", "disabled");
    }

    public enableSearch(){

        this.searchFunction.removeAttr("disabled");
        this.enableAreaBtns();
    }
    
    public disableSearch(){

        this.searchFunction.attr("disabled", "disabled");
        this.disableAreaBtns();
    }

    private createQuillEditor() {
        
        let quillContainer = $("<div/>", {
            class: "d-none"
        });

        let inpGroup: JQuery<HTMLElement> = $("<div/>", {
            class: "input-group mb-2" 
        });

        this.inpTitle = $("<input/>", {
            class: "form-control ",
            placeholder: "Title..",
            type: "title"
        });

        inpGroup.append(this.inpTitle);

        let quill = $("<div/>", {
            id: "editor",
            class: "mb-2"
        }).css({"max-height": "600px"});

        let saveBtn = $("<button/>", {
            class: "btn btn-outline-dark fw-bold float-end",
        }).on("click", () => {
            //dit nog doen
            if(this.inpTitle.val() !== '' || this.inpTitle.val() !== null){
                if(this.selectedStoryId != -1){
                    StoryDataHandler.update(this.selectedStoryId, this.inpTitle.val().toString(), this.quill.root.innerHTML, () => {
                        
                        this.quillModal.close();
                        window.location.reload();
                    });
                    this.selectedStoryId = -1;
                }else{
                    StoryDataHandler.upload(this.inpTitle.val().toString(), this.quill.root.innerHTML, ()=>{
                        this.quillModal.close();
                        window.location.reload();
                    });
                }
            }else{

            }
        });

        let storySaveBtnIcon = $("<i/>", {
            class: "fa-solid fa-floppy-disk"
        });

        saveBtn.append(storySaveBtnIcon);

        quillContainer.append(inpGroup, quill, saveBtn);

        $("body").append(quillContainer);
        this.initQuill();

        
        this.quillModal = new BsModal(quillContainer);
        quillContainer.removeClass("d-none");
        $("body").append(this.quillModal.html);
    }

    public getQuillInstance(): Quill {

        if (!this.quill) {
            // console.error("Quill-instantie in CMSPage is niet beschikbaar!");
        }

        return this.quill;
    }

    private initQuill(): void {

        this.quill = new Quill("#editor",{
            theme: 'snow',
            placeholder: 'Toevoeg tekst.....',
            modules: {
                toolbar: [

                    // Font styling
                    [{ 'font': [] }], // Font dropdown
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }], // Header sizes
                    [{ 'size': ['small', false, 'large', 'huge'] }], // Text sizes
        
                    // Text styling and formatting
                    [{ 'bold': true }, { 'italic': true }, { 'underline': true }, { 'strike': true }], // Bold, italic, underline, strikethrough
                    [{ 'color': [] }, { 'background': [] }], // Text color and background color
        
                    // Script (superscript/subscript)
                    [{ 'script': 'sub' }, { 'script': 'super' }], // Superscript, subscript
        
                    // lists
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }], // Ordered and bullet lists
                    [{ 'indent': '-1' }, { 'indent': '+1' }], // Indent/outdent
        
                    // Text alignment
                    [{ 'align': [] }], // Alignment options (left, center, right, justify)
                    
                ],
            },
        });
    }


    public changeUploudBtn(mode: "video" | "audio" | "story"){
        
        this.videoUploadBtn.hide();
        this.audioUploadBtn.hide();
        this.storyUploadBtn.hide();
    
        if (mode === "video") {
            this.videoUploadBtn.show();
        } else if (mode === "audio") {
            this.audioUploadBtn.show();
        } else if (mode === "story") {
            this.storyUploadBtn.show();
        }
    }

    public searchFunctionVideo(data: Video[], input: String): Video[]{
        return data.filter(item => item.name.toLowerCase().includes(input.toLowerCase()));
    }

    public searchFunctionAudio(data: Audio[], input: String): Audio[]{
        return data.filter(item => item.name.toLowerCase().includes(input.toLowerCase()));
    }

    public searchFunctionStory(data: Story[], input: String): Story[]{
        return data.filter(item => item.name.toLowerCase().includes(input.toLowerCase()));
    }

}