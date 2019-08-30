const puppeteer=require("puppeteer");
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage{
    static  async build(){
     const browser = await puppeteer.launch({
         headless:true,
         args=['--no-sandbox']
     });

     const page = await browser.newPage();
     const customPage =  new CustomPage(page); 
     

    return new Proxy(customPage,{
        get: function(target,property){
            return customPage[property]||browser[property]||page[property]; 
        }
    })

    }

    constructor(page){
        this.page=page;
    }

    async login(){
        const user = await userFactory();
        console.log("i am here dude");
        console.log(user);
        // const id='5cbc6de808427c6c8bde13ab';
        const {session,sig}=sessionFactory(user);
        
        // console.log(sessionString,sig);
        // expect().toEqual(1); 
    
        await this.page.setCookie({name: 'session',value:session});
        await this.page.setCookie({name:'session.sig',value:sig});
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitFor('a[href="/auth/logout"]');
    }

    async getContentsOf(selector){
        return this.page.$eval(selector,el=>el.innerHtml);
    }
}


module.exports = CustomPage;