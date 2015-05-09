var React = require('react'),
	objectAssign = require('object-assign')
;

/**
 * Property component that represent each Array element or Object property.
 * @param  {string} attrkey The key of the attribute in the parent.
 * @param  {Mixed} value The value of the attribute.
 * @param {Mixed} original The value of the attibute in the original json to highlight the changes.
 * @param {FreezerNode} parent The parent node to notify attribute updates.
 */
var Property = React.createClass({
	getDefaultProps: function(){
		return {
			definition: {}
		}
	},
	render: function(){
		var typeManager = require('./typeManager'),
			definition = this.props.definition || {},
			className = 'jsonProperty',
			type,	typeProperty, options
		;

		if( definition.type ){
			type = definition.type;
			// Add the property definitions to the options
			if( definition.properties )
				options = objectAssign({properties: definition.properties}, definition.options || {});
			else
				options = definition.options;
		}
		else{
			type = typeManager.guessType( this.props.value );
			options = definition.options;
		}

		typeProperty = typeManager.createProperty( type, this.props.value, options, this.props.attrkey, this.onUpdate );
		className += ' json_' + type;

		return React.DOM.div({className: className}, [
			React.DOM.a({href: '#', className: 'attrRemove', onClick: this.handleRemove}, 'x'),
			React.DOM.span({className: 'attrName'}, (definition.title || this.props.attrkey) + ':' ),
			React.DOM.span({className: 'attrValue'}, typeProperty )
		]);
	},

	handleRemove: function( e ){
		this.props.onDeleted( this.props.attrkey );
	},

	shouldComponentUpdate: function( nextProps, nextState ){
		return nextProps.value != this.props.value;
	},

	onUpdate: function( value ){
		this.props.onUpdated( this.props.attrkey, value );
	}
});

module.exports = Property;