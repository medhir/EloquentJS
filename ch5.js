var total = 0, count = 1;
while(count <= 10) {
	total += count;
	count += 1;
}
console.log(total);

//which is the same as...
console.log(sum(range(1,10)));

var range = function(a, b)
{
	var rangeArray = [];
	while(a <= b) {
		rangeArray.push(a);
		a += 1;
	}
	return rangeArray;
};

var sum = function(array) {
	var sumVal = 0;
	for(var i = 0; i < array.length; i++)
		sumVal += array[i];
	return sumVal;
};

//abstracting for loop that logs array contents to console
function logEach(array)
{
	for(var i = 0; i < array.length; i++)
		console.log(array[i]);
}

//further abstraction (action on array)
function forEach(array, action)
{
	for(var i = 0; i < array.length; i++)
		action(array[i]);
}

//summing numbers using forEach
var numbers = [1,2,3,4,5], sum = 0;
forEach(numbers, function(number) {
	sum += number;
});

/*
******* HIGHER ORDER FUNCTIONS **********

--> functions that operate on other functions, either by taking them as arguments, or returning them, 
are called higher-order functions. If you have already accepted the facts that functions are regular
values, there is nothing particularly remarkable about the fact that such funcitons exist. The term 
comes from mathematics, where the distinction between funcitons and other values is taken more seriously. 

Higher-order functions allow us to abstract over *actions*, not just values. They come in several forms. 
For example, you can have functions that create new functions. 
*/

function greaterThan(n) {
	return function(m) {
		return m > n;
	};
}

function addOne(num) {
	num += 1;
}

function noisy(f) {
	return function(arg) {
		console.log("calling with", arg);
		var val = f(arg);
		console.log("called with", arg, "- got", val);
	};
}

//functions that provide new types of control flow
function unless(test, then) {
	if(!test) then();
}

function repeat(times, body) {
	for (var i = 0; i < times; i++)
		body(i);
}

repeat(3, function(n) {
	unless(n % 2, function() {
		console.log(n, "is even");
	});
});

//filtering out elements in an array that don't pass a test
function filter(array, test) {
	var passed = [];
	for (var i = 0; i < array.length; i++) {
		if(test(array[i]))
			passed.push(array[i]);
	}

	return passed;
}

//map array using transform funcitons
function map(array, transform) {
	var mapped = [];
	for(var i = 0; i < array.length; i++)
		mapped.push(transform(array[i]));
	return mapped;
}

var overNinety = ancestry.filter(function(person) {
	return person.died - person.born > 90;
});

console.log(map(overNinety, function(person) {
	return person.name;
}));


//reducing array
function reduce(array, combine, start) {
	var current = start;
	for(var i = 0; i < array.length; i++)
		current = combine(current, array[i]);
	return current;
}

console.log(reduce([1,2,3,4], function(a, b) {
	return a + b;
}, 0));

//--> use to find oldest ancestor
console.log(ancestry.reduce(function(min, cur) {
	if(cur.born < min.born)
		return cur;
	else
		return min;
}));


//Higher-order functions start to shine when you need to compose functions

//finding the average age of ancestors
function average(array) {
	function plus(a, b) {return a+b;}
	return array.reduce(plus) / array.length;
}
function age(p) {return p.died - p.born;}
function male(p) {return p.sex == 'm';}
function female(p) {return p.sex == 'f';}

console.log(average(ancestry.filter(male).map(age)));
console.log(average(ancestry.filter(female).map(age)));


//Funciton to combine values from the two parents of a given person, and a default valu value)
function reduceAncestors(person, f, defaultValue) {
	function valueFor(person) {
		if(person == null)
			return defaultValue;
		else
			return f(person, valueFor(byName[person.mother]), 
				             valueFor(byName[person.father]));
	}
	return valueFor(person);
}

function sharedDNA(person, fromMother, fromFather) {
	if(person.name == "Pauwels van Haverbeke")
		return 1;
	else 
		return (fromMother + fromFather) / 2;
}

var ph = byName["Philibert Haverbeke"];
console.log(reduceAncestors(ph, sharedDNA, 0) / 4);

//build an object that associates names with people
var byName = {};
ancestry.forEach(function(person) {
	byName[person.name] = person;
});

console.log(byName['Philibert Haverbeke']);
// --> {name: "Philibert Haverbeke", ...}

function countAncestors(person, test) {
	function combine(person, fromMother, fromFather) {
		var thisOneCounts = test(person);
		return fromMother + fromFather + (thisOneCounts ? 1 : 0);
	}
	return reduceAncestors(person, combine, 0);
}

function longLivingPercentage(person) {
	var all = countAncestors(person, function(person) {
		return true;
	});

	var longLiving = countAncestors(person, function(person) {
		return (person.died - person.born) >= 70;
	});

	return longLiving / all;
}


/*
* BINDING
*/

//the bind method creates a new function that will call the original function, 
//but with some of the arguments already fixed




/*
* Exercise: Find the average life expectancies in the family tree, grouped by centuries
*/

function average(array) {
  function plus(a, b) { return a + b; }
  return array.reduce(plus) / array.length;
}

function groupBy(array, group) {
  var groups = {};
  for (var i = 0; i < array.length; i++)
  {
    if (groups[group(array[i])] == null)
      groups[group(array[i])] = [];
    groups[group(array[i])].push(array[i]);
  }
  return groups;
}

function centuries(person) {
  return Math.ceil(person.died / 100);
}

var lifeExpectancies = groupBy(ancestry, centuries);

for (var people in lifeExpectancies)
{
  console.log(people + ": " + average(lifeExpectancies[people].map(function(person) {
    return person.died - person.born;
  })));
}

/*
OUTPUT
--------------------------------
16: 43.5
17: 51.2
18: 52.78947368421053
19: 54.833333333333336
20: 84.66666666666667
21: 94
*/
