'use strict';

var React = require('react');

var components = {};
var typeCheckOrder = [];

var TypeProperty = React.createClass({
	components: {},
	typeCheckOrder: [],

	render: function() {

		var Component = this.getComponent();

		return React.createElement( Component, {
			value: this.props.value,
			settings: this.props.settings || {},
			onUpdated: this.props.onUpdated,
			ref: 'property'
		});
	},

	getComponent: function(){
		var type = this.props.type;
		if( !type )
			type = this.guessType( this.props.value );

		this.propertyType = type;

		return this.components[ type ];
	},

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

	getValidationErrors: function( jsonValue ){
		return this.refs.property.getValidationErrors( jsonValue );
	}
});

TypeProperty.registerType = function( name, Component, selectable ){
	var proto = TypeProperty.prototype;
	proto.components[ name ] = Component;
	if( selectable )
		proto.typeCheckOrder.unshift( name );
};

module.exports = TypeProperty;