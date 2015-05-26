var React = require('react'),
	FieldCreator = require('../FieldCreator')
;

/**
 * Component for editing a string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
var NullField = React.createClass({
	getInitialState: function(){
		return {
			editing: !this.props.value,
			value: this.props.value
		};
	},

	defaultValue: null,

	render: function(){
		var className = 'nullAttr';

		if( !this.state.editing )
			return <span onClick={ this.setEditMode } className={ className }>null</span>;

		return <FieldCreator type="null" onCreate={ this.onTypeSelected } onCancel={ this.onCancel } />;
	},

	setEditMode: function(){
		this.setState({editing: true});
	},

	onTypeSelected: function( key, value, options ){
		this.props.onUpdate( value, options );
	},

	onCancel: function(){
		this.setState({editing: false});
	},

	isType: function( value ){
		return value === null;
	}
});

module.exports = NullField;
