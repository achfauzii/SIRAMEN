var table = null;
$(document).ready(function () {
    $(
        "input[required], select[required]"
    ).each(function () {
        $(this).prev("label").append('<span style="color: red;">*</span>');
    });
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $("#TB_Assets").DataTable({
        ajax: {
            url: "https://localhost:7177/api/Assets/accountId?accountId=" + accid,
            type: "GET",
            datatype: "json",
            dataSrc: "data",

            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
        },
        searching: false,
        paging: false,
        info: false,
        columns: [
            {
                data: "nama",
                render: function (data, type, row) {
                    // Menambahkan margin otomatis ke elemen dengan properti data bernilai "nama"
                    return "<div >" + data + "</div>";
                },
            },
            {
                data: null,
                render: function (data, type, row) {
                    var leftColumn =
                        "Processor: " +
                        row.processor +
                        "<br>Display: " +
                        row.display +
                        "<br>Operating System: " +
                        row.operatingSystem +
                        "<br>RAM: " +
                        row.ram;

                    var rightColumn =
                        "SSD: " +
                        row.ssd +
                        "<br>HDD: " +
                        row.hdd +
                        "<br>Graphic Card: " +
                        row.graphicCard +
                        "<br>Charger: " +
                        (row.charger ? "Yes" : "No");

                    return (
                        '<div class="row">' +
                        '<div class="col-5">' +
                        leftColumn +
                        "</div>" +
                        '<div class="col-5">' +
                        rightColumn +
                        "</div>" +
                        "</div>"
                    );
                },
            },

            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var editButton =
                        '<button class="btn btn-warning" data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.assetsManagementId +
                        ')"><i class="fa fa-edit"></i></button>';

                    var deleteButton =
                        '<button class="btn btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return Delete(' +
                        row.assetsManagementId +
                        ')"><i class="fa fa-trash"></i></button>';

                    return (
                        '<div class="d-flex">' +
                        editButton +
                        "&nbsp;" +
                        deleteButton +
                        "</div>"
                    );
                },
            },
        ],

        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        columnDefs: [
            {
                targets: [0, 1, 2],
                orderable: false,
            },
        ],
        order: [0],

        //Agar nomor tidak berubah
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();

            if (rows.length > 0) {
                $("#rfid_h6").text("RFID : " + settings.json.data[0].rfid);
                $("#rfid_h6").show();
                $("#date_h6").text("Date Obtained : " + moment(settings.json.data[0].dateObtained).format("DD MMMM YYYY"));
                $("#date_h6").show();

                $("#add-asset").hide(); // Jika ada data, sembunyikan tombol
            } else {
                $("#rfid_h6").hide();
                $("#date_h6").hide();
                $("#add-asset").show(); // Jika tidak ada data, tampilkan tombol
            }
        },
    });
});

