'use client';
"use strict";
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
var CalendarView_1 = require("./components/CalendarView");
var Loading_1 = require("./components/Loading");
var ErrorMessage_1 = require("./components/ErrorMessage");
require("./calendar.css");
var cssguide_1 = require("../cssguide");
function addMonths(date, months) {
    var d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}
function formatISO(date) {
    return date.toISOString().slice(0, 10);
}
function Page() {
    var _this = this;
    var _a = react_1.useState([]), jobs = _a[0], setJobs = _a[1];
    var _b = react_1.useState(false), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(function () {
        var d = addMonths(new Date(), -2);
        return formatISO(d);
    }), dataStartDate = _d[0], setDataStartDate = _d[1];
    var _e = react_1.useState(function () {
        var d = addMonths(new Date(), 2);
        return formatISO(d);
    }), dataEndDate = _e[0], setDataEndDate = _e[1];
    var _f = react_1.useState('dayGridMonth'), currentView = _f[0], setCurrentView = _f[1];
    var _g = react_1.useState(null), currentCenterDate = _g[0], setCurrentCenterDate = _g[1];
    var fetchJobs = function (start, end) {
        var token = localStorage.getItem('token') || '';
        if (!token) {
            setError('Token not found. Please log in.');
            setLoading(false);
            setJobs([]);
            return;
        }
        setLoading(true);
        setError(null);
        console.time('⏱️ fetchJobs');
        return fetch('https://operation.dth.travel:7082/api/guide/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, startdate: start, enddate: end })
        })
            .then(function (res) { return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!res.ok) return [3 /*break*/, 2];
                        if (res.status === 401) {
                            localStorage.removeItem('token');
                            window.location.href = '/login';
                        }
                        _a = Error.bind;
                        return [4 /*yield*/, res.text()];
                    case 1: throw new (_a.apply(Error, [void 0, _b.sent()]))();
                    case 2: return [2 /*return*/, res.json()];
                }
            });
        }); })
            .then(function (data) {
            console.timeEnd('⏱️ fetchJobs');
            setJobs(function (prev) {
                var combined = __spreadArrays(prev);
                data.forEach(function (newJob) {
                    if (!combined.find(function (j) { return j.key === newJob.key; })) {
                        combined.push(newJob);
                    }
                });
                return combined;
            });
            setError(null);
        })["catch"](function (err) {
            console.timeEnd('⏱️ fetchJobs');
            setError(err.message || 'Failed to fetch');
        })["finally"](function () { return setLoading(false); });
    };
    react_1.useEffect(function () {
        fetchJobs(dataStartDate, dataEndDate);
    }, []);
    var handleDatesSet = function (arg) {
        // เช็คก่อน setCurrentView ว่าต่างจากเดิมไหม
        if (arg.view.type !== currentView) {
            setCurrentView(arg.view.type);
        }
        // เช็คก่อน setCurrentCenterDate ว่าต่างจากเดิมไหม (เทียบด้วยเวลา)
        if (!currentCenterDate ||
            arg.view.currentStart.getTime() !== currentCenterDate.getTime()) {
            setCurrentCenterDate(arg.view.currentStart);
        }
        var viewStart = formatISO(arg.start);
        var viewEnd = formatISO(arg.end);
        if (viewEnd > dataEndDate) {
            var newEndDate = formatISO(addMonths(new Date(dataEndDate), 3));
            setDataEndDate(newEndDate);
            fetchJobs(dataEndDate, newEndDate);
        }
        if (viewStart < dataStartDate) {
            var newStartDate = formatISO(addMonths(new Date(dataStartDate), -3));
            setDataStartDate(newStartDate);
            fetchJobs(newStartDate, dataStartDate);
        }
    };
    if (loading && jobs.length === 0)
        return react_1["default"].createElement(Loading_1["default"], null);
    if (error && jobs.length === 0)
        return react_1["default"].createElement(ErrorMessage_1["default"], { error: error });
    return (react_1["default"].createElement(cssguide_1["default"], null,
        react_1["default"].createElement("div", { className: "max-w-4xl mx-auto p-4 overflow-auto" },
            react_1["default"].createElement("h1", { className: "text-2xl font-bold mb-4" }, "Calendar"),
            react_1["default"].createElement(CalendarView_1["default"], { jobs: jobs, gotoDate: currentCenterDate, currentViewProp: currentView, onDatesSet: handleDatesSet }),
            loading && (react_1["default"].createElement("div", { className: "flex items-center justify-center bg-white bg-opacity-80 rounded-lg shadow-md p-4", style: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 9999,
                    pointerEvents: 'none'
                } },
                react_1["default"].createElement("div", { className: "animate-spin rounded-full h-5 w-5 border-t-2 border-green-500" }),
                react_1["default"].createElement("span", { className: "ml-2 text-black-600 text-sm" }, "Loading more data..."))),
            error && react_1["default"].createElement("p", { className: "text-red-600" }, error))));
}
exports["default"] = Page;
