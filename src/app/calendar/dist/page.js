'use client';
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var cssguide_1 = require("../cssguide");
var react_1 = require("react");
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}
var monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];
function CalendarExcel() {
    var today = new Date();
    var _a = react_1.useState(today.getFullYear()), year = _a[0], setYear = _a[1];
    var _b = react_1.useState(today.getMonth()), month = _b[0], setMonth = _b[1]; // 0-indexed
    var days = getDaysInMonth(year, month);
    // Create a 6x7 grid (weeks x days)
    var firstDay = new Date(year, month, 1).getDay(); // 0=Sunday
    var cells = Array(firstDay).fill(null)
        .concat(Array.from({ length: days }, function (_, i) { return i + 1; }));
    while (cells.length % 7 !== 0)
        cells.push(null);
    // Editable cell state
    var _c = react_1.useState({}), data = _c[0], setData = _c[1];
    // Month navigation handlers
    var prevMonth = function () {
        if (month === 0) {
            setMonth(11);
            setYear(function (y) { return y - 1; });
        }
        else {
            setMonth(function (m) { return m - 1; });
        }
    };
    var nextMonth = function () {
        if (month === 11) {
            setMonth(0);
            setYear(function (y) { return y + 1; });
        }
        else {
            setMonth(function (m) { return m + 1; });
        }
    };
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "flex justify-center py-8 min-h-screen" },
            React.createElement("div", { className: "bg-base-100 rounded-xl shadow-xl border border-base-300 p-4 w-full max-w-3xl" },
                React.createElement("div", { className: "overflow-x-auto" },
                    React.createElement("div", { className: "flex items-center justify-between mb-4" },
                        React.createElement("button", { className: "btn btn-sm btn-outline", onClick: prevMonth }, "<"),
                        React.createElement("span", { className: "font-bold text-lg" },
                            monthNames[month],
                            " ",
                            year),
                        React.createElement("button", { className: "btn btn-sm btn-outline", onClick: nextMonth }, ">")),
                    React.createElement("table", { className: "table table-bordered border border-base-300 bg-base-100 shadow-lg rounded-box w-full min-w-[350px]" },
                        React.createElement("thead", null,
                            React.createElement("tr", null,
                                React.createElement("th", { className: "text-center" }, "Sun"),
                                React.createElement("th", { className: "text-center" }, "Mon"),
                                React.createElement("th", { className: "text-center" }, "Tue"),
                                React.createElement("th", { className: "text-center" }, "Wed"),
                                React.createElement("th", { className: "text-center" }, "Thu"),
                                React.createElement("th", { className: "text-center" }, "Fri"),
                                React.createElement("th", { className: "text-center" }, "Sat"))),
                        React.createElement("tbody", null, Array.from({ length: cells.length / 7 }).map(function (_, week) { return (React.createElement("tr", { key: week }, cells.slice(week * 7, week * 7 + 7).map(function (day, i) { return (React.createElement("td", { key: i, className: "p-0" }, day ? (React.createElement("input", { className: "w-full h-12 px-2 border-none focus:outline-none", type: "text", placeholder: String(day), value: data[day] || "", onChange: function (e) {
                                var _a;
                                return setData(__assign(__assign({}, data), (_a = {}, _a[day] = e.target.value, _a)));
                            } })) : null)); }))); }))))))));
}
exports["default"] = CalendarExcel;
