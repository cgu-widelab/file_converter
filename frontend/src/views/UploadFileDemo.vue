<template>
  <div class="hello">
    <upload-file-widget />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import UploadFileWidget from '../components/UploadFileWidget.vue'
import FileTypeSelector from '../components/FileTypeSelector.vue'

@Component({
  components: { UploadFileWidget, FileTypeSelector }
})
export default class UploadFileDemo extends Vue {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
