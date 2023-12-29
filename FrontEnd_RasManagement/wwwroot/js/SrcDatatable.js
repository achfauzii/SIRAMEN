var table = null;
var isTruncated = null;
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
function toggleContent(element, originalData) {
  var content = document.getElementById(element).innerHTML;
  isTruncated = content.includes("... (Read More)");

  var decodeData = decodeURIComponent(originalData);
  if (isTruncated) {
    // Currently truncated, expand to show full content
    document.getElementById(element).innerHTML =
      decodeData +
      '<span class="expand-content text-primary" onclick="toggleContent(\'' +
      element +
      "', '" +
      originalData +
      "')\"> (Show Less)</span>";
  } else {
    // Currently showing full content, truncate to show less
    document.getElementById(element).innerHTML =
      decodeData.substring(0, 20) +
      '<span class="expand-content text-primary" onclick="toggleContent(\'' +
      element +
      "', '" +
      originalData +
      "')\">... (Read More)</span>";
  }
}

$(document).ready(function () {
  // $("#experience_year").on("keyup", function () {
  //   var regex = /^[0-9<>\s]+$/;

  //   if (!regex.test(this.value)) {
  //     var value = this.value.replace(/^[^0-9<>]/g, "");
  //     this.value = value;
  //     return;
  //   }
  // });

  getClientList();

  getUniversitasList();
  // Panggil fungsi fetchCategories saat halaman dimuat

  fetchCategories();

  //Src();
  Src("all");
  getUniversitasListt();

  $(".position").select2();
  $(".skillset").select2({
    tags: true,
  });

  //Note pada wrok status and financial industry
  const workStatusCheckbox = document.getElementById("workstatus");
  const financialCheckbox = document.getElementById("financial");

  const workStatusCheckbox2 = document.getElementById("workstatus2");
  const financialCheckbox2 = document.getElementById("financial2");

  const statusIndicator = document.querySelector(".status-indicator");
  const statusIndicator_ = document.querySelector(".status-indicator_");

  workStatusCheckbox.addEventListener("change", function () {
    if (this.checked) {
      statusIndicator.textContent = "Working";
    } else {
      statusIndicator.textContent = "Not Working";
    }
  });

  financialCheckbox.addEventListener("change", function () {
    if (this.checked) {
      statusIndicator_.textContent = "Yes";
    } else {
      statusIndicator_.textContent = "No";
    }
  });

  $("#offeringSourceList").on("shown.bs.modal", function () {
    if (workStatusCheckbox2.checked) {
      document.getElementsByClassName("status-indicator")[1].textContent =
        "Working";
    } else {
      document.getElementsByClassName("status-indicator")[1].textContent =
        "Not Working";
    }

    if (financialCheckbox2.checked) {
      document.getElementsByClassName("status-indicator_")[1].textContent =
        "Yes";
    } else {
      document.getElementsByClassName("status-indicator_")[1].textContent =
        "No";
    }
  });

  workStatusCheckbox2.addEventListener("change", function () {
    if (this.checked) {
      document.getElementsByClassName("status-indicator")[1].textContent =
        "Working";
    } else {
      document.getElementsByClassName("status-indicator")[1].textContent =
        "Not Working";
    }
  });

  financialCheckbox2.addEventListener("change", function () {
    if (this.checked) {
      document.getElementsByClassName("status-indicator_")[1].textContent =
        "Yes";
    } else {
      document.getElementsByClassName("status-indicator_")[1].textContent =
        "No";
    }
  });
});

function htmlspecialchars(str) {
  var map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  var outp = str.replace(/[&<>"']/g, function (m) {
    return map[m];
  });
  return outp;
}

function noHTML(input) {
  var value = input.value.replace(/<[^>]*>/g, "");
  //var nohtml = value.replace(/[<>?/]/g, '');
  input.value = value;
}

function numeric(input) {
  var numericValue = input.value.replace(/[^\d.,]/g, "");
  input.value = numericValue;
}

function handleInput(event, input) {
  // Menangani peristiwa oninput dan onpaste
  noHTML(input);
}

