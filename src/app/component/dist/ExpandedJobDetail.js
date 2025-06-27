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
var axios_1 = require("axios");
var customFormatDate = function (dateStr) {
    var date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return '';
    var day = String(date.getDate()).padStart(2, '0');
    var month = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();
    var hours = String(date.getHours()).padStart(2, '0');
    var minutes = String(date.getMinutes()).padStart(2, '0');
    return day + "-" + month + "-" + year + " " + hours + ":" + minutes;
};
var JobAction = function (_a) {
    var job = _a.job, setJobs = _a.setJobs;
    var _b = react_1.useState(job.IsConfirmed), accepted = _b[0], setAccepted = _b[1];
    var _c = react_1.useState(""), statusMessage = _c[0], setStatusMessage = _c[1];
    var sendEmail = function (_a) {
        var emails = _a.emails, emails_CC = _a.emails_CC, subject = _a.subject, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var response, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1["default"].post("https://onlinedt.diethelmtravel.com:5281/api/EmailSender", {
                                emails: emails,
                                emails_CC: emails_CC,
                                subject: subject,
                                body: body
                            })];
                    case 1:
                        response = _b.sent();
                        alert("Email sent successfully!");
                        return [2 /*return*/, response.data];
                    case 2:
                        error_1 = _b.sent();
                        alert("Failed to send email.");
                        console.error(error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var handleAccept = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    setStatusMessage("");
                    token = localStorage.getItem("token") || "";
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", { token: token, data: { isConfirmed: true } })];
                case 1:
                    response = _a.sent();
                    result = response.data;
                    if (!result.success) return [3 /*break*/, 3];
                    alert("Job successfully accepted.");
                    setAccepted(true);
                    setJobs(function (prevJobs) {
                        return prevJobs.map(function (j) { return (j.key === job.key ? __assign(__assign({}, j), { IsConfirmed: true }) : j); });
                    });
                    return [4 /*yield*/, sendEmail({
                            emails: ["fomexii@hotmail.com"],
                            emails_CC: "",
                            subject: "Job Accepted: " + job.PNR,
                            body: "The job for service " + job.serviceProductName + " has been successfully accepted.\nPlease note that this confirmation is part of the scheduled PNR: " + job.PNR + "."
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    alert("Failed to accept the job: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error"));
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_2 = _a.sent();
                    alert("Error: " + String(error_2));
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleReject = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    setStatusMessage("");
                    token = localStorage.getItem("token") || "";
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", { token: token, data: { isCancel: true } })];
                case 1:
                    response = _a.sent();
                    result = response.data;
                    if (result.success) {
                        alert("Job successfully canceled.");
                        setJobs(function (prevJobs) {
                            return prevJobs.map(function (j) { return (j.key === job.key ? __assign(__assign({}, j), { IsCancel: true }) : j); });
                        });
                    }
                    else {
                        alert("Failed to cancel the job: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error"));
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    alert("Error: " + String(error_3));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "flex gap-3 mt-4" },
        react_1["default"].createElement("button", { className: "btn flex-1 py-2 rounded-full shadow text-white bg-[#95c941] hover:opacity-90", onClick: handleAccept }, "Accept"),
        react_1["default"].createElement("button", { className: "btn flex-1 py-2 rounded-full shadow text-white bg-[#ef4444] hover:opacity-90", onClick: handleReject }, "Reject")));
};
var ExpandedJobDetail = function (_a) {
    var job = _a.job, expandedPNRs = _a.expandedPNRs, renderPlaceDate = _a.renderPlaceDate, renderField = _a.renderField, setJobs = _a.setJobs;
    // ถ้าข้อมูล PNRDate ไม่แสดงผล ก็คือไม่ต้องแสดงบล็อกนี้
    if (!expandedPNRs[job.PNRDate])
        return null;
    // ✅ สร้างรายการ Pickup + Date
    function toArray(value) {
        return Array.isArray(value) ? value : [value];
    }
    var pickupItems = toArray(job.Pickup).map(function (pickup, index) { return ({
        place: pickup,
        date: Array.isArray(job.PickupDate) ? job.PickupDate[index] || "" : job.PickupDate
    }); });
    var dropoffItems = toArray(job.Dropoff).map(function (dropoff, index) { return ({
        place: dropoff,
        date: Array.isArray(job.DropoffDate) ? job.DropoffDate[index] || "" : job.DropoffDate
    }); });
    var adultArr = toArray(job.AdultQty);
    var childArr = toArray(job.ChildQty);
    var childShareArr = toArray(job.ChildShareQty);
    var infantArr = toArray(job.InfantQty);
    var paxItems = adultArr.map(function (_, index) { return ({
        adult: adultArr[index] || 0,
        child: childArr[index] || 0,
        childShare: childShareArr[index] || 0,
        infant: infantArr[index] || 0
    }); });
    return (react_1["default"].createElement("div", { className: "bg-gray-100 p-4 rounded-lg" },
        react_1["default"].createElement("h2", { className: "text-lg font-bold text-blue-800 mb-2" },
            "PNR: ",
            job.PNR),
        react_1["default"].createElement("div", { className: "text-sm text-gray-700" },
            react_1["default"].createElement("div", { className: "mb-2" },
                react_1["default"].createElement("h4", { className: "text-sm font-semibold text-gray-800 mb-1" }, "Pickup"),
                pickupItems.map(function (item, idx) { return (react_1["default"].createElement("div", { key: "pickup-" + idx, className: "mb-1" }, renderPlaceDate(item.place, customFormatDate(item.date), "Pickup " + (pickupItems.length > 1 ? idx + 1 : "")))); })),
            react_1["default"].createElement("div", { className: "mb-2" },
                react_1["default"].createElement("h4", { className: "text-sm font-semibold text-gray-800 mb-1" }, "Dropoff"),
                dropoffItems.map(function (item, idx) { return (react_1["default"].createElement("div", { key: "dropoff-" + idx, className: "mb-1" }, renderPlaceDate(item.place, customFormatDate(item.date), "Dropoff " + (dropoffItems.length > 1 ? idx + 1 : "")))); })),
            react_1["default"].createElement("div", { className: "mb-2" },
                react_1["default"].createElement("h4", { className: "text-sm font-semibold text-gray-800 mb-1" }, "Pax"),
                paxItems.map(function (pax, idx) { return (react_1["default"].createElement("div", { key: "pax-" + idx, className: "mb-1" }, renderField("Pax " + (paxItems.length > 1 ? idx + 1 : ""), pax.adult + pax.child + pax.childShare + pax.infant))); })),
            react_1["default"].createElement("div", { className: "pt-1" },
                react_1["default"].createElement(JobAction, { job: job, setJobs: setJobs })))));
};
exports["default"] = ExpandedJobDetail;
