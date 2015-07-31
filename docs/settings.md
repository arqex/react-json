# Settings
Instead of having an endless list of props, react-json can be configured passing all the settings through the `settings` prop:

```js
var settings = {
    form: true,
    fields: { 
        age: { type: "select", settings:{ options: [10, 20, 30] } } 
    }
}

...
<Json defaultValue={ {age: 20} } settings={ settings } />

```

The following settings are accepted:
| Name         | Type    | Default | Description |
| ------------ | ------- | ------- | ----------- |
| fields | Object | | to be continued... |
| order | | | |
| editing | | | |
| adder | | | |
| editing | | | |
| fixedFields | | | |
| hiddenFields | | | |
| form | | | |
| header | | | |
