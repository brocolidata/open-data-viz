#! /usr/bin/env node

// import fs from 'fs';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import { parse } from 'yaml';

// // Get __dirname in ES Modules
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // Paths
// const configDirName = 'odv_config';
// const configDir = path.resolve(__dirname, configDirName);
// const outputFile = path.resolve(__dirname, 'src/odv_configuration.json');

// async function parseAndMergeYaml() {
//   try {
//     // Read all YAML files in the config directory
//     const files = fs.readdirSync(configDir).filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

//     // Parse and merge the YAML content
//     const mergedConfig = files.reduce((acc, file) => {
//       const filePath = path.join(configDir, file);
//       const fileContent = fs.readFileSync(filePath, 'utf8');
//       const parsedYaml = parse(fileContent);

//       // Merge content into accumulator
//       return { ...acc, ...parsedYaml };
//     }, {});

//     // Write the merged JSON to the output file
//     fs.writeFileSync(outputFile, JSON.stringify(mergedConfig, null, 2));
//     console.log(`Successfully merged YAML files and wrote output to: ${outputFile}`);
//   } catch (error) {
//     console.error('Error processing YAML files:', error);
//     process.exit(1);
//   }
// }

// // Execute the script
// parseAndMergeYaml();


// Import necessary packages
import fs from 'fs-extra';
import path from 'path';
import * as yaml from 'yaml';

// Define the folder containing the YAML files and output location
const configFolderPath = path.join(process.cwd(), 'odv_config');
const outputFilePath = path.join(process.cwd(), 'src/odv_configuration.json');

// Define the high-level keys that should be merged as arrays
const mergeableKeys = ['dashboards', 'datasets', 'data_sources', 'visualisations']; 

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
