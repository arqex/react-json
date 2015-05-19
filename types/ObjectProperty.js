'use strict';

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
		var settings = this.props.settings,
			className = this.state.editing || settings.header === false ? 'open jsonObject jsonCompound' : 'jsonObject jsonCompound',
			openHash = '',
			definitions = this.state.properties,
			attrs = [],
			definition
		;

		for( var attr in this.props.value ){
			definition = definitions[ attr ] || {};
			if( !definition.settings )
				definition.settings = {};

			//this.addDeepSettings( definition.settings );

			attrs.push( React.createElement( Property, {
				value: this.props.value[attr],
				key: attr,
				name: attr,
				ref: attr,
				definition: definition,
				onUpdated: this.updateProperty,
				onDeleted: this.deleteProperty,
				parentSettings: settings
			}));
		}

		var openHashChildren = [ attrs ];
		if( settings.extensible !== false ){
			openHashChildren.push( React.createElement( PropertyCreator, {
					type: 'attribute',
					onCreate: this.createProperty,
					key: 'creator'
				})
			);
		}

		openHash = React.DOM.div({ key: 'o', className: 'jsonChildren'}, openHashChildren);
		return React.DOM.span({className: className}, [
			this.renderHeader(),
			openHash
		]);
	},

	renderHeader: function(){
		var settingsHeader = this.props.settings.header;
		if( settingsHeader === false )
			return '';

		var type = typeof settingsHeader,
			header
		;

		if( type == 'function' ){
			header = settingsHeader( this.props.value.toJS() );
		}
		else if( type == 'undefined' ){
			header = this.getDefaultHeader();
		}
		else {
			header = settingsHeader;
		}

		return React.DOM.span({ key: 's', onClick: this.toggleEditing, className: 'compoundToggle' }, header);
	},

	getDefaultHeader: function(){
		return 'Map [' + Object.keys( this.props.value ) + ']';
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.editing != nextProps.editing )
			this.setState({ editing: nextProps.editing });
	},

	toggleEditing: function(){
		if( this.state.editing != 'always' && this.props.settings.header !== false )
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