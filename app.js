function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      monsterHealth: 100,
      playerHealth: 100,
      currentRound: 0,
      specialUsed: false,
      winner: null,
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      return {
        width: (this.monsterHealth < 0 ? 0 : this.monsterHealth) + '%',
      };
    },
    playerBarStyles() {
      return {
        width: (this.playerHealth < 0 ? 0 : this.playerHealth) + '%',
      };
    },
    specialRound() {
      return this.specialUsed ? this.currentRound % 3 !== 0 : false;
    },
  },
  watch: {
    playerHealth(val) {
      if (val <= 0 && this.monsterHealth <= 0) {
        // draw
        this.winner = 'draw';
      } else if (val <= 0) {
        // player lost
        this.winner = 'monster';
      }
    },
    monsterHealth(val) {
      if (val <= 0 && this.playerHealth <= 0) {
        // draw
        this.winner = 'draw';
      } else if (val <= 0) {
        // monster lost
        this.winner = 'player';
      }
    },
  },
  methods: {
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.specialUsed = false;
      this.currentRound = 0;
      this.logMessages = [];
    },
    attackMonster() {
      if (this.specialUsed) this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player', 'attack', attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addLogMessage('monster', 'attack', attackValue);
    },
    specialAttackMonster() {
      this.specialUsed = true;
      if (this.specialUsed) this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addLogMessage('player', 'sp-attack', attackValue);
      this.attackPlayer();
    },
    heal() {
      if (this.specialUsed) this.currentRound++;
      const healValue = getRandomValue(8, 20);
      this.playerHealth =
        this.playerHealth + healValue > 100
          ? 100
          : (this.playerHealth += healValue);
      this.addLogMessage('player', 'heal', healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = 'monster';
    },
    addLogMessage(who, what, val) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: val,
      });
    },
  },
});

app.mount('#game');
