var React = require('react'),
	Attribute = require('../Attribute'),
	AttributeCreator = require('../AttributeCreator')
;

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectAttribute = React.createClass({
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
				<Attribute
					value={this.props.value[attr]}
					key={ attr }
					attrkey={ attr }
					onUpdated={ this.updateAttribute }
					onDeleted = { this.deleteAttribute } />
			);
		}

		openHash = (<div className="attrChildren">
			{ attrs }
			<AttributeCreator type="attribute" onCreate={ this.createAttribute } />
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

	updateAttribute: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteAttribute: function( key ){
		this.props.value.remove( key );
	},

	createAttribute: function( key, value, definition ){

		if( this.props.value[ key ] )
			return console.log( 'Attribute ' + key + 'already exists.');

		this.props.value.set( key, value );
	}
});

module.exports = ObjectAttribute;