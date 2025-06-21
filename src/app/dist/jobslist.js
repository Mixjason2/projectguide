'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var cssguide_1 = require("../cssguide");
var axios_1 = require("axios");
var getToday = function () { return new Date().toISOString().slice(0, 10); };
var getEndOfMonth = function () {
    return new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);
};
function JobsList() {
    var _a = react_1.useState(getToday()), startDate = _a[0], setStartDate = _a[1];
    var _b = react_1.useState(getEndOfMonth()), endDate = _b[0], setEndDate = _b[1];
    var _c = react_1.useState([]), jobs = _c[0], setJobs = _c[1];
    var _d = react_1.useState(false), loading = _d[0], setLoading = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    react_1.useEffect(function () {
        var token = localStorage.getItem('token');
        if (!token) {
            setJobs([]);
            setError("Token not found. Please log in.");
            return;
        }
        setLoading(true);
        setError(null);
        axios_1["default"].post('https://operation.dth.travel:7082/api/guide/job', {
            token: token,
            startdate: startDate,
            enddate: endDate
        })
            .then(function (res) {
            setJobs(res.data);
        })["catch"](function (err) {
            setError(err.message || 'Error fetching jobs');
            setJobs([]);
        })["finally"](function () { return setLoading(false); });
    }, [startDate, endDate]);
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "p-6 max-w-3xl mx-auto" },
            React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Jobs List"),
            React.createElement("div", { className: "flex gap-4 mb-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm" }, "Start date"),
                    React.createElement("input", { type: "date", value: startDate, onChange: function (e) { return setStartDate(e.target.value); }, className: "input input-bordered" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "block text-sm" }, "End date"),
                    React.createElement("input", { type: "date", value: endDate, onChange: function (e) { return setEndDate(e.target.value); }, className: "input input-bordered" }))),
            loading && React.createElement("div", null, "Loading..."),
            error && React.createElement("div", { className: "text-red-500" }, error),
            !loading && !error && jobs.length === 0 && React.createElement("div", null, "No jobs found."),
            React.createElement("ul", { className: "divide-y" }, jobs.map(function (job) { return (React.createElement("li", { key: job.key, className: "py-3" },
                React.createElement("div", { className: "font-semibold" },
                    job.PNR,
                    " - ",
                    job.serviceProductName),
                React.createElement("div", null,
                    "Pickup: ",
                    job.Pickup,
                    " (",
                    job.PickupDate,
                    ")"),
                React.createElement("div", null,
                    "Dropoff: ",
                    job.Dropoff,
                    " (",
                    job.DropoffDate,
                    ")"),
                React.createElement("div", null,
                    "Status: ",
                    job.IsConfirmed ? "Confirmed" : "Not Confirmed",
                    " ",
                    job.isChange && React.createElement("span", { className: "text-orange-500" }, "(Changed)")))); })))));
}
exports["default"] = JobsList;
