const inquirer = require('inquirer')
const Player = require('./Player')
const GameModel = require('../../models/Game')
const PlayerModel = require('../../models/Player')
const TourDuMonde = require('../gamemodes/around-the-world')
const Le301 = require('../gamemodes/301')
const Cricket = require('../gamemodes/cricket')

class Board {
    constructor() {
        this.game = null
        this.name = 'MyPartyName'
        this.mode = null
        this.sectors = []
        this.players = []
        this.win = false
        this.winner = null
        this.conditions = [15, 16, 17, 18, 19, 20, 0]
        this.winOrFalse = []
        this.higherScore = 0
        this.roundScore = 0
        this.count = 0
    }

    selectGamemode() {
        inquirer.prompt([{
            name: 'gamemode',
            type: 'list',
            message: 'Sélection du mode de jeu :',
            choices: ['Around the world', '301', 'Cricket'],
            default: 0,
        }])
        .then((result) => {
            this.mode = result.gamemode 
                console.log(this.mode)
                if(this.mode === 'Around the world') {
                    this.game = new TourDuMonde()
                } else if(this.mode === '301') {
                    this.game = new Le301()
                } else if(this.mode === 'Cricket') {
                    this.game = new Cricket()
                }
                this.game.initPlayers()
        })
        .catch(function(error) {
            console.error(error);
          });
    }
}

module.exports = Board