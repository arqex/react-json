'use strict';

var React = require('react'),
	ObjectProperty = require('./types/ObjectProperty'),
	ArrayProperty = require('./types/ArrayProperty'),
	StringProperty = require('./types/StringProperty'),
	BooleanProperty = require('./types/BooleanProperty'),
	NumberProperty = require('./types/NumberProperty')
;

module.exports = {

	components: {
		boolean: BooleanProperty,
		number: NumberProperty,
		array: ArrayProperty,
		string: StringProperty,
		object: ObjectProperty
	},

	typeCheckOrder: [ 'boolean', 'number', 'string', 'array' ],

	guessType: function( value ){

		var type = false,
			i = 0,
			types = this.typeCheckOrder
		;

		while( !type && i < types.length ){
			if( this.components[ types[i] ].prototype.isType( value ) )
				type = types[i++];
			else
				i++;
		}

		return type || 'object';
	},

	guessProperty: function( value, key, updateHandler ){
		console.log( value );
		return this.createProperty( this.guessType( value ), value, {}, key, updateHandler );
	},

	createProperty: function( type, value, options, key, updateHandler ){
		return React.createElement( this.components[ type ], {
			value: value,
			attrkey: typeof key != 'undefined' ? key : '',
			options: options || {},
			onUpdated: updateHandler
		});
	}
};