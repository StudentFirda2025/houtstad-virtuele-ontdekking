import $ from "jquery";
import DataTable from 'datatables.net-bs5';
import { InfoPunt } from "../../generic-code/InfoPunt";
import '@fortawesome/fontawesome-free/css/all.min.css';
import { ButtonsAndIcons } from "../ts/ButtonsAndIcons";
import { InfoPuntDataHandler } from "../../generic-code/datahandler/InfoPuntDataHandler";


document.body.style.backgroundColor = "#222222";

export class OverviewPage {
    
    private _naam: string;
    private _infoPunten: InfoPunt[] = [];

    constructor() {

        $("html").attr("data-bs-theme", "dark");

        this.getData(()=>{
            this.createPage();
        });
    }

    protected get infoPunten(): InfoPunt[] {
        return this._infoPunten;
    }
    protected set infoPunten(value: InfoPunt[]) {
        this._infoPunten = value;
    }

    public get naam(): string {
        return this._naam;
    }
    public set naam(value: string) {
        this._naam = value;
    }


    private createPage() {

        let container = $("<div/>", {
            class: "container"
        });

        container.append(
            this.createMainCard()
        );

        $("body").append(container);
    }

    private getData(callback: ()=>void) {
    
        InfoPuntDataHandler.getAll((response)=>{

            this.infoPunten = response;
            callback();
        });
    }


    protected getColumnDef(column: string): any {
    
        switch (column) {
            case "id":
                return {
                    targets: 0,
                    width: "10%",
                    data: "id",
                    name: "id",
                    title: '<i class="fas fa-fw fa-hashtag"></i>',
                    className: 'h5 text-start',
                    render: (data, type, full, meta) => {
                        return data;
                    }
                };
            case "infopuntnaam":
                return {
                    targets: 1,
                    width: "70%",
                    data: "infopuntnaam",
                    name: "infopuntnaam",
                    title: '<i class="fas fa-fw fa-heading"></i>',
                    className: "h5 text-start",
                    render: (data, type, full, meta) => {
                        return data;
                    }
                };
            case "icons":
                return {
                    targets: 2,
                    width: "10%",
                    data: null, // No direct data source; will be dynamically populated
                    name: "icons",
                    orderable: false,
                    searchable: false,
                    createdCell: (td, cellData, rowData, row, col) => {
                        const buttonFactory = new ButtonsAndIcons(rowData);
    
                        const textIcon = buttonFactory.createTextIcon();
                        const videoIcon = buttonFactory.createVideoIcon();
                        const soundIcon = buttonFactory.createSoundIcon();
    
                        // Clear the cell and append only the specific icons
                        $(td).empty();
                        if (rowData.text && rowData.text !== "<p><br></p>") {
                            $(td).append(textIcon);
                        }
                        if (rowData.video != null) {
                            $(td).append(videoIcon);
                        }
                        if (rowData.audio != null) {
                            $(td).append(soundIcon);
                        }
                    }
                };
            case "buttons":
                return {
                    targets: 3,
                    width: "10%",
                    data: "text",
                    name: "text",
                    orderable: false,
                    searchable: false,
                    createdCell: (td, type, full, row, col) => {
                        console.log("full: ", full);
                        const buttonFactory = new ButtonsAndIcons(full);
    
                        const editButton = buttonFactory.createEditButton();
                        const deleteButton = buttonFactory.createDeleteButton();
                        const QrcodeButton = buttonFactory.createQrcodeButton();
    
                        // Wrap buttons inside a Bootstrap button group
                        const buttonGroup = $('<div>', { class: 'btn-group', role: 'group' });
                        buttonGroup.append(editButton, deleteButton, QrcodeButton);
    
                        $(td).empty();
                        $(td).append(buttonGroup);
                    }
                };
        }
    }
    
    private createMainCard(): JQuery<HTMLElement> {
    
        let card = $("<div/>", {
            class: "card", 
            css: {
                border: "1px solid #222222",
                
            }
        });
    
        let cardHeader = $("<div/>", {
            class: "card-header",
        }).css("background-color", "#9C9C9C");
    
        let cardImage = $("<img/>", {
            src: "image/logo.png",
            alt: "Houtstad-Ijlst Image",
            class: "card-image",
            css: { width: "140px", height: "60px", marginRight: "10px" }
        });

        cardHeader.append(cardImage);
    
        let cardBody = $("<div/>", {
            class: "card-body",
        });
    
        // Create the table element
        let tableElement = $('<table/>', {
            class: 'table display table-striped',
        });
    
        // Append the table to the body (or any other container in your HTML)
        $('body').append(tableElement);
    
        let ctrlRow = $("<div/>", {
            class: "row"
        });

        let ctrlCol = $("<div/>", {
            class: "col-12"
        });
    
        let addIcon = $("<i/>", {
            class: "fas fa-plus"
        });

        let addBtn = $("<button/>", {
            class: "btn btn-outline-light float-end",
        }).on("click", () => {
            window.location.replace("/cms?id=new");
        });

        addBtn.append(addIcon);

        let mediaCmsBtn = $("<button/>", {
            class: "btn btn-outline-light float-start"
        }).on("click", ()=>{
            window.location.replace("/media/cms");
        });

        let mediaCmsIcon = $("<i/>", {
            class: "fas fa-photo-film"
        });

        mediaCmsBtn.append(mediaCmsIcon);

    
        ctrlCol.append(mediaCmsBtn, addBtn);
        ctrlRow.append(ctrlCol);
    
        // Append the table element to the card body
        cardBody.append(ctrlRow, tableElement);
    
        // Include the "icons" column
        let columns = ["id", "infopuntnaam", "icons", "buttons"];
        let columnDefs: any[] = columns.map((column) => {
            return this.getColumnDef(column);
        });
    
        // Initialize DataTable on the actual table element after it's in the DOM
        let table = new DataTable(tableElement, {
            columnDefs: columnDefs,
            data: this.infoPunten
        });
    
        card.append(cardHeader, cardBody);
    
        return card;
    }
}

