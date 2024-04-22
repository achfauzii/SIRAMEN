/*$(document).ready(function () {

    fetch('https://localhost:7177/api/EmployeePlacements', {
        method: 'GET', // Metode HTTP seperti GET, POST, PUT, dll.
        headers: {
            'Content-Type': 'application/json', // Tipe konten yang diminta
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Header otorisasi jika diperlukan
            // header lainnya jika diperlukan
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const uniquePlacements = {};
            //Mengunmoulkan placement yang terbaru
            data.data.forEach(item => {
                if (!uniquePlacements[item.accountId] || uniquePlacements[item.accountId].placementStatusId < item.placementStatusId) {
                    uniquePlacements[item.accountId] = {
                        accountId:item.accountId,
                        placementStatusId: item.placementStatusId,
                        startDate: item.startDate,
                        endDate: item.endDate
                    };
                }
            });

            const newData = {};

            for (const accountId in uniquePlacements) {
           
                const placement = uniquePlacements[accountId];
                if (placement.endDate !== null && placement.startDate !== null) {
                    const end = new Date(placement.endDate);
                    const now = new Date();

                    var timeDiff = end.getTime() - now; // Menghitung selisih dalam milidetik
                    var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
                    var monthsRemaining = Math.floor(daysremain / 30); // Menghitung bulan
                    var daysInMonth = daysremain % 30; // Menghitung sisa hari

                    if (monthsRemaining ==1) {
                        console.log(accountId);
                        console.log(daysInMonth);
                        console.log(monthsRemaining);
                    } 
                    
                }

             
            }
            console.log(newData);
               

     *//*       var now = Date.now();
            var end = new Date(item.endDate);
            var timeDiff = end.getTime() - now; // Menghitung selisih dalam milidetik
            var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
            var monthsRemaining = Math.floor(daysremain / 30); // Menghitung bulan
            var daysInMonth = daysremain % 30; // Menghitung sisa hari

            if (monthsRemaining > 1) {

                uniquePlacements[accountId] = {

                    placementStatusId: item.placementStatusId,
                    startDate: item.startDate,
                    endDate: item.endDate
                };
            }*//*
          


        })
        .catch(error => {
            // Tangani error
            console.error('There has been a problem with your fetch operation:', error);
        });

})*/

$(document).ready(function () {
    fetchContractPlacement();
});


function fetchContractPlacement() {
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
            result.data.forEach(function (emp) {
                if (emp.placements.length > 0) {
                    var endContract = new Date(emp.endContract);
                    var endPlacement = new Date(
                        emp.placements[emp.placements.length - 1].endDate
                    );

                    var today = new Date();
                    var timeDiff = today.getTime() - endPlacement; // Menghitung selisih dalam milidetik
                    var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
                    var daysremainPositive = Math.abs(daysremain);
                    if (daysremainPositive <= 30) {
                        endPlacement.setDate(endPlacement.getDate() - 30);
                        notificationDate.push(endPlacement);

                        fetch(
                            "https://localhost:7177/api/ClientName/" +
                            emp.placements[emp.placements.length - 1].clientId,
                            {
                                method: "GET",
                                datatype: "json",
                                dataSrc: "data",
                                headers: {
                                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                                },
                            }
                        )
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

                                notification.innerHTML += `
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
                }
            });
        })
        .then(() => {
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
                // console.log(dataEmployee);
            });

            dataEmployeeCV.forEach(function (notif) {
                notification.innerHTML += `
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
            var notifLength = dataEmployee.length + dataEmployeeCV.length;

            if (notifLength == 0) {
                $("#noNotif").show();
                $("#notifCount").hide();
            }
            // else if (notifLength > 3) {
            //   $("#noNotif").hide();
            //   document.getElementById("notifCount").innerHTML = "3+";
            //   var notifItem = document.getElementsByClassName("notification-item");

            //   notification.innerHTML += `<span
            //     class="dropdown-item text-center small text-dark-500"
            //     id="showAllNotif" onclick="showAllNotification()">
            //     Show All Notifications
            //   </span>`;

            //   notification.innerHTML += `<span
            //     class="dropdown-item text-center small text-dark-500"
            //     id="hideAllNotif" onclick="hideAllNotification()">
            //     Hide Notifications
            //   </span>`;
            //   $("#hideAllNotif").hide();

            //   $("#showAllNotif").css("cursor", "pointer");
            //   $("#hideAllNotif").css("cursor", "pointer");
            //   for (let i = notifLength; i > 3; i--) {
            //     notifItem[i - 1].classList.add("d-none");
            //     notifItem[i - 1].classList.remove("d-flex");
            //   }
            // }
            else {
                $("#noNotif").hide();
                document.getElementById("notifCount").innerHTML = notifLength;
            }
        });
}