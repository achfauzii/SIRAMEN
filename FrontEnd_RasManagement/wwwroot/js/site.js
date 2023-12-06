// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var arrayEmail = [];

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
});

$("#employeeAnnouncement").hide();
$("#adminAnnouncement").hide();

$(document).ready(function () {


    $('[data-toggle="tooltip"]').tooltip();
    //GetBirthday
    $.ajax({
        type: "GET",
        url: "https://localhost:7177/api/Accounts/BirthDay",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            document.getElementById("birthday").innerHTML = "";
            var text = "";
            result.data.name.forEach((item) => {
                text += item + ", ";
            });
            $("#employeeAnnouncement").show();
            $("#adminAnnouncement").show();

            document.getElementById("birthday").innerHTML =
                text.substr(0, text.length - 2) + ".";
        } else if (result.status == 404) {
            document.getElementById("birthday").innerHTML = "";
            $("#employeeAnnouncement").hide();
            $("#adminAnnouncement").hide();
        }
    });

    GetEmployeeList();
    //Get All Employee
    $.ajax({
        type: "GET",
        url: "https://localhost:7177/api/Employees/EmployeeAdmin",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            result.data.forEach((item) => {
                // Array to be inserted
                arrayEmail.push(item.email);
                // emailObj.email.push(item.email)
            });
        }
    });

    $("#birth").hide();
    $("#death").hide();


    //Get All Employee
    $.ajax({
        type: "GET",
        url: "https://localhost:7177/api/Employees/EmployeeAdmin",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result.status == 200) {
            result.data.forEach((item) => {
                // Array to be inserted
                arrayEmail.push(item.email);
                // emailObj.email.push(item.email)
            });
        }
    });

    $("#birth").hide();
    $("#death").hide();

    document
        .getElementById("Announcement")
        .addEventListener("change", function () {
            if (this.value == "death") {
                $("#birth").hide();
                $("#death").show();
            } else if (this.value == "birth") {
                $("#death").hide();
                $("#birth").show();
            }
        });
});

function clearAnnounce() {
    //  document.getElementById("").c();
    $("#Announcement").val("placeholder");

    document.getElementById("AnnounceForm").reset();
    $("#birth").hide();
    $("#death").hide();

    document.getElementById("NameEmployee").selectedIndex = "0";
    document.getElementById("EmployeeName").selectedIndex = "0";
    document.getElementById("Announcement").selectedIndex = "0";
}

