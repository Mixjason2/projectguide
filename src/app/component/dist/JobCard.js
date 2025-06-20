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
var JobAction_1 = require("@/app/component/JobAction");
var renderPlaceDate = function (place, date, label) { return (place || date ? (React.createElement("div", null,
    React.createElement("span", { className: "font-Arial" },
        label,
        ":"),
    " ",
    place,
    place && date ? ' - ' : '',
    date)) : null); };
var renderField = function (label, value) { return (Array.isArray(value) ? (React.createElement("div", null,
    React.createElement("span", { className: "font-Arial" },
        label,
        ":"),
    React.createElement("ul", { className: "list-disc ml-6" }, value.map(function (v, i) { return React.createElement("li", { key: i }, String(v)); })))) : (React.createElement("div", null,
    React.createElement("span", { className: "font-Arial" },
        label,
        ":"),
    " ",
    String(value)))); };
var JobCard = function (_a) {
    var _b;
    var job = _a.job, expandedPNRs = _a.expandedPNRs, setExpandedPNRs = _a.setExpandedPNRs, setDetailJobs = _a.setDetailJobs, jobs = _a.jobs, setJobs = _a.setJobs;
    return (React.createElement("div", { key: job.PNR, className: "relative bg-white border border-[#9EE4F6] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col" },
        React.createElement("div", { className: "absolute top-2 left-1 text-[#ffffff] font-Arial rounded-full px-3 py-1 text-sm shadow z-10", style: {
                backgroundColor: job.IsCancel
                    ? "#ef4444"
                    : job.IsConfirmed
                        ? "#22c55e"
                        : job.isNew
                            ? "#0891b2"
                            : job.isChange
                                ? "#fb923c"
                                : "#404040"
            } }, ((_b = job.all) === null || _b === void 0 ? void 0 : _b.filter(function (j) {
            return j.Pickup !== job.Pickup ||
                j.PickupDate !== job.PickupDate ||
                j.Dropoff !== job.Dropoff ||
                j.DropoffDate !== job.DropoffDate ||
                j.PNRDate !== job.PNRDate;
        }).length) + 1 || 1),
        React.createElement("button", { className: "absolute top-3.5 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center", title: "Show all details", onClick: function () { return setDetailJobs(job.all); }, style: { zIndex: 2 } },
            React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none" },
                React.createElement("circle", { cx: "12", cy: "12", r: "10", fill: "#F0F8FF" }),
                React.createElement("text", { x: "12", y: "12", textAnchor: "middle", dominantBaseline: "central", fontSize: "18", fill: "#2D3E92", fontFamily: "Arial", fontWeight: "bold" }, "i"))),
        React.createElement("div", { className: "inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3", onClick: function () {
                return setExpandedPNRs(function (prev) {
                    var _a;
                    return (__assign(__assign({}, prev), (_a = {}, _a[job.PNR] = !expandedPNRs[job.PNR], _a)));
                });
            } },
            React.createElement("h2", { className: "font-Arial mt-0 mb-0 underline underline-offset-4", style: { color: "#2D3E92", fontSize: "28px" } }, job.PNR)),
        React.createElement(ExpandedJobDetail_1["default"], { job: job, jobs: jobs, expandedPNRs: expandedPNRs, renderPlaceDate: renderPlaceDate, renderField: renderField }),
        React.createElement(JobAction_1["default"], { job: job, setJobs: setJobs })));
};
exports["default"] = JobCard;
