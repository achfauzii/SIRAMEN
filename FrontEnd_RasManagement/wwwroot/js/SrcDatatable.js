$(document).ready(function () {
	$('#resource').DataTable({
		fixedColumns: {
			left: 1,

		},
		scrollX: true,
		processing: true,
		serverSide: true,
		fixedColumns: true,



		ajax: {
			url: 'https://localhost:7177/api/Shortlist/NonRasDatatable', // Your API endpoint
			type: 'POST',
			contentType: 'application/json',
			data: function (d) {
				// Customize request parameters here if needed
				// Example: d.customParam = 'value';
				return JSON.stringify(d);
			}
		},
		//dom: 'Bfrtip',

		columns: [

			{
				"data": "fullname"
			},
			{
				"data": "position"
			},
			{
				"data": "skillset"
			},
			{
				"data": "education"
			},
			{
				"data": "university"
			},
			{
				"data": "domisili"
			},
			{
				"data": "birthdate"
			},
			{
				"data": "level"
			},
			{
				"data": "experienceInYear"
			},
			{
				"data": "filteringBy"
			},
			{
				"data": "workStatus"
			},
			{
				"data": "noticePeriode"
			},
			{
				"data": "financialIndustry"
			},
			{
				"data": "rawCv"
			},
			{
				"data": "cvBerca"
			},
			{
				"data": "englishLevel"
			},
			{
				"data": "currentSalary"
			},
			{
				"data": "expectedSalary"
			},
			{
				"data": "negotiable"
			},
			{
				"data": "intwByRas",

			},
			{
				"data": "intwDateByRas"
			},
			{
				"data": "intwUser"
			},
			{
				"data": "nameOfUser"
			},
			{
				"data": "intwDateUser"
			},
			{
				"data": "levelRekom"
			},
			{
				"data": "status"
			},
			{
				"data": "notes"
			},
			{
				"data": "lastModified",
				"render": function (data, type, row) {
					if (type === 'display' || type === 'filter') {
						// Format tanggal dalam format yang diinginkan
						return moment(data).format('YYYY-MM-DD ');
					}
					// Untuk tipe data lain, kembalikan data aslinya
					return data;
				}
			}
		],


		searching: true,


	});

});