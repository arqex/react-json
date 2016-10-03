'use strict';

var React = require('react'),
	Field = require('../Field'),
	assign = require('object-assign'),
	CompoundFieldMixin = require('../../mixins/CompoundFieldMixin')
;

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectField = React.createClass({
	mixins: [CompoundFieldMixin],

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			fields: assign({}, props.settings && props.settings.fields || {})
		};
	},

	defaultValue: {},

	render: function(){
		var me = this,
			settings = this.props.settings,
			className = this.state.editing || settings.header === false ? 'open jsonObject jsonCompound' : 'jsonObject jsonCompound',
			openHash = '',
			definitions = this.state.fields,
			attrs = [],
			value = assign({}, this.props.value ),
			fixedFields = this.getFixedFields(),
			hidden = this.getHiddenFields(),
			groupCount = 0,
			definition
		;

		this.getFieldOrder().forEach( function( field ){
			// If the field is an array handle grouping
			if( field.constructor === Array ) {
				attrs.push( me.renderGroup( field, fixedFields, ++groupCount ) );
			}
			else if( !hidden[ field ] ) {
				attrs.push( me.renderField( field, fixedFields ) );
			}
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

	renderField: function( key, fixedFields ){
		var value = this.props.value[ key ],
			definition = this.state.fields[ key ] || {},
			fixed = fixedFields === true || typeof fixedFields == 'object' && fixedFields[ key ]
		;

		if( !definition.settings )
			definition.settings = {};

		return React.createElement( Field, {
			value: value,
			key: key,
			name: key,
			ref: key,
			fixed: fixed,
			id: this.props.id,
			definition: definition,
			onUpdated: this.updateField,
			onDeleted: this.deleteField,
			parentSettings: this.props.settings
		});
	},

	renderGroup: function( fieldNames, fixedFields, groupNumber ){
		var me = this,
			fields = []
		;

		fieldNames.forEach( function( field ){
			fields.push( me.renderField( field, fixedFields ) );
		});

		return React.DOM.div({ className: 'jsonGroup jsonGroup_' + groupNumber }, fields );
	},

	getDefaultHeader: function(){
		return 'Map [' + Object.keys( this.props.value ).length + ']';
	},

	getDefaultAdder: function(){
		return '+ Add field';
	},

	updateField: function( key, value ){
		this.checkEditingSetting( key );
		this.props.value.set( key, value );
	},

	deleteField: function( key ){
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

	getFieldOrder: function(){
		var me = this,
			settingsOrder = this.props.settings.order,
			orderType = typeof settingsOrder,
			fields = this.props.settings.fields || {},
			group
		;

		if( !settingsOrder || (orderType != 'function' && settingsOrder.constructor !== Array) )
			return Object.keys( this.props.value );

		var value = assign( {}, this.props.value ),
			order = []
		;

		if( orderType == 'function' )
			return settingsOrder( value );

		// Add fields in the array
		if( settingsOrder.constructor === Array ){
			settingsOrder.forEach( function( field ){

				// An array, handle group
				if( field.constructor == Array ){
					group = [];
					field.forEach( function( groupField ){
						if( me.addFieldToOrder( groupField, value, fields ) ){
							group.push( groupField );

							// Delete them from current values
							delete value[ groupField ];
						}
					});
					if( group.length )
						order.push( group );
				}
				else if( me.addFieldToOrder( field, value, fields ) ){
					order.push( field );

					// Delete them from current values
					delete value[ field ];
				}
			});
		}

		// Add the keys left in the value
		for( var key in value ){
			if( order.indexOf( key ) == -1 )
				order.push( key );
		}

		return order;
	},

	/**
	 * Checks when a field that appears in the sort settings needs to be added to
	 * the fieldOrder array
	 *
	 * @param {String} field The field name
	 */
	addFieldToOrder: function( field, value, fields ){
		return typeof value[ field ] != 'undefined' || fields[ field ] && fields[ field ].type == 'react';
	},

	getHiddenFields: function(){
		var hidden = this.props.settings.hiddenFields,
			fields = {}
		;
		if( !hidden )
			return fields;

		hidden.forEach( function( f ){
			fields[ f ] = 1;
		});

		return fields;
	}
});

module.exports = ObjectField;
