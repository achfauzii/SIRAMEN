var table = null;
var softlColors = [
    "#B7E4C7", // Mint Green
    "#FFD8B1", // Soft Peach
    "#C9C8E8", // Lavender Grey
    "#BCCEF8",
    "#AED9E0", // Sky Blue
    "#F9E4AD", // Pale Yellow
    "#FFA69E", // Coral Pink
    "#D0AEEF", // Pastel Lilac
    "#B5DFE6", // Icy Blue
    "#F6E4C8", // Buttercreamy
    "#c9a7eb",
    "#a4b0f5",
    "#D2E0FB",
    "#F7F5EB",
];

var pastelColors = [
    "#B7E4C7", // Mint Green
    "#FFD8B1", // Soft Peach
    "#C9C8E8", // Lavender Grey
    "#BCCEF8",
    "#AED9E0", // Sky Blue
    "#F9E4AD", // Pale Yellow
    "#FFA69E", // Coral Pink
    "#D0AEEF", // Pastel Lilac
    "#B5DFE6", // Icy Blue
    "#F6E4C8", // Buttercream
    "#c9a7eb",
    "#a4b0f5",
    "#D2E0FB",
    "#F7F5EB",
];

$(document).ready(function () {
    SharedShortListCandidate("all");
    fetchCategories();
});
function SharedShortListCandidate(selectedCategory) {
    //$('#all').addClass('active');
    if ($.fn.DataTable.isDataTable("#resource")) {
        $("#resource").DataTable().destroy();
    }
    table = $("#resource").DataTable({
        fixedColumns: {
            left: 2,
        },
        scrollX: true,
        processing: true,
        serverSide: true,
        //fixedColumns: true,
        lengthMenu: [5, 10, 50, 75, 100],
        pageLength: 10,
        order: [[0, "asc"]],

        ajax: {
            url: "https://localhost:7177/api/Shortlist/ShortListCandidate", // Your API endpoint
            type: "POST",
            contentType: "application/json",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("Token"),
            },
            data: function (d) {
                // Customize request parameters here if needed
                // Example: d.customParam = 'value';
                // Mengambil kategori yang dipilih dari filter-navigation
                //var selectedCategory = $('#filterNavigation .nav-link.active').data('category');
                d.order = d.order[0];
                // Menambahkan parameter 'category' ke data yang dikirim ke server
                // Menambahkan parameter 'category' ke data yang dikirim ke server
                if (selectedCategory != "all") {
                    d.search.category = selectedCategory;
                } else {
                    d.search.category = "";
                }

                return JSON.stringify(d);
            },
        },
        //dom: 'Bfrtip',

        columns: [
            {
                data: "fullname",
            },
            {
                data: "position",
                render: function (data) {
                    if (data == null) {
                        var a = "b";
                        return a;
                    }
                    var posisitionSplit = data.split(",");
                    var badgeContainer = $('<div class="badge-container"></div>');

                    for (var i = 0; i < posisitionSplit.length; i++) {
                        var word = posisitionSplit[i].trim();
                        var badgeColor = getColorForPosition(word);
                        var badge = $(
                            '<span class="badge badge-pill badge-pastel">' + word + "</span>"
                        );

                        // Atur warna latar belakang badge sesuai dengan kata yang sama
                        badge.css("background-color", badgeColor);

                        badgeContainer.append(badge);
                        if (i < posisitionSplit.length - 1) {
                            badgeContainer.append(" ");
                        }
                    }
                    // Kembalikan HTML dari container badge
                    return badgeContainer.html();
                },
            },
            {
                data: "skillset",
                render: function (data) {
                    // Pisahkan data skillset menjadi array berdasarkan koma
                    if (data == null) {
                        var a = "b";
                        return a;
                    }
                    var skillsetArray = data.split(",");
                    // Container untuk pill badges
                    var badgeContainer = $('<div class="badge-container"></div>');

                    // Loop melalui setiap elemen dalam array
                    for (var i = 0; i < skillsetArray.length; i++) {
                        var word = skillsetArray[i].trim();
                        var badgeColor = getColorForWord(word);
                        var badge = $(
                            '<span class="badge badge-pill badge-pastel;" style="margin: 0.1rem">' + word + "</span>"
                        );

                        // Atur warna latar belakang badge sesuai dengan kata yang sama
                        badge.css("background-color", badgeColor);

                        badgeContainer.append(badge);
                        if (i < skillsetArray.length - 1) {
                            badgeContainer.append(" ");
                        }
                    }

                    // Kembalikan HTML dari container badge
                    return badgeContainer.html();
                },
            },
            {
                data: "levelRekom",
            },
            {
                data: "level",
            },
            {
                data: "education",
                /*render: function (data, type, row) {
                            return htmlspecialchars(data);
                        }*/
            },
            {
                data: "ipk",
            },
            {
                data: "university",
            },
            {
                data: "domisili",
            },
            {
                data: "birthdate",
            },

            {
                data: "experienceInYear",
            },

            {
                data: "workStatus",
                render: function (data) {
                    if (data === "true" || data === "True") {
                        return (data =
                            '<span class="badge badge-pill badge-success" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false">Active</span>');
                    } else if (data === "false" || data === "False") {
                        return (data =
                            '<span class="badge badge-pill badge-secondary" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false">Inactive</span>');
                    }
                    return " ";

                },
            },
            {
                data: "noticePeriode",
            },
            {
                data: "financialIndustry",
                render: function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                        var checkTrue =
                            '<i class="fas fa-check-circle" style="color: #0ba80b;"></i>';
                        var checkFalse =
                            '<i class="fas fa-times-circle" style="color: #ee463a;"></i>';

                        if (data === "true" || data === "True") {
                            return '<div class="text-center">' + checkTrue + "</div>";
                        } else if (data === "false" || data === "False") {
                            return '<div class="text-center">' + checkFalse + "</div>";
                        }
                        return " ";

                    }

                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                },
            },

            {
                data: "cvBerca",
                render: function (data, type, row) {
                    if (type === "display" || type === "filter") {
                        // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
                        var checkTrue = '<a href ="' + data + '"> Cv Berca </a>';

                        return checkTrue;
                    }

                    // Untuk tipe data lain, kembalikan data aslinya
                    return data;
                },
            },
        ],
        "columnDefs": [
            {
                "targets": [2], 
                "className": "customWrap"
            }
        ],
        searching: true,
    });

    /*    $('#filterNavigation .nav-link').click(function () {
              $('#filterNavigation .nav-link').removeClass('active'); // Menghapus kelas active dari semua kategori
              $(this).addClass('active'); // Menambahkan kelas active ke kategori yang dipilih
      
              // Mereload data DataTables dengan kategori yang baru
              table.ajax.reload();
          });*/
}

