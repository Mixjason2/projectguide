"use strict";
exports.__esModule = true;
var CalendarEventRenderer = function (arg) {
    var _a, _b;
    var job = (_a = arg.event.extendedProps) === null || _a === void 0 ? void 0 : _a.job;
    var isChanged = (_b = arg.event.extendedProps) === null || _b === void 0 ? void 0 : _b.isChanged;
    return (React.createElement("div", { className: "fc-event-main flex items-center", style: {
            backgroundColor: '#95c941',
            color: 'white',
            borderColor: '#0369a1',
            borderRadius: '4px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center'
        } },
        React.createElement("span", { style: {
                backgroundColor: isChanged ? '#fb923c' : ((job === null || job === void 0 ? void 0 : job.isChange) ? '#fb923c' : '#0891b2'),
                width: 10,
                height: 10,
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: 8
            } }),
        React.createElement("span", null, arg.event.title)));
};
exports["default"] = CalendarEventRenderer;
