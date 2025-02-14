import $ from "jquery";
import { Video } from "../../generic-code/Video";
import "@fortawesome/fontawesome-free/js/all";
import { VideoDataHandler } from "../../generic-code/datahandler/VideoDataHandler";
import { messageReturn } from "../../generic-code/datahandler/dataReturn";

export class MediaCmsContentVideoCard{

    private _html: JQuery<HTMLElement>;
    private _video: Video;
    private _nameContainer: JQuery<HTMLElement>;
    private _inpName: JQuery<HTMLElement>;
    private _inpGroup: JQuery<HTMLElement>;
    private _parentCol: JQuery<HTMLElement>;
    private _confirmBtn: JQuery<HTMLElement>;
    private _videoUpdatebtn: JQuery<HTMLElement>;


    constructor(video: Video, parentCol: JQuery<HTMLElement>){
        this.video = video;
        this.parentCol = parentCol;
        
        this.html = this.createCard(); 
    }


    public get parentCol(): JQuery<HTMLElement> {
        return this._parentCol;
    }
    public set parentCol(value: JQuery<HTMLElement>) {
        this._parentCol = value;
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }

    public get video(): Video {
        return this._video;
    }
    public set video(value: Video) {
        this._video = value;
    }

    public get nameContainer(): JQuery<HTMLElement> {
        return this._nameContainer;
    }
    public set nameContainer(value: JQuery<HTMLElement>) {
        this._nameContainer = value;
    }

    public get inpName(): JQuery<HTMLElement> {
        return this._inpName;
    }
    public set inpName(value: JQuery<HTMLElement>) {
        this._inpName = value;
    }

    public get inpGroup(): JQuery<HTMLElement> {
        return this._inpGroup;
    }
    public set inpGroup(value: JQuery<HTMLElement>) {
        this._inpGroup = value;
    }

    public get confirmBtn(): JQuery<HTMLElement> {
        return this._confirmBtn;
    }
    public set confirmBtn(value: JQuery<HTMLElement>) {
        this._confirmBtn = value;
    }

    public get videoUpdatebtn(): JQuery<HTMLElement> {
        return this._videoUpdatebtn;
    }
    public set videoUpdatebtn(value: JQuery<HTMLElement>) {
        this._videoUpdatebtn = value;
    }
   


    protected createCard(): JQuery<HTMLElement>{

        let card: JQuery<HTMLElement> = $("<div/>", {
            class: "card border-dark"
        });

        let cardBody: JQuery<HTMLElement> = $("<div/>", {
            class: "card-body"
        });

        card.append(cardBody);
        cardBody.append(this.createVideo(), this.createRowVideo());//this.createVideoname()


        return card;
    }

    private createVideo(): JQuery<HTMLElement>{

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
            
        });

        let col: JQuery<HTMLElement> = $("<div/>", {
            class: "d-flex justify-content-center"
        });

        let videoBorder: JQuery<HTMLElement> = $("<video/>", {
            class: "img-fluid",
            controls: true,
            style: "max-height: 290px;"
        });

        col.append(this.createLoadingContainer());

        this.video.getFile((path)=>{
            videoBorder.attr("src", path);
            col.empty();
            col.append(videoBorder);
        });

        row.append(col);

        return row;
    }

    private createLoadingContainer(): JQuery<HTMLElement>{

        let container = $("<div/>", {
            class: "d-flex justify-content-center align-items-center"
        }).css({
            "width": "100%",
            "height": "auto"
        });

        let BSContainer = $("<div/>", {
            class: "container"
        });

        // Spinner
        let spinnerRow = $("<div/>", {
            class: "row"
        });

        let spinnerCol = $("<div/>", {
            class: "col-12 text-center"
        });

        let spinnerIcon = $("<i/>", {
            class: "fas fa-spinner fa-spin fa-5x"
        }).css("color", "#000000"); 

        spinnerCol.append(spinnerIcon);
        spinnerRow.append(spinnerCol);

        BSContainer.append(spinnerRow);
        container.append(BSContainer);

        return container;
    }

    private createVideoname(): JQuery<HTMLElement>{

        this.inpGroup = $("<div/>", {
            class: "input-group pt-4" 
        });

        this.inpName = $("<input/>", {
            class: "form-control ",
            type: "title"
        }).val(this.video.name);

        this.inpName.attr("disabled", "disabled");

        this.inpGroup.append(this.inpName, this.createVideoupdate(), this.createConfirmBtn(), this.createVideodelete());

        return this.inpGroup;
    }

    private createVideodelete(): JQuery<HTMLElement>{

        let videoDeletebtn = $("<button/>", {
            class: "btn btn-dark fw-bold rounded-end",
            type: "button"
        }).on("click", () => {

            if (confirm("weet je zeker dat je deze video wilt verwijderen")) {
                VideoDataHandler.delete(this.video.id, (response: messageReturn) =>{
                    this.parentCol.remove();
                    window.location.reload();
                });
            }
        });

        let deleteIcon = $("<i/>", {
            class: "fa-solid fa-trash"
        });
        
        videoDeletebtn.append(deleteIcon);
        
        return videoDeletebtn;
    }

    private createConfirmBtn(): JQuery<HTMLElement>{

        this.confirmBtn = $("<button/>", {
            class: "btn btn-success d-none",
            type: "button"
        }).on("click", ()=>{

            VideoDataHandler.update(this.video.id, this.inpName.val() as string,(Response: messageReturn) =>{
                
                this.video.name = this.inpName.val() as string;

                this.inpName.attr("disabled", "disabled");
                this.confirmBtn.addClass("d-none");
                this.videoUpdatebtn.removeClass("d-none");
            });
        });

        let confirmIcon = $("<i/>", {
            class: "fa-solid fa-check"
        });
        

        this.confirmBtn.append(confirmIcon);
        
        return this.confirmBtn;
    }

    private createVideoupdate(): JQuery<HTMLElement>{

        this.videoUpdatebtn = $("<button/>", {
            class: "btn btn-dark fw-bold ",
            type: "button"
        }).on("click", () => {

            this.inpName.removeAttr("disabled");
            this.videoUpdatebtn.addClass("d-none");
            this.confirmBtn.removeClass("d-none");
    
        });

        let updateIcon = $("<i/>", {
            class: "fa-solid fa-pen-to-square"
        });
        

        this.videoUpdatebtn.append(updateIcon);

        return this.videoUpdatebtn;
    }

    private createRowVideo(): JQuery<HTMLElement>{

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
            
        });

        let col: JQuery<HTMLElement> = $("<div/>", {
            class: "col-12"
            
        });

        col.append(this.createVideoname());

        row.append(col);
        
        return row;
    }
}





