// [type=FunctionDeclaration & id.name=identifier] => If in an array, select all the element with that type and that name
// [:nth=0] => If in an array, select the first element
// [:last] => If in an array, select the last element
// [:first] => If in an array, select the first element
// [type=FunctionDeclaration][:first] => Select the first function declaration
// [type=FunctionDeclaration][.body][:first] => Select the first element in the body
//
function query (ast, query) {
	// Match every group of brackets [...]
	let regex = /\[.*?\]/g;
	let match;

	let current = ast;
	while ((match = regex.exec(query)) !== null) {
		let q = match[0].substring(1, match[0].length - 1);

		if (q.startsWith(".")) {
			current = updateWithProperty(current, q);
		} else {
			// First check if we are currently in an array, these selectors
			// only works with array
			if (Array.isArray(current)) {
				if (q.startsWith(":")) {
					current = updateWithIndex(current, q);
				} else {
					let filters = getFilters(q);
					// applying the filters on the current node
					current = updateWithFilters(current, filters);
				}
			} else {
				throw new Error(`${q} must be called for an array but the selected element in the ast is not an array`);
			}
		}
	}

	function updateWithProperty (node, query) {
		// removing the dot
		query = query.substring(1, query.length);
		// If only one element is in the array, select it.
		if (Array.isArray(node) && node.length === 1) {
			node = node[0];
		}
		// Checking if the property exist
		if (query in node) {
			return node[query];
		} else {
			throw new Error(`The property ${query} does not exist in the current object`);
		}
	}

	function updateWithIndex (nodes, query) {
		query = query.substring(1, query.length);
		switch (query) {
			case "first":
				return nodes[0]
				break;
			case "last":
				return nodes[nodes.length - 1]
				break;
			default:
				if (query.startsWith("nth")) {
					query = query.split("=");
					if (query.length > 1) {
						let index = parseInt(query[1]);
						if (!isNaN(index)) {
							if (index < nodes.length) {
								 return nodes[index]
							} else {
								throw new Error(`The index is out of bound. ${index} was specified but the length is ${nodes.length}`);
							}
						} else {
							throw new Error("The index specified with nth must be a number");
						}
					} else {
						throw new Error("An index must be specified with nth");
					}
				} else {
					throw new Error(`:${query} is not a valid query. (:frist, :last or :nth=n)`);
				}
		}
	}

	function getFilters (query) {
		let filters = query.split(/\s*\&\s*/);
		return filters.map(filter => {
			// Split the property and the value (property=value)
			filter = filter.split("=");
			if (filter.length === 2) {
				// Split the property name if multiple members (id.property)
				filter[0] = filter[0].split(".");
				return filter;
			} else {
				throw new Error(`Filter must be in this format : property=value_to_filter.`);
			}
		});
	}

	function updateWithFilters (nodes, filters) {
		return nodes.filter(node => {
			let isFiltered = true;
			// applying each filters
			filters.forEach((filter, index) => {
				let [properties, value] = filter;
				// Work on a temporary node.
				let tmpNode = node;
				properties.forEach((property, index) => {
					if (properties.length - 1 > index) {
						if (property in node) {
							tmpNode = tmpNode[property];
						} else {
							isFiltered = false;
						}
					} else {
						if (isFiltered) {
							if (typeof tmpNode[property] === "number") {
								isFiltered = isFiltered && tmpNode[property] === parseInt(value);
							} else {
								isFiltered =  isFiltered && tmpNode[property] === value;
							}
						}
					}
				});
			});
			return isFiltered;
		});
	}
	return current;
}

module.exports = query;



//query([{type:"FunctionDeclaration", id:{name:"identifier"}, body:"YESS"},{type:"FunctionDeclaration", id:{name:"identifier"}, body:"YESS2"}], "[type=FunctionDeclaration & id.name=identifier][:last][.body]");
