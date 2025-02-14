export class Story {
    
    private _id: number;
    private _name: string;
    private _text: string;

    constructor(id: number, name: string, text: string) {
        this.id = id;
        this.name = name;
        this.text = text;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    public get text(): string {
        return this._text;
    }
    public set text(value: string) {
        this._text = value;
    }

    public static getTextById(arr: Story[], id: number): Story | null {

        let result = arr.filter((tekst: Story) => {
            return (tekst.id == id)
        });

        if (result.length > 0) {
            return result[0];
        }

        return null;
    }
}