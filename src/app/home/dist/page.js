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
    var pageSize = 6;
    react_1.useEffect(function () {
        var token = localStorage.getItem("token") || "";
        fetch('https://operation.dth.travel:7082/api/guide/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                startdate: "2025-01-01",
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
        })["catch"](function (err) { return setError(err.message); })["finally"](function () { return setLoading(false); });
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
        var match = dateStr.match(/^\d{4}-\d{2}-\d{2}/);
        return match ? match[0] : dateStr;
    }
    // Helper to combine Pickup + PickupDate, Dropoff + DropoffDate
    function renderPlaceDate(place, date, label) {
        if (!place && !date)
            return null;
        return (React.createElement("div", null,
            React.createElement("span", { className: "font-semibold" },
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
                React.createElement("span", { className: "font-semibold" },
                    label,
                    ":"),
                React.createElement("ul", { className: "list-disc ml-6" }, value.map(function (v, i) { return (React.createElement("li", { key: i }, String(v))); }))));
        }
        return (React.createElement("div", null,
            React.createElement("span", { className: "font-semibold" },
                label,
                ":"),
            " ",
            String(value)));
    };
    // Render all job details for a PNR
    var renderAllDetails = function (jobs) { return (React.createElement("div", { className: "max-h-[60vh] overflow-auto" }, jobs.map(function (job, idx) { return (React.createElement("div", { key: job.key, className: "mb-4 border-b border-blue-200 pb-2 last:border-b-0 last:pb-0" },
        React.createElement("div", { className: "font-semibold text-blue-700 mb-1 underline underline-offset-4" },
            "PNR: ",
            job.PNR),
        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm" },
            React.createElement("div", { className: "flex flex-wrap" },
                React.createElement("span", { className: "font-semibold w-28 shrink-0" }, "Pickup:"),
                React.createElement("span", { className: "break-words ml-2" },
                    job.Pickup,
                    job.Pickup && job.PickupDate ? ' - ' : '',
                    job.PickupDate ? formatDate(job.PickupDate) : '')),
            React.createElement("div", { className: "flex flex-wrap" },
                React.createElement("span", { className: "font-semibold w-28 shrink-0" }, "Dropoff:"),
                React.createElement("span", { className: "break-words ml-2" },
                    job.Dropoff,
                    job.Dropoff && job.DropoffDate ? ' - ' : '',
                    job.DropoffDate ? formatDate(job.DropoffDate) : '')),
            React.createElement("div", { className: "flex flex-wrap" },
                React.createElement("span", { className: "font-semibold w-28 shrink-0" }, "PNRDate:"),
                React.createElement("span", { className: "break-words ml-2" }, formatDate(job.PNRDate))),
            Object.entries(job)
                .filter(function (_a) {
                var k = _a[0];
                return k !== "IsConfirmed" &&
                    k !== "IsCancel" &&
                    k !== "key" &&
                    k !== "BSL_ID" &&
                    k !== "Pickup" &&
                    k !== "PickupDate" &&
                    k !== "Dropoff" &&
                    k !== "DropoffDate" &&
                    k !== "PNRDate";
            })
                .map(function (_a) {
                var k = _a[0], v = _a[1];
                // ถ้า key คือ serviceSupplierCode_TP หรือ serviceProductName ให้ตัดคำว่า "service" ออก
                var label = k;
                if (k === "serviceSupplierCode_TP")
                    label = "SupplierCode_TP";
                if (k === "serviceProductName")
                    label = "ProductName";
                if (k === "serviceTypeName")
                    label = "TypeName";
                return (React.createElement("div", { key: k, className: "flex flex-wrap" },
                    React.createElement("span", { className: "font-semibold w-28 shrink-0" },
                        label,
                        ":"),
                    React.createElement("span", { className: "break-words ml-2" }, typeof v === 'object' ? JSON.stringify(v) : String(v))));
            })))); }))); };
    // ปรับ summary เป็นแถวแนวนอน สวยงาม และวางไว้บนหัว card Jobs List
    var summary = (React.createElement("div", { className: "w-full flex justify-end mb-6" },
        React.createElement("div", { className: "flex flex-row flex-wrap gap-6 bg-white border border-blue-300 rounded-xl shadow-lg px-8 py-4 items-center max-w-3xl" },
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("span", { className: "inline-block w-3 h-3 rounded-full bg-orange-400" }),
                React.createElement("span", { className: "text-gray-500" }, "All Jobs:"),
                React.createElement("span", { className: "font-bold text-blue-700" }, filteredJobs.length)),
            React.createElement("div", { className: "flex items-center gap-2" },
                React.createElement("span", { className: "text-gray-500" }, "Unique PNR:"),
                React.createElement("span", { className: "font-bold text-blue-700" }, mergedJobs.length)))));
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
        React.createElement("div", { className: "flex flex-col items-center py-8 min-h-screen bg-base-200 relative" },
            summary,
            React.createElement("div", { className: "bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-7xl p-0" },
                React.createElement("div", { className: "p-4 w-full /* min-h-screen */ overflow-auto" },
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
                        React.createElement("span", { className: "mt-2 text-xs text-gray-400" }, "Please select a date range to filter the desired tasks.")),
                    loading ? (React.createElement("div", { className: "p-4 " }, "Loading jobs...")) : error ? (React.createElement("div", { className: "p-4 text-red-600" },
                        "Error: ",
                        error)) : !pagedJobs.length ? (React.createElement("div", { className: "p-4" }, "No jobs found")) : (React.createElement(React.Fragment, null,
                        React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8" }, pagedJobs.map(function (job, idx) {
                            var _a, _b;
                            return (React.createElement("div", { key: job.PNR, className: "relative bg-white border border-base-300 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col" },
                                React.createElement("div", { className: "absolute top-4 left-4 bg-blue-100 text-blue-700 font-bold rounded-full px-3 py-1 text-sm shadow z-10" }, (_b = (_a = job.all) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 1),
                                React.createElement("button", { className: "absolute top-4 right-4 btn btn-circle btn-outline", title: "Show all details", onClick: function () { return setDetailJobs(job.all); }, style: { zIndex: 2 } },
                                    React.createElement("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" },
                                        React.createElement("circle", { cx: "12", cy: "12", r: "10", stroke: "blue", strokeWidth: "2", fill: "white" }),
                                        React.createElement("text", { x: "12", y: "12", textAnchor: "middle", dominantBaseline: "central", fontSize: "18", fill: "black", fontWeight: "bold" }, "i"))),
                                React.createElement("div", { className: "p-6 flex-1 flex flex-col" },
                                    React.createElement("h2", { className: "text-xl font-bold mb-2 text-primary underline underline-offset-4" },
                                        "PNR: ",
                                        job.PNR),
                                    React.createElement("div", { className: "text-sm text-gray-600 space-y-1 mb-4" },
                                        renderPlaceDate(job.Pickup, job.PickupDate, 'Pickup'),
                                        renderPlaceDate(job.Dropoff, job.DropoffDate, 'Dropoff'),
                                        renderField('Pax', job.Pax),
                                        renderField('Source', job.Source)),
                                    React.createElement("div", { className: "flex gap-3 mt-auto flex-wrap" },
                                        React.createElement("button", { className: "btn btn-success flex-1 text-base font-bold py-2 rounded-full shadow", onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                var token, response, result, e_1;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            token = localStorage.getItem("token") || "";
                                                            return [4 /*yield*/, axios_1["default"].put("http://10.2.4.200:7072/api/guide/job/" + job.key, {
                                                                    token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                                                                    data: { isConfirmed: true }
                                                                })];
                                                        case 1:
                                                            response = _a.sent();
                                                            console.log("Accept response:", response.data);
                                                            result = response.data;
                                                            if (result.success) {
                                                                alert("Accept งานสำเร็จ");
                                                                // setJobs(jobs => jobs.map(j => j.key === job.key ? result : j));
                                                            }
                                                            else {
                                                                alert("Accept งานไม่สำเร็จ: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error"));
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            e_1 = _a.sent();
                                                            console.error("Accept error:", e_1);
                                                            alert("เกิดข้อผิดพลาด: " + e_1.message);
                                                            return [3 /*break*/, 3];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); } }, "Accept"),
                                        React.createElement("button", { className: "btn btn-error flex-1 text-base font-bold py-2 rounded-full shadow", onClick: function () { return __awaiter(_this, void 0, void 0, function () {
                                                var token, response, result, e_2;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            _a.trys.push([0, 2, , 3]);
                                                            token = localStorage.getItem("token") || "";
                                                            return [4 /*yield*/, axios_1["default"].put("https://operation.dth.travel:7082/api/guide/job/" + job.key, {
                                                                    token: "AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==",
                                                                    data: { isCancel: true }
                                                                })];
                                                        case 1:
                                                            response = _a.sent();
                                                            result = response.data;
                                                            if (result.success) {
                                                                alert("Reject งานสำเร็จ");
                                                                // setJobs(jobs => jobs.map(j => j.key === job.key ? result : j));
                                                            }
                                                            else {
                                                                alert("Reject งานไม่สำเร็จ: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error"));
                                                            }
                                                            return [3 /*break*/, 3];
                                                        case 2:
                                                            e_2 = _a.sent();
                                                            alert("เกิดข้อผิดพลาด: " + e_2.message);
                                                            return [3 /*break*/, 3];
                                                        case 3: return [2 /*return*/];
                                                    }
                                                });
                                            }); } }, "Reject Job"),
                                        React.createElement("button", { className: "btn btn-info btn-sm btn-circle", onClick: function () { return setUploadJob(job); }, title: "Upload Photo & Remark" },
                                            React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", className: "w-4 h-4", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                                React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" })))))));
                        })),
                        React.createElement("div", { className: "w-full flex justify-center mt-6" },
                            React.createElement("div", { className: "inline-flex items-center gap-2 bg-base-100 border border-base-300 rounded-full shadow px-4 py-2" },
                                React.createElement("button", { className: "btn btn-outline btn-sm rounded-full min-w-[64px]", disabled: page === 1, onClick: function () { return setPage(page - 1); } }, "Prev"),
                                React.createElement("span", { className: "px-2 py-1 font-semibold text-base-content" },
                                    page,
                                    " ",
                                    React.createElement("span", { className: "text-gray-400" }, "/"),
                                    " ",
                                    totalPages),
                                React.createElement("button", { className: "btn btn-outline btn-sm rounded-full min-w-[64px]", disabled: page === totalPages, onClick: function () { return setPage(page + 1); } }, "Next"))),
                        detailJobs && (React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" },
                            React.createElement("div", { className: "bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-2xl w-full relative animate-fade-in" },
                                React.createElement("button", { className: "absolute top-2 right-2 btn btn-sm btn-error", onClick: function () { return setDetailJobs(null); } }, "\u2715"),
                                React.createElement("h2", { className: "text-xl font-bold mb-4" }, "All Job Details"),
                                renderAllDetails(detailJobs)))),
                        uploadJob && (React.createElement("div", { className: "fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" },
                            React.createElement("div", { className: "bg-white rounded-xl shadow-2xl border-4 border-blue-400 p-8 max-w-md w-full relative animate-fade-in" },
                                React.createElement("button", { className: "absolute top-2 right-2 btn btn-sm btn-error", onClick: function () { return setUploadJob(null); } }, "\u2715"),
                                React.createElement("h2", { className: "text-xl font-bold mb-4" }, "Upload Photo & Remark"),
                                React.createElement("form", { onSubmit: function (e) {
                                        e.preventDefault();
                                        // handle upload logic here
                                        alert('Uploaded!');
                                        setUploadJob(null);
                                    }, className: "space-y-4" },
                                    React.createElement("div", null,
                                        React.createElement("label", { className: "block font-semibold mb-1" }, "Photo"),
                                        React.createElement("input", { type: "file", accept: "image/*", className: "file-input file-input-bordered w-full", onChange: function (e) {
                                                // handle file select
                                            } })),
                                    React.createElement("div", null,
                                        React.createElement("label", { className: "block font-semibold mb-1" }, "Remark"),
                                        React.createElement("textarea", { className: "textarea textarea-bordered w-full", rows: 3, placeholder: "Enter remark..." })),
                                    React.createElement("div", { className: "flex justify-end gap-2" },
                                        React.createElement("button", { type: "button", className: "btn btn-outline", onClick: function () { return setUploadJob(null); } }, "Cancel"),
                                        React.createElement("button", { type: "submit", className: "btn btn-primary" }, "Upload")))))))))))));
}
exports["default"] = JobsList;
