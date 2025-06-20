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
var axios_1 = require("axios");
var react_1 = require("react");
var FileToBase64 = function (_a) {
    var onBase64ListReady = _a.onBase64ListReady;
    var _b = react_1.useState(false), showBox = _b[0], setShowBox = _b[1];
    var _c = react_1.useState([]), previews = _c[0], setPreviews = _c[1];
    var _d = react_1.useState(""), remark = _d[0], setRemark = _d[1];
    var _e = react_1.useState([]), base64List = _e[0], setBase64List = _e[1];
    var handleFileChange = function (event) {
        var files = event.target.files;
        if (!files)
            return;
        var fileArray = Array.from(files);
        var promises = fileArray.map(function (file) {
            return new Promise(function (resolve, reject) {
                var reader = new FileReader();
                reader.onload = function () {
                    if (typeof reader.result === "string") {
                        resolve(reader.result);
                    }
                    else {
                        reject("Failed to read file");
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
        Promise.all(promises)
            .then(function (base64s) {
            setBase64List(base64s);
            setPreviews(base64s);
        })["catch"](function (err) {
            console.error("Error converting files:", err);
        });
    };
    var handleSubmit = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!base64List.length) {
                        alert("Please upload at least one file");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1["default"].post("https://onlinedt.diethelmtravel.com:5281/api/EmailSender", {
                            emails: ['veeratha.p@dth.travel'],
                            subject: 'Upload Completed',
                            body: "mail body....",
                            Emails_CC: ""
                        })];
                case 2:
                    res = _a.sent();
                    alert("Email sent successfully!");
                    // ค่อยแจ้งผลให้ parent หลังส่งเมลสำเร็จ
                    onBase64ListReady(base64List, remark);
                    // reset form
                    setShowBox(false);
                    setRemark("");
                    setPreviews([]);
                    setBase64List([]);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Failed to send email:", error_1);
                    alert("Failed to send email.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (
    // ตกแต่งตรงนี้เพิ่มเติมให้สวยงาม
    react_1["default"].createElement("div", { className: "relative flex justify-center items-center mt-6" },
        react_1["default"].createElement("button", { onClick: function () { return setShowBox(true); }, title: "Attach files", className: "text-white hover:text-blue-100 shadow-xl rounded-full p-3 text-4xl select-none transition-all duration-300 border-4 border-blue-700 bg-blue-700", style: { boxShadow: "0 10px 20px rgba(0, 0, 0, 0.3)" } }, "\uD83D\uDCCE"),
        showBox && (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { onClick: function () { return setShowBox(false); }, className: "fixed inset-0 bg-black bg-opacity-70 z-40" }),
            react_1["default"].createElement("div", { className: "fixed inset-0 flex justify-center items-center z-50 p-4" },
                react_1["default"].createElement("div", { className: "bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-auto p-6 space-y-6 relative" },
                    react_1["default"].createElement("button", { onClick: function () { return setShowBox(false); }, className: "absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl font-bold", "aria-label": "Close" }, "\u00D7"),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Remark"),
                        react_1["default"].createElement("input", { type: "text", value: remark, onChange: function (e) { return setRemark(e.target.value); }, className: "w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500", placeholder: "Enter remark here" })),
                    react_1["default"].createElement("div", null,
                        react_1["default"].createElement("label", { className: "block text-sm font-medium text-gray-700 mb-1" }, "Upload File"),
                        react_1["default"].createElement("input", { type: "file", multiple: true, onChange: handleFileChange, accept: "image/*,application/pdf", className: "block w-full text-sm text-gray-500" }))
                // แก้ถึงนี้
                ,
                    "// \u0E41\u0E01\u0E49\u0E16\u0E36\u0E07\u0E19\u0E35\u0E49",
                    react_1["default"].createElement("div", { className: "flex gap-3 flex-wrap max-h-48 overflow-auto" }, previews.map(function (src, idx) {
                        return src.startsWith("data:image") ? (react_1["default"].createElement("img", { key: idx, src: src, alt: "preview-" + idx, className: "w-24 h-24 object-cover rounded shadow" })) : (react_1["default"].createElement("div", { key: idx, className: "text-sm text-gray-600 flex items-center gap-1 px-3 py-1 border rounded shadow" },
                            "\uD83D\uDCC4 PDF ",
                            idx + 1));
                    })),
                    react_1["default"].createElement("div", { className: "flex justify-end gap-4" },
                        react_1["default"].createElement("button", { onClick: handleSubmit, className: "bg-blue-600 text-white text-sm font-semibold px-6 py-2 rounded hover:bg-blue-700" }, "Submit"))))))));
};
exports["default"] = FileToBase64;
