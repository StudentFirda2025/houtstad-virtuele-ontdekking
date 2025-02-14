/**
 * Author: Floris Vrij
 * Project: IoT-Web-Manager
 */
import $ from "jquery";
export class Bs {

    static jqEl(tag: string, classes: string = "", options: any = {}): JQuery<HTMLElement>{

        options = {
            class: classes,
            ...options
        }; 

        return $(("<" + tag + "/>"), options);
    }

    // card
    static card(extraClass: string = ""): JQuery<HTMLElement>{
        return Bs.jqEl("div", ("card " + extraClass));
    }

    static cardHeader(extraClass: string = ""): JQuery<HTMLElement>{
        return Bs.jqEl("div", ("card-header " + extraClass));
    }

    static cardBody(extraClass: string = ""): JQuery<HTMLElement>{
        return Bs.jqEl("div", ("card-body " + extraClass));
    }

    /**
     * Returns a object with the components of a card that are already append to each other
     * @returns {card: JQuery<HTMLElement>, header: JQuery<HTMLElement>, body: JQuery<HTMLElement>}
     */
    static fullCard(extraCardClass = "", extraHeaderClass = "", extraBodyClass= ""): {card: JQuery<HTMLElement>, header: JQuery<HTMLElement>, body: JQuery<HTMLElement>}{

        let card = Bs.card(extraCardClass);
        let cardHeader = Bs.cardHeader(extraHeaderClass);
        let cardBody = Bs.cardBody(extraBodyClass);

        card.append(
            cardHeader,
            cardBody
        );

        return {
            card: card,
            header: cardHeader,
            body: cardBody
        };
    }

    /**
     * Returns a object with a card and a card-body that are already append to each other
     * @returns {card: JQuery<HTMLElement>, header: JQuery<HTMLElement>, body: JQuery<HTMLElement>}
     */
    static windowCard(extraCardClass = "", extraBodyClass= ""): {card: JQuery<HTMLElement>, body: JQuery<HTMLElement>}{

        let card = Bs.card(extraCardClass);
        let cardBody = Bs.cardBody(extraBodyClass);

        card.append(
            cardBody
        );

        return {
            card: card,
            body: cardBody
        };
    }

    // Font awesome
    static fas(iconClass: string){
        return Bs.jqEl("i", ("fas " + iconClass));
    }

}