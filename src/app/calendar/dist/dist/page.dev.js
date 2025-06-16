'use client';
"use strict";

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

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
  var _this = this;

  var _a = react_1.useState([]),
      jobs = _a[0],
      setJobs = _a[1];

  var _b = react_1.useState(true),
      loading = _b[0],
      setLoading = _b[1];

  var _c = react_1.useState(null),
      error = _c[0],
      setError = _c[1];

  react_1.useEffect(function () {
    fetch('https://operation.dth.travel:7082/api/guide/job', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: 'AVM4UmVVMJuXWXzdOvGgaTqNm/Ysfkw0DnscAzbE+J4+Kr7AYjIs7Eu+7ZXBGs+MohOuqTTZkdIiJ5Iw8pQVJ0tWaz/R1sbE8ksM2sKYSTDKrKtQCYfZuq8IArzwBRQ3E1LIlS9Wb7X2G3mKkJ+8jCdb1fFy/76lXpHHWrI9tqt2/IXD20ZFYZ41PTB0tEsgp9VXZP8I5j+363SEnn5erg==',
        startdate: '2025-01-01',
        enddate: '2025-05-31'
      })
    }).then(function (res) {
      return __awaiter(_this, void 0, void 0, function () {
        var _a;

        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              if (!!res.ok) return [3
              /*break*/
              , 2];
              _a = Error.bind;
              return [4
              /*yield*/
              , res.text()];

            case 1:
              throw new (_a.apply(Error, [void 0, _b.sent()]))();

            case 2:
              return [2
              /*return*/
              , res.json()];
          }
        });
      });
    }).then(function (data) {
      setJobs(data);
    })["catch"](function (err) {
      return setError(err.message);
    })["finally"](function () {
      return setLoading(false);
    });
  }, []); // 🔢 สรุปจำนวนงานต่อวัน และแปลงเป็น event

  var events = react_1["default"].useMemo(function () {
    var countByDate = {};
    jobs.forEach(function (job) {
      if (job.PickupDate) {
        countByDate[job.PickupDate] = (countByDate[job.PickupDate] || 0) + 1;
      }
    });
    return Object.entries(countByDate).map(function (_a) {
      var date = _a[0],
          count = _a[1];
      return {
        title: "Jobs: " + count,
        date: date,
        className: count >= 5 ? 'fc-day-busy' : ''
      };
    });
  }, [jobs]); // 🧮 Count total jobs & busy days

  var totalJobs = jobs.length;
  var busyDays = events.filter(function (event) {
    return event.className === 'fc-day-busy';
  }).length; // 📦 สรุปกล่องด้านบน

  var summaryBox = react_1["default"].createElement("div", {
    className: "flex justify-end mb-6 mt-4 px-4"
  }, react_1["default"].createElement("div", {
    className: "flex gap-6 bg-white border border-gray-200 rounded-xl shadow px-8 py-4 max-w-2xl w-full items-center justify-between"
  }, react_1["default"].createElement("div", {
    className: "flex items-center gap-2"
  }, react_1["default"].createElement("span", {
    className: "w-3 h-3 rounded-full bg-[#94a3b8] inline-block"
  }), react_1["default"].createElement("span", {
    className: "text-gray-600"
  }, "All Jobs:"), react_1["default"].createElement("span", {
    className: "font-bold text-[#2D3E92]"
  }, totalJobs)), react_1["default"].createElement("div", {
    className: "flex items-center gap-2"
  }, react_1["default"].createElement("span", {
    className: "w-3 h-3 rounded-full bg-orange-400 inline-block"
  }), react_1["default"].createElement("span", {
    className: "text-gray-600"
  }, "Busy Days (\u22655 jobs):"), react_1["default"].createElement("span", {
    className: "font-bold text-[#2D3E92]"
  }, busyDays)))); // 🕐 Loading

  if (loading) return react_1["default"].createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#555'
    }
  }, react_1["default"].createElement("div", {
    style: {
      display: 'flex',
      gap: '8px',
      marginBottom: '12px'
    }
  }, react_1["default"].createElement("span", {
    style: dotStyle(0)
  }), react_1["default"].createElement("span", {
    style: dotStyle(1)
  }), react_1["default"].createElement("span", {
    style: dotStyle(2)
  })), "Loading jobs...", react_1["default"].createElement("style", null, "\n          @keyframes bounce {\n            0%, 80%, 100% { transform: scale(0); }\n            40% { transform: scale(1); }\n          }\n        ")); // ❌ Error fallback

  if (error) return react_1["default"].createElement("div", {
    className: "max-w-md mx-auto my-5 p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg font-semibold text-center shadow-md"
  }, "Error: ", error); // ✅ Final UI

  return react_1["default"].createElement(cssguide_1["default"], null, summaryBox, react_1["default"].createElement(react_2["default"], {
    plugins: [daygrid_1["default"], timegrid_1["default"], list_1["default"], interaction_1["default"]],
    initialView: "dayGridMonth",
    events: events,
    height: "100%",
    contentHeight: "auto",
    aspectRatio: 1.7,
    headerToolbar: {
      start: 'title',
      center: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
      end: 'today prev,next'
    },
    editable: false,
    selectable: true,
    expandRows: true
  }));

  function dotStyle(index) {
    return {
      width: '12px',
      height: '12px',
      backgroundColor: '#95c941',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'bounce 1.4s infinite ease-in-out both',
      animationDelay: index * 0.2 + "s"
    };
  }
}

exports["default"] = CalendarExcel;
fc - daygrid - event;
{
  color: white;

  font - weight;
  500;
  border - radius;
  0.375;
  rem;

  padding: 0.2;

  rem;
  0.4;
  rem;

  border: 1;

  px;
  solid;
  transparent;
}