function save() {
    // Ganti URL_target dengan URL endpoint API yang sesuai
    const apiUrl = 'URL_target';

    return fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + sessionStorage.getItem("Token"),
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(result => {
            console.log('Data saved:', result);
            // Lakukan sesuatu jika data berhasil disimpan
            return result; // Mengembalikan hasil jika diperlukan
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            // Lakukan sesuatu jika ada kesalahan dalam menyimpan data
            throw error; // Melempar kembali kesalahan jika diperlukan
        });
}

function clearScreen() {
    $("#activity").val("");
    document.getElementById('flag').selectedIndex = 0;
    document.getElementById('category').selectedIndex = 0;
    document.getElementById('status').selectedIndex = 0;
    $("#knownBy").val("");
    
    $("#Update").hide();
    $("#Save").show();

}

