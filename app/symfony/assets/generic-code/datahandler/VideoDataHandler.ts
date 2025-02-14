import { Video } from "../Video";
import $ from "jquery";
import { messageReturn } from "./dataReturn";
import { BsAlert } from "../bootstrap/BsAlert";

type backendVideo = {
    id: number;
    name: string;
};

export class VideoDataHandler {
    
    public static get(id: number, callback: (response: Video | null) => void) {
        let url = ("/api/video/get/" + id);
        $.ajax({
            url: url,
            method: "get",
            dataType: "json"
        }).done((response: { status: string, video: backendVideo }) => {
            if (response.status == "success") {
                callback(this.convertBackendToVideo(response.video));
            } else {
                callback(null);
            }
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback(null);
        });
    }

    public static getFile(id: number, callback: (response: Blob) => void) {
        let url = ("/api/video/get/file/" + id);
        $.ajax({
            url: url,
            method: "get",
            xhrFields: {
                responseType: 'blob'
            }
        }).done((response: Blob) => {
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback(new Blob()); // Return an empty Blob on error
        });
    }

    public static getAll(callback: (response: { status: string; data: Video[] }) => void) {
        $.ajax({
            url: "/api/video/get-all",
            method: "get",
            dataType: "json",
        }).done((response: { status: string; videos: backendVideo[] }) => {
            if (response.status === "success") {
                let videos: Video[] = response.videos.map((data: backendVideo) => {
                    return this.convertBackendToVideo(data);
                });
                callback({ status: "success", data: videos });
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
            text: "Video verwijderen..."
        });
        let doneAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Video is verwijderd!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        startAlert.show();
        let url = ("/api/video/delete/" + id);
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
            callback({ status: "error", message: "Failed to delete video." });
        });
    }

    public static update(id: number, name: string, callback: (response: messageReturn) => void) {
        let startAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Video updaten..."
        });
        let doneAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Video is ge-update!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        startAlert.show();
        let url = ("/api/video/update/" + id);
        $.ajax({
            url: url,
            method: "post",
            data: { name: name }
        }).done((response: messageReturn) => {
            startAlert.hide();
            doneAlert.show();

            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to update video." });
        });
    }

    private static convertBackendToVideo(data: backendVideo): Video {
        return new Video(
            data.id,
            data.name
        );
    }
}