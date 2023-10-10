﻿var table = null;
$(document).ready(function () {
	Src();

	getUniversitasList();

});

function Src() {
	table = $('#resource').DataTable({
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
					data: 'intwByRas',
					render: function (data, type, row) {
						if (type === 'display' || type === 'filter') {
							// Set nilai awal (value) elemen <select> berdasarkan data dari API
							var selectHtml = '<select class="intwByRas-select" data-id="' + row.id + '">';

							if (data === null || data =="") {
								selectHtml += '<option value="" selected></option>'; // Opsi default jika data null
							}

							selectHtml += '<option value="Done" ' + (data === 'Done' ? 'selected' : '') + '>Done</option>' +
								'<option value="string" ' + (data === 'string' ? 'selected' : '') + '>string</option>' +
								'<option value="Whitdraw" ' + (data === 'Whitdraw' ? 'selected' : '') + '>Whitdraw</option>' +
								'</select>';

							return selectHtml;
						}
						// Untuk tipe data lain, kembalikan data aslinya
						return data;
					}

				},
			{
					data: 'intwDateByRas',
					render: function (data, type, row) {
						if (type === 'display' || type === 'filter') {
							// Tambahkan elemen input tanggal
							return '<input type="date" class="intwDateByRas-input" data-id="' + row.id + '" value="' + data + '">';
						}
						// Untuk tipe data lain, kembalikan data aslinya
						return data;
					}
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
}

function getUniversitasList() {
	const selectUniversity = document.getElementById('UniversityName');

	$.ajax({
		url: "https://localhost:7177/api/Universitas",
		type: "GET",
		dataType: "json",
		headers: {
			"Authorization": "Bearer " + sessionStorage.getItem("Token")
		},
		success: function (result) {
			var universities = result.data;



			//selectUniversity.empty(); // Kosongkan pilihan sebelumnya
			//selectUniversity.append('<option value="" selected disabled>Select University</option>');


			universities.forEach(function (university) {
				console.log(university);
				const option = document.createElement('option');
				option.value = university.namaUniversitas;
				option.textContent = university.namaUniversitas;
				selectUniversity.appendChild(option);
			});

			$(selectUniversity).select2({
				placeholder: 'Select university',
				width: '100%',

			});
		},
		error: function (errormessage) {
			alert(errormessage.responseText);
		}
	});
}

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

/*	$(document).on('change', '.intwDateByRas-input, .intwByRas-select', function () {
		// Ambil nilai yang diubah
		var newValue = $(this).val();

		// Ambil data ID dari elemen
		var dataId = $(this).data('nonRasId');

		// Tentukan tipe data (tanggal atau select)
		var isDate = $(this).hasClass('intwDateByRas-input');  // Dapatkan nama kolom dari atribut data
		var columnName = $(this).data('column'); // Sesuaikan nama atributnya dengan apa yang Anda gunakan
		console.log(columnName);
		// Buat objek yang berisi data yang akan dikirim ke server
		var postData = {
			id: dataId,
			newValue: newValue,
		
		};
		console.log(postData);
		// Kirim permintaan POST ke server
		$.ajax({
			url: 'URL_API_UPDATE_DATA', // Ganti dengan URL endpoint API Anda
			type: 'POST',
			data: postData,
			success: function (response) {
				// Tanggapi respons dari server jika diperlukan
				console.log('Data berhasil diperbarui:', response);
			},
			error: function (error) {
				// Tanggapi kesalahan jika diperlukan
				console.error('Terjadi kesalahan:', error);
			}
		});
	});*/

