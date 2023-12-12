let validName = true;
let validNickName = true;
let validBirthPlace = true;
$("#employeeAnnouncement").hide();

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

      document.getElementById("birthday").innerHTML =
        text.substr(0, text.length - 2) + ".";
    } else if (result.status == 404) {
      document.getElementById("birthday").innerHTML = "";
      $("#employeeAnnouncement").hide();
    }
  });

  // Mendapatkan nilai parameter accountId dari URL
  loadDataA();
  $("#editDetailsBtn").on("click", function () {
    loadDataA(); // Reload the data before opening the modal
    $("#myModal").modal("show"); // Show the modal after loading the data
  });

  const selectReligion = $("#editReligion");
  $(selectReligion).select2({
    placeholder: "Select a religion",
    width: "100%",
    allowClear: true,
    tags: true,
  });

  $("#editName, #editNickName, #editBirthPlace").on("keyup", function () {
    var value = $(this).val();
    var maxLength = 50; // Default max length
    var errorMessage = "";

    if ($(this).is("#editName")) {
      maxLength = 50;
      errorMessage = "Fullname should not exceed 50 characters";
    } else if ($(this).is("#editNickName")) {
      maxLength = 20;
      errorMessage = "Nickname should not exceed 20 characters";
    } else if ($(this).is("#editBirthPlace")) {
      maxLength = 50;
      errorMessage = "Birthplace should not exceed 50 characters";
    }

    var isValidCharacter = true;

    // Validasi karakter hanya jika bidang tidak kosong
    if (value.trim() !== "") {
      isValidCharacter = /^[A-Za-z'-\s]+$/.test(value);

      if (!isValidCharacter) {
        $(this)
          .next(".error-message")
          .text("The field can only use letters.")
          .show();
        if ($(this).is("#editName")) {
          validName = false;
        } else if ($(this).is("#editNickName")) {
          validNickName = false;
        } else if ($(this).is("#editBirthPlace")) {
          validBirthPlace = false;
        }
      } else {
        if ($(this).is("#editName")) {
          validName = true;
        } else if ($(this).is("#editNickName")) {
          validNickName = true;
        } else if ($(this).is("#editBirthPlace")) {
          validBirthPlace = true;
        }
      }
    }

    if (value.length > maxLength) {
      $(this).next(".error-message").text(errorMessage).show();
    } else if (isValidCharacter || value.trim() === "") {
      $(this).next(".error-message").hide();
    }
  });
});

function toPascalCase(str) {
  return str.replace(/(\w)(\w*)/g, function (_, firstChar, rest) {
    return firstChar.toUpperCase() + rest.toLowerCase();
  });
}

