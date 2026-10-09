// HEXO GAME - Sanal puanlı oyunlar
const HEXO = {
  getBalance() {
    const value = localStorage.getItem("hexo_balance");
    if (value === null) {
      localStorage.setItem("hexo_balance", "1000");
      return 1000;
    }
    return Number(value);
  },

  setBalance(value) {
    localStorage.setItem("hexo_balance", String(value));
  },

  play(game) {
    let balance = this.getBalance();

    if (balance <= 0) {
      alert("Bakiyen 0 puan! Şimdilik oyun oynayamazsın.");
      return;
    }

    const input = prompt(
      `💜 HEXO GAME\nBakiyen: ${balance} puan\nKaç puanla oynayacaksın?`
    );

    if (input === null) return;

    const bet = Number(input);

    if (!Number.isInteger(bet) || bet <= 0 || bet > balance) {
      alert("Geçerli bir puan miktarı gir!");
      return;
    }

    let message = "";
    let won = false;
    let multiplier = 0;

    if (game === "Zar Oyunu") {
      const guess = Number(prompt("1 ile 6 arasında tahmin yap:"));
      if (!Number.isInteger(guess) || guess < 1 || guess > 6) {
        alert("1 ile 6 arasında bir sayı girmelisin.");
        return;
      }

      const result = Math.floor(Math.random() * 6) + 1;
      won = guess === result;
      multiplier = won ? 5 : 0;
      message = `🎲 Tahminin: ${guess}\nZar sonucu: ${result}`;
    }

    else if (game === "Yazı Tura") {
      const guess = prompt("Yazı mı, tura mı?").trim().toLowerCase();
      if (!["yazı", "tura", "yazi"].includes(guess)) {
        alert("Yazı veya tura seçmelisin.");
        return;
      }

      const result = Math.random() < 0.5 ? "Yazı" : "Tura";
      won = guess === result.toLowerCase() ||
        (guess === "yazi" && result === "Yazı");
      multiplier = won ? 2 : 0;
      message = `🪙 Seçimin: ${guess}\nSonuç: ${result}`;
    }

    else if (game === "Slot Makinesi") {
      const symbols = ["🍋", "🍊", "🍒", "💎", "⭐"];
      const results = Array.from(
        { length: 3 },
        () => symbols[Math.floor(Math.random() * symbols.length)]
      );

      won = results.every(symbol => symbol === results[0]);
      multiplier = won ? 5 : 0;
      message = `🎰 ${results.join(" | ")}`;
    }

    else if (game === "Çarkıfelek") {
      const options = [
        { label: "0x", mult: 0 },
        { label: "1x", mult: 1 },
        { label: "2x", mult: 2 },
        { label: "3x", mult: 3 }
      ];

      const result = options[Math.floor(Math.random() * options.length)];
      multiplier = result.mult;
      won = multiplier > 0;
      message = `🎡 Çark sonucu: ${result.label}`;
    }

    const payout = bet * multiplier;
    balance = balance - bet + payout;
    this.setBalance(balance);

    message += `\n\n${won ? "🎉 Kazanç" : "😅 Ödeme yok"}: ${payout} puan`;
    message += `\nYeni bakiye: ${balance} puan`;

    alert(message);
    this.updateBalance();
  },

  updateBalance() {
    let element = document.getElementById("hexo-balance");
    if (element) {
      element.textContent = this.getBalance() + " puan";
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".card");

  cards.forEach(card => {
    const title = card.querySelector("h3");
    if (!title) return;

    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      HEXO.play(title.textContent.trim());
    });
  });

  HEXO.updateBalance();
});
