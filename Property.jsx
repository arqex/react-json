var React = require('react')
;

/**
 * Property component that represent each Array element or Object property.
 * @param  {string} attrkey The key of the attribute in the parent.
 * @param  {Mixed} value The value of the attribute.
 * @param {Mixed} original The value of the attibute in the original json to highlight the changes.
 * @param {FreezerNode} parent The parent node to notify attribute updates.
 */
var Property = React.createClass({
	render: function(){
		var typeManager = require('./typeManager'),
			typeProperty = typeManager.guessProperty( this.props.value, {}, this.props.attrkey, this.onUpdate ),
			className = 'hashProperty'
		;

		return (
			<div className={className}>
				<a href="#" className="attrRemove" onClick={ this.handleRemove }>x</a>
				<span className="attrName">{this.props.attrkey }:</span>
				<span className="attrValue">{ typeProperty }</span>
			</div>
		);
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