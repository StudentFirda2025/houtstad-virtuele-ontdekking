import $ from "jquery";
import { User } from "./User";

// let currentUser: User;
// UserManager.getCurrentUser((user) => {
//     if(user == null){
//         window.location.href = "/login"
//     }else{
//         user = currentUser;
//     }
// });


export class UserManager{

    constructor(){

    }


    public static getCurrentUser(callback: (currentUser: User | null)=>void){
        $.ajax({
            url: "/api/current-user",
            method: "get",
            dataType: "json"
        }).done((response) => {
            if(response == null){
                callback(null);
                return;
            }else{
                let currentUser: User = new User(
                    response.user.id,
                    response.user.email,
                    response.user.roles
                );
    
                callback(currentUser);
            }
    
        }).fail((jqXHR, textStatus, errorThrown) => {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
    
    
        })
    }


    

}