var React = require('react'),
	Property = require('../Property'),
	PropertyCreator = require('../PropertyCreator'),
	assign = require('object-assign')
;

/**
 * Component for editing an array.
 * @param  {FreezerNode} value The value of the array.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ArrayProperty = React.createClass({
	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			properties: this.state && this.state.properties || {}
		};
	},

	defaultValue: [],

	render: function(){
		var keys = Object.keys( this.props.value ),
			className = this.state.editing ? 'open arrayAttr compoundAttr' : 'arrayAttr compoundAttr',
			openArray = '',
			definitions = this.state.properties
		;

		var attrs = [],
			definition
		;
		for (var i = 0; i < this.props.value.length; i++) {
			definition = definitions[ i ] || {};
			if( !definition.settings )
				definition.settings = {};
			if( typeof definition.settings.editing == 'undefined' && this.state.editing == 'always' )
				definition.settings.editing = 'always';

			attrs.push( React.createElement( Property, {
				value: this.props.value[i],
				key: i,
				attrkey: i,
				definition: definition,
				onUpdated: this.updateProperty,
				onDeleted: this.deleteProperty
			}));
		}

		openArray = React.DOM.div({ className: 'attrChildren'}, [
			attrs,
			React.createElement( PropertyCreator, {
				type: 'element',
				attrkey: keys.length,
				onCreate: this.createProperty
			})
		]);

		return React.DOM.span({className: className}, [
			React.DOM.span({ onClick: this.toggleEditing, className: 'hashToggle' }, 'List [' + keys.length + ']'),
			openArray
		]);
	},
	toggleEditing: function(){
		if( this.state.editing != 'always' )
			this.setState({editing: !this.state.editing});
	},

	updateProperty: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteProperty: function( key ){
		this.props.value.splice( key, 1 );
	},

	isType: function( value ){
		return value && value.constructor == Array;
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.editing != nextProps.editing )
			this.setState({ editing: nextProps.editing });
	},

	createProperty: function( key, value, definition ){

		if( this.props.value[ key ] )
			return console.log( 'Property ' + key + 'already exists.');

		// Start editing
		definition.settings = {editing: this.state.editing == 'always' ? 'always' : true };

		var properties = assign( {}, this.state.properties );
		properties[ key ] = definition;

		this.setState({properties: properties});
		this.props.value.set( key, value );
	}
});

module.exports = ArrayProperty;