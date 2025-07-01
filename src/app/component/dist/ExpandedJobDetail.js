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
exports.__esModule = true;
var react_1 = require("react");
var JobAction_1 = require("./JobAction");
var customFormatDate = function (dateStr) {
    var date = new Date(dateStr);
    if (isNaN(date.getTime()))
        return '';
    var day = String(date.getDate()).padStart(2, '0');
    var month = date.toLocaleString('default', { month: 'short' });
    var year = date.getFullYear();
    return day + "-" + month + "-" + year;
};
var ExpandedJobDetail = function (_a) {
    var job = _a.job, expandedPNRs = _a.expandedPNRs, renderPlaceDate = _a.renderPlaceDate, renderField = _a.renderField, setJobs = _a.setJobs, onAccept = _a.onAccept, onReject = _a.onReject;
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
        key: "" + job.key,
        IsConfirmed: Array.isArray(job.IsConfirmed) ? job.IsConfirmed[index] : job.IsConfirmed,
        IsCancel: Array.isArray(job.IsCancel) ? job.IsCancel[index] : job.IsCancel
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
            var firstItem = items[0];
            var miniJob = __assign(__assign({}, job), { PNR: firstItem.pnr, Pickup: firstItem.pickup, PickupDate: firstItem.pickupDate, Dropoff: firstItem.dropoff, DropoffDate: firstItem.dropoffDate, AdultQty: firstItem.adult, ChildQty: firstItem.child, ChildShareQty: firstItem.childShare, InfantQty: firstItem.infant, key: Number(firstItem.key), IsConfirmed: firstItem.IsConfirmed, IsCancel: firstItem.IsCancel });
            return (react_1["default"].createElement("div", { key: pnr, className: "rounded-xl bg-white border border-gray-300 shadow-sm max-w-xs mx-auto" },
                react_1["default"].createElement("div", { className: "bg-gray-50 border border-gray-200 rounded-t-lg space-y-3 break-words p-6" },
                    react_1["default"].createElement("h3", { className: "font-bold text-blue-800 text-lg leading-tight" },
                        "PNR: ",
                        pnr),
                    items.map(function (item) { return (react_1["default"].createElement("div", { key: item.key, className: "text-gray-700 text-sm leading-relaxed whitespace-pre-line" },
                        renderPlaceDate(item.pickup, customFormatDate(item.pickupDate), "Pickup"),
                        renderPlaceDate(item.dropoff, customFormatDate(item.dropoffDate), "Dropoff"),
                        renderField("Pax", item.adult + item.child + item.childShare + item.infant))); })),
                react_1["default"].createElement("div", { className: "bg-white border border-t-0 border-gray-200 rounded-b-lg flex justify-center w-auto p-6" },
                    react_1["default"].createElement(JobAction_1["default"], { job: miniJob, setJobs: setJobs }))));
        }))));
};
exports["default"] = ExpandedJobDetail;
