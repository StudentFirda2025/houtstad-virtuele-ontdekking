import $ from "jquery";
import '../css/mediacms.scss';
import { MediaCmsHeader } from "./MediaCmsHeader";
import { MediaCmsContentArea } from "./MediaCmsContentArea";

export class MediaCmsPage {


    protected _header: MediaCmsHeader;
    private _content: MediaCmsContentArea;
    

    constructor(){

        this.createPage();
    }

    public get header(): MediaCmsHeader {
        return this._header;
    }
    public set header(value: MediaCmsHeader) {
        this._header = value;
    }
    public get content(): MediaCmsContentArea {
        return this._content;
    }
    public set content(value: MediaCmsContentArea) {
        this._content = value;
    }

    protected createPage() {

        let container: JQuery<HTMLElement> = $("<div/>", {
            class: "container-fluid"
        });

        let card: JQuery<HTMLElement> = $("<div/>", {
            class: "card mt-3"
        });

        let cardheader: JQuery<HTMLElement> = $("<div/>", {
            class: "card-header"
        });

        let cardbody: JQuery<HTMLElement> = $("<div/>", {
            class: "card-body"
        });

        this.content = new MediaCmsContentArea("video", this);
        this.header = new MediaCmsHeader(this);
        
        container.append(card);//(this.header.html, this.content.html);
        cardheader.append(this.header.html);
        cardbody.append(this.content.html);
        card.append(cardheader, cardbody);


        $("body").append(container);
    }

}