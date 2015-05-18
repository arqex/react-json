module.exports = {
	editing: function( parentValue, value ){
		if( typeof value != 'undefined' )
			return value;

		if( parentValue == 'always' )
			return 'always';

		// else return undefined: do not override
	},
	extensible: function( parentValue, value ){

		if( typeof value != 'undefined' )
			return value;

		return parentValue;

		// else return undefined: do not override
	}
};