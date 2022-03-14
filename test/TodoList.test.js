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
})