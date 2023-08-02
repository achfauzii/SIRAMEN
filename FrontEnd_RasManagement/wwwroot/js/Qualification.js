
$(document).ready(function () {
    const decodedtoken = parseJwt(sessionStorage.getItem("Token"));
    const accid = decodedtoken.AccountId;

    $.ajax({
        url: "https://localhost:7177/api/Qualification/accountId?accountId=" + accid,
        type: 'GET',
        dataType: 'json',
        headers: {
            "Authorization": "Bearer " + sessionStorage.getItem("Token")
        },
        success: function (response) {
            debugger;
            if (response.status === 200) {
                displayQualification(response.data);
            } else {
                console.error('Error fetching data from API:', response.message);
            }
        },
        error: function (error) {
            console.error('Error fetching data from API:', error);
        }
    });
});


function displayQualification(data) {
    var frameworks = data.map(item => item.framework).join(', ');
    $('#framework').text(frameworks);
    var programmingLanguages = data.map(item => item.programmingLanguage).join(', ');
    $('#programming').text(programmingLanguages);
    var databases = data.map(item => item.database).join(', ');
    $('#databases').text(databases);
    var tools = data.map(item => item.tools).join(', ');
    $('#tools').text(tools);
    var others = data.map(item => item.others).join(', ');
    $('#others').text(others);

}


function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

