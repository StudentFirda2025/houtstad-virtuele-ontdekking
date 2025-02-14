import $ from "jquery";
import {Html5Qrcode, type Html5QrcodeResult} from 'html5-qrcode';
import type {Html5QrcodeError, QrcodeErrorCallback, QrcodeSuccessCallback} from 'html5-qrcode/core';
import {Bs} from "./Bs";


export class QRCodeScanner{

    private _html5QrcodeScanner: Html5Qrcode;
    private _isScaning: boolean = false;
    private _onScanSuccess: QrcodeSuccessCallback = (decodedText: string, result: Html5QrcodeResult)=>{};
    private _onScanFailure: QrcodeErrorCallback = (errorMessage: string, error: Html5QrcodeError) =>{};


    private _html: JQuery<HTMLElement>;
    private _isHidden: boolean = true;

    
    constructor(){
        this.html = this.createScannerContainer();
        this.html5QrcodeScanner = this.createHtml5QrCodeScanner(this.html);
    }

    public get html5QrcodeScanner(): Html5Qrcode {
        return this._html5QrcodeScanner;
    }
    public set html5QrcodeScanner(value: Html5Qrcode) {
        this._html5QrcodeScanner = value;
    }

    
    public get isScaning(): boolean {
        return this._isScaning;
    }
    private set isScaning(value: boolean) {
        this._isScaning = value;
    }
    
    public get onScanSuccess(): QrcodeSuccessCallback {
        return this._onScanSuccess;
    }
    public set onScanSuccess(value: QrcodeSuccessCallback) {
        this._onScanSuccess = value;
    }

    public get onScanFailure(): QrcodeErrorCallback {
        return this._onScanFailure;
    }
    public set onScanFailure(value: QrcodeErrorCallback) {
        this._onScanFailure = value;
    }

    
    public get html(): JQuery<HTMLElement> {
        return this._html;
    }
    public set html(value: JQuery<HTMLElement>) {
        this._html = value;
    }
    
    public get isHidden(): boolean {
        return this._isHidden;
    }
    private set isHidden(value: boolean) {
        this._isHidden = value;
    }

    private createScannerContainer(): JQuery<HTMLElement>{

        return Bs.jqEl("div", "", {
            id: "reader",
            width: "75vw",
            height: "auto"
        });
    }

    private createHtml5QrCodeScanner(container: JQuery<HTMLElement>): Html5Qrcode{

        $("body").append(container); // Element needs to be in the DOM before init of scanner
        
        let containerId: string = (container.attr('id')?.toString() ? container.attr('id')?.toString() : "")!;
        let html5QrcodeScanner = new Html5Qrcode(containerId, false);
       
        container.remove(); // Remove element from DOM after initialization

        return html5QrcodeScanner;
    }

    public startScanning(){
             
        this.html5QrcodeScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: {
                    width: 200,
                    height: 200
                }
            },
            (decodedText: string, result: Html5QrcodeResult)=> this.onScanSuccess(decodedText, result),
            (errorMessage: string, error: Html5QrcodeError)=> this.onScanFailure(errorMessage, error)
        ).then(() => {
            this.isScaning = true;
        });
        
    }
    
    public stopScanning(){
    
        this.html5QrcodeScanner.stop().then(() => {
            this.isScaning = false;
        });
    }

    public show(){
      
        if(!this.isScaning){
            this.startScanning();
        }
        
        this.isHidden = false;
    }

    public hide(){
     
        if(this.isScaning){
            this.stopScanning();
        }

        this.isHidden = true;
    }





}