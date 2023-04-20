const puppeteer = require('puppeteer');

function obtenerHref (lista){

    const listaFinal = [];

    for (i of lista){
        listaFinal.push(i.href);
    }

    return listaFinal;
}


/*async function unidadCurso (url){
    await page.goto(url);
    await page.waitForSelector('#menu_recursos_oa');
    page.click("#menu_recursos_oa > ul > li:nth-child(3) > a", puppeteer.MouseButton);
    await page.waitForSelector("#recuadros_actividades");

    const linksRecursosUnidad = await page.evaluate(() => {
        const linksRecursos =  obtenerHref ("div.thumbnail a");


    });
}*/


async function scrap (){
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.curriculumnacional.cl/portal/Documentos-Curriculares/Programas/');
    await page.waitForSelector('h2.ntg-titulo-caja');
    await page.setViewport({width:1920, height: 1080});

    const linksInicio = await page.evaluate(() => {
        const links = document.querySelectorAll("div.row.parvularia.menu-cursos-general.fondo-cuadrados ul li a");
        const listaa = obtenerHref(links)
        return listaa;
    });

    console.log(linksInicio);
}

scrap();