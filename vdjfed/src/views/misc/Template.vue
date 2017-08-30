<template>
  <div class="wrapper">
    <router-view></router-view>
  </div>
</template>
<style lang="sass">
  .wrapper
    height: 100%
    background: #7474BF /* fallback for old browsers */
    background: -webkit-linear-gradient(to left, #7474BF , #348AC7) /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to left, #7474BF , #348AC7) /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
</style>
