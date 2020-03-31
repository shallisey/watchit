#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');
const program = require('caporal');
const fs = require('fs');
const { spawn } = require('child_process');
const chalk = require('chalk');

program
  .version('0.0.1')
  .argument('[filename]', 'Name of a file to execute.')
  .action(async ({ filename }) => {
    const name = filename || 'index.js';
    try {
      await fs.promises.access(name);
    } catch (err) {
      throw new Error(`Could not find the file ${name}`);
    }

    let proc;
    const start = debounce(() => {
      if (proc) {
        proc.kill();
      }
      console.log(chalk.blue('>>>>> Starting process....'));
      proc = spawn('node', [name], { stdio: 'inherit' });
    }, 100);

    chokidar
      .watch('.', {
        //
        ignored: /\.git.|node_modules/
      })
      //when a file is created or sees a file in a directory for the first time you start program
      .on('add', start)
      //when a file is changed in the directory
      .on('change', start)
      //when a file is removed or "unlinked" from directory
      .on('unlink', start);
  });

program.parse(process.argv);
