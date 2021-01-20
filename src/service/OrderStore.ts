import {useCartStore} from '@/service/CartStore'
import { computed,reactive} from 'vue'
import { useProduct} from './ProductStore';

const {list} = useCartStore();
const {allproductslist, getAvailableByArtNr} = useProduct();



const state = reactive({
    errormessage: "",
    orderlist: list,
    errormessages: Array<MessageResponse>(),
    ordererrormessages: Array<OrderResponse>(),
    allorders: new Set<number>(),
    orderSuccess: false
})

async function postOrder(userorderreq: UserOrderRequest, order: OrderDT): Promise<boolean> {

    console.log("User Order Request" + JSON.stringify(userorderreq));
    console.log("postOrder - Liste Warenkorb: " + JSON.stringify(Array.from(state.orderlist)));
    console.log("Liste der Bestellten Produkte: " + JSON.stringify(order));
    
    //Fetch -> UserDetails
    await fetch(`http://localhost:9090/api/user/newOrder/user`,{
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(userorderreq)
    }).then((response) => {
        if(!response.ok){
            // console.log("Error");
            throw new Error(state.errormessage);
        }
        return response.json();
    }).then((jsondata: Array<MessageResponse>) =>{
        state.errormessages = jsondata;
        // console.log("ERRORS bei sende UserOrderRequests : " + JSON.stringify(state.errormessages));
    }).catch((exception) => {
        console.log(exception)
    });

   //Fetch -> ordered Articles
    await fetch(`http://localhost:9090/api/order/new`,{
        method: 'POST',
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(order)
    }).then((response) => {
        if(!response.ok){
            console.log("Error");
            throw new Error(state.errormessage);
        }
        return response.json();
    }).then((jsondata: Array<OrderResponse>) =>{

        if(!(jsondata.length == 1 && jsondata[0].orderid != -1)){
            state.ordererrormessages = jsondata;
            console.log("ERRORS bei sende bestellte Artikel: " + JSON.stringify(jsondata));
            state.orderSuccess = false;
        }else{
            state.allorders.add(jsondata[0].orderid);
            console.log("Bestellung erfolgreich!");
            state.orderSuccess = true;
            console.log();
        }
    }).catch((exception) => {
        console.log(exception)
    });

    return state.orderSuccess;
}

function checkAllItemsStillAvailable(){
    for (let i = 0; i < state.orderlist.size; i++) {
        const artnr = Array.from(state.orderlist.keys())[i];
        const available = getAvailableByArtNr(artnr) as number;
        const needtobeavailable = Array.from(state.orderlist.values())[i]
        if (needtobeavailable > available) {
            return false;
            //TODO: aus Warenkorb löschen bzw. Anpassen
        }
    } 
    return true; 
}
    

export function usePostOrder() {
    return {
        postOrder,
        errormessages: computed(() => state.errormessages),
        ordererrormessages: computed(() => state.ordererrormessages),
        allorders: state.allorders,
        checkAllItemsStillAvailable
    }
}