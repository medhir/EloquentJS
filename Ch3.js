function multiplier(factor) {
	return function(number) {
		return number * factor;
	};
}

//recursive find 
function findSolution(target){
	function find(start, history) {
		if (start == target)
			return history;
		else if (start > target)
			return null;
		else 
			find(start + 5, "(" + history + " + 5)") ||
			find(start * 3, "(" + history + " * 3)");
	}
	return find(1, "1");
}

function printFarmInventory(cows, chickens) {
	var cowString = String(cows);
	while(cowString.length < 3)
		cowString = "0" + cowString;
	console.log(cowString + " Cows");

	var chickenString = String(chickens);
	while(chickenString)
}