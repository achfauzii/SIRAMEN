// A $( document ).ready() block.
$(document).ready(function () {
    hideElementBasedOnRole(["role1", "role2"]);
});
function hideElementBasedOnRole(allowedRoles) {
 
    const userRoles = ["role1", "role2", "role3"]; // Gantilah dengan peran yang sesuai

    // Cek apakah salah satu dari peran yang diizinkan ada dalam peran pengguna
    const isAllowed = allowedRoles.some(role => userRoles.includes(role));

    // Ambil elemen menu
    const menuElement = document.querySelector('.nav-item');

    // Sembunyikan atau tampilkan elemen berdasarkan peran
    if (isAllowed) {
        menuElement.style.display = 'block';
    } else {
        menuElement.style.display = 'none';
    }
}


