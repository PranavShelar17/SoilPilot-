const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    if (fs.statSync(file).isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('page.tsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src/app');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/^\s*([A-Z][a-zA-Z0-9_]+\s*:\s*React\.FC[^=]*\s*=)/gm, 'const $1');
  fs.writeFileSync(file, content);
});
console.log('Fixed missing const keywords');
