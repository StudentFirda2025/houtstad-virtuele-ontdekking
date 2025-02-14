import $ from 'jquery';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { Header } from './Header';
import { Bs } from './Bs';
import { QRCodeScanner } from './QRCodeScanner';
import { InfoPunt } from '../../generic-code/InfoPunt';
import { UrlHelper } from '../../generic-code/UrlHelper';
import { InfoPuntDataHandler } from '../../generic-code/datahandler/InfoPuntDataHandler';
import { BsAlert } from '../../generic-code/bootstrap/BsAlert';


export class UserPage {

    private _infoPunt: InfoPunt;

    private _qrCodeScanner: QRCodeScanner;
    private _header: Header;
    private _videoPlayer: JQuery<HTMLElement>;
    private _audioPlayer: JQuery<HTMLElement>;

    constructor() {

        $('body').addClass('houtstad-bg-dark');
        
        // Create and show logo plus loading icon
        let loadingContainer = this.createLoadingContainer();
        $("body").append(loadingContainer);

        // Create QR code scanner
        this.qrCodeScanner = new QRCodeScanner();

        this.qrCodeScanner.onScanSuccess = (decodedText, decodedResult)=>{

            window.location.href = decodedText;
            // console.log(decodedText);
            // console.log(decodedResult);
        };

        $("body").append(this.qrCodeScanner.html);

        let idParameter: number = Number(UrlHelper.getUrlParameter("id"));

        InfoPuntDataHandler.get(idParameter, (infoPunt: InfoPunt | null)=>{

            if(infoPunt == null){
                new BsAlert({
                    type: "danger",
                    text: "Fout bij het ophalen van de gegevens!"
                }).show();
                return; 
            }

            this.infoPunt = infoPunt;

            this.loadInfoPuntMedia(this.infoPunt, ()=>{

                // Remove loading icon and logo
                loadingContainer.remove(); 

                // Create page components
                this.header = new Header(this.qrCodeScanner);

                // Create page
                this.initPage();
            });
        });
    }



    protected get infoPunt(): InfoPunt {
        return this._infoPunt;
    }
    protected set infoPunt(value: InfoPunt) {
        this._infoPunt = value;
    }

    public get qrCodeScanner(): QRCodeScanner {
        return this._qrCodeScanner;
    }
    public set qrCodeScanner(value: QRCodeScanner) {
        this._qrCodeScanner = value;
    }

    protected get header(): Header {
        return this._header;
    }
    protected set header(value: Header) {
        this._header = value;
    }

    public get videoPlayer(): JQuery<HTMLElement> {
        return this._videoPlayer;
    }
    public set videoPlayer(value: JQuery<HTMLElement>) {
        this._videoPlayer = value;
    }

    public get audioPlayer(): JQuery<HTMLElement> {
        return this._audioPlayer;
    }
    public set audioPlayer(value: JQuery<HTMLElement>) {
        this._audioPlayer = value;
    }

    /**
     * Creates a container (div) with the houtstad logo, and a spinner icon.
     */
    private createLoadingContainer(): JQuery<HTMLElement>{

        let container = Bs.jqEl("div", "d-flex justify-content-center align-items-center vw-100 vh-100");
        let BSContainer = Bs.jqEl("div", "container");

        // Logo
        let logoRow = Bs.jqEl("div", "row");
        let logoCol = Bs.jqEl("div", "col-12 text-center");
        let logo = Bs.jqEl("img", "img-fluid", {src: "image/logo.png"});

        logoCol.append(logo);
        logoRow.append(logoCol);

        // Spinner
        let spinnerRow = Bs.jqEl("div", "row");
        let spinnerCol = Bs.jqEl("div", "col-12 text-center");
        let spinnerIcon = Bs.jqEl("i", "fas fa-spinner fa-spin fa-5x").css("color", "#FFFFFF"); 

        spinnerCol.append(spinnerIcon);
        spinnerRow.append(spinnerCol);

        BSContainer.append(
            logoRow, 
            spinnerRow
        );

        container.append(BSContainer);

        return container;
    }

