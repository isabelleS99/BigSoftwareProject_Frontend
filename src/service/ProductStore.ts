//import {Client} from '@stomp/stompjs'; //Message
import Vue from 'vue'
import { reactive } from 'vue'
//////////////////////////////////////////////////////////////////////////////

import { computed} from 'vue'
import '@/service/Product'
import '@/service/Picture'
import '@/service/ProductResponse'
import '@/service/Validationerror'

/**************************************************/

//const wsurl = "ws:localhost:9090/stompbroker";
//const DEST = "/topic/products";

//const stompclient = new Client( { brokerURL: wsurl})

const state = reactive({
    list: Array<Product>(),
    img: String,
    validationerrors : Array<Validationerror>(),
   
  })

export let articlenr: number;


  async function update(): Promise<void> {
    const productlist = new Array<Product>();
    fetch(`/api/products`, { //http://localhost:8080
        method: 'GET',
        // credentials: 'same-origin'
    })
      .then((response) => {
        if (!response.ok) {
          return productlist;
        }
        //state.errormessage = "";

        return response.json();
      })
      .then((jsondata: Array<Product>)=>{
        // console.log("yiiiha");
        console.log(jsondata[jsondata.length-1]);
        for(let i = 0; i < jsondata.length; i++){
          productlist.push(jsondata[i]);
        }
        state.list = productlist;
  
      })
      .catch((fehler) => {
        //fehler.state.errormessage("Fehler bei der Serverkommunikation");
        //state.liste = alt;
        console.log(fehler);
      });      

  } 
    
  async function sendProduct(newProduct: Product): Promise<void>{
    articlenr = -1;
    console.log(" Sende Produkt mit Namen: "+newProduct.name+" an backend.")
    console.log("Sende: "+'Product '+JSON.stringify(newProduct))
    await fetch(`/api/product/new`,{
      method: 'POST',
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(newProduct)
    }).then(function(response){
      //hier checken ob alles ok gelaufen ist -> falls nein errormessages holen?
      if(response.status == 406){
        //errormessages holen
        const productResponse = JSON.parse(JSON.stringify(response.body)) as ProductResponse;
        state.validationerrors = productResponse.allErrors;
        console.log("FEHLER: " +state.validationerrors)
      }
      return response.json();
    }).then((jsondata: ProductResponse)=>{
    
      console.log("Response json: "+ JSON.stringify(jsondata));
      //wenn alles richtig war, neues Produkt hinzufuegen
      if(jsondata.allErrors.length == 0){
        state.list.push(jsondata.product);
        state.validationerrors = jsondata.allErrors;
        console.log("neues produkt!");
        articlenr = jsondata.product.articlenr;
        console.log("articlenr",jsondata.product.articlenr);
      }
      else{

        state.validationerrors = jsondata.allErrors;
        console.log("Fehlerliste: "+JSON.stringify(jsondata.allErrors));
      }
    }).catch((error) => {
      console.log(error);
  });
    
      
      //Validationerrors werden nach außen angeboten und automatisch geände
   

  }

  //Liste an Bildern
  async function sendPicture(formData: FormData, articlenr: number): Promise<boolean>{
    console.log("Sende Bild an Backend");
    let wassuccessful = false;
    if(articlenr != -1){
       fetch(`/api/product/${articlenr}/newpicture`,{
      method: 'POST',
      headers: {access:'Access-Control-Allow-Origin' },
      body: formData
    }).then(function(response){
      return response.json();
    }).then((jsondata: boolean)=>{
      console.log("Erfolgreiche Bildübertragung? "+JSON.stringify(jsondata));
      wassuccessful = jsondata;
    })
    .catch((fehler) => {
      console.log(fehler);
    });
    //Bilderliste abschicken
    }
   return wassuccessful;
  }

    export function useProduct() {
        return {
          // computed() zur Erzeugung einer zwar reaktiven, aber read-only-Version der Liste und der Fehlermeldung
          list: computed(() => state.list),
          //errormessage: computed(() => state.errormessage),
          update,
        }
      }

    //macht die sendProduct Funktion von außen zugänglich
    export function postProduct(){
      return {
        sendProduct,
        validationerrors : computed(() => state.validationerrors),
      }
    }

    //sendPicture funktion nach außen anbieten
    export function postPictures(){
      return{
        sendPicture
      }
    }
    


    