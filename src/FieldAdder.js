var React = require('react'),
	TypeField = require('./TypeField'),
	createClass = require('create-react-class')
;

/**
 * Component to add fields to an Object or Array.
 * @param  {FreezerNode} root The parent to add the attribute.
 * @param  {string} name Optional. If provided, the attribute added will have that key (arrays).
 *                           Otherwise an input will be shown to let the user define the key.
 */
var FieldAdder = createClass({
	getInitialState: function(){
		return {
			creating: this.props.creating || false,
			name: this.props.name,
			type: 'string'
		};
	},

	render: function(){
		if( !this.state.creating )
			return React.createElement('a', { className: 'jsonAdd', href: '#', onClick: this.handleCreate }, this.props.text );

		var options = this.getTypes().map( function( type ){
				return React.createElement('option', {value: type, key: type}, type[0].toUpperCase() + type.slice(1));
			}),
			fieldName
		;

		if( typeof this.props.name != 'undefined' )
			fieldName =  [
				React.createElement('span', {className: 'jsonName'}, this.props.name),
				React.createElement('span', null, ':')
			];
		else {
			fieldName = [
				React.createElement('input', {ref: 'keyInput', type: 'text', value: this.state.value, onChange: this.changeKey}),
				React.createElement('span', null, ':')
			];
		}

		return React.createElement('div', {className: 'jsonField jsonFieldAdder'}, [
			fieldName,
			React.createElement('select', { key: 's', value: this.state.type, onChange: this.changeType, ref: 'typeSelector'}, options),
			React.createElement('button', { key: 'b', onClick: this.createField }, 'OK' ),
			React.createElement('a', { key: 'a', href: '#', className: 'cancelField', onClick: this.handleCancel}, 'Cancel')
		]);
	},

	componentDidUpdate: function( prevProps, prevState ){
		if( !prevState.creating && this.state.creating ){
			if( this.refs.keyInput )
				this.refs.keyInput.focus();
			else
				this.refs.typeSelector.focus();
		}
	},

	componentWillReceiveProps: function( newProps ){
		this.setState({name: newProps.name});
	},

	handleCreate: function( e ){
		e.preventDefault();
		this.setState({creating: true});
	},

	handleCancel: function( e ){
		e.preventDefault();
		this.setState({creating: false});
	},

	changeType: function( e ){
		this.setState({type: e.target.value});
	},

	changeKey: function( e ){
		this.setState({name: e.target.value});
	},

	createField: function(){
		this.setState({creating: false});

		var value = TypeField.prototype.components[ this.state.type ].prototype.defaultValue;

		this.props.onCreate( this.state.name, value, {type: this.state.type });
	},

	getTypes: function(){
		return Object.keys( TypeField.prototype.components );
	}
});

module.exports = FieldAdder;
