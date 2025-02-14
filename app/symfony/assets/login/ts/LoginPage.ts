import $ from "jquery";
import "../css/loginpage.scss"; 
import "@fortawesome/fontawesome-free/js/all";
import { BsAlert } from "../../generic-code/bootstrap/BsAlert";



export class LoginPage {

    private _usernameInp: JQuery<HTMLElement>;
    private _passwordInp: JQuery<HTMLElement>;
    private _loginBtn: JQuery<HTMLElement>;
    private _loginImage: JQuery<HTMLElement>;
    private _unauthorizedLoginAlert: BsAlert;

  
    constructor(){
        this.unauthorizedLoginAlert = new BsAlert({
            type: "danger",
            text: "Login gegevens zijn niet correct!",
            closeable: true
        });
        
        this.init();

    }

    public get usernameInp(): JQuery<HTMLElement> {
        return this._usernameInp;
    }
    public set usernameInp(value: JQuery<HTMLElement>) {
        this._usernameInp = value;
    }

    public get passwordInp(): JQuery<HTMLElement> {
        return this._passwordInp;
    }
    public set passwordInp(value: JQuery<HTMLElement>) {
        this._passwordInp = value;
    }

    public get loginBtn(): JQuery<HTMLElement> {
        return this._loginBtn;
    }
    public set loginBtn(value: JQuery<HTMLElement>) {
        this._loginBtn = value;
    }
    public get loginImage(): JQuery<HTMLElement> {
        return this._loginImage;
    }
    public set loginImage(value: JQuery<HTMLElement>) {
        this._loginImage = value;
    }

    public get unauthorizedLoginAlert(): BsAlert {
        return this._unauthorizedLoginAlert;
    }
    public set unauthorizedLoginAlert(value: BsAlert) {
        this._unauthorizedLoginAlert = value;
    }


