const fs = require('fs');
const yaml = require('js-yaml');
const xml2js = require('xml2js');
const parse = require('csv-parse/lib/sync');
const util = require('util');
const glob = require('glob');

const readFile = util.promisify(fs.readFile);
const globPromise = util.promisify(glob);
const parseXml = util.promisify(new xml2js.Parser().parseString);

async function readAndParseFile(filePath) {
  const content = await readFile(filePath, 'utf8');

  if (filePath.endsWith('.txt')) {
    return content;
  } else if (filePath.endsWith('.xml')) {
    return await parseXml(content);
  } else if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return yaml.load(content);
  } else if (filePath.endsWith('.json')) {
    return JSON.parse(content);
  } else if (filePath.endsWith('.csv')) {
    return parse(content, {
      columns: true,
      skip_empty_lines: true
    });
  } else {
    return null;
  }
}

async function processFiles() {
  const filePatterns = ['*.txt', '*.xml', '*.yaml', '*.yml', '*.json', '*.csv'];

  for (const pattern of filePatterns) {
    const files = await globPromise(pattern);
    for (const filePath of files) {
      const parsedContent = await readAndParseFile(filePath);
      if (parsedContent !== null) {
        console.log(`${filePath}:`);
        console.log(parsedContent);
      } else {
        console.log(`Skipped unsupported file format: ${filePath}`);
      }
    }
  }
}

processFiles().catch(console.error);
