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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var axios_1 = require("axios");
var sweetalert2_1 = require("sweetalert2");
require("sweetalert2/dist/sweetalert2.min.css");
var UploadImagesWithRemark = function (_a) {
    var token = _a.token, keyValue = _a.keyValue, job = _a.job;
    var _b = react_1.useState(""), remark = _b[0], setRemark = _b[1];
    var _c = react_1.useState([]), selectedFiles = _c[0], setSelectedFiles = _c[1];
    var _d = react_1.useState([]), previewBase64List = _d[0], setPreviewBase64List = _d[1];
    var _e = react_1.useState(false), loading = _e[0], setLoading = _e[1];
    var _f = react_1.useState(null), responseMsg = _f[0], setResponseMsg = _f[1];
    var _g = react_1.useState(), uploadedData = _g[0], setUploadedData = _g[1];
    var _h = react_1.useState(true), initialLoading = _h[0], setInitialLoading = _h[1];
    var _j = react_1.useState(false), isEditing = _j[0], setIsEditing = _j[1];
    var _k = react_1.useState(false), hasUploaded = _k[0], setHasUploaded = _k[1]; // เคยอัปโหลดหรือยัง
    var _l = react_1.useState(null), previewModal = _l[0], setPreviewModal = _l[1];
    // โหลดข้อมูลที่เคยอัปโหลดไว้ (ถ้ามี)
    var fetchUploadedData = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, flatData, matched, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("🔄 กำลังโหลดข้อมูลจาก API...");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/upload/" + keyValue, { token: token })];
                case 2:
                    res = _a.sent();
                    console.log("✅ ได้ข้อมูลจาก API:", res.data);
                    if (Array.isArray(res.data)) {
                        flatData = res.data.flat();
                        matched = res.data.find(function (item) { return item.BookingAssignmentId === keyValue; });
                        if (matched) {
                            console.log("✅ พบข้อมูลที่ตรงกับ key:", keyValue);
                            setUploadedData(res.data);
                            setHasUploaded(true);
                            setIsEditing(false);
                        }
                        else {
                            console.log("❌ ไม่มีข้อมูลที่ตรงกับ key:", keyValue);
                            setUploadedData([]);
                            setHasUploaded(false);
                            setIsEditing(false); // ให้แสดงหน้า UploadsetUploadedData([]);
                        }
                    }
                    else {
                        console.log("❌ ข้อมูลที่ได้ไม่ใช่ array");
                        setUploadedData([]);
                        setHasUploaded(false);
                        setIsEditing(false);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("❌ ดึงข้อมูลไม่สำเร็จ:", error_1);
                    setUploadedData([]);
                    setHasUploaded(false);
                    setIsEditing(false);
                    return [3 /*break*/, 5];
                case 4:
                    setInitialLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchUploadedData();
    }, [keyValue, token]);
    var sendEmail = function (_a) {
        var emails = _a.emails, emails_CC = _a.emails_CC, subject = _a.subject, body = _a.body;
        return __awaiter(void 0, void 0, void 0, function () {
            var res, error_2;
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
                        sweetalert2_1["default"].fire({
                            icon: "success",
                            title: "📧 Email sent successfully!",
                            showConfirmButton: false,
                            timer: 2000,
                            timerProgressBar: true,
                            toast: true,
                            position: "top-end"
                        });
                        return [2 /*return*/, res.data];
                    case 2:
                        error_2 = _b.sent();
                        console.error("❌ Failed to send email", error_2);
                        sweetalert2_1["default"].fire({
                            icon: "error",
                            title: "❌ Failed to send email",
                            showConfirmButton: false,
                            timer: 2500,
                            toast: true,
                            position: "top-end"
                        });
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    var fileToBase64 = function (file) {
        console.log("📁 เริ่มแปลงไฟล์:", file.name);
        return new Promise(function (resolve, reject) {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function () {
                console.log("✅ แปลงสำเร็จ:", file.name);
                resolve(reader.result);
            };
            reader.onerror = function (error) {
                console.error("❌ แปลงไฟล์ล้มเหลว:", error);
                reject(error);
            };
        });
    };
    // กรณีผู้ใช้คลิก Edit
    var handleEdit = function () {
        if (uploadedData && Array.isArray(uploadedData) && uploadedData.length > 0) {
            setRemark(uploadedData[0].Remark || "");
            setPreviewBase64List(uploadedData[0].Images.map(function (img) { return img.ImageBase64; }));
            setIsEditing(true);
        }
    };
    var openPreview = function (base64, index) {
        setPreviewModal({ base64: base64, index: index });
    };
    // ฟังก์ชันปิด modal
    var closePreview = function () {
        setPreviewModal(null);
    };
    var handleRemovePreviewImage = function (groupIndex, imageIndex) { return __awaiter(void 0, void 0, void 0, function () {
        var updatedData, target, updatedImages, updatedBase64List, payload;
        return __generator(this, function (_a) {
            if (!uploadedData)
                return [2 /*return*/];
            updatedData = __spreadArrays(uploadedData);
            target = updatedData[groupIndex];
            updatedImages = target.Images.filter(function (_, idx) { return idx !== imageIndex; });
            updatedData[groupIndex] = __assign(__assign({}, target), { Images: updatedImages });
            // อัพเดต state ทันทีให้ UI รีเฟรช
            setUploadedData(updatedData);
            // *** อัพเดต previewBase64List ให้ตรงกับ uploadedData[0].Images ***
            if (groupIndex === 0) {
                updatedBase64List = updatedImages.map(function (img) { return img.ImageBase64; });
                setPreviewBase64List(updatedBase64List);
            }
            payload = {
                token: token,
                data: {
                    key: target.key,
                    Remark: target.Remark,
                    BookingAssignmentId: keyValue,
                    UploadBy: target.UploadBy || "Your Name",
                    UploadDate: new Date().toISOString(),
                    Images: updatedImages
                }
            };
            return [2 /*return*/];
        });
    }); };
    var handleSave = function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, res, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!uploadedData || !Array.isArray(uploadedData) || uploadedData.length === 0)
                        return [2 /*return*/];
                    setLoading(true);
                    setResponseMsg(null);
                    payload = {
                        token: token,
                        data: {
                            key: uploadedData[0].key,
                            Remark: remark,
                            BookingAssignmentId: keyValue,
                            UploadBy: uploadedData[0].UploadBy || "Your Name",
                            UploadDate: new Date().toISOString(),
                            Images: previewBase64List.map(function (base64) { return ({ ImageBase64: base64 }); })
                        }
                    };
                    console.log(payload);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/upload/" + keyValue + "/update", // <-- ใช้ endpoint แก้ไขจริง
                        payload)];
                case 2:
                    res = _a.sent();
                    setResponseMsg(res.data.message || "อัปเดตสำเร็จ");
                    return [4 /*yield*/, fetchUploadedData()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, sendEmail({
                            emails: ["veeratha.p@dth.travel"],
                            emails_CC: "",
                            subject: "Job Updated: " + keyValue,
                            body: "The job associated with reference number " + job.PNR + " has been successfully updated with the following remark:\n\n\"" + remark + "\"\n\nIf you have any questions or require further information, please do not hesitate to contact the operations te\n"
                        })];
                case 4:
                    _a.sent();
                    setIsEditing(false);
                    return [3 /*break*/, 7];
                case 5:
                    error_3 = _a.sent();
                    console.error("❌ อัปเดตล้มเหลว:", error_3);
                    setResponseMsg("เกิดข้อผิดพลาด: " + (error_3.message || "Unknown error"));
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    var handleFileChange = function (e) { return __awaiter(void 0, void 0, void 0, function () {
        var files, filesArray, base64List;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    files = e.target.files;
                    if (!files)
                        return [2 /*return*/];
                    filesArray = Array.from(files);
                    console.log("📂 เลือกไฟล์:", filesArray.map(function (f) { return f.name; }));
                    setSelectedFiles(filesArray);
                    return [4 /*yield*/, Promise.all(filesArray.map(fileToBase64))];
                case 1:
                    base64List = _a.sent();
                    setPreviewBase64List(function (prev) { return __spreadArrays(prev, base64List); }); // append รูป base64
                    console.log("🖼 Preview base64 พร้อม:", previewBase64List.length + base64List.length, "ไฟล์");
                    return [2 /*return*/];
            }
        });
    }); };
    var handleUpload = function () { return __awaiter(void 0, void 0, void 0, function () {
        var payload, res, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setLoading(true);
                    setResponseMsg(null);
                    if (previewBase64List.length === 0 && remark.trim()) {
                        setResponseMsg("❌ ไม่สามารถใส่ Remark โดยไม่มีรูปภาพได้");
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    payload = {
                        token: token,
                        data: {
                            Remark: remark,
                            key: keyValue,
                            Images: previewBase64List.map(function (base64) { return ({ ImageBase64: base64 }); })
                        }
                    };
                    return [4 /*yield*/, axios_1["default"].post("https://operation.dth.travel:7082/api/upload/", payload)];
                case 2:
                    res = _a.sent();
                    setResponseMsg(res.data.message || "Upload สำเร็จ");
                    return [4 /*yield*/, fetchUploadedData()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, sendEmail({
                            emails: ["veeratha.p@dth.travel"],
                            emails_CC: "",
                            subject: "Job Uploaded: " + keyValue,
                            body: "The job associated with reference number " + job.PNR + " has been successfully uploaded with the following remark:\n\n\"" + remark + "\"\n\nPlease contact the operations team if you require any further assistance."
                        })];
                case 4:
                    _a.sent();
                    setIsEditing(false);
                    return [3 /*break*/, 7];
                case 5:
                    error_4 = _a.sent();
                    setResponseMsg("เกิดข้อผิดพลาด: " + (error_4.message || "Unknown error"));
                    return [3 /*break*/, 7];
                case 6:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    if (initialLoading) {
        return react_1["default"].createElement("p", { className: "text-center text-gray-500" }, "\u23F3 \u0E01\u0E33\u0E25\u0E31\u0E07\u0E42\u0E2B\u0E25\u0E14\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25...");
    }
    if (uploadedData && Array.isArray(uploadedData) && hasUploaded && !isEditing) {
        return (react_1["default"].createElement("div", { className: "max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md" },
            react_1["default"].createElement("h2", { className: "text-xl font-semibold mb-4 text-green-600" }, "\uD83D\uDCE6 Uploaded Summary"),
            uploadedData.map(function (src, idx) {
                var _a;
                return (react_1["default"].createElement("div", { key: idx, className: "mb-4 border-b pb-4" },
                    react_1["default"].createElement("p", { className: "mb-2" },
                        react_1["default"].createElement("strong", null, "Remark:"),
                        " ",
                        src.Remark),
                    react_1["default"].createElement("div", { className: "flex flex-wrap gap-3" }, (_a = src.Images) === null || _a === void 0 ? void 0 : _a.map(function (img, imgIdx) { return (img.ImageBase64.startsWith("data:application/pdf") ? (react_1["default"].createElement("a", { key: imgIdx, href: img.ImageBase64, download: "file-" + imgIdx + ".pdf", className: "w-20 h-20 flex items-center justify-center bg-gray-100 border rounded-lg text-blue-600 text-xs font-medium text-center hover:underline", title: "\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14 PDF" }, "\uD83D\uDCC4 Download PDF")) : (react_1["default"].createElement("img", { key: imgIdx, src: img.ImageBase64, alt: "uploaded-" + imgIdx, className: "w-20 h-20 object-cover rounded-lg border shadow-sm" }))); }))));
            }),
            react_1["default"].createElement("button", { onClick: handleEdit, className: "mt-4 w-full py-2 px-4 rounded-full bg-yellow-500 text-white font-semibold hover:bg-yellow-600" }, "\u270F\uFE0F Edit")));
    }
    console.log("📝 แสดงหน้าสำหรับอัปโหลดใหม่");
    return (react_1["default"].createElement("div", { className: "max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md" },
        react_1["default"].createElement("h2", { className: "text-xl font-semibold mb-4" }, "\uD83D\uDCE4 Upload Images with Remark"),
        react_1["default"].createElement("textarea", { className: "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4", placeholder: "\u0E01\u0E23\u0E2D\u0E01 Remark", value: remark, rows: 3, onChange: function (e) { return setRemark(e.target.value); } }),
        react_1["default"].createElement("input", { type: "file", accept: "image/*,application/pdf" // 👈 เพิ่ม pdf
            , multiple: true, onChange: handleFileChange, className: "block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4\r\n          file:rounded-full file:border-0\r\n          file:text-sm file:font-semibold\r\n          file:bg-blue-100 file:text-blue-700\r\n          hover:file:bg-blue-200 mb-4" }),
        react_1["default"].createElement("div", { className: "flex flex-wrap gap-3 mb-4" },
            uploadedData && uploadedData.map(function (src, groupIdx) {
                var _a;
                return (react_1["default"].createElement("div", { key: groupIdx, className: "mb-4 border-b pb-4" },
                    react_1["default"].createElement("p", { className: "mb-2" },
                        react_1["default"].createElement("strong", null, "Remark:"),
                        " ",
                        src.Remark),
                    react_1["default"].createElement("div", { className: "flex flex-wrap gap-3" }, (_a = src.Images) === null || _a === void 0 ? void 0 : _a.map(function (img, imgIdx) { return (react_1["default"].createElement("div", { key: imgIdx, className: "relative group" },
                        img.ImageBase64.startsWith("data:application/pdf") ? (react_1["default"].createElement("a", { href: img.ImageBase64, download: "file-" + imgIdx + ".pdf", className: "w-20 h-20 flex items-center justify-center bg-gray-100 border rounded-lg text-blue-600 text-xs font-medium text-center hover:underline", title: "\u0E14\u0E32\u0E27\u0E19\u0E4C\u0E42\u0E2B\u0E25\u0E14 PDF" }, "\uD83D\uDCC4 Download PDF")) : (react_1["default"].createElement("img", { src: img.ImageBase64, alt: "uploaded-" + imgIdx, className: "w-20 h-20 object-cover rounded-lg border shadow-sm", onClick: function () { return openPreview(img.ImageBase64, imgIdx); } })),
                        react_1["default"].createElement("button", { onClick: function () { return handleRemovePreviewImage(groupIdx, imgIdx); }, className: "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-80 hover:opacity-100", title: "Delete" }, "\u2715"))); }))));
            }),
            previewModal && (react_1["default"].createElement("div", { className: "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50", onClick: closePreview },
                react_1["default"].createElement("div", { className: "relative max-w-3xl max-h-[80vh] p-4 bg-white rounded-lg shadow-lg", onClick: function (e) { return e.stopPropagation(); } },
                    previewModal.base64.startsWith("data:application/pdf") ? (react_1["default"].createElement("iframe", { src: previewModal.base64, className: "w-full h-[70vh]", title: "PDF Preview" })) : (react_1["default"].createElement("img", { src: previewModal.base64, alt: "Preview-" + previewModal.index, className: "max-w-full max-h-[70vh] rounded" })),
                    react_1["default"].createElement("div", { className: "flex justify-center mt-4" },
                        react_1["default"].createElement("a", { href: previewModal.base64, download: "file-" + previewModal.index + (previewModal.base64.startsWith("data:application/pdf") ? ".pdf" : ".png"), className: "inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" }, "\u2B07\uFE0F Download")),
                    react_1["default"].createElement("button", { onClick: closePreview, className: "absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-2xl font-bold", "aria-label": "Close Preview" }, "\u00D7"))))),
        !hasUploaded && (react_1["default"].createElement("button", { onClick: handleUpload, disabled: loading || (previewBase64List.length === 0 && !!remark.trim()), className: "w-full py-2 px-4 rounded-full font-semibold transition " + (loading || (previewBase64List.length === 0 && !!remark.trim())
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600") }, loading ? "Uploading..." : "📤 Upload")),
        hasUploaded && isEditing && (react_1["default"].createElement("button", { onClick: handleSave, disabled: loading || (previewBase64List.length === 0 && !!remark.trim()), className: "w-full py-2 px-4 rounded-full font-semibold transition " + (loading || (previewBase64List.length === 0 && !!remark.trim())
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600") }, loading ? "Saving..." : "💾 Save")),
        responseMsg && (react_1["default"].createElement("p", { className: "mt-4 text-center text-sm text-green-600" }, responseMsg))));
};
exports["default"] = UploadImagesWithRemark;
