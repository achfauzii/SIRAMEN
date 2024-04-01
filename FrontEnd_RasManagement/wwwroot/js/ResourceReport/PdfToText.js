const fileInput = document.getElementById('fileInput');

//PDF
//fileInput.addEventListener('change', function (event) {

//    ClearScreenSave();
//    const file = event.target.files[0];
//    const fileReader = new FileReader();

//    fileReader.onload = function () {
//        const typedarray = new Uint8Array(this.result);
//        pdfjsLib.getDocument(typedarray).promise.then(function (pdf) {
//            let text = '';

//            // async/await untuk menunggu pemrosesan setiap halaman
//            async function processPage(pageNum) {
//                const page = await pdf.getPage(pageNum);
//                const content = await page.getTextContent();
//                content.items.forEach(function (item) {
//                    text += item.str + '\n'; // Tambahkan teks ke variabel text
//                });
//            }

//            // Iterasi melalui setiap halaman PDF dan proses konten teks
//            async function processAllPages() {
//                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
//                    await processPage(pageNum);
//                }
//                // Panggil fungsi untuk mendapatkan informasi tertentu setelah selesai mengambil teks dari semua halaman
//                console.log(text);
//                extractInformation(text);
//            }

//            processAllPages();
//        });
//    };

//    fileReader.readAsArrayBuffer(file);

//});

function extractInformation(text) {

    //Name
    var regexName = /Name\s*:\s*(.*)/;
    var matchName = regexName.exec(text);
    if (matchName && matchName.length > 1) {
        document.getElementById('Name').value = matchName[1].trim();
    }

    //University
    var regexUniv = /EDUCATIONS\s*\d{4}\s*(.*)/;
    var matchUniv = regexUniv.exec(text);
    if (matchUniv != null) {
        if (matchUniv && matchUniv.length > 1) {
            $("#UniversityName").val(matchUniv[1]).trigger("change");
        }
    } else {
        regexUniv = /Degree\s+(\d{4})\s+([^\n]+)/;
        matchUniv = regexUniv.exec(text);
        console.log(matchUniv[2]);
        $("#UniversityName").val(matchUniv[2]).trigger("change");
       
    }
  


    //GET Degree 
    var regexDegree = /(.*)\s*NON FORMAL EDUCATIONS/;
    var matchDegree = regexDegree.exec(text);
    var degree = null;
    if (matchDegree != null) {
        if (matchDegree && matchDegree.length > 1) {
            var regexMajor = new RegExp("(.*)\\s*" + matchDegree[1].trim());
            var matchMajor = regexMajor.exec(text);
            if (matchMajor && matchMajor.length > 1) {
                $("#degree").val(matchDegree[1].trim() + " - " + matchMajor[1].trim());
            }
        }
    } else {

        regexDegree = /Degree\s+(\d{4})\s+([^\n]+)\s+([^\n]+)\s+([^\n]+)\s+([^\n]+)/;
        matchDegree = regexDegree.exec(text);
        degree = matchDegree[4].trim() + " " + matchDegree[5].trim();
        $("#degree").val(degree);
        
      

    }
    

    //Birthdate
    var regexID = /Place\s*&\s*date\s*of\s*birth\s*:\s*([\w\s,]+)\s*(\d{2}\s*(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember)\s*\d{4})/;
    var regexEN = /Place\s*&\s*date\s*of\s*birth\s*:\s*([\w\s,]+)\s*(\d{2}\s*(?:January|February|March|April|May|June|July|August|September|October|November|December)\s*\d{4})/;
    var matchID = regexID.exec(text);
    var matchEN = regexEN.exec(text);

    var formattedDate;
    if (matchID && matchID.length > 1) {

         formattedDate = moment(matchID[2].trim(), "DD MMMM YYYY").format("YYYY-MM-DD");
        if (!moment(formattedDate, "YYYY-MM-DD").isValid()) {

            var date = matchID[2].trim();
            var fotamtedDate_ = (formatedToEnDate(date));
            formattedDate = moment(fotamtedDate_, "DD MMMM YYYY").format("YYYY-MM-DD");
           
        }
    }
    if (matchEN && matchEN.length > 1) {
 
        formattedDate = moment(matchEN[2].trim(), "DD MMMM YYYY").format("YYYY-MM-DD");
        if (!moment(formattedDate, "YYYY-MM-DD").isValid()) {

            var date = matchEN[2].trim();
            var fotamtedDate_ = (formatedToEnDate(date));
            formattedDate = moment(fotamtedDate_, "DD MMMM YYYY").format("YYYY-MM-DD");
            console.log(formattedDate);
         
        }
    }
    $("#birthdate").val(formattedDate);
 
  

    //Skillset
    var regexFramework = /Framework\/Library\s*:\s*(.*)/;
    var matchFramework = regexFramework.exec(text);
    var regexProgLang = /Programming Language\s*:\s*(.*)/;
    var matchProgLang = regexProgLang.exec(text);
    var regexDatabase = /Database\s*:\s*(.*)/;
    var matchDatabase = regexDatabase.exec(text);

    var skillset;

        if (matchFramework && matchFramework.length > 1) {
            var frameworks = matchFramework[1].split(',').map(function (item) { return item.trim(); });

            if (frameworks.length > 0 && frameworks[frameworks.length - 1].endsWith('.')) {
                frameworks[frameworks.length - 1] = frameworks[frameworks.length - 1].replace(/\.$/, '');
            }
        }

        if (matchProgLang && matchProgLang.length > 1) {
            var progLang = matchProgLang[1].split(',').map(function (item) { return item.trim(); });

            if (progLang.length > 0 && progLang[progLang.length - 1].endsWith('.')) {
                progLang[progLang.length - 1] = progLang[progLang.length - 1].replace(/\.$/, '');
            }

            skillset = frameworks.concat(progLang);
        }

        if (matchDatabase && matchDatabase.length > 1) {
            var database = matchDatabase[1].split(',').map(function (item) { return item.trim(); });

            if (database.length > 0 && database[database.length - 1].endsWith('.')) {
                database[database.length - 1] = database[database.length - 1].replace(/\.$/, '');
            }

            skillset = skillset.concat(database);
        }


        const skillSelect = $("#skillset");
  
        skillset.forEach((value) => {
            const optionNotExists =
                skillSelect.find("option[value='" + value + "']").length === 0;

            if (optionNotExists) {
                const newOption = new Option(value, value, true, true);
                skillSelect.append(newOption).trigger("change");
            }
        });
        skillSelect.val(skillset).trigger("change");
    
}


