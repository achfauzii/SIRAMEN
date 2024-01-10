$(document).ready(function () {
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
        const topPosition = statistic.allLevel;

        // Creating two variables for 'position' and 'count'
        const labelChart = topPosition.map(item => item.level);
        const countChart = topPosition.map(item => item.count);
        tableData = statistic.table
      
        document.getElementById("topPosition").textContent= statistic.topPosition[0]["position"]
        console.log()
        document.getElementById("topLevel").textContent= statistic.data[0]["level"]
        document.getElementById("topSkill").textContent= statistic.data[1]["skill"]
        document.getElementById("skillsetTable").textContent= "Top 5 Skill Candidate "+statistic.data[0]["level"]+ " Level"
        chart(labelChart,countChart)
        table()
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
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966CC',
                '#FF8C00',
                '#87CEEB',
                '#FFD700',
                '#32CD32',
                '#FF4500',
                '#9370DB',
                '#40E0D0',
                '#FF6347',
                '#8A2BE2',
                '#00FF7F',
                '#FF5733',
                '#5F9EA0',
                '#FF1493',
                '#6A5ACD',
            ],
              hoverOffset: 4
            }]
          },
    });
}    


function table(){
    var data = tableData

    var table = $('#tableSkills').DataTable({
      "searching": false,
      "paging": false,
      "ordering": false
    });

        function populateTable() {
            table.clear();

            data.forEach(function (entry, index) {
                table.row.add([index + 1, entry.skill, entry.count]).draw();
            });
        }
        populateTable();
}
}
)