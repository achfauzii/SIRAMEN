$(document).ready(function () {
  const ctx = document.getElementById("statisticChart").getContext("2d");

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
      const labelChart = topPosition.map((item) => item.level);
      const countChart = topPosition.map((item) => item.count);
      const positionChart = topPosition.map(
        (item) => item.topThreePositionbyLevel
      );
      tableData = statistic.sortedSkills;

      document.getElementById(
        "topPosition"
      ).innerHTML = `<a href='/ResourceReport/Index?position=${statistic.topThreePosition[0]["position"]}'>${statistic.topThreePosition[0]["position"]}</a>`;
      console.log();
      document.getElementById(
        "topLevel"
      ).innerHTML = `<a href='/ResourceReport/Index?level=${statistic.allLevel[0]["level"]}'>${statistic.allLevel[0]["level"]}</a>`;

      document.getElementById(
        "topSkill"
      ).innerHTML = `<a href='/ResourceReport/Index?skill=${statistic.sortedSkills[0]["key"]}'>${statistic.sortedSkills[0]["key"]}</a>`;

      // document.getElementById("skillsetTable").textContent= "Top 5 Skill Candidate "+statistic.allLevel[0]["level"]+ " Level"
      document.getElementById("skillsetTable").textContent =
        "Top 5 Skill Candidate " + "All" + " Level";
      chart(labelChart, countChart, positionChart);
      table();
    },
  });

  const footer = (tooltipItems, data) => {
    const positionData =
      data.datasets[tooltipItems[0].datasetIndex].positions[
        tooltipItems[0].index
      ];
    return `Position: ${positionData.position}, Count: ${positionData.count}`;
  };
  function chart(labelChart, countChart, positionChart) {
    const salaryChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: labelChart,
        datasets: [
          {
            label: "Total Candidate",
            data: countChart,
            backgroundColor: [
              "#FF6384",
              "#1261ff",
              "#FFCE56",
              "#4BC0C7",
              "#9966FF",
              "#FF9933",
              "#669966",
              "#FF6666",
              "#3366CC",
              "#FFCC66",
            ],
            hoverOffset: 10,
            weight: 50,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        plugins: {
          tooltip: {
            callbacks: {
              footer: function (tooltipItems) {
                const count = [10, 12, 15];
                const datasetIndex = tooltipItems[0].dataIndex;
                const positionData = positionChart[datasetIndex];
                return `\nTop Position \n1. ${positionData[0].position}: ${positionData[0].count} \n2. ${positionData[1].position}: ${positionData[1].count} \n3. ${positionData[2].position}: ${positionData[2].count}`;
              },
            },
          },
        },
      },
    });
  }

  function table() {
    var data = tableData;

    var table = $("#tableSkills").DataTable({
      searching: false,
      paging: false,
      ordering: false,
    });

    function populateTable() {
      table.clear();

      data.forEach(function (entry, index) {
        table.row
          .add([
            index + 1,
            `<a class='font-weight-bold' href='/ResourceReport/Index?skill=${entry.key}'>${entry.key}</a>`,
            entry.value,
          ])
          .draw();
      });
    }
    populateTable();
  }
});
