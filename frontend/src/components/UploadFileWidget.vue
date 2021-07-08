<template>
  <div>
    <input
        id='file-uploader'
        type='file'
        multiple='multiple'
    >
    <button id='upload-button'>
      upload file
    </button>
    <k-progress
        :percent='percent'
        color='#9254de'
    />
    <div v-if='fileName !== null && percent >= 100'>
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
  </div>
</template>

<script lang='ts'>
import {Component, Vue} from 'vue-property-decorator'
import {io, Socket} from 'socket.io-client'
import ss from 'socket.io-stream'
import KProgress from 'k-progress'
// import fs from 'fs'

type inputTypes = 'audio' | 'image' | 'video';


@Component({
  components: {
    KProgress
  }
})
export default class UploadFileWidget extends Vue {
  socket: Socket | undefined
  percent = 0
  currentFile: any

  fileName: string | null = null

  inputType: inputTypes = 'image'
  inputTypeList = [
    {value: 'image', name: '影像'},
    {value: 'audio', name: '音頻'},
    {value: 'video', name: '影片'}
  ]

  srcType = 'gif'
  srcTypeList = [
    {value: 'gif', name: 'gif'},
    {value: 'ico', name: 'ico'},
    {value: 'tif', name: 'tif'},
    {value: 'jpg', name: 'jpg'},
    {value: 'png', name: 'png'},
    {value: 'bmp', name: 'bmp'},
    {value: 'tga', name: 'tga'}
  ]

  dstType = 'jpg'
  dstTypeList = [
    {value: 'gif', name: 'gif'},
    {value: 'ico', name: 'ico'},
    {value: 'tif', name: 'tif'},
    {value: 'jpg', name: 'jpg'},
    {value: 'png', name: 'png'},
    {value: 'bmp', name: 'bmp'},
    {value: 'tga', name: 'tga'}
  ]

  onInputTypeChange(event: InputEvent) {
    event.inputType
    switch (this.inputType) {
      case 'audio':
        this.srcType = 'm4a'
        this.srcTypeList = [
          {value: 'm4a', name: 'm4a'},
          {value: 'flac', name: 'flac'},
          {value: 'mp3', name: 'mp3'},
          {value: 'wav', name: 'wav'},
          {value: 'wmv', name: 'wmv'},
          {value: 'aac', name: 'aac'}
        ]
        this.dstType = 'flac'
        this.dstTypeList = [
          {value: 'm4a', name: 'm4a'},
          {value: 'flac', name: 'flac'},
          {value: 'mp3', name: 'mp3'},
          {value: 'wav', name: 'wav'},
          {value: 'wmv', name: 'wmv'},
          {value: 'aac', name: 'aac'}
        ]
        break
      case 'image':
        this.srcType = 'gif'
        this.srcTypeList = [
          {value: 'gif', name: 'gif'},
          {value: 'ico', name: 'ico'},
          {value: 'tif', name: 'tif'},
          {value: 'jpg', name: 'jpg'},
          {value: 'png', name: 'png'},
          {value: 'bmp', name: 'bmp'},
          {value: 'tga', name: 'tga'}
        ]
        this.dstType = 'jpg'
        this.dstTypeList = [
          {value: 'gif', name: 'gif'},
          {value: 'ico', name: 'ico'},
          {value: 'tif', name: 'tif'},
          {value: 'jpg', name: 'jpg'},
          {value: 'png', name: 'png'},
          {value: 'bmp', name: 'bmp'},
          {value: 'tga', name: 'tga'}
        ]
        break
      case 'video':
        this.srcType = 'mp4'
        this.srcTypeList = [
          {value: 'mp4', name: 'mp4'},
          {value: 'mov', name: 'mov'},
          {value: 'flv', name: 'flv'},
          {value: 'avi', name: 'avi'},
          {value: 'webm', name: 'webm'}
        ]
        this.dstType = 'avi'
        this.dstTypeList = [{value: 'mp4', name: 'mp4'},
          {value: 'mov', name: 'mov'},
          {value: 'flv', name: 'flv'},
          {value: 'avi', name: 'avi'},
          {value: 'webm', name: 'webm'}
        ]
        break
      default:
    }
  }

  async onClick() {
    if (this.inputType === "image") {
      fetch(`http://localhost:8082/image_convert?name=${this.fileName}&before_format=${this.srcType}&after_format=${this.dstType}`)
          .then((response => {
            console.log(response)
          }))
    } else {
      fetch(`http://localhost:8081/?fileName=${this.fileName}&fromFileType=${this.srcType}&toFileType=${this.dstType}`)
          .then((response => {
            console.log(response)
          }))
    }
    await this.$router.push({name: "workManager"});
  }

  getArrayBuffer(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        resolve(reader.result)
      })
      reader.addEventListener('error', () => {
        reject()
      })
      reader.readAsArrayBuffer(file)
    })
  }

  created() {
    this.socket = io('http://localhost:8787', {
      transports: ['websocket']
    })

    this.socket.on('connect', () => {
      console.log('socket success connect')
    })
    this.socket.on('disconnect', () => {
      console.log('socket success disconnect')
    })
    this.socket.on('returnUploadFileID', (fileID: string) => {
      this.fileName = fileID
    })
  }

  mounted() {
    const fileUploader = document.querySelector('#file-uploader') as HTMLInputElement
    const uploadButton = document.querySelector(
        '#upload-button'
    ) as HTMLButtonElement
    if (uploadButton) {
      uploadButton.addEventListener('click', () => {
        if (this.currentFile) {
          const stream = ss.createStream()
          if (this.socket && stream) {
            ss(this.socket).emit('uploadFileStream', stream, {
              size: this.currentFile.size,
              fileName: this.currentFile.name
            })
            const blobStream = ss.createBlobReadStream(this.currentFile)
            let size = 0
            blobStream.on('data', (chunk: any) => {
              size += chunk.length
              const currentPercent = (size / this.currentFile.size) * 100
              this.percent = parseInt(currentPercent.toFixed(1))
              // console.log(Math.floor(currentPercent * 100) + '%')
            })
            blobStream.pipe(stream)
          }
        }
      })
    }
    if (fileUploader) {
      fileUploader.addEventListener('change', async (e: any) => {
        console.log(fileUploader.files)
        this.percent = 0
        const fileList = e.target.files
        if (fileList && fileList.length > 0) {
          this.currentFile = e.target.files[0]
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='css'>
.transform-button {
  font-size: 20px;
}

</style>
