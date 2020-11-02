import { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import _ from 'lodash'

import './chart-panel-styles.css'

// chart config object
const options = {
    scales: {
        yAxes: [
            {
                type: 'linear',
                display: true,
                position: 'left',
                id: 'y-axis-1',
            },
            {
                type: 'linear',
                display: true,
                position: 'right',
                id: 'y-axis-2',
                gridLines: {
                    drawOnArea: false,
                },
            },
        ],
    },
}

function ChartPanel({ dataSet, selectedDatasources, selectedCampaigns }) {

    const [chartData, setChartData] = useState({})
    const [chartTitle, setChartTitle] = useState('')

    // useEffect relies only on "dataSet" changes intentionally for render performance and UI-sync reasons
    useEffect(() => {
        // extracting the transforming the dataSet to a chart-usable format
        const labels = _.uniqBy(dataSet, 'Date').map((dataObj) => dataObj.Date)
        const clicks = _.map(dataSet, (dataObj) => dataObj.Clicks)
        const impressions = _.map(dataSet, (dataObj) => dataObj.Impressions)
        const data = {
            labels: labels,
            datasets: [
                {
                    label: 'Clicks',
                    data: clicks,
                    fill: false,
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y-axis-1',
                },
                {
                    label: 'Impressions',
                    data: impressions,
                    fill: false,
                    backgroundColor: 'rgb(54, 162, 235)',
                    borderColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y-axis-2',
                },
            ],
        }
        setChartData(data)
        setChartTitle(`${selectedDatasources.length === 0 ? 'All Datasources' : 'Datasource/s: ' + selectedDatasources.join(' and ')}; ${selectedCampaigns.length === 0 ? 'All Campaigns' : 'Campaign/s: ' + selectedCampaigns.join(' and ')} `)
    }, [dataSet])

    return (
        <div className='chart-panel col-sm-8'>
            {chartTitle}
            <Line data={chartData} options={options} />
        </div>
    )
}

export default ChartPanel