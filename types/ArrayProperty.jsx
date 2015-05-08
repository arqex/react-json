var React = require('react'),
	Property = require('../Property'),
	PropertyCreator = require('../PropertyCreator'),
	assign = require('object-assign')
;

/**
 * Component for editing an array.
 * @param  {FreezerNode} value The value of the array.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ArrayProperty = React.createClass({
	getInitialState: function(){
		return assign({ editing: false }, this.getStateFromOptions( this.props.options ) );
	},

	getStateFromOptions: function( options ){
		return {
			options: options || {},
			properties: this.state && this.state.properties || {}
		};
	},

	defaultValue: [],

	render: function(){
		var keys = Object.keys( this.props.value ),
			className = this.state.editing ? 'open arrayAttr compoundAttr' : 'arrayAttr compoundAttr',
			openArray = '',
			definitions = this.state.properties
		;

		var attrs = [],
			definition
		;
		for (var i = 0; i < this.props.value.length; i++) {
			definition = definitions[ i ] || {};
			attrs.push(
				<Property
					value={this.props.value[i]}
					key={ i }
					attrkey={ i }
					definition={ definition }
					onUpdated={ this.updateProperty }
					onDeleted = { this.deleteProperty } />
			);
		}

		openArray = (<div className="attrChildren">
			{ attrs }
			<PropertyCreator type="element" parent={ this.props.value } attrkey={ keys.length } onCreate={ this.createProperty }/>
			</div>
		);

		return (<span className={ className }>
				<span onClick={this.toggleEditing} className="hashToggle">List [{keys.length}]</span>
				{openArray}
			</span>)
		;
	},
	toggleEditing: function(){
		this.setState({editing: !this.state.editing});
	},

	updateProperty: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteProperty: function( key ){
		this.props.value.splice( key, 1 );
	},

	isType: function( value ){
		return value && value.constructor == Array;
	},

	createProperty: function( key, value, definition ){

		if( this.props.value[ key ] )
			return console.log( 'Property ' + key + 'already exists.');

		// Start editing
		definition.editing = true;

		var properties = assign( {}, this.state.properties );
		properties[ key ] = definition;

		this.setState({properties: properties});
		this.props.value.set( key, value );
	}
});

module.exports = ArrayProperty;