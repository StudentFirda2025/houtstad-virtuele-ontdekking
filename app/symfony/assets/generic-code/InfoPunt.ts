import { Video } from "./Video";
import { Audio } from "./Audio";
import { Image } from "./Image";

export type jsonInfoPunt = { id, infopuntnaam, text, videoId, imageId, audioId };
export class InfoPunt {

    protected _id: number;
    protected _infopuntnaam: string;
    protected _text: string;
    protected _video: Video | null;
    protected _image: Image | null;
    protected _audio: Audio | null;

    constructor(id: number, infopuntnaam: string, text: string, video: Video | null, audio: Audio | null, image: Image | null) {
        this.id = id;
        this.infopuntnaam = infopuntnaam || "Vul een naam in...";
        this.text = text;
        this.video = video;
        this.image = image;
        this.audio = audio;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get infopuntnaam(): string {
        return this._infopuntnaam;
    }
    public set infopuntnaam(value: string) {
        this._infopuntnaam = value;
    }

    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;
    }

    public get video(): Video | null {
        return this._video;
    }
    public set video(value: Video | null) {
        this._video = value;
    }

    public get image(): Image | null {
        return this._image;
    }
    public set image(value: Image | null) {
        this._image = value;
    }

    public get audio(): Audio | null {
        return this._audio;
    }
    public set audio(value: Audio | null) {
        this._audio = value;
    }

    // Convert the data to a JSON object for easy transport/storage
    public toJSON(): jsonInfoPunt {
        let base = {
            id: this.id,
            infopuntnaam: this.infopuntnaam,
            text: this.text,
            videoId: (this.video == null ? null : this.video.id),
            imageId: (this.image == null ? null : this.image.id),
            audioId: (this.audio == null ? null : this.audio.id)
        };

        return base;
    }
}

