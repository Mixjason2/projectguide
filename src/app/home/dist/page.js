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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var cssguide_1 = require("../cssguide");
function JobsList() {
    var _a = react_1.useState([]), jobs = _a[0], setJobs = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(null), detailJob = _d[0], setDetailJob = _d[1];
    var _e = react_1.useState('2025-01-01'), startDate = _e[0], setStartDate = _e[1];
    var _f = react_1.useState('2025-01-31'), endDate = _f[0], setEndDate = _f[1];
    var _g = react_1.useState(1), page = _g[0], setPage = _g[1];
    var pageSize = 6;
    var totalPages = Math.ceil(jobs.length / pageSize);
    react_1.useEffect(function () {
        setLoading(true);
        // Mock ข้อมูล 10 รายการ
        var mockJobs = Array.from({ length: 10 }).map(function (_, i) { return ({
            key: i + 1,
            PNR: "PNR" + (i + 1),
            PNRDate: "2025-01-" + String(i + 1).padStart(2, '0'),
            BSL_ID: "BSL" + (i + 1),
            PickupDate: "2025-01-" + String(i + 1).padStart(2, '0'),
            Pickup: "Pickup" + (i + 1),
            DropoffDate: "2025-01-" + String(i + 2).padStart(2, '0'),
            Dropoff: "Dropoff" + (i + 1),
            Source: "Source" + (i + 1),
            Pax: Math.floor(Math.random() * 5) + 1,
            IsConfirmed: i % 2 === 0,
            IsCancel: i % 3 === 0,
            NotAvailable: null,
            Photo: "",
            Remark: ""
        }); });
        setTimeout(function () {
            setJobs(mockJobs);
            setLoading(false);
        }, 500);
    }, []);
    var columns = jobs.length > 0
        ? __spreadArrays(Object.keys(jobs[0]).filter(function (k) { return k !== 'Photo' && k !== 'Remark'; }), [
            'Photo',
            'Remark'
        ]) : ['Photo', 'Remark'];
    var filteredJobs = jobs.filter(function (job) {
        var pickup = job.PickupDate;
        var dropoff = job.DropoffDate;
        if (!startDate && !endDate)
            return true;
        if (startDate && !endDate)
            return (pickup >= startDate || dropoff >= startDate);
        if (!startDate && endDate)
            return (pickup <= endDate || dropoff <= endDate);
        return ((pickup >= startDate && pickup <= endDate) ||
            (dropoff >= startDate && dropoff <= endDate));
    });
    var pagedJobs = filteredJobs.slice((page - 1) * pageSize, page * pageSize);
    var handlePhotoChange = function (jobKey, file) {
        if (!file)
            return;
        setJobs(function (prev) {
            return prev.map(function (job) {
                return job.key === jobKey ? __assign(__assign({}, job), { Photo: URL.createObjectURL(file) }) : job;
            });
        });
    };
    var handleRemarkChange = function (jobKey, remark) {
        setJobs(function (prev) {
            return prev.map(function (job) {
                return job.key === jobKey ? __assign(__assign({}, job), { Remark: remark }) : job;
            });
        });
    };
    var sendRemark = function (jobKey, remark) {
        alert("\u0E2A\u0E48\u0E07 Remark \"" + remark + "\" \u0E2A\u0E33\u0E2B\u0E23\u0E31\u0E1A job #" + jobKey + " (mock)");
    };
    var closeDetail = function () { return setDetailJob(null); };
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "flex justify-center items-start py-8 min-h-screen bg-base-200" },
            React.createElement("div", { className: "bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-full p-0" },
                React.createElement("div", { className: "p-4 w-full min-h-screen overflow-auto" },
                    React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Jobs List"),
                    React.createElement("div", { className: "mb-8 flex flex-col items-center" },
                        React.createElement("div", { className: "bg-base-100 border border-base-300 rounded-xl shadow-md px-6 py-4 flex flex-col sm:flex-row items-center gap-4 w-full max-w-xl" },
                            React.createElement("div", { className: "flex flex-col items-start w-full" },
                                React.createElement("label", { className: "mb-1 text-xs text-gray-500 font-semibold", htmlFor: "start-date" }, "Start date"),
                                React.createElement("input", { id: "start-date", type: "date", value: startDate, max: endDate, onChange: function (e) { return setStartDate(e.target.value); }, className: "input input-bordered w-full", placeholder: "Start date" })),
                            React.createElement("span", { className: "mx-2 mt-6 sm:mt-8 text-gray-400 font-semibold hidden sm:inline" }, "to"),
                            React.createElement("div", { className: "flex flex-col items-start w-full" },
                                React.createElement("label", { className: "mb-1 text-xs text-gray-500 font-semibold", htmlFor: "end-date" }, "End date"),
                                React.createElement("input", { id: "end-date", type: "date", value: endDate, min: startDate, onChange: function (e) { return setEndDate(e.target.value); }, className: "input input-bordered w-full", placeholder: "End date" }))),
                        React.createElement("span", { className: "mt-2 text-xs text-gray-400" }, "\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E0A\u0E48\u0E27\u0E07\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48\u0E40\u0E1E\u0E37\u0E48\u0E2D\u0E01\u0E23\u0E2D\u0E07\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E07\u0E32\u0E19\u0E17\u0E35\u0E48\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23")),
                    loading ? (React.createElement("div", { className: "p-4 " }, "Loading jobs...")) : error ? (React.createElement("div", { className: "p-4 text-red-600" },
                        "Error: ",
                        error)) : !jobs.length ? (React.createElement("div", { className: "p-4" }, "No jobs found")) : (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" }, pagedJobs.map(function (job) { return (React.createElement("div", { key: job.key, className: "relative bg-white border border-base-300 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col" },
                            React.createElement("button", { className: "btn btn-ghost btn-circle absolute top-4 right-4", title: "Detail", onClick: function () { return setDetailJob(job); }, style: { zIndex: 2 } },
                                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-8 h-8 text-primary", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
                                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", d: "M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-9 9-9 9s-9-4-9-9a9 9 0 1118 0z" }))),
                            React.createElement("div", { className: "p-6 flex-1 flex flex-col" },
                                React.createElement("h2", { className: "text-xl font-bold mb-2 text-primary" },
                                    "Job #",
                                    job.key),
                                React.createElement("div", { className: "text-sm text-gray-600 space-y-1 mb-4" },
                                    React.createElement("div", null,
                                        React.createElement("span", { className: "font-semibold" }, "PNR:"),
                                        " ",
                                        job.PNR),
                                    React.createElement("div", null,
                                        React.createElement("span", { className: "font-semibold" }, "Pickup:"),
                                        " ",
                                        job.Pickup,
                                        " ",
                                        React.createElement("span", { className: "text-xs text-gray-400" },
                                            "(",
                                            job.PickupDate,
                                            ")")),
                                    React.createElement("div", null,
                                        React.createElement("span", { className: "font-semibold" }, "Dropoff:"),
                                        " ",
                                        job.Dropoff,
                                        " ",
                                        React.createElement("span", { className: "text-xs text-gray-400" },
                                            "(",
                                            job.DropoffDate,
                                            ")")),
                                    React.createElement("div", null,
                                        React.createElement("span", { className: "font-semibold" }, "Pax:"),
                                        " ",
                                        job.Pax),
                                    React.createElement("div", null,
                                        React.createElement("span", { className: "font-semibold" }, "BSL ID:"),
                                        " ",
                                        job.BSL_ID),
                                    React.createElement("div", null,
                                        React.createElement("span", { className: "font-semibold" }, "Source:"),
                                        " ",
                                        job.Source)),
                                React.createElement("div", { className: "flex gap-3 mt-auto" },
                                    React.createElement("button", { className: "btn btn-success flex-1 text-base font-bold py-2 rounded-full shadow", onClick: function () { return alert("Accepted job #" + job.key); } }, "Accept"),
                                    React.createElement("button", { className: "btn btn-error flex-1 text-base font-bold py-2 rounded-full shadow", onClick: function () { return alert("Rejected job #" + job.key); } }, "Reject"))))); })),
                        React.createElement("div", { className: "flex justify-center mt-6 gap-2" },
                            React.createElement("button", { className: "btn btn-outline btn-sm", disabled: page === 1, onClick: function () { return setPage(page - 1); } }, "Prev"),
                            React.createElement("span", { className: "px-2 py-1" },
                                page,
                                " / ",
                                totalPages),
                            React.createElement("button", { className: "btn btn-outline btn-sm", disabled: page === totalPages, onClick: function () { return setPage(page + 1); } }, "Next")),
                        detailJob && (React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" },
                            React.createElement("div", { className: "bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative" },
                                React.createElement("button", { className: "absolute top-2 right-2 btn btn-sm btn-error", onClick: closeDetail }, "\u2715"),
                                React.createElement("h2", { className: "text-xl font-bold mb-4" }, "Job Detail"),
                                React.createElement("div", { className: "space-y-2 mb-4" }, Object.entries(detailJob)
                                    .filter(function (_a) {
                                    var k = _a[0];
                                    return k !== "IsConfirmed" && k !== "IsCancel";
                                })
                                    .map(function (_a) {
                                    var k = _a[0], v = _a[1];
                                    return (React.createElement("div", { key: k, className: "flex" },
                                        React.createElement("span", { className: "font-semibold w-40" },
                                            k,
                                            ":"),
                                        React.createElement("span", { className: "break-all" }, typeof v === 'object' ? JSON.stringify(v) : String(v))));
                                }))))))))))));
}
exports["default"] = JobsList;
