const inquirer = require('inquirer')
const Player = require('./Player')

class Le301 {
    constructor() {
        this.sectors = []
        this.players = []
        this.win = false
        this.roundScore = 0
        this.count = 0
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
                let player = new Player(i, 'Player ' + i)
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
            if(this.players.length === 0) {
                console.log('Plus de joueurs restants ! Sheh.')
                process.exit(code)
            }
            for(let p=0; p < this.players.length; p++) {
                this.players[p].lastScore = []
               for(let s=0; s<3; s++) {
                    await this.shoot(this.players[p])
               }
               this.roundScore = 0
               this.count = 0
            }
        }
    }

    async shoot(player) {
        return await inquirer.prompt([{
                name: 'shoot',
                type: 'number',
                message: player.name + ' joue :'
            }])
            .then((result) => {
                
                if(!Number.isInteger(result.shoot)) {
                    console.log('T\'as raté ton tir boloss')
                    result.shoot = 0
                }
                this.roundScore += result.shoot
                this.count +=1  

                // 3 tirs
                if(this.count >= 3) {   
                    player.count += 1
           
                    // If score 0 && last shot double
                    if(player.score - this.roundScore === 0 && this.roundScore%2 === 0) {
                        
                        player.score-=this.roundScore
                        player.lastScore.push(result.shoot)
                        this.win = true
                        console.log(player.name + ' a gagné ! Score : ' + player.score + ' en ' + player.count + ' jets de fléchettes.')
                        return true
                                      
                    }
                    // If score between 1 & 301
                    else if(player.score - this.roundScore > 1) {
                        
                        player.score-=this.roundScore
                        player.lastScore.push(result.shoot)
                    } 
                    // If 1
                    else if(player.score - this.roundScore === 1){
                        console.log(player.name + ' est arrivé à 1. Il a perdu.')
                        this.players.splice(player.number, 1)
                        
                    }
                    else if(player.score - this.roundScore <= 0) {
                        console.log('Raté, retente le tour d\'après.')
                    }
                    else {
                        console.log('Else')
                    }
                    console.log(this.roundScore)
                    console.log(player.score)
                }                
            })
    }
}

module.exports = Le301