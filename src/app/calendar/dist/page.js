'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var react_2 = require("@fullcalendar/react");
var daygrid_1 = require("@fullcalendar/daygrid");
var timegrid_1 = require("@fullcalendar/timegrid");
var list_1 = require("@fullcalendar/list");
var interaction_1 = require("@fullcalendar/interaction");
var cssguide_1 = require("../cssguide");
require("./calendar.css");
function CalendarExcel() {
    return (react_1["default"].createElement(cssguide_1["default"], null,
        react_1["default"].createElement("div", { className: "flex justify-center items-center min-h-screen bg-base-200" },
            react_1["default"].createElement("div", { className: "bg-base-100 rounded-xl shadow-xl border border-base-300 w-full max-w-screen-2xl h-[90vh] flex flex-col" },
                react_1["default"].createElement(react_2["default"], { plugins: [daygrid_1["default"], timegrid_1["default"], list_1["default"], interaction_1["default"]], initialView: "dayGridMonth", events: [
                        { title: 'event 1', date: '2024-06-01' },
                        { title: 'event 2', date: '2024-06-02' }
                    ], height: "100%", contentHeight: "auto", aspectRatio: 1.7, headerToolbar: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth'
                    }, editable: false, selectable: true, expandRows: true })))));
}
exports["default"] = CalendarExcel;
