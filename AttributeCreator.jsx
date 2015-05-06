var React = require('react');

/**
 * Component to add attributes to a Hash or Array.
 * @param  {FreezerNode} root The parent to add the attribute.
 * @param  {string} attrkey Optional. If provided, the attribute added will have that key (arrays).
 *                           Otherwise an input will be shown to let the user define the key.
 */
var AttributeCreator = React.createClass({
	getInitialState: function(){
		return {
			creating: this.props.creating || false,
			attrkey: this.props.attrkey,
			type: 'string'
		};
	},

	render: function(){
		if( !this.state.creating )
			return <a href="#" onClick={this.handleCreate}>+ Add {this.props.type}</a>;

		var options = this.getTypes().map( function( type ){
				return <option value={type} key={type}>{ type[0].toUpperCase() + type.slice(1) }</option>;
			}),
			attrName
		;

		if( this.props.type == 'null' )
			attrName = '';
		else if( typeof this.props.attrkey != 'undefined' )
			attrName =  <span className="attrName">{this.props.attrkey}:</span>;
		else {
			attrName = [
				<input ref="keyInput" type="text" value={this.state.value} onChange={this.changeKey}/>,
				<span>:</span>
			];
		}

		return (
			<div className="hashAttribute">
				{ attrName }
				<select value={this.state.type} onChange={ this.changeType } ref="typeSelector">
					{options}
				</select>
				<button onClick={ this.createAttribute }>OK</button>
				<a href="#" className="cancelAttr" onClick={ this.handleCancel }>Cancel</a>
			</div>
		);
	},

	componentDidUpdate: function( prevProps, prevState){
		if( !prevState.creating && this.state.creating ){
			if( this.refs.keyInput )
				this.refs.keyInput.getDOMNode().focus();
			else
				this.refs.typeSelector.getDOMNode().focus();
		}
	},

	componentWillReceiveProps: function( newProps ){
		this.setState({attrkey: newProps.attrkey});
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
		this.setState({attrkey: e.target.value});
	},

	createAttribute: function(){
		var typeManager = require('./typeManager');

		this.setState({creating: false});

		var value = typeManager.components[ this.state.type ].prototype.defaultValue;

		this.props.onCreate( this.state.attrkey, value, {type: this.state.type });
	},

	getTypes: function(){
		var typeManager = require('./typeManager');
		return Object.keys( typeManager.components );
	}
});

module.exports = AttributeCreator;