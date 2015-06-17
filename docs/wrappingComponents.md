# Wrapping components as react-json fields
When you are used to create custom field types, using any other component as a react-json field is not difficult.

## react-select
Let's use the outstanding [react-select](https://github.com/JedWatson/react-select) component as a field in our form. To do so, we need to create a custom field type that wraps the react-select component, allowing it to communicate with react-json. [Here you have the complete example working](http://codepen.io/arqex/pen/NqprXx?editors=001).

```js
var React = require('react'),
    Select = require('react-select')
;

// This is going to be our react-select field
var ReactSelectWrapper = React.createClass({
    render: function(){
        return <Select />
    }
});

// Register the type in react-json 
Json.registerType('react-select', ReactSelectWrapper);

// Now we can use the react-select type!!
```

It was easy! But it would be great to use the [react-select options](https://github.com/JedWatson/react-select#further-options). That's why react-json fields have settings, so we will pass all the settings given to the `react-select` field to the Select component as props:
```js
var value = { superselect: 'GU' };
var settings = {
    fields: {superselect: {
        type: 'react-select', 
        settings:{/*here react-select-options*/ } 
    }}
};

// Update the wrapper
var ReactSelectWrapper = React.createClass({
    render: function(){
        // We are going to use `createElement` to accept
        // use the settings as props
        return React.createElement( Select, this.props.settings );
    }
});
```

React select is now getting the options, but it is not using the value in the JSON object or updating react-json value. To do so we will force some react-select options to use react-json tools:
```js
var ReactSelectWrapper = React.createClass({
    render: function(){
        // Use ES6 `Object.assign` to clone the settings
        var props = Object.assign({}, this.props.settings);
        
        // Use value passed in the prop, as it is
        // done inside react-json
        props.value = this.props.value;

        // On select change, we need to update react-json value
        props.onChange = this.updateValue;
        
        return React.createElement( Select, props );
    },
    updateValue: function( newValue ){
        // Tell our parent that the field
        // has been updated
        this.props.onUpdated( newValue );
    }
});
```

And that's all folks! You already have a 'react-select' field to use inside your react-json forms. [See it working](http://codepen.io/arqex/pen/NqprXx?editors=001).

## react-datepicker
There is a JS type that is not supported by react-json out-of-the box. But there are lots of datepickers available for react that we can use. In the example we are going to create a wrapper for [react-datepicker](https://github.com/Hacker0x01/react-datepicker). This time we want it to be selectable when we are adding a new item to an object or an array
