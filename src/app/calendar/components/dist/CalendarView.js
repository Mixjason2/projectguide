'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var types_1 = require("./types");
var CalendarView = function (_a) {
    var jobs = _a.jobs;
    var _b = react_1.useState('dayGridMonth'), currentView = _b[0], setCurrentView = _b[1];
    var events = react_1.useMemo(function () {
        if (currentView === 'dayGridMonth') {
            var grouped_1 = {};
            jobs.forEach(function (job) {
                var _a;
                if (!job.PickupDate)
                    return;
                var date = job.PickupDate.split('T')[0];
                ((_a = grouped_1[date]) !== null && _a !== void 0 ? _a : ) = [];
            }).push(job);
        }
    });
    return Object.entries(grouped).map(function (_a) {
        var date = _a[0], jobsOnDate = _a[1];
        return ({
            title: "(" + jobsOnDate.length + ") \u0E07\u0E32\u0E19",
            start: date,
            allDay: true,
            backgroundColor: '#95c941',
            borderColor: '#0369a1',
            textColor: 'white',
            extendedProps: {
                jobs: jobsOnDate,
                isChanged: jobsOnDate.some(function (j) { return j.isChange; })
            }
        });
    });
}, _a = void 0, jobs = _a["return"], map = _a.map;
(function (job) { return ({
    id: job.key.toString(),
    title: "" + job.serviceProductName,
    start: job.PickupDate,
    backgroundColor: job.isChange ? '#fb923c' : '#95c941',
    borderColor: '#0369a1',
    textColor: 'white',
    extendedProps: {
        job: job
    }
}); });
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
    var _a, _b;
    var job = (_a = arg.event.extendedProps) === null || _a === void 0 ? void 0 : _a.job;
    var isChanged = (_b = arg.event.extendedProps) === null || _b === void 0 ? void 0 : _b.isChanged;
    return (react_1["default"].createElement("div", { className: "fc-event-main flex items-center", style: {
            backgroundColor: '#95c941',
            color: 'white',
            borderColor: '#0369a1',
            borderRadius: 4,
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            boxSizing: 'border-box',
            width: '100%',
            fontSize: '0.75rem',
            lineHeight: 1.2,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        } },
        react_1["default"].createElement("span", { style: {
                backgroundColor: isChanged ? '#fb923c' : (job === null || job === void 0 ? void 0 : job.isChange) ? '#fb923c' : '#0891b2',
                width: 8,
                height: 8,
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: 6,
                borderWidth: 1,
                borderStyle: 'solid',
                boxSizing: 'border-box',
                flexShrink: 0
            } }),
        react_1["default"].createElement("span", null, arg.event.title)));
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
