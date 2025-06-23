"use strict";
exports.__esModule = true;
var react_1 = require("react");
var dotStyle = function (delay) { return ({
    width: 12,
    height: 12,
    backgroundColor: '#95c941',
    borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce 1.4s infinite ease-in-out both',
    animationDelay: delay * 0.2 + "s"
}); };
var LoadingIndicator = function () { return (react_1["default"].createElement("div", { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontSize: '1.2rem', color: '#555' } },
    react_1["default"].createElement("div", { style: { display: 'flex', gap: 8, marginBottom: 12 } }, [0, 1, 2].map(function (i) { return react_1["default"].createElement("span", { key: i, style: dotStyle(i) }); })),
    "Loading jobs...",
    react_1["default"].createElement("style", null, "\n      @keyframes bounce {\n        0%, 80%, 100% { transform: scale(0); }\n        40% { transform: scale(1); }\n      }\n    "))); };
exports["default"] = LoadingIndicator;
