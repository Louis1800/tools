; (function () {
  'use strict'

  let id = 0

  Vue.component(
    "selected",
    {
      template: '#temp-select',
      data() {
        return {
          work: []
        }
      },
      props: {
        worklist: {
          type: Array
        },
        inneremp: {
          type: Array
        },
        day: {
          type: Number
        },
        cid: {
          type: Array
        },
        rid: {
          type: Array
        }
      },
      computed: {
        selected() {
          let selected = []
          for (let i = 0; i < this.inneremp.length; i++) {
            if (this.inneremp[i].require[this.day]) {
              selected.push(JSON.parse(JSON.stringify(this.inneremp[i])))
            }
          }
          return selected
        },

        dutylist() {
          let dutylist = []
          for (let i = 0; i < this.worklist.length; i++) {
            dutylist.push(this.worklist[i].name)
          }
          return dutylist
        }
      },
      watch: {
        dutylist: {
          handler: function (val, oldval) {
            this.work = []
            for (let i = 0; i < this.dutylist.length; i++) {
              this.work.push([])
            }
          }
        },
        cid: {
          handler: function (val, oldval) {
            for (let i = 0; i < this.work.length; i++) {
              for (let j = 0; j < this.work[i].length; j++) {
                if (val[0] == this.work[i][j].id) {
                  this.work[i].splice(j, 1)
                }
              }
            }
          },
          deep: true
        },
        rid: {
          handler: function (val, oldval) {
            for (let i = 0; i < this.work.length; i++) {
              for (let j = 0; j < this.work[i].length; j++) {
                if (val[0] == this.work[i][j].id) {
                  this.work[i].splice(j, 1)
                }
              }
            }
          },
          deep: true
        }
      },
      methods: {

        remove(e) {
          if (e.target) {
            let uid = Number(e.target.dataset.id)
            let move = {}
            // 找到对应props数据
            for (let i = 0; i < this.work.length; i++) {

              for (let j = 0; j < this.work[i].length; j++) {
                if (uid == this.work[i][j].id) {
                  move = JSON.parse(JSON.stringify(this.work[i][j]))
                  this.work[i].splice(j, 1)
                }
              }

            }

            this.selected.push(move)
          }
        },

        moveto(e) {
          let uid = Number(e.target.dataset.id)
          let move = {}
          for (let j = 0; j < this.selected.length; j++) {
            if (uid == this.selected[j].id) {
              move = JSON.parse(JSON.stringify(this.selected[j]))
              this.selected.splice(j, 1)
            }
          }
          this.work[e.target.dataset.index].push(move)
        },


      }
    }
  )

  new Vue({
    el: '#main',
    data: {
      days: [
        {
          name: 'Sun',
          select: false
        },
        {
          name: 'Mon',
          select: false
        },
        {
          name: 'Tue',
          select: false
        },
        {
          name: 'Wed',
          select: false
        },
        {
          name: 'Thu',
          select: false
        },
        {
          name: 'Fri',
          select: false
        },
        {
          name: 'Sat',
          select: false
        }
      ],
      worklist: [],
      employee: [],
      addperson: {
        id: '',
        name: '',
        require: [],
        duty: []
      },
      addwork: '',
      cid: [-1, -1],
      rid: [-1, -1]
    },
    mounted() {
      if (localStorage.employee) {
        this.employee = JSON.parse(localStorage.employee)
      }
      if (localStorage.worklist) {
        this.worklist = JSON.parse(localStorage.worklist)
      }
      if (localStorage.id) {
        id = JSON.parse(localStorage.id)
      }
    },
    methods: {
      add() {
        if (this.addperson.name.length) {
          this.addperson.require = []
          this.addperson.duty = []
          for (let i = 0; i < this.days.length; i++) {
            this.addperson.require.push(false)
          }
          for (let i = 0; i < this.worklist.length; i++) {
            this.addperson.duty.push(false)
          }
          this.addperson.id = id
          let newobj = JSON.parse(JSON.stringify(this.addperson))
          this.employee.push(newobj)
          id++
        }
        localStorage.employee = JSON.stringify(this.employee)
        localStorage.id = JSON.stringify(id)
      },

      addduty() {
        if (this.addwork.length) {
          let item = {
            name: this.addwork,
            select: false
          }
          this.worklist.push(item)
          for (let i = 0; i < this.employee.length; i++) {
            this.employee[i].duty.push(false)
          }
        }
        localStorage.worklist = JSON.stringify(this.worklist)
      },

      togrequire(e) {
        let n = e.target.dataset.status
        let id = e.target.dataset.id
        this.rid = [id, n]
        for (let i = 0; i < this.employee.length; i++) {
          if (this.employee[i].id == id) {
            this.employee[i].require.splice(n, 1, !this.employee[i].require[n])
            localStorage.employee = JSON.stringify(this.employee)
          }
        }
      },

      togduty(e) {
        let n = e.target.dataset.status
        let id = e.target.dataset.id
        this.cid = [id, n]

        for (let i = 0; i < this.employee.length; i++) {
          if (this.employee[i].id == id) {
            this.employee[i].duty.splice(n, 1, !this.employee[i].duty[n])
            localStorage.employee = JSON.stringify(this.employee)
          }
        }
      },

      clearlist() {
        localStorage.removeItem('worklist')
      },

      clearemp() {
        localStorage.removeItem('employee')
        localStorage.removeItem('id')
      }
    }
  })

})();