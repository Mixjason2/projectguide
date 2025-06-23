'use client';
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
var useFetchJobs_1 = require("../component/useFetchJobs");
var jobHelpers_1 = require("../component/jobHelpers");
require("./calendar.css");
function CalendarExcel() {
    // ดึงข้อมูล jobs พร้อมสถานะการโหลดและ error
    var _a = useFetchJobs_1["default"](), jobs = _a.jobs, loading = _a.loading, error = _a.error, setJobs = _a.setJobs;
    // เก็บ view ปัจจุบันของปฏิทิน (dayGridMonth, timeGridWeek, ฯลฯ)
    var _b = react_1.useState('dayGridMonth'), currentView = _b[0], setCurrentView = _b[1];
    // เก็บ job ที่ถูกเลือกเพื่อแสดง action ด้านล่าง
    var _c = react_1.useState(null), selectedJob = _c[0], setSelectedJob = _c[1];
    // สร้าง event list สำหรับ FullCalendar ตาม view และ jobs
    var events = react_1.useMemo(function () {
        if (currentView === 'dayGridMonth') {
            // รวม jobs ตามวันที่ PickupDate (เฉพาะ job ที่ยืนยันแล้ว)
            var grouped_1 = {};
            jobs
                .filter(function (j) { return j.IsConfirmed; })
                .forEach(function (job) {
                var _a;
                var date = job.PickupDate.split('T')[0];
                ((_a = grouped_1[date]) !== null && _a !== void 0 ? _a : ) = [];
            }).push(job);
        }
    });
    // สร้าง event group แบบแสดงจำนวน job ต่อวัน
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
}
exports["default"] = CalendarExcel;
{
    // สำหรับ view อื่นๆ แสดง event แยกตาม job
    return jobs
        .filter(function (j) { return j.IsConfirmed; })
        .map(function (job) { return ({
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
}
[jobs, currentView];
;
// ฟังก์ชันจัดการคลิก event ในปฏิทิน
var handleEventClick = function (info) {
    if (currentView === 'dayGridMonth') {
        // กรณี month view แสดงรายละเอียด job ในวันนั้นพร้อมตรวจหาชื่อซ้ำ
        var jobsOnDate = info.event.extendedProps.jobs || [];
        var clickedDate = info.event.startStr.split('T')[0];
        var duplicateNames = jobHelpers_1.findDuplicateNames(jobsOnDate);
        var details = jobsOnDate.map(function (job, i) {
            var pickupTime = new Date(job.PickupDate).toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            });
            var totalPax = jobHelpers_1.getTotalPax(job);
            return i + 1 + ". \uD83D\uDD52 " + pickupTime + " \uD83D\uDCCD " + job.Pickup + " | \uD83D\uDC64 " + totalPax + " Pax | \uD83C\uDFAB PNR: " + job.PNR;
        }).join('\n');
        alert("\uD83D\uDCC5 Date: " + clickedDate + "\n\uD83D\uDC64 Duplicate Names: " + (duplicateNames.length > 0 ? duplicateNames.join(', ') : 'None') + "\n\uD83D\uDCCC Jobs:\n" + details);
    }
    else {
        // กรณี view อื่นๆ เลือก job เดียว
        var job = info.event.extendedProps.job;
        setSelectedJob(job);
    }
};
if (loading)
    return react_1["default"].createElement(LoadingIndicator_1["default"], null);
if (error)
    return react_1["default"].createElement(ErrorMessage_1["default"], { error: error });
return (react_1["default"].createElement(cssguide_1["default"], null,
    react_1["default"].createElement(react_2["default"], { plugins: [daygrid_1["default"], timegrid_1["default"], list_1["default"], interaction_1["default"]], initialView: "timeGridWeek", events: events, datesSet: function (arg) { return setCurrentView(arg.view.type); }, height: "auto", contentHeight: "auto", aspectRatio: 1.7, headerToolbar: {
            start: 'title',
            center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
            end: 'today prev,next'
        }, editable: false, selectable: true, expandRows: true, eventClick: handleEventClick, eventContent: CalendarEventRenderer_1["default"], slotLabelFormat: {
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false
        }, dayHeaderFormat: {
            weekday: 'short',
            day: 'numeric'
        } }),
    selectedJob && !selectedJob.IsConfirmed && !selectedJob.IsCancel && (react_1["default"].createElement("div", { className: "mt-6 max-w-xl mx-auto" },
        react_1["default"].createElement(JobAction_1["default"], { job: __assign(__assign({}, selectedJob), { all: [selectedJob], keys: selectedJob.key }), setJobs: setJobs })))));
