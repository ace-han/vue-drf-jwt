<template>
  <div>
    login page
  </div>
</template>

<script>
export default {
  data () {
    return {
      context: 'login context',
      data: {
        // body is fixex variable naming in `vue-resource` do not CHANGE it!!!
        body: {
          username: 'admin',
          password: 'admin'
        }
      },
      error: null
    }
  },

  methods: {
  }
}
</script>


<style lang="sass" >
</style>
