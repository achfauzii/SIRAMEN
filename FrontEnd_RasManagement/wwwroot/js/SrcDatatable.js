var table = null;
$(document).ready(function () {
    Src();

    getUniversitasList();

    getUniversitasListt();

});

function htmlspecialchars(str) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    var outp = str.replace(/[&<>"']/g, function (m) { return map[m]; });
    return outp;
}

function noHTML(input) {
    var value = input.value.replace(/<[^>]*>/g, '');
    //var nohtml = value.replace(/[<>?/]/g, '');
    input.value = value;
}

function handleInput(event, input) {
    // Menangani peristiwa oninput dan onpaste
    noHTML(input);
}

function Src() {
    $('#all').addClass('active');
    table = $('#resource').DataTable({
        fixedColumns: {
            left: 2,

        },
        scrollX: true,
        processing: true,
        serverSide: true,
        //fixedColumns: true,
        "lengthMenu": [5, 10, 50, 75, 100],
        pageLength: 10,
        order: [[0, "asc"]],

        ajax: {
            url: 'http://202.69.99.67:9001/api/Shortlist/NonRasDatatable', // Your API endpoint
            type: 'POST',
            contentType: 'application/json',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("Token")
            },
            data: function (d) {
                // Customize request parameters here if needed
                // Example: d.customParam = 'value';
                // Mengambil kategori yang dipilih dari filter-navigation
                var selectedCategory = $('#filterNavigation .nav-link.active').data('category');
                d.order = d.order[0];
                // Menambahkan parameter 'category' ke data yang dikirim ke server
                if (selectedCategory != null) {
                    d.search.category = selectedCategory;
                    //console.log(d);

                }
                else {
                    d.search.category = "";
                    //console.log(d);
                }
                

                return JSON.stringify(d);
            }
        },
        //dom: 'Bfrtip',

        columns: [
            {
                data: 'fullname',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                        var icon = '<div class="row"><div class="col-4 text-left mr-4">' + data + '</div><div class="col text-right"><i class="far fa-edit" style="color: #0011ff; visibility: hidden;"></i></div></div>';

                        $(document).on("mouseover", ".row", function () {
                            $(this).find("i").css("visibility", "visible");
                        });

                        $(document).on("mouseout", ".row", function () {
                            $(this).find("i").css("visibility", "hidden");
                        });
                        var expand = icon;
                        return expand;
                    }

                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                },

            },
            {
                "data": "position",
                "render": function (data) {
                    // Pisahkan data skillset menjadi array berdasarkan koma
                    if (data == null) {
                        var a = "b"
                        return a;
                    }
                    var posisitionSplit = data.split(',');
                    //console.log(data);

                    // Container untuk pill badges
                    var badgeContainer = $('<div class="badge-container"></div>');

                    // Loop melalui setiap elemen dalam array
                    for (var i = 0; i < posisitionSplit.length; i++) {
                        // Tentukan warna badge berdasarkan data
                        var badgeColor = getBadgeColorPosition(posisitionSplit[i]);

                        // Buat pill badge dengan warna yang sesuai
                        var badge = $('<span class="badge badge-pill ' + badgeColor + '">' + posisitionSplit[i] + '</span>');

                        // Tambahkan badge ke dalam container
                        badgeContainer.append(badge);
                        // Tambahkan pemisah spasi setelah setiap badge, kecuali untuk yang terakhir
                        if (i < posisitionSplit.length - 1) {
                            badgeContainer.append(' '); // Ini adalah pemisah spasi
                        }
                    }

                    // Kembalikan HTML dari container badge
                    return badgeContainer.html();
                }
            },
            {
                "data": "skillset",
                "render": function (data) {
                    // Pisahkan data skillset menjadi array berdasarkan koma
                    if (data == null) {
                        var a = "b"
                        return a;
                    }
                    var skillsetArray = data.split(',');
                    //console.log(data);

                    // Container untuk pill badges
                    var badgeContainer = $('<div class="badge-container"></div>');

                    // Loop melalui setiap elemen dalam array
                    for (var i = 0; i < skillsetArray.length; i++) {
                        // Tentukan warna badge berdasarkan data
                        var badgeColor = getBadgeColor(skillsetArray[i]);

                        // Buat pill badge dengan warna yang sesuai
                        var badge = $('<span class="badge badge-pill ' + badgeColor + '">' + skillsetArray[i] + '</span>');

                        // Tambahkan badge ke dalam container
                        badgeContainer.append(badge);
                        // Tambahkan pemisah spasi setelah setiap badge, kecuali untuk yang terakhir
                        if (i < skillsetArray.length - 1) {
                            badgeContainer.append(' '); // Ini adalah pemisah spasi
                        }
                    }

                    // Kembalikan HTML dari container badge
                    return badgeContainer.html();
                }
            },
            {
                "data": "education"
                /*render: function (data, type, row) {
                    return htmlspecialchars(data);
                }*/
            },
            {
                "data": "university"
            },
            {
                "data": "domisili"
            },
            {
                data: 'birthdate',
                render: function (data, type, row) {
                    if (data === "") {
                        return "";
                    }
                    var datenow = Date.now();
                    var birth = new Date(data);

                    var milidetik = datenow - birth.getTime();
                    var daysremain = Math.ceil(milidetik / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
                    var years = Math.floor(daysremain / 365); // Menghitung bulan
                    var age = years + " tahun"


                    //console.log(age);
                    return age;
                }
            },
            {
                "data": "level"
            },
            {
                "data": "experienceInYear"
            },
            {
                "data": "filteringBy"
            },
            {
                data: 'workStatus',
                render: function (data) {
                    if (data === "true") {
                        return data = '<span class="badge badge-pill badge-success" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false">Active</span>'
                    } else {
                        return data = '<span class="badge badge-pill badge-secondary" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false">Inactive</span>'
                    }
                }
            },
            {
                "data": "noticePeriode"
            },
            {
                data: 'financialIndustry',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                        var checkTrue = '<i class="fas fa-check-circle" style="color: #0ba80b;"></i>';
                        var checkFalse = '<i class="fas fa-times-circle" style="color: #ee463a;"></i>';


                        if (data === "true") {
                            return '<div class="text-center">' + checkTrue + '</div>';
                        }
                        return '<div class="text-center">' + checkFalse + '</div>';
                    }

                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                }
            },
            {
                data: 'rawCv',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                        var checkTrue = '<a href ="' + data + '"> Raw Cv </a>';

                        return checkTrue;
                    }

                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                }
               
            },
            {
                data: 'cvBerca',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                        var checkTrue = '<a href ="' + data + '"> Cv Berca </a>';

                        return checkTrue;
                    }

                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                }

            },
            {
                "data": "englishLevel"
            },
            {
                data: 'currentSalary',
                render: function (data) {
                    if (data === "Rp ") {
                        return " ";
                    }
                    return data;
                }
            },
            {
                data: "expectedSalary",
                render: function (data) {
                    if (data === "Rp ") {
                        return " ";
                    }
                    return data;
                }
            },
            {
                //"data":"negotiable"
                data: 'negotiable',
                render: function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                        var checkTrue = '<i class="fas fa-check-circle" style="color: #0ba80b;"></i>';
                        var checkFalse = '<i class="fas fa-times-circle" style="color: #ee463a;"></i>';


                        if (data === "true") {

                            return '<div class="text-center">' + checkTrue + '</div>';
                        } else if (data === null) {
                            return " ";
                        }
                        return '<div class="text-center">' + checkFalse + '</div>';
                    }

                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                }
            },
            {
                "data": "intwByRas"

            },
            {
                data: 'intwDateByRas',
                render: function (data, type, row) {
                    if (data == null) {
                        return "";
                    } else {
                        if (type === 'display' || type === 'filter') {
                            // Format tanggal dalam format yang diinginkan
                            return moment(data).format('DD MMMM YYYY');
                        }
                        // Untuk tipe data lain, kembalikan data aslinya

                        return data;
                    }
                }
            },
            {
                data: 'intwUser',
                render: function (data) {
                    if (data == null) {
                        return " ";
                    } else {

                        var intw = data.split('<br/>');
                        var filterintw = intw.filter(function (intw) {
                            return intw.trim() !== 'null';
                        });

                        return '<li>' + filterintw.join("</li><li>"); + '</li>';
                    }

                }

            },
            {
                data: 'nameOfUser',
                render: function (data) {
                    if (data == null) {
                        return " ";
                    } else {

                        var nameOfUser = data.split('<br/>');
                        var nameUser = nameOfUser.filter(function (name) {

                            return name.trim() !== 'null';
                        });
                    }

                    return '<li>' + nameUser.join("</li><li>") + '</li>';
                }
            },
            {
                data: 'intwDateUser',
                render: function (data, type, row) {
                    if (data == null) {
                        return " ";
                    } else {

                        var dates = data.split('<br/>');
                        var formattedDates = [];

                        // Filter nilai null dan "<br/>"
                        for (var i = 0; i < dates.length; i++) {
                            if (dates[i] && dates[i] !== '<br/>') {
                                formattedDates.push(dates[i]);
                            }
                        }
                    }

                    // Menggabungkan data yang telah diformat kembali
                    return '<li>' + formattedDates.join("</li><li>") + '</li>';
                }
            },
            {
                "data": "levelRekom"
            },
            {
                "data": "status"
            },
            {
                "data": "notes"
            },
            {
                "data": "lastModified",
                "render": function (data, type, row) {
                    if (type === 'display' || type === 'filter') {
                        // Format tanggal dalam format yang diinginkan
                        return moment(data).format('YYYY-MM-DD ');
                    }
                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                }
            }
        ],


        searching: true,


    });

    function getLastValue(data, key) {
        const regex = new RegExp(`([^<br/>]+)(?!.*<br\/>)`);
        const match = data[key].match(regex);
        return match ? match[0] : null;
    }

    table.on('click', 'tbody tr i', function () {
        // Temukan baris <tr> terdekat yang mengandung ikon yang di klik
        let row = $(this).closest('tr');
        let data = table.row(row).data();
        $('#offeringSourceList').modal('show');
        document.getElementById('displayName').textContent = data.fullname;
        $('#nonrasid2').val(data.nonRasId);
        $('#Name2').val(data.fullname);
        $('#position2').val(data.position);
        $('#skillset2').val(data.skillset);
        $('#degree2').val(data.education);
        $('#UniversityName2').val(data.university);
        $('#domicile2').val(data.domisili);



        if (data.birthdate) {
            $('#birthdate2').val(data.birthdate.substring(0, 10));
        } else {
            $('#birthdate2').val('');
        }

        $('#level2').val(data.level);
        $('#statusOffering').val(data.status);
        $('#experience2').val(data.experienceInYear);
        $('#filteringby2').val(data.filteringBy);
        var checkbox2 = document.getElementById("workstatus2");
        if (data.workStatus == "true") {
            checkbox2.checked = true;
        } else {
            checkbox2.checked = false;
        }

        $('#notice2').val(data.noticePeriode);

        var checkbox = document.getElementById("financial2");
        if (data.financialIndustry == "true") {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
        $('#rawcv2').val(data.rawCv);
        $('#bercacv2').val(data.cvBerca);
        $('#english2').val(data.englishLevel);
        $('#current2').val(data.currentSalary);
        $('#expected2').val(data.expectedSalary);
        if (data.negotiable == "true") {
            $("#Yes2").prop("checked", true);
        } else if (data.negotiable == "false") {
            $("#No2").prop("checked", true);
        } else if (data.negotiable == null) {
            $("#Yes2").prop("checked", false);
            $("#No2").prop("checked", false);
        }


        $('#intwByRAS').val(data.intwByRas);

        if (data.intwDateByRas) {
            $('#dateIntwRAS').val(data.intwDateByRas.substring(0, 10));
        } else {
            $('#dateIntwRAS').val('');
        }
        // Ambil nilai data #intwByRAS dari database
        //var intwByRAS = data.intwByRas; // Gantilah dengan data sebenarnya dari database

        // Cek apakah data #intwByRAS sudah ada
    
        if (data.intwByRas) {
            if (data.intwUser == null || data.nameOfUser == null || data.intwDateUser == null) {
                $('#intwUser').val(data.intwUser).prop('disabled', false);
                $('#nameUser').val(data.nameOfUser).prop('disabled', false);
                $('#dateIntwUser').val('').prop('disabled', false);
                if (data.intwDateUser) {
                    $('#dateIntwUser').val(data.intwDateUser.substring(0, 10)).prop('disabled', false);
                } else {
                    $('#dateIntwUser').val('').prop('disabled', false);
                }
            } else if (!data.intwUser.includes('<br/>') || !data.nameOfUser.includes('<br/>') || !data.intwDateUser.includes('<br/>')) {
                $('#intwUser').val(data.intwUser).prop('disabled', false);
                $('#nameUser').val(data.nameOfUser).prop('disabled', false);
                $('#dateIntwUser').val('').prop('disabled', false);
                if (data.intwDateUser) {
                    $('#dateIntwUser').val(data.intwDateUser.substring(0, 10)).prop('disabled', false);
                } else {
                    $('#dateIntwUser').val('').prop('disabled', false);
                }
            } else {
                const intwUserArray = data.intwUser.split('<br/>');
                const nameOfUserArray = data.nameOfUser.split('<br/>');
                const intwDateUserArray = data.intwDateUser.split('<br/>');

                const lastIntwUser = intwUserArray[intwUserArray.length - 1];
                const lastNameOfUser = nameOfUserArray[nameOfUserArray.length - 1];
                const lastIntwDateUser = intwDateUserArray[intwDateUserArray.length - 1];

                let beforeLastIntwUser = "";
                let beforeLastDateIntwUser = "";
                let beforeLastNameOfUser = "";
                $('#intwUser').val(lastIntwUser).prop('disabled', false);
                $('#nameUser').val(lastNameOfUser).prop('disabled', false);
                // Menggunakan loop untuk mengumpulkan semua data sebelum data terakhir
                for (let i = 0; i < intwUserArray.length - 1; i++) {
                    beforeLastIntwUser += intwUserArray[i] + "<br/>";
                    beforeLastDateIntwUser += intwDateUserArray[i] + "<br/>";
                    beforeLastNameOfUser += nameOfUserArray[i] + "<br/>";
                }




                // Menyimpan data sebelum data terakhir ke elemen tersembunyi
                $('#intwuserHiden').val(beforeLastIntwUser);
                $('#dateintwuserHiden').val(beforeLastDateIntwUser);
                $('#nameUserhidden').val(beforeLastNameOfUser);
                if (lastIntwDateUser) {
                    $('#dateIntwUser').val(lastIntwDateUser.substring(0, 10)).prop('disabled', false);
                } else {
                    $('#dateIntwUser').val('').prop('disabled', false);
                }
            }
            // Jika data #intwByRAS ada, atur nilai #intwUser dan tampilkan elemen #intwUser
            //$('#intwByRAS').val(intwByRAS);
            /* $('#intwUser').val(data.intwUser).prop('disabled', false);
             if (data.intwDateUser) {
                 $('#dateIntwUser').val(data.intwDateUser.substring(0, 10)).prop('disabled', false);
             } else {
                 $('#dateIntwUser').val('').prop('disabled', false);
             }
             
             $('#nameUser').val(data.nameOfUser).prop('disabled', false);*/
        } else if (data.intwByRas === "" || data.intwByRas==null) {
            // Jika data #intwByRAS tidak ada, sembunyikan elemen #intwUser
            $('#intwUser').prop('disabled', true);
            $('#nameUser').prop('disabled', true);
            $('#dateIntwUser').prop('disabled', true);
        }

        if (data.intwUser) {
            /*var offer = document.getElementById("formoffer");
            offer.show();*/
            $('#offer').show();
        } else {
            $('#offer').hide();
        }

        /*if (data.intwDateUser) {
            $('#dateIntwUser').val(data.intwDateUser.substring(0, 10));
        } else {
            $('#dateIntwUser').val('');
        }*/

        $('#levelRekom').val(data.levelRekom);
        $('#status').val(data.status);
        $('#notes').val(data.notes);


        //alert('You clicked on ' + data.fullname + "'s row");
    });

    $('#filterNavigation .nav-link').click(function () {
        $('#filterNavigation .nav-link').removeClass('active'); // Menghapus kelas active dari semua kategori
        $(this).addClass('active'); // Menambahkan kelas active ke kategori yang dipilih

        // Mereload data DataTables dengan kategori yang baru
        table.ajax.reload();
    });


    function formatDate2(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    }

}

