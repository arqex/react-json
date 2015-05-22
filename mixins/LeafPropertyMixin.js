'use strict';

var React = require('react');

module.exports = {
	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			value: props.value
		};
	},

	renderInput: function(){
		var className = this.typeClass;

		if( !this.state.editing )
			return React.DOM.span( {onClick: this.setEditMode, className: className}, this.props.value );

		return React.DOM.input({
			type: this.inputType,
			value: this.state.value,
			placeholder: this.props.settings.placeholder || '',
			onChange: this.updateValue,
			onBlur: this.setValue,
			ref: 'input',
			onKeyDown: this.handleKeyDown
		});
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.value != nextProps.value )
			this.setState( { value: nextProps.value } );
		else if( this.props.settings.editing != nextProps.settings.editing )
			this.setState({ editing: nextProps.editing });
	},

	componentDidUpdate: function( prevProps, prevState ){
		if( this.state.editing && ! prevState.editing ){
			this.focus();
		}
	},

	componentDidMount: function(){
		if( this.state.editing )
			this.focus();
	},

	setEditMode: function(){
		this.setState({editing: true});
	},

	setValue: function(){
		if( this.state.editing != 'always' )
			this.setState({editing: false});
		this.props.onUpdated( this.state.value );
	},

	toggleEditing: function(){
		this.setState({ editing: !this.state.editing });
	},

	handleKeyDown: function( e ){
		if( e.which == 13 )
			this.setValue();
	},

	focus: function(){
		var node = this.refs.input.getDOMNode();
		node.focus();
		node.value = node.value;
	}
};