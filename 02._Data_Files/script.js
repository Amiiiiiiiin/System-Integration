// npm install js-yaml xml2js csv-parse glob
// node script.js
const fs = require('fs').promises;
const yaml = require('js-yaml');
const xml2js = require('xml2js');
const { parse } = require('csv-parse/sync');
const glob = require('glob');

async function readAndParseFile(filePath) {
    const content = await fs.readFile(filePath, 'utf8');

    if (filePath.endsWith('.txt')) {
        return content;
    } else if (filePath.endsWith('.xml')) {
        const parser = new xml2js.Parser();
        return parser.parseStringPromise(content);
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

function processFiles() {
    const filePatterns = ['*.txt', '*.xml', '*.yaml', '*.yml', '*.json', '*.csv'];
    const excludeFiles = ['package.json', 'package-lock.json', 'node_modules'];

    filePatterns.forEach(pattern => {
        const files = glob.sync(pattern, { ignore: excludeFiles.map(file => `**/${file}`) });
        files.forEach(async (filePath) => {
            if (!excludeFiles.includes(filePath)) {
                const parsedContent = await readAndParseFile(filePath);
                if (parsedContent !== null) {
                    console.log(`${filePath}:`);
                    console.log(parsedContent);
                } else {
                    console.log(`Skipped unsupported file format: ${filePath}`);
                }
            }
        });
    });
}


processFiles();
