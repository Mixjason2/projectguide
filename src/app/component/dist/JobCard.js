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
var ExpandedJobDetail_1 = require("@/app/component/ExpandedJobDetail");
var AllJobDetailsModal_1 = require("@/app/component/AllJobDetailsModal");
var react_1 = require("react");
var renderPlaceDate = function (place, date, label) { return (place || date ? (React.createElement("div", null,
    React.createElement("span", { className: "font-Arial font-bold" },
        label,
        ":"),
    " ",
    place,
    place && date ? ' - ' : '',
    date)) : null); };
var renderField = function (label, value) { return (Array.isArray(value) ? (React.createElement("div", null,
    React.createElement("span", { className: "font-Arial font-bold" },
        label,
        ":"),
    React.createElement("ul", { className: "list-disc ml-6" }, value.map(function (v, i) { return React.createElement("li", { key: i }, String(v)); })))) : (React.createElement("div", null,
    React.createElement("span", { className: "font-Arial font-bold" },
        label,
        ":"),
    " ",
    String(value)))); };
var customFormatDate = function (dateStr) {
    var date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return '';
    var day = String(date.getDate()).padStart(2, '0');
    var month = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();
    return day + "-" + month + "-" + year;
};
var JobCard = function (_a) {
    var _b, _c, _d;
    var job = _a.job, // job เป็น array ของ Job[]
    expandedPNRs = _a.expandedPNRs, setExpandedPNRs = _a.setExpandedPNRs, jobs = _a.jobs, setJobs = _a.setJobs;
    var _e = react_1.useState(null), detailJobs = _e[0], setDetailJobsState = _e[1];
    return (React.createElement("div", { key: (_b = job[0]) === null || _b === void 0 ? void 0 : _b.PNRDate, className: "relative bg-white border border-[#9EE4F6] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col" },
        React.createElement("div", { className: "absolute top-2 left-4 bg-white text-gray-800 font-Arial rounded-full px-3 py-1 text-sm shadow-none border-none z-10 flex items-center" }, job.map(function (_, idx) {
            var _a;
            return (React.createElement("span", { key: idx, className: "inline-block w-3 h-3 rounded-full mx-1", style: {
                    backgroundColor: ((_a = job[idx]) === null || _a === void 0 ? void 0 : _a.IsConfirmed) ? "#22c55e" : "#d1d5db",
                    border: '0px solid #2D3E92'
                } }));
        })),
        React.createElement("button", { className: "absolute top-3.5 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center", title: "Show all details", onClick: function () { return setDetailJobsState(job); }, style: { zIndex: 2 } },
            React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none" },
                React.createElement("circle", { cx: "12", cy: "12", r: "10", fill: "#F0F8FF" }),
                React.createElement("text", { x: "12", y: "12", textAnchor: "middle", dominantBaseline: "central", fontSize: "18", fill: "#2D3E92", fontFamily: "Arial", fontWeight: "bold" }, "i"))),
        detailJobs && (React.createElement(AllJobDetailsModal_1["default"], { detailJobs: detailJobs, setDetailJobs: setDetailJobsState })),
        React.createElement("div", { className: "inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3 text-center", onClick: function () { return setExpandedPNRs(function (prev) {
                var _a;
                var _b, _c;
                return (__assign(__assign({}, prev), (_a = {}, _a[(_b = job[0]) === null || _b === void 0 ? void 0 : _b.PNRDate] = !expandedPNRs[(_c = job[0]) === null || _c === void 0 ? void 0 : _c.PNRDate], _a)));
            }); } },
            React.createElement("h2", { className: "font-Arial mt-0 mb-0 text-[24px]", style: { color: "#2D3E92", textDecoration: "none" } }, customFormatDate((_c = job[0]) === null || _c === void 0 ? void 0 : _c.PNRDate))),
        expandedPNRs[(_d = job[0]) === null || _d === void 0 ? void 0 : _d.PNRDate] && job.map(function (singleJob, idx) { return (React.createElement(ExpandedJobDetail_1["default"], { key: singleJob.JobKey || idx, job: singleJob, jobs: jobs, expandedPNRs: expandedPNRs, renderPlaceDate: renderPlaceDate, renderField: renderField, setJobs: setJobs })); })));
};
exports["default"] = JobCard;
