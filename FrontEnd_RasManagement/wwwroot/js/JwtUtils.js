function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

//fungsi untuk mengambil nilai objek dengan indeks tertentu.
const getValueByIndex = (obj, index) => obj[Object.keys(obj)[index]];

//data token
var objDataToken = parseJwt(sessionStorage.getItem('Token'));

//get value key dari indeks yang ada di obj-nya
//{ "Id": "1004", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "test", "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "test@gmail.com", "RoleId": "2", "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "Admin", "exp": 1688783241 }
var getRole = getValueByIndex(objDataToken, 8);
