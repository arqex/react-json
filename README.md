# react-json
A JSON editor packed as a React.js component, but also the simplest way of creating web forms.

[Play safe with react-json forms in the playground](http://codepen.io/arqex/pen/rVWYgo?editors=001).

## A JSON editor
Do you want to edit some JSON in your app? Pass it to the Json component:
```js
var doc = {
  hola: "amigo",
  array: [1,2,3]
};

React.render(
  <Json value={ doc } />,
  document.body
);
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
Hey! It's really easy creating forms, but it would be great if I can get the value of the form, you know, just for using it...

react-json doesn't come with buttons, but you can know its value at any time just creating a reference to it in your components:
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
[Get the value of the form. Live!](http://codepen.io/arqex/pen/bdBYrB?editors=011)
