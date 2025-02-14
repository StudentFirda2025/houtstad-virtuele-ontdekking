import $ from "jquery";

export class User {

    protected _id: number;
    protected _email: string;
    protected _roles: string[] = [];



    constructor(
        id: number, 
        email: string, 
        roles: string[]
    ){
        this.id = id;
        this.email = email;
        this.roles = roles;
    }

    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }

    public get roles(): string[] {
        return this._roles;
    }
    public set roles(value: string[]) {
        this._roles = value;
    }



    public getCurrentUser(callback: ()=>void){
        $.ajax({
            url: "/api/current-user",
            method: "get",
            dataType: "json"
        }).done((response) => {
            this.id = response.user.id;
            this.email = response.user.email;
            this.roles = response.user.roles;

            callback();
        }).fail((jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
    
    
        })
    }

}