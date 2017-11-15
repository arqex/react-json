var React = require('react'),
	createClass = require('create-react-class');

/**
 * Component for editing a boolean.
 * @param  {string} value The value of the boolean.
 */
var BooleanField = createClass({

	defaultValue: false,

	render: function(){
		var className = 'jsonBoolean';

		return React.DOM.input({
			type: "checkbox",
			className: className,
			id: this.props.id,
			checked: this.props.value,
			onChange: this.updateValue
		});
	},

	updateValue: function( e ){
		this.props.onUpdated( e.target.checked );
	},

	isType: function( value ){
		return typeof value == 'boolean';
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.value != nextProps.value )
			this.setState( { value: nextProps.value } );
	}
});

module.exports = BooleanField;
