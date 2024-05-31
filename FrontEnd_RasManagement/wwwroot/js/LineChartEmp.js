//$(document).ready(function() {
//    function getEmployeeData() {
//        return $.getJSON("https://localhost:7177/api/Accounts/FilteredEmp_ExceptSuperAdmin");
//    }

//    function processEmployeeData(employees) {
//        // Buat objek untuk menyimpan jumlah karyawan per bulan
//        const employeeCountByMonth = {};

//        employees.forEach(function(employee) {
//            if (employee.joinDate) {
//                const joinDate = new Date(employee.joinDate);
//                const month = joinDate.getFullYear() + '-' + ('0' + (joinDate.getMonth() + 1)).slice(-2);

//                if (employeeCountByMonth[month]) {
//                    employeeCountByMonth[month]++;
//                } else {
//                    employeeCountByMonth[month] = 1;
//                }
//            }
//        });

//        return employeeCountByMonth;
//    }

//    function createLineChart(employeeCountByMonth) {
//        // Ubah objek ke dalam bentuk yang dapat digunakan oleh Chart.js
//        const labels = Object.keys(employeeCountByMonth);
//        const data = Object.values(employeeCountByMonth);

//        const ctx = document.getElementById('employeeChart').getContext('2d');
//        new Chart(ctx, {
//            type: 'line',
//            data: {
//                labels: labels,
//                datasets: [{
//                    label: 'Employees who joined RAS',
//                    data: data,
//                    borderColor: 'rgba(75, 192, 192, 1)',
//                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
//                    fill: true,
//                }]
//            },
//            options: {
//                scales: {
//                    x: {
//                        type: 'time',
//                        time: {
//                            unit: 'month'
//                        }
//                    }
//                }
//            }
//        });
//    }

//    // Ambil data, proses, dan buat chart
//    getEmployeeData().done(function(response) {
//        const employees = response.data.result;
//        const employeeCountByMonth = processEmployeeData(employees);
//        createLineChart(employeeCountByMonth);
//    }).fail(function() {
//        console.error("Error fetching data");
//    });
//});

$(document).ready(function () {
    function getEmployeeData() {
        return $.getJSON("https://localhost:7177/api/Accounts/FilteredEmp_ExceptSuperAdmin");
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

    function createLineChart(employeeCountByMonth) {
        const labels = Object.keys(employeeCountByMonth);
        const data = Object.values(employeeCountByMonth);

        const ctx = document.getElementById('employeeChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Employees who joined RAS',
                    data: data,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                }]
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

    function filterEmployeeDataByYear(employeeData, year) {
        if (year === "all") {
            return employeeData;
        }
        return employeeData.filter(function (employee) {
            return employee.joinDate && new Date(employee.joinDate).getFullYear() == year;
        });
    }

    // Ambil data, proses, dan buat chart
    getEmployeeData().done(function (response) {
        const employees = response.data.result;

        populateYearDropdown(employees);

        const initialYear = "all";
        const filteredEmployees = filterEmployeeDataByYear(employees, initialYear);
        const employeeCountByMonth = processEmployeeData(filteredEmployees);
        createLineChart(employeeCountByMonth);

        $('#yearFilter').change(function () {
            const selectedYear = $(this).val();
            const filteredEmployees = filterEmployeeDataByYear(employees, selectedYear);
            const employeeCountByMonth = processEmployeeData(filteredEmployees);
            createLineChart(employeeCountByMonth);
        });
    }).fail(function () {
        console.error("Error fetching data");
    });
});
