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
var solid_1 = require("@heroicons/react/24/solid");
var sendEmail = function (_a) {
    var emails = _a.emails, emails_CC = _a.emails_CC, subject = _a.subject, body = _a.body;
    return __awaiter(void 0, void 0, void 0, function () {
        var res, error_1;
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
                    res = _b.sent();
                    alert("📧 Email sent successfully!");
                    return [2 /*return*/, res.data];
                case 2:
                    error_1 = _b.sent();
                    console.error("❌ Failed to send email", error_1);
                    alert("❌ Failed to send email");
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var customFormatDate = function (dateStr) {
    var date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return '';
    var day = String(date.getUTCDate()).padStart(2, '0');
    var month = date.toLocaleString('default', { month: 'short', timeZone: 'UTC' });
    var year = date.getUTCFullYear();
    var hours = String(date.getUTCHours()).padStart(2, '0');
    var minutes = String(date.getUTCMinutes()).padStart(2, '0');
    return day + "-" + month + "-" + year + " " + hours + ":" + minutes;
};
var JobAction = function (_a) {
    var job = _a.job, setJobs = _a.setJobs;
    var _b = react_1.useState(job.IsConfirmed), accepted = _b[0], setAccepted = _b[1];
    var _c = react_1.useState(false), showUploadModal = _c[0], setShowUploadModal = _c[1]; // ใช้สำหรับเปิดปิด modal
    var _d = react_1.useState(""), statusMessage = _d[0], setStatusMessage = _d[1];
    var handleAccept = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem("token") || "";
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", { token: token, data: { isConfirmed: true } })];
                case 1:
                    response = _a.sent();
                    result = response.data;
                    if (!result.success) return [3 /*break*/, 3];
                    alert("Job successfully accepted.");
                    setAccepted(true);
                    setShowUploadModal(true);
                    // ✅ อัปเดตค่าลง jobs ทั้งชุด (fullJob)
                    setJobs(function (prev) {
                        return prev.map(function (j) {
                            if (job.fullJob && j.key === job.fullJob.key) {
                                // คัดลอก job.all แล้วอัปเดต index ที่ต้องการ
                                var updatedAll = j.all.map(function (original, idx) {
                                    return idx === job.indexInGroup ? __assign(__assign({}, original), { IsConfirmed: true }) : original;
                                });
                                return __assign(__assign({}, j), { IsConfirmed: true, all: updatedAll });
                            }
                            return j;
                        });
                    });
                    return [4 /*yield*/, sendEmail({
                            emails: ["veeratha.p@dth.travel"],
                            emails_CC: "",
                            subject: "Job Accepted: " + job.key,
                            body: "The job with reference number " + job.PNR + " has been accepted."
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    alert("Error: " + String(error_2));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleReject = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    token = localStorage.getItem("token") || "";
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", { token: token, data: { isCancel: true } })];
                case 1:
                    response = _a.sent();
                    result = response.data;
                    if (!result.success) return [3 /*break*/, 3];
                    alert("Job successfully canceled.");
                    setShowUploadModal(false);
                    // ✅ อัปเดต jobs
                    setJobs(function (prev) {
                        return prev.map(function (j) {
                            if (job.fullJob && j.key === job.fullJob.key) {
                                var updatedAll = j.all.map(function (original, idx) {
                                    return idx === job.indexInGroup ? __assign(__assign({}, original), { IsCancel: true }) : original;
                                });
                                return __assign(__assign({}, j), { IsCancel: true, all: updatedAll });
                            }
                            return j;
                        });
                    });
                    return [4 /*yield*/, sendEmail({
                            emails: ["veeratha.p@dth.travel"],
                            emails_CC: "",
                            subject: "Job Rejected: " + job.key,
                            body: "The job with reference number " + job.PNR + " has been rejected."
                        })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    alert("Error: " + String(error_3));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "w-full border rounded-xl p-2 shadow bg-white" }, job.IsCancel ? null : accepted ? (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("button", { onClick: function () { return setShowUploadModal(true); }, className: "w-full py-2 rounded-lg text-blue-700 hover:bg-gray-100 flex items-center justify-center transition", title: "Upload Documents" },
            react_1["default"].createElement(solid_1.ArrowUpTrayIcon, { className: "w-6 h-6" })))) : (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("div", { className: "flex gap-2 w-full" },
            react_1["default"].createElement("button", { className: "flex-1 py-2 rounded-lg bg-[#95c941] hover:opacity-90 flex items-center justify-center transition", onClick: handleAccept, title: "Accept" },
                react_1["default"].createElement(solid_1.CheckCircleIcon, { className: "w-6 h-6 text-white" })),
            react_1["default"].createElement("button", { className: "flex-1 py-2 rounded-lg bg-[#ef4444] hover:opacity-90 flex items-center justify-center transition", onClick: handleReject, title: "Reject" },
                react_1["default"].createElement(solid_1.XCircleIcon, { className: "w-6 h-6 text-white" })))))));
};
var ExpandedJobDetail = function (_a) {
    var job = _a.job, expandedPNRs = _a.expandedPNRs, renderPlaceDate = _a.renderPlaceDate, renderField = _a.renderField, setJobs = _a.setJobs;
    if (!expandedPNRs[job.PNRDate])
        return null;
    function toArray(value) {
        return Array.isArray(value) ? value : [value];
    }
    var pnrArr = toArray(job.PNR);
    var pickupArr = toArray(job.Pickup);
    var pickupDateArr = toArray(job.PickupDate);
    var dropoffArr = toArray(job.Dropoff);
    var dropoffDateArr = toArray(job.DropoffDate);
    var adultArr = toArray(job.AdultQty);
    var childArr = toArray(job.ChildQty);
    var childShareArr = toArray(job.ChildShareQty);
    var infantArr = toArray(job.InfantQty);
    var combinedItems = pnrArr.map(function (pnr, index) { return ({
        pnr: pnr,
        pickup: pickupArr[index] || "",
        pickupDate: pickupDateArr[index] || "",
        dropoff: dropoffArr[index] || "",
        dropoffDate: dropoffDateArr[index] || "",
        adult: adultArr[index] || 0,
        child: childArr[index] || 0,
        childShare: childShareArr[index] || 0,
        infant: infantArr[index] || 0,
        key: job.key + "-" + index,
        IsConfirmed: Array.isArray(job.IsConfirmed) ? job.IsConfirmed[index] : job.IsConfirmed,
        IsCancel: Array.isArray(job.IsCancel) ? job.IsCancel[index] : job.IsCancel,
        fullJob: job,
        indexInGroup: index
    }); });
    var groupedByPNR = {};
    combinedItems.forEach(function (item) {
        if (!groupedByPNR[item.pnr]) {
            groupedByPNR[item.pnr] = [];
        }
        groupedByPNR[item.pnr].push(item);
    });
    return (react_1["default"].createElement("div", { className: "p-6 pt-0 flex-1 flex flex-col" },
        react_1["default"].createElement("div", { className: "text-sm text-gray-00 space-y-4 mb-4" }, Object.entries(groupedByPNR).map(function (_a) {
            var pnr = _a[0], items = _a[1];
            var firstItem = items[0]; // ใช้ item แรกในการสร้าง miniJob
            var miniJob = __assign(__assign({}, job), { PNR: firstItem.pnr, Pickup: firstItem.pickup, PickupDate: firstItem.pickupDate, Dropoff: firstItem.dropoff, DropoffDate: firstItem.dropoffDate, AdultQty: firstItem.adult, ChildQty: firstItem.child, ChildShareQty: firstItem.childShare, InfantQty: firstItem.infant, key: firstItem.key, IsConfirmed: firstItem.IsConfirmed, IsCancel: firstItem.IsCancel });
            return (react_1["default"].createElement("div", { key: pnr, className: "rounded-xl bg-white border border-gray-300 p-6 shadow-sm max-w-xs mx-auto" },
                react_1["default"].createElement("div", { className: "bg-gray-50 border border-gray-200 rounded-t-lg p-4 space-y-3 break-words" },
                    react_1["default"].createElement("h3", { className: "font-bold text-blue-800 text-lg leading-tight" },
                        "PNR: ",
                        pnr),
                    items.map(function (item) { return (react_1["default"].createElement("div", { key: item.key, className: "text-gray-700 text-sm leading-relaxed whitespace-pre-line" },
                        renderPlaceDate(item.pickup, customFormatDate(item.pickupDate), "Pickup"),
                        renderPlaceDate(item.dropoff, customFormatDate(item.dropoffDate), "Dropoff"),
                        renderField("Pax", item.adult + item.child + item.childShare + item.infant))); })),
                react_1["default"].createElement("div", { className: "bg-white border border-t-0 border-gray-200 rounded-b-lg p-0 flex justify-center w-auto" },
                    react_1["default"].createElement(JobAction, { job: miniJob, setJobs: setJobs }))));
        }))));
};
exports["default"] = ExpandedJobDetail;
