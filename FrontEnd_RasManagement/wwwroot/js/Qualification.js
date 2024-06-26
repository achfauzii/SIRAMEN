//File qualification ini digunakan dalam menghandle View, Add, Update Delte Qualification Employee
//Untuk File Cshtml nya Employee -> Qualification, kemudian controller fe EmployeeController -> Qualification
//Menggunakan select2 multiple input output kedatabasenya dalam bentuk array
var initialQualification = {};
$(document).ready(function () {
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;

//Ajax untuk menangani view data qualification
//Terdapat kondisi jika data qualification masih kosong button add akan ditampilkan
//Tetapi ketika data qualification not null button add di hide, dan hanya button edit yang ada
  $.ajax({
    url:
      "https://localhost:7177/api/Qualification/accountId?accountId=" + accid,
    type: "GET",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (response) {
      //debugger;
        if (response.status === 200) {
        
        //Memanggil function untuk mendisplay data qualification memiliki parameter data dari qualification employee
        displayQualification(response.data);

        //Jika respon data kosong maka tampilkan button add
        if (response.data == "") {
          var element = document.getElementById("buttonAdd");
          element.style.display = "block"; // Menampilkan elemen

          var buttonFramework = document.getElementById("buttonFramework");
          var buttonProgramming = document.getElementById("buttonProgramming");
          var buttonDatabase = document.getElementById("buttonDatabase");
          var buttonTools = document.getElementById("buttonTools");
          var buttonOthers = document.getElementById("buttonOthers");

          buttonOthers.style.display = "none";
          buttonProgramming.style.display = "none";
          buttonDatabase.style.display = "none";
          buttonTools.style.display = "none";
          buttonFramework.style.display = "none";
        }
      } else {
        console.error("Error fetching data from API:", response.message);
      }
    },
    error: function (error) {
      console.error("Error fetching data from API:", error);
    },
  });
  $(".frameworkOptions").select2();
});


//Function berikut untuk menangani display data qualification
//Menerima parameter data berisi data qualificatin 
function displayQualification(data) {
  var frameworks = data.map((item) => item.framework).join(", ");
  $("#framework").text(frameworks);
  var programmingLanguages = data
    .map((item) => item.programmingLanguage)
    .join(", ");
  $("#programming").text(programmingLanguages);
  var databases = data.map((item) => item.database).join(", ");
  $("#databases").text(databases);
  var tools = data.map((item) => item.tools).join(", ");
  $("#tools").text(tools);
  var others = data.map((item) => item.others).join(", ");
  $("#others").text(others);
}

// Clear form add qualification
function ClearScreen() {
  $("#framework_").val(null).trigger("change"); // Kosongkan pilihan select
  $("#customFramework").val(""); // Kosongkan input teks
  $("#programmingLanguage_").val(""); // Kosongkan input teks
  $("#qualDatabase").val(""); // Kosongkan input teks
  $("#tools_").val(""); // Kosongkan input teks
  $("#others_").val(""); // Kosongkan input teks
  $(".frameworkOptions").closest(".form-group").find(".error-message").hide();

  $("input[required_add]").each(function () {
    var input = $(this);
    input.next(".error-message").hide();
  });
}
//Clear screen form edit qualification
function ClearScreenUpdate() {
  $("#frameworkUpdate").val(null).trigger("change"); // Kosongkan pilihan select
  $("#programmingLanguageUpdate").val(""); // Kosongkan input teks

  $("#databaseUpdate").val(""); // Kosongkan input teks
  $("#toolsUpdate").val(""); // Kosongkan input teks
  $("#othersUpdate").val(""); // Kosongkan input teks
  $("#frameworkShow .error-message").hide();
  $("#programmingShow .error-message").hide();
  $("#databaseShow .error-message").hide();
  $("#toolsShow .error-message").hide();
  $(".frameworkOptions").closest(".form-group").find(".error-message").hide();

  $("input[required_add]").each(function () {
    var input = $(this);
    input.next(".error-message").hide();
  });
}

//Function untuk menghandle save pada add new qualification
function Save() {
  // Validasi select options
  var selectedFrameworks = $("#framework_").val();
  var selectedProgramming = $("#programmingLanguage_").val();
  var selectedDatabase = $("#qualDatabase").val();

  var qualifications = new Object(); //bikin objek baru

  qualifications.framework = $("#framework_").val().join(", ");

  qualifications.programmingLanguage = $("#programmingLanguage_")
    .val()
    .join(", ");
  qualifications.database = $("#qualDatabase").val().join(", ");
  qualifications.tools = $("#tools_").val().join(", ");
  qualifications.others = $("#others_").val();

  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  qualifications.accountId = accid;
  $.ajax({
    type: "POST",
    url: "https://localhost:7177/api/Qualification",
    data: JSON.stringify(qualifications), //ngirim data ke api
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    //debugger;
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
      $("#modalAdd").modal("hide");
      location.reload();
    } else {
      Swal.fire({
        icon: "warning",
        title: "Data failed to added!",
        showConfirmButtom: false,
        timer: 1500,
      });
      $("#modalAdd").modal("hide");
      location.reload();
    }
  });
}