function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );

    return JSON.parse(jsonPayload);
}
function ClearScreenAsset() {
    $("#brand").val("");
    $("#RFID").val("");
    $("#Processor").val("");
    $("#Display").val("");
    $("#os").val("Windows");
    $("#ram").val("");
    $("#ssd").val("");
    $("#ssd-error").hide("");
    $("#hdd").val("");
    $("#GraphicCard").val("");
    $("#charger").val("Yes");
    $("#dateObtained").val("");
    $("#Update").hide();
    $("#Save").show();
    $("input[required]").each(function () {
        var input = $(this);

        input.next(".error-message").hide();
    });
}
function SaveAsset() {
    // debugger;
    var isValid = true;

    $("input[required]").each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message").show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
        }
    });

    var ramValue = $("#ram").val().replace(/^0+/, ""); // Menghapus 0 di awal
    var ssdValue = $("#ssd").val().replace(/^0+/, ""); //hapus 0 di awal
    var hddValue = $("#hdd").val().replace(/^0+/, "");
    var displayValue = $("#Display").val().replace(/^0+/, "");

    if (ramValue === "") {
        if (ssdValue === "" && hddValue === "") {
            $("#ssd-error").show();
            $("#hdd-error").show();
            $("#ram").next().show();

            return;
        } else {
            $("#ram").next().show();
            $("#ssd-error").hide();
            return;
        }
    } else {
        $("#ram").next().hide();
        if (ssdValue === "" && hddValue === "") {
            $("#ssd-error").show();
            $("#hdd-error").show();
            return;
        } else {
            $("#ssd-error").hide();
            $("#hdd-error").hide();
        }
    }

    if (!isValid) {
        return;
    }

    var Assets = new Object(); //bikin objek baru
    Assets.rfid = $("#RFID").val();
    Assets.nama = $("#brand").val();
    Assets.processor = $("#Processor").val();
    Assets.dateObtained = $("#dateObtained").val();
    Assets.operatingSystem = $("#os").val();
    Assets.ram = ramValue !== "" ? ramValue + " GB" : "-";
    Assets.ssd = ssdValue !== "" ? ssdValue + " GB" : "-";
    Assets.hdd = hddValue !== "" ? hddValue + " GB" : "-";
    Assets.display = displayValue !== "" ? displayValue + "''" : "-";
    Assets.graphicCard = $("#GraphicCard").val();
    Assets.charger = $("#charger").val() === "Yes" ? true : false;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Assets.accountId = accid;
    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/Assets",
        data: JSON.stringify(Assets), //ngirim data ke api
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        // debugger;
        if (
            (result.status == result.status) == 201 ||
            result.status == 204 ||
            result.status == 200
        ) {
            //alert("Data Berhasil Dimasukkan");
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been added!",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#ModalAssets").modal("hide");
            table.ajax.reload();
        } else {
            Swal.fire({
                icon: "warning",
                title: "Data failed to added!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#ModalAssets").modal("hide");
            table.ajax.reload();
        }
    });
}

function formatDate(date) {
    var d = new Date(date),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
}

