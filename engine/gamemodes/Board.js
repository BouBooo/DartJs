const inquirer = require('inquirer')
const Player = require('./Player')
const GameModel = require('../../models/Game')
const PlayerModel = require('../../models/Player')

class Board {
    constructor() {
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
            message: 'Select your gamemode :',
            choices: ['Around the world', '301', 'Cricket'],
            default: 0,
        }])
        .then((result) => {
            this.mode = result.gamemode 
            GameModel.create(this)
            .then(() => {
                this.initPlayers()
            })
        })
        .catch(function(error) {
            console.error(error);
          });
    }

    initPlayers() {
        inquirer.prompt([{
            name: 'playersChoice',
            type: 'list',
            message: 'Please enter number of players : (Minimum 2 players)',
            choices: [2, 3, 4],
            default: 0,
        }])
        .then((result) => {
            let nbrPlayers = result.playersChoice
            for (let i = 0; i < nbrPlayers; i++) {
                let player = new Player(i, 'Player from cli ' + i)
                let newPlayer = PlayerModel.create(player)
                this.players.push(player)
                
            }
            this.tour()
        })
        .catch(function(error) {
            console.error(error);
          });
    }

    async tour() {
        while(this.win === false) {
            for(let p=0; p < this.players.length; p++) {
                for(let t=0; t < 3; t++) {
                    await this.shoot(this.players[p])
                }
            }
        }
        console.log(this.winner.name + ' a gagné ! Score : ' + this.winner.score)
    }

    async shoot(player) {
        return await inquirer.prompt([{
            name: 'shoot',
            type: 'number',
            message: player.name + ' joue :'
        }])
        .then((result) => {
            if(player.score === result.shoot) {
                player.score+=1
                player.lastScore.push(player.score)
                console.table(player.lastScore)
                // console.log(player._id)
            } else {
                console.log('T\'as raté ton tir boloss')
            }
            if(player.score === 20) {
                this.win = true
                this.winner = player
                return true
            }
        })
    }

}

module.exports = Board