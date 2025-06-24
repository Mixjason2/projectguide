// CalendarView.tsx
'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
function getTotalPax(job) {
    return job.AdultQty + job.ChildQty + job.ChildShareQty + job.InfantQty;
}
var CalendarView = function (_a) {
    var jobs = _a.jobs, currentView = _a.currentView, setCurrentView = _a.setCurrentView;
    var events = react_1.useMemo(function () {
        if (currentView === 'dayGridMonth') {
            var grouped_1 = {};
            jobs.forEach(function (job) {
                var _a;
                var date = job.PickupDate.split('T')[0];
                ((_a = grouped_1[date]) !== null && _a !== void 0 ? _a : ) = [];
            }).push(job);
        }
    });
    return Object.entries(grouped).map(function (_a) {
        var date = _a[0], jobsOnDate = _a[1];
        return ({
            title: "(" + jobsOnDate.length + "): job",
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
    title: " " + job.serviceProductName + " ",
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
var findDuplicateNames = function (jobs) {
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
};
var handleEventClick = function (info) {
    if (currentView === 'dayGridMonth') {
        var jobsOnDate = info.event.extendedProps.jobs || [];
        var clickedDate = info.event.startStr.split('T')[0];
        var duplicateNames = findDuplicateNames(jobsOnDate);
        var details = jobsOnDate.map(function (job, i) {
            var pickupTime = new Date(job.PickupDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
            var totalPax = getTotalPax(job);
            return i + 1 + ". \uD83D\uDD52 " + pickupTime + " \uD83D\uDCCD " + job.Pickup + " | \uD83D\uDC64 " + totalPax + " Pax | \uD83C\uDFAB PNR: " + job.PNR;
        }).join('\n');
        alert("\uD83D\uDCC5 Date: " + clickedDate + "\n\uD83D\uDC64 Duplicate Names: " + (duplicateNames.length > 0 ? duplicateNames.join(', ') : 'None') + "\n\uD83D\uDCCC Jobs:\n" + details);
    }
    else {
        var job = info.event.extendedProps.job;
        var pickupTime = new Date(job.PickupDate).toLocaleString('en-GB', {
            dateStyle: 'short',
            timeStyle: 'short'
        });
        var totalPax = getTotalPax(job);
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
            borderRadius: '4px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center'
        } },
        react_1["default"].createElement("span", { style: {
                backgroundColor: isChanged ? '#fb923c' : ((job === null || job === void 0 ? void 0 : job.isChange) ? '#fb923c' : '#0891b2'),
                width: 10,
                height: 10,
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: 8,
                borderWidth: 1
            } }),
        react_1["default"].createElement("span", null, arg.event.title)));
};
return (react_1["default"].createElement(react_2["default"], { plugins: [daygrid_1["default"], timegrid_1["default"], list_1["default"], interaction_1["default"]], initialView: "timeGridWeek", events: events, datesSet: function (arg) { return setCurrentView(arg.view.type); }, height: "auto", contentHeight: "auto", aspectRatio: 1.7, headerToolbar: {
        start: 'title',
        center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        end: 'today prev,next'
    }, editable: false, selectable: true, expandRows: true, eventClick: handleEventClick, eventContent: renderEventContent, slotLabelFormat: {
        hour: '2-digit',
        minute: '2-digit',
        meridiem: false
    }, dayHeaderFormat: {
        weekday: 'short',
        day: 'numeric'
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
    }, customButtons: {
        swapAxes: {
            text: 'Swap Axes',
            click: function () {
                alert('Custom axis swapping is not natively supported.');
            }
        }
    } }));
;
exports["default"] = CalendarView;