function loadDataA() {
  $("#loader").show();
  const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
  const accid = decodedtoken.AccountId;
  var imgElement = $("#employeePhoto");
  $.ajax({
    url: "https://localhost:7177/api/Employees/accountId?accountId=" + accid,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data.result; // Data yang diterima dari API
      var birthDate = obj.birthdate;
      const date = new Date(birthDate);
      const options = { day: "numeric", month: "long", year: "numeric" };
      const date_ = date.toLocaleDateString("id-ID", options);

      $("#nameFull").text(obj.fullname);
      $("#nik").text("NIK : " + (obj.nik == null ? "-" : obj.nik));
      $("#nickName").text(
        obj.nickname == null ? obj.nickname : toPascalCase(obj.nickname)
      );
      $("#birthPlace").text(
        obj.birthplace == null
          ? obj.birthplace
          : toPascalCase(obj.birthplace) + ", "
      );

      $("#birthDate").text(birthDate ? date_ : "");
      // Set birth date input value
      if (obj.birthdate) {
        $("#editBirthDate").val(obj.birthdate.substring(0, 10));
      } else {
        $("#editBirthDate").val("");
      }

      $("#gender").text(obj.gender);
      $("#religion").text(obj.religion);
      $("#martialStatus").text(obj.maritalstatus);
      $("#nationality").text(obj.nationality);
      $("#address").text(obj.address);

      // Set employee photo
      if (obj.image != null) {
        imgElement.attr("src", obj.image);
        imgElement.attr("alt", obj.fullname + "'s photo");
      } else {
        imgElement.attr("src", "/assets/photo/Default.png");
        imgElement.attr("alt", "");
      }

      // Populate the form fields in the modal with the retrieved data
      $("#accountId").val(obj.accountId);
      $("#editName").val(obj.fullname);
      $("#editNickName").val(obj.nickname);
      $("#editBirthPlace").val(obj.birthplace);
      $("#editGender").val(obj.gender);
      $("#editReligion").val(obj.religion);
      $("#editMartialStatus").val(obj.maritalstatus);
      $("#editNationality").val(obj.nationality);
      $("#editAddress").val(obj.address);

      if (obj.isChangePassword == 0) {
        $("#passwordAnnounce").show();
      } else {
        $("#passwordAnnounce").hide();
      }
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
  $("#loader").hide();
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

function noHTML(input) {
  var value = input.value.replace(/<[^>]*>/g, "");
  var nohtml = value.replace(/[<>?]/g, "");
  input.value = nohtml;
}

function handleInput(event, input) {
  // Menangani peristiwa oninput dan onpaste
  noHTML(input);
}

function clearMessage() {
  $(".error-message").hide();
}

function ClearScreen() {
  alert("coba");
  $("#accountId").val("");
  $("#editName").val("");
  $("#editNickName").val("");
  $("#editBirthPlace").val("");
  $("#editBirthDate").val("");
  $("#editGender").val("");
  $("#editReligion").selectedindex = "0";
  $("#editMartialStatus").selectedindex = "0";
  $("#editNationality").selectedindex = "0";
  $("#editAddress").val("");
  $("input[required]").each(function () {
    var input = $(this);
    input.next(".error-message").hide();
  });
  $("select[required]").each(function () {
    var input = $(this);
    input.next(".error-message").hide();
  });
}

function GetById(accountId) {
  $.ajax({
    url:
      "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
    type: "GET",
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      var obj = result.data.result;

      $("#accountId").val(obj.accountId);
      $("#editName").val(obj.fullname);
      $("#editNickName").val(obj.nickname);
      $("#editBirthPlace").val(obj.birthplace);
      $("#editBirthDate").val(obj.birthdate.substring(0, 10)); // Set birth date input value
      $("#editGender").val(obj.gender);
      $("#editReligion").val(obj.religion);
      $("#editMartialStatus").val(obj.maritalstatus);
      $("#editNationality").val(obj.nationality);
      $("#editAddress").val(obj.address);

      // Set the image input value
      var imageInput = document.getElementById("imageFile");
      if (obj.image != null) {
        imageInput.value = ""; // Clear the file input
        $("#imagePath").val(obj.image); // Set image path value

        // Set the image preview using the image path
        $("#imagePreview").attr("src", obj.image);
        $("#imagePreview").css("display", "block"); // Show the image preview
      } else {
        imageInput.value = "";
        $("#imagePath").val(""); // Clear image path value
        $("#imagePreview").attr("src", ""); // Clear image preview source
        $("#imagePreview").css("display", "none"); // Hide the image previewy
      }

      $("#Modal").modal("show");
      /$('#Update').show();/;
      $("#Update").prop("disabled", false); // Enable the Update button
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}
function clear() {
  $(".error-message").hide();
}
function updateData() {
  var accountId = $("#accountId").val();
  var isValid = true;

  $("input[required]").each(function () {
    var input = $(this);
    if (!input.val()) {
      input.next(".error-message").text("This field is required!").show();
      isValid = false;
    } else {
      input.next(".error-message").hide();
    }
  });

  console.log(validName + " " + validNickName + " " + validBirthPlace);

  if (!validName) {
    $("#editName")
      .next(".error-message")
      .text("The field can only use letters.")
      .show();
    $("#editName").focus();
    return;
  }

  if (!validNickName) {
    $("#editNickName")
      .next(".error-message")
      .text("The field can only use letters.")
      .show();
    $("#editNickName").focus();
    return;
  }

  if (!validBirthPlace) {
    $("#editBirthPlace")
      .next(".error-message")
      .text("The field can only use letters.")
      .show();
    $("#editBirthPlace").focus();
    return;
  }

  if (!isValid) {
    return;
  }

  if (!validateImage()) {
    return;
  }
  uploadImage(accountId);

  var imagePath;
  if ($("#imageFile").val() == "") {
    imagePath = null;
  } else {
    imagePath = `/assets/photo/photo-${accountId}.jpg`; // Path lengkap ke foto
  }
  console.log(imagePath);

  var formData = {
    AccountId: $("#accountId").val(),
    Fullname: $("#editName").val(),
    Nickname: $("#editNickName").val(),
    Birthplace: $("#editBirthPlace").val(),

    // Set birth date to yyyy-mm-dd format
    Birthdate: $("#editBirthDate").val(),

    Gender: $("#editGender").val(),
    Religion: $("#editReligion").val(),
    MaritalStatus: $("#editMartialStatus").val(),
    Nationality: $("#editNationality").val(),
    Address: $("#editAddress").val(),
    Image: imagePath,
  };

  $.ajax({
    url: `https://localhost:7177/api/Employees/${formData.AccountId}`,
    type: "PUT",
    data: JSON.stringify(formData),
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (result) {
      if (result.status == 200) {
        Swal.fire({
          icon: "success",
          title: "Success...",
          text: "Data Berhasil Diperbaharui!",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          $("#myModal").modal("hide");
          location.reload();
        });
      } else {
        alert("Data gagal Diperbaharui");
      }
    },
    error: function (errormessage) {
      alert(errormessage.responseText);
    },
  });
}

function validateFormData() {
  var fullname = $("#editName").val();
  var nickname = $("#editNickName").val();
  var birthplace = $("#editBirthPlace").val();
  var birthdate = $("#editBirthDate").val();
  var gender = $("#editGender").val();
  var religion = $("#editReligion").val();
  var martialStatus = $("#editMartialStatus").val();
  var nationality = $("#editNationality").val();
  var address = $("#editAddress").val();

  if (
    fullname === "" ||
    nickname === "" ||
    birthplace === "" ||
    birthdate === "" ||
    gender === "" ||
    religion === "" ||
    martialStatus === "" ||
    nationality === "" ||
    address === ""
  ) {
    Swal.fire({
      icon: "error",
      title: "Error...",
      text: "Data tidak boleh kosong",
    });
    return false;
  }

  return true;
}

function previewImage(event) {
  var imageInput = event.target;
  var imageLabel = document.getElementById("imageLabel");
  var imagePreview = document.getElementById("imagePreview");

  if (imageInput.files && imageInput.files[0]) {
    var reader = new FileReader();

    reader.onload = function (e) {
      imagePreview.src = e.target.result;
      imagePreview.style.display = "block";
    };

    reader.readAsDataURL(imageInput.files[0]);

    // Update the label text to the selected file's name
    imageLabel.innerText = imageInput.files[0].name;
  }
}

function uploadImage(accountId) {
  var imageFile = $("#imageFile")[0].files[0];

  // Cek apakah ada file yang diunggah sebelum mengirimkan data ke server
  if (imageFile) {
    var formData = new FormData();
    var fileName = `photo-${accountId}.jpg`;
    formData.append("imageFile", imageFile, fileName);

    $.ajax({
      url: "/Employee/UploadImage",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (response) {
        console.log(response);
        if (response.success) {
          $("#uploadMessage").text(response.message);
        } else {
          $("#uploadMessage").text("Upload failed: " + response.message);
        }
      },
      error: function (xhr, status, error) {
        $("#uploadMessage").text(
          "An error occurred while uploading the image."
        );
        console.log(error);
      },
    });
  } else {
    // Handle case when no file is uploaded
    $("#uploadMessage").text("No image selected.");
  }
}

function validateImage() {
  var imageInput = document.getElementById("imageFile");
  var imageLabel = document.getElementById("imageLabel");
  var imagePreview = document.getElementById("imagePreview");
  var fileSizeError = document.getElementById("fileSizeError");
  var updateButton = document.getElementById("Update");

  if (imageInput.files && imageInput.files[0]) {
    var fileSize = imageInput.files[0].size;

    if (fileSize > 512 * 1024) {
      fileSizeError.textContent = "File size must be 512 KB or smaller.";
      imageInput.value = "";
      imageLabel.innerText = "Choose file";
      imagePreview.style.display = "none";
      updateButton.disabled = true; // Disable the Update button
      return false;
    } else {
      fileSizeError.textContent = "";
      var reader = new FileReader();

      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };

      reader.readAsDataURL(imageInput.files[0]);
      imageLabel.innerText = imageInput.files[0].name;
      updateButton.disabled = false; // Enable the Update button
      return true;
    }
  } else {
    fileSizeError.textContent = "";
    updateButton.disabled = false; // Enable the Update button if no file is selected
    return true;
  }
}
