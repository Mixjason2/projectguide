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
    var _d = react_1.useState('PNR'), searchKey = _d[0], setSearchKey = _d[1];
    var _e = react_1.useState(''), searchTerm = _e[0], setSearchTerm = _e[1];
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
    var filteredJobs = jobs.filter(function (job) {
        var value = job[searchKey];
        if (value === null || value === undefined)
            return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
    });
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "overflow-x-auto flex justify-center py-8" },
            React.createElement("div", { className: "bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-5xl" },
                React.createElement("div", { className: "p-4 w-full min-h-screen" },
                    React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Jobs List"),
                    React.createElement("div", { className: "mb-4 flex gap-2" },
                        React.createElement("select", { value: searchKey, onChange: function (e) { return setSearchKey(e.target.value); }, className: "input input-bordered" }, columns.map(function (key) { return (React.createElement("option", { key: key, value: key }, key)); })),
                        React.createElement("input", { type: "text", placeholder: "Search", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "input input-bordered" })),
                    loading ? (React.createElement("div", { className: "p-4 " }, "Loading jobs...")) : error ? (React.createElement("div", { className: "p-4 text-red-600" },
                        "Error: ",
                        error)) : !jobs.length ? (React.createElement("div", { className: "p-4" }, "No jobs found")) : (React.createElement("div", { className: "overflow-x-auto overflow-y-auto max-h-[500px]" },
                        React.createElement("table", { className: "table table-zebra table-bordered table-auto divide-y divide-base-300" },
                            React.createElement("thead", { className: "divide-y divide-base-300" },
                                React.createElement("tr", null, columns.map(function (key) { return (React.createElement("th", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 bg-base-200 text-lg font-semibold text-gray-700" }, key)); }))),
                            React.createElement("tbody", { className: "divide-y divide-base-300" }, filteredJobs.map(function (job) { return (React.createElement("tr", { key: job.key, className: "divide-x divide-base-300" }, columns.map(function (key) { return (React.createElement("td", { key: key, className: "border border-base-300 whitespace-nowrap px-8 py-4 text-base" }, String(job[key]))); }))); }))))))))));
}
exports["default"] = JobsList;