    public init(){

        let container: JQuery<HTMLElement> = $("<div/>", {
            class: "container-fluid h-100"
        });

        let rowContainer: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
        });
        
        let colContainer: JQuery<HTMLElement> = $("<div/>", {
            class: "col-12"
        });

        let loginContainer: JQuery<HTMLElement> = $("<div/>")
        .css({
            "transform": "translateY(50%)"
        });

        rowContainer.append(
            colContainer
        );

        colContainer.append(
            loginContainer
        );

        loginContainer.append(
            this.createLoginimageRow(),
            this.createUsernameRow(),
            this.createPasswordRow(),
            this.createLoginbtnRow()
        );


        container.append(
           rowContainer,
        );

        $("body").css({
            "background-color": "#222222",
        });

        $("body").append(
            container
        );
    }

    private createUsernameRow(): JQuery<HTMLElement> {

        let rowUsername: JQuery<HTMLElement> = $("<div/>", {
            class: "row mb-2"
        });

        let colUsernameFiller1: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let colUsernameFiller2: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let colUsername: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let inpGroup: JQuery<HTMLElement> = $("<div/>", {
            class: "input-group" 
        });

        let fakeUserBtn = $("<button/>", {
            class: "btn bg-white border-none"
        }).css({
            "cursor": "default"
        });

        let userIcon = $("<i/>", {
            class: "fas fa-user"
        });

        fakeUserBtn.append(userIcon);
        
        this.usernameInp = $("<input/>", {
            class: "form-control ",
            placeholder: "Email",
            type: "email"
        });

        inpGroup.append(fakeUserBtn, this.usernameInp);

        colUsername.append(inpGroup);

        rowUsername.append(
            colUsernameFiller1,
            colUsername,
            colUsernameFiller2
        );

        return rowUsername;
    }

    private createPasswordRow(): JQuery<HTMLElement> {

        let rowPassword: JQuery<HTMLElement> = $("<div/>", {
            class: "row mb-3"
        });

        let colPassword: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let colPasswordfiller1: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let colPasswordfiller2: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let inpGroup: JQuery<HTMLElement> = $("<div/>", {
            class: "input-group" 
        });

        let passwordFakeBtn = $("<button/>", {
            class: "btn bg-white border-none"
        }).css({
            "cursor": "default"
        });

        let passwordIcon = $("<i/>", {
            class: "fas fa-lock"
        });

        passwordFakeBtn.append(passwordIcon);


        this.passwordInp = $("<input/>", {
            class: "form-control",
            placeholder: "Wachtwoord",
            type: "password"    
        });

        inpGroup.append(passwordFakeBtn, this.passwordInp);
        colPassword.append(inpGroup);

        rowPassword.append(
            colPasswordfiller1,
            colPassword,
            colPasswordfiller2
        );


        return rowPassword;
    }

    private createLoginbtnRow(): JQuery<HTMLElement> {

        let rowBtnlogin: JQuery<HTMLElement> = $("<div/>", {
            class: "row"
        });

        let colBtnfiller1: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let colBtnfiller2: JQuery<HTMLElement> = $("<div/>", {
            class: "col-4"
        });

        let colbtnlogin: JQuery<HTMLElement> = $("<div/>" , {
            class: "col-4"
        });

        let loginIcon = $("<i/>", {
            class: "fas fa-solid fa-right-to-bracket"
        });
        

        this.loginBtn = $("<button/>", {
            class: "btn btn-outline-light fw-bold float-end border",//btn-light
            text: "Inloggen   "
        }).on("click", () => {
            this.onLogin();
        });

        this.loginBtn.append(loginIcon);
        colbtnlogin.append(this.loginBtn);

        rowBtnlogin.append(
            colBtnfiller1,
            colbtnlogin,
            colBtnfiller2
        );


        return rowBtnlogin;
    }

    private createLoginimageRow(): JQuery<HTMLElement> {

        let rowImage: JQuery<HTMLElement> = $("<div/>", {
            class: "row mb-3"
        });

        let colImage: JQuery<HTMLElement> = $("<div/>",{
            class: "col-4"
        });

        let colImagefiller1: JQuery<HTMLElement> = $("<div/>",{
            class: "col-4"
        });

        let colImagefiller2: JQuery<HTMLElement> = $("<div/>",{
            class: "col-4"
        });

        this.loginImage = $("<img/>", {
            class: "img-fluid rounded float-end",
            src: "img/logo.png"
        });

        colImage.append(this.loginImage);

        rowImage.append(
            colImagefiller1,
            colImage,
            colImagefiller2
        );


        return rowImage;
    }

    private onLogin(){
        
        this.unauthorizedLoginAlert.hide();

        // Check if input is valid
        let inputIsValid: boolean = true;
        let username = this.usernameInp.val();
        let password = this.passwordInp.val();

        if(username == undefined || username == ""){

            // console.log("username invalid");

            inputIsValid = false;
            this.usernameInp.addClass("is-invalid");

        }else{ 
            this.usernameInp.removeClass("is-invalid");
        }
        
        if(password == undefined || password == ""){

            // console.log("password invalid");

            inputIsValid = false;
            this.passwordInp.addClass("is-invalid");

        }else{ 
            this.passwordInp.removeClass("is-invalid");
        }

        // If input is valid try to login
        if(inputIsValid){
           
            this.loginBtn.empty();

            let loginBtnicon = $("<i/>", {
                class: "fas fa-lg fa-spinner fa-spin"
            });

            this.loginBtn.append(loginBtnicon);


            $.ajax({
                url: "/api/login",
                method: "post",
                data: JSON.stringify({
                    username: username, // email
                    password: password
                }),
                contentType: "application/json"
            }).done((response) => {
    
                response.status // "success" if statement -> naar pagina /overview
                if (response.status == "success"){

                    this.loginBtn.removeClass("btn-light");
                    this.loginBtn.addClass("btn-success");
                    window.location.href = "/overview";

                }   
            }).fail((jqXHR, textStatus, errorThrown) => {

                // console.log(jqXHR);
                // console.log(textStatus);
                // console.log(errorThrown);

                if(errorThrown == "Unauthorized"){

                    // Reset inlog btn
                    let loginIcon = $("<i/>", {
                        class: "fas fa-solid fa-right-to-bracket"
                    });

                    this.loginBtn.empty();
                    this.loginBtn.html("Inloggen  ");
                    this.loginBtn.append(this.loginBtn, loginIcon);

                    // Show error pop up
                    this.unauthorizedLoginAlert.show();
                }
            });
        }
    }
}