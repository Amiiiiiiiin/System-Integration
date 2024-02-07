// npm install js-yaml xml2js csv-parse glob
// node script.js
const fs = require('fs').promises;
const yaml = require('js-yaml');
const xml2js = require('xml2js');
const { parse } = require('csv-parse/sync');
const glob = require('glob');

const readTxt = async (content) => content;

const readXml = async (content) => {
    const parser = new xml2js.Parser();
    return parser.parseStringPromise(content);
    }

const readYaml = async (content) => yaml.load(content);

const readCsv = async (content) => parse(content, { columns: true });

const readJson = async (content) => JSON.parse(content);

const fileHandler = {
    '.txt': readTxt,
    '.xml': readXml,
    '.yaml': readYaml,
    '.yml': readYaml,
    '.csv': readCsv,
    '.json': readJson,
};

async function readFiles(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const fileType = filePath.slice(filePath.lastIndexOf('.')).toLowerCase();
    
    if (fileType in fileHandler) {
        return fileHandler[fileType](content);
    }
}

async function main() {
    const filePattern = ['*.txt', '*.xml', '*.yaml', '*.yml', '*.json', '*.csv'];
    const excludeFile = ['package.json', 'package-lock.json', 'node_modules/*'];

    for (const pattern of filePattern) {
        const files = glob.sync(pattern, { ignore: excludeFile });
        for (const filePath of files) {
            const parsedContent = await readFiles(filePath);

            if (parsedContent !== null) {
                console.log(`${filePath}:`);
                console.log(JSON.stringify(parsedContent, null, 0));
            }
        }
    }
}

main();