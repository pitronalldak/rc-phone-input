"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var src_1 = require("../src");
var App = function () { return (React.createElement("div", { style: { width: '25%' } },
    React.createElement("p", null, "With initial value"),
    React.createElement(src_1.default, { value: "+79107409656" }),
    React.createElement("br", null),
    React.createElement("p", null, "With prefered contries"),
    React.createElement(src_1.default, { preferredCountries: ['in', 'us', 'uk'] }),
    React.createElement("br", null),
    React.createElement("p", null, "With Ip-lookup"),
    React.createElement(src_1.default, { withIpLookup: true, placeholder: "Phone", onChange: function (e) { return console.log(e); } }))); };
ReactDOM.render(React.createElement(App, null), document.getElementById('app'));
//# sourceMappingURL=index-example.js.map