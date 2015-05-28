'use strict';

var ValidationMethods = {
  required: function( value ){
      if( !value )
          return false;

      // Empty trimmed string does not validate
      if( typeof value == 'string' && !value.trim() )
          return false;

      return true;
  },

  email: function( value ){

      // If nothing given, maybe the field is not required
      // so it passes the check.
      if( !value )
          return true;

      /* http://stackoverflow.com/questions/46155/validate-email-address-in-javascript */
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test( value );
  },

  length: function( value, jsonValue, min, max ){
      if( !min )
          min = 0;
      if( !max )
          max = Infinity;

      return ( value.length >= min && value.length <= max );
  },

  integer: function( value, jsonValue, min, max ){
      if( !min && min !== 0 )
          min = -Infinity;
      if( !max )
          max = Infinity;

      // Empty string passes the check
      if(!value && value != 0)
          return true;

      var intVal = parseInt( value );

      if( value != intVal )
          return false;

      return ( intVal <= max && intVal >= min );
  },

  checked: function( value ){
      return value;
  },

  matches: function( value, jsonValue, path ){
      return value == findInTree( path.split('.'), jsonValue );
  }
};


module.exports = {
	getValidationError: function( value, jsonValue, validates ){
		var methods = [],
			error = false,
			i = 0
		;

		// Store the validation methods in an array
		if( typeof validates == 'string' ){
			methods = parseMethodString( validates );
		}
		else if( typeof validates == 'function' ){
			methods = [ validates ];
		}
		else if( validates && validates.constructor === Array ){
			methods = validates;
		}


		var definition, f, method;
		while( !error && i < methods.length ){
			method = methods[i++];
			if( typeof method == 'string' ){

				// definition {name, args}
				definition = parseMethodName( method );
				f = ValidationMethods[ definition.name ];
				if( !f )
					console.log( 'Unkown validation method ' + definition.name );
				else if( !f.apply( null, [ value, jsonValue ].concat( definition.args ) )){
					error = {
						value: value,
						method: method
					};
				}
			}
			else if( typeof method == 'function' ){
				if( !method( value, jsonValue ) )
					error = {
						value: value,
						method: 'custom'
					};
			}
		}

		return error;
	}
};

/*
 HELPER METHODS
 */

var parseMethodString = function( string ){
	return string.match(/[^\s\[]+(\[[^\]]+?\])?/ig);
};

/**
 * Parse a method call in the data-validation attribute.
 * @param  {String} methodStr A method call like method[arg1, arg2, ...]
 * @return {Object}           An object like {name: 'method', args: [arg1, arg2, ...]}
 */
var parseMethodName = function( methodStr ){
    var parts = methodStr.split('['),
        definition = {
            name: parts[0],
            args: []
        },
        args
    ;

    if( parts.length > 1 ){
        args = parts[1];

        if( args[ args.length - 1 ] == ']' )
            args = args.slice(0, args.length - 1);

        definition.args = args.split(/\s*,\s*/);
    }

    return definition;
};

/**
 * Get the value of a field node, hiding the differences among
 * different type of inputs.
 *
 * @param  {DOMElement} field The field.
 * @return {String}       The current value of the given field.
 */
var getFieldValue = function( field ){
    var tagName = field.tagName.toLowerCase();

    if( tagName == 'input' && field.type == 'checkbox' ){
        return field.checked;
    }

    if( tagName == 'select' ){
        return field.options[field.selectedIndex].value;
    }

    return field.value;
};

function findInTree( path, jsonValue ){
	if( !path.length )
		return jsonValue;

	return findInTree(path.slice(1), jsonValue[ path[0] ]);
}