'use strict';

var React = require('react'),
	PropertyAdder = require('../PropertyAdder'),
	assign = require('object-assign')
;

module.exports = {
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

	toggleEditing: function(){
		if( this.state.editing != 'always' && this.props.settings.header !== false )
			this.setState({editing: !this.state.editing});
	},

	componentWillReceiveProps: function( nextProps ){
		if( this.props.settings.editing != nextProps.settings.editing )
			this.setState({ editing: nextProps.editing });
	},

	renderAdder: function( name ){
		var settingsAdder = this.props.settings.adder,
			type = typeof settingsAdder,
			adder
		;

		if( type == 'function' ){
			adder = settingsAdder( this.props.value.toJS() );
		}
		else if( settingsAdder === true || type == 'undefined' ){
			adder = this.getDefaultAdder();
		}
		else {
			adder = settingsAdder;
		}

		return React.createElement( PropertyAdder, {
			onCreate: this.createProperty,
			name: name,
			key: 'add',
			text: adder
		});
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
};