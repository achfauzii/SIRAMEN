$(document).ready(function () {
const ctx = document.getElementById('statisticChart').getContext('2d');
const ctx2 = document.getElementById('statisticChart2').getContext('2d');


  $.ajax({
    url: "https://localhost:7177/api/Shortlist/Statistic",
    type: "GET",
    datatype: "json",
    contentType: "application/json; charset=utf-8",
    headers: {
      Authorization: "Bearer " + sessionStorage.getItem("Token"),
    },
    success: function (statistic) {
        const topPosition = statistic.topPosition;

        // Creating two variables for 'position' and 'count'
        const labelChart = topPosition.map(item => item.position);
        const countChart = topPosition.map(item => item.count);
        tableData = statistic.table

        document.getElementById("topPosition").textContent= labelChart[0]
        document.getElementById("topLevel").textContent= labelChart[1]
        document.getElementById("topSkill").textContent= labelChart[2]
        document.getElementById("skillsetTable").textContent= "Top 5 Skill Candidate "+labelChart[1]+ " Level"
        chart(labelChart,countChart)
        chart2(labelChart,countChart)
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
                'rgb(255, 99, 132)',
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)',
              ],
              hoverOffset: 4
            }]
          },
    });
}    
function chart2(labelChart,countChart){
    const salaryChart = new Chart(ctx2, {
        type: 'pie',
        data: {
            labels: labelChart,
            datasets: [{
              label: 'Total',
              data: countChart,
              backgroundColor: [
                'rgb(75, 192, 192)',
                'rgb(255, 159, 64)',
                'rgb(153, 102, 255)',
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