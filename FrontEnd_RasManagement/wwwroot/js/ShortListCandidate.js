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
                columns: [
                  
                    {
                        title: 'Full Name',
                        type: 'text',
                        data: 'fullname',
                       
                    },
                    {
                        title: 'Position',
                        type: 'text',
                        data: 'position',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Skill Set',
                        type: 'text',
                        data: 'skillset',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Major',
                        type: 'text',
                        data: 'education',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'University',
                        type: 'text',
                        data: 'university',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Domicile',
                        type: 'text',
                        data: 'domisili',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Age',
                        type: 'numeric',
                        data: 'birthdate',
                        filter: true,
                        filter_type: 'numeric',
                    },
                    {
                        title: 'Level',
                        type: 'text',
                        data: 'level',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Experience (Years)',
                        type: 'numeric',
                        data: 'experienceInYear',
                        filter: true,
                        filter_type: 'numeric',
                    },
                    {
                        title: 'Filtering By',
                        type: 'dropdown',
                        data: 'filteringBy',
                        source: ['RAS', 'Recruitment'],
                      
                    },
                    {
                        title: 'Work Status',
                        type: 'checkbox',
                        data: 'workStatus',
                        filter: true,
                        filter_type: 'checkbox',
                    },
                    {
                        title: 'Notice Period',
                        type: 'text',
                        data: 'noticePeriode',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Financial Industry',
                        type: 'checkbox',
                        data: 'financialIndustry',
                        filter: true,
                        filter_type: 'checkbox',
                    },
                    {
                        title: 'Raw CV',
                        type: 'text',
                        data: 'rawCv',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Berca CV',
                        type: 'text',
                        data: 'cvBerca',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'English Level',
                        type: 'text',
                        data: 'englishLevel',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Current Salary',
                        type: 'text',
                        data: 'currentSalary',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Expected Salary',
                        type: 'text',
                        data: 'expectedSalary',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Negotiable',
                        type: 'checkbox',
                        data: 'negotiable',
                        filter: true,
                        filter_type: 'checkbox',
                    },
                    {
                        title: 'Interview by RAS',
                        type: 'text',
                        data: 'intwByRas',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Interview Date by RAS',
                        type: 'date',
                        data: 'intwDateByRas',
                        filter: true,
                        filter_type: 'date',
                        dateFormat: 'YYYY-MM-DD', // Modify the date format as needed
                    },
                    {
                        title: 'Interview by User',
                        type: 'text',
                        data: 'intwUser',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Name of User',
                        type: 'text',
                        data: 'nameOfUser',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Interview Date by User',
                        type: 'date',
                        data: 'intwDateUser',
                        filter: true,
                        filter_type: 'date',
                        dateFormat: 'YYYY-MM-DD', // Modify the date format as needed
                    },
                    {
                        title: 'Level Recommendation',
                        type: 'text',
                        data: 'levelRekom',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Status',
                        type: 'text',
                        data: 'status',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Notes',
                        type: 'text',
                        data: 'notes',
                        filter: true,
                        filter_type: 'input',
                    },
                    {
                        title: 'Last Modified',
                        type: 'date',
                        data: 'lastModified',
                        filter: true,
                        filter_type: 'date',
                        dateFormat: 'YYYY-MM-DD', // Modify the date format as needed
                    },
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

