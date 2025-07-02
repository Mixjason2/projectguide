'use client';
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
function CssgGuide(_a) {
    var children = _a.children;
    var _b = react_1.useState(false), open = _b[0], setOpen = _b[1];
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("header", { className: "navbar bg-[#2D3E92] py-4 px-12 text-3xl font-bold shadow-lg flex items-center justify-between text-white" },
            react_1["default"].createElement("div", { className: "flex-none flex items-center" },
                react_1["default"].createElement("button", { className: "btn btn-square btn-ghost text-white", onClick: function () { return setOpen(true); }, "aria-label": "Open menu" },
                    react_1["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", className: "inline-block h-8 w-8 stroke-current" },
                        react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 6h16M4 12h16M4 18h16" })))),
            react_1["default"].createElement("div", { className: "flex items-center justify-center w-full" },
                react_1["default"].createElement("img", { src: "https://dth.travel/wp-content/uploads/2023/08/DTH-LOGO-FULL-WHITE-FORMERLY-new.svg", alt: "DTH Logo", className: "h-16 w-auto" })),
            react_1["default"].createElement("div", { className: "flex-none flex items-center" },
                react_1["default"].createElement("button", { className: "btn btn-square btn-ghost text-white", "aria-label": "Notifications" },
                    react_1["default"].createElement("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", className: "inline-block h-6 w-6 stroke-current" },
                        react_1["default"].createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0\r\n                  .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" }))))),
        open && (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("div", { className: "fixed inset-0 bg-black bg-opacity-30 z-30", onClick: function () { return setOpen(false); }, "aria-hidden": "true" }),
            react_1["default"].createElement("nav", { id: "drawer-navigation", className: "fixed top-0 left-0 z-40 min-h-screen w-64 bg-[#2D3E92] p-4 flex flex-col text-white", tabIndex: -1, "aria-labelledby": "drawer-navigation-label" },
                react_1["default"].createElement("div", { className: "relative flex items-center justify-between mb-4" },
                    react_1["default"].createElement("h5", { id: "drawer-navigation-label", className: "text-base font-semibold uppercase" }, "Menu"),
                    react_1["default"].createElement("button", { type: "button", "aria-controls": "drawer-navigation", className: "bg-transparent hover:bg-[#1f2b68] hover:text-white rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center", onClick: function () { return setOpen(false); }, "aria-label": "Close menu" },
                        react_1["default"].createElement("svg", { className: "w-4 h-4", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 14 14" },
                            react_1["default"].createElement("path", { stroke: "currentColor", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" })))),
                react_1["default"].createElement("div", { className: "flex flex-col flex-1 overflow-hidden pb-8" },
                    react_1["default"].createElement("ul", { className: "flex-1 overflow-y-auto space-y-2 font-medium" },
                        react_1["default"].createElement("li", null,
                            react_1["default"].createElement(link_1["default"], { href: "/calendar", className: "flex items-center p-4 text-lg font-semibold text-white rounded-xl hover:bg-[#1f2b68] group", onClick: function () { return setOpen(false); } },
                                react_1["default"].createElement("svg", { className: "w-8 h-8 text-white transition duration-75 group-hover:text-gray-200", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                    react_1["default"].createElement("rect", { x: "3", y: "4", width: "18", height: "18", rx: "3", fill: "currentColor", fillOpacity: "0.1" }),
                                    react_1["default"].createElement("rect", { x: "3", y: "8", width: "18", height: "14", rx: "2", fill: "currentColor" }),
                                    react_1["default"].createElement("path", { stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", d: "M16 2v4M8 2v4M3 8h18" }),
                                    react_1["default"].createElement("rect", { x: "7", y: "12", width: "2", height: "2", rx: "1", fill: "white" }),
                                    react_1["default"].createElement("rect", { x: "11", y: "12", width: "2", height: "2", rx: "1", fill: "white" }),
                                    react_1["default"].createElement("rect", { x: "15", y: "12", width: "2", height: "2", rx: "1", fill: "white" })),
                                react_1["default"].createElement("span", { className: "ms-4" }, "Calendar"))),
                        react_1["default"].createElement("li", null,
                            react_1["default"].createElement(link_1["default"], { href: "/home", className: "flex items-center p-4 text-lg font-semibold text-white rounded-xl hover:bg-[#1f2b68] group", onClick: function () { return setOpen(false); } },
                                react_1["default"].createElement("svg", { className: "w-8 h-8 text-white transition duration-75 group-hover:text-gray-200", "aria-hidden": "true", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
                                    react_1["default"].createElement("rect", { x: "4", y: "4", width: "16", height: "16", rx: "3", fill: "#2D3E92" }),
                                    react_1["default"].createElement("path", { stroke: "#ffffff", strokeWidth: "2", strokeLinecap: "round", d: "M8 9h8M8 13h5" }),
                                    react_1["default"].createElement("circle", { cx: "7", cy: "9", r: "1", fill: "#ffffff" }),
                                    react_1["default"].createElement("circle", { cx: "7", cy: "13", r: "1", fill: "#ffffff" })),
                                react_1["default"].createElement("span", { className: "ms-4" }, "Jobs List")))),
                    react_1["default"].createElement("div", { className: "mt-auto pt-4" },
                        react_1["default"].createElement("a", { href: "/", className: "flex w-full items-center py-4 px-3 text-red-600 font-medium rounded-lg hover:bg-[#FDECEA] transition-colors duration-200" },
                            react_1["default"].createElement("svg", { className: "w-5 h-5 text-red-600 transition duration-75 group-hover:text-red-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
                                react_1["default"].createElement("path", { stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" })),
                            react_1["default"].createElement("span", { className: "ms-3" }, "Log Out"))))))),
        react_1["default"].createElement("main", null, children)));
}
exports["default"] = CssgGuide;
