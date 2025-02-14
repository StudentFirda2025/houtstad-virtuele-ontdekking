import $ from "jquery";
import "../css/CMSPage.scss";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { TekstCMSClass } from "../class/TekstCMSClass";
import { VideoCMSClass } from "../class/VideoCMSClass";
import { AudioCMSClass } from "../class/AudioCMSClass";
import { ImageCMSClass } from "../class/ImageCMSClass";
import { InfoPunt, jsonInfoPunt } from "../../generic-code/InfoPunt";
import { InfoPuntDataHandler } from "../../generic-code/datahandler/InfoPuntDataHandler";
import 'quill/dist/quill.snow.css';
import { messageReturn } from "../../generic-code/datahandler/dataReturn";
import { UrlHelper } from "../../generic-code/UrlHelper";
import { BsAlert } from "../../generic-code/bootstrap/BsAlert";

export class CMSPage {

    private audioCMS: AudioCMSClass;
    private videoCMS: VideoCMSClass;
    private imageCMS: ImageCMSClass;
    private tekstCMS: TekstCMSClass;
    protected _app: InfoPunt;
    private readonly DEFAULT_INFOPUNT_NAAM = "Vul een naam in..."; // Constant for default name

    constructor() {
        
        this.audioCMS = new AudioCMSClass(this);
        this.videoCMS = new VideoCMSClass(this);
        this.imageCMS = new ImageCMSClass(this);
        this.tekstCMS = new TekstCMSClass(this);

        this.app = new InfoPunt(
            0,
            this.DEFAULT_INFOPUNT_NAAM, // Use the constant
            "",
            null,
            null,
            null
        );

        let id = UrlHelper.getUrlParameter("id");
        if (id != "new") {
            this.app.id = Number(id);
        }

        this.allesLaden().then(() => {

            this.init();

            if (this.app.image !== null) {
                $("#li2Image").trigger("click");
            }

            this.tekstCMS.initQuill(); // Initialize Quill after HTML is appended

        });
    }


    public get app(): InfoPunt {
        return this._app;
    }

    private set app(value: InfoPunt) {
        this._app = value;
    }


    private allesLaden(): Promise<void> {
        return new Promise((resolve) => {
            if (this.app.id != 0) {
                InfoPuntDataHandler.get(this.app.id, (response: InfoPunt | null) => {
                    if (response != null) {
                        this.app = response;
                    }
                    this.alleMediaLaden().then(() => resolve());
                });
            } else {
                this.alleMediaLaden().then(() => resolve());
            }
        });
    }

    private alleMediaLaden(): Promise<void> {
        return new Promise((resolve) => {
            Promise.all([
                new Promise((resolveVideo) => {
                    this.videoCMS.alleVideo(() => resolveVideo(null));
                }),
                new Promise((resolveImage) => {
                    this.imageCMS.alleImage(() => resolveImage(null));
                }),
                new Promise((resolveAudio) => {
                    this.audioCMS.alleAudio(() => resolveAudio(null));
                }),
                new Promise((resolveStory) => {
                    this.tekstCMS.alleStory(() => resolveStory(null));
                })
            ]).then(() => {
                resolve();
            });
        });
    }


    protected init(): void {

        $("body").css({
            "background-color": "#222222",
        });

        this.HtmlElement().appendTo($("body"));
    }

    private saveData(data: jsonInfoPunt): void {
       
        let savePopup: BsAlert = new BsAlert({
            type: "primary",
            text: "Info-punt aan het opslaan..."
        });
        savePopup.show();

        let savedPopup: BsAlert = new BsAlert({
            type: "success",
            text: "Info-punt opgeslagen!"
        });
        if (this.app.id == 0) {
            InfoPuntDataHandler.create(data, (msg: messageReturn) => {
           
                savePopup.hide();
                savedPopup.show();
                window.location.replace("/overview");
            });
        } else {
            InfoPuntDataHandler.update(data, (msg: messageReturn) => {
            
                savePopup.hide();
                savedPopup.show();
                window.location.replace("/overview");
            });
        }
    }

    public HtmlElement(): JQuery<HTMLElement> {

        let container = $('<div/>', {
            class: "container-fluid"
        });

        container.append(this.HtmlHeader(), this.HtmlBody());

        return container;
    }

    public HtmlHeader(): JQuery<HTMLElement> {

        let headerRow = $('<div/>', {
            class: "row"
        });

        let headerCol = $('<div/>', {
            class: "col-12 rounded-bottom border-bottom border-light text-white"
        });

        let headerInfoPuntNaam = $('<h1/>', {
            class: "",
            html: this.app.infopuntnaam,
            id: "headerInfoPuntNaam"
        });

        headerCol.append(headerInfoPuntNaam);
        headerRow.append(headerCol);

        return headerRow;
    }

