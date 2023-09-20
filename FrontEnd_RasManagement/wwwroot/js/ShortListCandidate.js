$(document).ready(function () {

    const container = document.querySelector('#example');
    // Melakukan permintaan GET ke API
    fetch('https://localhost:7177/api/Employees')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const resource = data.data
          
            // Extract only the 'fullname' and 'email' columns from the API response
            const filteredData = resource.map(item => ({
                fullname: item.fullname,
                email: item.email
            }));
          
            const hot = new Handsontable(container, {
                data: filteredData,
                colWidths: 100,
                rowHeaders: true,
                colHeaders: ['Full name', 'Email'],
                height: 'auto',
                fixedColumnsStart: 1,

                licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
            });

            // Sekarang, Anda dapat memasukkan data ini ke dalam Handsontable atau melakukan apa yang Anda inginkan.
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });





   

})