// Fungsi untuk mengambil data kategori dari API
function fetchCategories() {
    fetch("https://localhost:7177/api/Shortlist/Position", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then((data) => {
            // Memanggil fungsi untuk membuat navigasi berdasarkan data yang diterima

            createNavigation(data.data);
        })
        .catch((error) => {
            console.error(
                "There has been a problem with your fetch operation:",
                error
            );
        });
}

function createNavigation(categories) {

    let maxVisibleCategories = 7;

    categories.unshift("All"); // Menambahkan opsi "All" ke dalam array categories

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
        maxVisibleCategories = 2; // Ubah menjadi 7 jika lebar layar <= 1024 pixel
    }
    const navList = document.createElement("ul");
    navList.className = "nav nav-tabs";

    // Loop untuk menambahkan item navigasi sampai index 6 (item ke-7)
    for (let i = 0; i < Math.min(categories.length, maxVisibleCategories); i++) {
        const listItem = document.createElement("li");
        listItem.className = "nav-item";

        const link = document.createElement("a");
        link.className = "nav-link text-sm";
        link.href = "#";
        link.setAttribute("data-category", categories[i].toLowerCase());
        link.textContent = capitalizeWords(categories[i]);

        if (i === 0) {
            // Tandai 'All' sebagai aktif secara default
            link.classList.add("active");
        }

        listItem.appendChild(link);

        navList.appendChild(listItem);

        // Tambahkan event listener untuk setiap link kategori
        link.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedCategory = this.getAttribute("data-category");
            console.log("Selected category:", selectedCategory);

            navList.querySelectorAll(".nav-link").forEach((link) => {
                link.classList.remove("active");
            });

            this.classList.add("active");

            // Panggil fungsi Src dengan kategori yang dipilih
            SharedShortListCandidate(selectedCategory);
        });
    }

    const filterNavigation = document.getElementById("filterNavigation");

    // Dropdown untuk menyimpan sisa kategori setelah ke-7

    if (categories.length > maxVisibleCategories) {
        const dropdownContainer = createDropdown(
            categories.slice(maxVisibleCategories)
        );
        navList.appendChild(dropdownContainer);

        dropdownToggle = dropdownContainer.querySelector(".dropdown-toggle");

        dropdownToggle.addEventListener("click", function () {
            const navLinks = navList.querySelectorAll(".nav-link");
            navLinks.forEach((link) => {
                link.classList.remove("active");
            });
            dropdownToggle.classList.add("active");
        });
    }

    // Tambahkan elemen dropdown ke akhir dari list navigasi
    filterNavigation.appendChild(navList);
}

