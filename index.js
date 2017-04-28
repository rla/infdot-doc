#! /usr/bin/env node
const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const parse = require('./lib/parse');
const settings = require('./lib/settings');
const render = require('./lib/render');

const argv = yargs
    .option('in', {
        alias: 'i',
        describe: 'input file'
    })
    .option('out', {
        alias: 'o',
        describe: 'output file'
    })
    .demandOption(['in', 'out'])
    .argv;

const convert = async (input, output) => {
    const absolute = path.resolve(input);
    const directory = path.dirname(absolute);
    const blocks = parse(fs.readFileSync(input, 'utf8'));
    const config = settings.extract(blocks);
    config.setDirectory(directory);
    return render(blocks, config, output);
};

if (argv.in && argv.out) {
    convert(argv.in, argv.out).catch((err) => {
        process.stderr.write(`${err}\n`, () => {
            process.exit(1);
        });
    });
}
