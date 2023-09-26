$(document).ready(function () {

    const container = document.querySelector('#example');


    // Melakukan permintaan GET ke API
    fetch('https://localhost:7177/api/Shortlist')
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

                dataSchema: { fullname: null, position: null, skillset: null, education: null, university: null, domisili: null, birthdate: null, level: null, experienceInYear: null, filteringBy: null, workStatus: null, noticePeriode: null, financialIndustry: null, rawCv: null, cvBerca: null, englishLevel: null, currentSalary: null, expectedSalary: null, negotiable: null, intwByRas: null, intwDateByRas: null, intwUser: null, nameOfUser: null, intwDateUser: null, levelRekom: null, notes: null},

                columns: [
                    {
                        title: 'Full Name',
                        type: 'text',
                        data: 'fullname',
                    
                    },
                    {
                        title: 'Position',
                        type: 'text',
                        data: 'email',
                   
                    },
                    {
                        title: 'Skillset',
                        type: 'dropdown',
                        data: 'nickname',
                        source: ['Add New','Close']
                   


             
                    
                    }
                  
                   
                ],

               //colWidths: auto,
                height: 'auto',
                width: 'auto',
                rowHeaders: true,
                colHeaders: ['Full Name', 'Position', 'Skill Set', 'Major', 'University', 'Domicile', 'Age', 'Level', 'Filtering By', 'Acive?', 'Notice Period', 'Financial Industry', 'Raw CV', 'Berca CV', 'English', 'Current Salary', 'Expected Salary', 'Negotiable', 'Interview by RAS', 'Interview Date by RAS', 'Interview by User', 'Name of User', 'Interview Date by User', 'Level Recomendation','Status','Notes'],
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

