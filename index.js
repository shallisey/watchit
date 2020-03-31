#!/usr/bin/env node

const debounce = require('lodash.debounce');
const chokidar = require('chokidar');

const start = debounce(() => {
  console.log('starting users program');
}, 200);

chokidar
  .watch('.')
  //when a file is created or sees a file in a directory for the first time you start program
  .on('add', start)
  //when a file is changed in the driectory
  .on('change', () => console.log('File changed'))
  //when a file is removed or "unlinked" from directory
  .on('unlink', () => console.log('File unlinked'));
