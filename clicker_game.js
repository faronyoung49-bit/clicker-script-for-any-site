// ==UserScript==
// @name         Universal Clicker — Ascension, Prestige, Offline, Upgrades
// @namespace    https://example.com/
// @version      5.0
// @description  Full incremental clicker overlay for any site
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // -----------------------------
    // LOAD SAVED DATA
    // -----------------------------
    let score = Number(localStorage.getItem("uc_score") || 0);
    let clickPower = Number(localStorage.getItem("uc_clickPower") || 1);
    let autoLevel = Number(localStorage.getItem("uc_autoLevel") || 0);
    let autoSpeed = Number(localStorage.getItem("uc_autoSpeed") || 1000); // ms
    let passiveLevel = Number(localStorage.getItem("uc_passiveLevel") || 0);

    let prestige = Number(localStorage.getItem("uc_prestige") || 0);
    let prestigeHeight = Number(localStorage.getItem("uc_prestigeHeight") || 1);
    let prestigeCost = Number(localStorage.getItem("uc_prestigeCost") || 10000);

    let ascension = Number(localStorage.getItem("uc_ascension") || 0);

    // Upgrade costs
    let costClick1 = Number(localStorage.getItem("uc_costClick1") || 20);
    let costClick5 = Number(localStorage.getItem("uc_costClick5") || 100);
    let costClick25 = Number(localStorage.getItem("uc_costClick25") || 500);
    let costClick100 = Number(localStorage.getItem("uc_costClick100") || 2000);

    let costAuto = Number(localStorage.getItem("uc_costAuto") || 50);
    let costAutoSpeed = Number(localStorage.getItem("uc_costAutoSpeed") || 250);
    let costPassive = Number(localStorage.getItem("uc_costPassive") || 300);

    // Trees / shops (simple flags for now)
    let ascTree = JSON.parse(localStorage.getItem("uc_ascTree") || "{}");
    let preTree = JSON.parse(localStorage.getItem("uc_preTree") || "{}");
    let preShop = JSON.parse(localStorage.getItem("uc_preShop") || "{}");

    // -----------------------------
    // OFFLINE EARNINGS
    // -----------------------------
    const lastTime = Number(localStorage.getItem("uc_lastTime") || Date.now());
    const now = Date.now();
    const diffSeconds = Math.floor((now - lastTime) / 1000);

    if (diffSeconds > 5) {
        const offlineGain =
            diffSeconds *
            (autoLevel + passiveLevel) *
            (1 + prestige * 0.5) *
            prestigeHeight *
            (1 + ascension * 5);
        score += offlineGain;
        alert(`Welcome back! You earned ${offlineGain.toLocaleString()} while offline.`);
    }
    localStorage.setItem("uc_lastTime", now);

    // -----------------------------
    // PRESTIGE HEIGHT
    // -----------------------------
    function updatePrestigeHeight() {
        if (prestige >= 100) prestigeHeight = 5;
        else if (prestige >= 50) prestigeHeight = 4;
        else if (prestige >= 25) prestigeHeight = 3;
        else if (prestige >= 10) prestigeHeight = 2;
        else prestigeHeight = 1;
        localStorage.setItem("uc_prestigeHeight", prestigeHeight);
    }

    // -----------------------------
    // MULTIPLIERS
    // -----------------------------
    function getPrestigeMultiplier() {
        return (1 + prestige * 0.5) * prestigeHeight;
    }

    function getAscensionMultiplier() {
        return 1 + ascension * 5;
    }

    // Ascension tree bonuses (simple example)
    function getAscensionTreeBonuses() {
        let clickBonus = 1;
        let autoSpeedBonus = 1;
        let costBonus = 1;

        if (ascTree.A1) clickBonus *= 1.10;
        if (ascTree.A2) clickBonus *= 1.25;
        if (ascTree.A3) clickBonus *= 1.50;

        if (ascTree.B1) autoSpeedBonus *= 1.10;
        if (ascTree.B2) autoSpeedBonus *= 1.25;
        if (ascTree.B3) autoSpeedBonus *= 1.50;

        if (ascTree.C1) costBonus *= 0.95;
        if (ascTree.C2) costBonus *= 0.90;
        if (ascTree.C3) costBonus *= 0.80;

        return { clickBonus, autoSpeedBonus, costBonus };
    }

    // Prestige tree bonuses (simple example)
    function getPrestigeTreeBonuses() {
        let clickBonus = 1;
        let autoBonus = 0;
        let passiveBonus = 0;

        if (preTree.P11) clickBonus *= 1.05;
        if (preTree.P12) clickBonus *= 1.10;
        if (preTree.P13) clickBonus *= 1.20;

        if (preTree.P21) autoBonus += 1;
        if (preTree.P22) autoBonus += 2;
        if (preTree.P23) autoBonus += 3;

        if (preTree.P31) passiveBonus += 1;
        if (preTree.P32) passiveBonus += 2;
        if (preTree.P33) passiveBonus += 3;

        return { clickBonus, autoBonus, passiveBonus };
    }

    // Prestige shop bonuses
    function getPrestigeShopBonuses() {
        let permClick = preShop.permClick || 0;
        let permAuto = preShop.permAuto || 0;
        let permPassive = preShop.permPassive || 0;
        let permDiscount = preShop.permDiscount || 0;

        let shopClickBonus = permClick * prestige;
        let shopAutoBonus = permAuto * prestige;
        let shopPassiveBonus = permPassive * prestige;
        let shopDiscount = permDiscount * prestige * 0.01;

        return { shopClickBonus, shopAutoBonus, shopPassiveBonus, shopDiscount };
    }

    function applyDiscount(cost, discountFactor) {
        return Math.floor(cost * (1 - discountFactor));
    }

    // -----------------------------
    // SAVE FUNCTION
    // -----------------------------
    function save() {
        localStorage.setItem("uc_score", score);
        localStorage.setItem("uc_clickPower", clickPower);
        localStorage.setItem("uc_autoLevel", autoLevel);
        localStorage.setItem("uc_autoSpeed", autoSpeed);
        localStorage.setItem("uc_passiveLevel", passiveLevel);

        localStorage.setItem("uc_prestige", prestige);
        localStorage.setItem("uc_prestigeHeight", prestigeHeight);
        localStorage.setItem("uc_prestigeCost", prestigeCost);

        localStorage.setItem("uc_costClick1", costClick1);
        localStorage.setItem("uc_costClick5", costClick5);
        localStorage.setItem("uc_costClick25", costClick25);
        localStorage.setItem("uc_costClick100", costClick100);

        localStorage.setItem("uc_costAuto", costAuto);
        localStorage.setItem("uc_costAutoSpeed", costAutoSpeed);
        localStorage.setItem("uc_costPassive", costPassive);

        localStorage.setItem("uc_ascension", ascension);
        localStorage.setItem("uc_ascTree", JSON.stringify(ascTree));
        localStorage.setItem("uc_preTree", JSON.stringify(preTree));
        localStorage.setItem("uc_preShop", JSON.stringify(preShop));

        localStorage.setItem("uc_lastTime", Date.now());
    }

    // -----------------------------
    // UI PANEL
    // -----------------------------
    const box = document.createElement("div");
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.width = "300px";
    box.style.background = "white";
    box.style.border = "2px solid #4C97FF";
    box.style.borderRadius = "10px";
    box.style.padding = "10px";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.zIndex = "999999999";
    box.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    box.style.cursor = "move";

    box.innerHTML = `
        <strong style="color:#4C97FF;font-size:20px;">Universal Clicker</strong><br><br>

        <div id="uc_score" style="font-size:18px;margin-bottom:10px;">
            Score: ${score}
        </div>

        <button id="uc_click" style="
            width:100%;padding:8px;margin-bottom:10px;
            background:#4C97FF;color:white;border:none;border-radius:6px;
            font-size:16px;
        ">Click (+${clickPower})</button>

        <hr>

        <div style="font-weight:bold;margin:6px 0;font-size:16px;">Shop</div>

        <button id="up_click1" style="width:100%;padding:6px;margin-bottom:6px;background:#5bc0de;color:white;border:none;border-radius:6px;">🔨 +1 Click Power — ${costClick1}</button>
        <button id="up_click5" style="width:100%;padding:6px;margin-bottom:6px;background:#0275d8;color:white;border:none;border-radius:6px;">⚡ +5 Click Power — ${costClick5}</button>
        <button id="up_click25" style="width:100%;padding:6px;margin-bottom:6px;background:#1e7fc1;color:white;border:none;border-radius:6px;">💥 +25 Click Power — ${costClick25}</button>
        <button id="up_click100" style="width:100%;padding:6px;margin-bottom:6px;background:#0056a3;color:white;border:none;border-radius:6px;">🔥 +100 Click Power — ${costClick100}</button>

        <button id="up_auto" style="width:100%;padding:6px;margin-bottom:6px;background:#5cb85c;color:white;border:none;border-radius:6px;">🤖 Auto‑Click L${autoLevel} — ${costAuto}</button>
        <button id="up_autoSpeed" style="width:100%;padding:6px;margin-bottom:6px;background:#449d44;color:white;border:none;border-radius:6px;">⏩ Faster Auto‑Click — ${costAutoSpeed}</button>
        <button id="up_passive" style="width:100%;padding:6px;margin-bottom:6px;background:#8bc34a;color:white;border:none;border-radius:6px;">💰 Passive Income L${passiveLevel} — ${costPassive}</button>

        <hr>

        <div style="font-weight:bold;margin:6px 0;font-size:16px;">Prestige</div>

        <button id="uc_prestige" style="
            width:100%;padding:8px;margin-bottom:6px;
            background:#f0ad4e;color:white;border:none;border-radius:6px;
            font-size:15px;
        ">🔥 Prestige (Cost: ${prestigeCost})</button>

        <div id="uc_prestigeInfo" style="margin-bottom:10px;font-size:14px;">
            Prestige: <strong>${prestige}</strong><br>
            Height: <strong>${prestigeHeight}</strong>
        </div>

        <button id="uc_preTree" style="width:100%;padding:6px;background:#d35400;color:white;border:none;border-radius:6px;margin-bottom:4px;">
            🔥 Prestige Tree
        </button>
        <button id="uc_preShop" style="width:100%;padding:6px;background:#c0392b;color:white;border:none;border-radius:6px;margin-bottom:4px;">
            🛒 Prestige Shop
        </button>

        <hr>

        <div style="font-weight:bold;margin:6px 0;font-size:16px;">Ascension</div>

        <button id="uc_ascend" style="
            width:100%;padding:8px;margin-bottom:6px;
            background:#9b59b6;color:white;border:none;border-radius:6px;
            font-size:15px;
        ">
            🌌 Ascend (Requires Prestige 50)
        </button>

        <div id="uc_ascInfo" style="margin-bottom:10px;font-size:14px;">
            Ascension Points: <strong>${ascension}</strong>
        </div>

        <button id="uc_ascTree" style="width:100%;padding:6px;background:#8e44ad;color:white;border:none;border-radius:6px;margin-bottom:4px;">
            🌌 Ascension Tree
        </button>

        <hr>

        <button id="uc_reset" style="
            width:100%;padding:6px;margin-bottom:6px;
            background:#d9534f;color:white;border:none;border-radius:6px;
        ">Reset</button>
    `;

    document.body.appendChild(box);

    // -----------------------------
    // DRAGGING
    // -----------------------------
    let dragging = false;
    let offsetX = 0, offsetY = 0;

    box.addEventListener("mousedown", e => {
        dragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
    });

    document.addEventListener("mouseup", () => dragging = false);

    document.addEventListener("mousemove", e => {
        if (dragging) {
            box.style.left = (e.clientX - offsetX) + "px";
            box.style.top = (e.clientY - offsetY) + "px";
            box.style.right = "auto";
        }
    });

    // -----------------------------
    // UPDATE UI
    // -----------------------------
    function update() {
        const prestigeMult = getPrestigeMultiplier();
        const ascMult = getAscensionMultiplier();
        const ascTreeBonus = getAscensionTreeBonuses();
        const preTreeBonus = getPrestigeTreeBonuses();
        const shopBonus = getPrestigeShopBonuses();

        const totalMult = prestigeMult * ascMult * ascTreeBonus.clickBonus * preTreeBonus.clickBonus;

        document.getElementById("uc_score").textContent = "Score: " + Math.floor(score);
        document.getElementById("uc_click").textContent = `Click (+${clickPower})`;

        document.getElementById("up_click1").textContent = `🔨 +1 Click Power — ${costClick1}`;
        document.getElementById("up_click5").textContent = `⚡ +5 Click Power — ${costClick5}`;
        document.getElementById("up_click25").textContent = `💥 +25 Click Power — ${costClick25}`;
        document.getElementById("up_click100").textContent = `🔥 +100 Click Power — ${costClick100}`;

        document.getElementById("up_auto").textContent = `🤖 Auto‑Click L${autoLevel} — ${costAuto}`;
        document.getElementById("up_autoSpeed").textContent = `⏩ Faster Auto‑Click — ${costAutoSpeed}`;
        document.getElementById("up_passive").textContent = `💰 Passive Income L${passiveLevel} — ${costPassive}`;

        document.getElementById("uc_prestige").textContent = `🔥 Prestige (Cost: ${prestigeCost})`;
        document.getElementById("uc_prestigeInfo").innerHTML =
            `Prestige: <strong>${prestige}</strong><br>` +
            `Height: <strong>${prestigeHeight}</strong><br>` +
            `Prestige Mult: x${prestigeMult.toFixed(2)}<br>` +
            `Asc Mult: x${ascMult.toFixed(2)}<br>` +
            `Total Mult: x${totalMult.toFixed(2)}`;

        document.getElementById("uc_ascInfo").innerHTML =
            `Ascension Points: <strong>${ascension}</strong>`;

        save();
    }

    // -----------------------------
    // CLICK BUTTON
    // -----------------------------
    document.getElementById("uc_click").onclick = () => {
        const prestigeMult = getPrestigeMultiplier();
        const ascMult = getAscensionMultiplier();
        const ascTreeBonus = getAscensionTreeBonuses();
        const preTreeBonus = getPrestigeTreeBonuses();
        const totalMult = prestigeMult * ascMult * ascTreeBonus.clickBonus * preTreeBonus.clickBonus;
        score += clickPower * totalMult;
        update();
    };

    // -----------------------------
    // GENERIC BUY FUNCTION
    // -----------------------------
    function buy(costRef, scale, apply) {
        const shopBonus = getPrestigeShopBonuses();
        const ascTreeBonus = getAscensionTreeBonuses();
        let effectiveCost = applyDiscount(costRef.value, shopBonus.shopDiscount);
        effectiveCost = Math.floor(effectiveCost * ascTreeBonus.costBonus);

        if (score >= effectiveCost) {
            score -= effectiveCost;
            apply();
            costRef.value = Math.floor(costRef.value * scale);
            update();
        }
    }

    // -----------------------------
    // UPGRADES
    // -----------------------------
    document.getElementById("up_click1").onclick = () =>
        buy({ value: costClick1 }, 1.5, () => { clickPower += 1; costClick1 = costClick1 * 1.5; });

    document.getElementById("up_click5").onclick = () =>
        buy({ value: costClick5 }, 1.7, () => { clickPower += 5; costClick5 = costClick5 * 1.7; });

    document.getElementById("up_click25").onclick = () =>
        buy({ value: costClick25 }, 1.8, () => { clickPower += 25; costClick25 = costClick25 * 1.8; });

    document.getElementById("up_click100").onclick = () =>
        buy({ value: costClick100 }, 2.0, () => { clickPower += 100; costClick100 = costClick100 * 2.0; });

    document.getElementById("up_auto").onclick = () =>
        buy({ value: costAuto }, 2.0, () => { autoLevel += 1; costAuto = costAuto * 2.0; });

    document.getElementById("up_autoSpeed").onclick = () =>
        buy({ value: costAutoSpeed }, 2.5, () => {
            autoSpeed = Math.max(100, autoSpeed - 100);
            costAutoSpeed = costAutoSpeed * 2.5;
        });

    document.getElementById("up_passive").onclick = () =>
        buy({ value: costPassive }, 2.2, () => { passiveLevel += 1; costPassive = costPassive * 2.2; });

    // -----------------------------
    // AUTO‑CLICKER LOOP
    // -----------------------------
    setInterval(() => {
        if (autoLevel > 0) {
            const prestigeMult = getPrestigeMultiplier();
            const ascMult = getAscensionMultiplier();
            const ascTreeBonus = getAscensionTreeBonuses();
            const preTreeBonus = getPrestigeTreeBonuses();
            const shopBonus = getPrestigeShopBonuses();
            const totalMult = prestigeMult * ascMult * ascTreeBonus.clickBonus * preTreeBonus.clickBonus;
            score += (autoLevel + preTreeBonus.autoBonus + shopBonus.shopAutoBonus) * totalMult;
            update();
        }
    }, autoSpeed);

    // -----------------------------
    // PASSIVE INCOME LOOP
    // -----------------------------
    setInterval(() => {
        if (passiveLevel > 0) {
            const prestigeMult = getPrestigeMultiplier();
            const ascMult = getAscensionMultiplier();
            const ascTreeBonus = getAscensionTreeBonuses();
            const preTreeBonus = getPrestigeTreeBonuses();
            const shopBonus = getPrestigeShopBonuses();
            const totalMult = prestigeMult * ascMult * ascTreeBonus.clickBonus * preTreeBonus.clickBonus;
            score += (passiveLevel + preTreeBonus.passiveBonus + shopBonus.shopPassiveBonus) * totalMult;
            update();
        }
    }, 1000);

    // -----------------------------
    // PRESTIGE
    // -----------------------------
    document.getElementById("uc_prestige").onclick = () => {
        if (score >= prestigeCost) {
            prestige += 1;
            updatePrestigeHeight();

            // Reset everything except ascension & trees/shop
            score = 0;
            clickPower = 1;
            autoLevel = 0;
            autoSpeed = 1000;
            passiveLevel = 0;

            // Reset costs
            costClick1 = 20;
            costClick5 = 100;
            costClick25 = 500;
            costClick100 = 2000;

            costAuto = 50;
            costAutoSpeed = 250;
            costPassive = 300;

            prestigeCost = Math.floor(prestigeCost * 3);

            alert(`Prestiged! Total Prestige: ${prestige}`);
            update();
        }
    };

    // -----------------------------
    // ASCENSION
    // -----------------------------
    document.getElementById("uc_ascend").onclick = () => {
        if (prestige < 50) {
            alert("You need at least 50 Prestige to Ascend.");
            return;
        }

        const gained = Math.floor(prestige / 50);
        ascension += gained;

        // Reset EVERYTHING except ascension and trees/shop
        score = 0;
        clickPower = 1;
        autoLevel = 0;
        autoSpeed = 1000;
        passiveLevel = 0;

        prestige = 0;
        prestigeHeight = 1;
        prestigeCost = 10000;

        // Reset costs
        costClick1 = 20;
        costClick5 = 100;
        costClick25 = 500;
        costClick100 = 2000;

        costAuto = 50;
        costAutoSpeed = 250;
        costPassive = 300;

        alert(`You Ascended and gained ${gained} Ascension Points!`);
        update();
    };

    // -----------------------------
    // SIMPLE TREE / SHOP POPUPS
    // -----------------------------
    document.getElementById("uc_ascTree").onclick = () => {
        alert(`ASCENSION TREE (placeholder)
Use Ascension Points to unlock:
A1/A2/A3: Click power boosts
B1/B2/B3: Auto speed boosts
C1/C2/C3: Cost reductions

You can wire these to set ascTree flags and call update().`);
    };

    document.getElementById("uc_preTree").onclick = () => {
        alert(`PRESTIGE TREE (placeholder)
Use Prestige Points (you can define PP later) to unlock:
P11/P12/P13: Click power boosts
P21/P22/P23: Auto-click boosts
P31/P32/P33: Passive income boosts

Wire to preTree flags and call update().`);
    };

    document.getElementById("uc_preShop").onclick = () => {
        alert(`PRESTIGE SHOP (placeholder)
Permanent upgrades that scale with Prestige:
permClick, permAuto, permPassive, permDiscount

Wire to preShop object and call update().`);
    };

    // -----------------------------
    // RESET EVERYTHING
    // -----------------------------
    document.getElementById("uc_reset").onclick = () => {
        if (confirm("Reset EVERYTHING?")) {
            localStorage.clear();
            location.reload();
        }
    };

    update();
})();
