import $ from "jquery";

export class BsModal {


    private _modalZIndex: number;


    private _html: JQuery<HTMLElement>;
    private _isClosed: boolean = true;
    private _content: JQuery<HTMLElement>;

    private _closeBtn: JQuery<HTMLElement>;
    private _onOpen: () => void = () => { };
    private _onClose: () => void = ()=>{};



    constructor(content: JQuery<HTMLElement>, modalZIndex: number = 1000){
        this.modalZIndex = modalZIndex;

        this.content = content;
        this.html = this.createModal();
    }

    public get modalZIndex(): number {
        return this._modalZIndex;
    }
    public set modalZIndex(value: number) {
        this._modalZIndex = value;
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }

    public get isClosed(): boolean {
        return this._isClosed;
    }
    private set isClosed(value: boolean) {
        this._isClosed = value;
    }

    public get content(): JQuery<HTMLElement> {
        return this._content;
    }
    public set content(value: JQuery<HTMLElement>) {
        this._content = value;
    }

    public get closeBtn(): JQuery<HTMLElement> {
        return this._closeBtn;
    }
    public set closeBtn(value: JQuery<HTMLElement>) {
        this._closeBtn = value;
    }

    public get onOpen(): () => void {
        return this._onOpen;
    }
    public set onOpen(value: () => void) {
        this._onOpen = value;
    }

    public get onClose(): () => void {
        return this._onClose;
    }
    public set onClose(value: () => void) {
        this._onClose = value;
    }


    public createModal(): JQuery<HTMLElement>{
        const s = this;

        let container = $("<div/>")
        .css({
            "position": "absolute",
            "width": "100vw",
            "height": "100vh",
            "display": "flex",
            "justify-content": "center",
            "align-items": "center"
        });

        let background = $("<div/>")
        .css({
            "position": "fixed",
            "width": "100vw",
            "height": "100vh",
            "background-color": "black",
            "opacity": "0.5",
            "z-index": s.modalZIndex.toString(),
        });

        s.closeBtn = $("<button/>", {
            class: "btn btn-light",
        })
        .css({
            "position": "absolute",
            "top": "6%",
            "right": "6%",
            "z-index": (s.modalZIndex + 2).toString()
        })
        .on("click", ()=> s.close());
        let closeIcon = $("<i/>", {
            class: "fas fa-x"
        });
        s.closeBtn.append(closeIcon);

        let contentBackground = $("<div/>", {
            class: "rounded"
        })
        .css({
        "background-color": "white",
        "max-width": "800px",//test
        "padding": "5px",
        "border-radius": "10px",
        "text-algin": "center",
        "z-index": (s.modalZIndex + 1).toString()
        });

        contentBackground.append(s.content);
        container.append(background, contentBackground, s.closeBtn);

        container.hide(); // Default to being closed, without triggering onClose callback
        
        return container;
    }

    public show(){
        const s = this;
        if(s.isClosed){
            if($("body").find(s.html).length === 0){
                $("body").prepend(s.html);
            };
            
            s.html.show();
            s.isClosed = false;
            s.onOpen(); 
        }
    }
    

    public close(){
        const s = this;
        s.html.hide();
        s.isClosed = true;
        s.onClose();
    }
}