var React = require('react'),
	LeafMixin = require('../../mixins/LeafFieldMixin')
;


/**
 * Component for editing a string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
var StringField = React.createClass({
	mixins: [LeafMixin],
	typeClass: 'jsonString',
	inputType: 'text',
	defaultValue: '',

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	render: function(){
		return this.renderInput();
	},

	updateValue: function( e ){
		this.setState({ value: e.target.value });
	},

	isType: function( value ){
		return typeof value != 'object';
	}
});

module.exports = StringField;
