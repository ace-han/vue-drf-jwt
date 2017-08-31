<template>
  <div class="hello">
    <h1>{{ nickname + '(' + username + ')' }}</h1>
    <h2>Links</h2>
    <ul>
      <li>
        <router-link :to="{name: 'account.profile'}">
          Profile
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: 'admin',
      nickname: 'Admin'
    }
  }
}
</script>