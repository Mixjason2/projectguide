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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var cssguide_1 = require("../cssguide");
var axios_1 = require("axios");
var index_js_1 = require("@fullcalendar/core/index.js");
var ExpandedJobDetail_1 = require("@/app/component/ExpandedJobDetail");
var JobAction_1 = require("@/app/component/JobAction");
var StatusMessage_1 = require("@/app/component/StatusMessage");
var AllJobDetails_1 = require("@/app/component/AllJobDetails");
// Merge jobs by PNR, combine fields that are different into arrays
function mergeJobsByPNR(jobs) {
    var map = {};
    for (var _i = 0, jobs_1 = jobs; _i < jobs_1.length; _i++) {
        var job = jobs_1[_i];
        if (!map[job.PNR]) {
            map[job.PNR] = {
                merged: __assign(__assign({}, job), { keys: [job.key], all: [job] }),
                all: [job]
            };
        }
        else {
            map[job.PNR].merged.keys.push(job.key);
            map[job.PNR].all.push(job);
            for (var _a = 0, _b = Object.keys(job); _a < _b.length; _a++) {
                var k = _b[_a];
                if (k === "key" || k === "Photo" || k === "Remark")
                    continue;
                var prev = map[job.PNR].merged[k];
                var curr = job[k];
                if (k === "IsConfirmed") {
                    var mergedVal = Boolean(prev) || Boolean(curr);
                    map[job.PNR].merged[k] = mergedVal;
                    continue;
                }
                if (k === "IsCancel") {
                    var mergedVal = Boolean(prev) || Boolean(curr);
                    map[job.PNR].merged[k] = mergedVal;
                    continue;
                }
                if (Array.isArray(prev)) {
                    if (!prev.includes(curr)) {
                        prev.push(curr);
                    }
                }
                else if (prev !== curr) {
                    map[job.PNR].merged[k] = [prev, curr].filter(function (v, i, arr) { return arr.indexOf(v) === i; });
                }
            }
        }
    }
    return Object.values(map).map(function (entry) { return entry.merged; });
}
// ✅ Only one map block here
// const result = Object.entries(map).map(([pnr, data]) => {
//   const merged = { ...data.merged }
//   // Force isConfirmed to true always
//   merged.isConfirmed = true
//   return {
//     ...merged,
//     PNR: pnr,
//     all: data.all,
//   }
// })
// console.log(result)
// return result
// const result = Object.entries(map).map(([pnr, data]) => {
//   const merged = { ...data.merged };
//   // Force isCancel to true always
//   merged.isCancel = true;
//   return {
//     ...merged,
//     PNR: pnr,
//     all: data.all,
//   };
// });
// console.log(result);
// return result;
// }
var getToday = function () { return new Date().toISOString().slice(0, 10); };
var getEndOfMonth = function () { return new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10); };
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
var renderAllDetails = function (jobs) {
    // Step 1: Group jobs by their common properties (excluding TypeName)
    var groupedJobs = {};
    jobs.forEach(function (job) {
        var groupKey = JSON.stringify({
            PNR: job.PNR,
            Pickup: job.Pickup,
            PickupDate: job.PickupDate,
            Dropoff: job.Dropoff,
            DropoffDate: job.DropoffDate,
            PNRDate: job.PNRDate,
            GuideName: job.Guide,
            Vehicle: job.Vehicle
        });
        var typeName = job.serviceTypeName || job.TypeName || "Unknown";
        if (!groupedJobs[groupKey]) {
            groupedJobs[groupKey] = {
                job: __assign({}, job),
                typeNames: [typeName]
            };
        }
        else {
            groupedJobs[groupKey].typeNames.push(typeName);
        }
    });
    return (React.createElement(AllJobDetails_1["default"], { jobs: jobs, formatDate: index_js_1.formatDate }));
};
function JobsList() {
    var _this = this;
    var _a = react_1.useState([]), jobs = _a[0], setJobs = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(null), detailJobs = _d[0], setDetailJobs = _d[1];
    var _e = react_1.useState(getToday()), startDate = _e[0], setStartDate = _e[1];
    var _f = react_1.useState(getEndOfMonth()), endDate = _f[0], setEndDate = _f[1];
    var _g = react_1.useState(1), page = _g[0], setPage = _g[1];
    var _h = react_1.useState({}), expandedPNRs = _h[0], setExpandedPNRs = _h[1];
    var _j = react_1.useState(false), showConfirmedOnly = _j[0], setShowConfirmedOnly = _j[1];
    var pageSize = 6;
    react_1.useEffect(function () {
        var token = localStorage.getItem('token') || '';
        setLoading(true);
        fetch('https://operation.dth.travel:7082/api/guide/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                startdate: startDate,
                enddate: endDate
            })
        })
            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var text;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!res.ok) return [3 /*break*/, 2];
                        return [4 /*yield*/, res.text()];
                    case 1:
                        text = _a.sent();
                        throw new Error(text);
                    case 2: return [2 /*return*/, res.json()]; // ✅ แปลงเป็น JSON
                }
            });
        }); })
            .then(function (data) {
            // console.log("Job data:", data);
            setJobs(data); // ✅ เซ็ตข้อมูลให้ state
        })["catch"](function (err) {
            // console.error("Fetch error:", err);
            setError(err.message);
        })["finally"](function () {
            setLoading(false);
        });
    }, [startDate, endDate]);
    var filteredByDate = jobs.filter(function (job) {
        var pickup = job.PickupDate, dropoff = job.DropoffDate;
        return (!startDate && !endDate) || (startDate && pickup >= startDate) || (endDate && dropoff <= endDate);
    });
    var filteredJobs = showConfirmedOnly
        ? filteredByDate.filter(function (job) { return job.IsConfirmed === true; })
        : filteredByDate;
    var mergedJobs = mergeJobsByPNR(filteredJobs);
    console.log('Merged Jobs with isConfirmed/isCancel:', mergedJobs);
    var totalPages = Math.ceil(mergedJobs.length / pageSize);
    var pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize);
    // console.log("Merged Jobs:", pagedJobs);
    var summary = (React.createElement("div", { className: "w-full flex justify-end mb-6" },
        React.createElement("div", { className: "flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl" }, ['All Jobs', 'New Jobs', 'Changed Jobs'].map(function (label, i) { return (React.createElement("div", { key: i, className: "flex items-center gap-2" },
            React.createElement("span", { className: "inline-block w-3 h-3 rounded-full " + ['bg-neutral-700', 'bg-cyan-600', 'bg-orange-400'][i] }),
            React.createElement("span", { className: "text-gray-500" },
                label,
                ":"),
            React.createElement("span", { className: "font-Arial text-[#2D3E92]" }, i === 0 ? filteredByDate.length : filteredByDate.filter(function (job) { return i === 1 ? job.isNew : job.isChange; }).length))); }))));
    var fetchJobs = function (token, startDate, endDate) { return __awaiter(_this, void 0, void 0, function () {
        var res, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1["default"].post('https://operation.dth.travel:7082/api/guide/job', { token: token, startdate: startDate, enddate: endDate })];
                case 2:
                    res = _a.sent();
                    setJobs(res.data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "flex flex-col items-center py-8 min-h-screen bg-base-200 relative bg-[#9EE4F6]" },
            summary,
            React.createElement("div", { className: "bg-[#F9FAFB] rounded-3xl shadow-lg border border-gray-300 w-full max-w-7xl p-6" },
                React.createElement("div", { className: "p-4 w-full overflow-auto bg-[#F9FAFB]" },
                    React.createElement("h1", { className: "text-2xl font-Arial mb-4" }, "Jobs List"),
                    React.createElement("div", { className: "mb-6 flex flex-col items-center w-full px-4" },
                        React.createElement("div", { className: "w-full rounded-xl shadow-md px-4 py-4 flex flex-row items-center justify-between gap-2", style: { backgroundColor: '#E6F0FA', border: '1px solid #2D3E92' } }, ['Start date', 'End date'].map(function (label, i) { return (React.createElement("div", { key: i, className: "flex flex-col w-[48%]" },
                            React.createElement("label", { htmlFor: "" + label.toLowerCase().replace(' ', '-'), className: "mb-1 text-xs text-gray-500 font-Arial" }, label),
                            React.createElement("input", { id: "" + label.toLowerCase().replace(' ', '-'), type: "date", value: i === 0 ? startDate : endDate, onChange: function (e) {
                                    var newDate = e.target.value;
                                    i === 0 ? setStartDate(newDate) : setEndDate(newDate);
                                    fetchJobs(localStorage.getItem('token') || '', i === 0 ? newDate : startDate, i === 0 ? endDate : newDate);
                                }, className: "input input-bordered w-full" }))); })),
                        React.createElement("span", { className: "mt-2 text-xs text-gray-400 text-center px-2" }, "Please select a date range to filter the desired tasks.")),
                    React.createElement("input", { type: "checkbox", id: "showConfirmedOnly", checked: showConfirmedOnly, onChange: function (e) { return setShowConfirmedOnly(e.target.checked); }, className: "checkbox checkbox-primary" }),
                    React.createElement("label", { htmlFor: "showConfirmedOnly", className: "font-Arial text-sm text-gray-700 cursor-pointer" }, "Show Confirmed Only"),
                    React.createElement(StatusMessage_1["default"], { loading: loading, error: error, filteredJobsLength: filteredByDate.length }),
                    !loading && !error && filteredByDate.length > 0 && (
                    // render list jobs
                    React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, pagedJobs.map(function (job) {
                            var _a;
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
                                    } }, ((_a = job.all) === null || _a === void 0 ? void 0 : _a.filter(function (j) {
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
                        })),
                        React.createElement("div", { className: "w-full flex justify-center mt-6" },
                            React.createElement("div", { className: "inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full shadow px-4 py-2" },
                                React.createElement("button", { className: "btn btn-outline btn-sm rounded-full min-w-[64px]", disabled: page === 1, onClick: function () { return setPage(page - 1); } }, "Prev"),
                                React.createElement("span", { className: "px-2 py-1 font-Arial text-base-content" },
                                    page,
                                    " ",
                                    React.createElement("span", { className: "text-gray-400" }, "/"),
                                    " ",
                                    totalPages),
                                React.createElement("button", { className: "btn btn-outline btn-sm rounded-full min-w-[64px]", disabled: page === totalPages, onClick: function () { return setPage(page + 1); } }, "Next"))),
                        detailJobs && (React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" },
                            React.createElement("div", { className: "bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-2xl w-full relative animate-fade-in" },
                                React.createElement("button", { className: "absolute top-2 right-2 btn btn-sm btn-error", onClick: function () { return setDetailJobs(null); } }, "\u2715"),
                                React.createElement("h2", { className: "text-xl font-Arial mb-4" }, "All Job Details"),
                                renderAllDetails(detailJobs)))))))))));
}
exports["default"] = JobsList;
