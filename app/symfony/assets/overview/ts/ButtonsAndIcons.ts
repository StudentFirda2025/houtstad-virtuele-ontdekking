import $ from "jquery";
import "@fortawesome/fontawesome-free/css/all.min.css";
import QRCode from 'qrcode';
import { InfoPunt } from "../../generic-code/InfoPunt";
import { BsModal } from "../../generic-code/bootstrap/BsModal";
import { InfoPuntDataHandler } from "../../generic-code/datahandler/InfoPuntDataHandler";
import { BsAlert } from "../../generic-code/bootstrap/BsAlert";
import { messageReturn } from "../../generic-code/datahandler/dataReturn";
import { PrintWindow } from "./PrintWindow";

// Function to generate QR code as a string
async function generateQRCode(data: string): Promise<string> {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(data);
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error(`Failed to generate QR code: ${error.message}`);
  }
}

export class ButtonsAndIcons {

  private _infoPunt: InfoPunt;

  constructor(infoPunt: InfoPunt) {

    this.infoPunt = infoPunt;
  }

  private get infoPunt(): InfoPunt {
    return this._infoPunt;
  }
  private set infoPunt(value: InfoPunt) {
    this._infoPunt = value;
  }

  createButton(text: string, onClick?: () => void, iconClass?: string): JQuery<HTMLElement> {

    let button = $("<button/>", {
      text: text,
      click: onClick, // Optional click handler if needed
      class: "btn btn-outline-light h5 text-start" // Add custom styling class if desired
    });

    // Add icon if specified
    if (iconClass) {

      const icon = $("<i/>", { class: iconClass });
      button.append(icon);
    }

    return button;
  }

  createEditButton(): JQuery<HTMLElement> {

    return this.createButton("", () => {

      // Handle edit logic here if needed
      window.location.replace(("/cms?id=" + this.infoPunt.id));
    }, "fas fa-pencil-alt");  // Font Awesome edit icon class);
  }

  createDeleteButton(): JQuery<HTMLElement> {

    let modalContainer = $("<div/>").css({"width": 400, "padding": 20});

    let confirmDeleteModal: BsModal = new BsModal(modalContainer);

    let row: JQuery<HTMLElement> = $("<div/>", {
      class: "row"
    });

    let col: JQuery<HTMLElement> = $("<div/>", {
      class: "col-12"
    });

    // Text
    let text: string = "Weet je zeker dat je info-punt: " + this.infoPunt.infopuntnaam + " wilt verwijderen?\n De media gekoppeld aan het info-punt wordt niet verwijderd. \n";

    let textRow: JQuery<HTMLElement> = $("<div/>", {
      class: "row"
    });

    let textCol: JQuery<HTMLElement> = $("<div/>", {
      class: "col-12"
    });

    let textEl: JQuery<HTMLElement> = $("<h3/>", {
    }).html(text);

    textCol.append(textEl);
    textRow.append(textCol);

    // Buttons (Delete, cancle)
    let deletingAlert: BsAlert = new BsAlert({
      type: "primary",
      text: "Info-punt verwijderen..."
    });

    let deletedAlert: BsAlert = new BsAlert({
      type: "success",
      text: "Info-punt verwijderd!",
      autoHideTimeMS: 3000,
      closeable: true
    });

    let deleteErrorAlert: BsAlert = new BsAlert({
      type: "danger",
      text: "Fout bij het verwijderen van info-punt...",
      closeable: true
    });

    let buttonRow: JQuery<HTMLElement> = $("<div/>", {
      class: "row"
    });

    let deleteBtnCol: JQuery<HTMLElement> = $("<div/>", {
      class: "col-6"
    });

    let deleteBtn: JQuery<HTMLElement> = $("<button/>", {
      class: "btn btn-danger",
      text: "Verwijder"
    }).on("click", () => {

      confirmDeleteModal.close();
      deletingAlert.show();

      InfoPuntDataHandler.delete(this.infoPunt.id, (response: messageReturn) => {

        deletingAlert.hide();

        if (response.status == "success") {
          deletedAlert.show();
        } else {
          deleteErrorAlert.show();
        }

        location.reload();

      });
    });

    deleteBtnCol.append(deleteBtn);

    let cancleBtnCol: JQuery<HTMLElement> = $("<div/>", {
      class: "col-6"
    });

    let cancleBtn: JQuery<HTMLElement> = $("<button/>", {
      class: "btn btn-grey",
      text: "Annuleer"
    }).on("click", () => confirmDeleteModal.close());

    cancleBtnCol.append(cancleBtn);

    buttonRow.append(
      deleteBtnCol,
      cancleBtnCol
    );

    col.append(
      textRow,
      buttonRow
    );

    row.append(col);
    modalContainer.append(row);

    $("body").append(confirmDeleteModal.html);

    return this.createButton("", () => {
      confirmDeleteModal.show();
    }, "fas fa-trash");

  }

