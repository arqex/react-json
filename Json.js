var React = require('react'),
	Freezer = require('freezer-js'),
	objectAssign = require('object-assign'),
	TypeField = require('./TypeField'),
	ObjectField = require('./types/ObjectField'),
	ArrayField = require('./types/ArrayField'),
	StringField = require('./types/StringField'),
	BooleanField = require('./types/BooleanField'),
	NumberField = require('./types/NumberField'),
	TextField = require('./types/TextField'),
	PasswordField = require('./types/PasswordField'),
	deepSettings = require('./deepSettings')
;


/**
 * The main component. It will refresh the props when the store changes.
 *
 * @prop  {Object|FreezerNode} value The JSON object, value of the form.
 * @prop  {Object} settings Customization settings
 */
var Json = React.createClass({

	getDefaultProps: function(){
		return {
			value: {},
			errors: false
		};
	},

	childContextTypes: {
		typeDefaults: React.PropTypes.object
	},

	getChildContext: function(){
		return {
			typeDefaults: this.state.defaults
		};
	},

	getInitialState: function(){
		var me = this,
			value = this.props.value,
			listener
		;

		// If it is a freezer node
		if( !value.getListener )
			value = new Freezer( value ).get();

		// Listen to changes
		value.getListener().on('update', function( updated ){
			me.setState({value: updated});

			if( me.state.errors )
				me.getValidationErrors();
		});

		return {
			value: value,
			defaults: this.createDefaults(),
			id: this.getId()
		};
	},

	componentWillReceiveProps: function( newProps ){
		if( !newProps.value.getListener ){
			this.setState({value: this.state.value.reset( newProps.value )});
		}

		this.setState( {defaults: this.createDefaults()} );
	},

	render: function(){
		var settings = this.props.settings || {},
			ob = React.createElement( TypeField, {
				type: 'object',
				value: this.state.value,
				settings: objectAssign( {}, this.state.defaults.object, {
					fields: settings.fields,
					editing: this.getFormSetting( settings, 'editing', 'always'),
					fixedFields: this.getFormSetting( settings, 'fixedFields', true),
					adder:  this.getFormSetting( settings, 'adder', false),
					header: false,
					order: settings.order
				}),
				ref: 'value',
				defaults: this.state.defaults,
				id: this.state.id
			})
		;

		return React.DOM.div({className: "jsonEditor"}, ob);
	},

	getValue: function(){
		return this.state.value.toJS();
	},

	getValidationErrors: function(){
		var jsonValue = this.getValue(),
			errors = this.refs.value.getValidationErrors( jsonValue )
		;

		this.setState( {errors: errors.length} );
		return errors.length ? errors : false;
	},
	getDeepSettings: function(){
		var settings = {};

		for( var key in deepSettings ){
			settings[ key ] = deepSettings[ key ]( this, settings[key] );
		}

		return settings;
	},
	createDefaults: function(){
		var settings = this.props.settings || {},
			components = TypeField.prototype.components,
			propDefaults = settings.defaults || {},
			defaults = {}
		;

		for( var type in components ){
			defaults[ type ] = objectAssign( {}, components[ type ].prototype.defaults || {}, propDefaults[ type ] || {});
		}

		return defaults;
	},

	getId: function(){
		return btoa( parseInt( Math.random() * 10000 ) ).replace(/=/g, '');
	},

	getFormSetting: function( settings, field, def ){
		if( typeof settings[ field ] != 'undefined' )
			return settings[ field ];
		if( settings.form )
			return def;
	}
});

// Add global modifier functions
Json.registerType = TypeField.registerType.bind( TypeField );

// Register basic types
Json.registerType( 'object', ObjectField );
Json.registerType( 'array', ArrayField, true );
Json.registerType( 'string', StringField, true );
Json.registerType( 'text', TextField, true );
Json.registerType( 'number', NumberField, true );
Json.registerType( 'boolean', BooleanField, true );
Json.registerType( 'password', PasswordField, true );

module.exports = Json;
