// LineChart ini digunakan untuk menangani Line Chart Employee Per Month pada Dashboard Admin
// Jumlah Employee dipisah dengan kategori Employee yang join, Transfer, Resign dan yang onsite
// File Cshtml nya yaitu Dashboard -> Dashboard_Admin

$(document).ready(function () {
    const authToken = sessionStorage.getItem("Token"); // Ganti dengan token akses yang valid

    function getEmployeeData() {
        return $.ajax({
            url: "https://localhost:7177/api/Accounts/FilteredEmp_ExceptSuperAdmin",
            type: "GET",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
            }
        });
    }

    function getHiredStatus() {
        return $.ajax({
            url: "https://localhost:7177/api/TurnOver/GetHiredStatus",
            type: "GET",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
            }
        });
    }

    function getStatusEmp() {
        return $.ajax({
            url: "https://localhost:7177/api/EmployeePlacements/GetStatusEmp",
            type: "GET",
            dataType: "json",
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", `Bearer ${authToken}`);
            }
        });
    }

    function processEmployeeData(employees) {
        const employeeCountByMonth = {};

        employees.forEach(function (employee) {
            if (employee.joinDate) {
                const joinDate = new Date(employee.joinDate);
                const month = joinDate.getFullYear() + '-' + ('0' + (joinDate.getMonth() + 1)).slice(-2);

                if (employeeCountByMonth[month]) {
                    employeeCountByMonth[month]++;
                } else {
                    employeeCountByMonth[month] = 1;
                }
            }
        });

        return employeeCountByMonth;
    }

    
    function countStatus(data, key) {

        const statusCountByMonth = {};

        data.forEach(function (item) {
            if (item.joinDate) {
                const joinDate = new Date(item.joinDate);
                const month = joinDate.getFullYear() + '-' + ('0' + (joinDate.getMonth() + 1)).slice(-2);

                if (!statusCountByMonth[month]) {
                    statusCountByMonth[month] = {};
                }

                const status = item[key] || 'Unknown';
                if (statusCountByMonth[month][status]) {
                    statusCountByMonth[month][status]++;
                } else {
                    statusCountByMonth[month][status] = 1;
                }
            }
        });

        return statusCountByMonth;
    }

    function createLineChart(employeeCountByMonth, hiredStatusCountByMonth, statusEmpCountByMonth) {
        const months = Object.keys(employeeCountByMonth);
        const employeeData = Object.values(employeeCountByMonth);
        const hiredStatusData = months.map(month => hiredStatusCountByMonth[month] ? hiredStatusCountByMonth[month].Transfer || 0 : 0);
        const resignStatusData = months.map(month => hiredStatusCountByMonth[month] ? hiredStatusCountByMonth[month].Resign || 0 : 0);
        const statusEmpData = months.map(month => statusEmpCountByMonth[month] ? statusEmpCountByMonth[month].Onsite || 0 : 0);

        const ctx = document.getElementById('employeeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: months,
                datasets: [
                    {
                        label: 'Employees who joined RAS',
                        data: employeeData,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Transfer to Internal',
                        data: hiredStatusData,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: true,
                    },
                    {
                        label: 'Resign',
                        data: resignStatusData,
                        borderColor: 'rgba(92, 62, 132, 1)',
                        backgroundColor: 'rgba(235, 217, 221, 1)',
                        fill: true,
                    },
                    {
                        label: 'Onsite Customer',
                        data: statusEmpData,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: true,
                    }
                ]
            },
            options: {
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'month'
                        }
                    }
                }
            }
        });
    }

    function populateYearDropdown(employeeData) {
        const years = new Set();

        employeeData.forEach(function (employee) {
            if (employee.joinDate) {
                const joinDate = new Date(employee.joinDate);
                years.add(joinDate.getFullYear());
            }
        });

        const yearFilter = $('#yearFilter');
        yearFilter.empty();
        yearFilter.append(`<option value="all">Every Years</option>`); // Default value

        years.forEach(function (year) {
            yearFilter.append(`<option value="${year}">${year}</option>`);
        });

        // Set default value to "All Years"
        yearFilter.val("all");
    }

    function filterDataByYear(data, year) {
        if (year === "all") {
            return data;
        }
        return data.filter(function (item) {
            return item.joinDate && new Date(item.joinDate).getFullYear() == year;
        });
    }

    // Fetch data, process, and create chart
    $.when(getEmployeeData(), getHiredStatus(), getStatusEmp()).done(function (response1, response2, response3) {

        const employees = response1[0].data.result;
        const hiredStatus = response2[0].data;
        const statusEmp = response3[0].data;

        populateYearDropdown(employees);

        const initialYear = "all";
        const filteredEmployees = filterDataByYear(employees, initialYear);
        const filteredHiredStatus = filterDataByYear(hiredStatus, initialYear);
        const filteredStatusEmp = filterDataByYear(statusEmp, initialYear);

        const employeeCountByMonth = processEmployeeData(filteredEmployees);
        const hiredStatusCountByMonth = countStatus(filteredHiredStatus, 'status');
        const statusEmpCountByMonth = countStatus(filteredStatusEmp, 'placementStatus');

        createLineChart(employeeCountByMonth, hiredStatusCountByMonth, statusEmpCountByMonth);

        $('#yearFilter').change(function () {
            const selectedYear = $(this).val();
            const filteredEmployees = filterDataByYear(employees, selectedYear);
            const filteredHiredStatus = filterDataByYear(hiredStatus, selectedYear);
            const filteredStatusEmp = filterDataByYear(statusEmp, selectedYear);

            const employeeCountByMonth = processEmployeeData(filteredEmployees);
            const hiredStatusCountByMonth = countStatus(filteredHiredStatus, 'status');
            const statusEmpCountByMonth = countStatus(filteredStatusEmp, 'placementStatus');

            createLineChart(employeeCountByMonth, hiredStatusCountByMonth, statusEmpCountByMonth);
        });
    }).fail(function () {
        console.error("Error fetching data");
    });
});

