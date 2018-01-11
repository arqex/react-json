var React = require('react'),
	createClass = require('create-react-class');

/**
 * Component for editing a boolean.
 * @param  {string} value The value of the boolean.
 */
var SelectType = createClass({

	defaultValue: '',

	getInitialState: function(){
		return  {
			value: this.props.value
		};
	},

	render: function(){
		var className = 'jsonSelect';

		return React.createElement('select', {
			className: className,
			id: this.props.id,
			value: this.props.value,
			onChange: this.updateValue
		}, this.renderOptions() );
	},

	renderOptions: function(){
		var opts = this.props.settings.options,
			options = []
		;

		if( !opts || !opts.length )
			return options;

		opts.forEach( function( opt ){
			var data = opt;
			if( typeof opt != 'object' )
				data = { value: opt, label: opt };

			options.push(
				React.createElement('option', {value: data.value}, data.label)
			);
		});

		return options;
	},

	updateValue: function( e ){
		this.props.onUpdated( e.target.value );
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.value != nextProps.value )
			this.setState( { value: nextProps.value } );
	}
});

module.exports = SelectType;
