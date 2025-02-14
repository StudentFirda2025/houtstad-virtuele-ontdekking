export class OpslaanData {
    private _id: number;
    private _id_video: number;
    private _id_audio: number;
    private _infoPunt_naam: string;
    private _content: string;  // New property to hold text editor content

    constructor(id: number, id_video: number, id_audio: number, infoPunt_naam: string, content: string) {
        this._id = id;
        this._id_video = id_video;
        this._id_audio = id_audio;
        this._infoPunt_naam = infoPunt_naam;
        this._content = content;
    }

    // Getter and setter for id
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    // Getter and setter for id_video
    public get id_video(): number {
        return this._id_video;
    }
    public set id_video(value: number) {
        this._id_video = value;
    }

    // Getter and setter for id_audio
    public get id_audio(): number {
        return this._id_audio;
    }
    public set id_audio(value: number) {
        this._id_audio = value;
    }

    // Getter and setter for infoPunt_naam
    public get infoPunt_naam(): string {
        return this._infoPunt_naam;
    }
    public set infoPunt_naam(value: string) {
        this._infoPunt_naam = value;
    }

    // Getter and setter for content
    public get content(): string {
        return this._content;
    }
    public set content(value: string) {
        this._content = value;
    }

    // Convert the data to a JSON object for easy transport/storage
    public toJSON(): object {
        return {
            id: this._id,
            id_video: this._id_video,
            id_audio: this._id_audio,
            infoPunt_naam: this.infoPunt_naam,
            content: this._content
        };
    }
}