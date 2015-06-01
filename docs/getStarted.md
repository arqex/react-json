# Get started with react-json

## A JSON editor
Do you want to edit some JSON in your app? Pass it to the Json component:
```js
var doc = {
  hola: "amigo",
  array: [1,2,3]
};

React.render(
  <Json value={ doc } onChange={ logChange } />,
  document.body
);

function logChange( value ){
   console.log( value );
}
```
[See this example working](http://codepen.io/arqex/pen/rVWYgo?editors=001)

## A simple form creator
Do you hate creating forms? React-json handles all the dirty markup for you, and makes you focus in what is important;
```js
var doc = {
  user: "",
  password: ""
};

// form: true
// make objects not extensible,
// fields not removable
// and inputs always visible
var settings = {
  form: true,
  fields: { password: {type: 'password'} }
};

React.render(
  <Json value={ doc } settings={ settings }/>, 
  document.body
);
```
[See this form working](http://codepen.io/arqex/pen/xGRpOx?editors=011)

## Interactive forms
React-json is similar to an `input` component, but instead of handling a string it manages a complete JSON object, you can react to changes inside the object adding a `onChange` prop to it.

The way of your application submit the data is out of the scope of the library, so there is no buttons or similiar in react-json. If you need buttons you can create them easily in the `Json` parent component:
```js
var doc = {
  user: "",
  password: ""
};

var settings = {
  form: true,
  fields: { password: {type: 'password'} }
};

var Form = React.createClass({
  getInitialState: function(){
    return {value: doc};
  },
  render: function(){
    return (
      <form>
        <Json value={ this.state.value } settings={ settings } onChange={ this.updateValue } />
        <button onClick={ this.onOk }>Ok</button>
      </form>
    );
  },
  onOk: function( e ){
    e.preventDefault();
    alert('SPOILER: Your password is ' + this.state.value.password );
  },
  updateValue: function( nextValue ) {
    this.setState( {value: nextValue} );
  }
});

React.render( <Form />,  document.body );
```
[Get the value of the form. Live!](http://codepen.io/arqex/pen/ZGLwWz?editors=011)

There is an alternative way of getting the value of a react-json component anytime we need it, and not only when it is updated. Using react references with the react-json component, we can access to the value of the JSON object thanks to the method `getValue` that is available in the react-json instance:
```js
var doc = {
  user: "",
  password: ""
};

var settings = {
  form: true,
  fields: { password: {type: 'password'} }
};

var Form = React.createClass({
  render: function(){
    return (
        <form>
        <Json value={ doc } settings={ settings } ref="json" />
        <button onClick={ this.onOk }>Ok</button>
      </form>
    );
  },
  onOk: function( e ){
    e.preventDefault();
    var val = this.refs.json.getValue();
    alert('SPOILER: Your password is ' + val.password );
  } 
});

React.render( <Form />,  document.body );
```
http://codepen.io/arqex/pen/bdBYrB?editors=011
