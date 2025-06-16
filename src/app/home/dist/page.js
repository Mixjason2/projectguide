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
var axios_1 = require("axios");
var react_spinners_css_1 = require("react-spinners-css");
function mergeJobsByPNR(jobs) {
    var map = {};
    for (var _i = 0, jobs_1 = jobs; _i < jobs_1.length; _i++) {
        var job = jobs_1[_i];
        if (!map[job.PNR]) {
            map[job.PNR] = { merged: __assign(__assign({}, job), { keys: [job.key] }), all: [job] };
        }
        else {
            map[job.PNR].merged.keys.push(job.key);
            map[job.PNR].all.push(job);
            // Merge fields: if different, make array of unique values
            for (var _a = 0, _b = Object.keys(job); _a < _b.length; _a++) {
                var k = _b[_a];
                if (k === 'key' || k === 'Photo' || k === 'Remark')
                    continue;
                var prev = map[job.PNR].merged[k];
                var curr = job[k];
                if (Array.isArray(prev)) {
                    if (!prev.includes(curr))
                        prev.push(curr);
                }
                else if (prev !== curr) {
                    map[job.PNR].merged[k] = [prev, curr].filter(function (v, i, arr) { return arr.indexOf(v) === i; });
                }
            }
        }
    }
    return Object.entries(map).map(function (_a) {
        var pnr = _a[0], data = _a[1];
        return (__assign(__assign({}, data.merged), { PNR: pnr, all: data.all }));
    });
}
function getToday() {
    var d = new Date();
    return d.toISOString().slice(0, 10);
}
function getEndOfMonth() {
    var d = new Date();
    d.setMonth(d.getMonth() + 1, 0); // set to last day of this month
    return d.toISOString().slice(0, 10);
}
function JobsList() {
    var _this = this;
    var _a = react_1.useState([]), jobs = _a[0], setJobs = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(null), detailJobs = _d[0], setDetailJobs = _d[1];
    var _e = react_1.useState(getToday()), startDate = _e[0], setStartDate = _e[1];
    var _f = react_1.useState(getEndOfMonth()), endDate = _f[0], setEndDate = _f[1];
    var _g = react_1.useState(1), page = _g[0], setPage = _g[1];
    var _h = react_1.useState(null), uploadJob = _h[0], setUploadJob = _h[1];
    var _j = react_1.useState({}), expandedPNRs = _j[0], setExpandedPNRs = _j[1];
    var _k = react_1.useState([]), acceptedPNRs = _k[0], setAcceptedPNRs = _k[1];
    var _l = react_1.useState([]), rejectPNRs = _l[0], setrejectPNRs = _l[1];
    var _m = react_1.useState(true), isLoadingJobs = _m[0], setIsLoadingJobs = _m[1];
    var pageSize = 6;
    react_1.useEffect(function () {
        var token = localStorage.getItem("token") || "";
        setLoading(true); // ตั้งค่า loading เป็น true ก่อนเริ่ม fetch
        fetch('https://operation.dth.travel:7082/api/guide/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: "yMaEinVpfboebobeC8x5fsVRXjKf4Gw2xrpnVaNpIyv8YaCuVFaqsyjnDdWt66IpXm8LNYpPcWnTNf0uF0VbfcKMfY7HdatLCHNLw3f8kQtk/qTyUEcIkQTzUG45tLh+lVMJc++IZ9eoCi/NFpd4iTyhYWUaB1RC+Ef7nwNJ6zY=",
                startdate: "2025-05-01",
                enddate: "2025-05-31"
            })
        })
            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!res.ok) return [3 /*break*/, 2];
                        _a = Error.bind;
                        return [4 /*yield*/, res.text()];
                    case 1: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                    case 2: return [2 /*return*/, res.json()];
                }
            });
        }); })
            .then(function (data) {
            console.log("API jobs:", data);
            setJobs(data);
        })["catch"](function (err) { return setError(err.message); })["finally"](function () { return setLoading(false); }); // ตั้งค่า loading เป็น false หลังจาก fetch เสร็จ
    }, []);
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
    var mergedJobs = mergeJobsByPNR(filteredJobs);
    var totalPages = Math.ceil(mergedJobs.length / pageSize);
    var pagedJobs = mergedJobs.slice((page - 1) * pageSize, page * pageSize);
    // Helper to format date and time, keep only วัน/เดือน/ปี (YYYY-MM-DD)
    function formatDate(dateStr) {
        if (!dateStr)
            return '';
        if (typeof dateStr !== 'string') {
            // ถ้าไม่ใช่ string แปลงเป็น string ก่อน
            dateStr = String(dateStr);
        }
        var match = dateStr.match(/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2})?/);
        return match ? match[0].replace('T', ' ') : dateStr; // แปลง 'T' เป็น ' ' เพื่อแสดงเวลา
    }
    // Helper to combine Pickup + PickupDate, Dropoff + DropoffDate
    function renderPlaceDate(place, date, label) {
        if (!place && !date)
            return null;
        return (React.createElement("div", null,
            React.createElement("span", { className: "font-Arial" },
                label,
                ":"),
            ' ',
            place ? place : '',
            place && date ? ' - ' : '',
            date ? formatDate(date) : ''));
    }
    // Helper to render value or array of values
    var renderField = function (label, value) {
        if (label === 'BSL ID' || label === 'Pickup' || label === 'PickupDate' || label === 'Dropoff' || label === 'DropoffDate')
            return null; // Remove BSL ID and handled fields
        if (Array.isArray(value)) {
            return (React.createElement("div", null,
                React.createElement("span", { className: "font-Arial" },
                    label,
                    ":"),
                React.createElement("ul", { className: "list-disc ml-6" }, value.map(function (v, i) { return (React.createElement("li", { key: i }, String(v))); }))));
        }
        return (React.createElement("div", null,
            React.createElement("span", { className: "font-Arial" },
                label,
                ":"),
            " ",
            String(value)));
    };
    // Render all job details for a PNR
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
                PNRDate: job.PNRDate
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
        return (React.createElement("div", { className: "max-h-[60vh] overflow-auto" }, Object.values(groupedJobs).map(function (_a, idx) {
            var job = _a.job, typeNames = _a.typeNames;
            return (React.createElement("div", { key: job.key + "-" + idx, className: "mb-4 border-b border-gray-200 pb-4 last:border-b-0" },
                React.createElement("div", { className: "font-Arial text-[#2D3E92] mb-2 underline underline-offset-4" },
                    "PNR: ",
                    job.PNR),
                React.createElement("div", { className: "grid grid-cols-1 gap-y-4 text-sm" },
                    React.createElement("div", { className: "flex items-start" },
                        React.createElement("span", { className: "font-bold text-gray-600 w-28 shrink-0" }, "Pickup:"),
                        React.createElement("span", { className: "text-gray-800 break-words", style: {
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                overflowWrap: "break-word"
                            } },
                            job.Pickup,
                            job.Pickup && job.PickupDate ? " - " : "",
                            job.PickupDate ? formatDate(job.PickupDate) : "")),
                    React.createElement("div", { className: "flex items-start" },
                        React.createElement("span", { className: "font-bold text-gray-600 w-28 shrink-0" }, "Dropoff:"),
                        React.createElement("span", { className: "text-gray-800 break-words", style: {
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                overflowWrap: "break-word"
                            } },
                            job.Dropoff,
                            job.Dropoff && job.DropoffDate ? " - " : "",
                            job.DropoffDate ? formatDate(job.DropoffDate) : "")),
                    React.createElement("div", { className: "flex items-start" },
                        React.createElement("span", { className: "font-bold text-gray-600 w-28 shrink-0" }, "Booking Consultant:"),
                        React.createElement("span", { className: "text-gray-800 break-words", style: {
                                wordBreak: "break-word",
                                whiteSpace: "normal",
                                overflowWrap: "break-word"
                            } },
                            job.Booking_Consultant,
                            job.Booking_Consultant && job.Phone ? ", " : "",
                            job.Phone)),
                    Object.entries(job)
                        .filter(function (_a) {
                        var k = _a[0];
                        return ![
                            "IsConfirmed",
                            "IsCancel",
                            "key",
                            "BSL_ID",
                            "Pickup",
                            "PickupDate",
                            "Dropoff",
                            "DropoffDate",
                            "PNRDate",
                            "all",
                            "keys",
                            "isNew",
                            "isChange",
                            "isDelete",
                            "PNR",
                            "NotAvailable",
                            "agentCode",
                            "agentLogo",
                            "serviceTypeName",
                            "TypeName",
                            "SupplierCode_TP",
                            "SupplierName_TP",
                            "ProductName_TP",
                            "ServiceLocationName",
                            "serviceSupplierCode_TP",
                            "serviceProductName",
                            "serviceSupplierName",
                            "ServiceLocationName_TP",
                            "Source",
                            "Phone",
                            "Booking_Consultant",
                            "AdultQty",
                            "ChildQty",
                            "ChildShareQty",
                            "InfantQty",
                        ].includes(k);
                    })
                        .map(function (_a) {
                        var k = _a[0], v = _a[1];
                        var label = k;
                        if (k === "serviceSupplierCode_TP")
                            label = "SupplierCode_TP";
                        if (k === "serviceProductName")
                            label = "ProductName";
                        if (k === "serviceSupplierName")
                            label = "Supplier";
                        if (k === "ServiceLocationName")
                            label = "Location";
                        return (React.createElement("div", { key: k, className: "flex items-start" },
                            React.createElement("span", { className: "font-bold text-gray-600 w-28 shrink-0" },
                                label,
                                ":"),
                            React.createElement("span", { className: "text-gray-800 break-words", style: {
                                    wordBreak: "break-word",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word"
                                } }, typeof v === "object" ? JSON.stringify(v) : String(v))));
                    })),
                React.createElement("div", { className: "flex items-center mt-4" },
                    React.createElement("span", { className: "font-bold text-gray-600 w-28 shrink-0" }, "TypeName:"),
                    React.createElement("span", { className: "text-gray-800 break-words", style: {
                            wordBreak: "break-word",
                            whiteSpace: "normal",
                            overflowWrap: "break-word"
                        } }, __spreadArrays(new Set(typeNames)).join(", "))),
                React.createElement("div", { className: "overflow-x-auto mt-4" },
                    React.createElement("table", { className: "table-auto border text-sm w-full" },
                        React.createElement("thead", { className: "bg-[#2D3E92] text-white" },
                            React.createElement("tr", null,
                                React.createElement("th", { className: "px-2 py-1 text-left" }, "AdultQty"),
                                React.createElement("th", { className: "px-2 py-1 text-left" }, "ChildQty"),
                                React.createElement("th", { className: "px-2 py-1 text-left" }, "ChildShareQty"),
                                React.createElement("th", { className: "px-2 py-1 text-left" }, "InfantQty"))),
                        React.createElement("tbody", null,
                            React.createElement("tr", null,
                                React.createElement("td", { className: "px-2 py-1 text-left" }, job.AdultQty || 0),
                                React.createElement("td", { className: "px-2 py-1 text-left" }, job.ChildQty || 0),
                                React.createElement("td", { className: "px-2 py-1 text-left" }, job.ChildShareQty || 0),
                                React.createElement("td", { className: "px-2 py-1 text-left" }, job.InfantQty || 0)))))));
        })));
    };
    // ปรับ summary เป็นแถวแนวนอน สวยงาม และวางไว้บนหัว card Jobs List
    var summary = (React.createElement("div", { className: "w-full flex justify-end mb-6" },
        React.createElement("div", { className: "flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl" },
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("span", { className: "inline-block w-3 h-3 rounded-full bg-gray-400" }),
                React.createElement("span", { className: "text-gray-500" }, "All Jobs:"),
                React.createElement("span", { className: "font-Arial text-[#2D3E92]" }, filteredJobs.length)),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("span", { className: "inline-block w-3 h-3 rounded-full bg-cyan-600" }),
                React.createElement("span", { className: "text-gray-500" }, "New Jobs:"),
                React.createElement("span", { className: "font-Arial text-[#2D3E92]" }, filteredJobs.filter(function (job) { return job.isNew === true; }).length)),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("span", { className: "inline-block w-3 h-3 rounded-full bg-orange-400" }),
                React.createElement("span", { className: "text-gray-500" }, "Changed Jobs:"),
                React.createElement("span", { className: "font-Arial text-[#2D3E92]" }, filteredJobs.filter(function (job) { return job.isChange === true; }).length)))));
    function fetchJobs(token, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function () {
            var res, _a, data, err_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, 7, 8]);
                        return [4 /*yield*/, fetch('https://operation.dth.travel:7082/api/guide/job', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ token: token, startdate: startDate, enddate: endDate })
                            })];
                    case 2:
                        res = _b.sent();
                        if (!!res.ok) return [3 /*break*/, 4];
                        _a = Error.bind;
                        return [4 /*yield*/, res.text()];
                    case 3: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                    case 4: return [4 /*yield*/, res.json()];
                    case 5:
                        data = _b.sent();
                        setJobs(data);
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _b.sent();
                        setError(err_1.message);
                        return [3 /*break*/, 8];
                    case 7:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        });
    }
    return (React.createElement(cssguide_1["default"], null,
        React.createElement("div", { className: "flex flex-col items-center py-8 min-h-screen bg-base-200 relative bg-[#9EE4F6]" },
            summary,
            React.createElement("div", { className: "bg-[#F9FAFB] rounded-3xl shadow-lg border border-gray-300 w-full max-w-7xl p-6" },
                React.createElement("div", { className: "p-4 w-full /* min-h-screen */ overflow-auto bg-[#F9FAFB]" },
                    React.createElement("h1", { className: "text-2xl font-Arial mb-4" }, "Jobs List"),
                    React.createElement("div", { className: "mb-6 flex flex-col items-center w-full px-4" },
                        React.createElement("div", { className: "w-full rounded-xl shadow-md px-4 py-4 flex flex-row items-end justify-between gap-2", style: {
                                backgroundColor: '#E6F0FA',
                                border: '1px solid #2D3E92'
                            } },
                            React.createElement("div", { className: "flex flex-col w-[48%]" },
                                React.createElement("label", { htmlFor: "start-date", className: "mb-1 text-xs text-gray-500 font-Arial" }, "Start date"),
                                React.createElement("input", { id: "start-date", type: "date", value: startDate, max: endDate, onChange: function (e) { return setStartDate(e.target.value); }, className: "input input-bordered w-full", placeholder: "Start date" })),
                            React.createElement("div", { className: "flex flex-col w-[48%]" },
                                React.createElement("label", { htmlFor: "end-date", className: "mb-1 text-xs text-gray-500 font-Arial" }, "End date"),
                                React.createElement("input", { id: "end-date", type: "date", value: endDate, min: startDate, onChange: function (e) { return setEndDate(e.target.value); }, className: "input input-bordered w-full", placeholder: "End date" }))),
                        React.createElement("span", { className: "mt-2 text-xs text-gray-400 text-center px-2" }, "Please select a date range to filter the desired tasks.")),
                    loading ? (React.createElement("div", { className: "w-full py-10 flex flex-col items-center justify-center text-gray-600" },
                        React.createElement(react_spinners_css_1.Ripple, { color: "#32cd32", size: "medium", text: "", textColor: "" }),
                        React.createElement("p", { className: "mt-4 text-lg font-medium" }, "Loading jobs, please wait..."))) : error ? (React.createElement("div", { className: "p-6 text-red-600 text-center bg-red-100 border border-red-300 rounded-md max-w-md mx-auto" },
                        React.createElement("p", { className: "text-lg font-semibold" }, "Oops! Something went wrong."),
                        React.createElement("p", { className: "text-sm mt-1" }, error))) : !filteredJobs.length ? (React.createElement("div", { className: "p-6 text-center text-gray-500" },
                        React.createElement("p", { className: "text-lg font-semibold" }, "No jobs found"),
                        React.createElement("p", { className: "text-sm mt-1" }, "Try adjusting your filters or search keyword."))) : (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" }, pagedJobs.map(function (job) {
                            var _a;
                            var isExpanded = (_a = expandedPNRs[job.PNR]) !== null && _a !== void 0 ? _a : false;
                            var toggleExpand = function () {
                                setExpandedPNRs(function (prev) {
                                    var _a;
                                    return (__assign(__assign({}, prev), (_a = {}, _a[job.PNR] = !isExpanded, _a)));
                                });
                            };
                            return (React.createElement("div", { key: job.PNR, className: "relative bg-white border border-[#9EE4F6] border-[1px] rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col" },
                                React.createElement("div", { className: "absolute top-2 left-1 text-[#ffffff] font-Arial rounded-full px-3 py-1 text-sm shadow z-10", style: {
                                        backgroundColor: job.isNew
                                            ? '#0891b2'
                                            : job.isChange
                                                ? '#fb923c'
                                                : '#E0E7FF'
                                    } }, job.all
                                    ? job.all.filter(function (j) {
                                        return j.Pickup !== job.Pickup ||
                                            j.PickupDate !== job.PickupDate ||
                                            j.Dropoff !== job.Dropoff ||
                                            j.DropoffDate !== job.DropoffDate ||
                                            j.PNRDate !== job.PNRDate;
                                    }).length + 1 // รวม job หลักด้วย
                                    : 1),
                                React.createElement("button", { className: "absolute top-3.5 right-2 w-8 h-8 rounded-full bg-white border-2 border-[#2D3E92] shadow-[0_4px_10px_rgba(45,62,146,0.3)] hover:shadow-[0_6px_14px_rgba(45,62,146,0.4)] transition-all duration-200 flex items-center justify-center", title: "Show all details", onClick: function () { return setDetailJobs(job.all); }, style: { zIndex: 2 } },
                                    React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none" },
                                        React.createElement("circle", { cx: "12", cy: "12", r: "10", fill: "#F0F8FF" }),
                                        React.createElement("text", { x: "12", y: "12", textAnchor: "middle", dominantBaseline: "central", fontSize: "18", fill: "#2D3E92", fontFamily: "Arial", fontWeight: "bold" }, "i"))),
                                React.createElement("div", { className: "inline-block p-6 pb-0 cursor-pointer mx-auto items-center gap-3", onClick: toggleExpand },
                                    React.createElement("h2", { className: "font-Arial mt-0 mb-0 underline underline-offset-4", style: { color: '#2D3E92', fontSize: '28px' } }, job.PNR)),
                                isExpanded && (React.createElement("div", { className: "p-6 pt-0 flex-1 flex flex-col" },
                                    React.createElement("div", { className: "text-sm text-gray-600 space-y-1 mb-4" },
                                        renderPlaceDate(job.Pickup, job.PickupDate, 'Pickup'),
                                        renderPlaceDate(job.Dropoff, job.DropoffDate, 'Dropoff'),
                                        renderField('Pax', job.Pax),
                                        renderField('Source', job.Source)),
                                    jobs
                                        .filter(function (j) { return j.PNR === job.PNR && j.key !== job.key; })
                                        .filter(function (j) {
                                        return j.Pickup !== job.Pickup ||
                                            j.PickupDate !== job.PickupDate ||
                                            j.Dropoff !== job.Dropoff ||
                                            j.DropoffDate !== job.DropoffDate ||
                                            j.Pax !== job.Pax ||
                                            j.Source !== job.Source;
                                    })
                                        .map(function (relatedJob) { return (React.createElement("div", { key: relatedJob.key, className: "bg-gray-100 border border-gray-300 rounded p-3 mb-4 text-sm text-gray-700" },
                                        React.createElement("div", { className: "font-semibold text-gray-800 mb-1" }, "Another PNR"),
                                        renderPlaceDate(relatedJob.Pickup, relatedJob.PickupDate, 'Pickup'),
                                        renderPlaceDate(relatedJob.Dropoff, relatedJob.DropoffDate, 'Dropoff'),
                                        renderField('Pax', relatedJob.Pax),
                                        renderField('Source', relatedJob.Source))); }),
                                    !acceptedPNRs.includes(job.PNR) && !rejectPNRs.includes(job.PNR) && (React.createElement("div", { className: "flex gap-3 mt-auto flex-wrap" },
                                        React.createElement("button", { className: "btn btn-success flex-1 text-base font-Arial py-2 rounded-full shadow text-white bg-[#95c941] hover:opacity-90", onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                var token, response, result, e_1;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            token = localStorage.getItem("token") || "";
                                                            return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", {
                                                                    token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                                                                    data: { isConfirmed: true }
                                                                })];
                                                        case 1:
                                                            response = _a.sent();
                                                            result = response.data;
                                                            if (result.success) {
                                                                alert("Accept งานสำเร็จ");
                                                                setAcceptedPNRs(function (prev) { return __spreadArrays(prev, [job.PNR]); });
                                                                setJobs(function (prevJobs) {
                                                                    var remaining = prevJobs.filter(function (j) { return j.key !== job.key; });
                                                                    return __spreadArrays([job], remaining);
                                                                });
                                                            }
                                                            else {
                                                                alert("Accept งานไม่สำเร็จ: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error"));
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            e_1 = _a.sent();
                                                            alert("เกิดข้อผิดพลาด: " + e_1.message);
                                                            return [3 /*break*/, 3];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); } }, "Accept"),
                                        React.createElement("button", { className: "btn flex-1 text-base font-Arial py-2 rounded-full shadow text-white bg-[#E44949] hover:opacity-90", onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                var token, response, result, e_2;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            token = localStorage.getItem("token") || "";
                                                            return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", {
                                                                    token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                                                                    data: { isCancel: true }
                                                                })];
                                                        case 1:
                                                            response = _a.sent();
                                                            result = response.data;
                                                            if (result.success) {
                                                                alert("แจ้งยกเลิกงานสำเร็จ กรุณารอหลังบ้านส่งอีเมลยืนยันสักครู่");
                                                                // เพิ่มตรงนี้เพื่อให้ปุ่มหายเหมือน Accept
                                                                setrejectPNRs(function (prev) { return __spreadArrays(prev, [job.PNR]); });
                                                                setJobs(function (prevJobs) {
                                                                    var remaining = prevJobs.filter(function (j) { return j.key !== job.key; });
                                                                    return __spreadArrays([job], remaining);
                                                                });
                                                            }
                                                            else {
                                                                alert("แจ้งยกเลิกงานไม่สำเร็จ: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error"));
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            e_2 = _a.sent();
                                                            alert("เกิดข้อผิดพลาด: " + e_2.message);
                                                            return [3 /*break*/, 3];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); } }, "Reject Job")))))));
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
