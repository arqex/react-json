'use strict';

var React = require('react'),
	objectAssign = require('object-assign'),
	Validation = require('./validation'),
	TypeProperty = require('./TypeProperty')
;

/**
 * Property component that represent each Array element or Object property.
 * @param  {string} attrkey The key of the attribute in the parent.
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

		className += ' json_' + type;

		if( this.state.error ){
			className += ' jsonError';
			error = React.DOM.span({ className: 'jsonErrorMsg' }, this.state.error );
		}

		return React.DOM.div({className: className}, [
			React.DOM.a({href: '#', className: 'attrRemove', onClick: this.handleRemove}, 'x'),
			React.DOM.span({className: 'attrName'}, (definition.title || this.props.attrkey) + ':' ),
			error,
			React.DOM.span({className: 'attrValue'}, typeProperty )
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
			ref: 'typeProperty'
		});
		return component;
	},

	handleRemove: function( e ){
		this.props.onDeleted( this.props.attrkey );
	},

	shouldComponentUpdate: function( nextProps, nextState ){
		return nextProps.value != this.props.value || nextState.error != this.state.error;
	},

	onUpdated: function( value ){
		this.props.onUpdated( this.props.attrkey, value );
	},

	getValidationErrors: function( jsonValue ){
		var childErrors = [],
			validates = this.props.definition.validates,
			attrkey = this.props.attrkey,
			property = this.refs.typeProperty
		;

		if( property.propertyType == 'object' ){
			childErrors = property.getValidationErrors( jsonValue );
			childErrors.forEach( function( error ){
				if( !error.path )
					error.path = attrkey;
				else
					error.path = attrkey + '.' + error.path;
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
				message = ( this.props.definition.title || this.props.attrkey ) + ' value is not valid.';

			error.path = attrkey;
			error.message = message;
			this.setState( {error: message} );
			childErrors = childErrors.concat( [error] );
		}

		return childErrors;
	}
});

module.exports = Property;