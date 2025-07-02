"use strict";
exports.__esModule = true;
exports.getEndOfMonth = exports.getToday = exports.getTotalPax = void 0;
function getTotalPax(job) {
    return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}
exports.getTotalPax = getTotalPax;
exports.getToday = function () { return new Date().toISOString().slice(0, 10); };
exports.getEndOfMonth = function () {
    return new Date(new Date().setMonth(new Date().getMonth() + 1, 0)).toISOString().slice(0, 10);
};
