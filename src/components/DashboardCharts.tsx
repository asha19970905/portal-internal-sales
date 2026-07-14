'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Bar, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

export function PoChart({ data }: { data: number[] }) {
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
    datasets: [
      {
        label: 'Jumlah PO',
        data,
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        borderColor: 'rgb(37, 99, 235)',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  }
  return <Bar data={chartData} options={{ maintainAspectRatio: false }} />
}

export function ClaimChart({ open, close }: { open: number, close: number }) {
  const chartData = {
    labels: ['Open', 'Close'],
    datasets: [
      {
        data: [open, close],
        backgroundColor: [
          'rgba(245, 158, 11, 0.6)', // warning color for Open
          'rgba(16, 185, 129, 0.6)', // success color for Close
        ],
        borderColor: [
          'rgb(245, 158, 11)',
          'rgb(16, 185, 129)',
        ],
        borderWidth: 1,
      },
    ],
  }
  
  return <Pie data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
}
