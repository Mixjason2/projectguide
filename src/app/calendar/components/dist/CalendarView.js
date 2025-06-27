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
var react_1 = require("react"); // ✅ เพิ่ม useState
var types_1 = require("./types");
function getStatusDots(input) {
    if (input === 'all')
        return [{ color: '#404040', label: 'All Jobs' }];
    var jobs = Array.isArray(input) ? input : [input];
    var hasNew = jobs.some(function (j) { return j.isNew; });
    var hasChange = jobs.some(function (j) { return j.isChange; });
    if (hasNew || hasChange) {
        return __spreadArrays((hasNew ? [{ color: '#0891b2', label: 'New' }] : []), (hasChange ? [{ color: '#fb923c', label: 'Changed' }] : []));
    }
    return [{ color: '#404040', label: 'Normal' }];
}
function generateICS(jobs) {
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var formatDateTime = function (date) {
        return (date.getFullYear() +
            pad(date.getMonth() + 1) +
            pad(date.getDate()) +
            'T' +
            pad(date.getHours()) +
            pad(date.getMinutes()) +
            pad(date.getSeconds()));
    };
    var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'PRODID:-//Test Calendar//EN',
    ].join('\r\n') + '\r\n';
    for (var _i = 0, jobs_1 = jobs; _i < jobs_1.length; _i++) {
        var job = jobs_1[_i];
        var start = new Date(job.PickupDate);
        var end = new Date(start.getTime() + 60 * 60 * 1000);
        ics += [
            'BEGIN:VEVENT',
            "UID:" + job.key + "@example.com",
            "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + "Z",
            "DTSTART;TZID=Asia/Bangkok:" + formatDateTime(start),
            "DTEND;TZID=Asia/Bangkok:" + formatDateTime(end),
            "SUMMARY:" + job.serviceProductName,
            "DESCRIPTION:" + (job.PNR ? "PNR: " + job.PNR + ", " : '') + "Pickup: " + job.Pickup,
            "LOCATION:" + job.Pickup,
            'END:VEVENT',
        ].join('\r\n') + '\r\n';
    }
    ics += 'END:VCALENDAR\r\n';
    return ics;
}
var CalendarView = function (_a) {
    var jobs = _a.jobs, onDatesSet = _a.onDatesSet, gotoDate = _a.gotoDate, _b = _a.currentViewProp, currentViewProp = _b === void 0 ? 'dayGridMonth' : _b;
    var calendarRef = react_1.useRef(null);
    var _c = react_1.useState('dth-calendar.ics'), icsFilename = _c[0], setIcsFilename = _c[1]; // ✅ เพิ่ม state
    var handleDownloadICS = function () {
        var _a;
        var calendarApi = (_a = calendarRef.current) === null || _a === void 0 ? void 0 : _a.getApi();
        if (!calendarApi)
            return;
        var viewStart = calendarApi.view.currentStart;
        var viewEnd = calendarApi.view.currentEnd;
        var confirmedJobs = jobs.filter(function (job) {
            var pickupDate = new Date(job.PickupDate);
            return job.IsConfirmed && pickupDate >= viewStart && pickupDate < viewEnd;
        });
        var icsContent = generateICS(confirmedJobs);
        var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = url;
        link.download = icsFilename; // ✅ ใช้ filename จาก state
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };
    react_1.useEffect(function () {
        var timeout = setTimeout(function () {
            var calendarEl = calendarRef.current;
            if (calendarEl) {
                var calendarApi = calendarEl.getApi();
                if (calendarApi.view.type !== currentViewProp) {
                    calendarApi.changeView(currentViewProp);
                }
                if (gotoDate) {
                    calendarApi.gotoDate(gotoDate);
                }
            }
        }, 0);
        return function () { return clearTimeout(timeout); };
    }, [currentViewProp, gotoDate]);
    var events = react_1.useMemo(function () {
        var confirmedJobs = jobs.filter(function (job) { return job.IsConfirmed; });
        if (currentViewProp === 'dayGridMonth') {
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
            title: "(" + jobsOnDate.length + ") job",
            start: date,
            allDay: true,
            backgroundColor: '#95c941',
            borderColor: '#0369a1',
            textColor: 'white',
            extendedProps: {
                jobs: jobsOnDate,
                type: 'confirmed'
            }
        });
    });
};
return confirmedJobs.map(function (job) { return ({
    id: "job-" + job.key,
    title: "" + job.serviceProductName,
    start: job.PickupDate,
    backgroundColor: '#95c941',
    borderColor: '#0369a1',
    textColor: 'white',
    extendedProps: { job: job }
}); });
[jobs, currentViewProp];
;
var handleEventClick = function (info) {
    if (currentViewProp === 'dayGridMonth') {
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
var generateSingleICS = function (job) {
    var pad = function (n) { return String(n).padStart(2, '0'); };
    var formatDateTime = function (date) {
        return (date.getFullYear() +
            pad(date.getMonth() + 1) +
            pad(date.getDate()) +
            'T' +
            pad(date.getHours()) +
            pad(date.getMinutes()) +
            pad(date.getSeconds()));
    };
    var start = new Date(job.PickupDate);
    var end = new Date(start.getTime() + 60 * 60 * 1000);
    var ics = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'CALSCALE:GREGORIAN',
        'PRODID:-//Test Calendar//EN',
        'BEGIN:VTIMEZONE',
        'TZID:Asia/Bangkok',
        'X-LIC-LOCATION:Asia/Bangkok',
        'BEGIN:STANDARD',
        'TZOFFSETFROM:+0700',
        'TZOFFSETTO:+0700',
        'TZNAME:ICT',
        'DTSTART:19700101T000000',
        'END:STANDARD',
        'END:VTIMEZONE',
        'BEGIN:VEVENT',
        "UID:" + job.key + "@example.com",
        "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + "Z",
        "DTSTART;TZID=Asia/Bangkok:" + formatDateTime(start),
        "DTEND;TZID=Asia/Bangkok:" + formatDateTime(end),
        "SUMMARY:" + job.serviceProductName,
        "DESCRIPTION:" + (job.PNR ? "PNR: " + job.PNR + ", " : '') + "Pickup: " + job.Pickup,
        "LOCATION:" + job.Pickup,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n') + '\r\n';
    return ics;
};
var handleDownloadSingleICS = function (job) {
    var _a;
    var icsContent = generateSingleICS(job);
    var blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    var dateStr = job.PickupDate.split('T')[0];
    link.download = ((_a = job.PNR) !== null && _a !== void 0 ? _a : job.key) + "-" + dateStr + ".ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
var renderEventContent = function (arg) {
    var _a, _b, _c;
    var job = (_a = arg.event.extendedProps) === null || _a === void 0 ? void 0 : _a.job;
    var jobs = (_b = arg.event.extendedProps) === null || _b === void 0 ? void 0 : _b.jobs;
    var statusDots = getStatusDots((_c = job !== null && job !== void 0 ? job : jobs) !== null && _c !== void 0 ? _c : []);
    return (react_1["default"].createElement("div", { className: "fc-event-main", style: {
            backgroundColor: '#95c941',
            color: 'white',
            border: '1px solid #0369a1',
            borderRadius: 6,
            padding: '4px 6px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            fontSize: '0.65rem',
            lineHeight: 1.5,
            overflow: 'hidden',
            gap: 6,
            justifyContent: 'space-between'
        } },
        react_1["default"].createElement("div", { style: {
                display: 'flex',
                gap: 4,
                alignItems: 'center',
                flexShrink: 1,
                minWidth: 0
            } },
            statusDots.map(function (_a, index) {
                var color = _a.color, label = _a.label;
                return (react_1["default"].createElement("span", { key: index, title: label, style: {
                        backgroundColor: color,
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        border: '1px solid white',
                        flexShrink: 0
                    } }));
            }),
            react_1["default"].createElement("span", { style: { flexShrink: 1, minWidth: 0 } }, arg.event.title)),
        job && (react_1["default"].createElement("button", { onClick: function (e) {
                e.stopPropagation();
                handleDownloadSingleICS(job);
            }, style: {
                backgroundColor: 'rgba(255, 255, 255, 0.25)',
                border: 'none',
                borderRadius: 5,
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.90rem',
                padding: '4px 6px',
                lineHeight: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.2s ease'
            }, title: "Download ICS for this event", onMouseEnter: function (e) { return (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.4)'); }, onMouseLeave: function (e) { return (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'); } }, "\uD83D\uDCE5"))));
};
return (react_1["default"].createElement(react_1["default"].Fragment, null,
    react_1["default"].createElement("div", { className: "mb-2" },
        react_1["default"].createElement("button", { onClick: handleDownloadICS, className: "px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700" },
            "\uD83D\uDCE5 Download (",
            icsFilename,
            ")")),
    react_1["default"].createElement(react_2["default"], { ref: calendarRef, plugins: [list_1["default"], interaction_1["default"]], initialView: "listMonth", events: events, datesSet: function (arg) {
            var year = arg.start.getFullYear();
            var month = String(arg.start.getMonth() + 1).padStart(2, '0');
            setIcsFilename("dth-calendar-" + year + "-" + month + ".ics");
            onDatesSet === null || onDatesSet === void 0 ? void 0 : onDatesSet(arg);
        }, height: "auto", contentHeight: "auto", aspectRatio: 1.7, headerToolbar: {
            start: 'title',
            center: '',
            end: 'today prev,next'
        }, editable: false, selectable: true, expandRows: true, eventClick: handleEventClick, eventContent: renderEventContent, slotLabelFormat: { hour: '2-digit', minute: '2-digit', meridiem: false }, dayHeaderFormat: { weekday: 'short' }, views: {
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
        } })));
;
exports["default"] = CalendarView;