// Fungsi untuk membuat dropdown
function createDropdown(categories) {
    const dropdownContainer = document.createElement("li");
    dropdownContainer.className = "nav-item dropdown ml-auto"; // Untuk mengatur ke kanan (ml-auto)

    const dropdownToggle = document.createElement("a");
    dropdownToggle.className = "nav-link dropdown-toggle";
    dropdownToggle.href = "#";
    dropdownToggle.setAttribute("id", "navbarDropdown");
    dropdownToggle.setAttribute("role", "button");
    dropdownToggle.setAttribute("data-toggle", "dropdown");
    dropdownToggle.setAttribute("aria-haspopup", "true");
    dropdownToggle.setAttribute("aria-expanded", "false");
    dropdownToggle.textContent = "More";

    const dropdownMenu = document.createElement("div");
    dropdownMenu.className = "dropdown-menu";
    dropdownMenu.setAttribute("aria-labelledby", "navbarDropdown");

    categories.forEach((category) => {
        const dropdownItem = document.createElement("a");
        dropdownItem.className = "dropdown-item";
        dropdownItem.href = "#";
        dropdownItem.textContent = capitalizeWords(category);

        dropdownItem.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedCategory = this.textContent;
            console.log("Selected category:", selectedCategory);

            SharedShortListCandidate(selectedCategory);
        });

        dropdownMenu.appendChild(dropdownItem);
    });

    dropdownContainer.appendChild(dropdownToggle);
    dropdownContainer.appendChild(dropdownMenu);

    return dropdownContainer;
}


// Fungsi untuk mengubah huruf besar di awal dan setelah spasi
function capitalizeWords(str) {
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function (a) {
        return a.toUpperCase();
    });
}

// Fungsi untuk mendapatkan warna pastel secara acak
function getRandomPastelColor() {
    var randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
}

function getRandomSoftlColor() {
    var randomIndex = Math.floor(Math.random() * pastelColors.length);
    return pastelColors[randomIndex];
}

// Simpan warna berdasarkan kata yang sama di objek
var colorsByWord = {};
var colorByPosition = {};

// Fungsi untuk mendapatkan warna berdasarkan kata skillset
function getColorForWord(word) {
    if (!colorsByWord.hasOwnProperty(word)) {
        // Jika kata belum memiliki warna yang terkait, atur warna pastel secara urut
        colorsByWord[word] =
            pastelColors[Object.keys(colorsByWord).length % pastelColors.length];
    }
    return colorsByWord[word];
}

function getColorForPosition(word) {
    if (!colorsByWord.hasOwnProperty(word)) {
        // Jika kata belum memiliki warna yang terkait, atur warna pastel secara urut
        colorsByWord[word] =
            softlColors[Object.keys(colorsByWord).length % softlColors.length];
    }
    return colorsByWord[word];
}
