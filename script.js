var gameStatus = {
	gridCells: 0,
	clickedCells: 0,
	bombCells: 0,
	gameboard_ids: [],
	searched_ids: [],
	ids_to_search: [],
	flagged_ids: []
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
			
			/* assigning cell id's and saving them in an array */
			rowCell.id = (i + 1) * 100 + (ii + 1)
			gameStatus.gameboard_ids.push(parseInt(rowCell.id))

			assignBombs(rowCell)

			defaultCellStyle(rowCell.id)

			// we set the clickedCellvariable as the current cell
			rowCell.addEventListener('click', function (e) { clickedCell = e.target; })
			rowCell.addEventListener('auxclick', function (e) { clickedCell = e.target; })
		}
	}
}

function addClickEvent() {

	// left click
	window.addEventListener('click', function () {
		gameStatus.ids_to_search.push(parseInt(clickedCell.id))
		checkCell()
		checkWin()
	})

	// right click
	window.addEventListener('auxclick', function (e) {
		e.preventDefault()
		clickedCell.oncontextmenu = function (ee) {
			ee.preventDefault()
		}
		flaggCell(parseInt(clickedCell.id))
	})
}


function checkCell() {
	/* user clicks a bomb cell */
	if (searchForBomb(gameStatus.ids_to_search[0])) {
		loseGame(gameStatus.ids_to_search[0])

	} else {

		/* checking if there are ids to be searched for */
		while (gameStatus.ids_to_search.length > 0) {

			/* the array represents the difference between the current cell ID and nearby cells ID */
			let near_cell_possitions = [-1, -101, -100, -99, 1, 101, 100, 99]
			let bombsNear = 0

			for (let possition of near_cell_possitions) {
				let new_id = gameStatus.ids_to_search[0] + possition
				if (searchForId(new_id)) {
					if (searchForBomb(new_id)) {
						++ bombsNear
					}
				}
			}

			/* display number of bombs nearby inside the cell*/
			if (bombsNear > 0) {
				document.getElementById(gameStatus.ids_to_search[0]).innerHTML = bombsNear
				clickedCellStyle(gameStatus.ids_to_search[0])
			}
			
			else {
				document.getElementById(gameStatus.ids_to_search[0]).innerHTML = ' '
				clickedCellStyle(gameStatus.ids_to_search[0])

				/* we add near cells id's to id's to search for if no bombs are nearby */
				for (let possition of near_cell_possitions) {
					var new_id = gameStatus.ids_to_search[0] + possition

					/* adding the new id to the array of id's to search for 
					if it is within the gameboard id's and hasn't been searched for yet  */
					if (searchForId(new_id) && !gameStatus.searched_ids.includes(new_id)) {
						gameStatus.ids_to_search.push(new_id)
						gameStatus.searched_ids.push(new_id)
					}
				}
			}

			/* removing the searched id */
			gameStatus.ids_to_search.shift()
		}
	}
}

function flaggCell(cell_id) {
	/* unflagging a cell */
	if (gameStatus.flagged_ids.includes(cell_id)) {
		gameStatus.flagged_ids.splice(gameStatus.flagged_ids.indexOf(cell_id), 1)
		defaultCellStyle(cell_id)
		
	/* flagging a cell */
	} else {
		gameStatus.flagged_ids.push(cell_id)
		flaggedCellStyle(cell_id)
	}
}

function assignBombs(currentCell) {
	/* -1 are the bombs */
	/* we can increase de difficulty of the game by changing number of rows */
	let numberOfRows = document.getElementById('cellNumberInput').value
	currentCell.innerHTML = randomNumberGenerator(-1, numberOfRows)

	/* save the number of bombs */
	if (currentCell.innerHTML == -1) {
		++gameStatus.bombCells
	}
}

function searchForId(cell_id) {
	return gameStatus.gameboard_ids.includes(cell_id)
}

function searchForBomb(cell_id) {
	return document.getElementById(cell_id).innerHTML == -1
}


function loseGame(cellId) {
	document.getElementById(cellId).style.backgroundColor = 'red'
	document.getElementById(cellId).style.color = 'red'
	alert('GAME OVER!')
	document.location.reload()
}

function checkWin() {
	if (gameStatus.gridCells - gameStatus.clickedCells == gameStatus.bombCells) {
		alert('WIN!')
	}
	console.log(gameStatus.gridCells)
}

function randomNumberGenerator(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function defaultCellStyle(cell_id) {
	document.getElementById(cell_id).style.width = '20px'
	document.getElementById(cell_id).style.height = '20px'
	document.getElementById(cell_id).style.backgroundColor = 'gray'
	document.getElementById(cell_id).style.color = 'gray'
}

function clickedCellStyle(cellId) {
	document.getElementById(cellId).style.backgroundColor = 'white'
	document.getElementById(cellId).style.color = 'black'
	++gameStatus.clickedCells
}

function flaggedCellStyle(cell_id) {
	document.getElementById(cell_id).style.backgroundColor = 'black'
	document.getElementById(cell_id).style.color = 'black'
}

