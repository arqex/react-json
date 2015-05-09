var React = require('react'),
	Freezer = require('freezer-js'),
	typeManager = require('./typeManager')
;


/****************
JSX components
*****************/

/**
 * The main component. It will refresh the props when the store changes.
 *
 * @param  {FreezerNode} store  Freezer node that contains a json property with the data
 * @param  {FreezerNode} original Freezer node to compare with the current data
 */
var Json = React.createClass({

	getDefaultProps: function(){
		return {
			doc: {},
			definition: {}
		};
	},

	componentWillMount: function(){
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

		this.setState({doc: doc});
	},

	componentWillReceiveProps: function( newProps ){
		if( !newProps.doc.getListener )
			this.setState({doc: this.state.doc.reset( newProps.doc )});
	},

	render: function(){
		var definition = this.props.definition,
			ob = typeManager.createProperty(
				'object',
				this.state.doc,
				{
					properties: definition.properties,
					editing: definition.editing
				}
			)
		;

		return React.DOM.div({className: "jsonEditor"}, ob);
	},
	getValue: function(){
		return this.state.doc.toJS();
	}
});

module.exports = Json;