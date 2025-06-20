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
var react_1 = require("react");
var cssguide_1 = require("../cssguide");
var axios_1 = require("axios");
var StatusMessage_1 = require("@/app/component/StatusMessage");
var ConfirmedFilter_1 = require("@/app/component/ConfirmedFilter");
var JobsSummary_1 = require("@/app/component/JobsSummary");
var JobCard_1 = require("@/app/component/JobCard");
var AllJobDetailsModal_1 = require("@/app/component/AllJobDetailsModal");
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
                if (k === "IsConfirmed" || k === "IsCancel") {
                    map[job.PNR].merged[k] = Boolean(prev) || Boolean(curr);
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
var getToday = function () { return new Date().toISOString().slice(0, 10); };
var getEndOfMonth = function () {
    return new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);
};
function JobsList() {
    var _a = react_1.useState(''), startDate = _a[0], setStartDate = _a[1];
    var _b = react_1.useState(''), endDate = _b[0], setEndDate = _b[1];
    var _c = react_1.useState([]), jobs = _c[0], setJobs = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    var _f = react_1.useState(null), detailJobs = _f[0], setDetailJobs = _f[1];
    var _g = react_1.useState(1), page = _g[0], setPage = _g[1];
    var _h = react_1.useState({}), expandedPNRs = _h[0], setExpandedPNRs = _h[1];
    var _j = react_1.useState(false), showConfirmedOnly = _j[0], setShowConfirmedOnly = _j[1];
    var pageSize = 6;
    var isFetching = react_1.useRef(false);
    // โหลดวันที่และ jobs cache ตอน mount
    react_1.useEffect(function () {
        if (typeof window === "undefined")
            return;
        var token = localStorage.getItem('token');
        if (!token) {
            setStartDate(getToday());
            setEndDate(getEndOfMonth());
            localStorage.removeItem('startDate');
            localStorage.removeItem('endDate');
            setJobs([]);
        }
        else {
            var savedStart = localStorage.getItem('startDate');
            var savedEnd = localStorage.getItem('endDate');
            var useStart = savedStart || getToday();
            var useEnd = savedEnd || getEndOfMonth();
            setStartDate(useStart);
            setEndDate(useEnd);
            // โหลด jobs cache ตามช่วงวัน
            var cacheKey = "jobs_" + useStart + "_" + useEnd;
            var cachedJobs = localStorage.getItem(cacheKey);
            if (cachedJobs)
                setJobs(JSON.parse(cachedJobs));
        }
    }, []);
    // เวลาเปลี่ยนวันหรือ login ใหม่
    react_1.useEffect(function () {
        if (!startDate || !endDate)
            return;
        if (typeof window === "undefined")
            return;
        var token = localStorage.getItem('token');
        if (!token)
            return;
        var cacheKey = "jobs_" + startDate + "_" + endDate;
        var cachedJobs = localStorage.getItem(cacheKey);
        if (cachedJobs) {
            setJobs(JSON.parse(cachedJobs));
            return;
        }
        // fetch ใหม่ถ้าไม่มีใน cache
        if (isFetching.current)
            return;
        isFetching.current = true;
        setLoading(true);
        setError(null);
        axios_1["default"].post('https://operation.dth.travel:7082/api/guide/job', {
            token: token,
            startdate: startDate,
            enddate: endDate
        })
            .then(function (res) {
            setJobs(res.data);
            localStorage.setItem(cacheKey, JSON.stringify(res.data));
        })["catch"](function (err) {
            setError(err.message || 'Error fetching jobs');
            setJobs([]);
        })["finally"](function () {
            setLoading(false);
            isFetching.current = false;
        });
    }, [startDate, endDate]);
    // กรองข้อมูลตามวันที่และสถานะยืนยัน
    var filteredByDate = jobs.filter(function (job) {
        var pickup = job.PickupDate, dropoff = job.DropoffDate;
        return (!startDate || pickup >= startDate) && (!endDate || dropoff <= endDate);
    });
    var filteredJobs = showConfirmedOnly
        ? filteredByDate.filter(function (job) { return job.IsConfirmed === true; })
        : filteredByDate;
    var mergedJobs = mergeJobsByPNR(filteredJobs);
    var totalPages = Math.ceil(mergedJobs.length / pageSize);
    var pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize);
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "flex flex-col items-center py-8 min-h-screen bg-base-200 relative bg-[#9EE4F6]" },
            React.createElement(JobsSummary_1["default"], { filteredByDate: filteredByDate }),
            React.createElement("div", { className: "bg-[#F9FAFB] rounded-3xl shadow-lg border border-gray-300 w-full max-w-7xl p-6" },
                React.createElement("div", { className: "p-4 w-full overflow-auto bg-[#F9FAFB]" },
                    React.createElement("h1", { className: "text-2xl font-Arial mb-4" }, "Jobs List"),
                    React.createElement("div", { className: "mb-6 flex flex-col items-center w-full px-4" },
                        React.createElement("div", { className: "w-full rounded-xl shadow-md px-4 py-4 flex flex-row items-center justify-between gap-2", style: { backgroundColor: '#E6F0FA', border: '1px solid #2D3E92' } }, ['Start date', 'End date'].map(function (label, i) { return (React.createElement("div", { key: i, className: "flex flex-col w-[48%]" },
                            React.createElement("label", { htmlFor: "" + label.toLowerCase().replace(' ', '-'), className: "mb-1 text-xs text-gray-500 font-Arial" }, label),
                            React.createElement("input", { id: "" + label.toLowerCase().replace(' ', '-'), type: "date", value: i === 0 ? startDate : endDate, onChange: function (e) {
                                    var newDate = e.target.value;
                                    if (i === 0)
                                        setStartDate(newDate);
                                    else
                                        setEndDate(newDate);
                                    setPage(1);
                                    // โหลด jobs cache ตามช่วงวันใหม่
                                    var cacheKey = "jobs_" + (i === 0 ? newDate : startDate) + "_" + (i === 0 ? endDate : newDate);
                                    var cachedJobs = localStorage.getItem(cacheKey);
                                    if (cachedJobs)
                                        setJobs(JSON.parse(cachedJobs));
                                }, className: "input input-bordered w-full" }))); })),
                        React.createElement("span", { className: "mt-2 text-xs text-gray-400 text-center px-2" }, "Please select a date range to filter the desired tasks.")),
                    React.createElement(ConfirmedFilter_1["default"], { showConfirmedOnly: showConfirmedOnly, onChange: setShowConfirmedOnly }),
                    React.createElement(StatusMessage_1["default"], { loading: loading, error: error, filteredJobsLength: filteredByDate.length }),
                    !loading && !error && filteredByDate.length > 0 && (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, pagedJobs.map(function (job) { return (React.createElement(JobCard_1["default"], { key: job.PNR, job: job, expandedPNRs: expandedPNRs, setExpandedPNRs: setExpandedPNRs, setDetailJobs: setDetailJobs, jobs: jobs, setJobs: setJobs })); })),
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
                        React.createElement(AllJobDetailsModal_1["default"], { detailJobs: detailJobs, setDetailJobs: setDetailJobs }))))))));
}
exports["default"] = JobsList;