//Function ini berjalan ketika employee klik button edit pada framework
//Kemudian akan menampilkan form field dan data Framework dan hide selain framework
function updateFramework() {
  getbyID();

  var frameworkInput = document.getElementById("frameworkShow");
  var programmingInput = document.getElementById("programmingShow");
  var databaseInput = document.getElementById("databaseShow");
  var toolsInput = document.getElementById("toolsShow");
  var othersInput = document.getElementById("othersShow");
  frameworkInput.style.display = "block";
  programmingInput.style.display = "none";
  databaseInput.style.display = "none";
  toolsInput.style.display = "none";
  othersInput.style.display = "none";
}

//Function ini berjalan ketika employee klik button edit pada Programming Language
//Kemudian akan menampilkan form field dan data Programming Language dan hide selain Programming Language
function updateProgramming() {
  getbyID();
  var frameworkInput = document.getElementById("frameworkShow");
  var programmingInput = document.getElementById("programmingShow");
  var databaseInput = document.getElementById("databaseShow");
  var toolsInput = document.getElementById("toolsShow");
  var othersInput = document.getElementById("othersShow");
  frameworkInput.style.display = "none";
  programmingInput.style.display = "block";
  databaseInput.style.display = "none";
  toolsInput.style.display = "none";
  othersInput.style.display = "none";
}
//Function ini berjalan ketika employee klik button edit pada bagian Database
//Kemudian akan menampilkan form field dan data Database dan hide selain Database
function updateDatabase() {
  getbyID();
  var frameworkInput = document.getElementById("frameworkShow");
  var programmingInput = document.getElementById("programmingShow");
  var databaseInput = document.getElementById("databaseShow");
  var toolsInput = document.getElementById("toolsShow");
  var othersInput = document.getElementById("othersShow");
  frameworkInput.style.display = "none";
  programmingInput.style.display = "none";
  databaseInput.style.display = "block";
  toolsInput.style.display = "none";
  othersInput.style.display = "none";
}
//Function ini berjalan ketika employee klik button edit pada bagian Tools
//Kemudian akan menampilkan form field dan data Tools dan hide selain Database
function updateTools() {
  getbyID();
  var frameworkInput = document.getElementById("frameworkShow");
  var programmingInput = document.getElementById("programmingShow");
  var databaseInput = document.getElementById("databaseShow");
  var toolsInput = document.getElementById("toolsShow");
  var othersInput = document.getElementById("othersShow");
  frameworkInput.style.display = "none";
  programmingInput.style.display = "none";
  databaseInput.style.display = "none";
  toolsInput.style.display = "block";
  othersInput.style.display = "none";
}
//Function ini berjalan ketika employee klik button edit pada bagian Others Qualification Employee
//Kemudian akan menampilkan form field dan data Others dan hide selain Others Qualification Employee
function updateOthers() {
  getbyID();
  var frameworkInput = document.getElementById("frameworkShow");
  var programmingInput = document.getElementById("programmingShow");
  var databaseInput = document.getElementById("databaseShow");
  var toolsInput = document.getElementById("toolsShow");
  var othersInput = document.getElementById("othersShow");
  frameworkInput.style.display = "none";
  programmingInput.style.display = "none";
  databaseInput.style.display = "none";
  toolsInput.style.display = "none";
  othersInput.style.display = "block";
}

