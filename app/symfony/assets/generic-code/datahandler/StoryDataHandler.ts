import $ from "jquery";
import { Story } from "../Story";
import { messageReturn } from "./dataReturn";
import { BsAlert } from "../bootstrap/BsAlert";

type backendStory = {
    id: number;
    name: string;
    text: string;
};

export class StoryDataHandler {
    public static upload(name: string, text: string, callback: (response: messageReturn) => void) {
        let startAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Verhaal aanmaken..."
        });
        let doneAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Verhaal is aangemaakt!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        startAlert.show();
        $.ajax({
            url: "/api/story/upload",
            method: "post",
            data: { name: name, text: text }
        }).done((response: messageReturn) => {
            startAlert.hide();
            doneAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to upload story." });
        });
    }

    public static get(id: number, callback: (response: Story | null) => void) {
        let url = ("/api/story/get/" + id);
        $.ajax({
            url: url,
            method: "get",
            dataType: "json"
        }).done((response: { status: string, story: backendStory }) => {
            if (response.status == "success") {
                callback(this.convertBackendToStory(response.story));
            } else {
                callback(null);
            }
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback(null);
        });
    }

    public static getAll(callback: (response: { status: string; data: Story[] }) => void) {
        $.ajax({
            url: "/api/story/get-all",
            method: "get",
            dataType: "json"
        }).done((response: { status: string, storys: backendStory[] }) => {
            if (response.status === "success") {
                let storys: Story[] = response.storys.map((data: backendStory) => {
                    return this.convertBackendToStory(data);
                });
                callback({ status: "success", data: storys });
            } else {
                callback({ status: "error", data: [] });
            }
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", data: [] });
        });
    }

    public static delete(id: number, callback: (response: messageReturn) => void) {
        let startAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Verhaal verwijderen..."
        });
        let doneAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Verhaal is verwijderd!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        startAlert.show();
        let url = ("/api/story/delete/" + id);
        $.ajax({
            url: url,
            method: "post",
            dataType: "json"
        }).done((response: messageReturn) => {
            startAlert.hide();
            doneAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to delete story." });
        });
    }

    public static update(id: number, name: string, text: string, callback: (response: messageReturn) => void) {
        let startAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Verhaal updaten..."
        });
        let doneAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Verhaal is ge-update!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        startAlert.show();
        let url = ("/api/story/update/" + id);
        $.ajax({
            url: url,
            method: "post",
            data: { name: name, text: text }
        }).done((response: messageReturn) => {
            startAlert.hide();
            doneAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to update story." });
        });
    }

    private static convertBackendToStory(data: backendStory): Story {
        return new Story(
            data.id,
            data.name,
            data.text
        );
    }
}
