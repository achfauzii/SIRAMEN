var table = null;
$(document).ready(function () {
  SharedShortListCandidate();
});
function SharedShortListCandidate() {
  $("#all").addClass("active");
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
      url: "202.69.99.67:9001/api/Shortlist/ShortListCandidate", // Your API endpoint
      type: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      data: function (d) {
        // Customize request parameters here if needed
        // Example: d.customParam = 'value';
        // Mengambil kategori yang dipilih dari filter-navigation
        var selectedCategory = $("#filterNavigation .nav-link.active").data(
          "category"
        );
        d.order = d.order[0];
        // Menambahkan parameter 'category' ke data yang dikirim ke server
        if (selectedCategory != null) {
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
        render: function (data, type, row) {
          if (type === "display" || type === "filter") {
            // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
            var icon =
              '<div class="row"><div class="col-4 text-left mr-4">' +
              data +
              '</div><div class="col text-right"><i class="far fa-edit" style="color: #0011ff; visibility: hidden;"></i></div></div>';

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
        data: "position",
        render: function (data) {
          // Pisahkan data skillset menjadi array berdasarkan koma
          if (data == null) {
            var a = "b";
            return a;
          }
          var posisitionSplit = data.split(",");
          //console.log(data);

          // Container untuk pill badges
          var badgeContainer = $('<div class="badge-container"></div>');

          // Loop melalui setiap elemen dalam array
          for (var i = 0; i < posisitionSplit.length; i++) {
            // Tentukan warna badge berdasarkan data
            var badgeColor = getBadgeColorPosition(posisitionSplit[i]);

            // Buat pill badge dengan warna yang sesuai
            var badge = $(
              '<span class="badge badge-pill ' +
                badgeColor +
                '">' +
                posisitionSplit[i] +
                "</span>"
            );

            // Tambahkan badge ke dalam container
            badgeContainer.append(badge);
            // Tambahkan pemisah spasi setelah setiap badge, kecuali untuk yang terakhir
            if (i < posisitionSplit.length - 1) {
              badgeContainer.append(" "); // Ini adalah pemisah spasi
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
          //console.log(data);

          // Container untuk pill badges
          var badgeContainer = $('<div class="badge-container"></div>');

          // Loop melalui setiap elemen dalam array
          for (var i = 0; i < skillsetArray.length; i++) {
            // Tentukan warna badge berdasarkan data
            var badgeColor = getBadgeColor(skillsetArray[i]);

            // Buat pill badge dengan warna yang sesuai
            var badge = $(
              '<span class="badge badge-pill ' +
                badgeColor +
                '">' +
                skillsetArray[i] +
                "</span>"
            );

            // Tambahkan badge ke dalam container
            badgeContainer.append(badge);
            // Tambahkan pemisah spasi setelah setiap badge, kecuali untuk yang terakhir
            if (i < skillsetArray.length - 1) {
              badgeContainer.append(" "); // Ini adalah pemisah spasi
            }
          }

          // Kembalikan HTML dari container badge
          return badgeContainer.html();
        },
      },
      {
        data: "education",
        /*render: function (data, type, row) {
                    return htmlspecialchars(data);
                }*/
      },
      {
        data: "university",
      },
      {
        data: "domisili",
      },
      {
        data: "birthdate",
        render: function (data, type, row) {
          if (data === "") {
            return "";
          }
          var datenow = Date.now();
          var birth = new Date(data);

          var milidetik = datenow - birth.getTime();
          var daysremain = Math.ceil(milidetik / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
          var years = Math.floor(daysremain / 365); // Menghitung bulan
          var age = years + " tahun";

          //console.log(age);
          return age;
        },
      },
      {
        data: "level",
      },
      {
        data: "experienceInYear",
      },

      {
        data: "workStatus",
        render: function (data) {
          if (data === "true") {
            return (data =
              '<span class="badge badge-pill badge-success" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false">Active</span>');
          } else {
            return (data =
              '<span class="badge badge-pill badge-secondary" style="outline: none; border:none"  data - placement="right" data - toggle="modal" data - animation="false">Inactive</span>');
          }
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

            if (data === "true") {
              return '<div class="text-center">' + checkTrue + "</div>";
            }
            return '<div class="text-center">' + checkFalse + "</div>";
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

      {
        data: "levelRekom",
      },
    ],

    searching: true,
  });

  $("#filterNavigation .nav-link").click(function () {
    $("#filterNavigation .nav-link").removeClass("active"); // Menghapus kelas active dari semua kategori
    $(this).addClass("active"); // Menambahkan kelas active ke kategori yang dipilih

    // Mereload data DataTables dengan kategori yang baru
    table.ajax.reload();
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
  } else if (skill.toLowerCase().includes("php")) {
    return "badge-pastel-indigo"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
  } else if (skill.toLowerCase().includes("python")) {
    return "badge-pastel-silver"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
  } else {
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
  } else if (position.toLowerCase().includes("android")) {
    return "badge-pastel-indigo"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
  } else if (position.toLowerCase().includes("ios")) {
    return "badge-pastel-silver"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
  } else {
    return "badge-pastel-gold"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
  }
}
