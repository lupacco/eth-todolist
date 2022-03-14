App = {
    loading: false,
    contracts: {},
    accounts: {},

    load: async () => {
        //Load app...
        await App.loadWeb3() //loading web3 library
        await App.loadAccount()
        await App.loadContract()
        await App.render()
    },

    // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8 -> metamask setup for talk to the blockchain with web3.js, 
    //web3js -> since the application is backed by the blockchain and we want to connect to the blockchain to use it, so we have to connect the browser to the blockchain thats why we use metamask for, and the client side application needs to connect to the blockchain as well and thats what web3js is for
    //basically we use the web3js library to talk with the ethereum blockchain, it allow us to connect to it and read and write data from the blockchain inside the app
    loadWeb3: async () => { //here we connect to the block chain with the metamask setup recomendation
        accounts = await ethereum.request({ method: 'eth_accounts' });
    },

    loadAccount: async () => { // here we retrivied the account
        App.account = accounts[0]
    },

    loadContract: async () => { // here we retrivied the smart contract
        // Create a JavaScript version of the smart contract
        const todoList = await $.getJSON('TodoList.json')
        App.contracts.TodoList = TruffleContract(todoList)
        App.contracts.TodoList.setProvider(window.ethereum)

        // Hydrate the smart contract with values from the blockchain
        App.todoList = await App.contracts.TodoList.deployed() // missing the ()
    },

    render: async () => {
        //prevent double rendering
        if (App.loading) {
            return
        }

        //update app loading state
        App.setLoading(true)

        //render account
        $('#account').html(App.account)

        //render tasks
        await App.renderTasks()

        //update loading state
        App.setLoading(false)
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')
        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }
    },

    renderTasks: async () => {
        //load the total task count from the blockchain
        const taskCount = await App.todoList.taskCount() //missing the ()
        const $taskTemplate = $('.taskTemplate')
        // render out each task with a new task template
        for (var i = 1; i <= taskCount; i++) {
            const task = await App.todoList.tasks(i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]

            // Create the html for the task
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
                .prop('name', taskId)
                .prop('checked', taskCompleted)
                .on('click', App.toggleCompleted)

            // Put the task in the correct list
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
            // show the task
            $newTaskTemplate.show()
        }
    },

}

$(() => {
    $(window).load(() => {
        App.load()
    })
})