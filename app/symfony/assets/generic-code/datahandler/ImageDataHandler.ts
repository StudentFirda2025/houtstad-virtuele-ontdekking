import { Image } from "../Image";
import $ from "jquery";
import { messageReturn } from "./dataReturn";
import { BsAlert } from "../bootstrap/BsAlert";

type backendImage = {
    id: number;
    name: string;
};

export class ImageDataHandler {
    public static get(id: number, callback: (response: Image | null) => void) {
        let url = `/api/image/get/${id}`;
        $.ajax({
            url: url,
            method: "get",
            dataType: "json",
        }).done((response: { status: string; image: backendImage }) => {
            if (response.status == "success") {
                callback(this.convertBackendToImage(response.image));
            } else {
                callback(null);
            }
        });
    }

    public static getFile(id: number, callback: (response: Blob) => void) {
        let url = `/api/image/get/file/${id}`;
        $.ajax({
            url: url,
            method: "get",
            xhrFields: {
                responseType: "blob",
            },
        }).done((response: Blob) => {
            callback(response);
        });
    }

    public static getAll(callback: (response: { status: string; data: Image[] }) => void) {
        $.ajax({
            url: "/api/image/get-all",
            method: "get",
            dataType: "json",
        }).done((response: { status: string; images: backendImage[] }) => {
            if (response.status === "success") {
                let images: Image[] = response.images.map((data: backendImage) => {
                    return this.convertBackendToImage(data);
                });
                callback({ status: "success", data: images });
            } else {
                callback({ status: "error", data: [] });
            }
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", data: [] });
        });
    }

    public static delete(id: number, callback: (response: messageReturn) => void) {
        let deleteAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Image verwijderen..."
        });
        let deletedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Image verwijderd!",
            closeable: true,
            autoHideTimeMS: 4000
        });
        
        deleteAlert.show();
        let url = `/api/image/delete/${id}`;
        $.ajax({
            url: url,
            method: "post",
            dataType: "json",
        }).done((response: messageReturn) => {
            deleteAlert.hide();
            deletedAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to delete image." });
        });
    }

    public static update(id: number, name: string, callback: (response: messageReturn) => void) {
        let updateAlert: BsAlert = new BsAlert({
            type: "primary",
            text: "Image updaten..."
        });
        let updatedAlert: BsAlert = new BsAlert({
            type: "success",
            text: "Image ge-update!",
            closeable: true,
            autoHideTimeMS: 4000
        });

        updateAlert.show();
        let url = `/api/image/update/${id}`;
        $.ajax({
            url: url,
            method: "post",
            data: { name: name },
        }).done((response: messageReturn) => {
            updateAlert.hide();
            updatedAlert.show();
            callback(response);
        }).fail((error) => {
            console.error("AJAX request failed:", error);
            callback({ status: "error", message: "Failed to update image." });
        });
    }

    private static convertBackendToImage(data: backendImage): Image {
        return new Image(data.id, data.name);
    }
}