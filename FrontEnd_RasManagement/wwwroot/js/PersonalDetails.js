$(document).ready(function () {
    //debugger;
    // Mendapatkan nilai parameter accountId dari URL
    loadDataA();
});

function loadDataA() {
    var urlParams = new URLSearchParams(window.location.search);
    var accountId = urlParams.get('accountId');
    $.ajax({
        url: "https://localhost:7177/api/Employees/accountId?accountId=1",
        //url: "https://localhost:7177/api/Employees/accountId?accountId=${accountId}",
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (result) {
            debugger;
            console.log(result); 
            var obj = result.data.result; //data yg didapat dari api
            var birthDate = obj.birthdate;
            const date = new Date(birthDate);
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const date_ = date.toLocaleDateString('id-ID', options);
            document.getElementById('nickName').textContent = obj.nickname;
            document.getElementById('birthPlace').textContent = obj.birthplace;
            document.getElementById('birthDate').textContent = date_;
            document.getElementById('gender').textContent = obj.gender;
            document.getElementById('religion').textContent = obj.religion;
            document.getElementById('martialStatus').textContent = obj.maritalstatus;
            document.getElementById('nationality').textContent = obj.nationality;

            // Menampilkan foto jika tersedia, atau kotak foto jika tidak
            var imageContainer = document.getElementById('imageContainer');
            if (obj.image) {
                var imgElement = document.createElement('img');
                imgElement.src = obj.image;
                imgElement.style.height = '100px';
                imgElement.style.width = '100px';
                imgElement.alt = 'Profile Picture';
                imageContainer.appendChild(imgElement);
            } else {
                var defaultImageBox = document.createElement('div');
                defaultImageBox.style.height = '100px';
                defaultImageBox.style.width = '100px';
                defaultImageBox.style.border = '1px solid #ccc';
                defaultImageBox.style.backgroundColor = '#f1f1f1';
                imageContainer.appendChild(defaultImageBox);
            }

        },
        error: function (errormessage) { alert(errormessage.responseText); }
    });
}



/*// Fungsi untuk mendapatkan data dari API
async function getDataFromAPI(accountId) {
    try {
        const response = await fetch('https://localhost:7177/api/Employees/accountId?accountId=${accountId}');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

// Fungsi untuk mengisi nilai-nilai di dalam HTML
async function fillPersonalDetails() {
    debugger;
    // Ganti 'accountId' dengan nilai yang sesuai, misalnya id karyawan
    const accountId = 'accountId';
    const personalDetails = await getDataFromAPI(accountId);

    if (personalDetails) {
        document.getElementById("nickName").innerText = personalDetails.nickname;
        document.getElementById("birthPlace").innerText = personalDetails.birthplace;
        document.getElementById("birthDate").innerText = personalDetails.birthdate;
        document.getElementById("gender").innerText = personalDetails.gender;
        document.getElementById("religion").innerText = personalDetails.religion;
        document.getElementById("martialStatus").innerText = personalDetails.maritalstatus;
        document.getElementById("nationality").innerText = personalDetails.nationality;

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

// Panggil fungsi untuk mengisi nilai-nilai pada saat halaman dimuat
fillPersonalDetails();
*/

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

    /*// Validasi data sebelum update
    if (!validateFormData()) {
        return;
    }

    // Validasi data sebelum update
    if (!validateImage()) {
        return;
    }*/

    if (!validateFormData() || !validateImage()) {
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