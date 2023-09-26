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
          
          
         
            const hot = new Handsontable(container, {
                data: resource,
                columns: [
                    {
                        title: 'Full Name',
                        type: 'text',
                        data: 'fullname',
                    
                    },
                    {
                        title: 'Email',
                        type: 'text',
                        data: 'email',
                   
                    },
                    {
                        title: 'Nickname',
                        type: 'dropdown',
                        data: 'nickname',
                        source: ['Add New','Close']
                   


             
                    
                    }
                  
                   
                ],
               //dataSchema: {fullname:null, email: null, nickname:null },
               //colWidths: auto,
                height: 'auto',
                width: 'auto',
                rowHeaders: true,
                colHeaders: ['Full name', 'Email', 'Nickname'],
                height: 'auto',
                fixedColumnsStart: 1,

            
                minSpareRows: 1,



                licenseKey: 'non-commercial-and-evaluation' // for non-commercial use only
            });

            // Sekarang, Anda dapat memasukkan data ini ke dalam Handsontable atau melakukan apa yang Anda inginkan.
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });


})

