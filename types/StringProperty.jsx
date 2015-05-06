var React = require('react');

/**
 * Component for editing a string.
 * @param  {string} value The value of the string.
 * @param  {Mixed} original The value of the component it the original json.
 * @param {FreezerNode} parent The parent node to let the string component update its value.
 */
var StringAttribute = React.createClass({
	getInitialState: function(){
		return {
			editing: !this.props.value,
			value: this.props.value
		};
	},

	defaultValue: '',

	render: function(){
		var className = 'stringAttr';

		if( !this.state.editing )
			return <span onClick={ this.setEditMode } className={ className }>{ this.props.value }</span>;

		return <input type="text" value={ this.state.value } onChange={ this.updateValue } onBlur={ this.setValue } ref="input" onKeyDown={this.handleKeyDown} />;
	},

	componentDidUpdate: function( prevProps, prevState ){
		if( this.state.editing && ! prevState.editing ){
			var node = this.refs.input.getDOMNode();
			node.focus();
			node.value = node.value;
		}
	},

	componentDidMount: function(){
		if( this.state.editing ){
			var node = this.refs.input.getDOMNode();
			node.focus();
			node.value = node.value;
		}
	},

	setEditMode: function(){
		this.setState({editing: true});
	},

	setValue: function(){
		this.setState({editing: false});
		this.props.onUpdated( this.state.value );
	},

	updateValue: function( e ){
		this.setState({ value: e.target.value });
	},

	handleKeyDown: function( e ){
		if( e.which == 13 )
			this.setValue();
	},
	toggleEditing: function(){
		this.setState({ editing: !this.state.editing });
	},

	isType: function( value ){
		return typeof value != 'object';
	}
});

module.exports = StringAttribute;