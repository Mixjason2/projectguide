"use strict";
exports.__esModule = true;
var JobFilter = function (_a) {
    var value = _a.value, onChange = _a.onChange;
    return (React.createElement("div", { className: "flex gap-2 mb-4" }, ["all", "confirmed", "cancelled"].map(function (status) { return (React.createElement("button", { key: status, onClick: function () { return onChange(status); }, className: "px-4 py-1 rounded " + (value === status
            ? status === "confirmed"
                ? "bg-green-500 text-white"
                : status === "cancelled"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
            : "bg-gray-200") }, status === "all"
        ? "All Jobs"
        : status === "confirmed"
            ? "Confirmed"
            : "Cancelled")); })));
};
exports["default"] = JobFilter;
