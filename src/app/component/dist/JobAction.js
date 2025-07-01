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
var FileToBase64_1 = require("./FileToBase64");
var react_hot_toast_1 = require("react-hot-toast"); // เพิ่ม import toast
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
                    react_hot_toast_1["default"].success("📧 Email sent successfully!"); // แก้ alert เป็น toast
                    return [2 /*return*/, res.data];
                case 2:
                    error_1 = _b.sent();
                    console.error("❌ Failed to send email", error_1);
                    react_hot_toast_1["default"].error("❌ Failed to send email"); // แก้ alert เป็น toast
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var JobAction = function (_a) {
    var job = _a.job, setJobs = _a.setJobs, onAccept = _a.onAccept, onReject = _a.onReject;
    var _b = react_1.useState(job.IsConfirmed), accepted = _b[0], setAccepted = _b[1];
    var _c = react_1.useState(false), showUploadModal = _c[0], setShowUploadModal = _c[1]; // modal state
    var _d = react_1.useState(""), statusMessage = _d[0], setStatusMessage = _d[1];
    var handleAccept = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("[ACCEPT] job.key =", job.key); // ✅ log key ที่กำลังจะ accept
                    if (onAccept) {
                        onAccept(job.key.toString());
                        setAccepted(true);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    setStatusMessage("");
                    token = localStorage.getItem("token") || "";
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", {
                            token: token,
                            data: { isConfirmed: true }
                        })];
                case 2:
                    response = _a.sent();
                    result = response.data;
                    if (!result.success) return [3 /*break*/, 4];
                    react_hot_toast_1["default"].success("Job successfully accepted."); // แก้ alert เป็น toast
                    setAccepted(true);
                    setJobs(function (prevJobs) {
                        return prevJobs.map(function (j) { return (j.key === job.key ? __assign(__assign({}, j), { IsConfirmed: true }) : j); });
                    });
                    return [4 /*yield*/, sendEmail({
                            emails: ["fomexii@hotmail.com"],
                            emails_CC: "",
                            subject: "Job Accepted: " + job.PNR,
                            body: "The job for service " + job.serviceProductName + " has been successfully accepted.\n\nPlease note that this confirmation is part of the scheduled PNR: " + job.PNR + ".\n\nIf you have any questions or require further details, please feel free to contact us."
                        })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    react_hot_toast_1["default"].error("Failed to accept the job: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error")); // แก้ alert เป็น toast
                    _a.label = 5;
                case 5: return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    react_hot_toast_1["default"].error("Error: " + String(error_2)); // แก้ alert เป็น toast
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleReject = function () { return __awaiter(void 0, void 0, void 0, function () {
        var token, response, result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (onReject) {
                        onReject(job.key.toString());
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    setStatusMessage("");
                    token = localStorage.getItem("token") || "";
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/guide/job/" + job.key + "/update", {
                            token: token,
                            data: { isCancel: true }
                        })];
                case 2:
                    response = _a.sent();
                    result = response.data;
                    if (result.success) {
                        react_hot_toast_1["default"].success("Job successfully canceled."); // แก้ alert เป็น toast
                        setJobs(function (prevJobs) {
                            return prevJobs.map(function (j) { return (j.key === job.key ? __assign(__assign({}, j), { IsCancel: true }) : j); });
                        });
                    }
                    else {
                        react_hot_toast_1["default"].error("Failed to cancel the job: " + ((result === null || result === void 0 ? void 0 : result.error) || "Unknown error")); // แก้ alert เป็น toast
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    react_hot_toast_1["default"].error("Error: " + String(error_3)); // แก้ alert เป็น toast
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "w-full border rounded-xl p-2 shadow bg-white" }, job.IsCancel ? null : accepted ? (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("button", { onClick: function () { return setShowUploadModal(true); }, className: "w-full py-2 rounded-lg text-blue-700 hover:bg-gray-100 flex items-center justify-center transition", title: "Upload Documents" },
            react_1["default"].createElement(solid_1.ArrowUpTrayIcon, { className: "w-6 h-6" })),
        showUploadModal && (react_1["default"].createElement("div", { className: "fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center", onClick: function () { return setShowUploadModal(false); } },
            react_1["default"].createElement("div", { className: "bg-white rounded-2xl shadow-lg p-6 relative max-w-3xl w-full", onClick: function (e) { return e.stopPropagation(); } },
                react_1["default"].createElement("button", { onClick: function () { return setShowUploadModal(false); }, className: "absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold" }, "\u00D7"),
                react_1["default"].createElement(FileToBase64_1["default"], { token: localStorage.getItem("token") || "", keyValue: job.key, job: job })))))) : (react_1["default"].createElement("div", { className: "flex gap-2 w-full" },
        react_1["default"].createElement("button", { className: "flex-1 py-2 rounded-lg bg-[#95c941] hover:opacity-90 flex items-center justify-center transition", onClick: handleAccept, title: "Accept" },
            react_1["default"].createElement(solid_1.CheckCircleIcon, { className: "w-6 h-6 text-white" })),
        react_1["default"].createElement("button", { className: "flex-1 py-2 rounded-lg bg-[#ef4444] hover:opacity-90 flex items-center justify-center transition", onClick: handleReject, title: "Reject" },
            react_1["default"].createElement(solid_1.XCircleIcon, { className: "w-6 h-6 text-white" }))))));
};
exports["default"] = JobAction;
