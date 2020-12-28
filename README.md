# AST Tree Query
This is a very small lib for searching nodes in a javascript AST with a very simple syntax and no other dependencies.

This project was created for working on javascript AST but can also be used to work with any javascript tree-like object. 

## Getting Started
Install using npm : 
```
npm install ast-tree-query
```

### Example
```javascript
const source = `
function a() {
	return 1 + 2;
}`;
const acorn = require("acorn");
const query = require("ast-tree-query");
const ast = acorn.parse(source, {ecmaVersion:2017});
console.log("Current node :", query(ast, "[.body][type=FunctionDeclaration & id.name=a][.body][.body][:first]"))
// Current node : 
// Node {
//    type: 'ReturnStatement',
//    start: 17,
//    end: 30,
//    argument:
//     Node {
//       type: 'BinaryExpression',
//       start: 24,
//       end: 29,
//       left: [Node],
//       operator: '+',
//       right: [Node] } }
```

## Querying language
### Selecting a property `[.propertyName]`
Get the value of a property.
```javascript
// ...
const tree = {propertyName:"value"}
query(tree, "[.propertyName]"); // "value"
```

### Selecting by index `[:first]` `[:last]` `[:nth=index]`
Get the first, last or nth element in the array. Similar to `array[n]`
```javascript
// ...
const tree = ["one", ["two", "tree"]];
query(tree, "[:last][:first]"); // "two"
query(tree, "[:nth=0]"); // "one"
```

### Filtering an array with property inside it `[property=value]`
Only keep elements with the property that is equal to the value. Similar to `array.filter((element) => element.property === "value")`.
```javascript
// ...
const tree = [{prop:"value1"}, {prop:"value2"}];
query(tree, "[prop=value1]"); // [{prop:"value1"}]
```

### Chaining query selectors
```javascript
// ...
const tree = [{property:"property1", values:[{value:"value1"}]}, {property:"property2", values:[{value:"value2"}, {value:"value3"}]}];
query(tree, "[property=property2][.values][:last]"); // "value3"
```

For querying an ast:
```javascript
const source = `
function a() {
	return 1 + 2;
}`;
const acorn = require("acorn");
const query = require("ast-tree-query");
const ast = acorn.parse(source, {ecmaVersion:2017});
console.log("Current node :", query(ast, "[.body][type=FunctionDeclaration & id.name=a][.body][.body][:nth=0]"))
// Current node : 
// Node {
//    type: 'ReturnStatement',
//    start: 17,
//    end: 30,
//    argument:
//     Node {
//       type: 'BinaryExpression',
//       start: 24,
//       end: 29,
//       left: [Node],
//       operator: '+',
//       right: [Node] } }
```

