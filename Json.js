var React = require('react'),
	Freezer = require('freezer-js'),
	TypeProperty = require('./TypeProperty'),
	ObjectProperty = require('./types/ObjectProperty'),
	ArrayProperty = require('./types/ArrayProperty'),
	StringProperty = require('./types/StringProperty'),
	BooleanProperty = require('./types/BooleanProperty'),
	NumberProperty = require('./types/NumberProperty'),
	TextProperty = require('./types/TextProperty')
;

// Register basic types
TypeProperty.registerType( 'object', ObjectProperty );
TypeProperty.registerType( 'array', ArrayProperty, true );
TypeProperty.registerType( 'string', StringProperty, true );
TypeProperty.registerType( 'text', TextProperty, true );
TypeProperty.registerType( 'number', NumberProperty, true );
TypeProperty.registerType( 'boolean', BooleanProperty, true );

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

		return {doc: doc};
	},

	componentWillReceiveProps: function( newProps ){
		if( !newProps.doc.getListener )
			this.setState({doc: this.state.doc.reset( newProps.doc )});
	},

	render: function(){
		var definition = this.props.definition,
			ob = React.createElement( TypeProperty, {
				type: 'object',
				value: this.state.doc,
				settings: {
					properties: definition.properties,
					editing: definition.editing
				},
				ref: 'doc'
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
	}
});

module.exports = Json;