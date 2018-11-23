// Declare namespace
calculator_layout = function()
{
	var self = {};
	
	// Creates a main wrapper div for all elements
	self.createMainDiv = function ()
	{
		var mainDiv = document.createElement("div");
		mainDiv.id = "mainDiv";
		mainDiv.style.padding = 0;
		document.body.appendChild(mainDiv);
		
		var calculatorLayout = localStorage.getItem("themeCalculatorLayout");
		if (calculatorLayout == "Equation before graph")
		{
			// Create the equation div before the canvas div
			self.createEquationDiv();
			self.createCanvasDiv();
		}
		else
		{
			// Create the graph div before the equation div
			self.createCanvasDiv();
			self.createEquationDiv();
		}
	};

	// Create a new div to wrap a html5 canvas with a WebGL context
	self.createCanvasDiv = function ()
	{
		var mainDiv = document.getElementById("mainDiv");
		
		var canvasDiv = document.createElement("div");
		canvasDiv.id = "canvasDiv";
		canvasDiv.style.padding = "30px";
		canvasDiv.style.display = "block";
		canvasDiv.style.float = "var(--theme-canvas-div-float)";
		mainDiv.appendChild(canvasDiv);
		
		var canvas = document.createElement("canvas");
		canvas.id = "canvas";
		canvas.style.boxShadow = "var(--theme-box-shadow)";
		canvas.style.borderRadius = "var(--theme-border-radius)";
		canvasDiv.appendChild(canvas);
		
		gl = canvas.getContext("webgl");
	};

	// Create new div to hold the current matrix equation and the buttons used for editing the equation
	self.createEquationDiv = function ()
	{
		var mainDiv = document.getElementById("mainDiv");
		
		// Creates a div for holding all elements for building the equation
		var equationDiv = document.createElement("div");
		equationDiv.id = "equationDiv";
		equationDiv.style.padding = "30px";
		equationDiv.style.float = "var(--theme-equation-div-float)";
		mainDiv.appendChild(equationDiv);
		
		// Creates all buttons for adding new items to the equation
		var addItemButtons = [];
		addItemButtons.push(layout.createButton("Scalar", calculator_build.addScalar, "var(--theme-color-main)"));
		addItemButtons.push(layout.createButton("Grid", calculator_build.addGrid, "var(--theme-color-main)"));
		addItemButtons.push(layout.createButton("Operation", calculator_build.addOperation, "var(--theme-color-main)"));
		addItemButtons.push(layout.createButton("Bracket", calculator_build.addBracket, "var(--theme-color-main)"));

		// Creates a row of the add item buttons
		var equationAddItemButtonDiv = layout.createButtonRow(addItemButtons);
		equationAddItemButtonDiv.id = "equationAddItemButtonDiv";
		equationDiv.appendChild(equationAddItemButtonDiv);
		
		// Creates a container div for all items e.g. scalars, matrices, vectors,  operations and brackets
		var itemDiv = document.createElement("div");
		itemDiv.id = "itemDiv";
		equationDiv.appendChild(itemDiv);
		
		// Create buttons for solving the equation and importing/exporting it to a file
		var finishItemButtons = [];
		finishItemButtons.push(layout.createButton("Solve", calculator_solve.parseItemValues, "var(--theme-color-main)"));
		finishItemButtons.push(layout.createButton("Import", null, "var(--theme-color-main)"));
		finishItemButtons.push(layout.createButton("Export", null, "var(--theme-color-main)"));	
		
		// Create the finishButtonDiv
		var equationFinishButtonDiv = layout.createButtonRow(finishItemButtons);
		equationFinishButtonDiv.id = "equationFinishButtonDiv";
		equationFinishButtonDiv.style.visibility = "hidden";
		equationFinishButtonDiv.style.animationDuration = "0.25s";
		equationDiv.appendChild(equationFinishButtonDiv);
	};
	
	// Makes the canvas a square shape that fits perfectly within the viewport
	// Then fit the equation div into the remaining space, either beside or below the canvas
	self.resizePage = function ()
	{
		// Gets computed properties. Must use window.getComputedStyle because element.clientHeight rounds to integer values
		// The +2 is necessary because the "montserrat" font takes a small time to load, but is 2 pixels taller than the default font
		var navbarHeight = layout.pxToFloat(window.getComputedStyle(navbar).height) + 2;
		var canvasDivPadding = layout.pxToFloat(window.getComputedStyle(canvasDiv).padding);
		var equationDivPadding = layout.pxToFloat(window.getComputedStyle(equationDiv).padding);
		
		// Page taller than wide (portrait orientation)
		if (document.body.offsetHeight - navbarHeight > document.body.offsetWidth)
		{
			canvas.width = document.body.offsetWidth - 2 * canvasDivPadding;
			canvas.height = canvas.width;
		}
		// Page wider than tall (landscape orientation)
		else
		{
			canvas.height = document.body.offsetHeight - 2 * canvasDivPadding - navbarHeight;
			canvas.width = canvas.height;
		}

		// Size the viewport according to the canvas size
		gl.viewport(0, 0, canvas.width, canvas.height);

		// Check whether equationDiv should beside canvasDiv, or underneath canvasDiv
		// If the canvas (and its padding) is taking more than 60% of the horizontal screen space...
		if (canvas.width + 2 * canvasDivPadding > 0.6 * document.body.offsetWidth)
		{
			// Position them one on top of the other
			// Make equation div fill all available horizontal space
			equationDiv.style.width = document.body.offsetWidth - 2 * equationDivPadding;
			// Makes sure that the canvas is centered horizontally using margins
			canvasDiv.style.marginLeft = (document.body.offsetWidth - canvas.width - 2 * canvasDivPadding) / 2;
			canvasDiv.style.marginRight = canvasDiv.style.marginLeft;
		}
		else
		{
			// ...otherwise position them side by side
			// Make equation div fit into remaining horizontal space
			// Must take 17 pixels to account for a scrollbar
			equationDiv.style.width = document.body.offsetWidth - canvas.width - 2 * canvasDivPadding - 2 * equationDivPadding - 17;
			// Removes horizontal centering margins
			canvasDiv.style.margin = "0px";
		}
	};
	
	return self;
}();