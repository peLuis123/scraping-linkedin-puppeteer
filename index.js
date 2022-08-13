//para el primer reto de escraping no lo pude hacer como se solicito por que la verdad no me salia la parte del 
//csrf-token no me salia por lo cual para darle solucion al problema si bien fue de manera improvisada al 
//menos trate de hacerlo con los conocimientos que se aprendieron en clase, y lo ise con puppeteer
//tal vez lo que ise sea una mala practica ya que necesitas credenciales reales de un usuario para poder acceder
//a linkedin pero bueno funciona  

const puppeteer = require('puppeteer');//importamos puppeteer
(async () => { 
    const query = "developer" //esta variable se creo inicialmente para poder mandar un query de busqueda se puede crear un frm en html y enviar la variable para buscar bueno por falta de tiempo no lo implemente
    const browser = await puppeteer.launch({ 
        headless: false,
        args:[
            '--start-maximized' // you can also use '--start-fullscreen'
         ]  });//lanzamos un navegador

    const page = await browser.newPage();//se apertura una nueva pestaña
    await page.goto("https://www.linkedin.com/"); //en este caso estamos mandando como referencia el inicio de sesion de linkedin
    await page.setViewport({width: 1366, height: 768})//bueno esta parte no me salio muy bien queria ponerle parametros para fullscreem
    //en caso de que la pagina no se cargue correctamente borrar la parte de la linea 10 el atributo de args:[] y poner fullscreem manualmente
    //await page.waitForNavigation({timeout: '5000' });
    await page.waitForSelector("#session_key");//estos waitForSelector nos van ayudar a esperar los cuadros donde vamos a ingresar el correo automaticamente
    await page.type("#session_key", "pedrorc2018@gmail.com", { delay: 100 });//ingresamos el correo y le ponemos un delay de 100 para que la computadora no crea que eres un bot esto lo puse para que no nos banee por tantos intentos 
    await page.waitForSelector("#session_password");//bueno en esta parte se ingresa el correo no mandare mi correo presisamente pero para probarlo se necesita un correo y una contraseña valida
    await page.type("#session_password", "77078967", { delay: 100 });//de la misma manera como hicimos con el correo hacemos para la contraseña 
    await page.click(".sign-in-form__submit-button");//aqui mandamos una funcion de clic al boton ingresar o tambien se le puede mandar una funcion de enter funciona de igual manera
    await page.waitForSelector("#global-nav-typeahead > input");//aqui esperemos que cargue la pagina principal no toda solamente aremos uso de su buscador pero para esto necesitamos que su buscador este desplegado encaso no lo este no funcionara el programa
    await page.type("#global-nav-typeahead > input", "developer", { delay: 300 });//una vez ahya cargado solamente mandamos lo que queremos buscar en este caso developer se puede cambiar en este lugar 
    page.keyboard.press('Enter'); //esta es la funcion de enter para mandar la busqueda
    await page.waitForSelector("#search-reusables__filters-bar > ul > li:nth-child(2) > button");//cuando hacemos una busqueda por defecto te viene en la pestaña de empleos es por esto que simulo un clic en developer pero antes de hacer clic tengo que esperar a que este boton se cargue
    await page.click('#search-reusables__filters-bar > ul > li:nth-child(2) > button');//se simula el clic para poder ingresar a la seccion de personas
    await page.waitForSelector("#main > div > div > div:nth-child(2) > ul > li:nth-child(10)");//como necesitamos las personas buscadas por defecto de dan 10 personas por eso espero a que cargue la persona numero 10 para poder empezar con el escrapeo

    //desde aqui se comenzaria en caso me hubiera salido bien con el csr-token
    //aqui comenzamos a buscar los links de cada perfil y los pusheamos en nuestro array links
    const enlaces = await page.evaluate(() => {
        console.log('estamos aqui');
        const elements = document.querySelectorAll('#main a.app-aware-link.scale-down');//se copio el selector de el link
        const links = []
        //console.log('estamos aqui')
        for (let element of elements) {
            links.push(element.href);
        }
        //console.log('estamos aqui3')
        return links;
    });
    //solamente para ver si me esta traendo los perfiles correctos
    console.log(enlaces.length);
    const informacion = []
    for (let enlace of enlaces) {
        await page.goto(enlace);//mandamos un enlace por iteracion
        await page.waitForSelector('#experience')//en este caso esperamos a que cargue la experiencia si no, nos funcionara 
        const info = await page.evaluate(() => {
            const tmp = {};
            tmp.name = 'h1';
            tmp.education = document.querySelector('#education ~ .pvs-list__outer-container > ul > li').innerText;//se extrae el texto de cada educacion
            tmp.experience =  document.querySelector('#experience ~ .pvs-list__outer-container > ul > li').innerText;//se extrae la informacion de experiencia 
            return tmp;
        });
        informacion.push(info); //almacenamos toda la informacion en el array creado anteriormente 
    }
    console.log(informacion);
    //localStorage.setItem("scarping",informacion);
    await browser.close();

    //para poder extraer la informacion  de los siguiente perfiles pienso que en la parte de links deberia de simular mas cliks en cada boton de la paginacion y extraer todos los links solo se cambiaria en ese lugar
    //por que despues los links quedarian almacenamos en el array links y con la siguiente funcion se puede entrar a todos los urls extraidos y escrapear todo  
})();