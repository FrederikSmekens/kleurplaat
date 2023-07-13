"use strict";
let coloringplate;
let colors = ["red", "green", "blue", "yellow", "pink", "white"];
let canvas;
let canvasContext;


const state = {
    mousedown: false
};
class Coloringplate {
    #colors = [];
    #currentcolor;
    #drawarea;
    #lineWidth = 5;
    constructor(colors, drawarea) {
        this.#colors = colors;
        this.#drawarea = drawarea;
    }

    getColors() {
        return this.colors;
    }
    getCurrentColor() {
        return this.#currentcolor;
    }
    getDrawArea(){
        return this.#drawarea;
    }
    createDrawingArea() {
        canvas = document.createElement('canvas');
        canvas.setAttribute("width", this.#drawarea.getWidth());
        canvas.setAttribute("height", this.#drawarea.getHeight());

        canvas.addEventListener('mousedown', this.handleWritingStart);
        canvas.addEventListener('mousemove', this.handleWritingInProgress);
        canvas.addEventListener('mouseup', this.handleDrawingEnd);
        canvas.addEventListener('mouseout', this.handleDrawingEnd);

        canvas.addEventListener('touchstart', this.handleWritingStart);
        canvas.addEventListener('touchmove', this.handleWritingInProgress);
        canvas.addEventListener('touchend', this.handleDrawingEnd);

        document.body.appendChild(canvas);
    }
    static getMousePositionOnCanvas(event) {
        // console.log(event);
        const clientX = event.clientX || event.touches[0].clientX;
        const clientY = event.clientY || event.touches[0].clientY;
        const { offsetLeft, offsetTop } = event.target;
        const canvasX = clientX - offsetLeft;
        const canvasY = clientY - offsetTop;

        return { x: canvasX, y: canvasY };
    }
    handleWritingStart(event) {
        event.preventDefault();
        // console.log(event);
        const mousePos = Coloringplate.getMousePositionOnCanvas(event);
        canvasContext = canvas.getContext('2d');
        canvasContext.beginPath();

        canvasContext.moveTo(mousePos.x, mousePos.y);

        canvasContext.lineWidth = coloringplate.#lineWidth;
        canvasContext.strokeStyle = coloringplate.getCurrentColor();

        canvasContext.fill();

        state.mousedown = true;
    }
    handleWritingInProgress(event) {
        event.preventDefault();

        if (state.mousedown) {
            const mousePos = Coloringplate.getMousePositionOnCanvas(event);

            canvasContext.lineTo(mousePos.x, mousePos.y);
            canvasContext.stroke();
        }
    }
    handleDrawingEnd(event) {
        event.preventDefault();

        if (state.mousedown) {
            canvasContext.stroke();
        }

        state.mousedown = false;
    }
    setCurrentColor(color) {
        this.#currentcolor = color;
    }
    createColorButtons() {
        let colorButtons = document.createElement("div");
        colorButtons.setAttribute("class", "settings__colors");
        colorButtons.innerHTML = "<h4>Colors</h4>";

        for (let color of colors) {
            let btnColor = document.createElement('button');
            btnColor.innerHTML = color;
            btnColor.setAttribute("style", `background-color:${color}`)
            btnColor.addEventListener("click",
                function () {
                    coloringplate.setCurrentColor(color);
                });
            colorButtons.appendChild(btnColor);
        }
        return colorButtons;
    }
    setLineWidthRange(lineWidth){
        this.#lineWidth = lineWidth;
        //console.log(lineWidth);
        document.getElementById("Size").innerHTML = lineWidth;
    }
    getLineWidth(){
        return this.#lineWidth;
    }
    createLineWidthRange(){
        let lineWidthRange = document.createElement("input");   
        lineWidthRange.setAttribute("id","LineWidth");     
        lineWidthRange.setAttribute("type","range");     
        lineWidthRange.setAttribute("min","1");     
        lineWidthRange.setAttribute("max","15");  
        lineWidthRange.setAttribute("value", this.getLineWidth());  

        lineWidthRange.addEventListener("input", (event) => {
            this.setLineWidthRange(event.target.value);           
        });
       
        return lineWidthRange;

    }
 
    createSettings() {
        let divSettings = document.createElement("div");
        divSettings.innerHTML = "<h2>Settings</h2>";
        divSettings.setAttribute("class", "settings");

        //Canvas Size
        let canvasWidth = document.createElement("input");
        canvasWidth.setAttribute("type","number");
        canvasWidth.value = this.getDrawArea().getWidth();
        canvasWidth.addEventListener("input", (event) => {
            this.getDrawArea().setWidth(event.target.value); 
            canvas.setAttribute("width", this.#drawarea.getWidth());
                   
        });

        let canvasHeight = document.createElement("input");
        canvasHeight.setAttribute("type","number");
        canvasHeight.value = this.getDrawArea().getHeight();
        canvasHeight.addEventListener("input", (event) => {
            this.getDrawArea().setHeight(event.target.value);  
            canvas.setAttribute("height", this.#drawarea.getHeight());        
         });

        divSettings.appendChild(canvasWidth);
        divSettings.appendChild(canvasHeight);

        //Colors
        divSettings.appendChild(this.createColorButtons());
       
        //pencil size
        let label = document.createElement("label");
        label.innerHTML = "<h4>Size <span id='Pencil'>5</span></h4>";
        divSettings.appendChild(label);
        divSettings.appendChild(this.createLineWidthRange());
        
        

        document.body.appendChild(divSettings);
    }

}

class DrawingArea {
    #width;
    #height;
    constructor(width, height) {
        this.#width = width;
        this.#height = height;
    }
    getWidth() {
        return this.#width;
    }
    getHeight() {
        return this.#height;
    }
    setWidth(width){
        this.#width = width;
    }
    setHeight(height){
        this.#height = height;
    }
}

let drawingArea = new DrawingArea(500, 500);
coloringplate = new Coloringplate(colors, drawingArea);


coloringplate.createSettings();
coloringplate.createDrawingArea();

//console.log(coloringplate);