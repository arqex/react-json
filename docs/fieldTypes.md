# Field types

One of the powerful features of react-json is that we can show the same data in different ways depending on the field type we decide to use for it. We can even create our own field types to edit our data exactly as we need.

React-json comes with a nice pack of field types out-of-the-box to create traditional forms, [you can see all of them and their available settings in the docs](baseFieldTypes.md).

You can set an specific data type for your data usint the `fields` setting in your `Json` component:

```js
var data = { people: 333333333 },
    // We want people to be edited by an input[type=text]
    stringSettings = { 
        form: true, // This will show the data as a traditional form
        fields:{ people: { type: 'string' }}
    },
    // We want people to be edited be a textarea
    textSettings = { 
        form: true,
        fields:{ people: {type: 'text' }}
    },    
    // We want people to be edited by an input[type=number]
    // we don't need to set it as react-json will detect
    // the type based on the people value
    numberSettings = { form: true },
;

React.render( 
    <div>
        <Json value={ data } settings={ stringSettings } />
        <Json value={ data } settings={ stringSettings } />
        <Json value={ data } settings={ stringSettings } />
    </div>
    , document.body )
;
```
http://codepen.io/arqex/pen/eNgNqW?editors=001
