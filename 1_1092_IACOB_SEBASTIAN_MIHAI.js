 //deselectare si selectare butoane
let interfata = document.querySelector("#interfata");
let buttons = interfata.querySelectorAll('.button');
//canvas
let canvas = document.querySelector("#iacob_sebastian_canvas");
canvas.width = window.innerWidth * 0.8;
canvas.height = window.innerHeight * 0.55;
let context = canvas.getContext("2d");
let canvasPositions = canvas.getBoundingClientRect();

//grosime si culoare figuri
let grosime_select = document.querySelector("#select_grosime");
let grosime = grosime_select.value;
let culoare_input_figuri = document.querySelector("#culoare_figuri_input");
let culoare_figura =  culoare_input_figuri.value;
//culoare background 
let culoare_background_input = document.querySelector("#culoare_background_input");
canvas.style.backgroundColor = culoare_background_input.value;

//salvare format raster
let select_format = document.querySelector("#format_select");
let save_btn = document.querySelector("#save_canvas");
save_btn.classList.add('button');

//salvare format svg
let save_btn_svg = document.querySelector("#save_canvas_svg");
save_btn_svg.classList.add('button');

//coordonate si lista figurilor cu coordonate
let startMouseX = 0, startMouseY= 0, endMouseX = 0, endMouseY = 0 ,drawing = false;
let elipsa_list = [];
let dreptunghi_list = [];
let linii_list = [];
//elipsa-buton
let elipsa_radio = document.querySelector("#elipsa_radio");
//dreptunghi button
let dreptunghi_radio = document.querySelector("#dreptunghi_radio");
//linie button
let linie_radio = document.querySelector("#linie_radio");
//creion button
let creion_radio = document.querySelector("#creion_radio");


let currentShape = null;
function application() {
 
    comportament();
    elipsa_radio.addEventListener("change", ev =>  {
        if (elipsa_radio.checked) {
            currentShape = "elipsa"
        }
    });
    
    dreptunghi_radio.addEventListener("change", ev =>   {
        if (dreptunghi_radio.checked) {
            currentShape = "dreptunghi"
        }
    });
    linie_radio.addEventListener("change", ev => {
        if (linie_radio.checked) {
            currentShape = "linie"
        }
    });
    creion_radio.addEventListener("change",() => {});
    

    //redimensinare canvas
    window.addEventListener("resize",resizedWindow) 

    canvas.addEventListener("mouseenter",switchCursorOnCanvas);
    canvas.addEventListener("mouseleave",resetCursorOutOfCanvas)
    //culoare si grosime figuri
    grosime_select.addEventListener("change", () => {grosime = grosime_select.value;});
    culoare_input_figuri.addEventListener("change", () => {culoare_figura = culoare_input_figuri.value;});
    //culoare background
    culoare_background_input.addEventListener("change",desenareBackground);
    //salvare format raster
    save_btn.addEventListener("click",salvareFormatRaster)
    //salvare format svg
    save_btn_svg.addEventListener("click",salvareFormatSVG);

}
//pentru resize de window
function resizedWindow() {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.55;
    canvasPositions = canvas.getBoundingClientRect();
    desenareBackground();
}
//cursor
function switchCursorOnCanvas() {
    document.body.style.cursor = 'crosshair';
}
function resetCursorOutOfCanvas() {
    document.body.style.cursor = "default";
}
//comporatament figuri
function comportament() {
    canvas.addEventListener("mousedown",ev =>{mouseDown(ev)});
    canvas.addEventListener("mousemove",ev => {mouseMove(ev)});
    canvas.addEventListener("mouseup",ev => {mouseUp(ev)});
}
function mouseDown(ev) {
    drawing = true;
    startMouseX = ev.x - canvasPositions.x;
    startMouseY = ev.y - canvasPositions.y;
}

