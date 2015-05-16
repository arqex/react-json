var React = require('react'),
	TypeProperty = require('./TypeProperty')
;

/**
 * Component to add properties to a Hash or Array.
 * @param  {FreezerNode} root The parent to add the attribute.
 * @param  {string} attrkey Optional. If provided, the attribute added will have that key (arrays).
 *                           Otherwise an input will be shown to let the user define the key.
 */
var PropertyCreator = React.createClass({
	getInitialState: function(){
		return {
			creating: this.props.creating || false,
			attrkey: this.props.attrkey,
			type: 'string'
		};
	},

	render: function(){
		if( !this.state.creating )
			return React.DOM.a({ href: '#', onClick: this.handleCreate }, '+ Add ' + this.props.type );

		var options = this.getTypes().map( function( type ){
				return React.DOM.option({value: type, key: type}, type[0].toUpperCase() + type.slice(1));
			}),
			attrName
		;

		if( this.props.type == 'null' )
			attrName = '';
		else if( typeof this.props.attrkey != 'undefined' )
			attrName =  React.DOM.span({className: 'attrName'}, this.props.attrkey);
		else {
			attrName = [
				React.DOM.input({ref: 'keyInput', type: 'text', value: this.state.value, onChange: this.changeKey}),
				React.DOM.span(null, ':')
			];
		}

		return React.DOM.div( {className: 'jsonProperty'}, [
			attrName,
			React.DOM.select({ value: this.state.type, onChange: this.changeType, ref: 'typeSelector'}, options),
			React.DOM.button({ onClick: this.createProperty }, 'OK' ),
			React.DOM.a({ href: '#', className: 'cancelAttr', onClick: this.handleCancel}, 'Cancel')
		]);
	},

	componentDidUpdate: function( prevProps, prevState ){
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

	createProperty: function(){
		this.setState({creating: false});

		var value = TypeProperty.prototype.components[ this.state.type ].prototype.defaultValue;

		this.props.onCreate( this.state.attrkey, value, {type: this.state.type });
	},

	getTypes: function(){
		return Object.keys( TypeProperty.prototype.components );
	}
});

module.exports = PropertyCreator;