var React = require('react'),
	Freezer = require('freezer-js'),
	objectAssign = require('object-assign'),
	TypeProperty = require('./TypeProperty'),
	ObjectProperty = require('./types/ObjectProperty'),
	ArrayProperty = require('./types/ArrayProperty'),
	StringProperty = require('./types/StringProperty'),
	BooleanProperty = require('./types/BooleanProperty'),
	NumberProperty = require('./types/NumberProperty'),
	TextProperty = require('./types/TextProperty'),
	PasswordProperty = require('./types/PasswordProperty'),
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
			defaults: this.createDefaults()
		};
	},

	componentWillReceiveProps: function( newProps ){
		if( !newProps.value.getListener ){
			this.setState({value: this.state.value.reset( newProps.value )});
		}

		this.setState( {defaults: this.createDefaults()} );
	},

	render: function(){
		var settings = this.props.settings,
			ob = React.createElement( TypeProperty, {
				type: 'object',
				value: this.state.value,
				settings: objectAssign( {}, this.state.defaults.object, {
					properties: settings.properties,
					editing: settings.editing,
					extensible: settings.extensible,
					header: false,
					order: settings.order
				}),
				ref: 'value',
				defaults: this.state.defaults
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
		var components = TypeProperty.prototype.components,
			propDefaults = this.props.settings.defaults || {},
			defaults = {}
		;

		for( var type in components ){
			defaults[ type ] = objectAssign( {}, components[ type ].prototype.defaults || {}, propDefaults[ type ] || {});
		}

		return defaults;
	}
});

// Add global modifier functions
Json.registerType = TypeProperty.registerType.bind( TypeProperty );

// Register basic types
Json.registerType( 'object', ObjectProperty );
Json.registerType( 'array', ArrayProperty, true );
Json.registerType( 'string', StringProperty, true );
Json.registerType( 'text', TextProperty, true );
Json.registerType( 'number', NumberProperty, true );
Json.registerType( 'boolean', BooleanProperty, true );
Json.registerType( 'password', PasswordProperty, true );

module.exports = Json;