function mouseMove(ev,figura) {
    if(drawing) {
        endMouseX = ev.x - canvasPositions.x;
        endMouseY = ev.y - canvasPositions.y;
        redesenareMouseMove();
    }
}
function mouseUp(ev,figura) {
    drawing = false;
    endMouseX = ev.x - canvasPositions.x;
    endMouseY = ev.y - canvasPositions.y;
    mouseUpFigureValidation();
    desenareBackground();
}
function mouseUpFigureValidation() {

    if(currentShape != null) {
        let button = document.createElement("button");
        let position = -1;
        if(currentShape == "elipsa") {
            elipsa_list.push({startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare_figura});
            position = elipsa_list.length - 1;
        }
        if(currentShape == "dreptunghi") {
            dreptunghi_list.push({startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare_figura});
            position = dreptunghi_list.length - 1;
        }
        if(currentShape == "linie") {
            linii_list.push({startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare_figura});
            position = linii_list.length - 1;
        }    
   
        button.addEventListener("click",ev => alegeElement(ev,position));
        button.addEventListener("dblclick",ev => stergeElement(ev,position));
        let stergereDiv = document.querySelector("#stergereDiv");
        button.innerText = currentShape;
        stergereDiv.append(button);
    }
    
}
function redesenareMouseMove(figura) {
    context.clearRect(0,0,canvas.width,canvas.height);
    desenareBackground();
    mouseMoveFigureValidation();
}
function mouseMoveFigureValidation() {
    if(currentShape === "elipsa") {
        desenareElipsa(startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare_figura);
    }
    else 
        if(currentShape === "dreptunghi") {
            desenareDreptunghi(startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare_figura);
        }
    else 
        if(currentShape === "linie") {
            desenareLinie(startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare_figura);
        }
}
function desenareElipsa(startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare) {
    let centruX = (endMouseX + startMouseX)/2;
    let centruY = (endMouseY + startMouseY)/2;
    let razaX = Math.abs(endMouseX - startMouseX)/2;
    let razaY = Math.abs(endMouseY - startMouseY)/2;   
    context.beginPath();
    context.strokeStyle = culoare;
    context.lineWidth = grosime;
    context.ellipse(centruX, centruY, razaX, razaY, 0, 0, 2 * Math.PI);
    context.stroke();
}
function desenareDreptunghi(startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare) {
    const width = endMouseX - startMouseX;
    const height = endMouseY - startMouseY;  
    context.beginPath();
    context.strokeStyle = culoare;
    context.lineWidth = grosime;
    context.rect(startMouseX, startMouseY, width, height);
    context.stroke();
}
function desenareLinie(startMouseX,startMouseY,endMouseX,endMouseY,grosime,culoare) {
    context.beginPath();
    context.moveTo(startMouseX, startMouseY);
    context.lineTo(endMouseX, endMouseY);
    context.strokeStyle = culoare;
    context.lineWidth = grosime;
    context.stroke();
}
function desenareBackground() {
    context.fillStyle = culoare_background_input.value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    redesenareElipse();
    redesenareDreptunghiuri();
    redesenareLinii();
}
function redesenareElipse() {
    for(const elipsa of elipsa_list) {
        desenareElipsa(elipsa.startMouseX,elipsa.startMouseY,elipsa.endMouseX,elipsa.endMouseY,elipsa.grosime,elipsa.culoare_figura)
    }
} 
function redesenareDreptunghiuri() {
    for(const dreptunghi of dreptunghi_list) {
        desenareDreptunghi(dreptunghi.startMouseX,dreptunghi.startMouseY,dreptunghi.endMouseX,dreptunghi.endMouseY,dreptunghi.grosime,dreptunghi.culoare_figura)
    }
} 
function redesenareLinii() {
    for(const linie of linii_list) {
        desenareLinie(linie.startMouseX,linie.startMouseY,linie.endMouseX,linie.endMouseY,linie.grosime,linie.culoare_figura)
    }
}
async function salvareFormatRaster() {
    const format = select_format.value;
    const mimeType = `image/${format}`; 
    const fileExtension = format; 

    const dataURL = canvas.toDataURL(mimeType);
    const blob = await (await fetch(dataURL)).blob();

    if (window.showSaveFilePicker) {
        const options = {
            types: [
                {
                    description: `${fileExtension.toUpperCase()} Image`,
                    accept: { [mimeType]: [`.${fileExtension}`] },
                },
            ],
        };

        try {
            const fileHandle = await showSaveFilePicker(options); 
            const writable = await fileHandle.createWritable(); 
            await writable.write(blob); 
            await writable.close();
        } catch (err) {
            console.error("File save canceled or failed:", err);
        }
    }
    
}
//salvare format SVG
async function salvareFormatSVG() {
    let svgContent = `
        <svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}">
            <rect width="100%" height="100%" fill="${culoare_background_input.value}" />
    `;

    for (const elipsa of elipsa_list) {
        const centruX = (elipsa.endMouseX + elipsa.startMouseX) / 2;
        const centruY = (elipsa.endMouseY + elipsa.startMouseY) / 2;
        const razaX = Math.abs(elipsa.endMouseX - elipsa.startMouseX) / 2;
        const razaY = Math.abs(elipsa.endMouseY - elipsa.startMouseY) / 2;
        
        svgContent += `
            <ellipse cx="${centruX}" cy="${centruY}" rx="${razaX}" ry="${razaY}" 
                stroke="${elipsa.culoare_figura}" stroke-width="${elipsa.grosime}" fill="none" />
        `;
    }
    for (const dreptunghi of dreptunghi_list) {
        const x = Math.min(dreptunghi.startMouseX, dreptunghi.endMouseX);
        const y = Math.min(dreptunghi.startMouseY, dreptunghi.endMouseY);
        const width = Math.abs(dreptunghi.endMouseX - dreptunghi.startMouseX);
        const height = Math.abs(dreptunghi.endMouseY - dreptunghi.startMouseY);

        svgContent += `
            <rect x="${x}" y="${y}" width="${width}" height="${height}" 
                stroke="${dreptunghi.culoare_figura}" stroke-width="${dreptunghi.grosime}" fill="none" />
        `;
    }


    for (const linie of linii_list) {
        svgContent += `
            <line x1="${linie.startMouseX}" y1="${linie.startMouseY}" 
                  x2="${linie.endMouseX}" y2="${linie.endMouseY}" 
                  stroke="${linie.culoare_figura}" stroke-width="${linie.grosime}" />
        `;
    }
    svgContent += '</svg>';
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml"});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(svgBlob);
    link.download = "canvas_image.svg";
    link.click();    
} 

