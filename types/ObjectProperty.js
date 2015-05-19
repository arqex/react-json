'use strict';

var React = require('react'),
	Property = require('../Property'),
	assign = require('object-assign'),
	CompoundPropertyMixin = require('../mixins/CompoundPropertyMixin')
;

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectProperty = React.createClass({
	mixins: [CompoundPropertyMixin],

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			properties: assign({}, props.settings && props.settings.properties || {})
		};
	},

	defaultValue: {},

	render: function(){
		var settings = this.props.settings,
			className = this.state.editing || settings.header === false ? 'open jsonObject jsonCompound' : 'jsonObject jsonCompound',
			openHash = '',
			definitions = this.state.properties,
			attrs = [],
			definition
		;

		for( var attr in this.props.value ){
			definition = definitions[ attr ] || {};
			if( !definition.settings )
				definition.settings = {};

			//this.addDeepSettings( definition.settings );

			attrs.push( React.createElement( Property, {
				value: this.props.value[attr],
				key: attr,
				name: attr,
				ref: attr,
				definition: definition,
				onUpdated: this.updateProperty,
				onDeleted: this.deleteProperty,
				parentSettings: settings
			}));
		}

		var openHashChildren = [ attrs ];
		if( settings.adder !== false ){
			openHashChildren.push( this.renderAdder() );
		}

		openHash = React.DOM.div({ key: 'o', className: 'jsonChildren'}, openHashChildren);
		return React.DOM.span({className: className}, [
			this.renderHeader(),
			openHash
		]);
	},

	getDefaultHeader: function(){
		return 'Map [' + Object.keys( this.props.value ) + ']';
	},

	getDefaultAdder: function(){
		return '+ Add property';
	},

	updateProperty: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteProperty: function( key ){
		this.props.value.remove( key );
	},

	getValidationErrors: function( jsonValue ){
		var me = this,
			errors = [],
			attrs = Object.keys( this.refs )
		;

		attrs.forEach( function( attr ){
			var error = me.refs[attr].getValidationErrors();
			if( error )
				errors = errors.concat( error );
		});

		return errors;
	}
});

module.exports = ObjectProperty;