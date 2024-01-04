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
        var result = statistic.data;
        const labelChart = result.map(item => {
            return Object.values(item)[0];
          });
        tableData = statistic.table
        console.log(tableData)
        const countChart = result.map(item => item.count);
        document.getElementById("topPosition").textContent= labelChart[0]
        document.getElementById("topLevel").textContent= labelChart[1]
        document.getElementById("topSkill").textContent= labelChart[2]
        document.getElementById("skillsetTable").textContent= "Top 5 Skill Candidate "+labelChart[1]+ " Level"
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
                'rgb(255, 99, 132)',
                'rgb(255, 205, 86)',
                'rgb(54, 162, 235)',
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