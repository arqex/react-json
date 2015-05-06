var React = require('react'),
	Property = require('../Property'),
	PropertyCreator = require('../PropertyCreator')
;

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectProperty = React.createClass({
	getInitialState: function(){
		return { editing: false };
	},

	defaultValue: {},

	render: function(){
		var keys = Object.keys( this.props.value ),
			className = this.state.editing ? 'open objectAttr compoundAttr' : 'objectAttr compoundAttr',
			openHash = ''
		;

		var attrs = [];
		for( var attr in this.props.value ){
			attrs.push(
				<Property
					value={this.props.value[attr]}
					key={ attr }
					attrkey={ attr }
					onUpdated={ this.updateProperty }
					onDeleted = { this.deleteProperty } />
			);
		}

		openHash = (<div className="attrChildren">
			{ attrs }
			<PropertyCreator type="attribute" onCreate={ this.createProperty } />
		</div>);

		return (<span className={ className }>
				<span onClick={ this.toggleEditing } className="hashToggle">Map [{ keys.length }]</span>
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

		this.props.value.set( key, value );
	}
});

module.exports = ObjectProperty;