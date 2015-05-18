module.exports = {
	editing: function( instance, value ){
		if( typeof value != 'undefined' )
			return value;

		if( instance.state.editing == 'always' )
			return 'always';

		// else return undefined: do not override
	},
	extensible: function( instance, value ){

		if( typeof value != 'undefined' )
			return value;

		if( instance.props.settings )
			return instance.props.settings.extensible;

		// else return undefined: do not override
	}
};