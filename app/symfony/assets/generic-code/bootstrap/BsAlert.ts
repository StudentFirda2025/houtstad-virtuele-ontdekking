import $ from "jquery";
export type bsAlertType = "success" | "danger" | "warning" | "primary";
export type bsAlertData = {
    type: bsAlertType,
    text: string,
    closeable?: boolean,
    autoHideTimeMS?: number
};

export class BsAlert{


    protected _html: JQuery<HTMLElement>;
    protected _data: bsAlertData;
    private _state: "hidden" | "shown" = "hidden";


    

    constructor(data: bsAlertData){
        data.closeable = (data.closeable === undefined ? false : true) // default value is false
        this.data = data;
    
        this.html = this.createAlert();
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }

    protected get data(): bsAlertData {
        return this._data;
    }
    protected set data(value: bsAlertData) {
        this._data = value;
    }

    public get state(): "hidden" | "shown" {
        return this._state;
    }
    protected set state(value: "hidden" | "shown") {
        this._state = value;
    }


    public get type(): bsAlertType {
        return this.data.type;
    }
    public set type(value: bsAlertType) {
        this.data.type = value;
    }

    public get text(): string {
        return this.data.text;
    }
    public set text(value: string) {
        this.data.text = value;
    }

    public get closeable(): boolean {
        return this.data.closeable ?? false;
    }
    public set closeable(value: boolean) {
        this.data.closeable = value;
    }

    public get autoHideTimeMS(): number | undefined {
        return this.data.autoHideTimeMS;
    }
    public set autoHideTimeMS(value: number | undefined) {
        this.data.autoHideTimeMS = value;
    }



    protected createAlert(): JQuery<HTMLElement>{
        const s = this;

        let htmlClass: string = "alert alert-" + s.type + " position-absolute";
        let alert: JQuery<HTMLElement> = $("<div/>",{
            class: htmlClass, 
            css: {
                "top": "1%",
                "width": "50%",
                "left": "25%", // -> works because width is 50%
                "z-index": "100"
            }
        });

        let row: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
        });
        
        let iconCol: JQuery<HTMLElement> = $("<div/>", {
            class: "col-1 d-flex justify-content-center align-items-center"
        });
        let icon: JQuery<HTMLElement> = s.getIcon();
        iconCol.append(icon);
        
        let textCol: JQuery<HTMLElement> = $("<div/>", {
            class: "col-9"
        });
        let text: JQuery<HTMLElement> = $("<h3/>").text(s.text);
        textCol.append(text);
        
        let closeBtnCol: JQuery<HTMLElement> = $("<div/>", {
            class: "col-2"
        });
        let closeBtn: JQuery<HTMLElement> = $("<button/>", {
            class: "btn float-end"
        })
        .on("click", () => s.hide())
        .append(
            $("<i/>", {
                class: "fas fa-xmark fa-2xl"
            })
        ); 

        closeBtnCol.append(closeBtn); 
        
        row.append(
            iconCol, 
            textCol,
            (s.closeable ? closeBtnCol : "")
        );

        alert.append(row);
        return alert;
    }

    public show(){
        const s = this;
        if(s.state !== "shown"){
            s.state = "shown";
        
            if($("body").find(s.html).length === 0){
                $("body").prepend(s.html);
            };
            
            s.html.removeClass("d-none");
            
            if(s.autoHideTimeMS !== undefined){
                setTimeout(() => s.hide(), s.autoHideTimeMS);
            }
        }
    }
    
    public hide(){
        const s = this;
        if(s.state !== "hidden"){
            s.state = "hidden";
            s.html.addClass("d-none");
        }
    }
    
    protected getIcon(type: bsAlertType = this.type): JQuery<HTMLElement>{
        switch(type){
            case "success": return $("<i/>", {
                class: "fas fa-circle-check fa-2xl"
            });
            case "danger": return $("<i/>", {
                class: "fas fa-circle-exclamation fa-2xl"
            });

            case "warning": return $("<i/>", {
                class: "fas fa-triangle-exclamation fa-2xl"
            });
            case "primary": return $("<i/>", {
                class: "fas fa-circle-info fa-2xl"
            });
        }

    }



}