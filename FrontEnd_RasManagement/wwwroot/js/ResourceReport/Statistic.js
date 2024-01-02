const ctx = document.getElementById('salaryChart').getContext('2d');

// Data contoh
const salaryRanges = ['1-2', '2-3', '3-4', '4-5', '5-6'];
const skillData = [5, 8, 12, 10, 6];
const positionData = [3, 6, 10, 8, 2];
const levelData = [2, 4, 8, 5, 3];
const skill2Data = [4, 7, 11, 9, 5];
const skill3Data = [3, 8, 3, 8, 4];

// Konfigurasi grafik
const salaryChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: salaryRanges,
        datasets: [
          {
              label: 'Skill Tertinggi (JavaScript)',
              borderColor: 'rgba(54, 162, 235, 1)',
              data: skillData,
              fill: false,
          },
          {
              label: 'Posisi Terbanyak (Backend)',
              borderColor: 'rgba(255, 99, 132, 1)',
              data: positionData,
              fill: false,
          },
          {
              label: 'Level Terbanyak (Senior Developer)',
              borderColor: 'rgba(255, 205, 86, 1)',
              data: levelData,
              fill: false,
          },
          {
              label: 'Skill2',
              borderColor: 'rgba(153, 102, 255, 1)',
              data: skill2Data,
              fill: false,
              hidden: true,
          },
          {
              label: 'Skill3',
              borderColor: 'rgba(255, 159, 64, 1)',
              data: skill3Data,
              fill: false,
              hidden: true,
          },
        ],
    },
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Rentang Gaji (juta)'
                }
            },
            y: {
                type: 'linear',
                title: {
                    display: true,
                    text: 'Jumlah Kandidat'
                }
            }
        },
        plugins: {
            legend: {
                onClick: (e, legendItem) => {
                    const index = legendItem.datasetIndex;
                    const chart = e.chart;
                    const meta = chart.getDatasetMeta(index);

                    // Toggle visibility saat legend di-klik
                    meta.hidden = meta.hidden === null ? !chart.data.datasets[index].hidden : null;
                    chart.update();
                }
            }
        }
    },
});
