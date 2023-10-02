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
    $('#loader').show();
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;
    var imgElement = $("#employeePhoto");
    $.ajax({
        url: "https://rasmanagement-001-site1.atempurl.com/api/Employees/accountId?accountId=" + accid,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            var obj = result.data.result; // Data yang diterima dari API
            var birthDate = obj.birthdate;
            const date = new Date(birthDate);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const date_ = date.toLocaleDateString('id-ID', options);

            $('#nameFull').text(obj.fullname);
            $('#nickName').text(obj.nickname);
            $('#birthPlace').text(obj.birthplace);

            $('#birthDate').text(birthDate ? date_ : '');
            // Set birth date input value
            if (obj.birthdate) {
                $('#editBirthDate').val(obj.birthdate.substring(0, 10));
            } else {
                $('#editBirthDate').val('');
            }

            $('#gender').text(obj.gender);
            $('#religion').text(obj.religion);
            $('#martialStatus').text(obj.maritalstatus);
            $('#nationality').text(obj.nationality);
            $('#address').text(obj.address);

            // Set employee photo
            if (obj.image != null) {
                imgElement.attr("src", obj.image);
                imgElement.attr("alt", obj.fullname + "'s photo");
            } else {
                imgElement.attr("src", "");
                imgElement.attr("alt", "");
            }

            // Populate the form fields in the modal with the retrieved data
            $('#accountId').val(obj.accountId);
            $('#editName').val(obj.fullname);
            $('#editNickName').val(obj.nickname);
            $('#editBirthPlace').val(obj.birthplace);
            $('#editGender').val(obj.gender);
            $('#editReligion').val(obj.religion);
            $('#editMartialStatus').val(obj.maritalstatus);
            $('#editNationality').val(obj.nationality);
            $('#editAddress').val(obj.address);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    $('#loader').hide();
}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}


/*function GetById(accountId) {
    debugger;
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            debugger;
            var obj = result.data.result; // Perhatikan penggunaan .result di sini

            $('#accountId').val(obj.accountId);
            $('#editName').val(obj.fullname);
            $('#editNickName').val(obj.nickname);
            $('#editBirthPlace').val(obj.birthplace);

            // Set birth date input value
            if (obj.birthdate) {
                $('#editBirthDate').val(obj.birthdate.substring(0, 10));
            } else {
                $('#editBirthDate').val('');
            }

            $('#editGender').val(obj.gender);
            $('#editReligion').val(obj.religion);
            $('#editMartialStatus').val(obj.maritalstatus);
            $('#editNationality').val(obj.nationality);
            $('#editAddress').val(obj.address);
            // Set the image input value
            // $('#imageFile').val(obj.image);

            var imageInput = document.getElementById('imageFile');
            if (obj.image != null) {
                // Set the value of image input to an empty string
                // This is done because you can't set the value of a file input for security reasons
                imageInput.value = '';
            }

            $('#Modal').modal('show');
            $('#Update').show();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}*/

function GetById(accountId) {
    debugger;
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=" + accountId,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            debugger;
            var obj = result.data.result;

            $('#accountId').val(obj.accountId);
            $('#editName').val(obj.fullname);
            $('#editNickName').val(obj.nickname);
            $('#editBirthPlace').val(obj.birthplace);
            $('#editBirthDate').val(obj.birthdate.substring(0, 10)); // Set birth date input value
            $('#editGender').val(obj.gender);
            $('#editReligion').val(obj.religion);
            $('#editMartialStatus').val(obj.maritalstatus);
            $('#editNationality').val(obj.nationality);
            $('#editAddress').val(obj.address);

            // Set the image input value
            var imageInput = document.getElementById('imageFile');
            if (obj.image != null) {
                imageInput.value = ''; // Clear the file input
                $('#imagePath').val(obj.image); // Set image path value

                // Set the image preview using the image path
                $('#imagePreview').attr('src', obj.image);
                $('#imagePreview').css('display', 'block'); // Show the image preview
            } else {
                imageInput.value = '';
                $('#imagePath').val(''); // Clear image path value
                $('#imagePreview').attr('src', ''); // Clear image preview source
                $('#imagePreview').css('display', 'none'); // Hide the image preview
            }

            $('#Modal').modal('show');
            /$('#Update').show();/
            $('#Update').prop('disabled', false); // Enable the Update button
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}



/*function updateData() {
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

        // Set birth date to yyyy-mm-dd format
        Birthdate: $('#editBirthDate').val(),

        Gender: $('#editGender').val(),
        Religion: $('#editReligion').val(),
        MaritalStatus: $('#editMartialStatus').val(),
        Nationality: $('#editNationality').val(),
        Address: $('#editAddress').val(),
        Image: imagePath
    };
    console.log(formData);

    $.ajax({
        url: `https://localhost:7177/api/Employees/${formData.AccountId}`,
        type: "PUT",
        data: JSON.stringify(formData),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
    }).then(result => {
        //debugger;
        if (result.status == 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success...',
                text: 'Data Behasil Diperbaharui!',
                showConfirmButton: false,
                timer: 2000
            }).then(() => {
                $('#myModal').modal('hide'); // Modal ditutup

                location.reload();
            });
        } else {
            alert("Data gagal Diperbaharui");
        }
    });
}*/

