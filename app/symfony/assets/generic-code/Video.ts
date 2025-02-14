import { VideoDataHandler } from "./datahandler/VideoDataHandler";

export class Video {
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
            VideoDataHandler.getFile(this.id, (response: Blob) => {
                let videoBlob = new Blob([response]);
                this.path = URL.createObjectURL(videoBlob);
                onDone(this.path);
            });
        } else {
            onDone(this.path);
        }
    }

    public static getVideoById(arr: Video[], id: number): Video | null {
        
        let result = arr.filter((video: Video) => {
            return (video.id == id)
        });

        if (result.length > 0) {
            return result[0];
        }

        return null;
    }
}