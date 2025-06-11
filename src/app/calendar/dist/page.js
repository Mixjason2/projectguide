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
var react_2 = require("@fullcalendar/react");
var daygrid_1 = require("@fullcalendar/daygrid");
var timegrid_1 = require("@fullcalendar/timegrid");
var list_1 = require("@fullcalendar/list");
var interaction_1 = require("@fullcalendar/interaction");
var cssguide_1 = require("../cssguide");
require("./calendar.css");
function CalendarExcel() {
    var _this = this;
    var _a = react_1.useState([]), jobs = _a[0], setJobs = _a[1];
    var _b = react_1.useState(true), loading = _b[0], setLoading = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
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
    // สร้าง events สำหรับ FullCalendar จาก jobs
    var events = react_1["default"].useMemo(function () {
        var countByDate = {};
        jobs.forEach(function (job) {
            if (job.PickupDate) {
                countByDate[job.PickupDate] = (countByDate[job.PickupDate] || 0) + 1;
            }
        });
        return Object.entries(countByDate).map(function (_a) {
            var date = _a[0], count = _a[1];
            return ({
                title: "Jobs: " + count,
                date: date
            });
        });
    }, [jobs]);
    if (loading)
        return react_1["default"].createElement("div", null, "Loading jobs...");
    if (error)
        return react_1["default"].createElement("div", null,
            "Error: ",
            error);
    return (react_1["default"].createElement(cssguide_1["default"], null,
        react_1["default"].createElement("div", { className: "bg-base-200 flex flex-col items-center justify-start p-4 min-h-screen" },
            react_1["default"].createElement("div", { className: "bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-screen-2xl", style: { height: '90vh' } },
                react_1["default"].createElement(react_2["default"], { plugins: [daygrid_1["default"], timegrid_1["default"], list_1["default"], interaction_1["default"]], initialView: "dayGridMonth", events: events, height: "100%", contentHeight: "auto", aspectRatio: 1.7, headerToolbar: {
                        start: 'title',
                        center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
                        end: 'today prev,next',
                        start: 'title today',
                        center: '',
                        end: 'prev,next dayGridMonth,timeGridWeek,timeGridDay,listMonth' // ฝั่งขวา
                    }, editable: false, selectable: true, expandRows: true })))));
}
exports["default"] = CalendarExcel;
