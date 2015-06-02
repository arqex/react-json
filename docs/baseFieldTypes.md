# Base field types
React-json comes with a nice set of field types to let us edit JSON data using traditional HTML inputs. Field types provided are:

* [string ( HTML input[type=text] )](#string)
* [number ( HTML input[type=number] )](#number)
* [boolean ( HTML input[type=checkbox] )](#boolean)
* [password ( HTML input[type=password] )](#password)
* [text ( HTML textarea )](#text)
* [select ( HTML select )](#select)
* [object](#object)
* [array](#array)
* [react](#react)

To use them, just define them [using the fields setting](fieldTypes.md).

## string
A `string` type will use an HTML `input[type=text]` element to edit the field. It is the default type for js strings shorter than 100 characters.

Setting key | Values | Description
---|---|---
editing | false*, true, `'always'` | The initial editing state. If false you need to click on the value to edit. If true, the field will start showing the input. If `'always'`, it will always show the input. This is a deep setting.
placeholder | *string* | A placeholder for the input if there is no value for the field.

*Values with * are the default ones.*

## number
A `number` type will use an HTML `input[type=number]` element to edit the field. It is the default type for js number values.

Setting key | Values | Description
---|---|---
editing | false*, true, `'always'` | The initial editing state. If false you need to click on the value to edit. If true, the field will start showing the input. If `'always'`, it will always show the input. This is a deep setting.
placeholder | *string* | A placeholder for the input if there is no value for the field.

*Values with * are the default ones.*

## boolean
A `boolean` type will use an HTML `input[type=checkbox]` element to edit the field. It is the default type for js boolean values.

This type has no settings available.

## password
A `password` type will use an HTML `input[type=password]` element to edit the field.

Setting key | Values | Description
---|---|---
editing | false*, true, `'always'` | The initial editing state. If false you need to click on the value to edit. If true, the field will start showing the input. If `'always'`, it will always show the input. This is a deep setting.
placeholder | *string* | A placeholder for the input if there is no value for the field.

*Values with * are the default ones.*

## text
A `text` type will use an HTML `textarea` element to edit the field. It is the default type for string longer than 100 characters.

Setting key | Values | Description
---|---|---
editing | false*, true, `'always'` | The initial editing state. If false you need to click on the value to edit. If true, the field will start showing the input. If `'always'`, it will always show the input. This is a deep setting.
placeholder | *string* | A placeholder for the input if there is no value for the field.

*Values with * are the default ones

## select
A `select` type will use an HTML `select` element to edit the field.

Setting key | Values | Description
---|---|---
options | *array[Options]* | The different options that can have the select box. Every option can be an object with `value` and `label` properties to define the options as `<option value={ value }>{ label }</option>`, or a `string` to set option's value and label with the `string`'s value.

*Values with * are the default ones.*

## object
An `object` type will generate all the HTML needed to edit js objects. This may be the most important field type, as a JSON document is nothing but a js object.

Setting key | Values | Description
---|---|---
| adder | true\*, false, *string* | Whether to show a link at the bottom of the object to let the user add new properties. If a `string` is given it will shown instead of the default *+ Add field* message. This is a deep setting.
| editing | false*, true, `'always'` | The initial editing state. If false you need to open the object contents. If true, the object properties will be visible initially. If `'always'`, it will always show the inner properties. This is a deep setting.
| fixedFields | false\*, true, *array* | Whether it is possible to delete properties from the object. If an array with field names is given, those properties won't be removable. This is a deep setting.
| hiddenFields | *array* | A list of fields that won't be shown to the user to be edited.
| header | *string*, *function* | Allows to customize the text in the header of an `object` that also would be used to show/hide the properties. If a function is given, it will be called with the current `object`'s value as argument, and must return the text used as header.
| order | *array*, *function* | An `array` with field names to set the exact order you want the properties to appear. If a function is given, it will be called with the current `object`'s value as argument, and must return an array with the field order.
This setting allows to create field groups and insert react fields.
*Values with * are the default ones.*

## array
An `array` type will generate all the HTML needed to edit js arrays.

Setting key | Values | Description
---|---|---
| adder | true\*, false, *string* | Whether to show a link at the bottom of the array to let the user add new elements. If a `string` is given it will shown instead of the default *+ Add element* message. This is a deep setting.
| editing | false*, true, `'always'` | The initial editing state. If false you need to open the array contents. If true, the array elements will be visible initially. If `'always'`, it will always show the inner elements. This is a deep setting.
| fixedFields | false\*, true, *array* | Whether it is possible to delete elements from the array. If an array with indexes is given, those elements won't be removable. This is a deep setting.
| header | *string*, *function* | Allows to customize the text in the header of an `array` that also would be used to show/hide the elements. If a function is given, it will be called with the current `array`'s value as argument, and must return the text used as header.
This setting allows to create field groups and insert react fields.
*Values with * are the default ones.*

## react
The `react` field type allows to insert HTML in the middle of the editor. This type of fields are really useful to add help and explanation about the form's fields.

This is a special type of field in react-json because it has no value, and this kind of fields doesn't appear in the value prop of the Json component. To insert a react field is needed to use the [`order` setting](#object) of the `object` field type:

```js
var data = { people: 333333333, total: 4444444444 },
    settings = {
      form: true, 
      fields: { info: { type: 'react', output: <h1>I am in the middle</h1> }},
      order: [ 'people', 'info', 'total'] 
    }
;


React.render( 
    <div>
        <Json value={ data } settings={ settings } />
    </div>,
  document.body
);
```
http://codepen.io/arqex/pen/BNpovQ?editors=001


