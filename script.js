const puppeteer = require('puppeteer');

async function scrap (){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.curriculumnacional.cl/portal/Documentos-Curriculares/Programas/');
    await page.waitForSelector('h2.ntg-titulo-caja');
    await page.setViewport({width:1920, height: 1080});

    const linksInicio = await page.evaluate(() => {
        const listaLinksInicio = document.querySelectorAll("div.row.parvularia.menu-cursos-general.fondo-cuadrados ul li a");

        const linksCursos = [];

        for (i of listaLinksInicio){
            linksCursos.push(i.href);
        }

        return linksCursos;
    });
}

scrap();