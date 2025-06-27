"use strict";
exports.__esModule = true;
var react_1 = require("react");
var ErrorMessage = function (_a) {
    var error = _a.error;
    return (react_1["default"].createElement("div", { className: "max-w-md mx-auto my-5 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg font-semibold text-center shadow-md" },
        "Error: ",
        error));
};
exports["default"] = ErrorMessage;
