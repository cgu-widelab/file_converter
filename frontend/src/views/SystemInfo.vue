<template>
  <div>{{ systemData }}</div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class SystemInfo extends Vue {
  systemData: string = ''
  interval: any

  mounted() {
    this.update()
    this.interval = setInterval(this.update, 5000)
  }

  beforeDestroy() {
    clearInterval(this.interval);
  }

  update() {
    fetch('http://localhost:8081/system')
      .then(response => {
        return response.json()
      })
      .then(json => {
        const data = JSON.parse(json)
        console.log(data)
        this.systemData = data.info
        this.systemData = this.systemData.replace(/\n/g, '<br/>')
      })
  }
}
</script>

<style scoped>

</style>