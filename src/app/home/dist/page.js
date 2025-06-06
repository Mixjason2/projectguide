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
var navigation_1 = require("next/navigation");
var cssguide_1 = require("../cssguide");
function JobsList() {
    var _a = react_1.useState([]), jobs = _a[0], setJobs = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    // Set your default start and end date here (YYYY-MM-DD)
    var defaultStart = '2025-01-01'; // <-- change as needed
    var defaultEnd = '2025-01-31'; // <-- change as needed
    var _d = react_1.useState(defaultStart), startDate = _d[0], setStartDate = _d[1];
    var _e = react_1.useState(defaultEnd), endDate = _e[0], setEndDate = _e[1];
    var router = navigation_1.useRouter();
    react_1.useEffect(function () {
        setLoading(true);
        fetch('/api/guide/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: 'AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tquHz0YvTfZ//YHCHoAonEi4',
                startdate: '2025-01-01',
                enddate: '2025-01-31'
            })
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Failed to fetch');
            return res.json();
        })
            .then(function (data) {
            // Add Remark field to each job if not present
            setJobs(data.map(function (job) {
                var _a;
                return (__assign(__assign({}, job), { Remark: (_a = job.Remark) !== null && _a !== void 0 ? _a : '' }));
            }));
            setLoading(false);
        })["catch"](function (err) {
            setError(err.message);
            setLoading(false);
        });
    }, []);
    // Move "Remark" to the last column, "Photo" before it
    var columns = jobs.length > 0
        ? __spreadArrays(Object.keys(jobs[0]).filter(function (k) { return k !== 'Photo' && k !== 'Remark'; }), [
            'Photo',
            'Remark'
        ]) : ['Photo', 'Remark'];
    // Filter jobs by date range (PickupDate or DropoffDate within range)
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
    // Handle photo upload (optional, for demo only, not persistent)
    var handlePhotoChange = function (jobKey, file) {
        if (!file)
            return;
        setJobs(function (prev) {
            return prev.map(function (job) {
                return job.key === jobKey ? __assign(__assign({}, job), { Photo: URL.createObjectURL(file) }) : job;
            });
        });
    };
    // Handle remark change
    var handleRemarkChange = function (jobKey, remark) {
        setJobs(function (prev) {
            return prev.map(function (job) {
                return job.key === jobKey ? __assign(__assign({}, job), { Remark: remark }) : job;
            });
        });
    };
    // Example function to send remark to API server
    var sendRemark = function (jobKey, remark) {
        fetch('/api/guide/remark', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jobKey: jobKey, remark: remark })
        })
            .then(function (res) { return res.json(); })
            .then(function (data) {
            alert('Remark sent!');
        })["catch"](function (err) {
            alert('Failed to send remark');
        });
    };
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "overflow-x-auto flex justify-center py-8" },
            React.createElement("div", { className: "bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-5xl" },
                React.createElement("div", { className: "p-4 w-full min-h-screen" },
                    React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Jobs List"),
                    React.createElement("div", { className: "mb-4 flex gap-2 items-center" },
                        React.createElement("input", { type: "date", value: startDate, max: endDate, onChange: function (e) { return setStartDate(e.target.value); }, className: "input input-bordered", placeholder: "Start date" }),
                        React.createElement("span", { className: "mx-2" }, "to"),
                        React.createElement("input", { type: "date", value: endDate, min: startDate, onChange: function (e) { return setEndDate(e.target.value); }, className: "input input-bordered", placeholder: "End date" })),
                    loading ? (React.createElement("div", { className: "p-4 " }, "Loading jobs...")) : error ? (React.createElement("div", { className: "p-4 text-red-600" },
                        "Error: ",
                        error)) : !jobs.length ? (React.createElement("div", { className: "p-4" }, "No jobs found")) : (React.createElement("div", { className: "overflow-x-auto overflow-y-auto max-h-[500px]" },
                        React.createElement("table", { className: "table table-zebra table-bordered table-auto divide-y divide-base-300" },
                            React.createElement("thead", { className: "divide-y divide-base-300" },
                                React.createElement("tr", null, columns.map(function (key) { return (React.createElement("th", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 bg-base-200 text-lg font-semibold text-gray-700" }, key)); }))),
                            React.createElement("tbody", { className: "divide-y divide-base-300" }, filteredJobs.map(function (job) { return (React.createElement("tr", { key: job.key, className: "divide-x divide-base-300" },
                                columns.map(function (key) {
                                    var _a, _b, _c;
                                    return key === 'Photo' ? (React.createElement("td", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" }, job.Photo ? (React.createElement("img", { src: job.Photo, alt: "Job Photo", className: "w-16 h-16 object-cover rounded" })) : (React.createElement("input", { type: "file", accept: "image/*", onChange: function (e) {
                                            return handlePhotoChange(job.key, e.target.files ? e.target.files[0] : null);
                                        } })))) : key === 'Remark' ? (React.createElement("td", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" },
                                        React.createElement("div", { className: "flex gap-2 items-center" },
                                            React.createElement("input", { type: "text", value: (_a = job.Remark) !== null && _a !== void 0 ? _a : '', onChange: function (e) {
                                                    return handleRemarkChange(job.key, e.target.value);
                                                }, className: "input input-bordered", placeholder: "Remark" }),
                                            React.createElement("button", { className: "btn btn-sm btn-primary", onClick: function () { var _a; return sendRemark(job.key, (_a = job.Remark) !== null && _a !== void 0 ? _a : ''); } }, "Send")))) : key === 'NotAvailable' ? (React.createElement("td", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" }, typeof job.NotAvailable === 'object'
                                        ? JSON.stringify(job.NotAvailable)
                                        : String((_b = job.NotAvailable) !== null && _b !== void 0 ? _b : ''))) : (React.createElement("td", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" }, String((_c = job[key]) !== null && _c !== void 0 ? _c : '')));
                                }),
                                React.createElement("td", { className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" },
                                    React.createElement("div", { className: "flex gap-2" },
                                        React.createElement("button", { className: "px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition", onClick: function () { return alert("Accepted job #" + job.key); } }, "Accept"),
                                        React.createElement("button", { className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition", onClick: function () { return alert("Rejected job #" + job.key); } }, "Reject"))))); }))))))))));
}
exports["default"] = JobsList;
