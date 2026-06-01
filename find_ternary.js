const fs = require('fs');
const path = require('path');
const babel = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('src');

files.forEach(file => {
  const code = fs.readFileSync(file, 'utf8');
  try {
    const ast = babel.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'classProperties', 'dynamicImport']
    });

    traverse(ast, {
      ConditionalExpression(path) {
        const consequent = generate(path.node.consequent).code;
        const alternate = generate(path.node.alternate).code;
        if (consequent === alternate) {
          console.log(`Found in ${file} at line ${path.node.loc.start.line}:`);
          console.log(generate(path.node).code);
        }
      }
    });
  } catch (e) {
    // Ignore parse errors
  }
});
