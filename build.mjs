import {build} from 'esbuild';
import fs from 'node:fs/promises';
import React from 'react';
import {renderToString} from 'react-dom/server';
import events from './data/conferences.json' with {type:'json'};
import materials from './data/materials.json' with {type:'json'};

await fs.rm('dist',{recursive:true,force:true});
await fs.mkdir('dist/assets',{recursive:true});
await fs.cp('public','dist',{recursive:true});
await build({entryPoints:['src/client.jsx'],bundle:true,minify:true,outfile:'dist/assets/app.js',format:'esm',define:{'process.env.NODE_ENV':'"production"'}});
await build({entryPoints:['src/App.jsx'],bundle:true,platform:'node',format:'esm',outfile:'.build/App.mjs',packages:'external'});
const {default:App}=await import('./.build/App.mjs?'+Date.now());
await fs.copyFile('src/style.css','dist/assets/style.css');
const routes=['/','/about/','/conferences/','/sitemap/',...events.map(e=>`/conferences/${e.year}/`),...materials.map(m=>`/conferences/${m.year}/materials/${m.id}/`)];
const titles={'/':'Poisson Geometry — International Community','/about/':'About — Poisson Geometry','/conferences/':'Conferences & Schools — Poisson Geometry','/sitemap/':'Sitemap — Poisson Geometry'};
for(const path of [...routes,'/404/']){
 const event=events.find(e=>path===`/conferences/${e.year}/`);
 const material=materials.find(m=>path===`/conferences/${m.year}/materials/${m.id}/`);
 const title=(material?`${material.title} — Poisson ${material.year}`:null)||titles[path]||(event?`Poisson ${event.year} · ${event.city} — Poisson Geometry`:'Page not found — Poisson Geometry');
 const description=event?`Poisson ${event.year} in ${event.city}, ${event.country}. Conference information, organizing committee and historical record.`:'The international Poisson geometry community, its mathematics, conferences and schools around the world.';
 const markup=renderToString(React.createElement(App,{path}));
 const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title.replaceAll('&','&amp;')}</title><meta name="description" content="${description}"><link rel="icon" href="/assets/poisson-fish.png"><link rel="stylesheet" href="/assets/style.css"><link rel="canonical" href="https://poisson-geometry.github.io${path}"><script type="module" src="/assets/app.js"></script></head><body><div id="root">${markup}</div></body></html>`;
 const target=path==='/404/'?'dist/404.html':`dist${path}index.html`;
 await fs.mkdir(target.slice(0,target.lastIndexOf('/')),{recursive:true});await fs.writeFile(target,html);
}
await fs.writeFile('dist/sitemap.xml',`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map(path=>`<url><loc>https://poisson-geometry.github.io${path}</loc></url>`).join('')}</urlset>`);
await fs.writeFile('dist/robots.txt','User-agent: *\nAllow: /\nSitemap: https://poisson-geometry.github.io/sitemap.xml\n');
await fs.writeFile('dist/.nojekyll','');
console.log(`Built ${routes.length} pages, a 404 page, and an XML sitemap.`);
