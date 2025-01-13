import config from '../odv_configuration.json';

export function getConfig() {
  return config;
}


export function getDataSources() {
  return config.data_sources
}

export function getDataSourceByName(data_source_name) {
  return config.data_sources.find(data_source => data_source.name === data_source_name)
}


export function getDashboards() {
  return config.dashboards
}

export function getDashboardByName(dashboard_name) {
  return config.dashboards.find(dashboard => dashboard.name === dashboard_name)
}

export function getDatasets() {
  return config.datasets
}

export function getDatasetByName(dataset_name) {
  return config.datasets.find(dataset => dataset.name === dataset_name)
}


export function getVisualisations() {
  return config.visualisations
}

export function getVisualisationByName(visualisation_name) {
  return config.visualisations.find(visualisation => visualisation.name === visualisation_name)
}
