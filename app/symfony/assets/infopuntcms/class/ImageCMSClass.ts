import $ from "jquery";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CMSPage } from "../ts/CMSPage";
import { ImageDataHandler } from "../../generic-code/datahandler/ImageDataHandler";
import { Image } from "../../generic-code/Image";

export class ImageCMSClass {

    private _htmlImage: JQuery<HTMLElement>;
    private _htmlImageSelect: JQuery<HTMLElement>;
    private _dropDown: JQuery<HTMLElement>;
    private _image: JQuery<HTMLElement>;
    private images: Image[];
    private CMSpage: CMSPage;
    private _selectedImage: Image | null;


    constructor(CMSpage: CMSPage) {
        this.CMSpage = CMSpage;
        this.images = [];
    }


    public get htmlImage(): JQuery<HTMLElement> {
        return this._htmlImage;
    }
    public set htmlImage(value: JQuery<HTMLElement>) {
        this._htmlImage = value;
    }

    public get image(): JQuery<HTMLElement> {
        return this._image;
    }
    public set image(value: JQuery<HTMLElement>) {
        this._image = value;
    }

    public get htmlImageSelect(): JQuery<HTMLElement> {
        return this._htmlImageSelect;
    }
    public set htmlImageSelect(value: JQuery<HTMLElement>) {
        this._htmlImageSelect = value;
    }

    public get selectedImage(): Image | null {
        return this._selectedImage;
    }
    public set selectedImage(value: Image | null) {
        this._selectedImage = value;
    }

    public get dropDown(): JQuery<HTMLElement> {
        return this._dropDown;
    }
    public set dropDown(value: JQuery<HTMLElement>) {
        this._dropDown = value;
    }


    public alleImage(callback) {
        ImageDataHandler.getAll((response: { status: string; data: Image[] }) => { // Corrected callback type

            if (response.status === "success") {

                this.images = response.data; // No need to map

                this.htmlImage = this.HtmlImage();
                this.htmlImageSelect = this.HtmlImageSelect();

                if (this.CMSpage?.app?.image?.id) {
                    this.setSelectedImageById(this.CMSpage.app.image.id);
                    this.selectedImage.getFile((fileUrl: string) => {
                        this.image.attr('src', fileUrl);
                        this.dropDown.removeAttr('disabled');
                    });
                } else {
                    // console.warn("CMSpage or app is not initialized yet.");
                }

                if (callback) callback();
            } else {
                // console.error("Error fetching images:", response); // Handle error
            }
        });
    }

    public setSelectedImageById(imageId: number): void {

        this.dropDown.val(imageId);
        this.selectedImage = this.images.find(image => image.id === imageId);
    }


    private HtmlImage(): JQuery<HTMLElement> {
        
        let row = $('<div/>', {
            class: "row",
            id: 'rowforspinImage'
        });

        let colImage = $('<div/>', {
            class: "d-flex justify-content-center"
        });

        this.image = $('<img/>', {
            class: "img-fluid",
            src: 'image/No_image_available.svg.png',
            style: "max-height: 400px;"
        });

        let spin = $('<i/>', {
            class: "fas fa-spinner fa-spin fa-2xl"
        });

        let spinDiv = $('<div/>', {
            class: "visually-hidden",
            id: "spinImage"
        }).append(spin);

        colImage.append(this.image, spinDiv);
        row.append(colImage);

        return row;
    }

    private HtmlImageSelect(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row pt-4 px-2"
        });

        let colImageSelect = $('<div/>', {
            class: "col-12"
        });

        let ImageInputGroup = $('<div/>', {
            class: "input-group"
        });

        this.dropDown = $('<select/>', {
            class: "form-select"
        });

        let defaultOption = $('<option/>', {
            class: "",
            html: "Geen Image",
            value: 0
        });

        this.dropDown.append(defaultOption);
        this.addImages();

        this.dropDown.on("change", () => {

            let id: number = parseInt(this.dropDown.val() as string, 10);
            if (isNaN(id)) {
                id = 0;
            }

            let result = id !== 0 ? this.images.find(image => image.id === id) : null;
            this.selectedImage = result;

            if (id !== 0) {
                this.dropDown.attr('disabled', 'disabled');
                $('#spinImage').removeClass('visually-hidden');
                $('#rowforspinImage').addClass('pt-4 pb-2');
                this.image.addClass('visually-hidden');

                this.selectedImage.getFile((fileUrl: string) => {
                    this.image.attr('src', fileUrl);
                    this.dropDown.removeAttr('disabled');
                    $('#spinImage').addClass('visually-hidden');
                    $('#rowforspinImage').removeClass('pt-4 pb-2');
                    this.image.removeClass('visually-hidden');
                });
            } else {
                this.image.attr('src', 'image/No_image_available.svg.png');
            }
        });

        row.append(colImageSelect);
        colImageSelect.append(ImageInputGroup);
        ImageInputGroup.append(this.dropDown);

        return row
    }

    private addImages() {
        if (this.images) {
            this.images.forEach(image => {
                let imageOption = $('<option/>', {
                    value: image.id,
                    text: image.name
                });
                this.dropDown.append(imageOption);
            });
        } else {
            // console.warn('No image available to populate dropdown.');
        }
    }
}