    public HtmlBody(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row"
        });

        let colboven = $('<div/>', {
            class: "col-12 py-5"
        });

        let colbeneden = $('<div/>', {
            class: "col-12"
        });

        row.append(colboven, colbeneden);
        colboven.append(this.HtmlColBoven());
        colbeneden.append(this.HtmlColBeneden());

        return row;
    }

    public HtmlColBoven(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row"
        });

        let colInputGroep = $('<div/>', {
            class: "col-10"
        });

        let inputGroep = $('<div/>', {
            class: "input-group"
        });

        let input = $('<input/>', {
            class: "form-control",
            type: "text",
            id: "infoPuntNaam",
            placeholder: "Info-punt Naam",
            value: this.app.infopuntnaam
        }).on("keyup", () => {
            
            let newName = input.val()?.toString() || this.app.infopuntnaam;
            $("#headerInfoPuntNaam").text(newName);
        });

        let saveIcon = $('<i/>', {
            class: "fas fa-solid fa-floppy-disk"
        });

        let saveButton = $('<button/>', {
            class: "btn btn-outline-light",
            id: "Save",
            type: "button"
        }).on("click", () => {

            let editorContent = this.tekstCMS.quill.root.innerHTML;
            let infopuntnaam = $("#infoPuntNaam").val()?.toString() || this.DEFAULT_INFOPUNT_NAAM; // Use constant

            let video = this.videoCMS.selectedVideo;
            let image = this.imageCMS.selectedImage;
            let audio = this.audioCMS.selectedAudio;


            this.app.infopuntnaam = infopuntnaam;
            this.app.text = editorContent;
            this.app.video = video;
            this.app.image = image
            this.app.audio = audio;

            let dataToSend: jsonInfoPunt = this.app.toJSON();

            this.saveData(dataToSend);

        }).append(saveIcon);

        let colTerugButton = $('<div/>', {
            class: "col-2 d-flex justify-content-center"
        });

        let terugIcon = $('<i/>', {
            class: "fas fa-solid fa-arrow-left-long"
        });

        let terugButton = $('<button />', {
            class: "btn btn-outline-light",
            type: "button"
        }).append(terugIcon).on("click", () => {

            window.location.href = "/overview";
        });

        inputGroep.append(input, saveButton);
        colInputGroep.append(inputGroep);
        colTerugButton.append(terugButton);

        row.append(colInputGroep, colTerugButton);

        return row;
    }

    public HtmlColBeneden(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row"
        });

        let colLeft = $('<div/>', {
            class: "col-6"
        });

        let colRight = $('<div/>', {
            class: "col-6"
        });

        colLeft.append(this.HtmlBenedenLeft());
        colRight.append(this.tekstCMS.htmlStorySelect, this.tekstCMS.htmlStory);

        row.append(colLeft, colRight);

        return row;
    }

    public HtmlBenedenLeft(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row"
        });

        let colup = $('<div/>', {
            class: "col-12 pb-3"
        });

        let coldown = $('<div/>', {
            class: "col-12 pt-3"
        });

        let cardUpVideo = $('<div/>', {
            class: "card border-0"
        });

        let cardDownAudio = $('<div/>', {
            class: "card border-0"
        }).css({
            "background-color": "#868686"
        });

        let cardheader = $('<div/>', {
            class: "card-header"
        }).css({
            "background-color": "#868686"
        });

        let ul = $('<ul/>', {
            class: "nav nav-tabs card-header-tabs"
        });

        let li = $('<li/>', {
            class: "nav-item"
        }).on("click", () => {

            //Video active
            a2.removeClass("active");
            a.addClass("active");
            colUpImage.addClass("visually-hidden");
            colUpVideo.removeClass("visually-hidden");

            a2.css({
                "background-color": "#D7D7D7"
            });
            a.css({
                "background-color": ""
            });

            // Set Image dropdown to "Geen Image"
            this.imageCMS.dropDown.val('0'); // Assuming '0' is the value for "Geen Image"
            this.imageCMS.image.attr('src', 'image/No_image_available.svg.png');
            this.imageCMS.selectedImage = null;
        })

        let a = $('<a/>', {
            class: "nav-link active border border-light",
            html: "Video"
        });

        let li2 = $('<li/>', {
            class: "nav-item",
            id: "li2Image"
        }).on("click", () => {
            
            //Image active
            a.removeClass("active");
            a2.addClass("active");
            colUpVideo.addClass("visually-hidden");
            colUpImage.removeClass("visually-hidden");

            a2.css({
                "background-color": ""
            });
            a.css({
                "background-color": "#D7D7D7"
            });

            // Set Video dropdown to "Geen Video"
            this.videoCMS.dropDown.val('0'); // Assuming '0' is the value for "Geen Video"
            this.videoCMS.video.attr('src', '');
            this.videoCMS.selectedVideo = null;
        });

        let a2 = $('<a/>', {
            class: "nav-link border border-light",
            html: "Image"
        }).css({
            "background-color": "#D7D7D7"
        });

        let colUpVideo = $('<div/>', {
            class: "card-body",
            id: "cardbodyvideo"
        });

        let colUpImage = $('<div/>', {
            class: "card-body visually-hidden",
            id: "cardbodyimage"
        });

        let colDownAudio = $('<div/>', {
            class: "card-body rounded"
        });

        // Structure the cards and columns
        cardUpVideo.append(cardheader, colUpVideo, colUpImage);
        cardheader.append(ul);
        ul.append(li, li2);
        li.append(a);
        li2.append(a2);

        cardDownAudio.append(colDownAudio);
        colup.append(cardUpVideo);
        coldown.append(cardDownAudio);

        colUpVideo.append(this.videoCMS.htmlVideoPlayer, this.videoCMS.htmlVideoSelect);
        colUpImage.append(this.imageCMS.htmlImage, this.imageCMS.htmlImageSelect);
        colDownAudio.append(this.audioCMS.htmlAudioPlayer, this.audioCMS.htmlAudioSelect);

        // Append upper and lower sections to the row
        row.append(colup, coldown);

        return row;
    }
}