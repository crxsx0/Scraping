const puppeteer = require('puppeteer');
const ExcelJS = require('exceljs');

async function irCursos(cursos, page, excel) {
    for (let i of cursos) {
        await page.goto(i);
        await page.waitForSelector("#indice_oas > ul > li:nth-child(2)");

        const nombreCurso = await page.evaluate(() => {
            return document.querySelector("h1").innerHTML
        });
        console.log("Extrayendo archivos de %s", nombreCurso);

        await page.click("#indice_oas > ul > li:nth-child(2)");

        await page.waitForSelector("#tabs-contenidos");

        const unidades = await page.evaluate(() => {
            const primera = document.querySelectorAll("div.vermas p a.btn.btn-link");
            const otras = document.querySelectorAll("a.vermas.btn.btn-link");
            const nuevaU = [];

            for (i of primera){
                nuevaU.push(i.href);
            }
            for (i of otras){
                nuevaU.push(i.href);
            }

            return nuevaU;
        });
        
        for (i of unidades){
            await page.goto(i);
            await page.waitForSelector("ul.nav.nav-tabs.responsive");
            await page.click("[data-target = '#recursos']");
            await page.waitForSelector("#recuadros_actividades");

            const nombreAsignaturaTemp = await page.evaluate(() => {
                return document.querySelector("h3 a").innerHTML;
            });
            const nombreAsignatura = nombreAsignaturaTemp.replace( nombreCurso, "");
            //console.log(nombreAsignatura);
            const nombreUnidad = await page.evaluate(() => {
                return document.querySelector("h1").innerHTML;
            });

            const indice = nombreUnidad.indexOf(":");
            let nuevaUnidad;
            if (indice !== -1) {
                nuevaUnidad = nombreUnidad.slice(0, indice);
                //console.log(nuevaUnidad);
            }
            
            const listaRecursos = await page.evaluate(() => {
                const links = document.querySelectorAll("div.thumbnail a");
        
                const linksFinal = [];
        
                for (i of links){
                    linksFinal.push(i.href);
                }
        
                return linksFinal;
            });

            for (i of listaRecursos){
                await page.goto(i);
                const listaLinksRecursos = await page.evaluate(() => {
                    const links= document.querySelectorAll("#article_i__rc_ar_recurso_descargas_1 div a");
            
                    const linksFinal = [];
            
                    for (i of links){
                        linksFinal.push(i.href);
                    }
            
                    return linksFinal;
                });

                for (i of listaLinksRecursos){
                    const elemento = {
                        nivel: nombreCurso,
                        asignatura: nombreAsignatura,
                        unidad: nuevaUnidad,
                        link: i
                    };
                    excel.push(elemento);
                }
            }
        }

    }
}

const saveExcel = (data) => {
    const workbook = new ExcelJS.Workbook()
    const fileName = 'primero_basico_a_segundo_medio.xlsx'
    const sheet = workbook.addWorksheet('Tabla1')

    const reColumns = [
        {header: 'Nivel', key: 'nivel'},
        {header: 'Asignatura', key: 'asignatura'},
        {header: 'Unidad', key: 'unidad'},
        {header: 'Link', key: 'link'}
    ]

    sheet.columns = reColumns
    sheet.addRows(data)

    workbook.xlsx.writeFile(fileName).then((e) => {
        console.log('Guardado exitosamente');
    })

}

async function scrap (){
    const browser = await puppeteer.launch({headless:false});
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
    linksInicio.splice(0,3);
    linksInicio.splice(10,1);

    const listaExcel = [];
    console.log("Ejecutando el script...");
    await irCursos(linksInicio, page, listaExcel);
    await browser.close();

    saveExcel(listaExcel);
}

scrap();