function GetById(assetsManagementId) {
    $.ajax({
        url: "https://localhost:7177/api/Assets/" + assetsManagementId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {

            // debugger;
            var obj = result.data; //data yg dapet dr id
            $("#assetsManagementId").val(obj.assetsManagementId); //ngambil data dr api
            $("#brand").val(obj.nama).attr("data-initial", obj.nama);
            $("#RFID").val(obj.rfid).attr("data-initial", obj.rfid);
            $("#Processor").val(obj.processor).attr("data-initial", obj.processor);
            $("#Display").val(obj.display ? obj.display.replace(/\D/g, "") : "-").attr("data-initial", obj.display);
            const date = formatDate(obj.dateObtained);
            $("#dateObtained").val(date);
            $("#os").val(obj.operatingSystem).attr("data-initial", obj.operatingSystem);
            $("#ram").val(obj.ram ? obj.ram.replace(/\D/g, "") : "-").attr("data-initial", obj.ram);
            $("#ssd").val(obj.ssd ? obj.ssd.replace(/\D/g, "") : "-").attr("data-initial", obj.ssd);
            $("#hdd").val(obj.hdd ? obj.hdd.replace(/\D/g, "") : "-").attr("data-initial", obj.hdd);
            $("#GraphicCard").val(obj.graphicCard).attr("data-initial", obj.graphicCard);

            var chargerElement = $("#charger");
            chargerElement.val(obj.charger ? "Yes" : "No").attr("data-initial", obj.charger); // Set data-initial attribute
            $("#ModalAssets").modal("show");
            $("#Save").hide();
            $("#Update").show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function Delete(assetsManagementId) {
    // debugger;
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No",
    }).then((result) => {
        if (result.value) {
            $.ajax({
                url: "https://localhost:7177/api/Assets/" + assetsManagementId,
                type: "DELETE",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }).then((result) => {
                // debugger;
                if (result.status == 200) {
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    table.ajax.reload();
                } else {
                    Swal.fire("Error!", "Your failed to delete.", "error");
                }
            });
        }
    });
}

function UpdateAsset() {
    debugger;
    var isValid = true;

    // Memeriksa apakah ada perubahan data
    var existingData = {
        Brand: $("#brand").val(),
        RFID: $("#RFID").val(),
        Processor: $("#Processor").val(),
        Display: $("#Display").val(),
        OS: $("#os").val(),
        RAM: $("#ram").val(),
        SSD: $("#ssd").val(),
        HDD: $("#hdd").val(),
        GraphicCard: $("#GraphicCard").val(),
        Charger: $("#charger").val(),
    };

    var initialData = {
        Brand: $("#brand").attr("data-initial"),
        RFID: $("#RFID").attr("data-initial"),
        Processor: $("#Processor").attr("data-initial"),
        Display: $("#Display").attr("data-initial"),
        OS: $("#os").attr("data-initial"),
        RAM: $("#ram").attr("data-initial"),
        SSD: $("#ssd").attr("data-initial"),
        HDD: $("#hdd").attr("data-initial"),
        GraphicCard: $("#GraphicCard").attr("data-initial"),
        Charger: $("#charger").attr("data-initial"),
    };

    initialData.HDD = initialData.HDD.replace(/-/g, '');
    initialData.Display = initialData.Display.replace(/'/g, '');
    initialData.RAM = initialData.RAM.replace(/\s+/g, '').replace('GB', '');
    initialData.SSD = initialData.SSD.replace(/\s+/g, '').replace('GB', '');
    initialData.Charger = initialData.Charger ? "Yes" : "No";

    var hasChanged = JSON.stringify(existingData) !== JSON.stringify(initialData);

    console.log("Has data changed:", hasChanged);
    console.log("existingData:", existingData);
    console.log("initialData:", initialData);

    if (!hasChanged) {
        Swal.fire({
            icon: "info",
            title: "No Data Has Been Changed",
            showConfirmButton: false,
            timer: 2000,
        }).then(() => {
            $("#ModalAssets").modal("hide");
        });
        return;
    }

    $("input[required]").each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message").show();
            isValid = false;
        } else {
            input.next(".error-message").hide();
        }
    });

    var ramValue = $("#ram").val().replace(/^0+/, ""); // Menghapus 0 di awal
    var ssdValue = $("#ssd").val().replace(/^0+/, ""); //hapus 0 di awal
    var hddValue = $("#hdd").val().replace(/^0+/, "");
    var displayValue = $("#Display").val().replace(/^0+/, "");

    if (ramValue === "") {
        if (ssdValue === "" && hddValue === "") {
            $("#ssd-error").show();
            $("#hdd-error").show();
            $("#ram").next().show();

            return;
        } else {
            $("#ram").next().show();
            $("#ssd-error").hide();
            return;
        }
    } else {
        $("#ram").next().hide();
        if (ssdValue === "" && hddValue === "") {
            $("#ssd-error").show();
            $("#hdd-error").show();
            return;
        } else {
            $("#ssd-error").hide();
            $("#hdd-error").hide();
        }
    }
    if (!isValid) {
        return;
    }
    debugger;
    var Assets = new Object();
    Assets.assetsManagementId = $("#assetsManagementId").val();
    Assets.rfid = $("#RFID").val();
    Assets.nama = $("#brand").val();
    Assets.dateObtained = $("#dateObtained").val();
    Assets.processor = $("#Processor").val();
    Assets.operatingSystem = $("#os").val();
    Assets.ram = ramValue !== "" ? ramValue + " GB" : "-";
    Assets.ssd = ssdValue !== "" ? ssdValue + " GB" : "-";
    Assets.hdd = hddValue !== "" ? hddValue + " GB" : "-";
    Assets.display = displayValue !== "" ? displayValue + "''" : "-";
    Assets.graphicCard = $("#GraphicCard").val();
    Assets.charger = $("#charger").val() === "Yes" ? true : false;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    Assets.accountId = accid;
    console.log(Assets);
    $.ajax({
        url: "https://localhost:7177/api/Assets",
        type: "PUT",
        data: JSON.stringify(Assets),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        // debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been update!",
                showConfirmButton: false,
                timer: 1500,
            });
            $("#ModalAssets").modal("hide");
            table.ajax.reload();
        } else {
            Swal.fire("Error!", "Data failed to update!", "error");
            table.ajax.reload();
        }
    });
}