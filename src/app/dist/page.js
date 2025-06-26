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
var material_1 = require("@mui/material");
require("./globals.css");
function LoginPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = react_1.useState(""), username = _a[0], setUsername = _a[1];
    var _b = react_1.useState(""), password = _b[0], setPassword = _b[1];
    var _c = react_1.useState(false), rememberMe = _c[0], setRememberMe = _c[1];
    var _d = react_1.useState(""), message = _d[0], setMessage = _d[1];
    var _e = react_1.useState(false), loading = _e[0], setLoading = _e[1];
    var _f = react_1.useState("[AS-DTGTHA]"), connection = _f[0], setConnection = _f[1]; // ค่าเริ่มต้นสำหรับการเชื่อมต่อ
    var connectionOptions = [
        { label: "TH", value: "[AS-DTGTHA]", name: "Thailand", flag: "🇹🇭" },
        { label: "MY", value: "[AS-DTGKUL]", name: "Malaysia", flag: "🇲🇾" },
        { label: "SL", value: "[AS-DTGSLK]", name: "Sri Lanka", flag: "🇱🇰" },
        { label: "SG", value: "[AS-DTGSIN]", name: "Singapore", flag: "🇸🇬" },
        { label: "VN", value: "[AS-DTGVNM]", name: "Vietnam", flag: "🇻🇳" },
    ];
    react_1.useEffect(function () {
        var savedUsername = localStorage.getItem("savedUsername") || "";
        var savedPassword = localStorage.getItem("savedPassword") || "";
        var savedConnection = localStorage.getItem("savedConnection") || "";
        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
            setRememberMe(true);
        }
        if (savedConnection) {
            setConnection(savedConnection);
        }
    }, []);
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var validPattern, selectedOption, selectedLabel, asmdbValue, res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    setMessage("");
                    validPattern = /^[a-zA-Z0-9]+$/;
                    if (!validPattern.test(username)) {
                        setMessage("Username must contain only letters or numbers.");
                        return [2 /*return*/];
                    }
                    if (!validPattern.test(password)) {
                        setMessage("Password must contain only letters or numbers.");
                        return [2 /*return*/];
                    }
                    selectedOption = connectionOptions.find(function (opt) { return opt.value === connection; });
                    selectedLabel = (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.label) || "TH";
                    asmdbValue = "Assignment_" + selectedLabel;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch("https://operation.dth.travel:7082/api/guide/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                Username: username,
                                Password: password,
                                asmdb: asmdbValue,
                                connection: connection
                            })
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    // Show result from API to user
                    if (data.status && data.token) {
                        setMessage("Login successful!");
                        // เก็บ token ลง localStorage
                        localStorage.setItem("token", data.token);
                        if (rememberMe) {
                            localStorage.setItem("savedUsername", username);
                            localStorage.setItem("savedPassword", password);
                            localStorage.setItem("savedConnection", connection); // ✅ เพิ่มตรงนี้
                        }
                        else {
                            localStorage.removeItem("savedUsername");
                            localStorage.removeItem("savedPassword");
                            localStorage.removeItem("savedConnection"); // ✅ ลบเมื่อไม่ remember
                        }
                        // เก็บ token ไว้ใน localStorage หรือ sessionStorage ถ้าต้องการ
                        localStorage.setItem("token", data.token);
                        router.push("/home");
                    }
                    else {
                        setMessage("Incorrect username or password.");
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    setMessage("Failed to connect to the server.");
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "min-h-screen flex items-center justify-center", style: { backgroundColor: "#2d4392" } },
        React.createElement("div", { className: "card w-full max-w-3xl bg-white shadow-xl rounded-xl relative overflow-hidden" },
            React.createElement("div", { style: {
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "160px",
                    height: "170px"
                } },
                React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 300 190", width: "180", height: "155", style: { transform: "translateX(-20px) scale(2.2)", transformOrigin: "top right", width: "100%", height: "auto", display: "block" } },
                    React.createElement("path", { fill: "#95c941", d: "M251.5,65.5c0.8,1.2,1.9,2,3.3,2.4c0.8,0.3,1.8,0.4,3,0.4h8.3V49.2h-8.3c-2.9,0-5.1,1.2-6.4,3.6 \r\n        c-1,1.8-1.5,3.9-1.5,6.5c0,1,0.1,2.1,0.4,3.2S250.9,64.6,251.5,65.5" }),
                    React.createElement("path", { fill: "#95c941", stroke: "#030303", strokeWidth: "0.2", d: "M242.6,63.3c-2.5,0-4.5-2-4.5-4.5s2-4.5,4.5-4.5s4.5,2,4.5,4.5S245.1,63.3,242.6,63.3" }),
                    React.createElement("path", { fill: "#2D3E92", d: "M227.8,36c-0.9,1.2-1.3,2.5-1.3,3.9c0,0.8,0.2,1.8,0.5,3l2.6,7.9l18.2-5.9l-2.6-7.9c-0.9-2.8-2.7-4.4-5.4-5 \r\n        c-2-0.4-4.2-0.2-6.6,0.5c-0.9,0.3-1.9,0.8-2.9,1.3C229.4,34.3,228.5,35.1,227.8,36" }),
                    React.createElement("path", { fill: "#2D3E92", d: "M227.1,26.8c-0.8-2.4,0.5-4.9,2.9-5.7c2.4-0.8,4.9,0.5,5.7,2.9s-0.5,4.9-2.9,5.7 \r\n        C230.5,30.5,227.9,29.2,227.1,26.8" }),
                    React.createElement("path", { fill: "#95c941", d: "M248.6,4.4c-1.4-0.5-2.7-0.5-4.1-0.1c-0.8,0.2-1.7,0.7-2.6,1.4l-6.7,4.9l11.2,15.5l6.7-4.9 \r\n        c2.3-1.7,3.4-3.9,3.1-6.7c-0.2-2-1.1-4.1-2.6-6.1c-0.6-0.8-1.3-1.6-2.1-2.3C250.7,5.3,249.7,4.7,248.6,4.4" }),
                    React.createElement("path", { fill: "#95c941", d: "M257.1,0.9c2-1.5,4.9-1,6.3,1c1.5,2,1,4.8-1,6.3s-4.9,1-6.3-1C254.6,5.2,255.1,2.3,257.1,0.9" }),
                    React.createElement("path", { fill: "#95c941", d: "M285.1,14.3c0-1.4-0.4-2.8-1.2-3.9c-0.5-0.7-1.2-1.4-2.1-2.1L275,3.5L263.8,19l6.7,4.9c2.3,1.7,4.8,2,7.3,0.9 \r\n        c1.9-0.8,3.5-2.3,5-4.3c0.6-0.8,1.1-1.7,1.6-2.8C284.8,16.6,285.1,15.4,285.1,14.3" }),
                    React.createElement("path", { fill: "#95c941", d: "M291,21.3c2,1.5,2.5,4.3,1,6.3s-4.3,2.5-6.3,1s-2.5-4.3-1-6.3S289,19.9,291,21.3" }),
                    React.createElement("path", { fill: "#95c941", d: "M286.9,52.1c1.4-0.4,2.5-1.2,3.3-2.4c0.5-0.7,0.9-1.6,1.3-2.7l2.5-7.9l-18.2-5.9l-2.5,7.9 \r\n        c-0.9,2.8-0.4,5.2,1.4,7.2c1.4,1.5,3.3,2.7,5.7,3.5c1,0.3,2,0.5,3.1,0.6C284.7,52.6,285.8,52.5,286.9,52.1" }),
                    React.createElement("path", { fill: "#95c941", d: "M282.1,59.9c-0.8,2.4-3.3,3.7-5.7,2.9s-3.7-3.3-2.9-5.7s3.3-3.7,5.7-2.9C281.5,55,282.8,57.5,282.1,59.9" }))),
            React.createElement("div", { className: "card-body relative z-10" },
                React.createElement("div", { className: "flex flex-col items-center justify-center p-0 m-0 leading-none min-h-[150px]" },
                    React.createElement("div", { className: "w-[12rem] max-w-full mx-auto" },
                        React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 220 150", className: "w-full h-auto block mx-auto" },
                            React.createElement("g", null,
                                React.createElement("path", { d: "M57.9,102.7H28.1V33.6h29.8c4.3,0.1,7.8,0.6,10.7,1.5c4.8,1.6,8.8,4.5,11.8,8.8c2.4,3.4,4,7.2,4.9,11.2c0.9,4,1.3,7.8,1.3,11.4c0,9.2-1.8,17-5.5,23.3C76,98.4,68.3,102.7,57.9,102.7z M68.6,51.3c-2.2-3.8-6.6-5.6-13.2-5.6H42.1v45.1h13.3c6.8,0,11.6-3.4,14.2-10.1c1.5-3.7,2.2-8.1,2.2-13.2C71.9,60.5,70.8,55.1,68.6,51.3z", fill: "#2D3E92" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M146.7,33.6v12.2h-20.7v56.9h-14.5V45.9H90.8V33.6H146.7z", fill: "#2D3E92" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M196.1,102.7V71.9h-27v30.8h-14.3V33.6h14.3V60h27V33.6h14.3v69.1H196.1z", fill: "#2D3E92" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M84.9,118.2v2.4h-6.8v17.7h-2.7v-17.7h-6.8v-2.4H84.9z", fill: "#95c941", stroke: "#95c941", strokeWidth: "0.8" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M86.7,118.2h9.1c1.5,0,2.7,0.2,3.7,0.7c1.9,0.9,2.8,2.4,2.8,4.7c0,1.2-0.2,2.2-0.7,3c-0.5,0.8-1.2,1.4-2.1,1.8c0.8,0.3,1.4,0.7,1.8,1.3s0.6,1.4,0.7,2.5l0.1,2.7c0,0.8,0.1,1.3,0.2,1.7c0.2,0.6,0.5,1,0.9,1.2v0.5h-3.3c-0.1-0.2-0.2-0.4-0.2-0.7s-0.1-0.8-0.1-1.6l-0.2-3.3c-0.1-1.3-0.5-2.2-1.4-2.6c-0.5-0.2-1.3-0.4-2.4-0.4h-6v8.6h-2.7V118.2z M95.5,127.4c1.2,0,2.2-0.3,2.9-0.8c0.7-0.5,1.1-1.4,1.1-2.8c0-1.4-0.5-2.4-1.5-2.9c-0.5-0.3-1.3-0.4-2.2-0.4h-6.5v6.9H95.5z", fill: "#95c941", stroke: "#95c941", strokeWidth: "0.8" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M111.9,118.2h3.1l7.3,20.1h-3l-2-6h-7.9l-2.2,6h-2.8L111.9,118.2z M116.4,130.1l-3-8.9l-3.2,8.9H116.4z", fill: "#95c941", stroke: "#95c941", strokeWidth: "0.8" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M123.5,118.2l5.8,17.1l5.7-17.1h3l-7.3,20.1h-2.9l-7.3-20.1H123.5z", fill: "#95c941", stroke: "#95c941", strokeWidth: "0.8" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M139.8,118.2h14.6v2.5h-11.9v6.1h11v2.3h-11v6.8h12.1v2.4h-14.8V118.2z", fill: "#95c941", stroke: "#95c941", strokeWidth: "0.8" })),
                            React.createElement("g", null,
                                React.createElement("path", { d: "M156.9,118.2h2.7v17.7h10.1v2.4h-12.8V118.2z", fill: "#95c941", stroke: "#95c941", strokeWidth: "0.8" }))))),
                React.createElement("form", { onSubmit: handleSubmit, className: "space-y-5" },
                    React.createElement("div", { className: "flex justify-end mt-2" },
                        React.createElement(material_1.FormControl, { size: "small", variant: "standard", className: "w-fit" },
                            React.createElement(material_1.InputLabel, { htmlFor: "connectionSelect" }, "Connection"),
                            React.createElement(material_1.NativeSelect, { id: "connectionSelect", value: connection, onChange: function (e) { return setConnection(e.target.value); }, inputProps: {
                                    name: "connection",
                                    id: "connectionSelect"
                                } }, connectionOptions.map(function (option) { return (React.createElement("option", { key: option.label, value: option.value },
                                option.flag,
                                " ",
                                option.name)); })))),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "username", className: "block text-base font-bold mb-1 text-gray-800" }, "Username"),
                        React.createElement("input", { id: "username", type: "text", value: username, onChange: function (e) { return setUsername(e.target.value); }, className: "input input-bordered w-full text-base", required: true })),
                    React.createElement("div", null,
                        React.createElement("label", { htmlFor: "password", className: "block text-base font-bold mb-1 text-gray-800" }, "Password"),
                        React.createElement("input", { id: "password", type: "password", value: password, onChange: function (e) { return setPassword(e.target.value); }, className: "input input-bordered w-full text-base", required: true })),
                    React.createElement("div", { className: "flex items-center gap-2 mb-2" },
                        React.createElement("label", { htmlFor: "rememberMe", className: "flex items-center cursor-pointer" },
                            React.createElement("input", { id: "rememberMe", type: "checkbox", checked: rememberMe, onChange: function (e) { return setRememberMe(e.target.checked); }, className: "accent-[#95c941] w-5 h-5" }),
                            React.createElement("span", { className: "ml-2 text-base text-gray-800" }, "Remember me"))),
                    React.createElement("div", { className: "bg-white p-6 rounded-lg" },
                        React.createElement("button", { type: "submit", disabled: loading, className: "w-full text-lg font-bold transition duration-200", style: {
                                backgroundColor: "#2D3E92",
                                color: "#ffffff",
                                minHeight: "3rem",
                                boxShadow: "0 4px 14px rgba(45, 62, 146, 0.25)",
                                border: "none",
                                borderRadius: "0.5rem"
                            }, onMouseEnter: function (e) {
                                e.currentTarget.style.backgroundColor = "#3D50B2"; // สีอ่อนลง
                            }, onMouseLeave: function (e) {
                                e.currentTarget.style.backgroundColor = "#2D3E92"; // กลับมาสีเดิม
                            } }, loading ? "Logging in..." : "Login"))),
                message && (React.createElement("p", { className: "mt-4 text-sm text-center " + (message.includes("successful") ? "text-black-600" : "text-red-500") }, message))))));
}
exports["default"] = LoginPage;