  createQrcodeButton(): JQuery<HTMLElement> {

    return this.createButton("", async () => {

      // Example data for QR Code
      let data = window.location.origin + "/info-punt?id=" + this.infoPunt.id;

      try {
        // Generate QR Code
        const qrCodeDataUrl = await generateQRCode(data);

        // Create an overlay for the pop-up
        const overlay = document.createElement("div");
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        overlay.style.display = "flex";
        overlay.style.justifyContent = "center";
        overlay.style.alignItems = "center";
        overlay.style.zIndex = "1000";

        // Create a container for the QR Code
        const qrContainer = document.createElement("div");
        qrContainer.style.position = "relative"; // Ensure child elements are positioned relative to this container
        qrContainer.style.backgroundColor = "white";
        qrContainer.style.padding = "20px";
        qrContainer.style.borderRadius = "10px";
        qrContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
        qrContainer.style.textAlign = "center";
        qrContainer.style.width = "fit-content";

        // Create an <img> element to display the QR Code
        const qrCodeImg = document.createElement("img");
        qrCodeImg.src = qrCodeDataUrl;
        qrCodeImg.alt = "Generated QR Code";
        qrCodeImg.style.width = "200px";
        qrCodeImg.style.height = "200px";

        const closeButton = document.createElement("button");
        closeButton.innerHTML = '<i class="fa fa-times" aria-hidden="true"></i>'; // Font Awesome 'times' icon
        closeButton.style.position = "absolute"; // Position it in the top-right corner of the container
        closeButton.style.top = "10px"; // Offset from the top of the container
        closeButton.style.right = "10px"; // Offset from the right of the container
        closeButton.style.backgroundColor = "transparent"; // Transparent background
        closeButton.style.color = "black"; // Black text color for better visibility
        closeButton.style.border = "none"; // Remove border
        closeButton.style.fontSize = "16px"; // Small font size for the icon
        closeButton.style.cursor = "pointer"; // Make it clickable
        closeButton.style.padding = "0"; // No padding for a sleek look

        // Add a click event listener to remove the pop-up
        closeButton.addEventListener("click", () => {
          document.body.removeChild(overlay);
        });

        // Create a print button for the pop-up
        const printButton = document.createElement("button");
        printButton.textContent = "Print";
        printButton.style.marginTop = "20px";
        printButton.style.marginRight = "10px";
        printButton.style.marginLeft = "10px";
        printButton.style.padding = "10px 20px";
        printButton.style.backgroundColor = "#4CAF50";
        printButton.style.color = "white";
        printButton.style.border = "none";
        printButton.style.borderRadius = "5px";
        printButton.style.cursor = "pointer";

        const sizes = {
          small: 150,
          medium: 300,
          large: 600,
        };

        printButton.addEventListener("click", () => {
          // Hide the Print and Download buttons
          printButton.style.display = "none";
          downloadButton.style.display = "none";

          // Create size selection buttons
          const sizeContainer = document.createElement("div");
          sizeContainer.style.marginTop = "20px";

          Object.keys(sizes).forEach((size) => {

            const sizeButton = document.createElement("button");
            sizeButton.textContent = size.charAt(0).toUpperCase() + size.slice(1); // Capitalize the first letter
            sizeButton.style.margin = "5px";
            sizeButton.style.padding = "10px 20px";
            sizeButton.style.backgroundColor = "#4CAF50";
            sizeButton.style.color = "white";
            sizeButton.style.border = "none";
            sizeButton.style.borderRadius = "5px";
            sizeButton.style.cursor = "pointer";

            // Event listener for size buttons
            sizeButton.addEventListener("click", () => {

              const width = sizes[size];
              let printWindow: PrintWindow = new PrintWindow(qrCodeDataUrl, width);
              printWindow.print();

              // Restore original buttons and remove size options
              sizeContainer.remove();
              printButton.style.display = "inline-block";
              downloadButton.style.display = "inline-block";
            });

            sizeContainer.appendChild(sizeButton);
          });

          // Add size selection buttons to the container
          qrContainer.appendChild(sizeContainer);
        });

        // Create a download button for the QR Code
        const downloadButton = document.createElement("button");
        downloadButton.textContent = "Download";
        downloadButton.style.marginTop = "20px";
        downloadButton.style.padding = "10px 20px";
        downloadButton.style.backgroundColor = "#2196F3";
        downloadButton.style.color = "white";
        downloadButton.style.border = "none";
        downloadButton.style.borderRadius = "5px";
        downloadButton.style.cursor = "pointer";

        downloadButton.addEventListener("click", () => {
          // Hide the Print and Download buttons
          printButton.style.display = "none";
          downloadButton.style.display = "none";

          // Create size selection buttons
          const sizeContainer = document.createElement("div");
          sizeContainer.style.marginTop = "20px";

          Object.keys(sizes).forEach((size) => {
            const sizeButton = document.createElement("button");
            sizeButton.textContent = size.charAt(0).toUpperCase() + size.slice(1); // Capitalize the first letter
            sizeButton.style.margin = "5px";
            sizeButton.style.padding = "10px 20px";
            sizeButton.style.backgroundColor = "#2196F3";
            sizeButton.style.color = "white";
            sizeButton.style.border = "none";
            sizeButton.style.borderRadius = "5px";
            sizeButton.style.cursor = "pointer";

            // Event listener for size buttons
            sizeButton.addEventListener("click", () => {
              const width = sizes[size];
              const sizedQrCodeDataUrl = this.changeImageSize(qrCodeDataUrl, width);

              const downloadLink = document.createElement("a");
              downloadLink.href = sizedQrCodeDataUrl;
              downloadLink.download = `qrcode_${size}.png`;
              downloadLink.click();

              // Restore original buttons and remove size options
              sizeContainer.remove();
              printButton.style.display = "inline-block";
              downloadButton.style.display = "inline-block";
            });

            sizeContainer.appendChild(sizeButton);
          });

          // Add size selection buttons to the container
          qrContainer.appendChild(sizeContainer);
        });

        // Append QR Code, buttons, and close button to the container
        qrContainer.appendChild(closeButton);
        qrContainer.appendChild(qrCodeImg);
        qrContainer.appendChild(printButton);
        qrContainer.appendChild(downloadButton);

        // Append the container to the overlay
        overlay.appendChild(qrContainer);

        // Append the overlay to the document body
        document.body.appendChild(overlay);

      } catch (error) {
        // console.error("Error generating QR Code:", error);
      }
    }, "fas fa-qrcode");
  }

  // Helper function to resize the image
  private changeImageSize(imgUrl, width, height = width): string {

    const img: HTMLImageElement = new Image();
    img.src = imgUrl;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    // Draw the image on the canvas with the desired dimensions
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/png");
  }

  // Method to create an edit icon
  createTextIcon(): JQuery<HTMLElement> {
    return $("<i/>", {
      class: "fa-regular fa-message",
      style: "padding: 5px"
    }); // Font Awesome edit icon class
  }

  // Method to create a delete icon
  createVideoIcon(): JQuery<HTMLElement> {
    return $("<i/>", {
      class: "fas fa-film",
      style: "padding: 5px"
    }); // Font Awesome trash icon class
  }

  // Method to create a sound icon
  createSoundIcon(): JQuery<HTMLElement> {
    return $("<i/>", {
      class: "fas fa-volume-up",
      style: "padding: 5px"
    }); // Font Awesome save icon class
  }

}
