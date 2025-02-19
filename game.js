// Player object holds the player’s stats, including HP.
const player = {
    level: 1,
    xp: 0,
    gold: 0,
    xpNeeded: 100,
    attackPower: 10,
    hp: 100,
    maxHp: 100
  };

  // Enemy object defines enemy stats and rewards.
  let enemy = {
    hp: 50,
    maxHp: 50,
    xpReward: 50,
    goldReward: 20
  };

  // Flag to track if the new character skin has been purchased.
  let characterPurchased = false;

  // Save game progress to localStorage.
  function saveGame() {
    const gameData = {
      player,
      enemy,
      characterPurchased
    };
    localStorage.setItem("gameSave", JSON.stringify(gameData));
  }

  // Load game progress from localStorage.
  function loadGame() {
    const savedGame = localStorage.getItem("gameSave");
    if (savedGame) {
      const data = JSON.parse(savedGame);
      Object.assign(player, data.player);
      Object.assign(enemy, data.enemy);
      characterPurchased = data.characterPurchased;

      // If the character skin was purchased, update the sprite and disable the purchase button.
      if (characterPurchased) {
        document.getElementById('player-sprite').style.backgroundImage = "url('player-sprite2.png')";
        document.getElementById('buy-character-btn').disabled = true;
      }
    }
    updateDisplay();
  }

  // Update the display to reflect current game state.
  function updateDisplay() {
    document.getElementById('player-level').textContent = player.level;
    document.getElementById('player-xp').textContent = player.xp;
    document.getElementById('player-xp-needed').textContent = player.xpNeeded;
    document.getElementById('player-gold').textContent = player.gold;
    document.getElementById('player-attack').textContent = player.attackPower;
    document.getElementById('enemy-hp').textContent = enemy.hp;
    document.getElementById('player-current-hp').textContent = player.hp;
    document.getElementById('player-max-hp').textContent = player.maxHp;

    // Update enemy HP bar width
    const enemyHpFill = document.getElementById('enemy-hp-fill');
    const enemyHpPercent = (enemy.hp / enemy.maxHp) * 100;
    enemyHpFill.style.width = enemyHpPercent + '%';

    // Update player HP bar width
    const playerHpFill = document.getElementById('player-hp-fill');
    const playerHpPercent = (player.hp / player.maxHp) * 100;
    playerHpFill.style.width = playerHpPercent + '%';

    // Save progress after every update.
    saveGame();
  }

  // Animate the player's container to move toward the enemy on attack.
  function animateAttack() {
    const playerContainer = document.getElementById('player-container');
    const playerSprite = document.getElementById('player-sprite');

    // Add movement animation.
    playerContainer.classList.add('attack-move');
    // Optional: Switch to an attack animation sequence for the sprite.
    playerSprite.classList.add('attack-animation');

    // Remove the animation classes after the duration so it resets.
    setTimeout(() => {
      playerContainer.classList.remove('attack-move');
      playerSprite.classList.remove('attack-animation');
    }, 500); // Duration matches the CSS transition/animation duration.
  }

  // Function to handle the player attacking the enemy.
  function attackEnemy() {
    animateAttack(); // Animate the player's movement and sprite.

    enemy.hp -= player.attackPower;

    // Check if the enemy is defeated.
    if (enemy.hp <= 0) {
      enemyDefeated();
    }

    updateDisplay();
  }

  // Handle what happens when an enemy is defeated.
  function enemyDefeated() {
    // Reward the player.
    player.gold += enemy.goldReward;
    player.xp += enemy.xpReward;
    levelUp();
    resetEnemy();
    updateDisplay();
  }

  // Increase player level if enough XP is accumulated.
  function levelUp() {
    while (player.xp >= player.xpNeeded) {
      player.xp -= player.xpNeeded;
      player.level++;
      player.attackPower += 5;  // Increase attack power per level.
      // Increase XP needed for the next level.
      player.xpNeeded = Math.floor(player.xpNeeded * 1.5);
    }
  }

  // Reset the enemy with slightly tougher stats.
  function resetEnemy() {
    enemy.maxHp += 10; // Increase enemy health to scale the challenge.
    enemy.hp = enemy.maxHp;
    enemy.xpReward += 10;
    enemy.goldReward += 10;
  }

  // Shop functionality
  // Toggle shop visibility.
  document.getElementById('shop-toggle-btn').addEventListener('click', () => {
    const shopContainer = document.getElementById('shop-container');
    shopContainer.style.display = (shopContainer.style.display === "none" ? "block" : "none");
  });

  // Handle purchasing a new character skin.
  document.getElementById('buy-character-btn').addEventListener('click', () => {
    if (player.gold >= 100 && !characterPurchased) {
      player.gold -= 100;
      characterPurchased = true;
      // Change the player's sprite to the new character skin.
      document.getElementById('player-sprite').style.backgroundImage = "url('player-sprite2.png')";
      updateDisplay();
      alert("New character unlocked!");
      // Disable the purchase button.
      document.getElementById('buy-character-btn').disabled = true;
    } else if (characterPurchased) {
      alert("You already own this character!");
    } else {
      alert("Not enough gold!");
    }
  });

  // Reset progress functionality.
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm("Are you sure you want to reset your progress?")) {
      localStorage.removeItem("gameSave");
      // Reload the page to restart the game.
      location.reload();
    }
  });

  // Set up the button click event for manual attack.
  document.getElementById('attack-btn').addEventListener('click', attackEnemy);

  // Optional: Automatic attacks every 2 seconds.
  setInterval(() => {
    attackEnemy();
  }, 2000);

  // Load saved game progress on page load.
  loadGame();
