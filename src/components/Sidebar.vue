<template>
  <div class="sidebar">
    <h4>Produkte</h4>
    <ul>
     <li v-for="productkey in productkeys" :key="productkey">
        <router-link
          id="link"
          :to="{
            path: '/product',
            query: { room: 'all', productType: productkey, name: 'none' },
          }"
          >{{allproducttypes[productkey]}}</router-link>
     
      </li>
    </ul>

    <br />

    <h4>Räume</h4>
    <ul>
      <li v-for="roomkey in roomkeys" :key="roomkey">
        <router-link
          id="link"
          :to="{
            path: '/product',
            query: { room: roomkey, productType: 'all', name: 'none' },
          }"
          >{{allroomtypes[roomkey]}}</router-link>
     
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import {useProduct} from '../service/ProductStore';

export default {
    name: "sidebar",
   
    setup(){
      const {allproducttypes,allroomtypes, roomkeys, productkeys} = useProduct();
      return{allproducttypes, allroomtypes, roomkeys, productkeys};
    }
};
</script>

<style scoped lang="scss">
.sidebar {
  text-align: left;
  color: black;
  float: left;
  background-color: $color-grey;
  padding: 1.5%;
  max-width: 15%;
  margin-left: 20px;
  margin-right: 30px;
  margin-top: 15px;
  border-radius: 5px;
  position: fixed;
}
ul {
  list-style-type: none;
  margin: 0px;
}
#link {
  color: black;
  text-decoration: none;
  list-style: none;
  list-style-type: none;
}
#link:hover {
  color: $color-brown;
  text-decoration: none;
}
#link:focus{
  color: $color-green;
  text-decoration: none;
}
li {
  font-size: 1.25vw;
}
h4 {
  font-size: 1.5vw;
  margin: 10px;
}
</style>