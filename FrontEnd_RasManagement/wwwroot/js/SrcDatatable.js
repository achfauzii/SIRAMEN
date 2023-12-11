var table = null;

$(document).ready(function () {


    getUniversitasList();
    // Panggil fungsi fetchCategories saat halaman dimuat

    fetchCategories();

    //Src();
    Src('all');
    getUniversitasListt();
    $('.position').select2();
    $('.skillset').select2({
        tags: true
    });


    //Note pada wrok status and financial industry
    const workStatusCheckbox = document.getElementById('workstatus');
    const financialCheckbox = document.getElementById('financial');
    const statusIndicator = document.querySelector('.status-indicator');
    const statusIndicator_ = document.querySelector('.status-indicator_');

    workStatusCheckbox.addEventListener('change', function () {
        if (this.checked) {
            statusIndicator.textContent = 'Working';
        } else {
            statusIndicator.textContent = 'Not Working';
        }
    });

    financialCheckbox.addEventListener('change', function () {
        if (this.checked) {
            statusIndicator_.textContent = 'Yes';
        } else {
            statusIndicator_.textContent = 'No';
        }
    });


    //Setelah element interview by RAS terisi
    // Setelah mengisi nilai pada elemen intwByRAS dan dateIntwRAS, aktifkan elemen intwUser, nameUser, dan dateIntwUser
    /* $('#intwByRAS, #dateIntwRAS').on('change', function () {
         if ($('#intwByRAS').val() && $('#dateIntwRAS').val()) {
             $('#intwUser, #nameUser, #dateIntwUser').prop('disabled', false);
         }
     });*/




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

function Src(selectedCategory) {

    if ($.fn.DataTable.isDataTable('#resource')) {
        $('#resource').DataTable().destroy();
    }
    table = $('#resource').DataTable({
        fixedColumns: {
            left: window.innerWidth > 1024 ? 1 : null,

        },

        scrollX: true,
        processing: true,
        serverSide: true,
        //fixedColumns: true,
        "lengthMenu": [5, 10, 50, 75, 100],
        pageLength: 10,
        order: [[0, "asc"]],

        ajax: {
            url: 'https://localhost:7177/api/Shortlist/NonRasDatatable', // Your API endpoint
            type: 'POST',
            contentType: 'application/json',
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("Token")
            },
            data: function (d) {
                // Customize request parameters here if needed
                // Example: d.customParam = 'value';
                // Mengambil kategori yang dipilih dari filter-navigation
                //var selectedCategory = $('#filterNavigation .nav-link.active').data('category');
                d.order = d.order[0];
                // Menambahkan parameter 'category' ke data yang dikirim ke server
                if (selectedCategory != "all") {
                    d.search.category = selectedCategory;


                }

                else {
                    d.search.category = "";

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
                "data": "level"
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

                "data": "nameOfUser",
                "render": function (data, type, row) {
                    var nameUser = row.nameOfUser;

                    if (nameUser == null) {
                        return "";
                    } else if (!nameUser.includes('<br/>')) {
                        return nameUser;
                    } else {
                        const nameUserArray = nameUser.split('<br/>');

                        // Membuat objek untuk menyimpan data
                        const userData = { nameArray: [] };

                        // Mengumpulkan data status
                        for (let i = 0; i < nameUserArray.length; i++) {
                            // Menambahkan status ke dalam array yang sesuai
                            userData.nameArray.push(nameUserArray[i]);
                        }

                        // Menampilkan data terakhir
                        const lastName = userData.nameArray[userData.nameArray.length - 1];

                        return lastName;

                        //NAMPILIN PER USER
                        /*var nameOfUser = row.nameOfUser;
                        if (nameOfUser == null) {
                            return " ";
                        } else if (!nameOfUser.includes('<br/>')) {
                            return nameOfUser;
                        } else {
                            // Extract unique usernames from the nameOfUser column
                            const nameOfUserArray = nameOfUser.split('<br/>');
                            const uniqueUsernames = Array.from(new Set(nameOfUserArray.filter(name => name.trim() !== 'null')));
    
                            // Return the unique usernames in the rendered cell
                            return '<li>' + uniqueUsernames.join('</li><li>') + '</li>';
                        }*/
                    }
                }
            },
            {
                "data": "intwUser",
                "render": function (data, type, row) {
                    var intwuser = row.intwUser;

                    if (intwuser == null) {
                        return "";
                    } else if (!intwuser.includes('<br/>')) {
                        return intwuser;
                    } else {
                        const intwUserArray = intwuser.split('<br/>');

                        // Membuat objek untuk menyimpan data
                        const userData = { statusArray: [] };

                        // Mengumpulkan data status
                        for (let i = 0; i < intwUserArray.length; i++) {
                            // Menambahkan status ke dalam array yang sesuai
                            userData.statusArray.push(intwUserArray[i]);
                        }

                        // Menampilkan data terakhir
                        const lastStatus = userData.statusArray[userData.statusArray.length - 1];

                        return lastStatus;


                        //NAMPILIN STATUS INTERVIEW PER USER
                        /*var intwuser = row.intwUser;
                        var nameofuser = row.nameOfUser;
    
                        if (intwuser == null) {
                            return "";
                        } else if (!intwuser.includes('<br/>')) {
                            return intwuser;
                        } else {
                            const intwUserArray = intwuser.split('<br/>');
                            const nameOfUserArray = nameofuser.split('<br/>');
    
                            // Membuat objek untuk menyimpan data berdasarkan nama user
                            const userDataMap = new Map();
    
                            // Mengumpulkan data berdasarkan nama user
                            for (let i = 0; i < intwUserArray.length; i++) {
                                const userName = nameOfUserArray[i];
    
                                // Jika nama user belum ada dalam userDataMap, tambahkan sebagai kunci baru
                                if (!userDataMap.has(userName)) {
                                    userDataMap.set(userName, { statusArray: [] });
                                }
    
                                // Menambahkan status ke dalam array yang sesuai
                                userDataMap.get(userName).statusArray.push(intwUserArray[i]);
                            }
    
                            // Menampilkan data terakhir untuk setiap nama user
                            let lastStatusByUser = "";
                            userDataMap.forEach((userData, userName) => {
                                const lastStatus = userData.statusArray[userData.statusArray.length - 1];
                                lastStatusByUser += `<li>${lastStatus}</li>`;
                            });
    
                            return lastStatusByUser;*/

                    }
                }
            },


            {
                data: 'intwDateUser',
                "render": function (data, type, row) {
                    var dateuser = row.intwDateUser;

                    if (dateuser == null) {
                        return "";
                    } else if (!dateuser.includes('<br/>')) {
                        return dateuser;
                    } else {
                        const dateUserArray = dateuser.split('<br/>');

                        // Membuat objek untuk menyimpan data
                        const userDate = { dateArray: [] };

                        // Mengumpulkan data status
                        for (let i = 0; i < dateUserArray.length; i++) {
                            // Menambahkan status ke dalam array yang sesuai
                            userDate.dateArray.push(dateUserArray[i]);
                        }

                        // Menampilkan data terakhir
                        const lastDate = userDate.dateArray[userDate.dateArray.length - 1];

                        return lastDate;


                        //NAMPILIN TANGGAL PER USER
                        /*var dateuser = row.intwDateUser;
                        var nameofuser = row.nameOfUser;
    
                        if (dateuser == null) {
                            return "";
                        } else if (!dateuser.includes('<br/>')) {
                            return dateuser;
                        } else {
                            const dateuserArray = dateuser.split('<br/>');
                            const nameOfUserArray = nameofuser.split('<br/>');
    
                            // Membuat objek untuk menyimpan data berdasarkan nama user
                            const userDataMap = new Map();
    
                            // Mengumpulkan data berdasarkan nama user
                            for (let i = 0; i < dateuserArray.length; i++) {
                                const userName = nameOfUserArray[i];
                                    
                                // Jika nama user belum ada dalam userDataMap, tambahkan sebagai kunci baru
                                if (!userDataMap.has(userName)) {
                                    userDataMap.set(userName, { dateArray: [] });
                                }
    
                                // Menambahkan status ke dalam array yang sesuai
                                userDataMap.get(userName).dateArray.push(dateuserArray[i]);
                            }
    
                            // Menampilkan data terakhir untuk setiap nama user
                            let lastDateByUser = "";
                            userDataMap.forEach((userData, userName) => {
                                const lastDate = userData.dateArray[userData.dateArray.length - 1];
                                lastDateByUser += `<li>${lastDate}</li>`;
                            });
    
                            return lastDateByUser;*/

                    }
                }
                /*render: function (data, type, row) {
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
                }*/
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

        const positionSelect = $('#position2');
        const selectedPosition = data.position.split(', ');
        selectedPosition.forEach(value => {
            const optionNotExists = positionSelect.find("option[value='" + value + "']").length === 0;

            if (optionNotExists) {
                const newOption = new Option(value, value, true, true);
                positionSelect.append(newOption).trigger('change');
            }
        });
        positionSelect.val(selectedPosition).trigger('change');

        const skillSelect = $('#skillset2');
        const selectedSkillset = data.skillset.split(', ');
        selectedSkillset.forEach(value => {
            const optionNotExists = skillSelect.find("option[value='" + value + "']").length === 0;

            if (optionNotExists) {
                const newOption = new Option(value, value, true, true);
                skillSelect.append(newOption).trigger('change');
            }
        });
        skillSelect.val(selectedSkillset).trigger('change');


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
        if (data.intwUser !== null) {
            var elems = document.getElementsByClassName('btn-status');
            for (var i = 0; i < elems.length; i += 1) {
                elems[i].style.display = 'block';
            }
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
                /*  var elems = document.getElementsByClassName('btn-status');
                  for (var i = 0; i < elems.length; i += 1) {
                      elems[i].style.display = 'block';
                  }*/
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
                $('#nameUser').val(lastNameOfUser).prop('disabled', true);
                // Menggunakan loop untuk mengumpulkan semua data sebelum data terakhir
                for (let i = 0; i < intwUserArray.length - 1; i++) {
                    beforeLastIntwUser += intwUserArray[i] + "<br/>";
                    beforeLastDateIntwUser += intwDateUserArray[i] + "<br/>";
                    beforeLastNameOfUser += nameOfUserArray[i] + "<br/>";
                }


                // Menyimpan data sebelum data terakhir ke elemen tersembunyi
                $('#intwuserHiden').val(beforeLastIntwUser);
                //$('#intwUserHiddenLabel').html(beforeLastIntwUser);

                $('#dateintwuserHiden').val(beforeLastDateIntwUser);
                //$('#dateIntwUserHiddenLabel').html(beforeLastDateIntwUser);

                $('#nameUserhidden').val(beforeLastNameOfUser);
                if (lastIntwDateUser) {
                    $('#dateIntwUser').val(lastIntwDateUser.substring(0, 10)).prop('disabled', false);
                } else {
                    $('#dateIntwUser').val('').prop('disabled', false);
                }


                const beforeLastDataMap = new Map();

                // Mengumpulkan data sebelum terakhir berdasarkan nama user
                for (let i = 0; i < intwUserArray.length - 1; i++) {
                    const userName = nameOfUserArray[i];

                    // Jika nama user belum ada dalam beforeLastDataMap, tambahkan sebagai kunci baru
                    if (!beforeLastDataMap.has(userName)) {
                        beforeLastDataMap.set(userName, { intwArray: [], dateArray: [] });
                    }

                    // Menambahkan status dan tanggal ke dalam array yang sesuai
                    beforeLastDataMap.get(userName).intwArray.push(intwUserArray[i]);
                    beforeLastDataMap.get(userName).dateArray.push(intwDateUserArray[i]);
                }

                // Mendapatkan elemen div yang akan menampung label-label per nama user


                // Menampilkan data sebelum terakhir untuk setiap nama user
                beforeLastDataMap.forEach((userData, userName) => {
                    // Create container div for each user
                    const containerElement = document.getElementById('historyUser');
                    containerElement.style.display = "block";
                    // Create labels for user information
                    const judulLabel = document.createElement('label');
                    judulLabel.classList.add('col-sm-2', 'col-form-label','align-top');
                    judulLabel.innerHTML = `Interview by ${userName}`;

                    const intwLabel = document.createElement('label');
                    intwLabel.classList.add('col-sm-5');
                    intwLabel.innerHTML = `Interviews:<br>${userData.intwArray.join('<br>')}`;

                    const dateLabel = document.createElement('label');
                    dateLabel.classList.add('col-sm-5');
                    dateLabel.innerHTML = `Dates:<br>${userData.dateArray.join('<br>')}`;

                    // Append labels to the user container
                    containerElement.appendChild(judulLabel);
                    containerElement.appendChild(intwLabel);
                    containerElement.appendChild(dateLabel);

                });

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
        } else if (data.intwByRas === "" || data.intwByRas == null) {
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

    /*   $('#filterNavigation .nav-link').click(function () {
           $('#filterNavigation .nav-link').removeClass('active'); // Menghapus kelas active dari semua kategori
           $(this).addClass('active'); // Menambahkan kelas active ke kategori yang dipilih
     
           // Mereload data DataTables dengan kategori yang baru
           table.ajax.reload();
       });*/


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
    $('#negotiable').prop('checked', false);
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
    $('.position').closest('.form-group').find('.error-message').hide();
    $('.skillset').closest('.form-group').find('.error-message').hide();
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
    $('#displayUserItw').val('');
    $('#dateIntwUserr').val('');

    $('input[requiredUpdate],select[requiredUpdate]').each(function () {
        var input = $(this);

        input.next('.error-message_').hide();

    });
    /*if (data.intwByRas) {
        $('#displayIntwUser2').val('').show();
    } else {
    }*/
    $('#displayIntwUser2').val('').hide();
    $('#displayDateIntwUser2').val('').hide();
    $('#displayNameUser2').val('').hide();

    $('.btn[data-target="#collapseExample"]').text('Show 19 hidden fields');
    $('#collapseExample').collapse('hide');


    $('.error-message-update').css('display', 'none');

    var elems = document.getElementsByClassName('btn-status');
    for (var i = 0; i < elems.length; i += 1) {
        elems[i].style.display = 'none';
    }


    //cleare form new client
    const historyUser = document.getElementById('historyUser');
    historyUser.innerHTML = "";

    document.getElementById('displayUserLabel').style.display = "none";
    document.getElementById('nameUser2').style.display = "none";
    document.getElementById('displayUserItw').style.display = "none";
    document.getElementById('displayFormOffer').style.display = "none";
    $('#status').prop('disabled', false);

}

function getUniversitasListt() {
    //const selectUniversity = document.getElementById('UniversityName');
    const selectUniversity2 = document.getElementById('UniversityName2');
    $.ajax({
        url: "https://localhost:7177/api/Universitas",
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

            /*$(selectUniversity).select2({
                placeholder: 'Select university',
                width: '100%',

            });*/
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
    });
}

function getUniversitasList() {
    const selectUniversity = document.getElementById('UniversityName');

    $.ajax({
        url: "https://localhost:7177/api/Universitas",
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
    });
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
    else if (skill.toLowerCase().includes("laravel")) {
        return "badge-pastel-coral";
    }
    else if (skill.toLowerCase().includes("react")) {
        return "badge-pastel-rose";
    }
    else if (skill.toLowerCase().includes("spring")) {
        return "badge-pastel-mint";
    }
    else if (skill.toLowerCase().includes("sql server")) {
        return "badge-pastel-cus1";
    }
    else if (skill.toLowerCase().includes("oracle")) {
        return "badge-pastel-cus2";
    }
    else {
        return "badge-pastel-gold"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
    }
}

function getBadgeColorPosition(position) {
    // Contoh logika: Jika skillset mengandung "NET", gunakan warna biru; jika tidak, gunakan warna pink
    if (position.toLowerCase().includes("fullstack")) {
        return "badge-pastel-teal"; // Warna biru
    } else if (position.toLowerCase().includes("front end","frontend")) {
        return "badge-pastel-mustard";
    } else if (position.toLowerCase().includes("back end")) {
        return "badge-pastel-coral"; 
    } else if (position.toLowerCase().includes("data science")) {
        return "badge-pastel-purple"; 
    }
    else if (position.toLowerCase().includes("database administrator")) {
        return "badge-pastel-indigo"; 
    }
    else if (position.toLowerCase().includes("database analyst")) {
        return "badge-pastel-silver"; 
    }
    else if (position.toLowerCase().includes("database engineer" ||"data engineer")) {
        return "badge-pastel-coral"; 
    }
    else if (position.toLowerCase().includes("RPA")) {
        return "badge-pastel-rose";
    }
    else if (position.toLowerCase().includes("Scrum Master")) {
        return "badge-pastel-mint";
    }
    else if (position.toLowerCase().includes("Manual")) {
        return "badge-pastel-cus1";
    }
    else if (position.toLowerCase().includes("Automation")) {
        return "badge-pastel-cus2";
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

    var positionReq = $('#position').val();
    var skillsetReq = $('#skillset').val();
    if (!positionReq?.some(Boolean) || !skillsetReq?.some(Boolean) || !positionReq?.some(Boolean)) {
        $('.position').closest('.form-group').find('.error-message').show();
        isValid = false;
    } else {
        $('.position').closest('.form-group').find('.error-message').hide();
    }

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
    NonRasCandidate.position = $('#position').val().join(", ");
    NonRasCandidate.skillset = $('#skillset').val().join(", ");
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
    /*    if (!NonRasCandidate.position.some(Boolean)) {
            $('.position').closest('.form-group').find('.error-message').show();
            isValid = false;
        } else {
            $('.position').closest('.form-group').find('.error-message').hide();
        }*/
    $.ajax({
        type: 'POST',
        url: 'https://localhost:7177/api/Shortlist/Add',
        data: JSON.stringify(NonRasCandidate),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        //
        const logMesagge = `Has Added Shortlist Candidate ${NonRasCandidate.fullname}`;
        SaveLogUpdate(logMesagge);
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
    var isValid = true;
    /*   $('input[requiredUpdate],select[requiredUpdate').each(function () {
           var input = $(this);
           if (!input.val()) {
               input.next('.error-message-update').show();
               isValid = false;
           } else {
               input.next('.error-message-update').hide();
           }
       });*/

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
    NonRasCandidate.position = $('#position2').val().join(", ");
    NonRasCandidate.skillset = $('#skillset2').val().join(", ");
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


    //New User
    var nameUser = $('#nameUser').val();
    var intwUser = $('#intwUser').val();
    var dateIntwUser = $('#dateIntwUser').val();
    var nameUserHidden = $('#nameUserhidden').val();
    var intwUser2 = $('#intwUser2').val();
    var dateIntwUser2 = $('#dateIntwUser2').val();
    var intwUserHidden = $('#intwuserHiden').val();
    var dateIntwUserHidden = $('#dateintwuserHiden').val();

    var newNameUser = $('#nameUser2').val();
    var newIntwUser = $('#displayUserItw').val();
    var newDateIntwUser = $('#dateIntwUserr').val();


    /* console.log('Name User:', nameUser);
     console.log('Interview User:', intwUser);
     console.log('Date Interview User:', dateIntwUser);
     console.log('Name User Hidden:', nameUserHidden);
     console.log('Interview User 2:', intwUser2);
     console.log('Date Interview User 2:', dateIntwUser2);
     console.log('Interview User Hidden:', intwUserHidden);
     console.log('Date Interview User Hidden:', dateIntwUserHidden);
 
     console.log('newNameUser:', newNameUser);
     console.log('newIntwUser:', newIntwUser);
     console.log('newDateIntwUser:', newDateIntwUser);*/
    if ($('#displayUserItw').is(':visible')) {
        if ($('#displayUserItw').val() === null) {
            $('.error-message-update').css('display', 'block');
            return false; // Field tidak valid
        }
    }

    if ($('#dateIntwUserr').is(':visible')) {
        if ($('#dateIntwUserr').val() === '') {
            $('.error-message-update').css('display', 'block');
            return false; // Field tidak valid
        }
    }
    if ($('#nameUser2').is(':visible')) {
        if ($('#dateIntwUserr').val() === '') {
            $('.error-message-update').css('display', 'block');
            return false; // Field tidak valid
        }
    }
    if (!isValid) {
        return;
    }

    if (nameUser !== "" && nameUserHidden == "" && intwUser !== "" && dateIntwUser !== "" && intwUser2 == null && dateIntwUser2 == "" && intwUserHidden == "" && dateIntwUserHidden == "" && newNameUser == "" && newIntwUser == null && newDateIntwUser == "") {
        var nameUser_ = nameUser;
        var intwUser_ = intwUser;
        var dateIntwUser_ = dateIntwUser;
        console.log("AA");
    } else if (nameUser !== "" && nameUserHidden == "" && intwUser !== null && dateIntwUser !== "" && intwUser2 !== null && dateIntwUser2 !== "" && intwUserHidden == "" && dateIntwUserHidden == "" && newNameUser == "" && newIntwUser == null && newDateIntwUser == "") {
        var nameUser_ = nameUser + "<br/>" + nameUser;
        var intwUser_ = intwUser + "<br/>" + intwUser2;
        var dateIntwUser_ = dateIntwUser + "<br/>" + dateIntwUser2;
        console.log("BB");
    } else if (nameUser !== "" && nameUserHidden !== "" && intwUser !== null && dateIntwUser !== "" && intwUser2 !== null && dateIntwUser2 !== "" && intwUserHidden !== "" && dateIntwUserHidden !== "" && newNameUser == "" && newIntwUser == null && newDateIntwUser == "") {
        var nameUser_ = nameUserHidden + nameUser + "<br/>" + nameUser;
        var intwUser_ = intwUserHidden + intwUser + "<br/>" + intwUser2;
        var dateIntwUser_ = dateIntwUserHidden + dateIntwUser + "<br/>" + dateIntwUser2;
        console.log("CC");
    } else if (nameUser !== "" && nameUserHidden !== "" && intwUser !== null && dateIntwUser !== "" && intwUser2 == null && dateIntwUser2 == "" && intwUserHidden !== "" && dateIntwUserHidden !== "" && newNameUser !== "" && newIntwUser !== null && newDateIntwUser !== "") {
        var nameUser_ = nameUserHidden + nameUser + "<br/>" + newNameUser;
        var intwUser_ = intwUserHidden + intwUser + "<br/>" + newIntwUser;
        var dateIntwUser_ = dateIntwUserHidden + dateIntwUser + "<br/>" + newDateIntwUser;

        console.log("DD");
    } else if (nameUser !== "" && nameUserHidden == "" && intwUser !== null && dateIntwUser !== "" && intwUser2 == null && dateIntwUser2 == "" && intwUserHidden == "" && dateIntwUserHidden == "" && newNameUser !== "" && newIntwUser !== null && newDateIntwUser !== "") {
        var nameUser_ = nameUser + "<br/>" + newNameUser;
        var intwUser_ = intwUser + "<br/>" + newIntwUser;
        var dateIntwUser_ = dateIntwUser + "<br/>" + newDateIntwUser;
        console.log("EE");
    }

    else if (nameUser !== "" && nameUserHidden !== "" && intwUser !== null && dateIntwUser !== "" && intwUser2 == null && dateIntwUser2 == "" && intwUserHidden !== "" && dateIntwUserHidden !== "" && newNameUser == "" && newIntwUser == null && newDateIntwUser == "") {
        var nameUser_ = nameUserHidden + nameUser;
        var intwUser_ = intwUserHidden + intwUser;
        var dateIntwUser_ = dateIntwUserHidden + dateIntwUser;
        console.log("FF");
    }
    /* else if (nameUser !== "" && nameUserHidden !== "" && intwUser !== null && dateIntwUser !== "" && intwUser2 == null && dateIntwUser2 == "" && intwUserHidden !== "" && dateIntwUserHidden !== "" && newNameUser == "" || newIntwUser == null || newDateIntwUser == "") {
        
         console.log("GG");
         return;
     }
 */
    //Bates
    /*   var date1 = $('#dateIntwUser').val();
       var date2 = $('#dateIntwUser2').val 
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
   */

    NonRasCandidate.intwDateByRas = $('#dateIntwRAS').val();
    NonRasCandidate.intwUser = intwUser_;
    NonRasCandidate.nameOfUser = nameUser_;
    NonRasCandidate.intwDateUser = dateIntwUser_;
    NonRasCandidate.levelRekom = $('#levelRekom').val();
    NonRasCandidate.status = $('#statusOffering').val();
    NonRasCandidate.notes = $('#notes').val();
    NonRasCandidate.lastModified = formatDate(Date());

    $.ajax({
        type: 'PUT',
        url: 'https://localhost:7177/api/Shortlist',
        data: JSON.stringify(NonRasCandidate),
        contentType: "application/json; charset=utf-8",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then((result) => {
        //
        if (result.status == 200) {
            const logMessage = `Has been Updated Candidate data, Id ${NonRasCandidate.nonRasId}, name ${NonRasCandidate.fullname}`;
            SaveLogUpdate(logMessage);
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data has been Update!',
                showConfirmButtom: false,
                timer: 1500
            })
            $('#offeringSourceList').modal('hide');
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
    document.getElementById('displayDateIntwUser2').style.display = "block";
    document.getElementById('displayIntwUser2').style.display = "block";
}

function newProses2() {
    document.getElementById('displayIntwUser3').style.display = "block";
    document.getElementById('displayDateIntwUser3').style.display = "block";


}

/*function newClientFields() {
    document.getElementById('displayUser2').style.display = "block";
}*/
/*function newClientFields() {
    var displayUser2 = document.getElementById('displayUser2');
    if (displayUser2.style.display === 'none' || displayUser2.style.display === '') {
        displayUser2.style.display = 'block';
    } else {
        displayUser2.style.display = 'none';
    }
   
}*/
function formatCurrency(input) {
    // Menghapus semua karakter selain angka
    var value = input.value.replace(/\D/g, '');
    // Menambahkan titik setelah tiga angka dari belakang
    var formattedValue = 'Rp ' + value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    input.value = formattedValue;
}

// Fungsi untuk mengambil data kategori dari API
function fetchCategories() {
    fetch('https://localhost:7177/api/Shortlist/Position', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Memanggil fungsi untuk membuat navigasi berdasarkan data yang diterima

            createNavigation(data.data);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}



// Fungsi untuk membuat navigasi dan datatable
/*function createNavigation(categories) {
    categories.unshift('All');
    const filterNavigation = document.getElementById('filterNavigation');
    const navList = document.createElement('ul');
    navList.className = 'nav nav-tabs';

    const maxVisibleCategories = 7;

    categories.forEach(category => {
        const listItem = document.createElement('li');
        listItem.className = 'nav-item';

        const link = document.createElement('a');
        link.className = 'nav-link text-sm';
        link.href = '#';
        link.setAttribute('data-category', category.toLowerCase());
        link.textContent = capitalizeWords(category);

        listItem.appendChild(link);
        navList.appendChild(listItem);

        if (category == 'All') { // Tandai 'All' sebagai aktif secara default
            link.classList.add('active');
        }
        // Tambahkan event listener untuk setiap link kategori
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCategory = this.getAttribute('data-category');
            //console.log('Selected category:', selectedCategory);

            navList.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            // Tambahkan kelas 'active' pada link yang dipilih
            this.classList.add('active');

            // Panggil fungsi Src dengan kategori yang dipilih
            Src(selectedCategory);
        });
    });


    filterNavigation.appendChild(navList);

}*/

function createNavigation(categories) {
    let maxVisibleCategories = 7;
    categories.unshift('All'); // Menambahkan opsi "All" ke dalam array categories

    // Mendeteksi lebar layar saat halaman dimuat
    const screenWidth = window.innerWidth || document.documentElement.clientWidth;

    // Ubah jumlah maksimum kategori yang ditampilkan berdasarkan lebar layar
    if (screenWidth <= 1024) {

        maxVisibleCategories = 5; // Ubah menjadi 7 jika lebar layar <= 1024 pixel
    }
    if (screenWidth < 850) {

        maxVisibleCategories = 4; // Ubah menjadi 7 jika lebar layar <= 1024 pixel
    }
    if (screenWidth < 750) {

        maxVisibleCategories = 3; // Ubah menjadi 7 jika lebar layar <= 1024 pixel
    }
    if (screenWidth <= 500) {

        maxVisibleCategories = 1; // Ubah menjadi 7 jika lebar layar <= 1024 pixel
    }
    const navList = document.createElement('ul');
    navList.className = 'nav nav-tabs';

    // Loop untuk menambahkan item navigasi sampai index 6 (item ke-7)
    for (let i = 0; i < Math.min(categories.length, maxVisibleCategories); i++) {
        const listItem = document.createElement('li');
        listItem.className = 'nav-item';

        const link = document.createElement('a');
        link.className = 'nav-link text-sm';
        link.href = '#';
        link.setAttribute('data-category', categories[i].toLowerCase());
        link.textContent = capitalizeWords(categories[i]);

        if (i === 0) { // Tandai 'All' sebagai aktif secara default
            link.classList.add('active');
        }

        listItem.appendChild(link);


        navList.appendChild(listItem);

        // Tambahkan event listener untuk setiap link kategori
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCategory = this.getAttribute('data-category');
            console.log('Selected category:', selectedCategory);

            navList.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });

            this.classList.add('active');

            // Panggil fungsi Src dengan kategori yang dipilih
            Src(selectedCategory);
        });
    }

    const filterNavigation = document.getElementById('filterNavigation');

    // Dropdown untuk menyimpan sisa kategori setelah ke-7

    if (categories.length > maxVisibleCategories) {
        const dropdownContainer = createDropdown(categories.slice(maxVisibleCategories));
        navList.appendChild(dropdownContainer);

        dropdownToggle = dropdownContainer.querySelector('.dropdown-toggle');

        dropdownToggle.addEventListener('click', function () {
            const navLinks = navList.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            dropdownToggle.classList.add('active');
        });
    }

    // Tambahkan elemen dropdown ke akhir dari list navigasi
    filterNavigation.appendChild(navList);
}

// Fungsi untuk membuat dropdown
function createDropdown(categories) {
    const dropdownContainer = document.createElement('li');
    dropdownContainer.className = 'nav-item dropdown ml-auto'; // Untuk mengatur ke kanan (ml-auto)

    const dropdownToggle = document.createElement('a');
    dropdownToggle.className = 'nav-link dropdown-toggle';
    dropdownToggle.href = '#';
    dropdownToggle.setAttribute('id', 'navbarDropdown');
    dropdownToggle.setAttribute('role', 'button');
    dropdownToggle.setAttribute('data-toggle', 'dropdown');
    dropdownToggle.setAttribute('aria-haspopup', 'true');
    dropdownToggle.setAttribute('aria-expanded', 'false');
    dropdownToggle.textContent = 'More';

    const dropdownMenu = document.createElement('div');
    dropdownMenu.className = 'dropdown-menu';
    dropdownMenu.setAttribute('aria-labelledby', 'navbarDropdown');

    categories.forEach(category => {
        const dropdownItem = document.createElement('a');
        dropdownItem.className = 'dropdown-item';
        dropdownItem.href = '#';
        dropdownItem.textContent = capitalizeWords(category);

        dropdownItem.addEventListener('click', function (e) {
            e.preventDefault();
            const selectedCategory = this.textContent;
            console.log('Selected category:', selectedCategory);

            Src(selectedCategory);
        });

        dropdownMenu.appendChild(dropdownItem);
    });

    dropdownContainer.appendChild(dropdownToggle);
    dropdownContainer.appendChild(dropdownMenu);

    return dropdownContainer;
}

// Fungsi untuk mengubah huruf besar di awal dan setelah spasi
function capitalizeWords(str) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
}

function newOfferingFields() {
    document.getElementById('displayDateIntwUser2').style.display = "block";
    document.getElementById('displayIntwUser2').style.display = "block";
    document.getElementById('offer').style.display = "none";
}

function newProses2() {
    document.getElementById('displayIntwUser3').style.display = "block";
    document.getElementById('displayDateIntwUser3').style.display = "block";
}

function newClientFields() {
    document.getElementById('displayUserLabel').style.display = "block";
    document.getElementById('nameUser2').style.display = "block";
    document.getElementById('displayUserItw').style.display = "block";
    document.getElementById('displayFormOffer').style.display = "block";
    //document.getElementById('status').style.display = "none";
    $('#status').prop('disabled', true);
    $('#intwUser').prop('disabled', true);
    $('#nameUser').prop('disabled', true);
    $('#dateIntwUser').prop('disabled', true);

    document.getElementById('offer').style.display = "none";
}