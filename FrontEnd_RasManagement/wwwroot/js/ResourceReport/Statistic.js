const ctx = document.getElementById('statisticChart').getContext('2d');

  $.ajax({
    url: "https://localhost:7177/api/Shortlist/Statistic",
    type: "GET",
    datatype: "json",
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (statistic) {
        var result = statistic.data;
        const labelChart = result.map(item => {
            return Object.values(item)[0];
          });
        const countChart = result.map(item => item.count);
        document.getElementById("topPosition").textContent= labelChart[0]
        document.getElementById("topLevel").textContent= labelChart[1]
        document.getElementById("topSkill").textContent= labelChart[2]
        chart(labelChart,countChart)
    }})

function chart(labelChart,countChart){
    const salaryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labelChart,
            datasets: [{
              label: 'Total',
              data: countChart,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 205, 86)'
              ],
              hoverOffset: 4
            }]
          },
    });
}    