function updateData() {
    debugger;
    var accountId = $('#accountId').val();
    var isValid = true;

    $('input[required]').each(function () {
        var input = $(this);
        if (!input.val()) {
            input.next('.error-message').show();
            isValid = false;
        } else {
            input.next('.error-message').hide();
        }
    });
    if (!isValid) {
        return;
    }

    if (!validateImage()) {
        return;
    }
    uploadImage(accountId);

    var imagePath = `/assets/photo/photo-${accountId}.jpg`; // Path lengkap ke foto
    console.log(imagePath);
    var formData = {
        AccountId: $('#accountId').val(),
        Fullname: $('#editName').val(),
        Nickname: $('#editNickName').val(),
        Birthplace: $('#editBirthPlace').val(),

        // Set birth date to yyyy-mm-dd format
        Birthdate: $('#editBirthDate').val(),

        Gender: $('#editGender').val(),
        Religion: $('#editReligion').val(),
        MaritalStatus: $('#editMartialStatus').val(),
        Nationality: $('#editNationality').val(),
        Address: $('#editAddress').val(),
        Image: imagePath
    };


    $.ajax({
        url: `https://localhost:7177/api/Employees/${formData.AccountId}`,
        type: "PUT",
        data: JSON.stringify(formData),
        contentType: "application/json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        /*}).then(result => {
            //debugger;
            if (result.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'Data Behasil Diperbaharui!',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    $('#myModal').modal('hide'); // Modal ditutup
    
                    location.reload(); // Halaman direload untuk memperbarui data
                });
            } else {
                alert("Data gagal Diperbaharui");
            }
        });*/
        success: function (result) {
            if (result.status == 200) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success...',
                    text: 'Data Berhasil Diperbaharui!',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    $('#myModal').modal('hide');
                    location.reload();
                });
            } else {
                alert("Data gagal Diperbaharui");
            }
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

function validateFormData() {
    var fullname = $('#editName').val();
    var nickname = $('#editNickName').val();
    var birthplace = $('#editBirthPlace').val();
    var birthdate = $('#editBirthDate').val();
    var gender = $('#editGender').val();
    var religion = $('#editReligion').val();
    var martialStatus = $('#editMartialStatus').val();
    var nationality = $('#editNationality').val();
    var address = $('#editAddress').val();

    if (fullname === '' || nickname === '' || birthplace === '' || birthdate === '' || gender === '' || religion === '' || martialStatus === '' || nationality === '' || address === '') {
        Swal.fire({
            icon: 'error',
            title: 'Error...',
            text: 'Data tidak boleh kosong'
        });
        return false;
    }

    return true;
}


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
                $("#uploadMessage").text("An error occurred while uploading the image.");
                console.log(error);
            }
        });
    } else {
        // Handle case when no file is uploaded
        $("#uploadMessage").text("No image selected.");
    }
}

/*function validateImage(event) {
    var imageInput = event.target;
    var imageLabel = document.getElementById('imageLabel');
    var imagePreview = document.getElementById('imagePreview');
    var fileSizeError = document.getElementById('fileSizeError');
    var updateButton = document.getElementById('Update'); // Get the Update button element

    if (imageInput.files && imageInput.files[0]) {
        var fileSize = imageInput.files[0].size; // File size in bytes

        if (fileSize > 512 * 1024) { // 512 KB in bytes
            fileSizeError.textContent = "File size must be 512 KB or smaller.";
            imageInput.value = ''; // Clear the input
            imageLabel.innerText = 'Choose file';
            imagePreview.style.display = 'none';
        } else {
            fileSizeError.textContent = '';
            var reader = new FileReader();

            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }

            reader.readAsDataURL(imageInput.files[0]);
            imageLabel.innerText = imageInput.files[0].name;

            // Enable the Update button
            updateButton.disabled = false;
        }
    }
}*/


function validateImage() {
    var imageInput = document.getElementById('imageFile');
    var imageLabel = document.getElementById('imageLabel');
    var imagePreview = document.getElementById('imagePreview');
    var fileSizeError = document.getElementById('fileSizeError');
    var updateButton = document.getElementById('Update');

    if (imageInput.files && imageInput.files[0]) {
        var fileSize = imageInput.files[0].size;

        if (fileSize > 512 * 1024) {
            fileSizeError.textContent = "File size must be 512 KB or smaller.";
            imageInput.value = '';
            imageLabel.innerText = 'Choose file';
            imagePreview.style.display = 'none';
            updateButton.disabled = true; // Disable the Update button
            return false;
        } else {
            fileSizeError.textContent = '';
            var reader = new FileReader();

            reader.onload = function (e) {
                imagePreview.src = e.target.result;
                imagePreview.style.display = 'block';
            }

            reader.readAsDataURL(imageInput.files[0]);
            imageLabel.innerText = imageInput.files[0].name;
            updateButton.disabled = false; // Enable the Update button
            return true;
        }
    } else {
        fileSizeError.textContent = '';
        updateButton.disabled = false; // Enable the Update button if no file is selected
        return true;
    }
}