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
        const positionChart = topPosition.map(item => item.topPosition);
        tableData = statistic.table
      
        document.getElementById("topPosition").textContent= statistic.topPosition[0]["position"]
        console.log()
        document.getElementById("topLevel").textContent= statistic.data[0]["level"]
        document.getElementById("topSkill").textContent= statistic.data[1]["skill"]
        document.getElementById("skillsetTable").textContent= "Top 5 Skill Candidate "+statistic.data[0]["level"]+ " Level"
        chart(labelChart,countChart, positionChart)
        table()
    }})
 
    const footer = (tooltipItems, data) => {
      const positionData = data.datasets[tooltipItems[0].datasetIndex].positions[tooltipItems[0].index];
      return `Position: ${positionData.position}, Count: ${positionData.count}`;
    };
function chart(labelChart,countChart, positionChart){
    const salaryChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labelChart,
            datasets: [{
              label: 'Total Candidate',
              data: countChart,
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
              ],
              hoverOffset: 10,
              weight: 50,
              borderColor: '#fff'
            }]
        },
        options: {
         
          plugins: {
            tooltip: {
              callbacks: {
                footer: function (tooltipItems) {
                  const count= [10, 12, 15];
                  const datasetIndex = tooltipItems[0].dataIndex;
                  console.log(positionChart[datasetIndex])
                  const positionData = positionChart[datasetIndex];
                  return `\nTop Position: ${positionData}`;
                },
              }
            }
          }
        }
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