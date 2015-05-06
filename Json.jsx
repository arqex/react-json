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

	componentWillMount: function(){
		var me = this,
			doc = this.props.doc,
			listener
		;

		// If it is a freezer node
		if( !doc.getListener )
			doc = new Freezer( doc ).get();


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
		var ob = typeManager.createAttribute('object', this.state.doc, {});

		return (
			<div className="jsonEditor">
				{ ob }
			</div>
		);
	},
	getValue: function(){
		return this.state.doc.toJS();
	}
});

module.exports = Json;