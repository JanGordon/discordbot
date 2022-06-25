//noughts and crosses
const Discord = require('discord.js');
class game {
    constructor (client, message){
        this.gameBoard = [
            ["SECONDARY","SECONDARY","SECONDARY"],
            ["SECONDARY","SECONDARY","SECONDARY"],
            ["SECONDARY","SECONDARY","SECONDARY"]
        ]
        this.gameBoardD = [
            ["enabled","enabled","enabled"],
            ["enabled","enabled","enabled"],
            ["enabled","enabled","enabled"]
        ]
        this.client = client
        this.message = message
        this.currentGo = "1"
    }

    getUpdate () {
      
        return [
          {type: 1, components: [
              
                new Discord.MessageButton()
                    .setCustomId('tt11')
                    .setLabel('■')
                    .setStyle(this.gameBoard[0][0])
                    .setDisabled(this.gameBoard[0][0] != "SECONDARY" || this.gameBoardD[0][0] == "disabled")
                ,
              new Discord.MessageButton()
                  .setCustomId('tt12')
                  .setLabel('■')
                  .setStyle(this.gameBoard[0][1])
                  .setDisabled(this.gameBoard[0][1] != "SECONDARY" || this.gameBoardD[0][1] == "disabled")
                  ,
              new Discord.MessageButton()
                  .setCustomId('tt13')
                  .setLabel('■')
                  .setStyle(this.gameBoard[0][2])
                  .setDisabled(this.gameBoard[0][2] != "SECONDARY" || this.gameBoardD[0][2] == "disabled")
                  ,
          ]},
          {type: 1, components: [
              new Discord.MessageButton()
                  .setCustomId('tt21')
                  .setLabel('■')
                  .setStyle(this.gameBoard[1][0])
                  .setDisabled(this.gameBoard[1][0] != "SECONDARY" || this.gameBoardD[1][0] == "disabled")
                  ,
              new Discord.MessageButton()
                  .setCustomId('tt22')
                  .setLabel('■')
                  .setStyle(this.gameBoard[1][1])
                  .setDisabled(this.gameBoard[1][1] != "SECONDARY" || this.gameBoardD[1][1] == "disabled")
                  ,
              new Discord.MessageButton()
                  .setCustomId('tt23')
                  .setLabel('■')
                  .setStyle(this.gameBoard[1][2])
                  .setDisabled(this.gameBoard[1][2] != "SECONDARY" || this.gameBoardD[1][2] == "disabled")
                  ,
          ]},
          {type: 1, components: [
              new Discord.MessageButton()
                  .setCustomId('tt31')
                  .setLabel('■')
                  .setStyle(this.gameBoard[2][0])
                  .setDisabled(!this.gameBoard[2][0] != "SECONDARY" || this.gameBoardD[2][0] == "disabled")
                  ,
              new Discord.MessageButton()
                  .setCustomId('tt32')
                  .setLabel('■')
                  .setStyle(this.gameBoard[2][1])
                  .setDisabled(this.gameBoard[2][1] != "SECONDARY" || this.gameBoardD[2][1] == "disabled")
                  ,
              new Discord.MessageButton()
                  .setCustomId('tt33')
                  .setLabel('■')
                  .setStyle(this.gameBoard[2][2])
                  .setDisabled(this.gameBoard[2][2] != "SECONDARY" || this.gameBoardD[2][2] == "disabled")
                  ,
          ]},
      ]
    }

    setPlayer1(user) {
        this.player1 = user
    }

    setPlayer2(user) {
        this.player2 = user
    }

    place(xy, user)
     {
        console.log(this.gameBoard, xy[0])
        if (this.gameBoard[xy[0]-1][xy[1]-1] == "SECONDARY") {
            let buttontype = "SECONDARY";
            if (this.player1 == undefined) {
                this.player1 = user
            } else if (this.player2 == undefined) {
                this.player2 = user
            }
            if (this.player1 == user && this.currentGo == "1") {
                buttontype = "SUCCESS"
                this.currentGo = "2"
                this.gameBoard[xy[0]-1][xy[1]-1] = buttontype
            } else if (this.player2 == user && this.currentGo == "2") {
                buttontype = "DANGER"
                this.currentGo = "1"
                this.gameBoard[xy[0]-1][xy[1]-1] = buttontype
            }
            let checks = [
                [0,0],
                [1,0],
                [2,0],
                [0,1],
                [0,2]
            ]
            for (let i of checks) {
                let row = i[1]
                let s = i[0]
                if (this.gameBoard[row][s] != "SECONDARY") {
                    if (row == 0) {
                        console.log(row,s)
                        if (this.gameBoard[row+1][s] == this.gameBoard[row][s] && this.gameBoard[row+2][s] == this.gameBoard[row][s]) {
                            this.endGame(this.gameBoard[row][s])
                        }
                        if (s == 0) {
                            if (this.gameBoard[row+1][s+1] == this.gameBoard[row][s] && this.gameBoard[row+2][s+2] == this.gameBoard[row][s]) {
                                this.endGame(this.gameBoard[row][s])
                            }
                        }
                        if (s == 2) {
                            if (this.gameBoard[row+1][s-1] == this.gameBoard[row][s] && this.gameBoard[row+2][s-2] == this.gameBoard[row][s]) {
                                this.endGame(this.gameBoard[row][s])
                            }
                        }
                    }
                    if (s==0) {
                        console.log("")
                        if (this.gameBoard[row][s+1] == this.gameBoard[row][s] && this.gameBoard[row][s+2] == this.gameBoard[row][s]) {
                            this.endGame(this.gameBoard[row][s])
                        }
                    }
                }
            }
        }
        
    }

    endGame (type) {
        this.gameBoardD = [
            ["disabled","disabled","disabled"],
            ["disabled","disabled","disabled"],
            ["disabled","disabled","disabled"]
        ]
        if (this.currentGo == "2") {
            this.message.channel.send(`Well done @${this.player1.username}! You Won the Game!`)
        }
        if (this.currentGo == "1") {
            this.message.channel.send(`Well done @${this.player2.username}! You Won the Game!`)
        }
        this.message.edit({ components: this.getUpdate() })
    }
    

}

exports.game = game