    private loadInfoPuntMedia(infoPunt: InfoPunt, callback: ()=>void) {

        let videoLoaded: boolean = (infoPunt.video == null); // If there is no video, set videoLoaded to true, no need to wait for video.
        let imageLoaded: boolean = (infoPunt.image == null); // If there is no image, set imageLoaded to true, no need to wait for image.
        let audioLoaded: boolean = (infoPunt.audio == null); // If there is no audio, set audioLoaded to true, no need to wait for audio.

        if(infoPunt.video != null){
            infoPunt.video.getFile(()=>{
                videoLoaded = true;
            });
        }

        if(infoPunt.image != null){
            infoPunt.image.getFile(()=>{
                imageLoaded = true;
            });
        }

        if(infoPunt.audio != null){
            infoPunt.audio.getFile(()=>{
                audioLoaded = true;
            });
        }

        let interval = setInterval(() => {
            if(videoLoaded && audioLoaded && imageLoaded){
                clearInterval(interval);
                callback();
            }
        }, 500); // Check every half second
    }


    private initPage(){

        let container = Bs.jqEl("div", "container-fluid")
        .css({
            "padding": "25px"
        });

        this.header.html.addClass("mb-3");

        container.append(
            this.header.html,
            (this.infoPunt.video ? this.createVideoArea("mb-3") : null), // <---| 
            (this.infoPunt.image ? this.createImageArea("mb-3") : null), // <___|Note that there should only be a video or a image, not both  
            (this.infoPunt.audio ? this.createAudioArea("mb-3") : null),
            (this.infoPunt.text != "" ? this.createTextArea(): null)
        );

        $("body").append(container);
    }


    private createVideoArea(rowClass: string = ""): JQuery<HTMLElement>{

        let row = Bs.jqEl("div", ("row " + rowClass));
        let col = Bs.jqEl("div", "col-12");

        let flexContainer = Bs.jqEl("div", "d-flex justify-content-center")

        this.videoPlayer = Bs.jqEl("video", "w-100", {

            controls: true,
        }).css("border-radius", "25px");

        this.infoPunt.video.getFile((path)=>{
            this.videoPlayer.attr("src", path);
        });

        flexContainer.append(this.videoPlayer);
        col.append(flexContainer);
        row.append(col);

        return row;
    }

    private createImageArea(rowClass: string = ""): JQuery<HTMLElement>{

        let row = Bs.jqEl("div", ("row " + rowClass));
        let col = Bs.jqEl("div", "col-12");

        let flexContainer = Bs.jqEl("div", "d-flex justify-content-center");
        let img = Bs.jqEl("img", "img-fluid rounded");

        this.infoPunt.image.getFile((path)=>{
            img.attr("src", path);
        });

        flexContainer.append(img);
        col.append(flexContainer);
        row.append(col);

        return row;
    }

    private createAudioArea(rowClass: string = ""): JQuery<HTMLElement>{

        let row = Bs.jqEl("div", ("row " + rowClass));
        let col = Bs.jqEl("div", "col-12");

        let flexContainer = Bs.jqEl("div", "d-flex justify-content-center");

        this.audioPlayer = Bs.jqEl("audio", "w-100 rounded ", {
            controls: true
        });

        this.infoPunt.audio.getFile((path)=>{
            this.audioPlayer.attr("src", path);
        });

        flexContainer.append(this.audioPlayer);
        col.append(flexContainer);
        row.append(col);

        return row;
    }

    private createTextArea(rowClass: string = ""): JQuery<HTMLElement>{

        let row = Bs.jqEl("div", ("row " + rowClass));
        let col = Bs.jqEl("div", "col-12");

        let textVak = Bs.jqEl("div", "p-2 text-white",{
            html: this.infoPunt.text
        });

        col.append(textVak);
        row.append(col);
        
        return row;
    }


    public getUrlParameter(parameter: string): string | null{
        const urlSearchParams = new URLSearchParams(window.location.search);
        return urlSearchParams.get(parameter);
    }
}
