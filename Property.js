'use strict';

var React = require('react'),
	objectAssign = require('object-assign'),
	Validation = require('./validation'),
	TypeProperty = require('./TypeProperty')
;

/**
 * Property component that represent each Array element or Object property.
 * @param  {string} name The key of the attribute in the parent.
 * @param  {Mixed} value The value of the attribute.
 * @param {Mixed} original The value of the attibute in the original json to highlight the changes.
 * @param {FreezerNode} parent The parent node to notify attribute updates.
 */
var Property = React.createClass({

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
			className = 'jsonProperty',
			type = definition.type || TypeProperty.prototype.guessType( this.props.value ),
			typeProperty = this.renderTypeProperty( type ),
			error = ''
		;

		className += ' ' + type + 'Property';

		if( this.state.error ){
			className += ' jsonError';
			error = React.DOM.span({ key:'e', className: 'jsonErrorMsg' }, this.state.error );
		}

		return React.DOM.div({className: className}, [
			React.DOM.span( {className: 'jsonName', key: 'n'}, [
				React.DOM.a({ key:'a', href: '#', className: 'jsonRemove', onClick: this.handleRemove}, 'x'),
				React.DOM.span({ key: 's1' }, (definition.title || this.props.name) + ':' )
			]),
			React.DOM.span( {className: 'jsonValue', key: 'v'}, [
				React.DOM.span({key:'s2'}, typeProperty )
			]),
			error
		]);
	},

	renderTypeProperty: function( type ){
		var definition = this.props.definition || {},
			settings = objectAssign( {}, definition.settings || {} ),
			component
		;

		if( definition.properties )
			settings.properties = definition.properties;

		component = React.createElement( TypeProperty, {
			type: type,
			value: this.props.value,
			settings: settings,
			onUpdated: this.onUpdated,
			ref: 'typeProperty',
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
			property = this.refs.typeProperty
		;

		if( property.propertyType == 'object' ){
			childErrors = property.getValidationErrors( jsonValue );
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

module.exports = Property;