function Src(selectedCategory) {
  if ($.fn.DataTable.isDataTable("#resource")) {
    $("#resource").DataTable().destroy();
  }
  table = $("#resource").DataTable({
    fixedColumns: {
      left: window.innerWidth > 1024 ? 1 : null,
    },
    fixedHeader: true,
    scrollX: true,
    processing: true,
    serverSide: true,
    lengthMenu: [5, 10, 50, 75, 100],
    pageLength: 10,
    order: [[0, "asc"]],

    ajax: {
      url: "https://localhost:7177/api/Shortlist/NonRasDatatable", // Your API endpoint
      type: "POST",
      contentType: "application/json",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("Token"),
      },
      data: function (d) {
        d.order = d.order[0];
        if (selectedCategory != "all") {
          d.search.category = selectedCategory;
        } else {
          d.search.category = "";
        }

        return JSON.stringify(d);
      },
    },

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
              '<span class="badge badge-pill badge-pastel" style="margin: 0.1rem">' +
                word +
                "</span>"
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
        render: function (data) {
          return data.trim() !== "" ? data + " Years Old" : "";
        },
      },

      {
        data: "experienceInYear",
        render: function (data) {
          if (data == null || data == "") {
            return "";
          } else {
            var year = data.substring(0, 1);
            var month = data.substring(3, 4);
            if (year >= 5) {
              if (month != "" || year > 5) {
                return "> 5 Years";
              } else {
                return year + " Years";
              }
            } else if (year < 1) {
              if (month != "") {
                return "< 1 Year";
              } else {
                return "0 Year";
              }
            } else if (year > 1) {
              if (month != "") {
                return year + " Years " + month + " Months";
              } else {
                return year + " Years";
              }
            } else {
              if (month != "") {
                return year + " Year " + month + " Months";
              } else {
                return year + " Year";
              }
            }
          }
        },
      },
      {
        data: "filteringBy",
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
          } else {
            return " ";
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
        data: "rawCv",
        render: function (data, type, row) {
          if (data == "" || data == null || data == " ") {
            return " ";
          }
          if (type === "display" || type === "filter") {
            // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
            var checkTrue =
              '<a href ="' + data + '"> ' + row.fullname + " CV </a>";

            return checkTrue;
          }

          // Untuk tipe data lain, kembalikan data aslinya
          return data;
        },
      },
      {
        data: "cvBerca",
        render: function (data, type, row) {
          if (data == "" || data == null || data == " ") {
            return " ";
          }
          if (type === "display" || type === "filter") {
            // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
            var checkTrue =
              '<a href ="' + data + '"> ' + row.fullname + " Berca CV </a>";

            return checkTrue;
          }

          // Untuk tipe data lain, kembalikan data aslinya
          return data;
        },
      },
      {
        data: "englishLevel",
      },
      {
        data: "currentSalary",
        render: function (data) {
          if (data === "Rp " || data == "" || data == null || data == " ") {
            return " ";
          } else if (/^Rp\s\d{1,3}(\.\d{3})*$/.test(data)) {
            return data; // Mengembalikan data tanpa pemformatan tambahan
          }

          // Mengonversi string menjadi angka
          const numericData = parseFloat(data);

          // Memeriksa apakah data adalah angka
          if (!isNaN(numericData)) {
            // Memformat angka menjadi format mata uang Indonesia
            const formattedData = numericData.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });

            return formattedData;
          }

          return data;
        },
      },
      {
        data: "expectedSalary",
        render: function (data) {
          if (data === "Rp " || data == "" || data == null || data == " ") {
            return " ";
          } else if (/^Rp\s\d{1,3}(\.\d{3})*$/.test(data)) {
            return data; // Mengembalikan data tanpa pemformatan tambahan
          }

          // Mengonversi string menjadi angka
          const numericData = parseFloat(data);

          // Memeriksa apakah data adalah angka
          if (!isNaN(numericData)) {
            // Memformat angka menjadi format mata uang Indonesia
            const formattedData = numericData.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            });

            return formattedData;
          }

          return data;
        },
      },
      {
        //"data":"negotiable"
        data: "negotiable",
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
        data: "techTest",
        render: function (data, type, row) {
          if (data == "" || data == null || data == " ") {
            return " ";
          }
          if (type === "display" || type === "filter") {
            // Inisialisasi variabel yang akan menyimpan kode HTML checkbox
            var checkTrue =
              '<a href ="' + data + '"> ' + row.fullname + " Test Result </a>";

            return checkTrue;
          }

          // Untuk tipe data lain, kembalikan data aslinya
          return data;
        },
      },
      {
        data: "intwByRas",
      },
      {
        data: "intwDateByRas",
        render: function (data, type, row) {
          if (data == null || data == "" || data == " ") {
            return "";
          } else {
            if (type === "display" || type === "filter") {
              // Format tanggal dalam format yang diinginkan
              return moment(data).format("DD MMMM YYYY");
            }
            // Untuk tipe data lain, kembalikan data aslinya

            return data;
          }
        },
      },
      {
        data: "nameOfUser",
        render: function (data, type, row) {
          var nameUser = row.nameOfUser;

          if (nameUser == null || nameUser == "") {
            return "";
          } else if (!nameUser.includes("<br/>")) {
            return nameUser;
          } else {
            const nameUserArray = nameUser.split("<br/>");

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
        },
      },
      {
        data: "intwUser",
        render: function (data, type, row) {
          var intwuser = row.intwUser;

          if (intwuser == null || intwuser == "") {
            return "";
          } else if (!intwuser.includes("<br/>")) {
            return intwuser;
          } else {
            const intwUserArray = intwuser.split("<br/>");

            // Membuat objek untuk menyimpan data
            const userData = { statusArray: [] };

            // Mengumpulkan data status
            for (let i = 0; i < intwUserArray.length; i++) {
              // Menambahkan status ke dalam array yang sesuai
              userData.statusArray.push(intwUserArray[i]);
            }

            // Menampilkan data terakhir
            const lastStatus =
              userData.statusArray[userData.statusArray.length - 1];

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
        },
      },

      {
        data: "intwDateUser",
        render: function (data, type, row) {
          var dateuser = row.intwDateUser;

          if (dateuser == null || dateuser == "") {
            return "";
          } else if (!dateuser.includes("<br/>")) {
            return moment(dateuser).format("DD MMMM YYYY");
          } else {
            const dateUserArray = dateuser.split("<br/>");

            // Membuat objek untuk menyimpan data
            const userDate = { dateArray: [] };

            // Mengumpulkan data status
            for (let i = 0; i < dateUserArray.length; i++) {
              // Menambahkan status ke dalam array yang sesuai
              userDate.dateArray.push(dateUserArray[i]);
            }

            // Menampilkan data terakhir
            const lastDate = userDate.dateArray[userDate.dateArray.length - 1];

            return moment(lastDate).format("DD MMMM YYYY");

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
        },
      },
      {
        data: "levelRekom",
      },
      {
        data: "status",
      },
      {
        data: "notes",
        render: function (data, type, row) {
          if (type === "display" && data.length > 20) {
            var encodedData = encodeURIComponent(data);
            return (
              '<div id="notes' +
              row.nonRasId +
              '">' +
              data.substring(0, 20) +
              '<span class="expand-content text-primary" onclick="toggleContent(\'notes' +
              row.nonRasId +
              "', '" +
              encodedData +
              "')\">... (Read More)</span>" +
              "</div>"
            );
          } else {
            return data;
          }
        },
      },
      {
        data: "lastModified",
        render: function (data, type, row) {
          if (data != null) {
            if (type === "display" || type === "filter") {
              // Format tanggal dalam format yang diinginkan
              return moment(data).format("YYYY-MM-DD ");
            }
          }
          // Untuk tipe data lain, kembalikan data aslinya
          return " ";
        },
      },
    ],
    columnDefs: [
      {
        targets: [2, 28],
        className: "customWrap",
      },
    ],
    searching: true,
  });

  function getLastValue(data, key) {
    const regex = new RegExp(`([^<br/>]+)(?!.*<br\/>)`);
    const match = data[key].match(regex);
    return match ? match[0] : null;
  }

  table.on("click", "tbody tr i", function () {
    // Temukan baris <tr> terdekat yang mengandung ikon yang di klik

    let row = $(this).closest("tr");
    let data = table.row(row).data();
    $("#offeringSourceList").modal("show");
    document.getElementById("displayName").textContent = data.fullname;
    $("#nonrasid2").val(data.nonRasId);
    $("#Name2").val(data.fullname);

    const positionSelect = $("#position2");
    const selectedPosition = data.position.split(", ");
    selectedPosition.forEach((value) => {
      const optionNotExists =
        positionSelect.find("option[value='" + value + "']").length === 0;

      if (optionNotExists) {
        const newOption = new Option(value, value, true, true);
        positionSelect.append(newOption).trigger("change");
      }
    });
    positionSelect.val(selectedPosition).trigger("change");

    const skillSelect = $("#skillset2");
    const selectedSkillset = data.skillset.split(", ");
    selectedSkillset.forEach((value) => {
      const optionNotExists =
        skillSelect.find("option[value='" + value + "']").length === 0;

      if (optionNotExists) {
        const newOption = new Option(value, value, true, true);
        skillSelect.append(newOption).trigger("change");
      }
    });
    skillSelect.val(selectedSkillset).trigger("change");

    $("#degree2").val(data.education);
    $("#ipk2").val(data.ipk);
    //$('#UniversityName2').val(data.university);
    const selectUniversities = $("#UniversityName2");
    selectUniversities.val(data.university).trigger("change");

    $("#domicile2").val(data.domisili);

    if (data.birthdate) {
      $("#age").val(data.birthdate);
    } else {
      $("#age").val("");
    }

    $("#level2").val(data.level);
    $("#statusOffering").val(data.status);

    // $("#experience").val(data.experienceInYear);
    $("#experience_year2").val(data.experienceInYear.substring(0, 1));
    $("#experience_month2").val(data.experienceInYear.substring(3, 4));

    $("#filteringby2").val(data.filteringBy);
    var checkbox2 = document.getElementById("workstatus2");
    if (data.workStatus == "true") {
      checkbox2.checked = true;
    } else {
      checkbox2.checked = false;
    }

    $("#notice2").val(data.noticePeriode);

    var checkbox = document.getElementById("financial2");
    if (data.financialIndustry == "true") {
      checkbox.checked = true;
    } else {
      checkbox.checked = false;
    }
    $("#rawcv2").val(data.rawCv);
    $("#bercacv2").val(data.cvBerca);
    $("#english2").val(data.englishLevel);
    $("#current2").val(data.currentSalary);
    $("#expected2").val(data.expectedSalary);
    if (data.negotiable == "true") {
      $("#Yes2").prop("checked", true);
    } else if (data.negotiable == "false") {
      $("#No2").prop("checked", true);
    } else if (data.negotiable == null) {
      $("#Yes2").prop("checked", false);
      $("#No2").prop("checked", false);
    }
    $("#techTest").val(data.techTest);
    $("#intwByRAS").val(data.intwByRas);

    if (data.intwDateByRas) {
      $("#dateIntwRAS").val(data.intwDateByRas.substring(0, 10));
    } else {
      $("#dateIntwRAS").val("");
    }
    if (data.intwUser !== null) {
      var elems = document.getElementsByClassName("btn-status");
      for (var i = 0; i < elems.length; i += 1) {
        elems[i].style.display = "block";
      }
    }
    // Ambil nilai data #intwByRAS dari database
    //var intwByRAS = data.intwByRas; // Gantilah dengan data sebenarnya dari database

    // Cek apakah data #intwByRAS sudah ada
    const selectNameUser = $("#nameUser");
    selectNameUser.val(data.nameOfUser).trigger("change");

    const selectNameUser2 = $("#nameUser2");
    const dataNameUser = data.nameOfUser;
    selectNameUser2.val(null).trigger("change");
    /*if (dataNameUser == null) {
                    selectNameUser2.val(null).trigger("change");
                }
                else if (!dataNameUser.includes('<br/>')) {
                    const optionNotExists = selectNameUser2.find("option[value='" + dataNameUser + "']").length === 0;
        
                    if (optionNotExists) {
                        const newOption = new Option(dataNameUser, dataNameUser, true, true);
                        selectNameUser2.append(newOption).trigger('change');
                    }
                    selectNameUser2.val(null).trigger("change");
                } else {
                    const nameOfUserArray = dataNameUser.split('<br/>');
                    nameOfUserArray.forEach(value => {
                        const optionNotExists = selectNameUser2.find("option[value='" + value + "']").length === 0;
        
                        if (optionNotExists) {
                            const newOption = new Option(value, value, true, true);
                            console.log(newOption);
                            selectNameUser2.append(newOption).trigger('change');
                        }
                    });
                    selectNameUser2.val(null).trigger("change");
        
                }*/

    if (data.intwByRas) {
      if (
        data.intwUser == null ||
        data.nameOfUser == null ||
        data.intwDateUser == null
      ) {
        /*$(selectNameUser).select2({
                                    width: '100%',
                                    tags: true,
                                    dropdownParent: $('#offeringSourceList')
                                });*/

        $("#intwUser").val(data.intwUser).prop("disabled", false);
        $("#nameUser").val(data.nameOfUser).prop("disabled", false);
        $("#dateIntwUser").val("").prop("disabled", false);

        if (data.intwDateUser) {
          $("#dateIntwUser")
            .val(data.intwDateUser.substring(0, 10))
            .prop("disabled", false);
        } else {
          $("#dateIntwUser").val("").prop("disabled", false);
        }
      } else if (
        !data.intwUser.includes("<br/>") ||
        !data.nameOfUser.includes("<br/>") ||
        !data.intwDateUser.includes("<br/>")
      ) {
        /*  var elems = document.getElementsByClassName('btn-status');
                                  for (var i = 0; i < elems.length; i += 1) {
                                      elems[i].style.display = 'block';
                                  }*/
        /*$(selectNameUser).select2({
                                    width: '100%',
                                    tags: true,
                                    dropdownParent: $('#offeringSourceList')
                                });
                                const optionNotExists = selectNameUser.find("option[value='" + dataNameUser + "']").length === 0;
                
                                if (optionNotExists) {
                                    const newOption = new Option(dataNameUser, dataNameUser, true, true);
                                    selectNameUser.append(newOption).trigger('change');
                
                                }*/
        selectNameUser.val(dataNameUser).trigger("change");
        $("#intwUser").val(data.intwUser).prop("disabled", false);
        $("#nameUser").val(data.nameOfUser).prop("disabled", false);
        $("#dateIntwUser").val("").prop("disabled", false);
        if (data.intwDateUser) {
          $("#dateIntwUser")
            .val(data.intwDateUser.substring(0, 10))
            .prop("disabled", false);
        } else {
          $("#dateIntwUser").val("").prop("disabled", false);
        }
      } else {
        const intwUserArray = data.intwUser.split("<br/>");
        const nameOfUserArray = data.nameOfUser.split("<br/>");
        const intwDateUserArray = data.intwDateUser.split("<br/>");

        const lastIntwUser = intwUserArray[intwUserArray.length - 1];
        const lastNameOfUser = nameOfUserArray[nameOfUserArray.length - 1];
        const lastIntwDateUser =
          intwDateUserArray[intwDateUserArray.length - 1];

        let beforeLastIntwUser = "";
        let beforeLastDateIntwUser = "";
        let beforeLastNameOfUser = "";
        $("#intwUser").val(lastIntwUser).prop("disabled", false);
        $("#nameUser").prop("disabled", true);
        // Menggunakan loop untuk mengumpulkan semua data sebelum data terakhir
        for (let i = 0; i < intwUserArray.length - 1; i++) {
          beforeLastIntwUser += intwUserArray[i] + "<br/>";
          beforeLastDateIntwUser += intwDateUserArray[i] + "<br/>";
          beforeLastNameOfUser += nameOfUserArray[i] + "<br/>";
        }

        /*nameOfUserArray.forEach(value => {
                                    const optionNotExists = selectNameUser.find("option[value='" + value + "']").length === 0;
                
                                    if (optionNotExists) {
                                        const newOption = new Option(value, value, true, true);
                                        selectNameUser.append(newOption).trigger('change');
                                    }
                                });*/
        selectNameUser.val(lastNameOfUser).trigger("change");
        // Menyimpan data sebelum data terakhir ke elemen tersembunyi
        $("#intwuserHiden").val(beforeLastIntwUser);
        //$('#intwUserHiddenLabel').html(beforeLastIntwUser);

        $("#dateintwuserHiden").val(beforeLastDateIntwUser);
        //$('#dateIntwUserHiddenLabel').html(beforeLastDateIntwUser);

        $("#nameUserhidden").val(beforeLastNameOfUser);
        if (lastIntwDateUser) {
          $("#dateIntwUser")
            .val(lastIntwDateUser.substring(0, 10))
            .prop("disabled", false);
        } else {
          $("#dateIntwUser").val("").prop("disabled", false);
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
          const containerElement = document.getElementById("historyUser");
          containerElement.style.display = "block";
          // Create labels for user information
          const judulLabel = document.createElement("label");
          judulLabel.classList.add("col-sm-2", "col-form-label", "align-top");
          judulLabel.innerHTML = `Interview by ${userName}`;

          const intwLabel = document.createElement("label");
          intwLabel.classList.add("col-sm-5");
          intwLabel.innerHTML = `Interviews:<br>${userData.intwArray.join(
            "<br>"
          )}`;

          const dateLabel = document.createElement("label");
          dateLabel.classList.add("col-sm-5");
          dateLabel.innerHTML = `Dates:<br>${userData.dateArray.join("<br>")}`;

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
      $("#intwUser").prop("disabled", true);
      $("#nameUser").prop("disabled", true);
      $("#dateIntwUser").prop("disabled", true);
    }

    if (data.intwUser) {
      /*var offer = document.getElementById("formoffer");
                        offer.show();*/
      $("#offer").show();
      //console.log(data.intwUser);
    } else {
      $("#offer").hide();
      //console.log(data.intwUser);
    }

    $("#levelRekom").val(data.levelRekom);
    $("#status").val(data.status);
    $("#notes").val(data.notes);

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
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("/");
  }
}

function ClearScreenSave() {
  $("#nonrasid").val("");
  $("#Name").val(""); //value insert dari id pada input

  $("#position").val(null).trigger("change");
  $("#skillset").val(null).trigger("change");
  $("#degree").val("");
  $("#ipk").val("");
  $("#UniversityName").val("");
  $("#domicile").val("");
  $("#age1").val("");
  $("#level").val("");
  $("#experience_year").val("");
  $("#experience_month").val("");
  $("#filteringby").val("");
  $('input[name="nego"]').prop("checked", false);
  $("#notice").val("");
  $("#negotiable").prop("checked", false);
  $("#financial").prop("checked", false);
  $("#rawcv").val("");
  $("#bercacv").val("");
  $("#english").val("");
  $("#current").val("");
  $("#expected").val("");
  $("#selectProvinces").val(null).trigger("change"); // Kosongkan pilihan select
  $("#UniversityName").val("").trigger("change");
  $("input[required_],select[required_]").each(function () {
    var input = $(this);
    input.next(".error-message_").hide();

    $(".error-format-ipk").hide();
  });

  $(".position").closest(".form-group").find(".error-message").hide();
  $(".skillset").closest(".form-group").find(".error-message").hide();
  //$('.selectRegencies').closest('.form-group').find('.error-message').hide();

  $(".selectUniversity").closest(".form-group").find(".error-message-u").hide();
}

function ClearScreenUpt() {
  //let data = table.row(row).data();
  $("#nonrasid2").val("");
  $("#Name2").val(""); //value insert dari id pada input
  $("#position2").val(null).trigger("change");
  $("#skillset2").val(null).trigger("change");
  $("#degree2").val("");
  $("#ipk2").val("");
  $("#UniversityName2").val("");
  $("#domicile2").val("");
  $("#age").val("");
  $("#level2").val("");
  // $("#experience").val("");
  $("#experience_year2").val("");
  $("#experience_month2").val("");
  $("#filteringby2").val("");
  $('input[name="workstatus2"]').prop("checked", false);
  $("#notice2").val("");
  $("#negotiable2").prop("checked", false);
  $("#financial2").prop("checked", false);
  $("#rawcv2").val("");
  $("#bercacv2").val("");
  $("#english2").val("");
  $("#current2").val("");
  $("#expected2").val("");
  $("#intwByRAS").val("");
  $("#dateIntwRAS").val("");
  $("#intwUser").val("");
  $("#nameUser").val("");
  $("#dateIntwUser").val("");
  $("#levelRekom").val("");
  $("#statusOffering").val("");
  $("#notes").val("");
  $("#techTest").val("");
  $("#intwuserHiden").val("");
  $("#dateintwuserHiden").val("");
  $("#nameUserhidden").val("");
  $("#nameuser1").val("");
  $("#nameUser2").val("");
  $("#intwUser1").val("");
  $("#intwUser2").val("");
  $("#dateIntwUser1").val("");
  $("#dateIntwUser2").val("");
  $("#displayUserItw").val("");
  $("#dateIntwUserr").val("");

  $("input[requiredUpdate],select[requiredUpdate]").each(function () {
    var input = $(this);

    input.next(".error-message_").hide();
    $(".error-format-ipk-update").hide();
  });

  $("#displayIntwUser2").val("").hide();
  $("#displayDateIntwUser2").val("").hide();

  $("#nameUser2").next().hide();

  $('.btn[data-target="#collapseExample"]').text("Show 19 hidden fields");
  $("#collapseExample").collapse("hide");

  $(".error-message-update").css("display", "none");

  $("#experience_error").hide();

  var elems = document.getElementsByClassName("btn-status");
  for (var i = 0; i < elems.length; i += 1) {
    elems[i].style.display = "none";
  }

  //cleare form new client
  const historyUser = document.getElementById("historyUser");
  historyUser.innerHTML = "";

  document.getElementById("displayUserLabel").style.display = "none";
  document.getElementById("nameUser2").style.display = "none";
  document.getElementById("displayUserItw").style.display = "none";
  document.getElementById("displayFormOffer").style.display = "none";
  $("#status").prop("disabled", false);
}

function getUniversitasListt() {
  //const selectUniversity = document.getElementById('UniversityName');
  const selectUniversity2 = document.getElementById("UniversityName2");

  $.ajax({
    url: "../assets/file_json/loadpt.json",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      // var universities = result.data;
      result.forEach(function (university) {
        const option = document.createElement("option");
        option.value = university.nama_pt;
        option.textContent = university.nama_pt;
        selectUniversity2.appendChild(option);
      });

      $(selectUniversity2).select2({
        placeholder: "Select university",
        width: "100%",
        allowClear: true,
        tags: true,
        minimumInputLength: 3,
        dropdownParent: $("#offeringSourceList"),
      });
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function getUniversitasList() {
  const selectUniversity = document.getElementById("UniversityName");
  $.ajax({
    url: "../assets/file_json/loadpt.json",
    type: "GET",
    dataType: "json",

    success: function (result) {
      result.forEach(function (university) {
        const option = document.createElement("option");
        option.value = university.nama_pt;
        option.textContent = university.nama_pt;
        selectUniversity.appendChild(option);
      });

      $(selectUniversity).select2({
        placeholder: "Select university",
        width: "100%",
        allowClear: true,
        tags: true,
        minimumInputLength: 3,
        dropdownParent: $("#Modal"),
      });
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function getClientList() {
  const selectClient = document.getElementById("nameUser");

  $.ajax({
    url: "https://localhost:7177/api/ClientName",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (response) {
      if (response.status === 200 && Array.isArray(response.data)) {
        var clients = response.data.map(function (item) {
          return item.nameOfClient;
        });

        // Clear previous options
        selectClient.innerHTML = "";

        clients.forEach(function (clientName) {
          const option = document.createElement("option");
          option.value = clientName;
          option.textContent = clientName;
          selectClient.appendChild(option);
        });

        $(selectClient).select2({
          placeholder: "Select Client",
          width: "100%",
          dropdownParent: $("#offeringSourceList"),
        });
      } else {
        console.error("Unexpected server response format:", response);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error making the AJAX request:", textStatus, errorThrown);
    },
  });
}

function getClientList2() {
  const selectClient2 = document.getElementById("nameUser2");

  $.ajax({
    url: "https://localhost:7177/api/ClientName",
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (response) {
      if (response.status === 200 && Array.isArray(response.data)) {
        var clients = response.data.map(function (item) {
          return item.nameOfClient;
        });

        // Clear previous options
        selectClient2.innerHTML = "";

        clients.forEach(function (clientName) {
          const option = document.createElement("option");
          option.value = clientName;
          option.textContent = clientName;
          selectClient2.appendChild(option);
        });

        $(selectClient2).select2({
          placeholder: "Select Client",
          width: "100%",
          dropdownParent: $("#offeringSourceList"),
        });
      } else {
        console.error("Unexpected server response format:", response);
      }
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.error("Error making the AJAX request:", textStatus, errorThrown);
    },
  });
}

function formInputLocation() {
  const selectProvinces = document.getElementById("selectProvinces");
  const selectRegencies = document.getElementById("selectRegencies");
  //Ini untuk tanpa display none jadi langsung di tampilkan ()
  $(selectRegencies).select2({
    placeholder: "Select City or County",
    width: "100%",
  });

  fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
    .then((response) => response.json())
    .then((provinces) => {
      provinces.forEach((province) => {
        const option = document.createElement("option");
        option.value = province.id;
        option.textContent = province.name;
        selectProvinces.appendChild(option);
      });

      // Inisialisasi Select2 untuk select provinsi
      $(selectProvinces).select2({
        placeholder: "Select Province",
        width: "100%",
      });
      //selectRegencies.style.display = 'none';

      // Event listener ketika provinsi dipilih
      $(selectProvinces).on("change", function () {
        const selectedProvinceId = $(this).val();

        // Hapus pilihan sebelumnya di select regencies
        $(selectRegencies).empty();

        if (selectedProvinceId) {
          fetch(
            `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedProvinceId}.json`
          )
            .then((response) => response.json())
            .then((regencies) => {
              regencies.forEach((regency) => {
                const option = document.createElement("option");
                option.value = regency.name;
                option.textContent = regency.name;
                selectRegencies.appendChild(option);
              });

              // Inisialisasi Select2 untuk select regencies
              $(selectRegencies).select2({
                placeholder: "Select City or County",
                width: "100%",
              });
              //  selectRegencies.style.display = 'block';
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

function Save() {
  var isValid = true;

  $("input[required_],select[required_]").each(function () {
    var input = $(this);
    if (!input.val()) {
      input.next(".error-message_").show();
      isValid = false;
    } else {
      input.next(".error-message_").hide();
    }
    // Memeriksa format IPK jika input adalah elemen dengan ID 'ipk'
    /*if (input.attr("id") === "ipk") {
                var ipk = input.val().trim();
                var validIPK = /^(?:[0-3](?:\.[0-9]{1,2})?|4(?:\.00?)?)$/;
    
                if (!validIPK.test(ipk)) {
                    $(".error-format-ipk").show(); // Menampilkan pesan error format IPK
                    isValid = false;
                } else {
                    $(".error-format-ipk").hide(); // Menyembunyikan pesan error format IPK
                }
            }*/
  });

  if (!$("#experience_year").val()) {
    $("#experience_error").show();
    isValid = false;
  }
  // Validasi select options
  //var selectedRegencies = $('#selectRegencies').val();
  var selectedUniversity = $("#UniversityName").val();

  var positionReq = $("#position").val();
  var skillsetReq = $("#skillset").val();
  if (
    !positionReq?.some(Boolean) ||
    !skillsetReq?.some(Boolean) ||
    !positionReq?.some(Boolean)
  ) {
    $(".position").closest(".form-group").find(".error-message").show();
    isValid = false;
  } else {
    $(".position").closest(".form-group").find(".error-message").hide();
  }

  if (!selectedUniversity) {
    $(".selectUniversity")
      .closest(".form-group")
      .find(".error-message-u")
      .show();
    isValid = false;
  } else {
    $(".selectUniversity")
      .closest(".form-group")
      .find(".error-message-u")
      .hide();
  }

  if (!isValid) {
    return;
  }

  var workstatus = $("#workstatus").is(":checked");
  var financial = $("#financial").is(":checked");
  if (!workstatus) {
    workstatus = false;
  }
  if (!financial) {
    financial = false;
  }
  workstatus = workstatus.toString();
  financial = financial.toString();

  if (
    $("#experience_month").val() == null ||
    $("#experience_month").val() == ""
  ) {
    var experience = $("#experience_year").val();
  } else {
    var experience =
      $("#experience_year").val() + ", " + $("#experience_month").val();
  }

  var NonRasCandidate = new Object(); //object baru
  NonRasCandidate.nonRasId = $("#nonrasid").val();
  NonRasCandidate.fullname = $("#Name")
    .val()
    .toLowerCase()
    .replace(/\b\w/g, function (c) {
      return c.toUpperCase();
    }); //value insert dari id pada input
  NonRasCandidate.position = $("#position").val().join(", ");
  NonRasCandidate.skillset = $("#skillset").val().join(", ");
  NonRasCandidate.education = $("#degree").val();
  NonRasCandidate.ipk = $("#ipk").val();
  NonRasCandidate.university = $("#UniversityName").val();
  NonRasCandidate.domisili = $("#domicile").val();
  NonRasCandidate.birthdate = $("#age1").val();
  NonRasCandidate.level = $("#level").val();
  NonRasCandidate.experienceInYear = experience;
  NonRasCandidate.filteringBy = $("#filteringby").val();
  NonRasCandidate.workStatus = workstatus;
  NonRasCandidate.noticePeriode = $("#notice").val();
  NonRasCandidate.financialIndustry = financial;
  NonRasCandidate.rawCv = $("#rawcv").val();
  NonRasCandidate.cvBerca = $("#bercacv").val();
  NonRasCandidate.englishLevel = $("#english").val();
  NonRasCandidate.currentSalary = $("#current").val();
  NonRasCandidate.expectedSalary = $("#expected").val();
  NonRasCandidate.negotiable = $('input[name="nego"]:checked').val();
  NonRasCandidate.techTest = "";
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

  console.log(NonRasCandidate);
  // This arrangement can be altered based on how we want the date's format to appear.
  let currentDate = `${day}-${month}-${year}`;

  NonRasCandidate.lastModified = formatDate(Date());

  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/Shortlist/Add",
    data: JSON.stringify(NonRasCandidate),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    //
    const logMesagge = `Has Added Shortlist Candidate ${NonRasCandidate.fullname}`;
    SaveLogUpdate(logMesagge);
    if (result.status == 200) {
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#Modal").modal("hide");
      table.ajax.reload();
      ClearScreenSave();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data failed to added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#Modal").modal("hide");
      table.ajax.reload();
    }
  });
  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
}

function Update() {
  var isValid = true;

  $("input[required],select[required]").each(function () {
    var input = $(this);
    if (!input.val()) {
      console.log(input.attr("name") + " kosong");
      console.log(input.attr("id") + " kosong");
      console.log(input + " kosong");
      input.next(".error-message").show();
      isValid = false;
    } else {
      input.next(".error-message").hide();
    }
    // Memeriksa format IPK jika input adalah elemen dengan ID 'ipk'
    if (input.attr("id") === "ipk2") {
      var ipk = input.val().trim();
      var validIPK = /^(?:[0-3](?:\.[0-9]{1,2})?|4(?:\.00?)?)$/;

      if (!validIPK.test(ipk)) {
        $(".error-format-ipk-update").show(); // Menampilkan pesan error format IPK
        isValid = false;
      } else {
        $(".error-format-ipk-update").hide(); // Menyembunyikan pesan error format IPK
      }
    }
  });

  var workstatus = $("#workstatus2").is(":checked");
  var financial = $("#financial2").is(":checked");
  if (!workstatus) {
    workstatus = false;
  }
  if (!financial) {
    financial = false;
  }
  workstatus = workstatus.toString();
  financial = financial.toString();

  // if (!$("#experience_year2").val()) {
  //     $("#experience_error2").show();
  //     isValid = false;
  // }

  if (
    $("#experience_month2").val() == null ||
    $("#experience_month2").val() == ""
  ) {
    var experience = $("#experience_year2").val();
  } else {
    var experience =
      $("#experience_year2").val() + ", " + $("#experience_month2").val();
  }

  var NonRasCandidate = new Object(); //object baru
  NonRasCandidate.nonRasId = $("#nonrasid2").val();

  NonRasCandidate.fullname = $("#Name2").val(); //value insert dari id pada input
  NonRasCandidate.position = $("#position2").val().join(", ");
  NonRasCandidate.skillset = $("#skillset2").val().join(", ");
  NonRasCandidate.education = $("#degree2").val();
  NonRasCandidate.ipk = $("#ipk2").val();
  NonRasCandidate.university = $("#UniversityName2").val();
  NonRasCandidate.domisili = $("#domicile2").val();
  NonRasCandidate.birthdate = $("#age").val();
  NonRasCandidate.level = $("#level2").val();
  // NonRasCandidate.experienceInYear = $("#experience").val();
  NonRasCandidate.experienceInYear = experience;
  NonRasCandidate.filteringBy = $("#filteringby2").val();
  NonRasCandidate.workStatus = workstatus;
  NonRasCandidate.noticePeriode = $("#notice2").val();
  NonRasCandidate.financialIndustry = financial;
  NonRasCandidate.rawCv = $("#rawcv2").val();
  NonRasCandidate.cvBerca = $("#bercacv2").val();
  NonRasCandidate.englishLevel = $("#english2").val();
  NonRasCandidate.currentSalary = $("#current2").val();
  NonRasCandidate.expectedSalary = $("#expected2").val();
  NonRasCandidate.negotiable = $('input[name="nego2"]:checked').val();
  NonRasCandidate.intwByRas = $("#intwByRAS").val();

  //New User
  var nameUser = $("#nameUser").val();
  var intwUser = $("#intwUser").val();
  var dateIntwUser = $("#dateIntwUser").val();
  var nameUserHidden = $("#nameUserhidden").val();
  var intwUser2 = $("#intwUser2").val();
  var dateIntwUser2 = $("#dateIntwUser2").val();
  var intwUserHidden = $("#intwuserHiden").val();
  var dateIntwUserHidden = $("#dateintwuserHiden").val();

  var newNameUser = $("#nameUser2").val();
  if (newNameUser === "" || newNameUser === null) {
    newNameUser = null;
  }
  var newIntwUser = $("#displayUserItw").val();
  var newDateIntwUser = $("#dateIntwUserr").val();

  if ($("#displayUserItw").is(":visible")) {
    if ($("#displayUserItw").val() === null) {
      $(".error-message-update").css("display", "block");
      return false; // Field tidak valid
    }
  }

  if ($("#dateIntwUserr").is(":visible")) {
    if ($("#dateIntwUserr").val() === "") {
      $(".error-message-update").css("display", "block");
      return false; // Field tidak valid
    }
  }
  if ($("#nameUser2").is(":visible")) {
    if ($("#dateIntwUserr").val() === "") {
      $(".error-message-update").css("display", "block");
      return false; // Field tidak valid
    }
  }
  if (!isValid) {
    return;
  }

  if (
    nameUser !== null &&
    nameUserHidden == "" &&
    intwUser !== "" &&
    dateIntwUser !== "" &&
    intwUser2 == null &&
    dateIntwUser2 == "" &&
    intwUserHidden == "" &&
    dateIntwUserHidden == "" &&
    newNameUser == null &&
    newIntwUser == null &&
    newDateIntwUser == ""
  ) {
    var nameUser_ = nameUser;
    var intwUser_ = intwUser;
    var dateIntwUser_ = dateIntwUser;
    console.log("AA");
  } else if (
    nameUser !== null &&
    nameUserHidden == "" &&
    intwUser !== null &&
    dateIntwUser !== "" &&
    intwUser2 !== null &&
    dateIntwUser2 !== "" &&
    intwUserHidden == "" &&
    dateIntwUserHidden == "" &&
    newNameUser == null &&
    newIntwUser == null &&
    newDateIntwUser == ""
  ) {
    var nameUser_ = nameUser + "<br/>" + nameUser;
    var intwUser_ = intwUser + "<br/>" + intwUser2;
    var dateIntwUser_ = dateIntwUser + "<br/>" + dateIntwUser2;
    console.log("BB");
  } else if (
    nameUser !== null &&
    nameUserHidden !== "" &&
    intwUser !== null &&
    dateIntwUser !== "" &&
    intwUser2 !== null &&
    dateIntwUser2 !== "" &&
    intwUserHidden !== "" &&
    dateIntwUserHidden !== "" &&
    newNameUser == null &&
    newIntwUser == null &&
    newDateIntwUser == ""
  ) {
    var nameUser_ = nameUserHidden + nameUser + "<br/>" + nameUser;
    var intwUser_ = intwUserHidden + intwUser + "<br/>" + intwUser2;
    var dateIntwUser_ =
      dateIntwUserHidden + dateIntwUser + "<br/>" + dateIntwUser2;
    console.log("CC");
  } else if (
    nameUser !== null &&
    nameUserHidden !== "" &&
    intwUser !== null &&
    dateIntwUser !== "" &&
    intwUser2 == null &&
    dateIntwUser2 == "" &&
    intwUserHidden !== "" &&
    dateIntwUserHidden !== "" &&
    newNameUser !== null &&
    newIntwUser !== null &&
    newDateIntwUser !== ""
  ) {
    var nameUser_ = nameUserHidden + nameUser + "<br/>" + newNameUser;
    var intwUser_ = intwUserHidden + intwUser + "<br/>" + newIntwUser;
    var dateIntwUser_ =
      dateIntwUserHidden +
      dateIntwUser +
      "<br/>" +
      dateIntwUser2 +
      "<br/>" +
      newDateIntwUser;
    console.log("DD");
  } else if (
    nameUser !== null &&
    nameUserHidden == "" &&
    intwUser !== null &&
    dateIntwUser !== "" &&
    intwUser2 == null &&
    dateIntwUser2 == "" &&
    intwUserHidden == "" &&
    dateIntwUserHidden == "" &&
    newNameUser !== null &&
    newIntwUser !== null &&
    newDateIntwUser !== ""
  ) {
    var nameUser_ = nameUser + "<br/>" + newNameUser;
    var intwUser_ = intwUser + "<br/>" + newIntwUser;
    var dateIntwUser_ = dateIntwUser + "<br/>" + newDateIntwUser;
    console.log("EE");
  } else if (
    nameUser !== null &&
    nameUserHidden !== "" &&
    intwUser !== null &&
    dateIntwUser !== "" &&
    intwUser2 == null &&
    dateIntwUser2 == "" &&
    intwUserHidden !== "" &&
    dateIntwUserHidden !== "" &&
    newNameUser == null &&
    newIntwUser == null &&
    newDateIntwUser == ""
  ) {
    var nameUser_ = nameUserHidden + nameUser;
    var intwUser_ = intwUserHidden + intwUser;
    var dateIntwUser_ = dateIntwUserHidden + dateIntwUser;
    console.log("FF");
  } else if (
    nameUser == null &&
    nameUserHidden == "" &&
    intwUser == null &&
    dateIntwUser == "" &&
    intwUser2 == null &&
    dateIntwUser2 == "" &&
    intwUserHidden == "" &&
    dateIntwUserHidden == "" &&
    newNameUser == null &&
    newIntwUser == null &&
    newDateIntwUser == ""
  ) {
  } else {
    Swal.fire({
      icon: "warning",
      title: "Data failed to added!",
      text: "There is a client data that has been deleted, or data input error",
      showConfirmButtom: true,
    });
    return;
  }

  NonRasCandidate.techTest = $("#techTest").val();
  NonRasCandidate.intwDateByRas = $("#dateIntwRAS").val();
  NonRasCandidate.intwUser = intwUser_;
  NonRasCandidate.nameOfUser = nameUser_;
  NonRasCandidate.intwDateUser = dateIntwUser_;
  NonRasCandidate.levelRekom = $("#levelRekom").val();
  NonRasCandidate.status = $("#statusOffering").val();
  NonRasCandidate.notes = $("#notes").val();
  NonRasCandidate.lastModified = formatDate(Date());

  $.ajax({
    type: "PUT",
    url: "https://localhost:7177/api/Shortlist",
    data: JSON.stringify(NonRasCandidate),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    //
    if (result.status == 200) {
      const logMessage = `Has been Updated Candidate data, Id ${NonRasCandidate.nonRasId}, name ${NonRasCandidate.fullname}`;
      SaveLogUpdate(logMessage);
      Swal.fire({
        icon: "success",
        title: "Success...",
        text: "Data has been Update!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#offeringSourceList").modal("hide");
      table.ajax.reload();
      ClearScreenUpt();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data failed to update!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#Modal").modal("hide");
      table.ajax.reload();
    }
  });

  function formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }
}

function formatCurrency(input) {
  // Menghapus semua karakter selain angka
  var value = input.value.replace(/\D/g, "");
  // Menambahkan titik setelah tiga angka dari belakang
  var formattedValue = "Rp " + value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  input.value = formattedValue;
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
  let maxVisibleCategories = 6;
  categories.unshift("All"); // Menambahkan opsi "All" ke dalam array categories

  // Mendeteksi lebar layar saat halaman dimuat
  const screenWidth = window.innerWidth || document.documentElement.clientWidth;

  // Ubah jumlah maksimum kategori yang ditampilkan berdasarkan lebar layar
  if (screenWidth <= 1024) {
    maxVisibleCategories = 5;
  }
  if (screenWidth < 850) {
    maxVisibleCategories = 4;
  }
  if (screenWidth < 750) {
    maxVisibleCategories = 3;
  }
  if (screenWidth <= 500) {
    maxVisibleCategories = 1;
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

    if (screenWidth < 750) {
        maxVisibleCategories = 3;
    }
    if (screenWidth <= 500) {
        maxVisibleCategories = 1;
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
        link.textContent = categories[i];

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
      Src(selectedCategory);
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
        dropdownItem.textContent = category;

        dropdownItem.addEventListener("click", function (e) {
            e.preventDefault();
            const selectedCategory = this.textContent;
            console.log("Selected category:", selectedCategory);

            Src(selectedCategory);
        });

        dropdownMenu.appendChild(dropdownItem);

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

function newOfferingFields() {
  document.getElementById("displayDateIntwUser2").style.display = "block";
  document.getElementById("displayIntwUser2").style.display = "block";
  document.getElementById("offer").style.display = "none";
}

function newProses2() {
  document.getElementById("displayIntwUser3").style.display = "block";
  document.getElementById("displayDateIntwUser3").style.display = "block";
}

function newClientFields() {
  document.getElementById("displayUserLabel").style.display = "block";
  document.getElementById("nameUser2").style.display = "block";
  document.getElementById("displayUserItw").style.display = "block";
  document.getElementById("displayFormOffer").style.display = "block";
  //document.getElementById('status').style.display = "none";
  $("#status").prop("disabled", true);
  $("#intwUser").prop("disabled", true);
  $("#nameUser").prop("disabled", true);
  $("#dateIntwUser").prop("disabled", true);

  getClientList2();

  document.getElementById("offer").style.display = "none";
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
