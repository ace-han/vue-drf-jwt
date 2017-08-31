<template>
  <div class="hello">
    <h1>{{ nickname + '(' + username + ')' }}</h1>
    <h2>Links</h2>
    <ul>
      <li>
        Balance: {{ balance }} $
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      username: 'admin',
      nickname: 'Admin',
      balance: 99
    }
  }
}
</script>