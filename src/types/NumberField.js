var React = require('react'),
	LeafMixin = require('../../mixins/LeafFieldMixin')
;

/**
 * Component for editing a number.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
var NumberField = React.createClass({
	mixins: [LeafMixin],
	typeClass: 'jsonNumber',
	inputType: 'number',
	defaultValue: '',

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	render: function(){
		return this.renderInput();
	},

	updateValue: function( e ){
		this.setState({ value: parseFloat( e.target.value ) });
	},

	isType: function( value ){
		return typeof value == 'number';
	}
});

module.exports = NumberField;
