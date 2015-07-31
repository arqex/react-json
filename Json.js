var React = require('react'),
	Freezer = require('freezer-js'),
	objectAssign = require('object-assign'),
	TypeField = require('./src/TypeField'),
	ObjectField = require('./src/types/ObjectField'),
	ArrayField = require('./src/types/ArrayField'),
	StringField = require('./src/types/StringField'),
	BooleanField = require('./src/types/BooleanField'),
	NumberField = require('./src/types/NumberField'),
	TextField = require('./src/types/TextField'),
	PasswordField = require('./src/types/PasswordField'),
	SelectField = require('./src/types/SelectField'),
	deepSettings = require('./src/deepSettings')
;

// Detect flexbox support
var flexboxClass = typeof document != 'undefined' || '',
	css
;
if( flexboxClass ){
	css = document.documentElement.style;
	if( ('flexWrap' in css) || ('webkitFlexWrap' in css) || ('msFlexWrap' in css) )
		flexboxClass = ' jsonFlex';
}

var noop = function(){};

/**
 * The main component. *
 * @prop  {Object|FreezerNode} value The JSON object, value of the form for using it as a controlled component.
 * @prop  {Object|FreezerNode} defaultValue The JSON object, value of the form form using it as an uncontrolled component.
 * @prop  {Object} settings Customization settings
 */
var Json = React.createClass({

	getDefaultProps: function(){
		return {
			value: false,
			defaultValue: {},
			onChange: noop,
			settings: {}
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
		var state = this.getStateFromProps( this.props );
		state.id = this.getId();
		return state;
	},

	getStateFromProps: function( props ){
		var value = props.value || ( this.state && this.state.value ) || props.defaultValue,
			listener
		;

		// The value needs to be a freezer node
		if( !value.getListener )
			value = new Freezer( value ).get();

		// Update the listener
		value.getListener().off('update', this.updateListener );
		value.getListener().on('update', this.updateListener );

		return {
			value: value,
			defaults: this.createDefaults()
		};
	},

	updateListener: function( updated ){
		var me = this;

		if( me.state.updating )
			return me.setState({ updating: false });

		// Only update on uncontrolled mode
		if( !me.props.value )
			me.setState({ value: updated });

		if( me.state.errors )
			me.getValidationErrors();

		var value;
		// If the input is a freezer node, return a freezer object
		// otherwise, return JSON
		if( this.props.value && this.props.value.getListener || this.props.defaultValue.getListener )
			value = update;
		else
			value = updated.toJS();

		me.props.onChange( value );
	},

	componentWillReceiveProps: function( newProps ){
		this.setState( this.getStateFromProps( newProps ) );
	},

	render: function(){
		var settings = this.props.settings,
			ob = React.createElement( TypeField, {
				type: 'object',
				value: this.state.value,
				settings: objectAssign( {}, this.state.defaults.object, {
					fields: settings.fields,
					editing: this.getFormSetting( settings, 'editing', 'always'),
					fixedFields: this.getFormSetting( settings, 'fixedFields', true),
					adder:  this.getFormSetting( settings, 'adder', false),
					hiddenFields: settings.hiddenFields,
					header: false,
					order: settings.order
				}),
				ref: 'value',
				defaults: this.state.defaults,
				id: this.state.id
			}),
			className = 'jsonEditor' + flexboxClass
		;

		return React.DOM.div({ className: className }, ob);
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
Json.registerType( 'password', PasswordField );
Json.registerType( 'select', SelectField );

module.exports = Json;
