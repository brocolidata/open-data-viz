#! /usr/bin/env node

// Import necessary packages
import fs from 'fs-extra';
import path from 'path';
import * as yaml from 'yaml';

// Define the environment variable name for the config folder
const CONFIG_FOLDER_ENV_VAR = 'ODV_CONFIG_FOLDER';

// Define the folder containing the YAML files and output location
// const configFolderPath = path.join(process.cwd(), 'odv_config');
// Determine the configuration folder path
const configFolderPath = process.env[CONFIG_FOLDER_ENV_VAR]
  ? path.resolve(process.cwd(), process.env[CONFIG_FOLDER_ENV_VAR])
  : path.join(process.cwd(), 'odv_config');
const outputFilePath = path.join(process.cwd(), 'static/config/odv_configuration.json');

// Define the high-level keys that should be merged as arrays
const mergeableKeys = ['dashboards', 'data_sources', 'data_apps']; 

// Function to read and parse YAML files
async function readYAMLFiles(folderPath) {
  const files = await fs.readdir(folderPath);
  const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

  const parsedConfigs = [];

  for (const file of yamlFiles) {
    const filePath = path.join(folderPath, file);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const parsedContent = yaml.parse(fileContent);
    parsedConfigs.push(parsedContent);
  }

  return parsedConfigs;
}

// Function to merge the YAML objects, with special handling for specific keys
function mergeConfigs(configs) {
  const merged = {};

  configs.forEach(config => {
    Object.keys(config).forEach(key => {
      if (mergeableKeys.includes(key)) {
        // If the key is one of the mergeable ones, merge the arrays
        if (!merged[key]) {
          merged[key] = [];
        }
        merged[key] = [...merged[key], ...config[key]];
      } else if (merged[key] && typeof merged[key] === 'object' && typeof config[key] === 'object') {
        // If both are objects, merge them recursively
        merged[key] = { ...merged[key], ...config[key] };
      } else if (!merged[key]) {
        // Otherwise, directly set the value
        merged[key] = config[key];
      }
    });
  });

  return merged;
}

// Function to write the merged config to a JSON file
async function writeMergedConfig(config) {
  const jsonContent = JSON.stringify(config, null, 2);
  await fs.writeFile(outputFilePath, jsonContent, 'utf8');
  console.log('Merged configuration saved to:', outputFilePath);
}

// Main execution
async function mergeYAMLConfig() {
  try {
    // Step 1: Read and parse all YAML files from the config folder
    const configs = await readYAMLFiles(configFolderPath);

    // Step 2: Merge the configurations
    const mergedConfig = mergeConfigs(configs);

    // Step 3: Write the merged configuration to a JSON file
    await writeMergedConfig(mergedConfig);
  } catch (error) {
    console.error('Error during YAML merge process:', error);
  }
}

// Execute the function
mergeYAMLConfig();
