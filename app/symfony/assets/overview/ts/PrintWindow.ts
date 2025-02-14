import $ from "jquery";

export class PrintWindow{

    private _window: Window = window.open("", "_blank");
    private _html: JQuery<HTMLElement>;

    private _qrCodeDataUrl: string;
    private _width: number;
    private _height: number;

    constructor(qrCodeDataUrl: string, width: number, height: number = width) {

        this.qrCodeDataUrl = qrCodeDataUrl;
        this.width = width;
        this.height = height;

        this.html = this.createHtml();
    }

    public get window(): Window {
        return this._window;
    }
    public set window(value: Window) {
        this._window = value;
    }

    public get document(): Document{
        return this.window.document;
    }
    
    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }


    public get qrCodeDataUrl(): string {
        return this._qrCodeDataUrl;
    }
    public set qrCodeDataUrl(value: string) {
        this._qrCodeDataUrl = value;
    }

    public get width(): number {
        return this._width;
    }
    public set width(value: number) {
        this._width = value;
    }

    public get height(): number {
        return this._height;
    }
    public set height(value: number) {
        this._height = value;
    }

    

    protected createHtml(): JQuery<HTMLElement>{
    
        let html = $("<html/>");

        // Head
        let head = $("<head/>");

        let title = $("<title/>",{
            html: "Print QR code"
        });

        let style = $("<style/>", {
            html: 
            `
                @page 
                {
                    size:  auto;   /* auto is the initial value */
                    margin: 0mm;  /* this affects the margin in the printer settings */
                }
            `
        });

        head.append(
            title,
            style
        );

        // Body
        let body = $("<body/>").css({
            "text-align": "center",
            "margin": 0,
            "padding": "20px"
        });
        

        let img = $("<img/>", {
            src: this.qrCodeDataUrl,
            alt: "Genrated QR Code"
        }).css({
            "width": (this.width + "px"),
            "height": (this.height + "px"),
            "display": "block",
            "maring": "0 auto"
        });
        

        body.append(img);

        html.append(
            head,
            body
        );


        return html;
    }

    public print() {
     
        // Reset and write to the document before printing incase of a change in the html | 
        this.document.firstElementChild.remove();
        this.document.write(this.html.html()); // .html() converts the jqeury object to a string
        
        this.document.close();
        this.window.focus();
        this.window.print();
    }

}