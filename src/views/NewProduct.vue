<template>
    <div class="newProduct">
     
        <h1>Neues Produkt anlegen</h1>

        <form  @submit.prevent="sendeProd()">
            <div class="row">
                <div class="col1"><label for="name">Produktname</label></div>
                <div class="col2"><input type="text" id="name" v-model="name" placeholder="Produktname" name="name" size="30" maxlength="50"><div class="error" v-if="nameerror.length>0"> {{nameerror}} </div></div>
            </div>
                  
            <div class="row">
                <div class="col1"><label for="productType">Produktart</label></div>
                <div class="col2"><select v-model="productType" id="productType" name="productType" placeholder="Produktart">
                                    <option v-for="productkey in productkeys" :value="productkey" :key="productkey">{{allproducttypes[productkey]}}</option>
                                </select>
                    <div class="error" v-if="producterror.length>0"> {{producterror}} </div></div>
            </div>
            
            <div class="row">
                <div class="col1"><label for="roomType" >Raumart</label></div>
                <div class="col2"><select type="text" v-model="roomType" id="roomType" placeholder="Raumart">
                                    <option v-for="roomkey in roomkeys" :value="roomkey" :key="roomkey">{{allroomtypes[roomkey]}}</option>
                                </select>
                    <div class="error" v-if="roomerror.length>0">{{roomerror}} </div></div>
            </div>

            <div class="row">
                <div class="col1"><label for="information" >Information</label></div>
                <div class="col2"><input type="text" v-model="information" id="information" placeholder="Information" name="information" size="30" maxlength="50"><div class="error" v-if="infoerror.length>0"> {{infoerror}} </div></div>
            </div>
            
            <div class="row">
                <div class="col1"><label for="description" >Beschreibung</label></div>
                <div class="col2"><input type="text" v-model="description" id="description" placeholder="Beschreibung" name="description" size="30" maxlength="50"><div class="error" v-if="descriptionerror.length>0"> {{descriptionerror}} </div></div>
            </div>

            <div class="row">
                <div class="col1"><label for="tag">Schlagwort/Tag</label></div>
                <div class="col2"><select name="tag" v-model="tag" id="tag" @change="tagChange($event.target.value)">
                                    <option v-for="item in alltags" :value="[item.id,item.value,]" :key="item.id">{{item.value}}</option>
                                </select>
                                <div class="col2"><p v-for="(tag,i) in allSelectTagsRef" :key="tag.value">{{tag.value}} <img src="@/assets/trash.png" id="trash" alt="trash" @click="deleteTag(i)"></p></div>
                </div>
            </div>
        
            <div class="row">
                <div class="col1"><label for="price">Preis</label></div>
                <div class="col2"><input type="number" v-model="price" id="price" placeholder="Preis" name="price" min="0.00" step="0.01"><div class="error" v-if="priceerror.length>0"> {{priceerror}} </div></div>
            </div>

            <div class="row">
                <div class="col1"><label for="dimensions">Maße in cm</label><label id="klein">Breite x Höhe x Tiefe</label></div>
                <div class="col2"><input type="number" v-model="width" id = "width" name="width" min="0.00" step="0.01"> x <input v-model="height" id="height" type="number" name="height" min="0.00" step="0.01"> x <input v-model="depth" id="depth" type="number" name="depth" min="0.00" step="0.01"><div class="error" v-if="sizeerror.length>0"> {{sizeerror}} </div></div>
            </div>

            <div class="row">
                <div class="col1"><label for="available" >Stückzahl</label></div>
                <div class="col2"><input type="number" id="available" v-model="available" name="available" min="0" step="1" ></div>
            </div>

            <div class="row">
                <div class="col1"><label for="picture">Bild und Name</label></div>
                <div class="col2"><input ref="fileInput" class="file-input" type="file" name="picture" multiple accept="image/*" @change="onFileChange($event.target.files)"><div class="error" v-if="picerror.length>0"> {{picerror}} </div></div>
                <div class="col2"><p v-for="(file,i) in filesref" :key="file.name">{{file.name}} <img src="@/assets/trash.png" id="trash" alt="trash" @click="deleteFile(i)"></p></div>
            </div>

            <input type="submit" name="safeProduct" value="Produkt speichern">
        </form>
    </div>
</template>

