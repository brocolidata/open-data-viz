import { get, writable } from 'svelte/store';
import { getDashboards } from '$lib/utils/odv_config.js'

// Initial state for dashboardsIndex
export const dashboardsIndex = writable([]);

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