'use strict';

var React = require('react'),
	ObjectAttribute = require('./types/ObjectAttribute'),
	ArrayAttribute = require('./types/ArrayAttribute'),
	StringAttribute = require('./types/StringAttribute'),
	BooleanAttribute = require('./types/BooleanAttribute'),
	NumberAttribute = require('./types/NumberAttribute')
;

module.exports = {

	components: {
		boolean: BooleanAttribute,
		number: NumberAttribute,
		array: ArrayAttribute,
		string: StringAttribute,
		object: ObjectAttribute
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

	guessAttribute: function( value, options, key, updateHandler ){
		console.log( value );
		return this.createAttribute( this.guessType( value ), value, {}, key, updateHandler );
	},

	createAttribute: function( type, value, options, key, updateHandler ){
		return React.createElement( this.components[ type ], {
			value: value,
			attrkey: typeof key != 'undefined' ? key : '',
			options: options || {},
			onUpdated: updateHandler
		});
	}
};