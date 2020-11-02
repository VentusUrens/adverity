import { useState, useEffect } from 'react'
import _ from 'lodash'

import FilterPanel from '../../components/filter-panel/filter-panel-component'
import ChartPanel from '../../components/chart-panel/chart-panel-component'

function Dashboard() {

    const [completeData, setCompleteData] = useState([])
    const [filteredData, setFilteredData] = useState([])
    const [uniqueDatasources, setUniqueDatasources] = useState([])
    const [uniqueCampaigns, setUniqueCampaigns] = useState([])
    const [selectedDatasources, setSelectedDatasources] = useState([])
    const [selectedCampaigns, setSelectedCampaigns] = useState([])

    // initial CSV fetch, data transformation and population
    // whole dataSet stored in-memory for demo purposes
    useEffect(() => {
        fetch('http://adverity-challenge.s3-website-eu-west-1.amazonaws.com/DAMKBAoDBwoDBAkOBAYFCw.csv')
            .then(result => result.text())
            .then(resultText => {
                const [headerLine, ...dataLines] = _.split(resultText, '\n').filter((line) => line)
                const headers = _.split(headerLine, ',')

                const dataObjs = dataLines.map((dataLine) => {
                    const resultObj = _
                        .split(dataLine, ',')
                        .map(data => data.trim())
                        .reduce((obj, value, index) => ({
                            ...obj,
                            [headers[index]]: value
                        }), {})
                    return resultObj
                })

                setCompleteData(dataObjs)
                setFilteredData(dataObjs)
                setUniqueDatasources(_.uniqBy(dataObjs, 'Datasource').filter(dataObj => dataObj.Datasource).map(dataObj => { return { value: dataObj.Datasource, label: dataObj.Datasource } }))
                setUniqueCampaigns(_.uniqBy(dataObjs, 'Campaign').filter(dataObj => dataObj.Campaign).map(dataObj => { return { value: dataObj.Campaign, label: dataObj.Campaign } }))
            })
    }, [])

    // onFilter fn triggered on "Apply" btn click
    // dependent on the selected datasources and campaigns
    function onFilter() {
        let filteredDataBuffer = _.cloneDeep(completeData)
        const selectedDatasourcesNames = _.map(selectedDatasources, (datasourceObj) => datasourceObj.value)
        const selectedCampaignsNames = _.map(selectedCampaigns, (campaignObj) => campaignObj.value)
        if (selectedDatasourcesNames && selectedDatasourcesNames.length) {
            filteredDataBuffer = _.filter(filteredDataBuffer, (dataObj) => {
                return _.includes(selectedDatasourcesNames, dataObj.Datasource)
            })
        }
        if (selectedCampaignsNames && selectedCampaignsNames.length) {
            filteredDataBuffer = _.filter(filteredDataBuffer, (dataObj) => {
                return _.includes(selectedCampaignsNames, dataObj.Campaign)
            })
        }
        setFilteredData(filteredDataBuffer)
    }

    return (
        <div className="dashboard row">
            <FilterPanel
                datasources={uniqueDatasources}
                campaigns={uniqueCampaigns}
                onFilter={(selectedDatasources, selectedCampaigns) => onFilter(selectedDatasources, selectedCampaigns)}
                setSelectedDatasources={(selectedDatasourcesArr) => setSelectedDatasources(selectedDatasourcesArr)}
                setSelectedCampaigns={(selectedCampaignsArr) => setSelectedCampaigns(selectedCampaignsArr)} />
            <ChartPanel
                selectedDatasources={_.map(selectedDatasources, (datasourceObj) => datasourceObj.value)}
                selectedCampaigns={_.map(selectedCampaigns, (campaignObj) => campaignObj.value)}
                dataSet={filteredData} />
        </div>
    );
}

export default Dashboard;
