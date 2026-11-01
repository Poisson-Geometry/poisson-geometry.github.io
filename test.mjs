import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require('playwright');
const events=JSON.parse(await fs.readFile('data/conferences.json','utf8'));
const server=http.createServer(async(req,res)=>{
 try{let pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let file=path.join('dist',pathname);if(pathname.endsWith('/'))file+='index.html';const body=await fs.readFile(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.woff2':'font/woff2'})[ext]||'text/plain');res.end(body);}catch{res.writeHead(404);res.end(await fs.readFile('dist/404.html'));}
});
await new Promise(resolve=>server.listen(8124,'127.0.0.1',resolve));
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',args:['--no-sandbox']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:960}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('console',msg=>{if(msg.type()==='error'&&!msg.text().includes('404'))errors.push(msg.text());});
 const origin='http://127.0.0.1:8124';
 await page.goto(origin+'/');await page.evaluate(()=>document.fonts.ready);
 assert(await page.evaluate(()=>document.fonts.check('20px CMU')));
 assert(await page.locator('.brand img').evaluate(img=>img.naturalWidth>0));
 await page.screenshot({path:'home-desktop.png'});
 await page.getByRole('link',{name:'Explore the conferences'}).click();
 await page.locator('#search').fill('Japan');await page.waitForTimeout(100);
 assert.equal(await page.locator('.event-card').count(),1);await page.getByRole('link',{name:'Poisson 2006'}).click();
 await page.reload();assert.equal(await page.locator('h1').innerText(),'Poisson 2006');assert((await page.locator('main').innerText()).includes('Tokyo'));
 await page.goto(origin+'/conferences/?q=Gualtieri');await page.waitForTimeout(150);assert.equal(await page.locator('#search').inputValue(),'Gualtieri');assert.equal(await page.locator('.event-card').count(),1);
 await page.locator('#search').fill('not-a-conference');await page.waitForTimeout(100);assert(await page.getByRole('heading',{name:'No meetings found'}).isVisible());
 await page.getByRole('button',{name:'Show all meetings'}).click();await page.waitForTimeout(100);assert.equal(await page.locator('.event-card').count(),15);
 await page.locator('#region').selectOption('Asia');await page.waitForTimeout(100);assert.equal(await page.locator('.event-card').count(),2);
 await page.getByRole('button',{name:'Clear filters'}).click();await page.locator('#sort').selectOption('oldest');await page.waitForTimeout(100);assert((await page.locator('.event-card').first().innerText()).includes('1998'));
 for(const route of ['/','/about/','/conferences/','/sitemap/',...events.map(e=>`/conferences/${e.year}/`)]){
  const response=await page.goto(origin+route);assert.equal(response.status(),200);await page.waitForTimeout(30);
  assert.equal(await page.locator('h1').count(),1);
  const links=await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
  for(const link of links){assert(link.startsWith('/')||link.startsWith('#'),`External link ${link}`);const url=new URL(link,origin+route);if(url.hash){const target=await page.request.get(origin+url.pathname);assert.equal(target.status(),200);assert((await target.text()).includes(`id="${url.hash.slice(1)}"`),`Broken anchor ${link}`);}else assert.equal((await page.request.get(origin+url.pathname)).status(),200,`Broken route ${link}`);}
 }
 await page.setViewportSize({width:390,height:844});
 for(const route of ['/','/conferences/','/conferences/2026/','/sitemap/']){await page.goto(origin+route);assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Overflow ${route}`);}
 await page.goto(origin+'/conferences/');await page.screenshot({path:'directory-mobile.png',fullPage:true});
 assert.equal(errors.length,0,errors.join('\n'));
 console.log('PASS: 19 direct routes, internal links and anchors, search, URL query restoration, filters, sorting, empty results, fonts, logo, mobile layout, and React hydration.');
}finally{await browser.close();server.close();}
