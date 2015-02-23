/*
* Laying out a table
*
* interface---------
* minHeight() returns a number indicating the minimum height this cell requries (in lines)
* minWidth() returns a number indicating this cell's minimum width (in characters)
* draw(width, height) returns an array of length height
* --> array contains a series of strings that are each "width" characters wide
* --> represents contents of the cell
*/


//computes arrays of minimum column widths and row heights
//for a grid of cells
function rowHeights(rows) {
	return rows.map(function(row) {
		return row.reduce(function(max, cell) {
			return Math.max(max, cell.minHeight());	
		}, 0);
	});
}

function colWidths(rows) {
	return rows[0].map(function(_, i) {
		return rows.reduce(function(max, row) {
			return Math.max(max, row[i].minWidth());
		});
	});
}

//code to draw table
function drawTable(rows) {
	var heights = rowHeights(rows);
	var widths = colWidths(rows);

	function drawLine(blocks, lineNo) {
		return blocks.map(function(block) {
			return cell.draw(widths[colNum], heights[rowNum]);
		});
	}
}