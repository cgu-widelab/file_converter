<template>
  <div>
    <div>
      檔案類型：
      <select name='inputType' v-model='inputType' @change='onInputTypeChange'>
        <option v-for='input in inputTypeList' :value='input.value' :key='input.value'>{{ input.name }}</option>
      </select>
      來源檔案類型：
      <select name='srcType' v-model='srcType'>
        <option v-for='input in srcTypeList' :value='input.value' :key='input.value'>{{ input.name }}</option>
      </select>
      目標檔案類型
      <select name='dstType' v-model='dstType'>
        <option v-for='input in dstTypeList' :value='input.value' :key='input.value'>{{ input.name }}</option>
      </select>
    </div>
    <button @click='onClick' class='transform-button'>轉檔</button>
  </div>
</template>

<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator'

type inputTypes = 'audio' | 'image' | 'video';

@Component({
  name: 'FileTypeSelector'
})
export default class FileTypeSelector extends Vue {
  inputType: inputTypes = 'image'
  inputTypeList = [
    { value: 'image', name: '影像' },
    { value: 'audio', name: '音頻' },
    { value: 'video', name: '影片' }
  ]

  srcType = 'gif';
  srcTypeList = [
    { value: 'gif', name: 'gif' },
    { value: 'ico', name: 'ico' },
    { value: 'tif', name: 'tif' },
    { value: 'jpg', name: 'jpg' },
    { value: 'png', name: 'png' },
    { value: 'bmp', name: 'bmp' },
    { value: 'tga', name: 'tga' }
  ]

  dstType = 'jpg';
  dstTypeList = [
    { value: 'gif', name: 'gif' },
    { value: 'ico', name: 'ico' },
    { value: 'tif', name: 'tif' },
    { value: 'jpg', name: 'jpg' },
    { value: 'png', name: 'png' },
    { value: 'bmp', name: 'bmp' },
    { value: 'tga', name: 'tga' }
  ]

  onInputTypeChange(event: InputEvent) {
    event.inputType
    switch (this.inputType) {
      case 'audio':
        this.srcType = 'm4a';
        this.srcTypeList = [
          { value: 'm4a', name: 'm4a' },
          { value: 'flac', name: 'flac' },
          { value: 'mp3', name: 'mp3' },
          { value: 'wav', name: 'wav' },
          { value: 'wmv', name: 'wmv' },
          { value: 'aac', name: 'aac' }
        ]
        this.dstType = 'flac';
        this.dstTypeList = [
          { value: 'm4a', name: 'm4a' },
          { value: 'flac', name: 'flac' },
          { value: 'mp3', name: 'mp3' },
          { value: 'wav', name: 'wav' },
          { value: 'wmv', name: 'wmv' },
          { value: 'aac', name: 'aac' }
        ]
        break
      case 'image':
        this.srcType = 'gif';
        this.srcTypeList = [
          { value: 'gif', name: 'gif' },
          { value: 'ico', name: 'ico' },
          { value: 'tif', name: 'tif' },
          { value: 'jpg', name: 'jpg' },
          { value: 'png', name: 'png' },
          { value: 'bmp', name: 'bmp' },
          { value: 'tga', name: 'tga' }
        ]
        this.dstType = 'jpg';
        this.dstTypeList = [
          { value: 'gif', name: 'gif' },
          { value: 'ico', name: 'ico' },
          { value: 'tif', name: 'tif' },
          { value: 'jpg', name: 'jpg' },
          { value: 'png', name: 'png' },
          { value: 'bmp', name: 'bmp' },
          { value: 'tga', name: 'tga' }
        ]
        break
      case 'video':
        this.srcType = 'mp4';
        this.srcTypeList = [
          { value: 'mp4', name: 'mp4' },
          { value: 'mov', name: 'mov' },
          { value: 'flv', name: 'flv' },
          { value: 'avi', name: 'avi' },
          { value: 'wmv', name: 'wmv' },
          { value: 'webm', name: 'webm' }
        ]
        this.dstType = 'avi';
        this.dstTypeList = [{ value: 'mp4', name: 'mp4' },
          { value: 'mov', name: 'mov' },
          { value: 'flv', name: 'flv' },
          { value: 'avi', name: 'avi' },
          { value: 'wmv', name: 'wmv' },
          { value: 'webm', name: 'webm' }
        ]
        break
      default:
    }
  }

  onClick(){
    const data = {
      'fileName': ''
    }
    fetch(`http://localhost:8081/test`, {
      body: JSON.stringify(data),
      method: 'POST'
    }).then((response => {
      console.log(response);
    }))
  }

}
</script>

<style scoped lang='css'>
.transform-button{
  font-size: 20px;
}

</style>