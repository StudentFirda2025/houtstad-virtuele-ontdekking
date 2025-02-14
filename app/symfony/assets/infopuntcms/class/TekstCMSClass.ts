import $ from "jquery";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Story } from "../../generic-code/Story";
import Quill from "quill";
import { CMSPage } from "../ts/CMSPage";
import { StoryDataHandler } from "../../generic-code/datahandler/StoryDataHandler";

export class TekstCMSClass {
    
    private _htmlStory: JQuery<HTMLElement>;
    private _htmlStorySelect: JQuery<HTMLElement>;
    private _dropDown: JQuery<HTMLElement>;
    private CMSpage: CMSPage;
    public quill: Quill;
    private storys: Story[];
    private _selectedStory: Story | null;


    constructor(CMSpage: CMSPage) {
        this.CMSpage = CMSpage;
        this.storys = []; // Initialize storys array
    }


    public get htmlStory(): JQuery<HTMLElement> {
        return this._htmlStory;
    }
    public set htmlStory(value: JQuery<HTMLElement>) {
        this._htmlStory = value;
    }

    public get htmlStorySelect(): JQuery<HTMLElement> {
        return this._htmlStorySelect;
    }
    public set htmlStorySelect(value: JQuery<HTMLElement>) {
        this._htmlStorySelect = value;
    }

    public get selectedStory(): Story | null {
        return this._selectedStory;
    }
    protected set selectedStory(value: Story | null) {
        this._selectedStory = value;
    }

    public get dropDown(): JQuery<HTMLElement> {
        return this._dropDown;
    }
    public set dropDown(value: JQuery<HTMLElement>) {
        this._dropDown = value;
    }


    public alleStory(callback) {
        StoryDataHandler.getAll((response: { status: string; data: Story[] }) => { // Corrected callback type

            if (response.status === "success") {

                this.storys = response.data; // No need to map
                
                this.htmlStory = this.HtmlBenedenRight();
                this.htmlStorySelect = this.HtmlStorySelect();
        

                if (callback) callback();
            } else {
                // console.error("Error fetching stories:", response); // Handle error
            }
        });
    }

    public setSelectedStoryById(storyId: number): void {

        this.dropDown.val(storyId);
        this.selectedStory = this.storys.find(story => story.id === storyId);
    }

    public initQuill(): void {

        if ($("#editor").length === 0) {
            // console.error("initQuill: #editor not found in the DOM!");
            return;
        }

        this.quill = new Quill("#editor", {
            theme: 'snow',
            placeholder: 'Toevoeg tekst.....',
            modules: {
                toolbar: [
                    [{ 'font': [] }],
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    [{ 'size': ['small', false, 'large', 'huge'] }],
                    [{ 'bold': true }, { 'italic': true }, { 'underline': true }, { 'strike': true }],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'script': 'sub' }, { 'script': 'super' }],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    [{ 'indent': '-1' }, { 'indent': '+1' }],
                    [{ 'align': [] }],
                ],
            },
        });

        if (this.CMSpage.app.text) {
            this.quill.clipboard.dangerouslyPasteHTML(this.CMSpage.app.text);
        }
    }

    private loadTextIntoQuill(text: string): void {

        if (!this.quill) {
            throw new Error("Quill-instantie is niet beschikbaar in TekstCMSClass!");
        }

        if (text) {
            this.quill.clipboard.dangerouslyPasteHTML(text);
        } else {
            this.quill.clipboard.dangerouslyPasteHTML("");
        }
    }


    private HtmlStorySelect(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row pb-4"
        });

        let colTextSelect = $('<div/>', {
            class: "col-12"
        });

        let TextInputGroup = $('<div/>', {
            class: "input-group"
        });

        this.dropDown = $('<select/>', {
            class: "form-select"
        });

        let defaultOption = $('<option/>', {
            class: "",
            html: "Geen Tekst",
            value: 0
        });

        this.dropDown.append(defaultOption);
        
        this.addStorys();

        this.dropDown.on("change", () => {

            let id: number = parseInt(this.dropDown.val() as string);
            let result = Story.getTextById(this.storys, id);

            if (result) {
                this.loadTextIntoQuill(result.text);
            } else if (id == 0) {
                this.loadTextIntoQuill("")
            } else {
                // console.warn("Geen tekst gevonden voor ID:", id);
            }
        });

        row.append(colTextSelect);
        colTextSelect.append(TextInputGroup);
        TextInputGroup.append(this.dropDown);

        return row
    }

    private HtmlBenedenRight(): JQuery<HTMLElement> {
        
        let row = $('<div/>', {
            class: "row"
        });

        let colText = $('<div/>', {
            class: "col-12"
        });

        let editor = $('<div/>', {
            class: "",
            id: "editor"
        });

        colText.append(editor);
        row.append(colText);

        return row;
    }

    private addStorys() {
        if (this.storys) {

            this.storys.forEach(story => {
                let storyOption = $('<option/>', {
                    value: story.id,
                    text: story.name
                });
                this.dropDown.append(storyOption);
            });
        } else {
            // console.warn('No Story available to populate dropdown.');
        }
    }
}
