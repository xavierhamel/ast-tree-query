# AST Tree Query
This is a very small lib for searching nodes in a javascript AST with a very simple syntax and no other dependencies.

This project was created for working on javascript AST but can also be used to work with any javascript tree-like object. 

## Getting Started
Install using npm : 
```
npm install ast-tree-query
```

#### Example
```javascript
const source = `
function a() {
	return 1 + 2;
}`;
const acorn = require("acorn");
const query = require("ast-tree-query");
const ast = acorn.parse(source, {ecmaVersion:2017});
console.log("Current node :", query(ast, "[.body][type=FunctionDeclaration & id.name=a][.body][.body]"))
// Current node : 
//[ Node {
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
//       right: [Node] } } ]
```

## Querying language
#### Selecting a property `[.propertyName]`
```javascript
// ...
const tree = {propertyName:"value"}
query(tree, "[.propertyName]"); // "value"
```

#### Selecting by index `[:first]` `[:last]` `[:nth=index]`
```javascript
// ...
const tree = ["one", ["two", "tree"]];
query(tree, "[:last][:first]"); // "two"
```

#### Filtering an array with property inside it `[property=value]`
```javascript
// ...
const tree = [{property:"value1"}, {property:"value2"}];
query(tree, "[property=value1]"); // {property:"value1"}
```

#### Chaining query selectors
```javascript
const source = `
function a() {
	return 1 + 2;
}`;
const acorn = require("acorn");
const query = require("ast-tree-query");
const ast = acorn.parse(source, {ecmaVersion:2017});
console.log("Current node :", query(ast, "[.body][type=FunctionDeclaration & id.name=a][.body][.body]"))
// Current node : 
//[ Node {
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
//       right: [Node] } } ]
```

