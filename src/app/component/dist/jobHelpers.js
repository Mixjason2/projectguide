"use strict";
exports.__esModule = true;
exports.findDuplicateNames = exports.getTotalPax = void 0;
function getTotalPax(job) {
    return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}
exports.getTotalPax = getTotalPax;
function findDuplicateNames(jobs) {
    var nameCount = jobs.reduce(function (acc, job) {
        var _a;
        var name = (_a = job.pax_name) === null || _a === void 0 ? void 0 : _a.toString();
        if (name)
            acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(nameCount)
        .filter(function (_a) {
        var _ = _a[0], count = _a[1];
        return count > 1;
    })
        .map(function (_a) {
        var name = _a[0];
        return name;
    });
}
exports.findDuplicateNames = findDuplicateNames;
