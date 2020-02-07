let Cricket = require('./Cricket')


const main = async () => {
    const board = new Cricket()
    await board.initPlayers()
}

main()