function formatedToEnDate(tanggalIndonesia){
  
    var bagianTanggal = tanggalIndonesia.split(' ');
    var tanggal = bagianTanggal[0];
    var bulan = bagianTanggal[1];
    var tahun = bagianTanggal[2];

    // Konversi nama bulan ke nama bulan dalam bahasa Inggris
    var bulanInggris;
    switch (bulan) {
        case 'Januari':
            bulanInggris = 'January';
            break;
        case 'Februari':
            bulanInggris = 'February';
            break;
        case 'Maret':
            bulanInggris = 'March';
            break;
        case 'April':
            bulanInggris = 'April';
            break;
        case 'Mei':
            bulanInggris = 'May';
            break;
        case 'Juni':
            bulanInggris = 'June';
            break;
        case 'Juli':
            bulanInggris = 'July';
            break;
        case 'Agustus':
            bulanInggris = 'August';
            break;
        case 'September':
            bulanInggris = 'September';
            break;
        case 'Oktober':
            bulanInggris = 'October';
            break;
        case 'November':
            bulanInggris = 'November';
            break;
        case 'Desember':
            bulanInggris = 'December';
            break;
        default:
            console.error('Bulan tidak valid');
            break;
    }

    // Menggabungkan tanggal, bulan (dalam bahasa Inggris), dan tahun menjadi format tanggal bahasa Inggris
    var tanggalBahasaInggris = tanggal + ' ' + bulanInggris + ' ' + tahun;

    return tanggalBahasaInggris;

}


function ClearScreenSave() {
    $("#nonrasid").val("");
    $("#Name").val(""); //value insert dari id pada input

    $("#position").val(null).trigger("change");
    $("#skillset").val(null).trigger("change");
    $("#birthdate").val("");
    $("#degree").val("");
    $("#ipk").val("");
    $("#UniversityName").val("");
    $("#domicile").val("");
    $("#age1").val("");
    $("#level").val("");
    $("#experience_year").val("");
    $("#experience_month").val("");
    $("#filteringby").val("");
    $('input[name="nego"]').prop("checked", false);
    $("#notice").val("");
    $("#negotiable").prop("checked", false);
    $("#financial").prop("checked", false);
    $("#rawcv").val("");
    $("#bercacv").val("");
    $("#english").val("");
    $("#current").val("");
    $("#expected").val("");
    $("#selectProvinces").val(null).trigger("change"); // Kosongkan pilihan select
    $("#UniversityName").val("").trigger("change");
    $("input[required_],select[required_]").each(function () {
        var input = $(this);
        input.next(".error-message_").hide();

        $(".error-format-ipk").hide();
    });

    $(".position").closest(".form-group").find(".error-message").hide();
    $(".skillset").closest(".form-group").find(".error-message").hide();
    //$('.selectRegencies').closest('.form-group').find('.error-message').hide();

    $(".selectUniversity").closest(".form-group").find(".error-message-u").hide();

    var saveButton = document.getElementById("Save");

    // Menonaktifkan tombol
    saveButton.disabled = false;

    // Menambahkan pesan jika diperlukan
    saveButton.innerHTML = "Save"; // Optional: Change button text
}




document.getElementById('fileInput2').addEventListener('change', function (event) {
    ClearScreenSave();
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function () {
        const arrayBuffer = reader.result;

        // Convert arrayBuffer to Uint8Array
        const uint8Array = new Uint8Array(arrayBuffer);

        // Use mammoth to extract text from Word document
        mammoth.extractRawText({ arrayBuffer: uint8Array })
            .then(function (result) {
                const text = result.value;
                console.log(text);

                extractInformation(text);
            })
            .catch(function (err) {
                console.error("Error:", err);
            });
    };

    reader.readAsArrayBuffer(file);
});
