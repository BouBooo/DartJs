let TourDuMonde = require('./TourDuMonde')


const main = async () => {
    const board = new TourDuMonde()
    await board.initPlayers()
}

main()


