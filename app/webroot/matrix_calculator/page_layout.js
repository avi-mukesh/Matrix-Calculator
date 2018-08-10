// Reizes all elements on page
function pageResize() {
	resizeCanvas();
	changePageLayout();
	resizeTopRowButtons();
}

// Creates a main wrapper div for all elements
function createMainDiv() {
	main_div = document.createElement("div");
	main_div.className = "main";
	main_div.style.padding = 0;
	document.body.appendChild(main_div);
}

// Create a new div to wrap a html5 canvas with a WebGL context
function createCanvasDiv() {
	canvas_div = document.createElement("div");
	canvas_div.id = "canvas_div";
	canvas_div.style.padding = "5vh";
	canvas_div.style.display = "block";
	canvas_div.style.float = "left";
	main_div.appendChild(canvas_div);
	
	canvas = document.createElement("canvas");
	canvas_div.appendChild(canvas);
	
	gl = canvas.getContext("webgl");
	
	// Make the canvas a square that fits the window
	canvas.style.borderStyle = "solid";
	canvas.style.borderColor = "black";
	canvas_border_thickness = 0;
	canvas.style.borderWidth = canvas_border_thickness;
}

// Create new div to hold the current matrix equation and the buttons used for editing the equation
function createEquationDiv() {
	equation_div = document.createElement("div");
	equation_div.id = "equation_div";
	equation_div.style.padding = "5vh";
	equation_div.style.display = "block";
	main_div.appendChild(equation_div);
	
	// Create container div for top row buttons
	topRowButtonDiv = document.createElement("div");
	topRowButtonDiv.id = "topRowButtonDiv";
	topRowButtonDiv.style.padding = 0;
	topRowButtonDiv.style.marginBottom = "5vh";

	equation_div.appendChild(topRowButtonDiv);
	 
	// Used for calculating widths for the top row buttons
	topRowButtonCount = 0;

	// Create all buttons for adding new items
	addTopRowButton("scalarButton", "Add scalar", addScalar);
	addTopRowButton("matrixButton", "Add matrix", addMatrix);
	addTopRowButton("operatorButton", "Add operator	", null);
	
	// Create container div for all items e.g. scalars, matrices and operators
	itemDiv = document.createElement("div");
	itemDiv.id = "itemDiv";
	itemDiv.style.padding = 0;
	equation_div.appendChild(itemDiv);
	
	// Counts increase/decrease for every item added/removed from the equation
	matrixCount = 0;
	scalarCount = 0;
	operatorCount = 0;
}

// Makes the canvas a square shape that fits perfectly within the viewport
function resizeCanvas() {
	var navbar_height = pxToFloat(window.getComputedStyle(navbar).height);
	var canvas_div_padding = pxToFloat(window.getComputedStyle(canvas_div).padding);
	
	// We use this instead of window.innerHeight because it prevents a bug on mobile
	// It prevents the whole page rearranging when the mobile URL bar hides during scrolling
	// Using the computed style, height gets the height of the window, ignoring the url bar.
	var window_height = pxToFloat(window.getComputedStyle(document.body)["height"]);
	
	// Page taller than wide (portrait orientation)
	if (window.innerHeight - navbar_height > window.innerWidth) {
		canvas.width = window.innerWidth - 2*canvas_div_padding - 2*canvas_border_thickness;
		canvas.height = canvas.width;
	}
	// Page wider than tall (landscape orientation)
	else {
		canvas.height = window_height - 2*canvas_div_padding - 2*canvas_border_thickness - navbar_height;
		//canvas.height = window.innerHeight - 2*canvas_div_padding - 2*canvas_border_thickness - navbar_height;
		canvas.width = canvas.height;
	}
	
	// Size the viewport according to the canvas size
	gl.viewport(0,0,canvas.width,canvas.height);
}

// This function also decides whether the canvas and equation divs will be side by stacked vertically
function changePageLayout() {
	var canvas_div_padding = pxToFloat(window.getComputedStyle(canvas_div).padding);
	var equation_div_padding = pxToFloat(window.getComputedStyle(equation_div).padding);
	
	// Check whether equation_div should beside canvas_div, or underneath canvas_div
	// If the canvas (and its padding) is taking more than half of the horizontal screen space...
	if (canvas.width + 2*canvas_div_padding > 0.5*window.innerWidth) {
		// Position them one on top of the other
		equation_div.style.float = "left";
		equation_div.style.width = window.innerWidth - 2*equation_div_padding - 20;
	}
	else {
		// Position them side by side
		equation_div.style.float = "right";
		equation_div.style.width = window.innerWidth - canvas.width - 2*canvas_div_padding - 2*equation_div_padding - 20;
	}
}

// Recalculates sizes of top row buttons based on rest of page
function resizeTopRowButtons() {
	var buttons = [document.getElementById("scalarButton"), document.getElementById("matrixButton"), document.getElementById("operatorButton")];
	
	var i = 0;
	while (i < buttons.length) {
		var button = buttons[i];
		button.style.width = pxToFloat(window.getComputedStyle(topRowButtonDiv)["width"])/topRowButtonCount - 2*pxToFloat(button.style.paddingLeft) - 2*pxToFloat(button.style.borderWidth);// - (window.innerWidth - document.body.clientWidth)/topRowButtonCount;
		i += 1;
	}
	
	var i = 0;
	while (i < buttons.length) {
		buttons[i].style.height = "auto";
		i+=1
	}

	var tallestHeight = 0;
	var i = 0;
	while (i < buttons.length) {
		var button = buttons[i];
		currentHeight = pxToFloat(window.getComputedStyle(button)["height"]);
		if (currentHeight > tallestHeight) {
			tallestHeight = currentHeight;
		}
		i += 1;
	}
	
	var i = 0;
	while (i < buttons.length) {
		var button = buttons[i];
		button.style.height = tallestHeight;
		i += 1;
	}
}

// Creates a new top row button e.g. add scalar
function addTopRowButton(id, innerHTML, onclick) {
	var button = document.createElement("div");
	button.id = id;
	button.innerHTML = innerHTML;
	button.class = "button";
	
	button.style.borderWidth = 1;
	button.style.borderStyle = "solid";
	button.style.borderColor = "black";
	
	button.style.cursor = "pointer";
	button.style.textAlign = "center";
	button.style.verticalAlign = "top";
	button.style.display = "inline-block";
	
	button.style.padding = 0;
	button.style.paddingTop = "2vh";
	button.style.paddingBottom = "2vh";
	
	button.onclick = onclick;
	
	topRowButtonCount += 1;
	
	topRowButtonDiv.appendChild(button);
}