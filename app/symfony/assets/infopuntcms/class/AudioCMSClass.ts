import $ from "jquery";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { CMSPage } from "../ts/CMSPage";
import { Audio } from "../../generic-code/Audio";
import { AudioDataHandler } from "../../generic-code/datahandler/AudioDataHandler";

export class AudioCMSClass {
    
    private _htmlAudioPlayer: JQuery<HTMLElement>;
    private _htmlAudioSelect: JQuery<HTMLElement>;
    private _audio: JQuery<HTMLElement>;
    private _dropDown: JQuery<HTMLElement>;
    private audios: Audio[];
    private CMSpage: CMSPage;
    private _selectedAudio: Audio | null;


    constructor(CMSpage: CMSPage) {
        this.CMSpage = CMSpage;
        this.audios = [];
    }


    public get htmlAudioPlayer(): JQuery<HTMLElement> {
        return this._htmlAudioPlayer;
    }
    public set htmlAudioPlayer(value: JQuery<HTMLElement>) {
        this._htmlAudioPlayer = value;
    }

    public get audio(): JQuery<HTMLElement> {
        return this._audio;
    }
    public set audio(value: JQuery<HTMLElement>) {
        this._audio = value;
    }

    public get dropDown(): JQuery<HTMLElement> {
        return this._dropDown;
    }
    public set dropDown(value: JQuery<HTMLElement>) {
        this._dropDown = value;
    }

    public get htmlAudioSelect(): JQuery<HTMLElement> {
        return this._htmlAudioSelect;
    }
    public set htmlAudioSelect(value: JQuery<HTMLElement>) {
        this._htmlAudioSelect = value;
    }

    public get selectedAudio(): Audio | null {
        return this._selectedAudio;
    }
    protected set selectedAudio(value: Audio | null) {
        this._selectedAudio = value;
    }


    public alleAudio(callback) {
        
        AudioDataHandler.getAll((response: { status: string; data: Audio[] }) => { // Corrected callback type
            
            if (response.status === "success") {

                this.audios = response.data; // No need to map

                this.htmlAudioPlayer = this.HtmlAudio();
                this.htmlAudioSelect = this.HtmlAudioSelect();

                if (this.CMSpage?.app?.audio?.id) {
                    this.setSelectedAudioById(this.CMSpage.app.audio.id);
                    this.selectedAudio.getFile((path: string) => {
                        this.audio.attr('src', path);
                        this.dropDown.removeAttr('disabled');
                    });
                } else {
                    // console.warn("CMSpage or app is not initialized yet.");
                }

                if (callback) callback();
            } else {
                // console.error("Error fetching audios:", response); // Handle error
            }
        });
    }

    public setSelectedAudioById(audioId: number): void {

        this.dropDown.val(audioId);
        this.selectedAudio = this.audios.find(audio => audio.id === audioId);
    }


    private HtmlAudio(): JQuery<HTMLElement> {
        
        let row = $('<div/>', {
            class: "row px-2",
            id: 'rowforspinAudio'
        });

        let colAudio = $('<div/>', {
            class: "d-flex justify-content-center"
        });

        this.audio = $('<audio/>', {
            class: "col-12",
            controls: true
        });

        let spin = $('<i/>', {
            class: "fas fa-spinner fa-spin fa-2xl"
        });

        let spinDiv = $('<div/>', {
            class: "visually-hidden",
            id: "spinAudio"
        }).append(spin);

        colAudio.append(this.audio, spinDiv);
        row.append(colAudio);

        return row;
    }

    private HtmlAudioSelect(): JQuery<HTMLElement> {

        let row = $('<div/>', {
            class: "row pt-4 px-2"
        });

        let colAudioSelect = $('<div/>', {
            class: "col-12"
        });

        let audioInputGroup = $('<div/>', {
            class: "input-group"
        });

        this.dropDown = $('<select/>', {
            class: "form-select"
        });

        let defaultOption = $('<option/>', {
            class: "",
            html: "Geen Audio",
            value: 0
        });

        this.dropDown.append(defaultOption);
        this.addAudios();

        this.dropDown.on("change", () => {

            let id: number = parseInt(this.dropDown.val() as string, 10);
            if (isNaN(id)) {
                id = 0;
            }

            let result = id !== 0 ? this.audios.find(audio => audio.id === id) : null;
            this.selectedAudio = result;

            if (id !== 0) {

                this.dropDown.attr('disabled', 'disabled');
                $('#spinAudio').removeClass('visually-hidden');
                $('#rowforspinAudio').addClass('pt-4 pb-2');
                this.audio.addClass('visually-hidden');

                this.selectedAudio.getFile((path: string) => {
                    this.audio.attr('src', path);
                    $('#spinAudio').addClass('visually-hidden');
                    $('#rowforspinAudio').removeClass('pt-4 pb-2');
                    this.audio.removeClass('visually-hidden');
                    this.dropDown.removeAttr('disabled');
                });

            } else {
                this.audio.attr('src', '');
            }
        });

        row.append(colAudioSelect);
        colAudioSelect.append(audioInputGroup);
        audioInputGroup.append(this.dropDown);

        return row
    }

    private addAudios() {
        if (this.audios) {
            this.audios.forEach(audio => {
                let audioOption = $('<option/>', {
                    value: audio.id,
                    text: audio.name
                });
                this.dropDown.append(audioOption);
            });
        } else {
            // console.warn('No audio available to populate dropdown.');
        }
    }
}