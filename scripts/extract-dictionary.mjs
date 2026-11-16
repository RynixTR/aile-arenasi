import {readFileSync,writeFileSync} from 'node:fs';
const src=readFileSync('server/src/turkish-dictionary.txt','utf8');
const words=[...new Set(src.split(/\r?\n/).map(s=>s.split(' [')[0].trim().toLocaleLowerCase('tr-TR')).filter(s=>/^[abcçdefgğhıijklmnoöprsştuüvyz]{2,24}$/u.test(s)&&!/(küfür|aptal|salak|sik|amcık|orospu|piç|yarrak|göt|bok)/u.test(s)))].sort();
writeFileSync('server/src/turkish-words.ts','// Zemberek-NLP master-dictionary; Apache-2.0.\nexport const turkishWords: string[] = '+JSON.stringify(words)+';\n');
console.log(words.length);