<script lang="ts">
  import {postProduct,postPictures,articlenr,useProduct} from '../service/ProductStore'
  import {useUserStore} from '../service/UserStore'
  import '../service/Picture'
  import '../service/Product'
  import {ref,defineComponent,onMounted} from 'vue'
  import Swal from "sweetalert2"
  import router from "../router"
  import {routerHistory} from "../service/RouterStore"
  import '../service/Response'
  export default defineComponent ({
        name:"newProduct",
   
    setup(){
        /**
         * the new product's pictures
         */
        const files = Array<File>();
        const filesref= ref(files);
        const {sendPicture} = postPictures();
        const formData = new FormData;
      
        /**
         * the new product's name
         */
        const name = ref("");
        /**
         * the new product's roomtype
         */
        const roomType = ref("");
        /**
         * the new product's producttype
         */
        const productType = ref("");
        /**
         * the new product's information
         */
        const information = ref("");
        /**
         * the new product's decription
         */
        const description = ref("");
        /**
         * how many times a product is available 
         */
        const available = ref(0);
        /**
         * the new product's width
         */
        const width = ref(0);
        /**
         * the new product's height
         */
        const height = ref(0);
        /**
         * the new product's depth
         */
        const depth = ref(0);
        /**
         * the new product's price
         */
        const price = ref(0);
        /**
         * the name of a productpicture
         */
        const picturename = ref("");
        /**
         * the new product's tag
         */
        const tag = ref("");
        const {sendProduct, validationerrors} = postProduct();
        const {alltags,getAllTags,allproducttypes,allroomtypes,roomkeys,productkeys,update} = useProduct();
        getAllTags()
        /**
         * All selected tags
         */
        const allSelectTags = Array<Tag>();
        const allSelectTagsRef = ref(allSelectTags);
        /**
         * error that occurs when a new product with a wrong name is tried to be saved
         */
        const nameerror = ref("");
          /**
         * error that occurs when a new product cannot be saved
         */
        const producterror = ref("");
          /**
         * error that occurs when a new product with a wrong roomtype is tried to be saved
         */
        const roomerror = ref("");
          /**
         * error that occurs when a new product with a wrong information is tried to be saved
         */
        const infoerror = ref("");
          /**
         * error that occurs when a new product with a wrong description is tried to be saved
         */
        const descriptionerror = ref("");
          /**
         * error that occurs when a new product with a wrong price is tried to be saved
         */
        const priceerror = ref("");
          /**
         * error that occurs when a new product with a wrong size is tried to be saved
         */
        const sizeerror = ref("");
          /**
         * error that occurs when a new product with a wrong picture is tried to be saved
         */
        const picerror = ref("");

        /**
         * whether a productpicture was successfully saved into the database
         */
        let picSucsess = true

        const {jwttoken,user,getUser} = useUserStore();

        onMounted(async () => {
            routerHistory.add("/newProduct");
            if(jwttoken.value.accessToken.length <= 0){
                router.push("/login");
            }else{
                await getUser();
                
                    if(user.value[0].roles.some(role =>(role.name ==="WAREHOUSE"||role.name==="ADMIN"||role.name==="STAFF"))){
                        router.push("/newProduct");
                    }else{
                        router.push("/login");
                    
                }
            }

        });

        

        /**
         * the new product
         */
        const product: Product = {'name':name.value, 'roomType':roomType.value, 'productType':productType.value, 'available':available.value, 
        'width':width.value, 'height':height.value, 'depth':depth.value, 'price':price.value, 'information':information.value ,'description': description.value, articlenr:null, allPictures:[], version:0, allTags:[] };


        function reset(){
            name.value="";
            roomType.value="";
            productType.value="";
            price.value = 0;
            information.value = "";
            description.value = "";
            width.value = 0;
            height.value = 0;
            depth.value = 0;
            available.value = 0;
            tag.value = "";
            picturename.value="";

            allSelectTagsRef.value=[];
            filesref.value=[];

        }

        /**
         * sends the new product to the server
         */
        async function sendeProd(): Promise<void>{

            producterror.value = "";
            priceerror.value = "";
            roomerror.value = "";
            nameerror.value = "";
            infoerror.value = "";
            descriptionerror.value = "";
            picerror.value = "";
            product.name = name.value;
            productType.value == "" ? producterror.value = "Bitte wähle einen Produkttypen aus.": product.productType = productType.value;
            roomType.value == "" ? roomerror.value = "Bitte Raumart auswählen." : product.roomType = roomType.value;
            product.price = price.value;
            product.information = information.value;
            product.description = description.value;
            product.width = width.value;
            product.height = height.value;
            product.depth = depth.value;
            product.available = available.value;
            product.allTags = allSelectTagsRef.value;

            formData.delete("picture")
            
            
            if (picSucsess == true){
                if(producterror.value.length == 0 && roomerror.value.length == 0){

                    await sendProduct(product);
                
                    
                    // Validation Messages
                    if(validationerrors.value.length > 0){ 
                        for(const error of validationerrors.value){ 
                                if(error.field == "price"){
                                priceerror.value = error.message;
                                }
                                if(error.field == "roomType"){
                                    roomerror.value = error.message;
                                }
                                if(error.field == "productType"){
                                    producterror.value = error.message;
                                }
                                if(error.field == "name"){
                                    nameerror.value = error.message;
                                }
                                if(error.field == "information"){
                                    infoerror.value = error.message;
                                }
                                if(error.field == "description"){
                                    descriptionerror.value = error.message;
                                }
                                if(error.field == "width"||error.field=="height"||error.field=="depth"){
                                    sizeerror.value = error.message;
                                }
                                if(error.field == "picture"){
                                    picerror.value = error.message;
                                }
                            }
                    }else{

                        for(const picture of filesref.value){
                            formData.append("picture",picture,picture.name)
                        }

                        picSucsess = await sendPicture(formData,articlenr)
                        if(picSucsess == true){
                            picerror.value = "";
                            await update();
                            // Pop UP
                            Swal.fire({
                                title: 'neues Produkt angelegt!',
                                text: 'weiteres Produkt anlegen...',
                                icon: 'success',
                                confirmButtonText: 'weiter',
                                confirmButtonColor: '#3BA07C',
                                }).then((result)=>{
                                    if(result.isConfirmed){
                                        reset();
                                    }
                            })

                        }else{
                            for(const error of validationerrors.value){
                                if(error.field == "picture"){
                                    picerror.value = error.message;
                                }
                            }
                        }
                        
                    }  
                }
             }else{

                for(const picture of filesref.value){
                    formData.append("picture",picture,picture.name)
                }
                picSucsess = await sendPicture(formData,articlenr)
                if(picSucsess==true){
                    picerror.value = "";
                    await update();
                    Swal.fire({
                        title: 'neues Produkt angelegt!',
                        text: 'weiteres Produkt anlegen...',
                        icon: 'success',
                        confirmButtonText: 'weiter',
                        confirmButtonColor: '#3BA07C',
                        }).then((result)=>{
                            if(result.isConfirmed){
                                reset();
                            }
                            })
                }else{
                    for(const error of validationerrors.value){
                        if(error.field == "picture"){
                            picerror.value = error.message;
                        }
                    }
                }
             }    
        }


        /**
         * adds a new picture to the productpictures
         */
        function onFileChange(files: File[]): void{
            for(const file of files){
                filesref.value.push(file)
            }
        }
        /**
         * deletes picture from chosen productpictures
         */
        function deleteFile(index: number): void{
            filesref.value.splice(index,1);
            picerror.value = ""
        }
        /**
         * changes the value of the selected Tags
         */
        function tagChange(event: string){
            const t: Tag = {
                id: Number(event.split(",")[0]),
                value: event.split(",")[1],
            }
            allSelectTagsRef.value.push({id: t.id, value: t.value});
        }
        /**
         * deletes tag from chosen tags
         */
        function deleteTag(index: number): void{
            allSelectTagsRef.value.splice(index,1);
        }


        return {allSelectTagsRef,deleteTag,roomkeys,productkeys,allroomtypes,allproducttypes,tagChange,alltags,tag,picerror,deleteFile,sizeerror,nameerror,producterror,roomerror,infoerror,descriptionerror,priceerror,sendPicture,validationerrors,sendeProd,product,name,roomType,productType,information,description,available,width,height,depth,price,picturename,onFileChange,filesref};
        }
   });
