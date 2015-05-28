'use strict';

var React = require('react'),
	Field = require('../Field'),
	assign = require('object-assign'),
	CompoundFieldMixin = require('../../mixins/CompoundFieldMixin')
;

/**
 * Component for editing an array.
 * @param  {FreezerNode} value The value of the array.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ArrayField = React.createClass({
	mixins: [CompoundFieldMixin],

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			fields: this.state && this.state.fields || {}
		};
	},

	defaultValue: [],

	render: function(){
		var settings = this.props.settings,
			className = this.state.editing ? 'open jsonArray jsonCompound' : 'jsonArray jsonCompound',
			openArray = '',
			fixedFields = this.getFixedFields(),
			definitions = this.state.fields
		;

		var attrs = [],
			definition, fixed
		;
		for (var i = 0; i < this.props.value.length; i++) {
			definition = definitions[ i ] || {};
			if( !definition.settings )
				definition.settings = {};

			fixed = fixedFields === true || typeof fixedFields == 'object' && fixedFields[ i ];

			attrs.push( React.createElement( Field, {
				value: this.props.value[i],
				key: i,
				name: i,
				id: this.props.id,
				definition: definition,
				fixed: fixed,
				onUpdated: this.updateField,
				onDeleted: this.deleteField,
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

	updateField: function( key, value ){
		this.checkEditingSetting( key );
		this.props.value.set( key, value );
	},

	deleteField: function( key ){
		var fields = {};

		for( var index in this.state.fields ){
			if( index > key ){
				fields[ index - 1 ] = this.state.fields[ index ];
			}
			else if( index < key ){
				fields[ index ] = this.state.fields[ index ];
			}
			// If they are equal we are deleting the element, do nothing
		}

		this.props.value.splice( key, 1 );
		this.setState( { fields: fields } );
	},

	isType: function( value ){
		return value && value.constructor == Array;
	}
});

module.exports = ArrayField;
