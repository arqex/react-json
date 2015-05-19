'use strict';

var React = require('react'),
	Property = require('../Property'),
	assign = require('object-assign'),
	CompoundPropertyMixin = require('../mixins/CompoundPropertyMixin')
;

/**
 * Component for editing an array.
 * @param  {FreezerNode} value The value of the array.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ArrayProperty = React.createClass({
	mixins: [CompoundPropertyMixin],

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			properties: this.state && this.state.properties || {}
		};
	},

	defaultValue: [],

	render: function(){
		var settings = this.props.settings,
			className = this.state.editing ? 'open jsonArray jsonCompound' : 'jsonArray jsonCompound',
			openArray = '',
			definitions = this.state.properties
		;

		var attrs = [],
			definition
		;
		for (var i = 0; i < this.props.value.length; i++) {
			definition = definitions[ i ] || {};
			if( !definition.settings )
				definition.settings = {};

			attrs.push( React.createElement( Property, {
				value: this.props.value[i],
				key: i,
				name: i,
				definition: definition,
				onUpdated: this.updateProperty,
				onDeleted: this.deleteProperty,
				parentSettings: this.props.settings
			}));
		}

		var openArrayChildren = [ attrs ];
		if( settings.adder !== false ){
			openArrayChildren.push( this.renderAdder( this.props.value.length ) );
		}

		openArray = React.DOM.div({ key:'o', className: 'jsonChildren' }, openArrayChildren );

		return React.DOM.span({className: className}, [
			this.renderHeader(),
			openArray
		]);
	},

	getDefaultHeader: function(){
		return 'List [' + this.props.value.length + ']';
	},

	getDefaultAdder: function(){
		return '+ Add element';
	},

	updateProperty: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteProperty: function( key ){
		this.props.value.splice( key, 1 );
	},

	isType: function( value ){
		return value && value.constructor == Array;
	}
});

module.exports = ArrayProperty;