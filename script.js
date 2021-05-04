var gameStatus = {
	gridCells: 0,
	clickedCells: 0,
	bombCells: 0
}

// creating the grid
function createGrid() {
	var size = document.getElementById('cellNumberInput').value;
	gameStatus.gridCells = size * size

	var div = document.getElementsByClassName('gameBoardDiv')[0];
	var table = document.createElement('table');
	div.innerHTML = '';
	div.appendChild(table);
	addClickEvent()

	// inserting rows and cells
	for (var i = 0; i < size; ++i) {
		var tableRow = table.insertRow(i);
		for (var ii = 0; ii < size; ++ii) {
			var rowCell = tableRow.insertCell(ii);

			rowCell.id = (i + 1) * 100 + (ii + 1)

			assignBombs(rowCell)

			defaultCellStyle(rowCell)

			// we set the clickedCellvariable as the current cell
			rowCell.addEventListener('click', function (e) { clickedCell = e.target; })
			rowCell.addEventListener('auxclick', function (e) { clickedCell = e.target; })
		}
	}
}

function addClickEvent() {

	// left click
	window.addEventListener('click', function () {
		clickedCellStyle(parseInt(clickedCell.id))
		checkNearCells(parseInt(clickedCell.id))
		winGame()
	})

	// right click
	window.addEventListener('auxclick', function (e) {
		e.preventDefault()
		clickedCell.oncontextmenu = function (ee) {
			ee.preventDefault()
		}
		flaggedCellStyle(parseInt(clickedCell.id))
	})
}

function checkNearCells(currentId) {
	if (document.getElementById(currentId).innerHTML == -1) {
		loseGame(currentId)

	} else {
		/* 
		the possitions array represents the difference between 
		the id of the current cell and the id's of nearby cells
		*/
		var possitions = [-1, -101, -100, -99, 1, 101, 100, 99]
		var bombsNearby = 0

		for (let possition of possitions) {
			if (checkForBomb(currentId, possition)) {
				++bombsNearby
			}
		}

		/* displaying the number of nearby bombs */
		document.getElementById(currentId).innerHTML = bombsNearby

		/* we check near cells for bombs */
		//autoCheck(currentId, bombsNearby)
	}
}




/* 
recurrent function for checking near cells
Not tested yet!!

we must pass another parameter to the function (bombsNear)

*/


function checkCells2(Cell_Id, bombsNear) {
	if (bombsNear != 0) {
		return
	}

	let bombsNearby = 0 /* ??? */
	let near_possitions = [-1, -101, -100, -99, 1, 101, 100, 99]

	for (let possition of near_possitions) {
		if (checkForBomb(Cell_Id, possition)) {
			++ bombsNearby
		}
	}

	document.getElementById(Cell_Id).innerHTML = bombsNearby

	for (let possition of near_possitions) {
		checkCells2(Cell_Id + possition, bombsNearby)
		clickedCellStyle(Cell_Id + possition)
	}
}




// checking near cells for bombs and autoclicking them
/* 
it doesn't work!!
*/

function autoCheck(newCellId, bombs) {
	if (bombs != 0) {
		return
	}
	var possitions = [-1, -101, -100, -99, 1, 101, 100, 99]
	for (let possition of possitions) {
		checkNearCells(newCellId + possition)
		clickedCellStyle(newCellId + possition)
	}
}







function assignBombs(currentCell) {
	/* -1 are the bombs */
	let numberOfRows = document.getElementById('cellNumberInput').value
	currentCell.innerHTML = randomNumberGenerator(-1, numberOfRows)

	// save the number of bombs
	if (currentCell.innerHTML == -1) {
		++ gameStatus.bombCells
	}
}

function checkForBomb(cellId, position) {
	try {
		var bombIsNear = document.getElementById(cellId + position).innerHTML == -1
	} catch (error) {
		// nothing to do here
		// we just catch the error so that checkCells() continues
	}
	return bombIsNear;
}

function loseGame(cellId) {
	document.getElementById(cellId).style.backgroundColor = 'red'
	document.getElementById(cellId).style.color = 'red'
	alert('GAME OVER!')
	document.location.reload()
}

function winGame() {
	if (gameStatus.gridCells - gameStatus.clickedCells == gameStatus.bombCells) {
		alert('WIN!')
	}
}

function randomNumberGenerator(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function defaultCellStyle(rowCell) {
	rowCell.style.width = rowCell.style.height = '20px'
	rowCell.style.backgroundColor = 'gray'
	rowCell.style.color = 'gray'
}

function clickedCellStyle(cellId) {
	document.getElementById(cellId).style.backgroundColor = 'white'
	document.getElementById(cellId).style.color = 'black'
	++gameStatus.clickedCells
}

function flaggedCellStyle(cellId) {
	document.getElementById(cellId).style.backgroundColor = 'black'
	document.getElementById(cellId).style.color = 'black'
}