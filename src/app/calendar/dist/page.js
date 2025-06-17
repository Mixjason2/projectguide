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
exports.__esModule = true;
var react_1 = require("react");
require("./calendar.css");
function getTotalPax(job) {
    return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}
function getColor(job) {
    return job.isChange ? '#f97316' /* orange-500 */ : '#0891b2'; /* cyan-600 */
}
var CalendarExcel = function () {
    var _a = react_1.useState([]), jobs = _a[0], setJobs = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState('dayGridMonth'), currentView = _d[0], setCurrentView = _d[1];
    react_1.useEffect(function () {
        var token = localStorage.getItem("token") || "";
        fetch('https://operation.dth.travel:7082/api/guide/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: token, startdate: "2025-01-01", enddate: "2025-05-31" })
        })
            .then(function (res) { return __awaiter(void 0, void 0, void 0, function () {
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
            .then(setJobs)["catch"](function (err) { return setError(err.message); })["finally"](function () { return setLoading(false); });
    }, []);
    var events = react_1.useMemo(function () {
        if (currentView === 'dayGridMonth') {
            // group by date
            var grouped_1 = {};
            jobs.forEach(function (job) {
                var _a;
                var date = job.PickupDate.split('T')[0];
                ((_a = grouped_1[date]) !== null && _a !== void 0 ? _a : ) = [];
            }).push(job);
        }
    });
    return Object.entries(grouped).map(function (_a) {
        var date = _a[0], jobsOnDate = _a[1];
        var firstJob = jobsOnDate[0];
        var color = getColor(firstJob);
        return {
            title: "job: " + jobsOnDate.length,
            start: date,
            allDay: true,
            backgroundColor: color,
            borderColor: color,
            textColor: 'white',
            extendedProps: {
                jobs: jobsOnDate,
                color: color
            }
        };
    });
}, _a = void 0, jobs = _a["return"], map = _a.map;
(function (job) {
    var color = getColor(job);
    return {
        id: job.key.toString(),
        title: job.PNR,
        start: job.PickupDate,
        backgroundColor: color,
        borderColor: color,
        textColor: 'white',
        extendedProps: {
            job: job,
            color: color
        }
    };
});
[jobs, currentView];
;
var handleEventClick = function (info) {
    if (currentView === 'dayGridMonth') {
        var jobsOnDate = info.event.extendedProps.jobs || [];
        var date = info.event.startStr.split('T')[0];
        var detail = jobsOnDate.map(function (job, idx) {
            var time = new Date(job.PickupDate).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            });
            return idx + 1 + ". \u23F0 " + time + " \uD83D\uDCCD " + job.Pickup + " | \uD83C\uDFAB " + job.PNR;
        }).join('\n');
        alert("\uD83D\uDCC5 " + date + "\n\n" + detail);
    }
    else {
        var job = info.event.extendedProps.job;
        var time = new Date(job.PickupDate).toLocaleString('en-GB', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        alert("\uD83C\uDFAB PNR: " + job.PNR + "\n\uD83D\uDCCD Pickup: " + job.Pickup + "\n\uD83D\uDD52 Time: " + time + "\n\uD83D\uDC64 Pax: " + getTotalPax(job));
    }
};
var renderEventContent = function (arg) {
    var color = arg.event.extendedProps.color || '#0891b2';
    return (react_1["default"].createElement("div", { className: "fc-event-main flex items-center" },
        react_1["default"].createElement("span", { className: "fc-event-dot-custom", style: { backgroundColor: color } }),
        react_1["default"].createElement("span", null, arg.event.title)));
};
if (loading)
    return react_1["default"].createElement("p", { className: "text-center py-20 text-lg text-gray-600" }, "\u23F3 \u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25...");
if (error)
    return react_1["default"].createElement("p", { className: "text-red-500 text-center mt-4" },
        "\u274C ",
        error);
return (react_1["default"].createElement("div", { className: "p-4" },
    react_1["default"].createElement(react_2["default"], { plugins: [daygrid_1["default"], timegrid_1["default"], list_1["default"], interaction_1["default"]], initialView: "timeGridWeek", events: events, datesSet: function (arg) { return setCurrentView(arg.view.type); }, height: "auto", headerToolbar: {
            start: 'title',
            center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            end: 'today prev,next'
        }, eventClick: handleEventClick, eventContent: renderEventContent, slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        }, dayHeaderFormat: {
            weekday: 'short',
            day: 'numeric'
        } })));
;
exports["default"] = CalendarExcel;
