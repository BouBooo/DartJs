let Le301 = require('./Le301')


const main = async () => {
    const board = new Le301()
    await board.initPlayers()
}

main()