"use strict";
exports.__esModule = true;
var react_1 = require("react");
function useFetchJobs(_a) {
    var startDate = _a.startDate, endDate = _a.endDate;
    var _b = react_1.useState([]), jobs = _b[0], setJobs = _b[1];
    var _c = react_1.useState(false), loading = _c[0], setLoading = _c[1];
    var _d = react_1.useState(null), error = _d[0], setError = _d[1];
    react_1.useEffect(function () {
        if (!startDate || !endDate)
            return; // ถ้าไม่มีช่วงวันที่ ไม่เรียก API
        var token = localStorage.getItem('token') || '';
        setLoading(true);
        fetch('https://operation.dth.travel:7082/api/guide/job', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                token: token,
                startdate: startDate,
                enddate: endDate
            })
        })
            .then(function (res) {
            if (!res.ok)
                throw new Error('Failed to fetch jobs');
            return res.json();
        })
            .then(function (data) {
            setJobs(data);
            setLoading(false);
        })["catch"](function (err) {
            setError(err.message);
            setLoading(false);
        });
    }, [startDate, endDate]);
    return { jobs: jobs, loading: loading, error: error, setJobs: setJobs };
}
exports["default"] = useFetchJobs;
