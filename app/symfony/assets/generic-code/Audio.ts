import { AudioDataHandler } from "./datahandler/AudioDataHandler";

export class Audio {
    private _id: number;
    private _path: string;
    private _name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get path(): string {
        return this._path;
    }
    private set path(value: string) {
        this._path = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public getFile(onDone: (path: string) => void) {
        
        if (this.path == undefined) {
            AudioDataHandler.getFile(this.id as number, (response) => {
                let videoBlob = new Blob([response]); // Create a Blob from the byte array
                this.path = URL.createObjectURL(videoBlob); // Create a URL for the Blob
                onDone(this.path);
            });
        } else {
            onDone(this.path);
        }
    }
    public static getAudioById(arr: Audio[], id: number): Audio | null {

        let result = arr.filter((audio: Audio) => {
            return (audio.id == id)
        });

        if (result.length > 0) {
            return result[0];
        }

        return null;
    }
}