# Custom field types
React-json comes with a pack of field types that allow us to create basic forms. But if the shipped field types are not enough, creating new field types is really easy. Also, if you already have an input component and want to use it as a react-json field, you can [create a wrapper for it](wrappingComponents.md).

## The counter type
We are going to create the counter type field. It is going to be simple, it will show a number field, and every time that the field is clicked it will increment its value. [See the complete example working here](http://codepen.io/arqex/pen/pJRPgX?editors=001).

To start, we are going to create the structure as a common React component:
```js
var Counter = React.createClass({
  render: function() {
    return <span> {  this.props.value  } < /span>;
  }
});
```

Easy peasy lemon squeezy! As you can see the value of the field is always stored in `this.props.value`, so to display we have just inserted it in a `<span>` tag.

## Registering the field type
To be used by react-json we need to let it know that there is a new field type available. To do so, we use react-json `registerType` method:

```js
Json.registerType( 'counter', Counter );
```

Now we can use the type `counter` to create fields using our Counter type:
```js
var data = { counter: 0 },
    settings = {
      form: true, 
      fields: { 
        counter: {type: 'counter'}
      }
    }
;

React.render( 
    <div>
        <Json value={ data } settings={ settings } />
    </div>,
  document.body
);
```

Voilà, a react-json form that uses a custom field type!

## Updating the field value
In order to update their value, all the field instances receive a callback in the prop `onUpdated`. Using that callback our, field type let the `Json` component know that the value has been updated, so it can update the value of the JSON object accordingly, and our type instance will receive the updated value through `this.props.value`. 

Let's modify our custom field type to increment the value on click:
```js
var Counter = React.createClass({
  render: function() {
    return <span onClick ={ this.increment } > {  this.props.value  } < /span>;
  },
  increment: function() {
    this.props.onUpdated( this.props.value + 1 );
  }
});
```

We don't need anything else, because the `Json` instance will be re-rendered and our component too, with the updated `this.props.value`. All that auto-render magic happens thanks to [freezer-js](https://github.com/arqex/freezer), an immutable store that makes easy to update deep nested structures.

## Adding settings
Custom field types can be configurable via settings. We are going to create a setting for the `counter` field type called `step` to demostrate how the field settings work.
```js
var data = { counter: 0 },
    settings = {
      form: true, 
      fields: { 
        counter: {type: 'counter', settings: {step: 3}}
      }
    }
;
```
Now when we click on the counter we want it to be incremented by a quantity dictated by the `step` setting instead of by 1. In the example above, every click will increment the counter by 3.

Inside our component we can access the settings via `this.props.settings`, and modifying the `increment` method of `Counter` to use the `step` setting is not difficult:

```js
...
increment: function(){
    this.props.onUpdated( this.props.value + this.props.settings.step );
}
...
```

And that's all, we already have a new functional field type. Here we have the complete code:
```js
var data = { counter: 0 },
    settings = {
      form: true, 
      fields: { 
        // We will create a `counter` type
        counter: {type: 'counter', settings: {step: 3}}
      }
    }
;

// Create the custom field type component
var Counter = React.createClass({
  render: function() {
    return <span onClick ={ this.increment } > {  this.props.value  } < /span>;
  },
  increment: function() {
    this.props.onUpdated( this.props.value + (this.props.settings.step || 1) );
  }
});

// Register the type
Json.registerType( 'counter', Counter );

React.render( 
    <div>
        <Json value={ data } settings={ settings } />
    </div>,
  document.body
);
```
http://codepen.io/arqex/pen/pJRPgX?editors=001

If you already have a react component and want to use it inside react-json, you can [create a wrapper for it](wrappingComponents.md).
