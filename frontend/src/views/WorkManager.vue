<template>
  <div class='hello'>
    <table class='task-list'>
      <thead>
      <tr>
        <th class='col-id'>ID</th>
        <th class='col-progress'>進度</th>
        <th class='col-del'>停止/刪除</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for='task in taskList' :key='task.taskID'>
        <td>
          <a :href='`http://127.0.0.1:8081/download/${task.taskID}.${task.toFileType}`' v-if='isFinished(task)'>{{ task.taskID }}</a>
          <div v-else>{{ task.taskID }}</div>
        </td>
        <td>
          <div v-if="task.percent === -1"> In Queue</div>
          <div v-else-if="task.percent === -2"> Terminated</div>
          <k-progress :percent='task.percent' v-else></k-progress>
        </td>
        <td>
          <button v-if='isStopped(task)' @click='deleteTask(task)'>
            刪除
          </button>
          <button v-else @click='stopTask(task)'>
            停止
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from 'vue-property-decorator'

import KProgress from 'k-progress'

interface taskData {
  taskID: string;
  percent: number;
  toFileType: string;
}

@Component({
  components: {
    KProgress
  }
})
export default class WorkManager extends Vue {
  taskList: taskData[] = [];
  timer: any;

  mounted() {
    this.update()
    this.timer = setInterval(this.update, 3000)
  }

  beforeDestroy() {
    clearInterval(this.timer)
  }

  isFinished(task: taskData) {
    return task.percent >= 100;
  }

  isStopped(task: taskData) {
    return task.percent === -1 || task.percent === -2 || task.percent >= 100;
  }

  deleteTask(task: taskData) {
    fetch(`http://localhost:8081/delete?target=${task.taskID}`);
  }

  stopTask(task: taskData) {
    fetch(`http://localhost:8081/stop?target=${task.taskID}`);
  }

  update() {
    fetch('http://localhost:8081/percentage')
      .then(response => {
        return response.json()
      })
      .then(json => {
        this.taskList = JSON.parse(json);
        console.log(json);
      })
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang='css'>
.col-id, .col-id{
  width: 200px;
}
.col-progress{
  width: 400px;
}
.task-list, th, td {
  border-collapse: collapse;
  border: 1px solid black;
  margin: 0 auto;
}
</style>
