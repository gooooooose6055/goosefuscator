const fs = require('fs');

function restore(file) {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/rawget\(type\(getfenv\)=="?\s*function\\?\s*"?[a-zA-Z\s0-9()]*or\s*_G/g, 'rawget(_G');
  content = content.replace(/rawget\(type\(getfenv\)==" function\\ and getfenv\(0\) or _G/g, 'rawget(_G');
  
  // Safe replacement
  content = content.replace(/rawget\(_G/g, 'rawget((type(getfenv)=="function" and getfenv(0) or _G)');
  fs.writeFileSync(file, content);
}

restore('c:/Users/semmy/Downloads/Goosefuscator-pella/app/obfuscator/security.js');
restore('c:/Users/semmy/Downloads/Goosefuscator-pella/app/obfuscator/compress.js');
restore('c:/Users/semmy/Downloads/Goosefuscator-pella/app/obfuscator/transforms.js');
restore('c:/Users/semmy/Downloads/Goosefuscator-pella/app/obfuscator/transforms2.js');
restore('c:/Users/semmy/Downloads/Goosefuscator-pella/app/obfuscator/vm.js');
