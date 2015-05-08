var React = require('react'),
	Property = require('../Property'),
	PropertyCreator = require('../PropertyCreator'),
	assign = require('object-assign')
;

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectProperty = React.createClass({
	getInitialState: function(){

		return assign( {editing: false}, this.getStateFromOptions( this.props.options ) );
	},

	getStateFromOptions: function( options ){
		var ops = assign( {}, options || {}),
			state = {
				properties: ops.properties || {}
			}
		;

		delete ops.properties;

		state.options = ops;

		return state;
	},

	defaultValue: {},

	render: function(){
		var keys = Object.keys( this.props.value ),
			className = this.state.editing ? 'open objectAttr compoundAttr' : 'objectAttr compoundAttr',
			openHash = '',
			definitions = this.state.properties
		;

		var attrs = [],
			definition
		;
		for( var attr in this.props.value ){
			definition = definitions[ attr ] || {};
			attrs.push(
				<Property
					value={this.props.value[attr]}
					key={ attr }
					attrkey={ attr }
					definition={ definition }
					onUpdated={ this.updateProperty }
					onDeleted = { this.deleteProperty } />
			);
		}

		openHash = (<div className="attrChildren">
			{ attrs }
			<PropertyCreator type="attribute" onCreate={ this.createProperty } />
		</div>);

		var header = this.props.options.header || 'Map [' + keys.length + ']';
		return (<span className={ className }>
				<span onClick={ this.toggleEditing } className="hashToggle">{ header }</span>
				{openHash}
			</span>)
		;
	},

	toggleEditing: function(){
		this.setState({ editing: !this.state.editing });
	},

	updateProperty: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteProperty: function( key ){
		this.props.value.remove( key );
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

module.exports = ObjectProperty;