//stergere Element
function alegeElement(ev,position) {
    let figuraString = ev.target.innerText;
    console.log(position);
    let figureObject = null;
    if(figuraString === "elipsa" ) {
        figureObject = elipsa_list.at(position);
        desenareElipsa(figureObject.startMouseX,figureObject.startMouseY,figureObject.endMouseX,figureObject.endMouseY,15,"black");
    }else {
        if(figuraString === "dreptunghi") {
            console.log("elipsa1")
            figureObject = dreptunghi_list.at(position);
            desenareDreptunghi(figureObject.startMouseX,figureObject.startMouseY,figureObject.endMouseX,figureObject.endMouseY,15,"black");
        }else {
            if(figuraString === "linie") {
                console.log("elipsa2")
                figureObject = linii_list.at(position);
                desenareLinie(figureObject.startMouseX,figureObject.startMouseY,figureObject.endMouseX,figureObject.endMouseY,15,"black");
            }
        }
    }
}

function stergeElement(ev,position) {
    console.log(ev);
    let figuraString = ev.target.innerText;
    console.log(position);
    let figureObject = null;
    if(figuraString === "elipsa" ) {
        figureObject = elipsa_list.splice(position,1);
    }else {
        if(figuraString === "dreptunghi") {
            console.log("elipsa1")
            figureObject = dreptunghi_list.splice(position,1);
        }else {
            if(figuraString === "linie") {
                console.log("elipsa2")
                figureObject = linii_list.splice(position,1);
            }
        }
    }
    desenareBackground();
    const button = ev.target; // The button that was double-clicked
    const parent = button.parentElement; // Parent container (div)

    parent.removeChild(button); // Remove the button
    
}

document.addEventListener("DOMContentLoaded",application);