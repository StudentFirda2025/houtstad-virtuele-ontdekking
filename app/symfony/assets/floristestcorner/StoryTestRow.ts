import $ from "jquery";
import {StoryDataHandler} from "../generic-code/datahandler/StoryDataHandler";

export class StoryTestRow {

    private _html: JQuery<HTMLElement>;

    constructor() {
        this.html = this.createRow();
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }

    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }

    private createRow(): JQuery<HTMLElement> {
        const s = this;

        let storyUploadBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Upload Story"
        }).on("click", ()=>{
            StoryDataHandler.upload(
                nameInp.val() as string,
                textInp.val() as string,
                (response) => {
                    console.log(response);
                }
            )
        });

        let inputGetStory = $("<input/>", {
            class: "control-form",
            placeholder: "Story ID to get"
        });

        let storyViewer = $("<div/>", {
            class: "border border-dark p-3"
        });

        let getObjectStoryBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get story"
        }).on("click", () => {
            StoryDataHandler.get(inputGetStory.val() as number, (response) => {
                console.log("response: ", response);
                storyViewer.empty();
                storyViewer.html(response.text);
            });
        });

        let deleteStoryBtn = $("<button/>", {
            class: "btn btn-outline-danger",
            text: "Remove story"
        }).on("click", () => {
            StoryDataHandler.delete(inputGetStory.val() as number, (response) => {
                console.log("response: ", response);
            });
        });

        let getAllBtn = $("<button/>", {
            class: "btn btn-outline-dark",
            text: "Get all storys"
        }).on("click", () => {
            StoryDataHandler.getAll((response) => {
                console.log(response);
            });
        });

        let nameInp = $("<input/>", {
            class: "form-control",
            placeholder: "Name"
        });

        let textInp = $("<textarea/>", {
            class: "form-control",
            placeholder: "Text"
        });

        let updateBtn = $("<button/>", {
            class: "btn btn-outline-primary",
            text: "Update"
        }).on("click", () => {
            StoryDataHandler.update(
                inputGetStory.val() as number,
                nameInp.val() as string,
                textInp.val() as string,
                (response) => {
                    console.log(response);
                }
            );
        });

        let storyArea = $("<div/>");
        storyArea.append(
            getAllBtn,
            storyUploadBtn,
            inputGetStory,
            getObjectStoryBtn,
            nameInp,
            textInp,
            updateBtn,
            deleteStoryBtn,
            storyViewer
        );

        return storyArea;
    }
}
