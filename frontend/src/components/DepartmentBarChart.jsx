import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// This is a necessary step to use Chart.js with react-chartjs-2
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DepartmentBarChart = ({ chartData }) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: "Today's Vehicle Entries by Department",
                font: {
                    size: 18
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1 // Ensure y-axis shows whole numbers for counts
                }
            }
        }
    };

    const data = {
        labels: chartData.map(item => item.department_name), // e.g., ['IT', 'HR', 'Security']
        datasets: [
            {
                label: 'Number of Entries',
                data: chartData.map(item => item.entry_count), // e.g., [12, 8, 15]
                backgroundColor: 'rgba(0, 123, 255, 0.6)',
                borderColor: 'rgba(0, 123, 255, 1)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="chart-container">
            <Bar options={options} data={data} />
        </div>
    );
};

export default DepartmentBarChart;