function SendAnnouncement() {
    const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
    });

    Swal.fire({
      title: "Are you sure?",
      text: "You will send a news email to all employees.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, send it!",
    }).then((result) => {
      if (result.isConfirmed) {
        $.ajax({
          type: "POST",
          url: "/Announce/SendEmailKelahiran",
          contentType: "application/json",
          dataType: "json",
          data: JSON.stringify(data),

          headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
          },
          success: function (d) {
            Toast.fire({
              icon: "success",
              text: "Sending news email was successfully!",
            });
          },
          failed: function (er) {
            //console.log("Error : " + er.message);
          },
        });

        //Validation on Input Radio
        var radios = document.getElementsByName("Gender");
        var radioValid = false;

        var i = 0;
        while (!radioValid && i < radios.length) {
            if (radios[i].checked) radioValid = true;
            i++;
        }

        //console.log(radios);
        if (!radioValid) {
            $(".form-radio")
                .closest(".form-group")
                .find(".error-message-announce")
                .show();
            isValid = false;
        }

        var selectedNameEmployee = $("#NameEmployee").val();
        var selectedChild = $("#Child").val();
        if (!selectedNameEmployee) {
            $("#NameEmployee")
                .closest(".form-group")
                .find(".error-message-name-employee")
                .show();
            isValid = false;
        } else {
            $("#NameEmployee")
                .closest(".form-group")
                .find(".error-message-name-employee")
                .hide();
        }

        if (!selectedChild) {
            $("#Child").closest(".form-group").find(".error-message-child").show();
            isValid = false;
        } else {
            $("#Child").closest(".form-group").find(".error-message-child").hide();
        }

        if (!isValid) {
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You will send a news email to all employees.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, send it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "/Announce/SendEmailKelahiran",
                    contentType: "application/json",
                    dataType: "json",
                    data: JSON.stringify(data),

                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("Token"),
                    },
                    success: function (d) {
                        const logMessage = `Have sent birth notification email, ${data.employee}'s son`;
                        SaveLogUpdate(logMessage);
                        Toast.fire({
                            icon: "success",
                            text: "Sending news email was successfully!",
                        });
                    },
                    failed: function (er) {
                        console.log("Error : " + er.message);
                    },
                });
            } else {
            }
        });
    } else if ($("#Announcement").val() == "death") {
        var title = "Berita Duka Cita";

        var data = {
            title: title,
            employee: $("#EmployeeName").val(),
            name: $("#Name").val(),
            age: $("#Age").val(),
            relation: $("#Relation").val(),
            deathday: ConvertDate($("#DeathDate").val()),
            deathtime: $("#DeathTime").val(),
            deathplace: $("#DeathPlace").val(),
            email: arrayEmail,
        };

        var isValidForm = true;

        $("input[required-death]").each(function () {
            var input = $(this);
            //console.log("Input " + input);
            if (!input.val()) {
                input
                    .closest(".form-group")
                    .find(".error-message-announce-death")
                    .show();
                isValidForm = false;
            } else {
                input
                    .closest(".form-group")
                    .find(".error-message-announce-death")
                    .hide();
            }
        });

        // Validasi select options
        var selectedEmployeeName = $("#EmployeeName").val();
        var selectedRelation = $("#Relation").val();

        if (!selectedEmployeeName) {
            $("#EmployeeName")
                .closest(".form-group")
                .find(".error-message-employee-name")
                .show();
            isValidForm = false;
        } else {
            $("#EmployeeName")
                .closest(".form-group")
                .find(".error-message-employee-name")
                .hide();
        }

        if (!selectedRelation) {
            $("#Relation")
                .closest(".form-group")
                .find(".error-message-relation-employee")
                .show();
            isValidForm = false;
        } else {
            $("#Relation")
                .closest(".form-group")
                .find(".error-message-relation-employee")
                .hide();
        }

        if (!isValidForm) {
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "You will send a news email to all employees.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, send it!",
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    type: "POST",
                    url: "/Announce/SendEmailDukaCita",
                    contentType: "application/json",
                    dataType: "json",

                    data: JSON.stringify(data),

                    headers: {
                        Authorization: "Bearer " + sessionStorage.getItem("Token"),
                    },
                }).then((result) => {
                    const logMessage = `Have sent an email of condolences`;
                    SaveLogUpdate(logMessage);
                    Toast.fire({
                        icon: "success",
                        text: "Sending news email was successfully!",
                    });
                });
            }
        });
    }

    function ConvertDate(date) {
        var months = [
            "Januari",
            "Februari",
            "Maret",
            "April",
            "Mei",
            "Juni",
            "Juli",
            "Agustus",
            "September",
            "Oktober",
            "November",
            "Desember",
        ];

        var myDays = [
            "Minggu",
            "Senin",
            "Selasa",
            "Rabu",
            "Kamis",
            "Jum&#39;at",
            "Sabtu",
        ];

        var day = date.substr(-2);

        var bulan = date.substring(5, 7);
        var month = bulan.substring(0, 1) != "0" ? bulan : bulan.substring(-1);

        var year = date.substring(0, 4);

        var toDate = new Date(year, month - 1, day);

        var thisDay = myDays[toDate.getDay()];
        var thisMonth = months[month - 1];

        var tanggal = thisDay + ", " + day + " " + thisMonth + " " + year;

        return tanggal;
    }

    document.getElementById("AnnounceForm").reset();
    $("#ModalAnnouncement").modal("hide");

    $("#birth").hide();
    $("#death").hide();

    document.getElementById("NameEmployee").selectedIndex = "0";
    document.getElementById("EmployeeName").selectedIndex = "0";
    document.getElementById("Announcement").selectedIndex = "0";
}
function matchCustom(params, data) {
    // If there are no search terms, return all of the data
    if ($.trim(params.term) === "") {
        return null;
    }
    // Implement your custom matching logic here
    // For example, you can use data.text.includes(params.term)
    return null;
}
$(document).ajaxComplete(function () {
    $('[data-tooltip="tooltip"]').tooltip({
        trigger: "hover",
    });
});

function GetEmployeeList() {
    //Get Employee
    var selectEmployee = document.getElementById("NameEmployee");
    var select = document.getElementById("EmployeeName");

    $.ajax({
        type: "GET",
        url: "https://localhost:7177/api/Accounts",
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        if (result != null) {
            result.forEach((item) => {
                var option = new Option(item.fullname, item.fullname, true, false);
                selectEmployee.add(option);

                var opt = new Option(item.fullname, item.fullname, true, false);
                select.add(opt);
            });
        }
    });
    $("#NameEmployee").select2({
        placeholder: "Select Employee",
        width: "100%",
        height: "100%",
        allowClear: true,
        tags: true,
    });

    $("#EmployeeName").select2({
        placeholder: "Select Employee",
        width: "100%",
        height: "100%",
        allowClear: true,
        tags: true,
    });
}
