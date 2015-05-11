// Create the dom before requiring react
var DOM = require( './testdom');
DOM();

var React = require('react'),
	ReactAddons    = require('react/addons'),
	Utils = React.addons.TestUtils,
	StringProperty = require('../types/StringProperty.jsx'),
	assert = require('assert')
;

var createInput = function( props ){
	document.body.innerHTML = '';

	props.onUpdated = function(){};

	React.render(
		React.createElement( StringProperty, props ),
		document.body
	);

	return document.body.children[0];
};

describe( 'String type property', function(){

	it( 'String editing=false', function(){
		var component = createInput({value: 'hola', options: {}} );
		assert( component );
		assert.equal( component.innerHTML, 'hola' );
	});

	it( 'String editing=true', function(){
		var component = createInput({value: 'hola', options: {editing: true}} );
		assert( component );
		assert.equal( component.tagName.toLowerCase(), 'input' );
		assert.equal( component.value, 'hola' );
	});

	it( 'String switch editing', function(){
		var component = createInput({value: 'hola', options: {}} );

		Utils.Simulate.click(component);

		var input = document.body.children[0];
		assert( input.tagName == 'INPUT' );
		assert.equal( input.value, 'hola' );

		Utils.Simulate.blur( input );

		var span = document.body.children[0];
		assert( span.tagName != 'INPUT' );
		assert.equal( span.innerHTML, 'hola' );
	});

	it( 'String editing=always', function(){
		var component = createInput({value: 'hola', options: {editing: 'always'}} );
		assert( component );
		assert.equal( component.tagName.toLowerCase(), 'input' );
		assert.equal( component.value, 'hola' );

		Utils.Simulate.blur( component );

		var input = document.body.children[0];
		assert( input.tagName == 'INPUT' );
		assert.equal( input.value, 'hola' );
	});



});

