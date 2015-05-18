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
	deepSettings = require('./deepSettings')
;


/**
 * The main component. It will refresh the props when the store changes.
 *
 * @param  {FreezerNode} store  Freezer node that contains a json property with the data
 * @param  {FreezerNode} original Freezer node to compare with the current data
 */
var Json = React.createClass({

	getDefaultProps: function(){
		return {
			doc: {}
		};
	},

	childContextTypes: {
		typeDefaults: React.PropTypes.object,
		deepSettings: React.PropTypes.object
	},

	getChildContext: function(){
		return {
			typeDefaults: this.state.defaults,
			deepSettings: this.getDeepSettings()
		};
	},

	getInitialState: function(){
		var me = this,
			doc = this.props.doc,
			listener
		;

		// If it is a freezer node
		if( !doc.getListener )
			doc = new Freezer( doc ).get();

		// Listen to changes
		doc.getListener().on('update', function( updated ){
			me.setState({doc: updated});
		});

		return {
			doc: doc,
			defaults: this.createDefaults()
		};
	},

	componentWillReceiveProps: function( newProps ){
		if( !newProps.doc.getListener ){
			this.setState({doc: this.state.doc.reset( newProps.doc )});
		}

		this.setState( {defaults: this.createDefaults()} );
	},

	render: function(){
		var definition = this.props.definition,
			ob = React.createElement( TypeProperty, {
				type: 'object',
				value: this.state.doc,
				settings: objectAssign( {}, this.state.defaults.object, {
					properties: definition.properties,
					editing: definition.editing,
					extensible: definition.extensible
				}),
				ref: 'doc',
				defaults: this.state.defaults
			})
		;

		return React.DOM.div({className: "jsonEditor"}, ob);
	},

	getValue: function(){
		return this.state.doc.toJS();
	},

	getValidationErrors: function(){
		var jsonValue = this.getValue(),
			errors = this.refs.doc.getValidationErrors( jsonValue )
		;

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
			propDefaults = this.props.definition.defaults || {},
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

module.exports = Json;