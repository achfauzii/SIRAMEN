$(document).ready(function () {

    fetch('https://localhost:7177/api/EmployeePlacements', {
        method: 'GET', // Metode HTTP seperti GET, POST, PUT, dll.
        headers: {
            'Content-Type': 'application/json', // Tipe konten yang diminta
            'Authorization': 'Bearer YOUR_ACCESS_TOKEN', // Header otorisasi jika diperlukan
            // header lainnya jika diperlukan
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const uniquePlacements = {};
            //Mengunmoulkan placement yang terbaru
            data.data.forEach(item => {
                if (!uniquePlacements[item.accountId] || uniquePlacements[item.accountId].placementStatusId < item.placementStatusId) {
                    uniquePlacements[item.accountId] = {
                        accountId:item.accountId,
                        placementStatusId: item.placementStatusId,
                        startDate: item.startDate,
                        endDate: item.endDate
                    };
                }
            });

            const newData = {};

            for (const accountId in uniquePlacements) {
           
                const placement = uniquePlacements[accountId];
                if (placement.endDate !== null && placement.startDate !== null) {
                    const end = new Date(placement.endDate);
                    const now = new Date();

                    var timeDiff = end.getTime() - now; // Menghitung selisih dalam milidetik
                    var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
                    var monthsRemaining = Math.floor(daysremain / 30); // Menghitung bulan
                    var daysInMonth = daysremain % 30; // Menghitung sisa hari

                    if (monthsRemaining ==1) {
                        console.log(accountId);
                        console.log(daysInMonth);
                        console.log(monthsRemaining);
                    } 
                    
                }

             
            }
            console.log(newData);
               

     /*       var now = Date.now();
            var end = new Date(item.endDate);
            var timeDiff = end.getTime() - now; // Menghitung selisih dalam milidetik
            var daysremain = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Menghitung selisih dalam hari dan membulatkannya
            var monthsRemaining = Math.floor(daysremain / 30); // Menghitung bulan
            var daysInMonth = daysremain % 30; // Menghitung sisa hari

            if (monthsRemaining > 1) {

                uniquePlacements[accountId] = {

                    placementStatusId: item.placementStatusId,
                    startDate: item.startDate,
                    endDate: item.endDate
                };
            }*/
          


        })
        .catch(error => {
            // Tangani error
            console.error('There has been a problem with your fetch operation:', error);
        });

})