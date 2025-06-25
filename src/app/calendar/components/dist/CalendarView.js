'use client';
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var types_1 = require("./types");
function getStatusDots(input) {
    var jobs = Array.isArray(input) ? input : [input];
    var hasNew = jobs.some(function (j) { return j.isNew; });
    var hasChange = jobs.some(function (j) { return j.isChange; });
    if (hasNew || hasChange) {
        return __spreadArrays((hasNew ? [{ color: '#0891b2', label: 'New' }] : []), (hasChange ? [{ color: '#fb923c', label: 'Changed' }] : []));
    }
    return [{ color: '#404040', label: 'Normal' }];
}
var CalendarView = function (_a) {
    var jobs = _a.jobs;
    var _b = react_1.useState('dayGridMonth'), currentView = _b[0], setCurrentView = _b[1];
    var events = react_1.useMemo(function () {
        var _a;
        var confirmedJobs = jobs.filter(function (job) { return job.IsConfirmed; });
        if (currentView === 'dayGridMonth') {
            var allJobsGrouped_1 = {};
            var groupedConfirmed = {};
            jobs.forEach(function (job) {
                var _a;
                if (!job.PickupDate)
                    return;
                var date = job.PickupDate.split('T')[0];
                ((_a = allJobsGrouped_1[date]) !== null && _a !== void 0 ? _a : ) = [];
            }).push(job);
            if (job.IsConfirmed)
                ((_a = groupedConfirmed[date]) !== null && _a !== void 0 ? _a : ) = [];
        }
    }).push(job);
};
var allDates = Array.from(new Set(__spreadArrays(Object.keys(allJobsGrouped), Object.keys(groupedConfirmed))));
return allDates.flatMap(function (date) {
    var confirmed = groupedConfirmed[date] || [];
    var all = allJobsGrouped[date] || [];
    var result = [];
    if (confirmed.length > 0) {
        result.push({
            title: "(" + confirmed.length + ") job",
            start: date,
            allDay: true,
            backgroundColor: '#95c941',
            borderColor: '#0369a1',
            textColor: 'white',
            extendedProps: {
                jobs: confirmed,
                type: 'confirmed'
            }
        });
    }
    result.push({
        title: "All (" + all.length + ")",
        start: date,
        allDay: true,
        backgroundColor: '#404040',
        borderColor: '#0369a1',
        textColor: 'white',
        extendedProps: {
            jobs: all,
            type: 'viewAll'
        }
    });
    return result;
});
{
    return confirmedJobs.map(function (job) { return ({
        id: "job-" + job.key,
        title: "" + job.serviceProductName,
        start: job.PickupDate,
        backgroundColor: '#95c941',
        borderColor: '#0369a1',
        textColor: 'white',
        extendedProps: {
            job: job
        }
    }); });
}
[jobs, currentView];
;
var handleEventClick = function (info) {
    if (currentView === 'dayGridMonth') {
        var jobsOnDate = info.event.extendedProps.jobs || [];
        var clickedDate = info.event.startStr.split('T')[0];
        var details = jobsOnDate
            .map(function (job, i) {
            var pickupTime = new Date(job.PickupDate).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            });
            var totalPax = types_1.getTotalPax(job);
            return i + 1 + ". \uD83D\uDD52 " + pickupTime + " \uD83D\uDCCD " + job.Pickup + " | \uD83D\uDC64 " + totalPax + " Pax | \uD83C\uDFAB PNR: " + job.PNR;
        })
            .join('\n');
        alert("\uD83D\uDCC5 Date: " + clickedDate + "\n\uD83D\uDCCC Jobs:\n" + details);
    }
    else {
        var job = info.event.extendedProps.job;
        var pickupTime = new Date(job.PickupDate).toLocaleString('en-GB', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        var totalPax = types_1.getTotalPax(job);
        alert("\uD83C\uDFAB PNR: " + job.PNR + "\n\uD83D\uDD52 Pickup: " + pickupTime + "\n\uD83D\uDCCD Location: " + job.Pickup + "\n\uD83D\uDC64 Pax: " + totalPax + " (Adult: " + job.AdultQty + ", Child: " + job.ChildQty + ", Share: " + job.ChildShareQty + ", Infant: " + job.InfantQty + ")\n\uD83D\uDC64 Name: " + job.pax_name);
    }
};
var renderEventContent = function (arg) {
    var _a, _b, _c, _d;
    var type = (_a = arg.event.extendedProps) === null || _a === void 0 ? void 0 : _a.type;
    var job = (_b = arg.event.extendedProps) === null || _b === void 0 ? void 0 : _b.job;
    var jobs = (_c = arg.event.extendedProps) === null || _c === void 0 ? void 0 : _c.jobs;
    var statusDots = getStatusDots((_d = job !== null && job !== void 0 ? job : jobs) !== null && _d !== void 0 ? _d : []);
    var backgroundColor = type === 'viewAll' ? '#404040' : '#95c941';
    return (react_1["default"].createElement("div", { className: "fc-event-main", style: {
            backgroundColor: backgroundColor,
            color: 'white',
            borderColor: '#0369a1',
            borderRadius: 4,
            padding: '2px 0px',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: '100%',
            fontSize: '0.52rem',
            lineHeight: 1.4,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minWidth: 0,
            minHeight: 24,
            gap: 2
        } },
        react_1["default"].createElement("div", { style: { display: 'flex', flexShrink: 0, gap: 1 } }, statusDots.map(function (_a, index) {
            var color = _a.color, label = _a.label;
            return (react_1["default"].createElement("span", { key: index, title: label, style: {
                    backgroundColor: color,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    border: '1px solid white',
                    flexShrink: 0,
                    display: 'inline-block'
                } }));
        })),
        react_1["default"].createElement("span", { style: { flexShrink: 1, minWidth: 0 } }, arg.event.title)));
};
return (react_1["default"].createElement(react_2["default"], { plugins: [daygrid_1["default"], timegrid_1["default"], list_1["default"], interaction_1["default"]], initialView: "dayGridMonth", events: events, datesSet: function (arg) { return setCurrentView(arg.view.type); }, height: "auto", contentHeight: "auto", aspectRatio: 1.7, headerToolbar: {
        start: 'title',
        center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        end: 'today prev,next'
    }, editable: false, selectable: true, expandRows: true, eventClick: handleEventClick, eventContent: renderEventContent, slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
    }, dayHeaderFormat: {
        weekday: 'short'
    }, views: {
        timeGridWeek: {
            slotLabelFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            dayHeaderFormat: {
                weekday: 'short',
                day: 'numeric'
            }
        }
    } }));
;
exports["default"] = CalendarView;
