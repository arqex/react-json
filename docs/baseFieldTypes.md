# Base field types
React-json comes with a nice set of field types to let us edit JSON data using traditional HTML inputs. Field types provided are:

* string ( HTML input[type=text] )
* number ( HTML input[type=number] )
* boolean ( HTML input[type=checkbox] )
* password ( HTML input[type=password] )
* text ( HTML textarea )
* select ( HTML select )
* object
* array
* react

To use them, just define them [using the fields setting](fieldTypes.md).

## string
A `string` type will use an HTML `input[type=text]` element to edit the field. It is the default type for js strings shorter than 100 characters.

| settingName | values | description |
|-|-|
| editing | false*, true, 'always' | The initial editing state. If false you need to click on the value to edit. If true, the field will start showing the input. If 'always', it will always show the input. |
| placeholder | string | A placeholder for the input if there is no value for the field |
``
*Values with \* are the default ones.*

## number
A `number` type will use an HTML `input[type=number]` element to edit the field. It is the default type for js number values.

settingName | values | description
------|----------
editing | false*, true, 'always' | The initial editing state. If false you need to click on the value to edit. If true, the field will start showing the input. If 'always', it will always show the input.
placeholder | string | A placeholder for the input if there is no value for the field
``
*Values with \* are the default ones.*
