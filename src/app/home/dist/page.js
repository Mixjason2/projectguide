'use client';
"use strict";
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
            setJobs(data);
            setLoading(false);
        })["catch"](function (err) {
            setError(err.message);
            setLoading(false);
        });
    }, []);
    var columns = jobs.length > 0 ? Object.keys(jobs[0]) : [];
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
                                React.createElement("tr", null,
                                    columns.map(function (key) { return (React.createElement("th", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 bg-base-200 text-lg font-semibold text-gray-700" }, key)); }),
                                    React.createElement("th", { className: "border border-base-300 whitespace-nowrap px-8 py-4 bg-base-200 text-lg font-semibold text-gray-700" }, "Action"))),
                            React.createElement("tbody", { className: "divide-y divide-base-300" }, filteredJobs.map(function (job) { return (React.createElement("tr", { key: job.key, className: "divide-x divide-base-300" },
                                columns.map(function (key) { return (React.createElement("td", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" }, String(job[key]))); }),
                                React.createElement("td", { className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" },
                                    React.createElement("div", { className: "flex gap-2" },
                                        React.createElement("button", { className: "px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition", onClick: function () { return alert("Accepted job #" + job.key); } }, "Accept"),
                                        React.createElement("button", { className: "px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition", onClick: function () { return alert("Rejected job #" + job.key); } }, "Reject"))))); }))))))))));
}
exports["default"] = JobsList;
