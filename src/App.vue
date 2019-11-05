<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
  input::-webkit-input-placeholder{
    color: #b7b7b7;
    font-size: 17px;
  }
  input::-moz-placeholder{   /* Mozilla Firefox 19+ */
    color: #b7b7b7;
    font-size: 17px;
  }
  input:-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
    color: #b7b7b7;
    font-size: 17px;
  }
  input:-ms-input-placeholder{  /* Internet Explorer 10-11 */
    color: #b7b7b7;
    font-size: 17px;
  }
</style>
