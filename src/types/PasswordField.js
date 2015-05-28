var React = require('react'),
	LeafMixin = require('../../mixins/LeafFieldMixin')
;


/**
 * Component for editing a password.
 * @param  {string} value The value of the password.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the password component update its value.
 */
var PasswordField = React.createClass({
	mixins: [LeafMixin],
	typeClass: 'jsonPassword',
	inputType: 'password',
	defaultValue: '',

	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	render: function(){
		return this.renderInput();
	},

	getDisplayModeString: function(){
		return this.getWildcards();
	},

	getWildcards: function(){
		var out = '';
		for (var i = this.state.value.length - 1; i >= 0; i--) {
			out += '*';
		}
		return out;
	},

	isType: function(){
		return false;
	},

	updateValue: function( e ){
		this.setState({ value: e.target.value });
	}
});

module.exports = PasswordField;
