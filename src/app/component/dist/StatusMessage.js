"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_spinners_css_1 = require("react-spinners-css");
var StatusMessage = function (_a) {
    var loading = _a.loading, error = _a.error, filteredJobsLength = _a.filteredJobsLength;
    if (loading) {
        return (react_1["default"].createElement("div", { className: "w-full py-10 flex flex-col items-center justify-center text-gray-600" },
            react_1["default"].createElement(react_spinners_css_1.Ripple, { color: "#32cd32", size: 60 }),
            react_1["default"].createElement("p", { className: "mt-4 text-lg font-medium" }, "Loading jobs, please wait...")));
    }
    if (error) {
        return (react_1["default"].createElement("div", { className: "p-6 text-red-600 text-center bg-red-100 border border-red-300 rounded-md max-w-md mx-auto" },
            react_1["default"].createElement("p", { className: "text-lg font-semibold" }, "Oops! Something went wrong."),
            react_1["default"].createElement("p", { className: "text-sm mt-1" }, error)));
    }
    if (filteredJobsLength === 0) {
        return (react_1["default"].createElement("div", { className: "p-6 text-center text-gray-500" },
            react_1["default"].createElement("p", { className: "text-lg font-semibold" }, "No jobs found"),
            react_1["default"].createElement("p", { className: "text-sm mt-1" }, "Try adjusting your filters or search keyword.")));
    }
    return null;
};
exports["default"] = StatusMessage;
