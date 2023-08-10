$(document).ready(function () {
    //debugger;
    // Mendapatkan nilai parameter accountId dari URL
    loadDataA();
    $("#editDetailsBtn").on("click", function () {
        loadDataA(); // Reload the data before opening the modal
        $("#myModal").modal("show"); // Show the modal after loading the data
    });
});

function loadDataA() {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    var imgElement = $("#employeePhoto");
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=" + accid,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            //debugger;
            //console.log(result); 
            var obj = result.data.result; //data yg didapat dari api
            var birthDate = obj.birthdate;
            const date = new Date(birthDate);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const date_ = date.toLocaleDateString('id-ID', options);
            $('#nameFull').text(obj.fullname);
            $('#nickName').text(obj.nickname);
            $('#birthPlace').text(obj.birthplace);
            $('#birthDate').text(date_);
            $('#gender').text(obj.gender);
            $('#religion').text(obj.religion);
            $('#martialStatus').text(obj.maritalstatus);
            $('#nationality').text(obj.nationality);

            var employeePhoto1 = document.getElementById('employeePhoto');
            if (obj.image != null) {
                employeePhoto1.src = obj.image;
                employeePhoto.alt = obj.fullname + "'s photo";
            }
          


            // Populate the form fields in the modal with the retrieved data
            $('#accountId').val(obj.accountId);
            $('#editName').val(obj.fullname);
            $('#editNickName').val(obj.nickname);
            $('#editBirthPlace').val(obj.birthplace);
            $('#editBirthDate').val(obj.birthdate);
            $('#editGender').val(obj.gender);
            $('#editReligion').val(obj.religion);
            $('#editMartialStatus').val(obj.maritalstatus);
            $('#editNationality').val(obj.nationality);
            // Assuming you have an "image" field in the data, set the file name in the label
            $('#imageLabel').text(obj.image);
        },
        error: function (errormessage) { alert(errormessage.responseText); }
    });
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function GetById(accountId) {
    //debugger;
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            //debugger;
            var obj = result.data; //data yg kita dapat dr API  
            $('#accountId').val(obj.workExperienceId);
            $('#editName').val(obj.companyName);
            $('#editNickName').val(obj.job);
            $('#editBirthPlace').val(obj.period);
            $('#editBirthDate').val(obj.description);
            $('#editGender').val(obj.companyName);
            $('#editReligion').val(obj.job);
            $('#editMartialStatus').val(obj.period);
            $('#editNationality').val(obj.description);
            $('#imageFile').val(obj.image);
            $('#Modal').modal('show');
            $('#Update').show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    })
}

// Fungsi untuk menyimpan data yang diubah ke server
function updateData() {
    debugger;
    //upload gambar ke assets project
    var accountId = $('#accountId').val();
    uploadImage(accountId);
    var imagePath = `/assets/photo/photo-${accountId}.jpg`; // Path lengkap ke foto

    var formData = {
        AccountId: $('#accountId').val(),
        Fullname: $('#editName').val(),
        Nickname: $('#editNickName').val(),
        Birthplace: $('#editBirthPlace').val(),
        Birthdate: $('#editBirthDate').val(),
        Gender: $('#editGender').val(),
        Religion: $('#editReligion').val(),
        MaritalStatus: $('#editMartialStatus').val(),
        Nationality: $('#editNationality').val(),
        Image: imagePath
    };
    console.log(formData);

    //// Add image file to FormData if selected
    //const imageFileInput = document.getElementById('imageFile');
    //if (imageFileInput.files.length > 0) {
    //    formData.append('ImageFile', imageFileInput.files[0]);
    //}

    $.ajax({
        url: `https://localhost:7177/api/Employees/${formData.AccountId}`,
        type: "PUT",
        data: JSON.stringify(formData),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            alert('Data updated successfully');
            $('#myModal').modal('hide'); // Close the modal
            loadDataA(); // Reload the data
        },
        error: function (errormessage) {
            alert('Failed to update data');
            console.error(errormessage);
        }
    });
}


/*function previewImage(event) {
    const imageFile = event.target.files[0];
    const imagePreview = document.getElementById('imagePreview');
    const imageLabel = document.getElementById('imageLabel');

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function () {
            imagePreview.src = reader.result;
            imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(imageFile);
        imageLabel.textContent = imageFile.name;
    } else {
        imagePreview.src = '#';
        imagePreview.style.display = 'none';
        imageLabel.textContent = 'Choose file';
    }
}*/

function previewImage(event) {
    var imageInput = event.target;
    var imageLabel = document.getElementById('imageLabel');
    var imagePreview = document.getElementById('imagePreview');

    if (imageInput.files && imageInput.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            imagePreview.src = e.target.result;
            imagePreview.style.display = 'block';
        }

        reader.readAsDataURL(imageInput.files[0]);

        // Update the label text to the selected file's name
        imageLabel.innerText = imageInput.files[0].name;
    }
}

function uploadImage(accountId) {
    var imageFile = $("#imageFile")[0].files[0];
    var formData = new FormData();
    var fileName = `photo-${accountId}.jpg`; // Nama file disesuaikan dengan accountId
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
            $("#uploadMessage").text("An error occurred while uploading the image.");
            console.log(error);
        }
    });
}