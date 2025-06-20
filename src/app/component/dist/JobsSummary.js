"use strict";
exports.__esModule = true;
var react_1 = require("react");
var JobsSummary = function (_a) {
    var filteredByDate = _a.filteredByDate;
    return (react_1["default"].createElement("div", { className: "w-full flex justify-end mb-6" },
        react_1["default"].createElement("div", { className: "flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl" }, ['All Jobs', 'New Jobs', 'Changed Jobs'].map(function (label, i) { return (react_1["default"].createElement("div", { key: i, className: "flex items-center gap-2" },
            react_1["default"].createElement("span", { className: "inline-block w-3 h-3 rounded-full " + ['bg-neutral-700', 'bg-cyan-600', 'bg-orange-400'][i] }),
            react_1["default"].createElement("span", { className: "text-gray-500" },
                label,
                ":"),
            react_1["default"].createElement("span", { className: "font-Arial text-[#2D3E92]" }, i === 0
                ? filteredByDate.length
                : filteredByDate.filter(function (job) { return (i === 1 ? job.isNew : job.isChange); }).length))); }))));
};
exports["default"] = JobsSummary;
