import $ from "jquery";
import { Bs } from "./Bs";
import { QRCodeScanner } from "./QRCodeScanner";
import { BsModal } from "../../generic-code/bootstrap/BsModal";

export class Header {

    private _html: JQuery<HTMLElement>;
    private _QRScanBtn: JQuery<HTMLElement>;

    private _qrCodeScannerModal: BsModal;
    private _qrCodeScanner: QRCodeScanner;


    constructor(qrCodeScanner: QRCodeScanner){

        this.qrCodeScanner = qrCodeScanner;
        this.qrCodeScannerModal = new BsModal(this.qrCodeScanner.html);

        // Make the button and icon bigger for tablet/mobile
        this.qrCodeScannerModal.closeBtn.addClass("p-3");
        this.qrCodeScannerModal.closeBtn.find("i").addClass("fa-3x");

        this.qrCodeScannerModal.onOpen = () => this.qrCodeScanner.startScanning();
        this.qrCodeScannerModal.onClose = ()=> this.qrCodeScanner.stopScanning();
        
        this.html = this.createHeader();
    }

    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }

    protected get QRScanBtn(): JQuery<HTMLElement> {
        return this._QRScanBtn;
    }
    protected set QRScanBtn(value: JQuery<HTMLElement>) {
        this._QRScanBtn = value;
    }

    public get qrCodeScannerModal(): BsModal {
        return this._qrCodeScannerModal;
    }
    public set qrCodeScannerModal(value: BsModal) {
        this._qrCodeScannerModal = value;
    }

    protected get qrCodeScanner(): QRCodeScanner {
        return this._qrCodeScanner;
    }
    protected set qrCodeScanner(value: QRCodeScanner) {
        this._qrCodeScanner = value;
    }


    private createHeader(): JQuery<HTMLElement>{

        let row = Bs.jqEl("div", "row");

        // Logo
        let logoCol = Bs.jqEl("div", "col-6");

        let logo = Bs.jqEl("img", "img-fluid float-start", {
            src: "/image/logo.png"
        });

        logoCol.append(logo);

        // QR code scan btn
        let QRCodeScanCol = Bs.jqEl("div", "col-6");

        let flexContainer = Bs.jqEl("div", "d-flex align-items-center float-end h-100");

        this.QRScanBtn = Bs.jqEl("button", "btn btn-outline-light p-3").on("click", ()=>{

            if(this.qrCodeScannerModal.isClosed){
                this.qrCodeScannerModal.show();
            }else{
                this.qrCodeScannerModal.close();
            }
        });
        
        let cameraIcon = Bs.jqEl("i", "fas fa-camera fa-3x").css("color", "#FFFFFF"); 

        this.QRScanBtn.append(cameraIcon);
        flexContainer.append(this.QRScanBtn);
        QRCodeScanCol.append(flexContainer);

        row.append(
            logoCol,
            QRCodeScanCol
        );

        return row;
    }

}