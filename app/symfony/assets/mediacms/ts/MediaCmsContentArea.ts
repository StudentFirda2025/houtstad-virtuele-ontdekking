import $ from "jquery";
import { MediaCmsContentVideoCard } from "./MediaCmsContentVideoCard";
import { MediaCmsContentAudioCard } from "./MediaCmsContentAudioCard";
import { MediaCmsContentStoryCard } from "./MediaCmsContentStoryCard";
import { Video } from "../../generic-code/Video";
import { Audio } from "../../generic-code/Audio";
import { Story } from "../../generic-code/Story";
import { VideoDataHandler } from "../../generic-code/datahandler/VideoDataHandler";
import { AudioDataHandler } from "../../generic-code/datahandler/AudioDataHandler";
import { StoryDataHandler } from "../../generic-code/datahandler/StoryDataHandler";
import { MediaCmsPage } from "./MediaCmsPage";

export type ContentAreaMode = "video" | "audio" | "story" | "loading";

export class MediaCmsContentArea{
    

    public videosLoaded: boolean = false; 
    private _videos: Video[] = [];
    private _selectedVideos: Video[] = this.videos;

    public audiosLoaded: boolean = false;
    private _audios: Audio[] = [];
    private _selectedAudios: Audio[] = this.audios;

    public storysLoaded: boolean = false;
    private _storys: Story[] = [];
    private _selctedStorys: Story[] = this.storys;
    
    private _mode: ContentAreaMode;

    protected _html: JQuery<HTMLElement>;
    protected _contentContainer: JQuery<HTMLElement>;

    private _parent: MediaCmsPage;


   
    constructor(mode: ContentAreaMode, parent: MediaCmsPage){
        this.mode = mode;
        this.parent = parent;

        this.mode = "loading";
        this.html = this.createContent();
        this.changeContentArea();
        
        VideoDataHandler.getAll((response) => {
            this.videosLoaded = true;
            this.videos = response.data;
            this.selectedVideos = this.videos;
            this.mode = "video";
            this.changeContentArea(); // trigger on start
        });
    }

    public get selectedVideos(): Video[] {
        return this._selectedVideos;
    }
    public set selectedVideos(value: Video[]) {
        this._selectedVideos = value;
    }

    public get selectedAudios(): Audio[] {
        return this._selectedAudios;
    }
    public set selectedAudios(value: Audio[]) {
        this._selectedAudios = value;
    }

    public get selctedStorys(): Story[] {
        return this._selctedStorys;
    }
    public set selctedStorys(value: Story[]) {
        this._selctedStorys = value;
    }

    protected get parent(): MediaCmsPage {
        return this._parent;
    }
    protected set parent(value: MediaCmsPage) {
        this._parent = value;
    }

    public get mode(): ContentAreaMode {
        return this._mode;
    }
    public set mode(value: ContentAreaMode) {
        this._mode = value;
        console.log("setter mode: ", value);
        if(this.contentContainer != undefined){
            this.changeContentArea();
        }
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }

    protected get contentContainer(): JQuery<HTMLElement> {
        return this._contentContainer;
    }
    protected set contentContainer(value: JQuery<HTMLElement>) {
        this._contentContainer = value;
    }

    public get videos(): Video[] {
        return this._videos;
    }
    public set videos(value: Video[]) {
        this._videos = value;
    }

    public get audios(): Audio[] {
        return this._audios;
    }
    public set audios(value: Audio[]) {
        this._audios = value;
    }

    public get storys(): Story[] {
        return this._storys;
    }
    public set storys(value: Story[]) {
        this._storys = value;
    }

    protected createContent(): JQuery<HTMLElement>{

        let rowContent: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
        });

        this.contentContainer = $("<div/>", {
            class: "col-12"
        });

        rowContent.append(this.contentContainer);

        return rowContent;
    }

    public changeContentArea(mode: ContentAreaMode = this.mode){
    
        switch(mode){
            case "video":

                if(this.parent.header != undefined){
                    this.parent.header.enableSearch();
                }
                this.contentContainer.empty();
                this.contentContainer.append(
                    this.createVideoContentArea()
                );
                break;

            case "audio":

                if(this.audiosLoaded == false){

                    this.mode = "loading";
                    this.changeContentArea();

                    AudioDataHandler.getAll((response) => {
                        this.audiosLoaded = true;
                        this.audios = response.data;
                        this.selectedAudios = this.audios;

                        this.mode = "audio";

                        this.contentContainer.empty();
                        this.contentContainer.append(this.createAudioContentArea());
                    });
                }else{

                    if(this.parent.header != undefined){
                        this.parent.header.enableSearch();
                    }

                    this.contentContainer.empty();
                    this.contentContainer.append(this.createAudioContentArea());
                }
                break;

            case "story":

                if(this.storysLoaded == false){

                    this.mode = "loading";
                    this.changeContentArea();

                    StoryDataHandler.getAll((response) => {
                        this.storysLoaded = true;
                        this.storys = response.data;
                        this.selctedStorys = this.storys;

                        this.mode = "story";
                        this.contentContainer.empty();
                        this.contentContainer.append(this.createStoryContentArea());
                    });
                }else{

                    if(this.parent.header != undefined){
                        this.parent.header.enableSearch();
                    }

                    this.contentContainer.empty();
                    this.contentContainer.append(this.createStoryContentArea());
                }
                break; 

            case "loading": 

                if(this.parent.header != undefined){
                    this.parent.header.disableSearch();
                }

                this.contentContainer.empty();
                this.contentContainer.append(
                    this.createLoadingContainer()
                );  
        }
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
    
    protected createVideoContentArea(data: Video[] = this.selectedVideos): JQuery<HTMLElement>{
       
        let container = $("<div/>");

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row mb-3"
        });

        container.append(row);

        data.forEach((video: Video) => {

            if(row.children().length >= 3){
                row = $("<div/>", {
                    class: "row mb-3"
                });
                container.append(row);
            }

            let col: JQuery<HTMLElement> = $("<div/>", {
                class: "col-4"
            });

            let contentCard: MediaCmsContentVideoCard = new MediaCmsContentVideoCard(video, col);
            col.append(contentCard.html);

            row.append(col);
        });

        return container;
    }

    protected createAudioContentArea(data: Audio[] = this.selectedAudios): JQuery<HTMLElement>{

        let container = $("<div/>");

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row mb-3"
        });

        container.append(row);

        data.forEach((audio: Audio) => {

            if(row.children().length >= 3){

                row = $("<div/>", {
                    class: "row mb-3"
                });

                container.append(row);
            }

            let col: JQuery<HTMLElement> = $("<div/>", {
                class: "col-4"
            });

            let contentCard: MediaCmsContentAudioCard = new MediaCmsContentAudioCard(audio, col);
            col.append(contentCard.html);

            row.append(col);
        });

        return container;
    }
   
    protected createStoryContentArea(data: Story[] = this.selctedStorys): JQuery<HTMLElement>{
       
        let container = $("<div/>");

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row mb-3"
        });

        container.append(row);

        data.forEach((story: Story) => {

            if(row.children().length >= 3){

                row = $("<div/>", {
                    class: "row mb-3"
                });

                container.append(row);
            }

            let col: JQuery<HTMLElement> = $("<div/>", {
                class: "col-4"
            });

            let contentCard: MediaCmsContentStoryCard = new MediaCmsContentStoryCard(story, this.parent, col);
            col.append(contentCard.html);

            row.append(col);
        });

        return container;
    }

}