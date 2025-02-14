import $ from "jquery";
import "@fortawesome/fontawesome-free/js/all";
import { Story } from "../../generic-code/Story";
import { MediaCmsPage } from "./MediaCmsPage";
import { StoryDataHandler } from "../../generic-code/datahandler/StoryDataHandler";
import { messageReturn } from "../../generic-code/datahandler/dataReturn";

export class MediaCmsContentStoryCard {

    private _html: JQuery<HTMLElement>;
    private _tekst: Story;
    private _nameContainer: JQuery<HTMLElement>;
    private _inpName: JQuery<HTMLElement>;
    private _inpGroup: JQuery<HTMLElement>;
    private _StoryName: JQuery<HTMLElement>;
    private _parent: MediaCmsPage;
    private _parentCol: JQuery<HTMLElement>;
    private _confirmBtn: JQuery<HTMLElement>;
    private _storyUpdatebtn: JQuery<HTMLElement>;

    constructor(tekst: Story, parent: MediaCmsPage, parentCol: JQuery<HTMLElement>) {
        this.tekst = tekst;
        this.parent = parent;
        this.parentCol = parentCol;
      
        this.html = this.createCard();
    }

    // Getters and Setters
    public get parentCol(): JQuery<HTMLElement> {
        return this._parentCol;
    }
    public set parentCol(value: JQuery<HTMLElement>) {
        this._parentCol = value;
    }

    public get parent(): MediaCmsPage {
        return this._parent;
    }
    public set parent(value: MediaCmsPage) {
        this._parent = value;
    }

    public get StoryName(): JQuery<HTMLElement> {
        return this._StoryName;
    }
    public set StoryName(value: JQuery<HTMLElement>) {
        this._StoryName = value;
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
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

    public get storyUpdatebtn(): JQuery<HTMLElement> {
        return this._storyUpdatebtn;
    }
    public set storyUpdatebtn(value: JQuery<HTMLElement>) {
        this._storyUpdatebtn = value;
    }

    public get tekst(): Story {
        return this._tekst;
    }
    public set tekst(value: Story) {
        this._tekst = value;
    }

    protected createCard(): JQuery<HTMLElement> {
        let card: JQuery<HTMLElement> = $("<div/>", {
            class: "card border-dark"
        });

        let cardBody: JQuery<HTMLElement> = $("<div/>", {
            class: "card-body"
        });

        card.append(cardBody);
        cardBody.append(this.createRowStory());

        return card;
    }

    private createStoryname(): JQuery<HTMLElement> {
      
        this.inpGroup = $("<div/>", {
            class: "input-group" 
        });

        this.inpName = $("<input/>", {
            class: "form-control ",
            type: "title"
        }).val(this.tekst.name);

        this.inpName.attr("disabled", "disabled");

        this.inpGroup.append(this.inpName, this.createStoryupdate(), this.createStorydelete());

        return this.inpGroup;
    }

    private createStorydelete(): JQuery<HTMLElement> {
      
        let storyDeletebtn = $("<button/>", {
            class: "btn btn-dark fw-bold rounded-end",
            type: "button"
        }).on("click", () => {
            if (confirm("Are you sure you want to delete this story?")) {
                StoryDataHandler.delete(this.tekst.id, (response: messageReturn) => {
                    this.parentCol.remove();
                    window.location.reload();
                });
            }
        });

        let deleteIcon = $("<i/>", {
            class: "fa-solid fa-trash"
        });

        storyDeletebtn.append(deleteIcon);
        return storyDeletebtn;
    }

    private createStoryupdate(): JQuery<HTMLElement> {

        this.storyUpdatebtn = $("<button/>", {
            class: "btn btn-dark fw-bold ",
            type: "button"
        }).on("click", () => {

            this.parent.header.selectedStoryId = this.tekst.id;
            this.parent.header.quill.clipboard.dangerouslyPasteHTML(this.tekst.text);
            this.parent.header.inpTitle.val(this.tekst.name); 
            this.parent.header.quillModal.show();
    
        });

        let updateIcon = $("<i/>", {
            class: "fa-solid fa-pen-to-square"
        });

        this.storyUpdatebtn.append(updateIcon);
      
        return this.storyUpdatebtn;
    }

    private createRowStory(): JQuery<HTMLElement> {
        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
        });

        let col: JQuery<HTMLElement> = $("<div/>", {
            class: "col-12"
        });

        col.append(this.createStoryname());
        row.append(col);
        return row;
    }
}
