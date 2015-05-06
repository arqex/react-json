var React = require('react'),
	Attribute = require('../Attribute'),
	AttributeCreator = require('../AttributeCreator')
;

/**
 * Component for editing an array.
 * @param  {FreezerNode} value The value of the array.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ArrayAttribute = React.createClass({
	getInitialState: function(){
		return { editing: false };
	},

	defaultValue: [],

	render: function(){
		var keys = Object.keys( this.props.value ),
			className = this.state.editing ? 'open arrayAttr compoundAttr' : 'arrayAttr compoundAttr',
			openArray = ''
		;

		var attrs = [];
		for (var i = 0; i < this.props.value.length; i++) {
			attrs.push(
				<Attribute
					value={this.props.value[i]}
					key={ i }
					attrkey={ i }
					onUpdated={ this.updateAttribute }
					onDeleted = { this.deleteAttribute } />
			);
		}

		openArray = (<div className="attrChildren">
			{ attrs }
			<AttributeCreator type="element" parent={ this.props.value } attrkey={ keys.length } onCreate={ this.createAttribute }/>
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

	updateAttribute: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteAttribute: function( key ){
		this.props.value.splice( key, 1 );
	},

	isType: function( value ){
		return value && value.constructor == Array;
	},

	createAttribute: function( key, value, definition ){

		if( this.props.value[ key ] )
			return console.log( 'Attribute ' + key + 'already exists.');

		this.props.value.set( key, value );
	}
});

module.exports = ArrayAttribute;