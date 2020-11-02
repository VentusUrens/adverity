import './filter-panel-styles.css'

import Select from 'react-select'

function FilterPanel({ datasources, campaigns, onFilter, setSelectedDatasources, setSelectedCampaigns }) {

    return (
        <div className='filter-panel col-sm-2 offset-sm-1'>
            <h5>Filter dimension values</h5>

            <h6 className="mt-4">Datasource</h6>
            <Select isMulti={true} options={datasources} onChange={(selectedDatasourcesArr) => { setSelectedDatasources(selectedDatasourcesArr) }} />

            <h6 className="mt-4" >Campaign</h6>
            <Select isMulti={true} options={campaigns} onChange={(selectedCampaignsArr) => { setSelectedCampaigns(selectedCampaignsArr) }} />

            <input type='button' className="btn btn-primary mt-3" value="Apply" onClick={() => { onFilter() }} />
        </div>
    )
}
export default FilterPanel