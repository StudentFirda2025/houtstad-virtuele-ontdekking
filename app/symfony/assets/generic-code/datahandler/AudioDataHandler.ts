import { Audio } from "../Audio";
import $ from "jquery";
import { messageReturn } from "./dataReturn";
import { BsAlert } from "../bootstrap/BsAlert";

type backendAudio = {
    id: number;
    name: string;
};



export class AudioDataHandler {
    public static get(id: number, callback: (response: Audio | null) => void) {
        let url = ("/api/audio/get/" + id);
        $.ajax({
            url: url,
            method: "get",
            dataType: "json"
        }).done((response: { status: string, audio: backendAudio }) => {
            if (response.status == "success") {
                callback(this.convertBackendToAudio(response.audio));
            } else {
                callback(null);
            }
        });
    }

    public static getFile(id: number, callback: (response: Blob) => void) {
        let url = ("/api/audio/get/file/" + id);
        $.ajax({
            url: url,
            method: "get",
            xhrFields: {
                responseType: 'blob'
            }
        }).done((response: Blob) => {
            callback(response);
        });
    }

    public static getAll(callback: (response: { status: string; data: Audio[] }) => void) {
        $.ajax({
            url: "/api/audio/get-all",
            method: "get",
            dataType: "json"
        }).done((response: { status: string, audios: backendAudio[] }) => {
            if (response.status === "success") {
                let audios: Audio[] = response.audios.map((data: backendAudio) => {
                    return this.convertBackendToAudio(data);
                });
                callback({ status: "success", data: audios });
            } else {
                callback({ status: "error", data: [] }); // Or handle the error differently
            }
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", data: [] }); // Handle the error appropriately
        });
    }

    public static delete(id: number, callback: (response: messageReturn) => void) {
        let deleteAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Audio verwijderen..."
        });
        let deletedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Audio verwijderd!",
            closeable: true,
            autoHideTimeMS: 4000
        });

        deleteAlert.show();
        let url = ("/api/audio/delete/" + id);
        $.ajax({
            url: url,
            method: "post",
            dataType: "json"
        }).done((response: messageReturn) => {
            deleteAlert.hide();
            deletedAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to delete audio." }); // Handle error
        });
    }

    public static update(id: number, name: string, callback: (response: messageReturn) => void) {
        let url = ("/api/audio/update/" + id);
        let updateAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Audio updaten..."
        });
        let updatedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Audio ge-update!",
            closeable: true,
            autoHideTimeMS: 4000
        });

        updateAlert.show();
        $.ajax({
            url: url,
            method: "post",
            data: { name: name }
        }).done((response: messageReturn) => {
            updateAlert.hide();
            updatedAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to update audio." }); // Handle error
        });
    }

    private static convertBackendToAudio(data: backendAudio): Audio {
        return new Audio(
            data.id,
            data.name
        );
    }
}