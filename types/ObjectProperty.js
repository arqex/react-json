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
		var me = this,
			settings = this.props.settings,
			className = this.state.editing || settings.header === false ? 'open jsonObject jsonCompound' : 'jsonObject jsonCompound',
			openHash = '',
			definitions = this.state.properties,
			attrs = [],
			value = assign({}, this.props.value ),
			definition
		;

		this.getPropertyOrder().forEach( function( propertyName ){
			attrs.push( me.renderProperty( propertyName ));
		});

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

	renderProperty: function( key ){
		var value = this.props.value[ key ],
			definition = this.state.properties[ key ] || {}
		;

		if( !definition.settings )
			definition.settings = {};

		return React.createElement( Property, {
			value: value,
			key: key,
			name: key,
			ref: key,
			definition: definition,
			onUpdated: this.updateProperty,
			onDeleted: this.deleteProperty,
			parentSettings: this.props.settings
		});
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
	},

	getPropertyOrder: function(){
		var settingsOrder = this.props.settings.order,
			orderType = typeof settingsOrder
		;

		if( !settingsOrder || (orderType != 'function' && settingsOrder.constructor !== Array) )
			return Object.keys( this.props.value );

		var value = assign( {}, this.props.value ),
			order = []
		;

		if( orderType == 'function' )
			return settingsOrder( value );

		// Add properties in the array
		if( settingsOrder.constructor === Array ){
			settingsOrder.forEach( function( name ){
				if( typeof value[ name ] != 'undefined' ){
					order.push( name );

					// Delete them from current values
					delete value[ name ];
				}
			});
		}

		// Add the keys left in the value
		for( var key in value ){
			if( order.indexOf( key ) == -1 )
				order.push( key );
		}

		return order;
	}
});

module.exports = ObjectProperty;