</script>

<style scoped lang="scss">
.error{
    font-size: 10px;
    color: red;
}

#inputerror{

    border-color: red;
    border-width: 2px;
   

}

h1{
    text-align: center;
}
form{
    margin: 5% 0% 15% 20%;
}
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}
#klein{
    font-size: 9px;
    color: #3BA07C;
}
.col1{
    float: left;
    width: 25%;

}
.col2{
    float: left;
    width: 75%;

}
.row:after{
    content: "";
    display: table;
    clear: both;
}
select{
    border: 1px solid #ccc;
    resize: vertical; 
    padding: 0.25em;
    border-radius: 3px;
    width: 31%;
}
input{
    border: 1px solid #ccc;
    resize: vertical; 
    padding: 0.25em;
    border-radius: 3px;
}
input:focus{
    outline-color: #3BA07C;
}
input[type=text]{
  width: 30%;
}
input[type=number]{
  width: 8%; 
}
input[type=file]{
    width: 30%;
    cursor: pointer;
    border: none;
    color: transparent;
}
input[type=submit]{
    margin: 5% 0% 0% 0%;
    padding: 1% 5%; 
    background-color: black;
    border-style: none;
    color: #fff;
    &:hover{
        background-color: #3BA07C;
    } 
    &:focus{
        outline: none;
    } 
} 
#trash{
    height: 13px;
}
p{
    font-size: 12px;
}
</style>