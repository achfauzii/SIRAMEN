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
				"data": "skillset",
				"render": function (data) {
					// Pisahkan data skillset menjadi array berdasarkan koma
					var skillsetArray = data.split(',');

					// Container untuk pill badges
					var badgeContainer = $('<div class="badge-container"></div>');

					// Loop melalui setiap elemen dalam array
					for (var i = 0; i < skillsetArray.length; i++) {
						// Tentukan warna badge berdasarkan data
						var badgeColor = getBadgeColor(skillsetArray[i]);

						// Buat pill badge dengan warna yang sesuai
						var badge = $('<span class="badge badge-pill ' + badgeColor + '">' + skillsetArray[i] + '</span>');

						// Tambahkan badge ke dalam container
						badgeContainer.append(badge);
						 // Tambahkan pemisah spasi setelah setiap badge, kecuali untuk yang terakhir
      if (i < skillsetArray.length - 1) {
        badgeContainer.append(' '); // Ini adalah pemisah spasi
      }
					}

					// Kembalikan HTML dari container badge
					return badgeContainer.html();
				}
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

	function getBadgeColor(skill) {
		// Contoh logika: Jika skillset mengandung "NET", gunakan warna biru; jika tidak, gunakan warna pink
		if (skill.toLowerCase().includes(".net web api")) {
			return "badge-pastel-teal"; // Warna biru
		} else if (skill.toLowerCase().includes(".net web mvc")) {
			return "badge-pastel-mustard"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
		} else if (skill.toLowerCase().includes("codeigniter")) {
			return "badge-pastel-coral"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
		} else if (skill.toLowerCase().includes("bootstrap")) {
			return "badge-pastel-purple"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
		}
		else if (skill.toLowerCase().includes("php")) {
			return "badge-pastel-indigo"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
		} else {
			return "badge-pastel-gold"; // Warna pink (pastikan Anda memiliki kelas CSS "badge-pink")
		}
	}


});