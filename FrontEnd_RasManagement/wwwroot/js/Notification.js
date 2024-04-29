var notifLength = 0;
$(document).ready(function () {
    fetchContractPlacement();
});
$(document).on('click', '.btnBell .dropdown-menu', function (e) {
    e.stopPropagation();
});
function fetchContractPlacement() {
    notification.innerHTML = '';

    fetch("https://localhost:7177/api/Employees", {
        method: "GET",
        datatype: "json",
        dataSrc: "data",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    })
        .then((response) => response.json())
        .then((result) => {
            var notificationDate = [];
            let countNull = 0;
            let accordionHtml = `
            <div class="accordion" id="accordionExample">
                    <div class="medium text-gray-700 triggerAllert mx-3 " data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">Contract Placement</div>
                    <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
                        <div class="accordion-body">`;

            result.data.forEach(function (emp) {
                if (emp.placements.length > 0) {
                    var endContract = new Date(emp.endContract);
                    var endPlacement = new Date(emp.placements[emp.placements.length - 1].endDate);

                    var today = new Date();
                    var timeDiff = today.getTime() - endPlacement; // Menghitung selisih dalam milidetik
                    var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
                    var daysremainPositive = Math.abs(daysremain);
                    if (daysremainPositive <= 30) {
                        endPlacement.setDate(endPlacement.getDate() - 30);
                        notificationDate.push(endPlacement);

                        fetch("https://localhost:7177/api/ClientName/" + emp.placements[emp.placements.length - 1].clientId, {
                            method: "GET",
                            datatype: "json",
                            dataSrc: "data",
                            headers: {
                                Authorization: "Bearer " + sessionStorage.getItem("Token"),
                            },
                        })
                            .then((response) => response.json())
                            .then((result) => {
                                var data = {
                                    accountId: emp.accountId,
                                    fullname: emp.fullname,
                                    placement: result.data.nameOfClient,
                                    days: daysremain,
                                    date: endPlacement.toLocaleDateString(),
                                };
                                dataEmployee.push(data);

                                accordionHtml += `
                                    <a class="dropdown-item d-flex align-items-center notification-item" href="/ManageEmployee/DetailEmployee?accountId=${data.accountId}">
                                        <div class="mr-3">
                                            <div class="icon-circle bg-primary">
                                                <i class="fas fa-file-alt text-white"></i>
                                            </div>
                                        </div>
                                        <div>
                                            <div class="small text-gray-500">Reminder &nbsp;<span class="badge-lg badge-pill badge-success">${data.date}</span></div>
                                            <b>${data.fullname}</b> contract at <b>${data.placement}</b> is less than a month.
                                        </div>
                                    </a>`;
                            });
                    }
                } else {
                    countNull += 1;
                }
            });

            if (countNull !== 0) {
                accordionHtml += `<div class="small text-center text-gray-500">No New Notification</div>`;
            }

            accordionHtml += `</div></div><hr class="mt-0 mb-0">`; // Close the accordion-body and accordion elements
            notification.innerHTML = accordionHtml;

            checkOverviewEmployee();
        });
}
function checkOverviewEmployee() {
    fetch("https://localhost:7177/api/Employees/CheckOverviewEmployee", {
        method: "GET",
        datatype: "json",
        dataSrc: "data",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    })
        .then((response) => response.json())
        .then((result) => {
            let accordionHtml = `
            <div class="accordion" id="accordionExample2">
                    <div class="medium text-gray-700 triggerAllert mx-3" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">Employee Overview</div>
                    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample2">
                        <div class="accordion-body">`;

            if (result.data.length > 0) {
                result.data.forEach(function (emp) {
                    if (
                        //Check Personal Detail
                        emp.fullname == null ||
                        emp.nickname == null ||
                        emp.birthplace == null ||
                        emp.birthdate == null ||
                        emp.religion == null ||
                        emp.gender == null ||
                        emp.maritalstatus == null ||
                        emp.nationality == null ||
                        emp.address == null ||
                        //Check Education
                        emp.formalEdus.length == 0 ||
                        emp.nonFormalEdus.length == 0 ||
                        //Check Qualifications
                        // emp.qualifications.length == 0 ||
                        // emp.qualifications.framework == "" ||
                        // emp.qualifications.programmingLanguage == "" ||
                        // emp.qualifications.database == "" ||
                        //Check Certificate
                        emp.certificates.length == 0 ||
                        //Check Employeement History
                        emp.employmentHistories.length == 0 ||
                        //Check Project History
                        emp.projectHistories.length == 0
                    ) {
                        dataEmployeeCV.push(`${emp.fullname} data is still incomplete.`);
                    }
                });

                dataEmployeeCV.forEach(function (notif) {
                    accordionHtml += `
                        <div class="dropdown-item d-flex align-items-center notification-item">
                            <div class="mr-3">
                                <div class="icon-circle bg-warning">
                                    <i class="fas fa-user text-white"></i>
                                </div>
                            </div>
                            <div>
                                <div class="small text-gray-500">CV Employee</div>
                                ${notif}
                            </div>
                        </div>`;
                });
            } else {
                accordionHtml += `<div class="small text-center text-gray-500">No New Notification</div>`;
            }

            accordionHtml += `</div></div><hr class="mt-0 mb-0">`; // Close the accordion-body and accordion elements
            notification.innerHTML += accordionHtml;

            overtimeNotification();
        });
}

function overtimeNotification() {
    fetch("https://localhost:7177/api/Approval", {
        method: 'get',
        datatype: 'json',
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            var dataApproval = result.data;

            var totalAppvropal = 0;
            let isExist = false;

            let accordionHtml = `
            <div class="accordion" id="accordionExample3">
                    <div class="medium text-gray-700 triggerAllert mx-3" data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">Employee Overtime</div>
                    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample3">
                        <div class="accordion-body">`;

            const fetchPromises = dataApproval.map(data => {
                if (data.statusApproval == "On Progress") {
                    totalAppvropal++;
                    return fetch("https://localhost:7177/api/Employees/accountId?accountId=" + data.accountId, {
                        method: 'GET',
                        datatype: 'json',
                        headers: {
                            Authorization: "Bearer " + sessionStorage.getItem("Token"),
                        },
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            const emp = data.data.result;
                            var notif = "Overtime Approval " + emp.fullname;
                            accordionHtml += `
                                <div class="dropdown-item d-flex align-items-center notification-item" onclick="openOvertimeApproval()">
                                    <div class="mr-3">
                                        <div class="icon-circle bg-primary">
                                            <i class="fa-solid fa-business-time text-white"></i>
                                        </div>
                                    </div>
                                    <div>
                                        <div class="small text-gray-500">Overtime Approval</div>
                                        ${notif}
                                    </div>
                                </div>`;
                        });
                }
            });

            Promise.all(fetchPromises)
                .then(() => {
                    if (totalAppvropal == 0) {
                        accordionHtml += `<div class="small text-center text-gray-500">No New Notification</div>`;
                    }

                    accordionHtml += `</div></div><hr class="mt-0 mb-0">`; // Close the accordion-body and accordion elements
                    notification.innerHTML += accordionHtml;

                    var notifLength = dataEmployee.length + dataEmployeeCV.length + totalAppvropal;

                    if (notifLength == 0) {
                        $("#noNotif").show();
                        $("#notifCount").hide();
                    } else {
                        $("#noNotif").hide();
                        document.getElementById("notifCount").innerHTML = notifLength;
                    }
                });
        });
}

function openOvertimeApproval() {
    window.location.href = "https://localhost:7109/Approval/Overtime";
}