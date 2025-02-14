import $ from "jquery";
import "@fortawesome/fontawesome-free/js/all";
import { Audio } from "../../generic-code/Audio";
import { AudioDataHandler } from "../../generic-code/datahandler/AudioDataHandler";
import { messageReturn } from "../../generic-code/datahandler/dataReturn";

export class MediaCmsContentAudioCard{

    private _html: JQuery<HTMLElement>;
    private _audio: Audio;
    private _nameContainer: JQuery<HTMLElement>;
    private _inpName: JQuery<HTMLElement>;
    private _parentCol: JQuery<HTMLElement>;
    private _inpGroup: JQuery<HTMLElement>;
    private _confirmBtn: JQuery<HTMLElement>;
    private _audioUpdatebtn: JQuery<HTMLElement>;
    

    constructor(audio: Audio, parentCol: JQuery<HTMLElement>){

        this.audio = audio;
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

    public get audio(): Audio {
        return this._audio;
    }
    public set audio(value: Audio) {
        this._audio = value;
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

    public get audioUpdatebtn(): JQuery<HTMLElement> {
        return this._audioUpdatebtn;
    }
    public set audioUpdatebtn(value: JQuery<HTMLElement>) {
        this._audioUpdatebtn = value;
    }

    protected createCard(): JQuery<HTMLElement>{

        let card: JQuery<HTMLElement> = $("<div/>", {
            class: "card border-dark"
        });

        let cardBody: JQuery<HTMLElement> = $("<div/>", {
            class: "card-body"
        });

        card.append(cardBody);

        cardBody.append(this.createAudio(),  this.createRowAudio());

        return card;
    }

    private createAudio(): JQuery<HTMLElement>{

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
            
        });

        let col: JQuery<HTMLElement> = $("<div/>", {
            class: "d-flex justify-content-center"
        });

        let audioBorder: JQuery<HTMLElement> = $("<audio/>", {
            class: "col-12",
            controls: true
        });

        col.append(this.createLoadingContainer());

        this.audio.getFile((path)=>{

            audioBorder.attr("src", path);
            col.empty();
            col.append(audioBorder);
        });

        row.append(col);

        return row;
    }

    private createAudioname(): JQuery<HTMLElement>{

        this.inpGroup = $("<div/>", {
            class: "input-group pt-4"
        });

        this.inpName = $("<input/>", {
            class: "form-control ",
            type: "title"
        }).val(this.audio.name);

        this.inpName.attr("disabled", "disabled");

        this.inpGroup.append(this.inpName, this.createAudioupdate(), this.createConfirmBtn(), this.createAudiodelete());

        return this.inpGroup;
    }

    private createAudiodelete(): JQuery<HTMLElement>{
 
        let audioDeletebtn = $("<button/>", {
            class: "btn btn-dark fw-bold rounded-end",
            type: "button"
        }).on("click", () => {
            
            AudioDataHandler.delete(this.audio.id, (response: messageReturn) => {
                this.parentCol.remove();
                window.location.reload();
            });
            
        });

        let deleteIcon = $("<i/>", {
            class: "fa-solid fa-trash"
        });

        audioDeletebtn.append(deleteIcon);
        return audioDeletebtn;
    }

    private createConfirmBtn(): JQuery<HTMLElement> {

        this.confirmBtn = $("<button/>", {
            class: "btn btn-success d-none",
            type: "button"
        }).on("click", ()=>{

            AudioDataHandler.update(this.audio.id, this.inpName.val() as string,(Response: messageReturn) =>{

                this.audio.name = this.inpName.val() as string;

                this.inpName.attr("disabled", "disabled");
                this.confirmBtn.addClass("d-none");
                this.audioUpdatebtn.removeClass("d-none");

            });
        });

        let confirmIcon = $("<i/>", {
            class: "fa-solid fa-check"
        });

        this.confirmBtn.append(confirmIcon);

        return this.confirmBtn;
    }

    private createAudioupdate(): JQuery<HTMLElement>{

        this.audioUpdatebtn = $("<button/>", {
            class: "btn btn-dark fw-bold ",
            type: "button"
        }).on("click", () => {

            this.inpName.removeAttr("disabled");
            this.audioUpdatebtn.addClass("d-none");
            this.confirmBtn.removeClass("d-none");
        });

        let updateIcon = $("<i/>", {
            class: "fa-solid fa-pen-to-square"
        });

        this.audioUpdatebtn.append(updateIcon);

        return this.audioUpdatebtn;
    }

    private createRowAudio(): JQuery<HTMLElement>{

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
        });

        let col: JQuery<HTMLElement> = $("<div/>", {
            class: "col-12"
        });

        col.append(this.createAudioname());
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
}