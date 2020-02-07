const inquirer = require('inquirer')
const Player = require('./Player')

class Cricket {
    constructor() {
        this.sectors = []
        this.players = []
        this.win = false
        this.winner = null
        this.conditions = [15, 16, 17, 18, 19, 20, 0]
        this.winOrFalse = []
        this.higherScore = 0
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
                let player = new Player('Player ' + i)
                player.setId(i)
                this.players.push(player)
            }
            
            this.tour()
        })
        .catch(function(error) {
            console.error(error);
          });
    }

    isInteger(value) {
        if(!Number.isInteger(value)) value = 1
    }

    isAlreadyClosed(player, value) {
        return player.closed.includes(value) ? true : false
    }

    checkWinConditions(player) {
        this.conditions.forEach(el => {
            if(player.closed.includes(el)) {
                this.winOrFalse.push(true)
            } else {
                this.winOrFalse.push(false)
            }
        })
    }

    hasWon(player) {
        if(!this.winOrFalse.includes(false)) {
            if(player.score > this.higherScore) this.winner = player
            this.win = true
        }
    }

    updatePlayersArray(player) {
        this.players.slice(player.id, 1, player)
    }

    async tour() {
        while(this.win === false) {
            for(let p=0; p < this.players.length; p++) {
                for(let t=0; t < 3; t++) {
                    await this.shoot(this.players[p])
                    if(this.win === true) continue
                }
                console.table(this.players[p])
            }
        }
        if(this.winner != null && this.winner.score > 0) console.log('Le gagnant est ' + this.winner.name + ' avec ' + this.winner.score + ' points.')
    }

    async shoot(player) {
        return await inquirer.prompt([{
                name: 'shoot',
                type: 'number',
                message: player.name + ' joue :'
            }])
            .then((result) => {
                let shot = result.shoot
                this.isInteger(shot)
                if(shot >= 15 & shot <= 20 || shot === 0) {
                    player.targets.push(shot)
                    let count = 0
                    for(let i = 0; i < player.targets.length; ++i){

                        if(player.targets[i] == shot) {
                            count+= 1
                        }
                    }
                    // Un nbr a été ouvert
                    if(count >= 3) {
                        // Nbr deja ouvert
                        if(this.isAlreadyClosed(player, shot)) {
                            player.setScore(shot)
                        }
                        else {
                            player.closed.push(shot)
                            console.log(player.name + ' : Le nombre ' + shot + ' a été ouvert.')
                        } 
                        this.checkWinConditions(player) 
                        this.hasWon(player)
                        this.winOrFalse = []
                        this.updatePlayersArray(player)
                    }

                // NaN
                } else {
                    console.log('T\'as raté ton tir boloss')
                }
            })
    }
}

module.exports = Cricket