function ClearScreenSave() {
    $('#nonrasid').val('');
    $('#Name').val(''); //value insert dari id pada input
    $('#position').val('');;
    $('#skillset').val('');
    $('#degree').val('');
    $('#UniversityName').val('');
    $('#domicile').val('');
    $('#birthdate').val('');
    $('#level').val('');
    $('#experience').val('');
    $('#filteringby').val('');
    $('input[name="nego"]').prop('checked', false);
    $('#notice').val('');
    $('#workstatus').prop('checked', false);
    $('#financial').prop('checked', false);
    $('#rawcv').val('');
    $('#bercacv').val('');
    $('#english').val('');
    $('#current').val('');
    $('#expected').val('');
    $('#selectProvinces').val(null).trigger('change');// Kosongkan pilihan select
    $('#UniversityName').val('').trigger('change');
    $('input[required_],select[required_]').each(function () {
        var input = $(this);

        input.next('.error-message_').hide();

    });
    //$('.selectRegencies').closest('.form-group').find('.error-message').hide();

    $('.selectUniversity').closest('.form-group').find('.error-message-u').hide();

}

function ClearScreenUpt() {
    //let data = table.row(row).data();
    $('#nonrasid2').val('');
    $('#Name2').val(''); //value insert dari id pada input
    $('#position2').val('');
    $('#skillset2').val('');
    $('#degree2').val('');
    $('#UniversityName2').val('');
    $('#domicile2').val('');
    $('#birthdate2').val('');
    $('#level2').val('');
    $('#experience2').val('');
    $('#filteringby2').val('');
    $('input[name="workstatus2"]').prop('checked', false);
    $('#notice2').val('');
    $('#negotiable2').prop('checked', false);
    $('#financial2').prop('checked', false);
    $('#rawcv2').val('');;
    $('#bercacv2').val('');
    $('#english2').val('');
    $('#current2').val('');
    $('#expected2').val('');
    $('#intwByRAS').val('');
    $('#dateIntwRAS').val('');
    $('#intwUser').val('');
    $('#nameUser').val('');
    $('#dateIntwUser').val('');
    $('#levelRekom').val('');
    $('#statusOffering').val('');
    $('#notes').val('');
    $('#intwuserHiden').val('');
    $('#dateintwuserHiden').val('');
    $('#nameUserhidden').val('');
    $('#nameuser1').val('');
    $('#nameUser2').val('');
    $('#intwUser1').val('');
    $('#intwUser2').val('');
    $('#dateIntwUser1').val('');
    $('#dateIntwUser2').val('');
    /*if (data.intwByRas) {
        $('#displayIntwUser2').val('').show();
    } else {
    }*/
    $('#displayIntwUser2').val('').hide();
    $('#displayDateIntwUser2').val('').hide();
    $('#displayNameUser2').val('').hide();

    $('.btn[data-target="#collapseExample"]').text('Show 19 hidden fields');
    $('#collapseExample').collapse('hide');
}

