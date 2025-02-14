import $ from "jquery";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CMSPage } from "../ts/CMSPage";
import { Video } from '../../generic-code/Video';
import { VideoDataHandler } from "../../generic-code/datahandler/VideoDataHandler";

export class VideoCMSClass {

    private _htmlVideoPlayer: JQuery<HTMLElement>;
    private _htmlVideoSelect: JQuery<HTMLElement>;
    private _video: JQuery<HTMLElement>;
    private _dropDown: JQuery<HTMLElement>;
    public videos: Video[];
    private CMSpage: CMSPage;
    private _selectedVideo: Video | null;

    constructor(CMSpage: CMSPage) {
        this.CMSpage = CMSpage;
        this.videos = [];
    }


    public get htmlVideoPlayer(): JQuery<HTMLElement> {
        return this._htmlVideoPlayer;
    }
    public set htmlVideoPlayer(value: JQuery<HTMLElement>) {
        this._htmlVideoPlayer = value;
    }

    public get video(): JQuery<HTMLElement> {
        return this._video;
    }
    public set video(value: JQuery<HTMLElement>) {
        this._video = value;
    }

    public get dropDown(): JQuery<HTMLElement> {
        return this._dropDown;
    }
    public set dropDown(value: JQuery<HTMLElement>) {
        this._dropDown = value;
    }

    public get htmlVideoSelect(): JQuery<HTMLElement> {
        return this._htmlVideoSelect;
    }
    public set htmlVideoSelect(value: JQuery<HTMLElement>) {
        this._htmlVideoSelect = value;
    }

    public get selectedVideo(): Video | null {
        return this._selectedVideo;
    }
    public set selectedVideo(value: Video | null) {
        this._selectedVideo = value;
    }


    public alleVideo(callback) {
        VideoDataHandler.getAll((response: { status: string; data: Video[] }) => { // Corrected callback type

            if (response.status === "success") {

                this.videos = response.data; // No need to map

                this.htmlVideoPlayer = this.HtmlVideo();
                this.htmlVideoSelect = this.HtmlVideoSelect();

                if (this.CMSpage?.app?.video?.id) {
                    this.setSelectedVideoById(this.CMSpage.app.video.id);
                    this.selectedVideo.getFile((fileUrl: string) => {
                        this.dropDown.removeAttr('disabled');
                        this.video.attr('src', fileUrl);
                    });
                } else {
                    // console.warn("CMSpage or app is not initialized yet.");
                }

                if (callback) callback();
            } else {
                // console.error("Error fetching videos:", response); // Handle error
            }
        });
    }

    public setSelectedVideoById(videoId: number): void {

        let drop = this.htmlVideoSelect.find("select");
        drop.val(videoId);
        this.selectedVideo = this.videos.find(video => video.id === videoId);
    }


    private HtmlVideo(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row",
            id: 'rowforspinVideo'
        });

        let colVideo = $('<div/>', {
            class: "d-flex justify-content-center"
        });

        this.video = $('<video/>', {
            class: "img-fluid",
            controls: true,
            style: "max-height: 400px;"
        });

        let spin = $('<i/>', {
            class: "fas fa-spinner fa-spin fa-2xl",
        });

        let spinDiv = $('<div/>', {
            class: "visually-hidden",
            id: "spinVideo"
        }).append(spin);

        colVideo.append(this.video, spinDiv);
        row.append(colVideo);

        return row;
    }

    private HtmlVideoSelect(): JQuery<HTMLElement> {
        
        let row = $('<div/>', {
            class: "row pt-4 px-2"
        });

        let colVideoSelect = $('<div/>', {
            class: "col-12"
        });

        let videoInputGroup = $('<div/>', {
            class: "input-group"
        });

        this.dropDown = $('<select/>', {
            class: "form-select"
        });

        let defaultOption = $('<option/>', {
            class: "",
            html: "Geen Video",
            value: 0
        });

        this.dropDown.append(defaultOption);

        this.addvideos();

        this.dropDown.on("change", () => {

            let id: number = parseInt(this.dropDown.val() as string, 10);
            if (isNaN(id)) {
                id = 0;
            }

            let result = id !== 0 ? this.videos.find(video => video.id === id) : null;
            this.selectedVideo = result;

            if (id !== 0) {
                this.dropDown.attr('disabled', 'disabled');
                $('#spinVideo').removeClass('visually-hidden');
                $('#rowforspinVideo').addClass('pt-4 pb-2');
                this.video.addClass('visually-hidden');

                this.selectedVideo.getFile((fileUrl: string) => {
                    this.video.attr('src', fileUrl);
                    $('#spinVideo').addClass('visually-hidden');
                    $('#rowforspinVideo').removeClass('pt-4 pb-2');
                    this.video.removeClass('visually-hidden');
                    this.dropDown.removeAttr('disabled');
                });
            } else {
                this.video.attr('src', '');
            }
        });

        row.append(colVideoSelect);
        colVideoSelect.append(videoInputGroup);
        videoInputGroup.append(this.dropDown);

        return row
    }

    private addvideos() {
        if (this.videos) {
            this.videos.forEach(video => {
                let videoOption = $('<option/>', {
                    value: video.id,
                    text: video.name
                });
                this.dropDown.append(videoOption);
            });
        } else {
            // console.warn('No videos available to populate dropdown.');
        }
    }
}