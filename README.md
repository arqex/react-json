# react-json
A JSON editor packed as a React.js component, but also the simplest way of creating web forms.

[Play safe with react-json forms in the playground](http://jsbin.com/zopigo/4/edit?js,output).

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
[See this example working](http://jsbin.com/zopigo/4/edit?js,output)