function getUniversitasListt() {
    const selectUniversity2 = document.getElementById('UniversityName2');

    $.ajax({
        url: "../assets/file_json/loadpt.json",
        type: "GET",
        "datatype": "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            var universities = result;

            universities.forEach(function (university) {
                console.log(university);
                const option = document.createElement('option');
                option.value = university.nama_pt;
                option.textContent = university.nama_pt;
                selectUniversity2.appendChild(option);
            });

            $(selectUniversity).select2({
                placeholder: 'Select university',
                width: '100%',
                dropdownParent: $('#offeringSourceList'),
                tags: true

            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

    //const selectUniversity = document.getElementById('UniversityName');
    /*const selectUniversity2 = document.getElementById('UniversityName2');
    $.ajax({
        url: "http://202.69.99.67:9001/api/Universitas",
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            var universities = result.data;


            //selectUniversity.empty(); // Kosongkan pilihan sebelumnya
            //selectUniversity.append('<option value="" selected disabled>Select University</option>');


            universities.forEach(function (university) {
                //console.log(university);
                const option = document.createElement('option');
                option.value = university.namaUniversitas;
                option.textContent = university.namaUniversitas;
                //selectUniversity.appendChild(option);
                selectUniversity2.appendChild(option);
            });

            *//*$(selectUniversity).select2({
                placeholder: 'Select university',
                width: '100%',

            });*//*
            $(selectUniversity2).select2({
                placeholder: 'Select university',
                width: '100%',
             
                dropdownParent: $('#offeringSourceList'),
                tags: true,

            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });*/
}

function getUniversitasList() {
    const selectUniversity = document.getElementById('UniversityName');

    $.ajax({
        url: "../assets/file_json/loadpt.json",
        type: "GET",
        "datatype": "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            var universities = result;

            universities.forEach(function (university) {
                console.log(university);
                const option = document.createElement('option');
                option.value = university.nama_pt;
                option.textContent = university.nama_pt;
                selectUniversity.appendChild(option);
            });

            $(selectUniversity).select2({
                placeholder: 'Select university',
                width: '100%',
                dropdownParent: $('#Modal'),
                tags: true

            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });

    /*const selectUniversity = document.getElementById('UniversityName');

    $.ajax({
        url: "http://202.69.99.67:9001/api/Universitas",
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            var universities = result.data;


            //selectUniversity.empty(); // Kosongkan pilihan sebelumnya
            //selectUniversity.append('<option value="" selected disabled>Select University</option>');


            universities.forEach(function (university) {

                const option = document.createElement('option');
                option.value = university.namaUniversitas;
                option.textContent = university.namaUniversitas;
                selectUniversity.appendChild(option);
            });

            $('.selectUniversity').select2({
                placeholder: 'Select university',
                width: '100%',
                tags: true,
                dropdownParent: $('#Modal')

            });
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });*/
}

function formInputLocation() {

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
                    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`)
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

}

function getBadgeColor(skill) {
    // Contoh logika: Jika skillset mengandung "NET", gunakan warna biru; jika tidak, gunakan warna pink
    if (skill.toLowerCase().includes(".net web api")) {
        return "badge-pastel-teal"; // Warna biru
    } else if (skill.toLowerCase().includes(".net web mvc")) {
        return "badge-pastel-mustard";
    } else if (skill.toLowerCase().includes("codeigniter")) {
        return "badge-pastel-coral"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    } else if (skill.toLowerCase().includes("bootstrap")) {
        return "badge-pastel-purple"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
    else if (skill.toLowerCase().includes("php")) {
        return "badge-pastel-indigo"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
    else if (skill.toLowerCase().includes("python")) {
        return "badge-pastel-silver"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
    else {
        return "badge-pastel-gold"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
}

function getBadgeColorPosition(position) {
    // Contoh logika: Jika skillset mengandung "NET", gunakan warna biru; jika tidak, gunakan warna pink
    if (position.toLowerCase().includes("fullstack")) {
        return "badge-pastel-teal"; // Warna biru
    } else if (position.toLowerCase().includes("front end")) {
        return "badge-pastel-mustard";
    } else if (position.toLowerCase().includes("backend")) {
        return "badge-pastel-coral"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    } else if (position.toLowerCase().includes("data science")) {
        return "badge-pastel-purple"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
    else if (position.toLowerCase().includes("android")) {
        return "badge-pastel-indigo"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
    else if (position.toLowerCase().includes("ios")) {
        return "badge-pastel-silver"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
    else {
        return "badge-pastel-gold"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
}
/*	$(document).on('change', '.intwDateByRas-input, .intwByRas-select', function () {
        // Ambil nilai yang diubah
        var newValue = $(this).val();

        // Ambil data ID dari elemen
        var dataId = $(this).data('nonRasId');

        // Tentukan tipe data (tanggal atau select)
        var isDate = $(this).hasClass('intwDateByRas-input');  // Dapatkan nama kolom dari atribut data
        var columnName = $(this).data('column'); // Sesuaikan nama atributnya dengan apa yang Anda gunakan
        console.log(columnName);
        // Buat objek yang berisi data yang akan dikirim ke server
        var postData = {
            id: dataId,
            newValue: newValue,
    	
        };
        console.log(postData);
        // Kirim permintaan POST ke server
        $.ajax({
            url: 'URL_API_UPDATE_DATA', // Ganti dengan URL endpoint API Anda
            type: 'POST',
            data: postData,
            success: function (response) {
                // Tanggapi respons dari server jika diperlukan
                console.log('Data berhasil diperbarui:', response);
            },
            error: function (error) {
                // Tanggapi kesalahan jika diperlukan
                console.error('Terjadi kesalahan:', error);
            }
        });
    });*/

function Save() {
   
    var isValid = true;

    $('input[required_],select[required_]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message_').show();
            isValid = false;
        } else {
            input.next('.error-message_').hide();
        }
    });

    /*$('input[type="radio"][name="workstatus"]').each(function () {
        if ($(this).is(':checked')) {
            isValid = true;
        }
    });*/

    /*$('select[required_]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message_').show();
            isValid = false;
        } else {
            input.next('.error-message_').hide();
        }
    });*/

    // Validasi select options
    //var selectedRegencies = $('#selectRegencies').val();
    var selectedUniversity = $('#UniversityName').val();


    /*if (!selectedRegencies) {
        $('.selectRegencies').closest('.form-group').find('.error-message-r').show();
        isValid = false;
    } else {
        $('.selectRegencies').closest('.form-group').find('.error-message-r').hide();

    }*/


    if (!selectedUniversity) {
        $('.selectUniversity').closest('.form-group').find('.error-message-u').show();
        isValid = false;
    } else {
        $('.selectUniversity').closest('.form-group').find('.error-message-u').hide();

    }


    if (!isValid) {
        return;
    }

    var workstatus = $('#workstatus').is(':checked');
    var financial = $('#financial').is(':checked');
    if (!workstatus) {
        workstatus = false;
    }
    if (!financial) {
        financial = false;
    }
    workstatus = workstatus.toString();
    financial = financial.toString();

    var NonRasCandidate = new Object(); //object baru
    NonRasCandidate.nonRasId = $('#nonrasid').val();
    NonRasCandidate.fullname = $('#Name').val(); //value insert dari id pada input
    NonRasCandidate.position = $('#position').val();;
    NonRasCandidate.skillset = $('#skillset').val();
    NonRasCandidate.education = $('#degree').val();
    NonRasCandidate.university = $('#UniversityName').val();
    NonRasCandidate.domisili = $('#domicile').val();;
    NonRasCandidate.birthdate = $('#birthdate').val();
    NonRasCandidate.level = $('#level').val();
    NonRasCandidate.experienceInYear = $('#experience').val();
    NonRasCandidate.filteringBy = $('#filteringby').val();;
    NonRasCandidate.workStatus = workstatus;
    NonRasCandidate.noticePeriode = $('#notice').val();
    NonRasCandidate.financialIndustry = financial;
    NonRasCandidate.rawCv = $('#rawcv').val();;
    NonRasCandidate.cvBerca = $('#bercacv').val();
    NonRasCandidate.englishLevel = $('#english').val();
    NonRasCandidate.currentSalary = $('#current').val();
    NonRasCandidate.expectedSalary = $('#expected').val();
    NonRasCandidate.negotiable = $('input[name="nego"]:checked').val();;
    NonRasCandidate.intwByRas = null;
    NonRasCandidate.intwDateByRas = null;
    NonRasCandidate.intwUser = null;
    NonRasCandidate.nameOfUser = null;
    NonRasCandidate.intwDateUser = null;
    NonRasCandidate.levelRekom = "";
    NonRasCandidate.status = "";
    NonRasCandidate.notes = "";
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    // This arrangement can be altered based on how we want the date's format to appear.
    let currentDate = `${day}-${month}-${year}`;

    NonRasCandidate.lastModified = formatDate(Date());
    //console.log(NonRasCandidate);
    $.ajax({
        type: 'POST',
        url: 'http://202.69.99.67:9001/api/Shortlist/Add',
        data: JSON.stringify(NonRasCandidate),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been added!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
            ClearScreenSave();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();

        }
    })
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

}

function Update() {

    var workstatus = $('#workstatus2').is(':checked');
    var financial = $('#financial2').is(':checked');
    if (!workstatus) {
        workstatus = false;
    }
    if (!financial) {
        financial = false;
    }
    workstatus = workstatus.toString();
    financial = financial.toString();

    var NonRasCandidate = new Object(); //object baru
    NonRasCandidate.nonRasId = $('#nonrasid2').val();

    NonRasCandidate.fullname = $('#Name2').val(); //value insert dari id pada input
    NonRasCandidate.position = $('#position2').val();
    NonRasCandidate.skillset = $('#skillset2').val();
    NonRasCandidate.education = $('#degree2').val();
    NonRasCandidate.university = $('#UniversityName2').val();
    NonRasCandidate.domisili = $('#domicile2').val();
    NonRasCandidate.birthdate = $('#birthdate2').val();
    NonRasCandidate.level = $('#level2').val();
    NonRasCandidate.experienceInYear = $('#experience2').val();
    NonRasCandidate.filteringBy = $('#filteringby2').val();
    NonRasCandidate.workStatus = workstatus;
    NonRasCandidate.noticePeriode = $('#notice2').val();
    NonRasCandidate.financialIndustry = financial;
    NonRasCandidate.rawCv = $('#rawcv2').val();
    NonRasCandidate.cvBerca = $('#bercacv2').val();
    NonRasCandidate.englishLevel = $('#english2').val();
    NonRasCandidate.currentSalary = $('#current2').val();
    NonRasCandidate.expectedSalary = $('#expected2').val();
    NonRasCandidate.negotiable = $('input[name="nego2"]:checked').val();
    NonRasCandidate.intwByRas = $('#intwByRAS').val();
    //debugger;


    var date1 = $('#dateIntwUser').val();
    var date2 = $('#dateIntwUser2').val();
    var datehidden = $('#dateintwuserHiden').val();
    //var dataToSave = null;
    if (date1 !== "" && date2 == "" && datehidden == "") {
        var dataToSave = date1;
    } else if (date1 !== "" && date2 !== "" && datehidden == "") {
        var dataToSave = date1 + "<br/>" + date2;
    } else if (date1 !== "" && date2 == "" && datehidden !== "") {
        var dataToSave = datehidden + date1;
    }
    else if (date1 !== "" && date2 !== "" && datehidden !== "") {
        var dataToSave = datehidden + date1 + "<br/>" + date2;
    }


    var intwuser1 = $('#intwUser').val();
    var intwuser2 = $('#intwUser2').val();
    var intwuserhidden = $('#intwuserHiden').val();
    //var intwuser = null;


    if (intwuser1 !== "" && intwuser2 == null && intwuserhidden == "") {
        var intwuser = intwuser1;
    } else if (intwuser1 !== "" && intwuser2 !== "" && intwuserhidden == "") {
        var intwuser = intwuser1 + "<br/>" + intwuser2;
    } else if (intwuser1 !== "" && intwuser2 == null && intwuserhidden !== "") {
        var intwuser = intwuserhidden + intwuser1;
    } else if (intwuser1 !== "" && intwuser2 !== null && intwuserhidden !== "") {
        var intwuser = intwuserhidden + intwuser1 + "<br/>" + intwuser2;
    }


    var nameuser1 = $('#nameUser').val();
    var nameuser2 = $('#nameUser2').val();
    var nameuserhidden = $('#nameUserhidden').val();

    if (nameuser1 !== "" && nameuser2 == "" && nameuserhidden == "") {
        var nameuser = nameuser1;
    } else if (nameuser1 !== "" && nameuser2 !== "" && nameuserhidden == "") {
        var nameuser = nameuser1 + "<br/>" + nameuser2;
    } else if (nameuser1 !== "" && nameuser2 == "" && nameuserhidden !== "") {
        var nameuser = nameuserhidden + nameuser1;
    } else if (nameuser1 !== "" && nameuser2 !== "" && nameuserhidden !== "") {
        var nameuser = nameuserhidden + nameuser1 + "<br/>" + nameuser2;
    }


    NonRasCandidate.intwDateByRas = $('#dateIntwRAS').val();
    NonRasCandidate.intwUser = intwuser;
    NonRasCandidate.nameOfUser = nameuser;
    NonRasCandidate.intwDateUser = dataToSave;
    NonRasCandidate.levelRekom = $('#levelRekom').val();
    NonRasCandidate.status = $('#statusOffering').val();
    NonRasCandidate.notes = $('#notes').val();
    NonRasCandidate.lastModified = formatDate(Date());
   
    $.ajax({
        type: 'PUT',
        url: 'http://202.69.99.67:9001/api/Shortlist',
        data: JSON.stringify(NonRasCandidate),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been Update!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
            ClearScreenUpt();
        }
        else {
            Swal.fire({
                icon: 'warning',
                title: 'Data Gagal dimasukkan!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#Modal').modal('hide');
            table.ajax.reload();
        }
    })


    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('-');
    }

}

function newOfferingFields() {
    document.getElementById('displayIntwUser2').style.display = "block";
    document.getElementById('displayDateIntwUser2').style.display = "block";
    document.getElementById('displayNameUser2').style.display = "block";

}

function formatCurrency(input) {
    // Menghapus semua karakter selain angka
    var value = input.value.replace(/\D/g, '');
    // Menambahkan titik setelah tiga angka dari belakang
    var formattedValue = 'Rp ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = formattedValue;
}
