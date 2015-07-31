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

## react-datetime
There is a JS type that is not supported by react-json out-of-the box: `Date` objects. There are lots of datepickers available for react that we can use and they would look great inside react-json. In the example we are going to create a wrapper for [react-datetime](https://github.com/arqex/react-datetime). It can edit dates and times at once, so it is perfect to edit `Date` objects.

This time we want it to be selectable when we are adding a new item to an object or an array. To do so we need to add `true` as the third argument when registering:
```js
Json.registerType( 'date', DatetimeWrapper, true );
```

The wrapper will be really similar to the react-select one. We can create it just adapting it to react-datetime:
```js
var ReactSelectWrapper = React.createClass({
    render: function(){
        // Use ES6 `Object.assign` to clone the settings
        var props = Object.assign({}, this.props.settings);
        
        // The value is going to the date prop
        props.date = this.props.value;
        props.onChange = this.updateValue;
        
        return React.createElement( Datetime, props );
    },
    updateValue: function( newValue ){
        // react-datetime returns a moment.js object
        // convert it to a date
        this.props.onUpdated( newValue.toDate() );
    },

    isType: function( value ){
        return value && value.constructor === Date;
    }
});
```

Hey, that method `isType` is new! In our case we want the brand new `date` field type to be the default one for `Date` objects. When we use have a json object with a `Date` inside it will be edited automatically using react-datetime.

