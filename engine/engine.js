let Board = require('./gamemodes/Board')


const main = async () => {

    const board = new Board()
    await board.selectGamemode()
    
}

main()