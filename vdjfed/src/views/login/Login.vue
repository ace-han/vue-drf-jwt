<template>
  <div>
    <h2>login page</h2>
    <form @submit="login()">
      <label for="username">Username</label>
      <input type="username" id="username" v-model="username"/>
      <br/>
      <label for="password">&nbsp;Password</label>
      <input type="password" id="password" v-model="password"/>
      <br/>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script>

export default {
  data () {
    return {
      username: 'admin',
      password: 'admin'
    }
  },
  methods: {
    login () {
      this.$auth.login(this.username, this.password)
    }
  }
}
</script>


<style lang="sass" >
</style>
