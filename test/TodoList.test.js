const { assert } = require("chai")

const TodoList = artifacts.require('TodoList')

contract('TodoList', (accounts) => {
    //before run any task make a copy of the deployed contract
    before(async () => {
        this.todoList = await TodoList.deployed()
    })
    //first example: get the address
    it('deploys sucessfully', async () => {
        //first test its to take the address of the
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })
    //listing out the tests and the test it self to make sure it works
    it('list tasks', async () => {
        //simple check, basically making sure the account its correct and we can fetch a task by the account
        //first take the task account
        const taskCount = await this.todoList.taskCount()
        //try to fetch the task out of the mapping, so we'll just make sure that a task exists where the task count is
        const task = await this.todoList.tasks(taskCount)
        //assert the id is equal to the taskCount
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        //some tests to prevent i'm really fetching the first task
        assert.equal(task.content, 'First task the test task')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
    })

    it('creates tasks', async () => {
        const result = await this.todoList.createTask('Second task! ma mennn!')
        const taskCount = await this.todoList.taskCount()
        assert.equal(taskCount, 2)
        //the event is inside the result and we will check if the data is the same as the parameters that we used
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'Second task! ma mennn!')
        assert.equal(event.completed, false)
    })

    it('toggles task completion', async () => {
        //call the function and storage the result
        const result = await this.todoList.toggleCompleted(1)
        // storage the task to compare
        const task = await this.todoList.tasks(1)
        //assert the task was completed (since the first task has value of false i'll check for true)
        assert.equal(task.completed, true)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
    })
})