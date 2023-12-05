var table = null;
$(document).ready(function () {
    Educations();
    formInputLocation();

    getUniversitasList();

    const selectMajor = $("#Major");
    //Ini untuk tanpa display none jadi langsung di tampilkan ()
    $(selectMajor).select2({
        placeholder: "Select your major",
        width: "100%",
        allowClear: true,
        tags: true,
    });

    const selectDegree = $("#Degree");
    $(selectDegree).select2({
        placeholder: "Select your degree",
        width: "100%",
        allowClear: true,
        tags: true,
    });
});

function Educations() {
    //debugger;
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    table = $("#TB_FormalEdu").DataTable({
        ajax: {
            url: "https://localhost:7177/api/Educations/accountId?accountId=" + accid,
            type: "GET",
            datatype: "json",
            dataSrc: "data",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            /*success: function (result) {
                      console.log(result)
                  }*/
        },

        columns: [
            {
                render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1 + ".";
                },
            },
            { data: "universityName" },
            {
                data: null,
                render: function (data, type, row) {
                    var cityOrRegency = data.location;
                    const cityRemove = cityOrRegency
                        .replace("KOTA", "")
                        .replace("KABUPATEN", "")
                        .trim();
                    const words = cityRemove.split(" ");
                    const formattedCity = words
                        .map(
                            (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                        )
                        .join(" ");
                    return formattedCity;
                },
            },
            { data: "major" },
            { data: "degree" },
            { data: "years" },
            {
                // Menambahkan kolom "Action" berisi tombol "Edit" dan "Delete" dengan Bootstrap
                data: null,
                render: function (data, type, row) {
                    var modalId = "modal-edit-" + data.formalEduId;
                    var deleteId = "modal-delete-" + data.formalEduId;
                    return (
                        '<button class="btn btn-sm btn-warning " data-placement="left" data-toggle="modal" data-animation="false" title="Edit" onclick="return GetById(' +
                        row.formalEduId +
                        ')"><i class="fa fa-edit"></i></button >' +
                        "&nbsp;" +
                        '<button class="btn btn-sm btn-danger" data-placement="right" data-toggle="modal" data-animation="false" title="Delete" onclick="return DeleteFormal(' +
                        row.formalEduId +
                        ')"><i class="fa fa-trash"></i></button >'
                    );
                },
            },
        ],

        order: [[5, "desc"]],
        //"responsive": true,
        //Buat ngilangin order kolom No dan Action
        columnDefs: [
            {
                targets: [0, 2, 3, 4, 5, 6],
                orderable: false,
            },
        ],
        //Agar nomor tidak berubah
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: "current" }).nodes();
            api
                .column(1, { page: "current" })
                .data()
                .each(function (group, i) {
                    $(rows)
                        .eq(i)
                        .find("td:first")
                        .html(i + 1);
                });
        },
    });
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
function getUniversitasList() {
    const selectUniversity = $("#UniversityName");

    $(selectUniversity).select2({
        placeholder: "Select your University",
        width: "100%",
        allowClear: true,
        tags: true,
        minimumInputLength: 3,
    });
    $.ajax({
        url: "../assets/file_json/loadpt.json",
        type: "GET",
        datatype: "json",

        success: function (result) {
            var universities = result;

            universities.forEach(function (university) {
                const option = new Option(
                    university.nama_pt,
                    university.nama_pt,
                    true,
                    true
                );
                selectUniversity.append(option);
            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function formInputLocation() {
    const selectProvinces = document.getElementById("selectProvinces");
    const selectRegencies = document.getElementById("selectRegencies");

    $(selectRegencies).select2({
        placeholder: "Select City or County",
        width: "100%",
    });

    fetch("../assets/file_json/provinces.json") //path ke file provinces.json
        .then((response) => response.json())
        .then((provinces) => {
            provinces.forEach((province) => {
                const option = document.createElement("option");
                option.value = province.id;
                option.textContent = province.name;
                selectProvinces.appendChild(option);
            });

            // Select2 untuk select provinsi
            $(selectProvinces).select2({
                placeholder: "Select Province",
                width: "100%",
            });

            // Event listener ketika provinsi dipilih
            $(selectProvinces).on("change", function () {
                const selectedProvinceId = $(this).val();

                // Hapus pilihan sebelumnya di select regencies
                $(selectRegencies).empty();

                if (selectedProvinceId) {
                    fetch("../assets/file_json/regencies.json") // path ke file regencies.json
                        .then((response) => response.json())
                        .then((regencies) => {
                            const filteredRegencies = regencies.filter(
                                (regency) => regency.province_id === selectedProvinceId
                            );

                            filteredRegencies.forEach((regency) => {
                                const option = document.createElement("option");
                                option.value = regency.name;
                                option.textContent = regency.name;
                                selectRegencies.appendChild(option);
                            });

                            // Inisialisasi Select2 untuk select regencies
                            $(selectRegencies).select2({
                                placeholder: "Select Regencies",
                                width: "100%",
                            });
                        })
                        .catch((error) => {
                            console.error("Error fetching regencies data:", error);
                        });
                }
            });
        })
        .catch((error) => {
            console.error("Error fetching provinces data:", error);
        });
}

/*function formInputLocation() {

    const selectProvinces = document.getElementById('selectProvinces');
    const selectRegencies = document.getElementById('selectRegencies');
    //Ini untuk tanpa display none jadi langsung di tampilkan ()
    $(selectRegencies).select2({
        placeholder: 'Select City or County',
        width: '100%'
    });

    fetch('https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json')
        .then(response => response.json())
        .then(provinces => {
            provinces.forEach(province => {
                const option = document.createElement('option');
                option.value = province.id;
                option.textContent = province.name;
                selectProvinces.appendChild(option);
            });

            // Inisialisasi Select2 untuk select provinsi
            $(selectProvinces).select2({
                placeholder: 'Select Province',
                width: '100%'
            });
            //selectRegencies.style.display = 'none';

            // Event listener ketika provinsi dipilih
            $(selectProvinces).on('change', function () {
                const selectedProvinceId = $(this).val();

                // Hapus pilihan sebelumnya di select regencies
                $(selectRegencies).empty();

                if (selectedProvinceId) {
                    fetch(https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json)
                        .then(response => response.json())
                        .then(regencies => {
                            regencies.forEach(regency => {
                                const option = document.createElement('option');
                                option.value = regency.name;
                                option.textContent = regency.name;
                                selectRegencies.appendChild(option);
                            });

                            // Inisialisasi Select2 untuk select regencies
                            $(selectRegencies).select2({
                                placeholder: 'Select City or County',
                                width: '100%'
                            });
                            //  selectRegencies.style.display = 'block';
                        })
                        .catch(error => {
                            console.error('Error fetching regencies data:', error);
                        });
                }
            });
        })
        .catch(error => {
            console.error('Error fetching provinces data:', error);
        });

}*/

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

function SaveFormal() {
    var isValid = true;

    $("input[required],select[required]").each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message-formal").show();
            isValid = false;
        } else {
            input.next(".error-message-formal").hide();
        }
    });

    // Validasi select options
    var selectedRegencies = $("#selectRegencies").val();
    var selectedMajor = $("#Major").val();
    var selectedUniversity = $("#UniversityName").val();

    if (!selectedRegencies) {
        $(".selectRegencies").closest(".form-group").find(".error-message").show();
        isValid = false;
    } else {
        $(".selectRegencies").closest(".form-group").find(".error-message").hide();
    }

    if (!selectedMajor) {
        $(".selectMajor")
            .closest(".form-group")
            .find(".error-message-major")
            .show();
        isValid = false;
    } else {
        $(".selectMajor")
            .closest(".form-group")
            .find(".error-message-major")
            .hide();
    }

    if (!selectedUniversity) {
        $(".selectUniversity")
            .closest(".form-group")
            .find(".error-message-university")
            .show();
        isValid = false;
    } else {
        $(".selectUniversity")
            .closest(".form-group")
            .find(".error-message-university")
            .hide();
    }

    if (!isValid) {
        return;
    }

    var FormalEdu = new Object(); //object baru
    FormalEdu.universityName = $("#UniversityName").val(); //value insert dari id pada input
    FormalEdu.location = $("#selectRegencies").val();
    FormalEdu.major = $("#Major").val();
    FormalEdu.degree = $("#Degree").val();
    FormalEdu.years = $("#GraduationYears").val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    FormalEdu.AccountId = accid;
    $.ajax({
        type: "POST",
        url: "https://localhost:7177/api/Educations",
        data: JSON.stringify(FormalEdu),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been added!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#ModalFormal").modal("hide");
            table.ajax.reload();
        } else {
            Swal.fire({
                icon: "warning",
                title: "Data Gagal dimasukkan!",
                showConfirmButtom: false,
                timer: 1500,
            });
            $("#ModalFormal").modal("hide");
            table.ajax.reload();
        }
    });
}

function ClearScreenFormal() {
    $("#selectProvinces").val(null).trigger("change"); // Kosongkan pilihan select
    $("#FormalEduId").val("");
    $("#UniversityName").val("").trigger("change");
    //$('#Location').val('');
    $("#Major").val("").trigger("change");
    $("#Degree").val("");
    $("#GraduationYears").val("");
    $("#Update").hide();
    $("#Save").show();
    $("input[required]").each(function () {
        var input = $(this);

        input.next(".error-message-formal").hide();
    });
    $(".selectRegencies").closest(".form-group").find(".error-message").hide();
    $(".selectUniversity")
        .closest(".form-group")
        .find(".error-message-university")
        .hide();
    $(".selectRegencies").closest(".form-group").find(".error-message").hide();
    $(".selectMajor").closest(".form-group").find(".error-message-major").hide();
    $(".selectDegree")
        .closest(".form-group")
        .find(".error-message-formal")
        .hide();
}

function GetById(formalEduId) {
    //debugger;
    //GET SEMUA Kota atau kabupaten untuk di tampilkan berdasarkan Get By Id

    ClearScreenFormal();
    const selectUniversity = document.getElementById("UniversityName");
    $.ajax({
        url: "https://localhost:7177/api/Educations/" + formalEduId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        success: function (result) {
            debugger;
            var obj = result.data; //data yg kita dapat dr API
            const option = document.createElement("option");
            option.value = obj.location;
            option.textContent = obj.location;
            selectRegencies.appendChild(option);

            const optionUniv = document.createElement("option");
            optionUniv.value = obj.universityName;
            optionUniv.textContent = obj.universityName;
            selectUniversity.appendChild(optionUniv);

            const selectUniversities = $("#UniversityName");
            selectUniversities.val(obj.universityName).trigger("change");
            selectUniversities.select2({
                width: "100%",

                tags: true,

                createTag: function (params) {
                    return {
                        id: params.term,
                        text: params.term,
                        newTag: true,
                    };
                },
            });
            // Kosongkan pilihan sebelumnya
            //selectUniversity.append('<option selected value="' + obj.universityName + '">' + obj.universityName + '</option>');*/

            /*   universities.forEach(function (university) {
                         selectUniversity.append('<option value="' + university.namaUniversitas + '">' + university.namaUniversitas + '</option>');
                     });*/

            $("#FormalEduId").val(obj.formalEduId);
            $("#UniversityName").val(obj.universityName);
            $("#selectRegencies").val(obj.location);
            $("#Major").val(obj.major);
            $("#Major").trigger("change");
            $("#Degree").val(obj.degree);
            $("#GraduationYears").val(obj.years);
            $("#AccountId").accid;
            $("#ModalFormal").modal("show");
            $("#Update").show();
            $("#Save").hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        },
    });
}

function UpdateFormal() {
    var isValid = true;

    $("input[required],select[required]").each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next(".error-message-formal").show();
            isValid = false;
        } else {
            input.next(".error-message-formal").hide();
        }
    });

    if (!isValid) {
        // Jika validasi tidak berhasil, jangan tutup modal
        return;
    }

    var FormalEdu = new Object(); //object baru
    FormalEdu.FormalEduId = $("#FormalEduId").val();
    FormalEdu.UniversityName = $("#UniversityName").val(); //value insert dari id pada input
    FormalEdu.Location = $("#selectRegencies").val();
    FormalEdu.Major = $("#Major").val();
    FormalEdu.Degree = $("#Degree").val();
    FormalEdu.Years = $("#GraduationYears").val();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    FormalEdu.AccountId = accid;

    $.ajax({
        type: "PUT",
        url: "https://localhost:7177/api/Educations",
        data: JSON.stringify(FormalEdu),
        contentType: "application/json; charset=utf-8",
        headers: {
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    }).then((result) => {
        debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: "success",
                title: "Success...",
                text: "Data has been update!",
                showConfirmButtom: false,
                timer: 2000,
            });
            $("#ModalFormal").modal("hide");
            table.ajax.reload();
        } else {
            alert("Data gagal Diperbaharui");
        }
    });
}

function DeleteFormal(formalEduId) {
    debugger;
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
                url: "https://localhost:7177/api/Educations/" + formalEduId,
                type: "DELETE",
                dataType: "json",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("Token"),
                },
            }).then((result) => {
                debugger;
                if (result.status == 200) {
                    Swal.fire("Deleted!", "Your data has been deleted.", "success");
                    $("#TB_FormalEdu").DataTable().ajax.reload();
                } else {
                    Swal.fire("Error!", result.message, "error");
                }
            });
        }
    });
}

const closeButton = document.querySelector(
    '.btn.btn-danger[data-dismiss="modal"]'
);
closeButton.addEventListener("click", function () {
    // kode untuk menutup modal
});
