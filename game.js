// game.js

// Game Variables
let playerHealth = 100;
let playerDamage = 10;
let playerXP = 0;
let playerGold = 0;
let playerLevel = 1;
let attackSpeed = 1000; // Milliseconds per attack
let round = 1;
let enemyHealth = 50;
let enemyDamage = 5;

// DOM Elements
const playerHealthElem = document.getElementById('player-health');
const playerDamageElem = document.getElementById('player-damage');
const playerXPelem = document.getElementById('player-xp');
const playerGoldElem = document.getElementById('player-gold');
const playerLevelElem = document.getElementById('player-level');
const roundElem = document.getElementById('round-number');
const enemyHealthElem = document.getElementById('enemy-health');
const startRoundBtn = document.getElementById('start-round');
const upgradeDamageBtn = document.getElementById('upgrade-damage');
const upgradeHealthBtn = document.getElementById('upgrade-health');
const upgradeSpeedBtn = document.getElementById('upgrade-speed');

// Game loop functions
function startRound() {
  if (playerHealth <= 0) return;

  // Set enemy stats for current round
  if (round % 10 === 0) {
    enemyHealth = 200;  // Boss enemy health
    enemyDamage = 15;   // Boss enemy damage
  } else {
    enemyHealth = 50 + (round * 5); // Normal enemy health increases
    enemyDamage = 5 + (round * 1); // Normal enemy damage increases
  }

  // Update enemy health on UI
  enemyHealthElem.textContent = enemyHealth;

  // Combat: Player attacks the enemy
  let combatInterval = setInterval(() => {
    enemyHealth -= playerDamage;
    if (enemyHealth <= 0) {
      clearInterval(combatInterval);
      handleEnemyDefeat();
    }

    // Enemy attacks player
    playerHealth -= enemyDamage;
    playerHealthElem.textContent = playerHealth;
    if (playerHealth <= 0) {
      clearInterval(combatInterval);
      alert("You died! Game over.");
    }

  }, attackSpeed); // Player attacks at the attackSpeed interval
}

function handleEnemyDefeat() {
  // Reward the player with Gold and XP
  const xpReward = (round % 10 === 0) ? 50 : 20;  // More XP for boss fights
  const goldReward = (round % 10 === 0) ? 100 : 50;

  playerXP += xpReward;
  playerGold += goldReward;

  // Update player stats
  playerXPelem.textContent = playerXP;
  playerGoldElem.textContent = playerGold;

  // Level up player if enough XP
  if (playerXP >= 100 * playerLevel) {
    playerLevel++;
    playerDamage += 5;
    playerHealth += 10;
    playerLevelElem.textContent = playerLevel;
    playerDamageElem.textContent = playerDamage;
    playerHealthElem.textContent = playerHealth;
  }

  // Start the next round
  round++;
  roundElem.textContent = round;
}

function upgradeDamage() {
  if (playerGold >= 50) {
    playerGold -= 50;
    playerDamage += 5;
    playerDamageElem.textContent = playerDamage;
    playerGoldElem.textContent = playerGold;
  }
}

function upgradeHealth() {
  if (playerGold >= 100) {
    playerGold -= 100;
    playerHealth += 20;
    playerHealthElem.textContent = playerHealth;
    playerGoldElem.textContent = playerGold;
  }
}

function upgradeSpeed() {
  if (playerGold >= 150) {
    playerGold -= 150;
    attackSpeed = Math.max(500, attackSpeed - 100);  // Max attack speed cap
    playerGoldElem.textContent = playerGold;
  }
}

// Event listeners for button clicks
startRoundBtn.addEventListener('click', startRound);
upgradeDamageBtn.addEventListener('click', upgradeDamage);
upgradeHealthBtn.addEventListener('click', upgradeHealth);
upgradeSpeedBtn.addEventListener('click', upgradeSpeed);