//Function ini untuk mendapatkan data qualification berdasarkan account id employee
//Lalu menampillkan value pada form edit qualification
//Terdapat beberapa format untuk menampilkannya dalam bentuk multiple select2
function getbyID() {
  //debugger;

  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  $.ajax({
    url:
      "https://localhost:7177/api/Qualification/accountId?accountId=" + accid,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      //debugger;
        var obj = result.data[0]; //data yg dapet dr id
        initialQualification = {
            QualificationId: obj.qualificationId,
            Framework: obj.framework,
            ProgrammingLanguage: obj.programmingLanguage,
            Database: obj.database,
            Tools: obj.tools,
            Others: obj.others,
        };
      $("#accountId").val(accid);
      $("#qualificationId").val(obj.qualificationId);
      // Memecah string menjadi array dan mengisi nilai ke dalam Select2
      const selectedOptionsFramework = obj.framework;
      const selectedOptionsProgramming = obj.programmingLanguage;
      const selectedOptionsDatabase = obj.database;
      const selectedOptionsTools = obj.tools;
      const othersObj = obj.others;

      const frameworkSelect = $("#frameworkUpdate");

      const programmingLanguageSelect = $("#programmingLanguageUpdate");
      const databaseSelect = $("#databaseUpdate");
      const toolsSelect = $("#toolsUpdate");
      const othersInput = $("#othersUpdate");

      // Setiap nilai yang perlu diisi dalam Select2 diperlakukan sebagai array
      const selectedFrameworkArray = selectedOptionsFramework.split(", ");
      const selectedProgrammingArray = selectedOptionsProgramming.split(", ");
      const selectedDatabaseArray = selectedOptionsDatabase.split(", ");
      const selectedToolsArray = selectedOptionsTools.split(", ");

      // Set the value, creating a new option if necessary
      selectedFrameworkArray.forEach((value) => {
        const optionNotExists =
          frameworkSelect.find("option[value='" + value + "']").length === 0;

        if (optionNotExists) {
          const newOption = new Option(value, value, true, true);
          frameworkSelect.append(newOption).trigger("change");
        }
      });

      // Set value to selectedFrameworkArray
      frameworkSelect.val(selectedFrameworkArray).trigger("change");

      selectedProgrammingArray.forEach((value) => {
        const optionNotExists =
          programmingLanguageSelect.find("option[value='" + value + "']")
            .length === 0;

        if (optionNotExists) {
          const newOption = new Option(value, value, true, true);
          programmingLanguageSelect.append(newOption).trigger("change");
        }
      });

      // Set value to selectedFrameworkArray
      programmingLanguageSelect.val(selectedProgrammingArray).trigger("change");

      selectedDatabaseArray.forEach((value) => {
        const optionNotExists =
          databaseSelect.find("option[value='" + value + "']").length === 0;

        if (optionNotExists) {
          const newOption = new Option(value, value, true, true);
          databaseSelect.append(newOption).trigger("change");
        }
      });

      // Set value to selectedFrameworkArray
      databaseSelect.val(selectedDatabaseArray).trigger("change");

      selectedToolsArray.forEach((value) => {
        const optionNotExists =
          toolsSelect.find("option[value='" + value + "']").length === 0;

        if (optionNotExists) {
          const newOption = new Option(value, value, true, true);
          toolsSelect.append(newOption).trigger("change");
        }
      });

      // Set value to selectedFrameworkArray
      toolsSelect.val(selectedToolsArray).trigger("change");

      // Menginisialisasi Select2 dengan opsi tag
      frameworkSelect.select2({
        tags: true,

        createTag: function (params) {
          return {
            id: params.term,
            text: params.term,
            newTag: true,
          };
        },
      });

      programmingLanguageSelect.select2({
        tags: true,
        createTag: function (params) {
          return {
            id: params.term,
            text: params.term,
            newTag: true,
          };
        },
      });

      databaseSelect.select2({
        tags: true,
        createTag: function (params) {
          return {
            id: params.term,
            text: params.term,
            newTag: true,
          };
        },
      });

      toolsSelect.select2({
        tags: true,
        createTag: function (params) {
          return {
            id: params.term,
            text: params.term,
            newTag: true,
          };
        },
      });

      othersInput.val(othersObj);
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

//Function update ini berjalan saat employee klik tombol save update untuk menyimpan perubahan Qualification
function Update() {
  //debugger;
  var isValid = true;
  // Validasi apakah field frameworkUpdate memiliki nilai yang dipilih

  var qualifications = new Object(); //bikin objek baru
  qualifications.accountId = $("#accountId").val();

  qualifications.qualificationId = $("#qualificationId").val();
  qualifications.framework = $("#frameworkUpdate").val().join(", ");

  qualifications.programmingLanguage = $("#programmingLanguageUpdate")
    .val()
    .join(", ");
  qualifications.database = $("#databaseUpdate").val().join(", ");
  qualifications.tools = $("#toolsUpdate").val().join(", ");
  qualifications.others = $("#othersUpdate").val();


    // Compare values with initialQualification
    if (
        qualifications.framework== initialQualification.Framework &&
        qualifications.programmingLanguage == initialQualification.ProgrammingLanguage &&
        qualifications.database== initialQualification.Database &&
        qualifications.tools == initialQualification.Tools &&
        qualifications.others === initialQualification.Others
    ) {
        // No changes, show SweetAlert alert
        Swal.fire({
            icon: "info",
            title: "No Changes Detected",
            text: "No data has been modified.",
            showConfirmButton: false,
            timer: 2000,
        });
        $("#modalFramework").modal("hide");
        return;        
    }


  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  //console.log(qualifications);
  $.ajax({
    url: "https://localhost:7177/api/Qualification",
    type: "PUT",
    data: JSON.stringify(qualifications),
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
  }).then((result) => {
    $("#modalFramework").modal("hide");
    if (result.status == 200) {
      Swal.fire({
        title: "Success!",
        text: "Data has been update!",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        location.reload();
      });
    } else {
      Swal.fire("Error!", "Data failed to update", "error");
      location.reload();
    }
  });
}

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
