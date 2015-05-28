'use strict';

var React = require('react'),
	objectAssign = require('object-assign'),
	Validation = require('./validation'),
	TypeField = require('./TypeField')
;

/**
 * Field component that represent each Array element or Object field.
 * @param  {string} name The key of the attribute in the parent.
 * @param  {Mixed} value The value of the attribute.
 * @param {Mixed} original The value of the attibute in the original json to highlight the changes.
 * @param {FreezerNode} parent The parent node to notify attribute updates.
 */
var Field = React.createClass({

	getInitialState: function(){
		return {error: false};
	},
	getDefaultProps: function(){
		return {
			definition: {}
		};
	},
	render: function(){
		var definition = this.props.definition || {},
			className = 'jsonField',
			type = definition.type || TypeField.prototype.guessType( this.props.value ),
			id = this.props.id + '_' + this.props.name,
			typeField = this.renderTypeField( type, id ),
			error = ''
		;

		className += ' ' + type + 'Field';

		if( this.state.error ){
			className += ' jsonError';
			error = React.DOM.span({ key:'e', className: 'jsonErrorMsg' }, this.state.error );
		}

		var jsonName = [ React.DOM.label({ key: 's1', htmlFor: id }, (definition.title || this.props.name) + ':' ) ];

		if( this.props.fixed ){
			// If the field cannot be removed, add a placeholder to maintain the design
			jsonName.unshift( React.DOM.span({ key:'f', className: 'jsonFixed' }) );
		}
		else{
			jsonName.unshift( React.DOM.a({ key:'a', href: '#', className: 'jsonRemove', onClick: this.handleRemove}, 'x') );
		}

		return React.DOM.div({className: className}, [
			React.DOM.span( {className: 'jsonName', key: 'n'}, [
				jsonName
			]),
			React.DOM.span( {className: 'jsonValue', key: 'v'}, [
				React.DOM.span({key:'s2'}, typeField )
			]),
			error
		]);
	},

	renderTypeField: function( type, id ){
		var definition = this.props.definition || {},
			settings = objectAssign( {}, definition.settings || {} ),
			component
		;

		if( definition.fields )
			settings.fields = definition.fields;

		component = React.createElement( TypeField, {
			type: type,
			value: this.props.value,
			settings: settings,
			onUpdated: this.onUpdated,
			ref: 'typeField',
			id: id,
			parentSettings: this.props.parentSettings
		});
		return component;
	},

	handleRemove: function( e ){
		this.props.onDeleted( this.props.name );
	},

	shouldComponentUpdate: function( nextProps, nextState ){
		return nextProps.value != this.props.value || nextState.error != this.state.error;
	},

	onUpdated: function( value ){
		this.props.onUpdated( this.props.name, value );
	},

	getValidationErrors: function( jsonValue ){
		var childErrors = [],
			validates = this.props.definition.validates,
			name = this.props.name,
			field = this.refs.typeField
		;

		if( field.fieldType == 'object' ){
			childErrors = field.getValidationErrors( jsonValue );
			childErrors.forEach( function( error ){
				if( !error.path )
					error.path = name;
				else
					error.path = name + '.' + error.path;
			});
		}

		if( !validates )
			return childErrors;


		var error = Validation.getValidationError( this.props.value, jsonValue, validates ),
			message
		;

		if( error ){
			message = this.props.definition.errorMessage;
			if( !message )
				message = ( this.props.definition.title || this.props.name ) + ' value is not valid.';

			error.path = name;
			error.message = message;
			this.setState( {error: message} );
			childErrors = childErrors.concat( [error] );
		}
		else if( this.state.error ){
			this.setState( {error: false} );
		}

		return childErrors;
	}
});

module.exports = Field;
