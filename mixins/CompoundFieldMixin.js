'use strict';

var React = require('react'),
	FieldAdder = require('../FieldAdder'),
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

		return React.createElement( FieldAdder, {
			onCreate: this.createField,
			name: name,
			key: 'add',
			text: adder
		});
	},

	createField: function( key, value, definition ){

		if( this.props.value[ key ] )
			return console.log( 'Field ' + key + ' already exists.');

		// Start editing and focus
		definition.settings = {
			editing: this.state.editing == 'always' ? 'always' : true,
			focus: true
		};

		var fields = assign( {}, this.state.fields );
		fields[ key ] = definition;

		this.setState({fields: fields});
		this.props.value.set( key, value );
	},

	/**
	 * Checks if the current key editing setting is true
	 * and set it to false. The editing setting is set
	 * to true when a new child is added to edit it automatically
	 * after is edited it loses the point.
	 *
	 * @param  {String} key The child key
	 */
	checkEditingSetting: function( key ){
		var fields = this.state.fields;
		if( fields[ key ] && fields[ key ].settings.focus === true ){
			fields = assign({}, fields);
			fields[key].settings.focus = false;
			this.setState( {fields: fields} );
		}
	},

	getFixedFields: function(){
		var fields = this.props.settings.fixedFields,
			fixed = {}
		;
		if( fields && fields.constructor == Array ){
			fields.forEach( function( f ){
				fixed[ f ] = 1;
			});
			return fixed;
		}
		return fields;
	}
};
