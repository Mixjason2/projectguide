"use client";
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
var navigation_1 = require("next/navigation");
var react_1 = require("react");
require("./globals.css");
function LoginPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = react_1.useState(""), username = _a[0], setUsername = _a[1];
    var _b = react_1.useState(""), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(false), rememberMe = _c[0], setRememberMe = _c[1];
    var _d = react_1.useState(""), message = _d[0], setMessage = _d[1];
    var _e = react_1.useState(false), loading = _e[0], setLoading = _e[1];
    react_1.useEffect(function () {
        var savedUsername = localStorage.getItem("savedUsername") || "";
        var savedPassword = localStorage.getItem("savedPassword") || "";
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
    }, []);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setMessage("");
                    setLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://operation.dth.travel:7082/api/guide/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                Username: username,
                                Password: password,
                                asmdb: "Assignment_TH"
                            })
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (data.status) {
                        setMessage("เข้าสู่ระบบสำเร็จ!");
                        router.push("/home");
                    }
                    else {
                        setMessage("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    setMessage("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
                    return [3 /*break*/, 5];
                case 5:
                    setLoading(false);
                    return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "min-h-screen flex items-center justify-center bg-base-200" },
        React.createElement("div", { className: "card w-full max-w-md bg-white shadow-xl rounded-xl" },
            React.createElement("div", { className: "card-body" },
                React.createElement("h2", { className: "card-title justify-center mb-6 text-2xl font-bold text-gray-800" }, "\u0E40\u0E02\u0E49\u0E32\u0E2A\u0E39\u0E48\u0E23\u0E30\u0E1A\u0E1A"),
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-5" },
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "username", className: "block text-base font-bold mb-1 text-gray-800" }, "\u0E0A\u0E37\u0E48\u0E2D\u0E1C\u0E39\u0E49\u0E43\u0E0A\u0E49"),
                        React.createElement("input", { id: "username", type: "text", value: username, onChange: function (e) { return setUsername(e.target.value); }, className: "input input-bordered w-full text-base", required: true })),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "password", className: "block text-base font-bold mb-1 text-gray-800" }, "\u0E23\u0E2B\u0E31\u0E2A\u0E1C\u0E48\u0E32\u0E19"),
                        React.createElement("input", { id: "password", type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "input input-bordered w-full text-base", required: true })),
                    React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                        React.createElement("label", { htmlFor: "rememberMe", className: "flex items-center cursor-pointer" },
                            React.createElement("input", { id: "rememberMe", type: "checkbox", checked: rememberMe, onChange: function (e) { return setRememberMe(e.target.checked); }, className: "checkbox checkbox-primary" }),
                            React.createElement("span", { className: "ml-2 text-base text-gray-800" }, "\u0E08\u0E33\u0E09\u0E31\u0E19\u0E44\u0E27\u0E49"))),
                    React.createElement("div", { className: "bg-white p-6 rounded-lg" },
                        React.createElement("button", { type: "submit", disabled: loading, className: "btn btn-primary w-full text-lg font-bold", style: {
                                minHeight: "3rem",
                                boxShadow: "0 2px 8px 0 rgba(37,99,235,0.10)",
                                border: "none"
                            } }, loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"))),
                message && (React.createElement("p", { className: "mt-4 text-sm text-center " + (message.includes("สำเร็จ") ? "text-black-600" : "text-red-500") }, message))))));
}
exports["default"] = LoginPage;
