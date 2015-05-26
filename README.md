# react-json
A JSON editor packed as a React.js component, but also the simplest way of creating web forms.

[Play safe with react-json forms in the playground](http://codepen.io/arqex/pen/rVWYgo?editors=001).

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
[See this form working](http://codepen.io/arqex/pen/bdBYrB?editors=011)
