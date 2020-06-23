<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
$color-primary: #dd001b;

html body{
  width: 100%;
  height: 100vh;
}
#app{
  width: 100%;
  height: 100%;
}
input[type='text']{
  width: 80%;
  padding: 5px 5px;
  outline: none;
  border: none;
  border-bottom: 1px solid #ccc;
}
input[type='text']:focus{
  border-bottom: 1px solid $color-primary;
}
</style>
