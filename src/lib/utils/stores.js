import { get, writable } from 'svelte/store';
import { getDashboards, getDataApps } from '$lib/utils/odv_config.js'

// Initial index state for dashboards, data sources
export const dashboardsIndex = writable([]);
export const dataAppsIndex = writable([]);
export const dataLoaded = writable(false);


/**
 * Adds a new dashboard object to the dashboardsIndex store.
 * 
 * @param {Object} dashboard - The dashboard object to add.
 * @param {string} dashboard.name - The name of the dashboard.
 */
export function initializeDashboards() {
  const initialStaticDashboards = getDashboards();
  if (initialStaticDashboards && Array.isArray(initialStaticDashboards)) {
    dashboardsIndex.update((currentDashboards) => {
      return [...currentDashboards, ...initialStaticDashboards];
    });
  } else {
    console.warn("initializeDashboards called with non-array or empty initialStaticDashboards.");
  }
}

export function initializeDataApps() {
  const initialStaticDataApps = getDataApps();
  if (initialStaticDataApps && Array.isArray(initialStaticDataApps)) {
    dataAppsIndex.update((currentDataApps) => {
      return [...currentDataApps, ...initialStaticDataApps];
    });
  } else {
    console.warn("initializeDataApps called with non-array or empty initialStaticDataApps.");
  }
}

export function initializeAppStores() {
  initializeDashboards();
  initializeDataApps();
}

export function createDashboard(dashboard) {
  dashboardsIndex.update((currentDashboards) => {
      // Check if the dashboard already exists (e.g., by name) to avoid duplicates
      if (currentDashboards.some(d => d.name === dashboard.name)) {
          console.warn(`Dashboard with name "${dashboard.name}" already exists.`);
          return currentDashboards;
      }
      // Add the new dashboard to the list
      return [...currentDashboards, dashboard];
  });
}

export function createDataApp(dataApp) {
  dataAppsIndex.update((currentDataApps) => {
      // Check if the data app already exists (e.g., by name) to avoid duplicates
      if (currentDataApps.some(da => da.name === dataApp.name)) {
          console.warn(`Data app with name "${dataApp.name}" already exists.`);
          return currentDataApps;
      }
      // Add the new data app to the list
      console.log(`Successfully added ${dataApp.name} to dataAppsIndex`)
      return [...currentDataApps, dataApp];
  });
}

/**
 * Function to delete a dashboard by name.
 * @param {string} name - The name of the dashboard to delete.
 */
export function deleteDashboard(name) {
  dashboardsIndex.update((dashboards) => {
    if (dashboards.some((dashboard) => dashboard.name === name)) {
      return dashboards.filter((dashboard) => dashboard.name !== name); // Remove the dashboard by name
    }
    console.warn(`Dashboard with name "${name}" does not exist.`);
    return dashboards; // No changes if the name doesn't exist
  });
}

/**
 * Function to update a dashboard by name.
 * @param {string} name - The name of the dashboard to update.
 * @param {object} updates - The updates to apply to the dashboard.
 */
export function updateDashboard(name, updates) {
  dashboardsIndex.update((dashboards) => {
    const index = dashboards.findIndex((dashboard) => dashboard.name === name);
    if (index !== -1) {
      const updatedDashboard = { ...dashboards[index], ...updates };
      return [
        ...dashboards.slice(0, index),
        updatedDashboard,
        ...dashboards.slice(index + 1),
      ];
    }
    console.warn(`Dashboard with name "${name}" does not exist.`);
    return dashboards; // No changes if the dashboard doesn't exist
  });
}

/**
 * Function to get a dashboard object by name.
 * @param {string} name - The name of the dashboard to fetch.
 * @returns {object} - The dashboard object if found, or an empty object if not found.
 */
export function getDashboardByName(name) {
  const dashboards = get(dashboardsIndex); // Get the current state of the store
  return dashboards.find((dashboard) => dashboard.name === name) || {};
}

/**
 * Function to get a data app object by name.
 * @param {string} name - The name of the dashboard to fetch.
 * @returns {object} - The dashboard object if found, or an empty object if not found.
 */
export function getDataAppByName(name) {
  const dataApps = get(dataAppsIndex); // Get the current state of the store
  return dataApps.find((dataApp) => dataApp.name === name) || {};
}

export function getDashboardsForDataApp(dashboardNames) {
  if (dashboardNames) {
    const allDashboards = get(dashboardsIndex);

    return dashboardNames.flatMap((name) =>
      allDashboards.filter((dashboard) => dashboard.name === name)
    );
  } else {
    console.log('No dashboard found for active data app');
    return [];
  }
}

export function addDashboardToDataApp(dataAppName, dashboardName) {
  dataAppsIndex.update((currentDataApps) => {
    const dataAppIndex = currentDataApps.findIndex(
      (dataApp) => dataApp.name === dataAppName
    );

    if (dataAppIndex !== -1) {
      const updatedDataApps = currentDataApps.map((dataApp, index) => {
        if (index === dataAppIndex) {
          // Check if the dashboard already exists
          if (dataApp.dashboards.some((dashboard) => dashboard === dashboardName)) {
            console.warn(
              `Dashboard with name "${dashboardName}" already exists in DataApp "${dataAppName}".`
            );
            return dataApp; // Return the original dataApp without changes
          }
          return {
            ...dataApp,
            dashboards: [...dataApp.dashboards, dashboardName],
          };
        }
        return dataApp;
      });
      console.log(
        `Dashboard "${dashboardName}" added to DataApp "${dataAppName}".`
      );
      return updatedDataApps;
    } else {
      console.warn(`DataApp with name "${dataAppName}" does not exist.`);
      return currentDataApps; // No changes if the DataApp doesn't exist
    }
  });
}

export function updateDashboardsInDataApp(dataAppName, dashboardNames) {
  dataAppsIndex.update((currentDataApps) => {
    const dataAppIndex = currentDataApps.findIndex(
      (dataApp) => dataApp.name === dataAppName
    );

    if (dataAppIndex === -1) {
      console.warn(`DataApp with name "${dataAppName}" does not exist.`);
      return currentDataApps;
    }

    const updatedDataApps = currentDataApps.map((dataApp, index) => {
      if (index !== dataAppIndex) return dataApp;

      const existingDashboards = new Set(dataApp.dashboards);
      const dashboardsToAdd = [];

      dashboardNames.forEach((name) => {
        const trimmedName = name.trim();
        if (!existingDashboards.has(trimmedName)) {
          dashboardsToAdd.push(trimmedName);
          existingDashboards.add(trimmedName);
        } else {
          console.warn(
            `Dashboard "${trimmedName}" already exists in DataApp "${dataAppName}".`
          );
        }
      });

      if (dashboardsToAdd.length === 0) return dataApp;

      console.log(
        `Dashboards "${dashboardsToAdd.join('", "')}" added to DataApp "${dataAppName}".`
      );

      return {
        ...dataApp,
        dashboards: [...dataApp.dashboards, ...dashboardsToAdd],
      };
    });

    return updatedDataApps;
  });
}


export function createFiltersStore() {
  return writable([]);
}