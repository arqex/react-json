module.exports = {
	editing: function( parentValue, value ){
		if( typeof value != 'undefined' )
			return value;

		if( parentValue == 'always' )
			return 'always';

		// else return undefined: do not override
	},
	adder: function( parentValue, value ){

		if( typeof value != 'undefined' )
			return value;
		if( typeof parentValue != 'undefined' )
			return parentValue;

		return true;
	},
	fixedFields: function( parentValue, value ){
		if( typeof value != 'undefined' )
			return value;

		if( typeof parentValue == 'boolean' )
			return parentValue;
	}
};
