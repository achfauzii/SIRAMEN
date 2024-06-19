//MenuAccess.js ini digunakan untuk menghandle Menu Access (Akses yang bisa diakses beebrapa role)
$(document).ready(function () {

    var objDataToken = parseJwt(sessionStorage.getItem('Token'));
    if (objDataToken.RoleId == 5) {
        hideElementBasedOnRoleTrainer(objDataToken.RoleId);
    }
    else if (objDataToken.RoleId == 6) {
        hideElementBasedOnRoleSales(objDataToken.RoleId);
    }
    else if (objDataToken.RoleId == 7) {
        hideElementBasedOnRoleManager(objDataToken.RoleId);
    }
    else {
        return;
    }
    

});
function hideElementBasedOnRoleTrainer(roleId) {
 
    const userRoles = ["1", "2"]; // Gantilah dengan peran yang sesuai
    
    // Cek apakah salah satu dari peran yang diizinkan ada dalam peran pengguna
    const isAllowed = roleId.includes(role);
    const menuElement = document.getElementById('activityCalendarMenu');
    const trackingInterview = document.getElementById('trackingInterviewMenu');
    const manageClient = document.getElementById('manageClientMenu');
    const shortListCandidateMenu = document.getElementById('shortlistCandidateMenu');
    const createAccountMenu = document.getElementById('createAccountMenu');
    const manageEmployeeMenu = document.getElementById('manageEmployeeMenu');
    const manageDepartmentMenu = document.getElementById('manageDepartmentMenu');
    

    // Sembunyikan atau tampilkan elemen berdasarkan peran
    if (isAllowed) {
        menuElement.style.display = 'block';
        trackingInterview.style.display = 'block';
        manageClient.style.display = 'block';
        shortListCandidateMenu.display = 'block';
    } else {
        menuElement.style.display = 'none';
        trackingInterview.style.display = 'none';
        manageClient.style.display = 'none';
        shortListCandidateMenu.style.display = 'none';
    }
}

function hideElementBasedOnRoleSales() {
    const menuElement = document.getElementById('activityCalendarMenu');
    const trackingInterview = document.getElementById('trackingInterviewMenu');
    const manageClient = document.getElementById('manageClientMenu');
    const shortListCandidateMenu = document.getElementById('shortlistCandidateMenu');
    const createAccountMenu = document.getElementById('createAccountMenu');
    const manageEmployeeMenu = document.getElementById('manageEmployeeMenu');
    const manageDepartmentMenu = document.getElementById('manageDepartmentMenu');
    menuElement.style.display = 'none';
    createAccountMenu.style.display = 'none';
    manageEmployeeMenu.style.display = 'none';
    manageDepartmentMenu.style.display = 'none';


}

function hideElementBasedOnRoleManager() {
    const createAccountMenu = document.getElementById('createAccountMenu');
    createAccountMenu.style.display = 'none';
}


