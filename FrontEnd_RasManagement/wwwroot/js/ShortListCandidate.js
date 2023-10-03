$(document).ready(function () {

    const container = document.querySelector('#example');
    const save = document.querySelector('#save');

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
                colHeaders: ['NonRasID', 'Full Name', 'Position', 'Skill Set', 'Major', 'University', 'Domicile', 'Age', 'Level', 'Experience (Year)', 'Filtering By', 'Acive?', 'Notice Period', 'Financial Industry', 'Raw CV', 'Berca CV', 'English', 'Current Salary', 'Expected Salary', 'Negotiable', 'Interview by RAS', 'Interview Date by RAS', 'Interview by User', 'Name of User', 'Interview Date by User', 'Level Recomendation', 'Status', 'Notes', 'Last Modified'],
                //dataSchema: { fullname: null, position: null, skillset: null, education: null, university: null, domisili: null, birthdate: null, level: null, experienceInYear: null, filteringBy: null, workStatus: null, noticePeriode: null, financialIndustry: null, rawCv: null, cvBerca: null, englishLevel: null, currentSalary: null, expectedSalary: null, negotiable: null, intwByRas: null, intwDateByRas: null, intwUser: null, nameOfUser: null, intwDateUser: null, levelRekom: null, notes: null},
                columns: [
                    {
                        data: 'nonRasId',
                        type: 'text',
                        //hidden:true,
                    },
                    {
                        data: 'fullname',
                        type: 'text',
                    },
                    {
                        data: 'position',
                        type: 'text',
                    },
                    {
                        data: 'skillset',
                        type: 'text',
                    },
                    {
                        data: 'education',
                        type: 'text',
                    },
                    {
                        data: 'university',
                        type: 'text',
                    },
                    {
                        data: 'domisili',
                        type: 'text',
                    },
                    {
                        data: 'birthdate',
                        type: 'date',
                        dateFormat: 'YYYY-MM-DD',
                    },
                    {
                        data: 'level',
                        type: 'text',
                    },
                    {
                        data: 'experienceInYear',
                        type: 'numeric',
                    },
                    {
                        data: 'filteringBy',
                        type: 'dropdown',
                        source: ['Team RAS', 'Team Recruitment'],
                    },
                    {
                        data: 'workStatus',
                        type: 'checkbox',
                    },
                    {
                        data: 'noticePeriode',
                        type: 'text',
                    },
                    {
                        data: 'financialIndustry',
                        type: 'checkbox',
                    },
                    {
                        data: 'rawCv',
                        type: 'text',
                    },
                    {
                        data: 'cvBerca',
                        type: 'text',
                    },
                    {
                        data: 'englishLevel',
                        type: 'text',
                    },
                    {
                        data: 'currentSalary',
                        type: 'text',
                    },
                    {
                        data: 'expectedSalary',
                        type: 'text',
                    },
                    {
                        data: 'negotiable',
                        type: 'checkbox',
                    },
                    {
                        data: 'intwByRas',
                        type: 'text',
                    },
                    {
                        data: 'intwDateByRas',
                        type: 'date',
                        dateFormat: 'YYYY-MM-DD HH:mm:ss', // Adjust the date and time format as needed
                    },
                    {
                        data: 'intwUser',
                        type: 'text',
                    },
                    {
                        data: 'nameOfUser',
                        type: 'text',
                    },
                    {
                        data: 'intwDateUser',
                        type: 'date',
                        dateFormat: 'YYYY-MM-DD HH:mm:ss', // Adjust the date and time format as needed
                    },
                    {
                        data: 'levelRekom',
                        type: 'text',
                    },
                    {
                        data: 'status',
                        type: 'text',
                    },
                    {
                        data: 'notes',
                        type: 'text',
                    },
                    {
                        data: 'lastModified',
                        type: 'date',
                        dateFormat: 'YYYY-MM-DD HH:mm:ss', // Adjust the date and time format as needed
                    },
                ],

                //colWidths: auto,
                height: 'auto',
                width: 'auto',
                rowHeaders: true,

                height: 'auto',
                fixedColumnsStart: 1,

                //minSpareRows: 1,
                allowInsertRow: true,

                licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
                afterChange: function (change, source) {
                    if (source === 'loadData') {
                        return; //don't save this change
                    }


                    if (!autosave.checked) {
                        return;
                    }

                    fetch('https://localhost:7177/api/Shortlist/ShortListCandidate', {
                        method: 'POST',
                        //mode: 'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": "Bearer " + sessionStorage.getItem("Token")
                        },
                        body: JSON.stringify({ data: change })
                    })
                        .then(response => {
                            /*exampleConsole.innerText = `Autosaved (${change.length} cell${change.length > 1 ? 's' : ''})`;*/
                            console.log('The POST request is only used here for the demo purposes');

                        });
                }
            });
            load.addEventListener('click', () => {
                fetch('https://localhost:7177/api/Shortlist')
                    .then(response => {
                        response.json().then(data => {
                            hot.loadData(data.data);
                            // or, use `updateData()` to replace `data` without resetting states
                            exampleConsole.innerText = 'Data loaded';
                        });
                    });
            });

            save.addEventListener('click', () => {
                // save all cell's data


                fetch('https://localhost:7177/api/Shortlist/ShortListCandidate', {
                    method: 'POST',
                    //contentType: 'application/json',
                    //mode: 'no-cors',
                    body: JSON.stringify( hot.getSourceData() ),
                    //contentType: "application/json",
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": "Bearer " + sessionStorage.getItem("Token")
                    },
                })
                    .then(response => {
                        var a = JSON.stringify( hot.getSourceData() )
                        console.log(a);
                    });
            });


            /*autosave.addEventListener('click', () => {
                if (autosave.checked) {
                    exampleConsole.innerText = 'Changes will be autosaved';
                } else {
                    exampleConsole.innerText = 'Changes will not be autosaved';
                }
            });*/
        });


    // Sekarang, Anda dapat memasukkan data ini ke dalam Handsontable atau melakukan apa yang Anda inginkan.
});
