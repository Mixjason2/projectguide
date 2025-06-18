"use strict";
exports.__esModule = true;
var react_1 = require("react");
var FileToBase64 = function (_a) {
    var onBase64ListReady = _a.onBase64ListReady;
    var _b = react_1.useState([]), previews = _b[0], setPreviews = _b[1];
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
                        reject("อ่านไฟล์ไม่สำเร็จ");
                    }
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });
        Promise.all(promises)
            .then(function (base64List) {
            setPreviews(base64List);
            onBase64ListReady(base64List); // ส่ง base64 ทั้งหมดให้ parent ใช้งาน
        })["catch"](function (err) {
            console.error("เกิดข้อผิดพลาดในการแปลงไฟล์:", err);
        });
    };
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("input", { type: "file", multiple: true, onChange: handleFileChange, accept: "image/*,application/pdf", className: "block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100" }),
        react_1["default"].createElement("div", { className: "mt-2 flex gap-2 flex-wrap" }, previews.map(function (src, idx) {
            return src.startsWith("data:image") ? (react_1["default"].createElement("img", { key: idx, src: src, alt: "preview-" + idx, className: "w-24 h-24 object-cover rounded" })) : (react_1["default"].createElement("div", { key: idx, className: "text-sm text-gray-600" }, "\uD83D\uDCC4 \u0E44\u0E1F\u0E25\u0E4C PDF \u0E41\u0E19\u0E1A\u0E41\u0E25\u0E49\u0E27"));
        }))));
};
exports["default"] = FileToBase64;
