var React = require('react'),
	Property = require('../Property'),
	PropertyCreator = require('../PropertyCreator'),
	assign = require('object-assign')
;

/**
 * Component for editing a hash.
 * @param  {FreezerNode} value The value of the object.
 * @param  {Mixed} original The value of the component it the original json.
 */
var ObjectProperty = React.createClass({
	getInitialState: function(){
		return this.getStateFromProps( this.props );
	},

	getStateFromProps: function( props ){
		return {
			editing: props.settings.editing || false,
			properties: assign({}, props.settings && props.settings.properties || {})
		};
	},

	defaultValue: {},

	render: function(){
		var keys = Object.keys( this.props.value ),
			className = this.state.editing ? 'open objectAttr compoundAttr' : 'objectAttr compoundAttr',
			openHash = '',
			definitions = this.state.properties
		;

		var attrs = [],
			definition
		;
		for( var attr in this.props.value ){
			definition = definitions[ attr ] || {};
			if( !definition.settings )
				definition.settings = {};
			if( typeof definition.settings.editing == 'undefined' && this.state.editing == 'always' )
				definition.settings.editing = 'always';

			attrs.push( React.createElement( Property, {
				value: this.props.value[attr],
				key: attr,
				attrkey: attr,
				ref: attr,
				definition: definition,
				onUpdated: this.updateProperty,
				onDeleted: this.deleteProperty
			}));
		}

		openHash = React.DOM.div({ className: 'attrChildren'}, [
			attrs,
			React.createElement( PropertyCreator, {
				type: 'attribute',
				onCreate: this.createProperty
			})
		]);

		var header = this.props.settings.header || 'Map [' + keys.length + ']';
		return React.DOM.span({className: className}, [
			React.DOM.span({ onClick: this.toggleEditing, className: 'hashToggle' }, header),
			openHash
		]);
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.editing != nextProps.editing )
			this.setState({ editing: nextProps.editing });
	},

	toggleEditing: function(){
		if( this.state.editing != 'always' )
			this.setState({editing: !this.state.editing});
	},

	updateProperty: function( key, value ){
		this.props.value.set( key, value );
	},

	deleteProperty: function( key ){
		this.props.value.remove( key );
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
	},

	getValidationErrors: function( jsonValue ){
		var me = this,
			errors = [],
			attrs = Object.keys( this.refs )
		;

		attrs.forEach( function( attr ){
			var error = me.refs[attr].getValidationErrors();
			if( error )
				errors = errors.concat( error );
		});

		return errors;
	}
});

module.exports = ObjectProperty;