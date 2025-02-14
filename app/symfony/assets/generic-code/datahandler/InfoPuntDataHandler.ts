import $ from "jquery";
import { InfoPunt } from "../InfoPunt";
import { messageReturn } from "./dataReturn";
import { Video } from "../Video";
import { Audio } from "../Audio";
import { Image } from "../Image";
import { BsAlert } from "../bootstrap/BsAlert";

type backendInfoPunt = {
    id: number;
    name: string;
    text: string;
    video: {
        id: number;
        name: string;
    };
    audio: {
        id: number;
        name: string;
    };
    image: {
        id: number;
        name: string;
    };
};

export class InfoPuntDataHandler {
    public static update(data: { id, infopuntnaam, text, videoId, audioId, imageId }, callback: (response: messageReturn) => void) {
        let updateAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Info-punt updaten..."
        });
        let updatedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Info-punt ge-update!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        updateAlert.show();
        let url = ("/api/info-punt/update/" + data.id);
        $.ajax({
            url: url,
            method: "post",
            dataType: "json",
            data: data
        }).done((response) => {
            updateAlert.hide();
            updatedAlert.show()
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to update InfoPunt." });
        });
    }

    public static create(data: { infopuntnaam, text, videoId, audioId, imageId }, callback: (response: messageReturn) => void) {
        let startAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Info-punt aanmaken..."
        });
        let doneAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Info-punt is aangemaakt!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        startAlert.show();
        $.ajax({
            url: "/api/info-punt/create",
            method: "post",
            dataType: "json",
            data: data
        }).done((response) => {
            startAlert.hide();
            doneAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to create InfoPunt." });
        });
    }

    public static get(id: number, callback: (response: InfoPunt | null) => void) {
        let url: string = "/api/info-punt/get/" + id;
        $.ajax({
            url: url,
            method: "get",
            contentType: "application/json"
        }).done((response) => {
            if (response.status == "success") {
                let infoPuntData = response.infoPunt;
                callback(this.convertBackendToInfoPunt(infoPuntData));
            } else {
                callback(null);
            }
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback(null);
        });
    }

    public static getAll(callback: (response: InfoPunt[]) => void) {
        $.ajax({
            url: "/api/info-punt/get-all",
            method: "get",
            contentType: "application/json"
        }).done((response) => {
            let infoPunten: InfoPunt[] = response.infoPunten.map((data: backendInfoPunt) => {
                return this.convertBackendToInfoPunt(data)
            });

            callback(infoPunten);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback([]);
        });
    }

    public static delete(id: number, callback: (response: messageReturn) => void) {
        let deleteAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Info-punt verwijderen..."
        });
        let deletedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Info-punt verwijderd!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        deleteAlert.show();
        let url: string = ("/api/info-punt/delete/" + id);
        $.ajax({
            url: url,
            method: "post",
            contentType: "application/json"
        }).done((response) => {
            deleteAlert.hide();
            deletedAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to delete InfoPunt." });
        });
    }

    private static convertBackendToInfoPunt(data: backendInfoPunt): InfoPunt {
        let video: Video | null = null;
        if (data.video != null) {
            video = new Video(
                data.video.id,
                data.video.name
            );
        }

        let audio: Audio | null = null;
        if (data.audio != null) {
            audio = new Audio(
                data.audio.id,
                data.audio.name
            );
        }

        let image: Image | null = null;
        if (data.image != null) {
            image = new Image(
                data.image.id,
                data.image.name
            );
        }

        return new InfoPunt(
            data.id,
            data.name,
            data.text,
            video,
            audio,
            image
        );
    }
}