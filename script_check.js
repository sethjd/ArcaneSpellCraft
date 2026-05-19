
(() => {
    "use strict";

    const CARD_DB = Object.freeze([
        { id: "inferno", image: "assets/cards/inferno_blast.webp", name: "Inferno Blast", type: "spell", shopCost: 3, effect: "damage", damage: 4, desc: "Burn 4" },
        { id: "surge", image: "assets/cards/arcane_surge.webp", name: "Arcane Surge", type: "spell", shopCost: 2, effect: "damage", damage: 2, desc: "Zap 2" },
        { id: "healwave", image: "assets/cards/healing_wave.webp", name: "Healing Wave", type: "spell", shopCost: 3, effect: "heal", heal: 5, desc: "Heal 5" },
        { id: "frostshield_spell", image: "assets/cards/frost_shield.webp", name: "Frost Shield", type: "spell", shopCost: 2, effect: "summonDefender", hp: 4, desc: "Summon 0/4" },
        { id: "cloak", image: "assets/cards/ethereal_cloak.webp", name: "Ethereal Cloak", type: "spell", shopCost: 3, effect: "cloak", desc: "Block damage" },
        { id: "mindcontrol", image: "assets/cards/mind_control.webp", name: "Mind Control", type: "spell", shopCost: 5, effect: "mindControl", desc: "Steal enemy" },
        { id: "thunderstrike", image: "assets/cards/thunderstrike.webp", name: "Thunderstrike", type: "spell", shopCost: 4, effect: "thunderstrike", damage: 4, desc: "Hit 2 targets" },
        { id: "fire_ele", image: "assets/cards/fire_elemental.webp", name: "Fire Elemental", type: "creature", shopCost: 4, atk: 4, hp: 6, elemental: true, element: "fire", desc: "Fire link" },
        { id: "earth_ele", image: "assets/cards/earth_elemental.webp", name: "Earth Elemental", type: "creature", shopCost: 4, atk: 4, hp: 6, elemental: true, element: "earth", desc: "Earth link" },
        { id: "water_ele", image: "assets/cards/water_elemental.webp", name: "Water Elemental", type: "creature", shopCost: 4, atk: 4, hp: 6, elemental: true, element: "water", desc: "Water link" },
        { id: "storm_ele", image: "assets/cards/storm_elemental.webp", name: "Storm Elemental", type: "creature", shopCost: 4, atk: 4, hp: 6, elemental: true, element: "storm", desc: "Storm link" },
        { id: "frostwolf", image: "assets/cards/frostwolf_pack.webp", name: "Frostwolf Pack", type: "creature", shopCost: 3, atk: 2, hp: 4, desc: "Fast pack" },
        { id: "panther", image: "assets/cards/shadow_panther.webp", name: "Shadow Panther", type: "creature", shopCost: 3, atk: 2, hp: 4, desc: "Quick threat" },
        { id: "hydra", image: "assets/cards/venomous_hydra.webp", name: "Venomous Hydra", type: "creature", shopCost: 2, atk: 2, hp: 2, desc: "Cheap attacker" },
        { id: "unicorn", image: "assets/cards/celestial_unicorn.webp", name: "Celestial Unicorn", type: "creature", shopCost: 3, atk: 0, hp: 4, startHeal: 2, desc: "End heal 2" },
        { id: "golem", image: "assets/cards/earth_golem.webp", name: "Earth Golem", type: "creature", shopCost: 6, atk: 0, hp: 6, defender: true, onSummonDiscard: true, desc: "Defender" },
        { id: "treant", image: "assets/cards/ancient_treant.webp", name: "Ancient Treant", type: "creature", shopCost: 2, atk: 0, hp: 10, defender: true, desc: "Wall" },
        { id: "frostshield_creature", image: "assets/cards/frost_shield.webp", name: "Frost Shield", type: "creature", shopCost: 2, atk: 0, hp: 4, defender: true, desc: "Defender" },
        { id: "thunderbird", image: "assets/cards/thunderbird.webp", name: "Thunderbird", type: "creature", shopCost: 4, atk: 4, hp: 5, thunderSynergy: true, desc: "+1 on thunder" },
        { id: "behemoth", image: "assets/cards/ironclad_behemoth.webp", name: "Ironclad Behemoth", type: "creature", shopCost: 7, atk: 5, hp: 10, desc: "Huge body" },
        { id: "wraith", image: "assets/cards/spectral_wraith.webp", name: "Spectral Wraith", type: "oneshot", shopCost: 4, effect: "damage", damage: 4, desc: "Strike 4" },
        { id: "lavadrake", image: "assets/cards/lava_drake.webp", name: "Lava Drake", type: "oneshot", shopCost: 5, effect: "damage", damage: 10, desc: "Blast 10" },
        { id: "souleater", image: "assets/cards/soul_eater.webp", name: "Soul Eater", type: "oneshot", shopCost: 6, effect: "damage", damage: 4, desc: "Drain strike" },
        { id: "phoenix", image: "assets/cards/phoenix_reborn.webp", name: "Phoenix Reborn", type: "oneshot", shopCost: 7, effect: "revive", desc: "Revive full" }
    ]);

    const CENTRAL_MULTIPLIER = Object.freeze({
        inferno: 4, surge: 3, healwave: 3, frostshield_spell: 3, cloak: 3, mindcontrol: 1, thunderstrike: 3,
        fire_ele: 3, earth_ele: 3, water_ele: 3, storm_ele: 3, frostwolf: 3, panther: 3, hydra: 3, unicorn: 3,
        golem: 2, treant: 2, frostshield_creature: 2, thunderbird: 2, behemoth: 2,
        wraith: 3, lavadrake: 2, souleater: 2, phoenix: 1
    });

    const ARCANE_CLUSTER_CARD = Object.freeze({ id: "cluster", image: "assets/cards/arcane_cluster.webp", name: "Arcane Cluster", type: "economy", shopCost: 3, shardGain: 3, desc: "+3 shards" });
    const SHARD_CARD_TEMPLATE = Object.freeze({ id: "shard", image: "assets/cards/shard_card.webp", name: "Shard Card", type: "economy", shardGain: 1, desc: "+1 shard" });
    const STARTING_HP = 80;
    const MAX_HP = 99;
    const HAND_DRAW = 5;
    const MAX_LOGS = 14;

    const els = {
        app: document.getElementById("app"),
        subtitle: document.getElementById("subtitle"),
        turnChip: document.getElementById("turnChip"),
        statusMini: document.getElementById("statusMini"),
        actionHint: document.getElementById("actionHint"),
        endTurnBtn: document.getElementById("endTurnBtn"),
        aiZone: document.getElementById("aiZone"),
        playerZone: document.getElementById("playerZone"),
        opponentZoneName: document.getElementById("opponentZoneName"),
        playerZoneName: document.getElementById("playerZoneName"),
        opponentFieldLabel: document.getElementById("opponentFieldLabel"),
        opponentHandLabel: document.getElementById("opponentHandLabel"),
        playerHandLabel: document.getElementById("playerHandLabel"),
        playerFieldLabel: document.getElementById("playerFieldLabel"),
        aiHp: document.getElementById("aiHp"),
        playerHp: document.getElementById("playerHp"),
        floatingTargets: document.getElementById("floatingTargets"),
        floatingTargetLabel: document.getElementById("floatingTargetLabel"),
        floatingAiHp: document.getElementById("floatingAiHp"),
        aiShards: document.getElementById("aiShards"),
        playerShards: document.getElementById("playerShards"),
        aiHandCount: document.getElementById("aiHandCount"),
        playerHandCount: document.getElementById("playerHandCount"),
        aiDeckCount: document.getElementById("aiDeckCount"),
        playerDeckCount: document.getElementById("playerDeckCount"),
        playerDiscardCount: document.getElementById("playerDiscardCount"),
        aiFieldCount: document.getElementById("aiFieldCount"),
        playerFieldCount: document.getElementById("playerFieldCount"),
        centralDeckCount: document.getElementById("centralDeckCount"),
        clusterStock: document.getElementById("clusterStock"),
        aiBattlefield: document.getElementById("aiBattlefield"),
        playerBattlefield: document.getElementById("playerBattlefield"),
        playerHand: document.getElementById("playerHand"),
        aiHand: document.getElementById("aiHand"),
        aiReveals: document.getElementById("aiReveals"),
        shop: document.getElementById("shop"),
        gameLog: document.getElementById("gameLog"),
        debugLog: document.getElementById("debugLog"),
        modalRoot: document.getElementById("modalRoot")
    };

    let uidCounter = 1;
    let pointerStart = null;
    let renderQueued = false;
    let tapLocked = false;

    const state = {
        active: false,
        mode: "ai",
        names: { player: "Player 1", ai: "AI" },
        awaitingPass: false,
        turn: "player",
        centralDeck: [],
        shopCards: [],
        arcaneClustersRemaining: 6,
        selectedAttackerUid: null,
        pendingSpell: null,
        logs: [],
        debugLines: [],
        player: null,
        ai: null
    };

    function nextUid() {
        uidCounter += 1;
        return `c${uidCounter}`;
    }

    function cloneCard(card) {
        return { ...card, uid: nextUid() };
    }

    function makePlayer() {
        return {
            hp: STARTING_HP,
            field: [],
            hand: [],
            deck: makeStarterDeck(),
            discard: [],
            graveyard: [],
            shards: 0,
            attackedThisTurn: new Set(),
            cloakActive: false
        };
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    function cardById(id) {
        return CARD_DB.find(card => card.id === id);
    }

    function makeStarterDeck() {
        const starter = [];
        for (let i = 0; i < 5; i++) starter.push(cloneCard(SHARD_CARD_TEMPLATE));
        starter.push(cloneCard(cardById("inferno")));
        starter.push(cloneCard(cardById("surge")));
        return shuffleArray(starter);
    }

    function buildCentralDeck() {
        const deck = [];
        for (const card of CARD_DB) {
            const count = CENTRAL_MULTIPLIER[card.id] || 0;
            for (let i = 0; i < count; i++) deck.push(cloneCard(card));
        }
        return shuffleArray(deck);
    }

    function other(ownerId) {
        return ownerId === "player" ? "ai" : "player";
    }

    function actor(ownerId) {
        return state[ownerId];
    }

    function labelFor(ownerId) {
        return state.names?.[ownerId] || (ownerId === "player" ? "Player 1" : "AI");
    }

    function isHumanOwner(ownerId) {
        return ownerId === "player" || state.mode === "pass";
    }

    function currentHumanOwner() {
        return state.mode === "pass" ? state.turn : "player";
    }

    function visibleBottomOwner() {
        return state.mode === "pass" && state.turn === "ai" ? "ai" : "player";
    }

    function visibleTopOwner() {
        return other(visibleBottomOwner());
    }

    function isHeroRef(ref) {
        return ref && ref.kind === "hero";
    }

    function isCreatureRef(ref) {
        return ref && ref.kind === "creature";
    }

    function findCreature(ownerId, uid) {
        return actor(ownerId).field.find(card => card.uid === uid) || null;
    }

    function findHandCard(ownerId, uid) {
        return actor(ownerId).hand.find(card => card.uid === uid) || null;
    }

    function getTargetRefFromElement(target) {
        const ownerId = target.dataset.owner;
        if (!ownerId) return null;
        if (target.dataset.action === "target-hero") return { kind: "hero", ownerId };
        if (target.dataset.action === "field-card") return { kind: "creature", ownerId, uid: target.dataset.uid };
        return null;
    }

    function resolveRef(ref) {
        if (isHeroRef(ref)) return actor(ref.ownerId);
        if (isCreatureRef(ref)) return findCreature(ref.ownerId, ref.uid);
        return null;
    }

    function refKey(ref) {
        return isHeroRef(ref) ? `hero:${ref.ownerId}` : `creature:${ref.ownerId}:${ref.uid}`;
    }

    function targetName(ref) {
        if (isHeroRef(ref)) return ref.ownerId === "player" ? "you" : "enemy hero";
        const target = resolveRef(ref);
        return target ? target.name : "target";
    }

    function getDamageTargets(ownerId) {
        const defenderId = other(ownerId);
        const defender = actor(defenderId);
        const defenders = defender.field.filter(card => card.defender);
        if (defenders.length > 0) {
            return defenders.map(card => ({ kind: "creature", ownerId: defenderId, uid: card.uid }));
        }
        return [
            ...defender.field.map(card => ({ kind: "creature", ownerId: defenderId, uid: card.uid })),
            { kind: "hero", ownerId: defenderId }
        ];
    }

    function isLegalDamageTarget(ownerId, ref) {
        return getDamageTargets(ownerId).some(legal => refKey(legal) === refKey(ref));
    }

    function isDamageBlockedByCloak(ref) {
        const ownerId = isHeroRef(ref) ? ref.ownerId : ref.ownerId;
        return actor(ownerId).cloakActive;
    }

    function removeCreature(ownerId, uid) {
        const p = actor(ownerId);
        const index = p.field.findIndex(card => card.uid === uid);
        if (index === -1) return null;
        const [dead] = p.field.splice(index, 1);
        p.graveyard.push({ ...dead });
        return dead;
    }

    function clampHp(value) {
        return Math.max(0, Math.min(MAX_HP, value));
    }

    function addLog(message) {
        state.logs.unshift(message);
        if (state.logs.length > MAX_LOGS) state.logs.length = MAX_LOGS;
        queueRender();
    }

    function debug(message) {
        const line = `[${new Date().toLocaleTimeString()}] ${message}`;
        state.debugLines.push(line);
        if (state.debugLines.length > 180) state.debugLines.shift();
        console.log(line);
        queueRender();
    }

    function tapFeedback(ms = 12) {
        if (navigator.vibrate) navigator.vibrate(ms);
    }

    function queueRender() {
        if (renderQueued) return;
        renderQueued = true;
        requestAnimationFrame(() => {
            renderQueued = false;
            render();
        });
    }

    function initGame(options = {}) {
        uidCounter = 1;
        state.mode = options.mode || state.mode || "ai";
        const p1 = (options.playerName ?? state.names?.player ?? "Player 1").trim() || "Player 1";
        const p2 = (options.playerTwoName ?? state.names?.ai ?? (state.mode === "ai" ? "AI" : "Player 2")).trim() || (state.mode === "ai" ? "AI" : "Player 2");
        state.names = { player: p1, ai: state.mode === "ai" ? "AI" : p2 };
        state.awaitingPass = false;
        state.centralDeck = buildCentralDeck();
        state.shopCards = [];
        for (let i = 0; i < 4 && state.centralDeck.length; i++) state.shopCards.push(state.centralDeck.shift());
        state.arcaneClustersRemaining = 6;
        state.player = makePlayer();
        state.ai = makePlayer();
        state.active = true;
        state.turn = "player";
        state.selectedAttackerUid = null;
        state.pendingSpell = null;
        state.logs = [];
        state.debugLines = [];
        els.modalRoot.innerHTML = "";
        addLog(`${labelFor("player")} starts. Tap cards to play, then attack with your creatures.`);
        startTurn("player");
    }

    function drawCard(ownerId) {
        const p = actor(ownerId);
        if (p.deck.length === 0) {
            if (p.discard.length === 0) return null;
            p.deck = shuffleArray(p.discard.splice(0));
            addLog(`${labelFor(ownerId)} reshuffle discard into deck.`);
        }
        const card = p.deck.pop();
        p.hand.push(card);
        return card;
    }

    function startTurn(ownerId) {
        if (!state.active) return;
        state.turn = ownerId;
        const p = actor(ownerId);
        p.cloakActive = false;
        p.shards = 0;
        p.attackedThisTurn.clear();
        state.selectedAttackerUid = null;
        state.pendingSpell = null;
        for (let i = 0; i < HAND_DRAW; i++) drawCard(ownerId);
        addLog(`${labelFor(ownerId)} turn.`);
        if (state.mode === "pass") {
            state.awaitingPass = true;
            queueRender();
            showPassPrompt(ownerId);
            return;
        }
        queueRender();
        if (ownerId === "ai") void aiTurnLogic();
    }

    function endTurn(ownerId) {
        const p = actor(ownerId);
        applyUnicornHeal(ownerId);
        if (p.hand.length > 0) {
            p.discard.push(...p.hand.splice(0));
        }
        p.shards = 0;
        p.attackedThisTurn.clear();
        state.selectedAttackerUid = null;
        state.pendingSpell = null;
        queueRender();
    }

    function applyUnicornHeal(ownerId) {
        const p = actor(ownerId);
        const count = p.field.filter(card => card.startHeal === 2).length;
        if (count === 0) return;
        const heal = count * 2;
        p.hp = clampHp(p.hp + heal);
        addLog(`🦄 ${labelFor(ownerId)} heal ${heal} from Unicorn.`);
    }

    function removeFromHand(ownerId, uid) {
        const p = actor(ownerId);
        const index = p.hand.findIndex(card => card.uid === uid);
        if (index === -1) return null;
        const [card] = p.hand.splice(index, 1);
        return card;
    }

    function playCard(ownerId, cardUid, targetRefs = []) {
        if (!state.active) return false;
        const owner = actor(ownerId);
        const card = removeFromHand(ownerId, cardUid);
        if (!card) return false;

        if (ownerId === "ai") revealAiCard(card);

        if (card.type === "economy") {
            owner.shards += card.shardGain || 0;
            owner.discard.push(card);
            addLog(`${labelFor(ownerId)} play ${card.name}: +${card.shardGain} shards.`);
        } else if (card.type === "creature") {
            summonCreature(ownerId, card);
        } else {
            resolveSpell(ownerId, card, targetRefs);
            owner.discard.push(card);
        }

        state.pendingSpell = null;
        checkWinConditions();
        queueRender();
        return true;
    }

    function summonCreature(ownerId, card) {
        const owner = actor(ownerId);
        const opponentId = other(ownerId);
        const opponent = actor(opponentId);
        const creature = {
            ...card,
            uid: card.uid,
            ownerId,
            hp: card.hp || 1,
            maxHp: card.hp || 1,
            atk: card.atk || 0,
            defender: Boolean(card.defender),
            elemental: Boolean(card.elemental),
            element: card.element || "",
            thunderSynergy: Boolean(card.thunderSynergy),
            startHeal: card.startHeal || 0,
            originalHp: card.hp || 1
        };

        if (card.onSummonDiscard && opponent.hand.length > 0) {
            const discarded = opponent.hand.pop();
            opponent.discard.push(discarded);
            addLog(`${card.name} forces ${labelFor(opponentId).toLowerCase()} to discard ${discarded.name}.`);
        }

        owner.field.push(creature);
        addLog(`${labelFor(ownerId)} summon ${card.name} (${creature.atk}/${creature.hp}).`);
    }

    function resolveSpell(ownerId, card, targetRefs) {
        const owner = actor(ownerId);
        const opponentId = other(ownerId);
        const opponent = actor(opponentId);

        switch (card.effect) {
            case "damage": {
                const ref = targetRefs[0];
                if (!ref || !isLegalDamageTarget(ownerId, ref)) {
                    addLog(`${card.name} fizzles: no legal target.`);
                    return;
                }
                dealDamage(ownerId, ref, card.damage || 0, card.name);
                break;
            }
            case "heal": {
                owner.hp = clampHp(owner.hp + (card.heal || 0));
                addLog(`${labelFor(ownerId)} cast ${card.name}: heal ${card.heal}.`);
                break;
            }
            case "summonDefender": {
                const shield = cloneCard({ id: "frostshield_token", image: "assets/cards/frost_shield.webp", name: "Frost Shield", type: "creature", atk: 0, hp: card.hp || 4, defender: true, desc: "Defender" });
                summonCreature(ownerId, shield);
                break;
            }
            case "cloak": {
                owner.cloakActive = true;
                addLog(`${labelFor(ownerId)} cast ${card.name}. Damage blocked until next turn.`);
                break;
            }
            case "mindControl": {
                if (opponent.field.length === 0) {
                    addLog(`${card.name} has no creature to steal.`);
                    return;
                }
                const stolen = opponent.field.shift();
                stolen.ownerId = ownerId;
                owner.field.push(stolen);
                opponent.discard.push(...opponent.hand.splice(0));
                for (let i = 0; i < HAND_DRAW; i++) drawCard(opponentId);
                addLog(`${labelFor(ownerId)} steal ${stolen.name} with Mind Control.`);
                break;
            }
            case "thunderstrike": {
                const legalTargets = targetRefs.filter(ref => isLegalDamageTarget(ownerId, ref));
                if (legalTargets.length === 0) {
                    addLog("Thunderstrike fizzles: no target.");
                    return;
                }
                legalTargets.slice(0, 2).forEach(ref => dealDamage(ownerId, ref, card.damage || 0, "Thunderstrike"));
                owner.field.forEach(creature => {
                    if (creature.thunderSynergy) creature.atk += 1;
                });
                addLog(`${labelFor(ownerId)}'s Thunderbirds gain +1 attack.`);
                break;
            }
            case "revive": {
                if (owner.graveyard.length === 0) {
                    addLog("Phoenix Reborn found no creature in graveyard.");
                    return;
                }
                const revived = owner.graveyard.pop();
                const fullHp = revived.originalHp || revived.maxHp || revived.hp || 1;
                owner.field.push({ ...revived, uid: nextUid(), ownerId, hp: fullHp, maxHp: fullHp });
                addLog(`Phoenix revives ${revived.name} at full HP.`);
                break;
            }
            default:
                addLog(`${card.name} has no effect yet.`);
        }
    }

    function dealDamage(sourceOwnerId, ref, amount, sourceName) {
        if (!ref || amount <= 0) return false;
        if (isDamageBlockedByCloak(ref)) {
            addLog(`Cloak blocks ${sourceName}.`);
            return false;
        }

        if (isHeroRef(ref)) {
            const target = actor(ref.ownerId);
            target.hp = Math.max(0, target.hp - amount);
            addLog(`${sourceName} deals ${amount} to ${ref.ownerId === "player" ? "you" : "AI"}.`);
        } else {
            const target = resolveRef(ref);
            if (!target) return false;
            target.hp -= amount;
            addLog(`${sourceName} deals ${amount} to ${target.name}.`);
            if (target.hp <= 0) {
                const dead = removeCreature(ref.ownerId, ref.uid);
                if (dead) addLog(`${dead.name} dies.`);
            }
        }

        checkWinConditions();
        queueRender();
        return true;
    }


    function effectiveCreatureAttack(ownerId, creature) {
        let damage = creature.atk || 0;
        if (creature.elemental && creature.element) {
            const matching = actor(ownerId).field.filter(card => card.elemental && card.element === creature.element).length;
            if (matching >= 2) damage *= 2;
        }
        return damage;
    }

    function creatureAttack(ownerId, attackerUid, targetRef) {
        if (!state.active || state.turn !== ownerId) return false;
        const attacker = findCreature(ownerId, attackerUid);
        const owner = actor(ownerId);
        const defenderId = other(ownerId);
        const defender = actor(defenderId);

        if (!attacker) return false;
        if (owner.attackedThisTurn.has(attacker.uid)) {
            addLog(`${attacker.name} already attacked.`);
            return false;
        }
        if (!targetRef || targetRef.ownerId !== defenderId) {
            addLog("Choose an enemy target.");
            return false;
        }

        const defenders = defender.field.filter(card => card.defender);
        if (defenders.length > 0) {
            if (isHeroRef(targetRef)) {
                addLog("Defender blocks. Attack the defender first.");
                return false;
            }
            const target = resolveRef(targetRef);
            if (!target || !target.defender) {
                addLog("Attack defender first.");
                return false;
            }
        }

        const damage = effectiveCreatureAttack(ownerId, attacker);

        dealDamage(ownerId, targetRef, damage, `⚔️ ${attacker.name}`);
        owner.attackedThisTurn.add(attacker.uid);
        state.selectedAttackerUid = null;
        queueRender();
        return true;
    }

    function canAffordAnything(ownerId) {
        const p = actor(ownerId);
        if (state.arcaneClustersRemaining > 0 && p.shards >= ARCANE_CLUSTER_CARD.shopCost) return true;
        return state.shopCards.some(card => card && p.shards >= card.shopCost);
    }

    function buyShopCard(ownerId, index) {
        if (!state.active) return false;
        const p = actor(ownerId);
        const card = state.shopCards[index];
        if (!card) return false;
        if (p.shards < card.shopCost) {
            if (ownerId === "player") addLog(`Need ${card.shopCost} shards for ${card.name}.`);
            return false;
        }
        p.shards -= card.shopCost;
        p.discard.push(cloneCard(card));
        addLog(`${labelFor(ownerId)} bought ${card.name}.`);
        state.shopCards[index] = state.centralDeck.length ? state.centralDeck.shift() : null;
        queueRender();
        return true;
    }

    function buyCluster(ownerId) {
        if (!state.active || state.arcaneClustersRemaining <= 0) return false;
        const p = actor(ownerId);
        if (p.shards < ARCANE_CLUSTER_CARD.shopCost) {
            if (ownerId === "player") addLog("Need 3 shards for Arcane Cluster.");
            return false;
        }
        p.shards -= ARCANE_CLUSTER_CARD.shopCost;
        state.arcaneClustersRemaining -= 1;
        p.discard.push(cloneCard(ARCANE_CLUSTER_CARD));
        addLog(`${labelFor(ownerId)} bought Arcane Cluster.`);
        queueRender();
        return true;
    }

    function startSpellTargeting(ownerId, card) {
        const legal = getDamageTargets(ownerId);
        if (legal.length === 0) {
            addLog("No legal targets.");
            return;
        }

        const maxTargets = card.effect === "thunderstrike" ? Math.min(2, legal.length) : 1;
        state.selectedAttackerUid = null;
        state.pendingSpell = { ownerId, cardUid: card.uid, cardName: card.name, effect: card.effect, maxTargets, targets: [] };
        addLog(maxTargets === 1 ? `Tap target for ${card.name}.` : `${card.name}: tap ${maxTargets} targets.`);
        queueRender();
    }

    function handlePendingSpellTarget(ref) {
        const pending = state.pendingSpell;
        if (!pending) return;
        if (!isLegalDamageTarget(pending.ownerId, ref)) {
            addLog("That target is blocked or invalid.");
            return;
        }
        if (pending.targets.some(existing => refKey(existing) === refKey(ref))) {
            addLog("Choose a different target.");
            return;
        }
        pending.targets.push(ref);
        tapFeedback(18);

        if (pending.targets.length >= pending.maxTargets) {
            playCard(pending.ownerId, pending.cardUid, pending.targets);
            state.pendingSpell = null;
        } else {
            addLog(`Tap ${pending.maxTargets - pending.targets.length} more target.`);
        }
        queueRender();
    }

    function handlePlayerHand(cardUid) {
        const ownerId = currentHumanOwner();
        if (state.turn !== ownerId || !state.active || tapLocked || state.awaitingPass) return;
        if (state.pendingSpell) {
            addLog("Finish or cancel your current spell first.");
            return;
        }
        if (state.selectedAttackerUid) {
            addLog("Finish or cancel your attack first.");
            return;
        }
        const card = findHandCard(ownerId, cardUid);
        if (!card) return;
        tapFeedback();

        if (card.type === "economy" || card.type === "creature") {
            playCard(ownerId, card.uid);
            return;
        }

        if (card.effect === "damage" || card.effect === "thunderstrike") {
            startSpellTargeting(ownerId, card);
            return;
        }

        playCard(ownerId, card.uid, card.effect === "heal" ? [{ kind: "hero", ownerId }] : []);
    }

    function handlePlayerCreature(cardUid) {
        const ownerId = currentHumanOwner();
        if (state.turn !== ownerId || !state.active || state.pendingSpell || state.awaitingPass) return;
        const creature = findCreature(ownerId, cardUid);
        if (!creature) return;
        if (actor(ownerId).attackedThisTurn.has(cardUid)) {
            addLog(`${creature.name} already attacked.`);
            return;
        }
        state.selectedAttackerUid = state.selectedAttackerUid === cardUid ? null : cardUid;
        tapFeedback();
        addLog(state.selectedAttackerUid ? `${creature.name} selected. Tap an enemy target.` : "Attack cancelled.");
        queueRender();
    }

    async function handleEndTurn() {
        const ownerId = currentHumanOwner();
        if (state.turn !== ownerId || !state.active || state.awaitingPass) return;
        if (state.pendingSpell || state.selectedAttackerUid) {
            addLog("Finish or cancel your action first.");
            return;
        }

        const p = actor(ownerId);
        if (p.shards > 0 && canAffordAnything(ownerId)) {
            showConfirm(`You have ${p.shards} unspent shard${p.shards === 1 ? "" : "s"}. End turn and lose them?`, () => endHumanTurnNow(ownerId));
            return;
        }

        endHumanTurnNow(ownerId);
    }

    function endHumanTurnNow(ownerId) {
        endTurn(ownerId);
        if (!state.active) return;
        const nextOwner = other(ownerId);
        startTurn(nextOwner);
    }

    async function aiTurnLogic() {
        if (!state.active) return;
        tapLocked = true;
        debug("=== AI TURN ===");
        await delay(260);

        let safety = 0;
        while (state.active && state.turn === "ai" && aiPlayBestCard() && safety < 24) {
            safety += 1;
            queueRender();
            await delay(220);
        }

        while (state.active && state.turn === "ai" && aiBuyBestCard()) {
            await delay(180);
        }

        if (state.arcaneClustersRemaining > 0 && state.ai.shards >= ARCANE_CLUSTER_CARD.shopCost) {
            buyCluster("ai");
            await delay(180);
        }

        await delay(260);
        await aiAttackPhase();
        if (!state.active) return;
        endTurn("ai");
        tapLocked = false;
        if (state.active) startTurn("player");
    }

    function aiPlayBestCard() {
        const p = state.ai;
        const economy = p.hand.find(card => card.type === "economy");
        if (economy) return playCard("ai", economy.uid);

        const playable = p.hand.filter(card => card.type !== "economy");
        if (playable.length === 0) return false;
        playable.sort((a, b) => aiCardScore(b) - aiCardScore(a));
        const card = playable[0];

        if (card.type === "creature" || card.effect === "heal" || card.effect === "cloak" || card.effect === "mindControl" || card.effect === "revive" || card.effect === "summonDefender") {
            return playCard("ai", card.uid);
        }

        if (card.effect === "damage") {
            const target = chooseAiDamageTarget(card.damage || 0);
            return playCard("ai", card.uid, target ? [target] : []);
        }

        if (card.effect === "thunderstrike") {
            const targets = chooseAiThunderTargets(card.damage || 0);
            return playCard("ai", card.uid, targets);
        }

        return playCard("ai", card.uid);
    }

    function aiCardScore(card) {
        let score = 0;
        if (card.type === "creature") score += (card.atk || 0) * 2 + (card.hp || 0);
        if (card.effect === "damage") score += (card.damage || 0) * 3;
        if (card.effect === "thunderstrike") score += 14;
        if (card.effect === "heal") score += state.ai.hp <= 55 ? 18 : 2;
        if (card.effect === "cloak") score += state.player.field.length >= 2 ? 16 : 4;
        if (card.effect === "mindControl") score += state.player.field.length ? 22 : 0;
        if (card.effect === "revive") score += state.ai.graveyard.length ? 18 : 0;
        if (card.defender) score += 4;
        return score;
    }

    function chooseAiDamageTarget(damage) {
        const legal = getDamageTargets("ai");
        if (legal.length === 0) return null;

        const killable = legal
            .filter(ref => isCreatureRef(ref))
            .map(ref => ({ ref, card: resolveRef(ref) }))
            .filter(item => item.card && item.card.hp <= damage)
            .sort((a, b) => (b.card.atk + b.card.hp) - (a.card.atk + a.card.hp));
        if (killable.length > 0) return killable[0].ref;

        const biggestThreat = legal
            .filter(ref => isCreatureRef(ref))
            .map(ref => ({ ref, card: resolveRef(ref) }))
            .filter(item => item.card)
            .sort((a, b) => (b.card.atk || 0) - (a.card.atk || 0))[0];

        return biggestThreat ? biggestThreat.ref : legal.find(isHeroRef) || legal[0];
    }

    function chooseAiThunderTargets(damage) {
        const first = chooseAiDamageTarget(damage);
        const legal = getDamageTargets("ai").filter(ref => !first || refKey(ref) !== refKey(first));
        const second = legal.find(ref => isCreatureRef(ref) && resolveRef(ref)?.hp <= damage) || legal.find(isHeroRef) || legal[0];
        return [first, second].filter(Boolean).slice(0, 2);
    }

    function aiBuyBestCard() {
        const affordable = state.shopCards
            .map((card, index) => ({ card, index, score: card ? shopScore(card) : -1 }))
            .filter(item => item.card && state.ai.shards >= item.card.shopCost)
            .sort((a, b) => b.score - a.score);
        if (affordable.length === 0) return false;
        return buyShopCard("ai", affordable[0].index);
    }

    function shopScore(card) {
        let score = card.shopCost || 0;
        if (card.type === "creature") score += (card.atk || 0) * 2 + (card.hp || 0);
        if (card.effect === "damage") score += (card.damage || 0) * 2;
        if (card.effect === "heal") score += 4;
        if (card.effect === "mindControl" || card.effect === "revive") score += 8;
        if (card.effect === "thunderstrike") score += 7;
        if (card.defender) score += 3;
        return score;
    }

    async function aiAttackPhase() {
        if (!state.active || state.turn !== "ai") return;
        for (const creature of [...state.ai.field]) {
            if (!state.active) break;
            if (!findCreature("ai", creature.uid)) continue;
            if (state.ai.attackedThisTurn.has(creature.uid)) continue;
            const target = chooseAiAttackTarget(creature);
            if (target) creatureAttack("ai", creature.uid, target);
            await delay(220);
        }
    }

    function chooseAiAttackTarget(creature) {
        const legal = getDamageTargets("ai");
        if (legal.length === 0) return null;
        const damage = effectiveCreatureAttack("ai", creature);
        const killable = legal
            .filter(ref => isCreatureRef(ref))
            .map(ref => ({ ref, card: resolveRef(ref) }))
            .filter(item => item.card && item.card.hp <= damage)
            .sort((a, b) => (b.card.atk || 0) - (a.card.atk || 0));
        if (killable.length > 0) return killable[0].ref;
        return legal.find(isHeroRef) || legal[0];
    }

    function checkWinConditions() {
        if (!state.active) return;
        if (state.player.hp <= 0) {
            state.active = false;
            tapLocked = false;
            showGameOver(`${labelFor("ai")} wins!`, state.mode === "ai" ? false : true);
        } else if (state.ai.hp <= 0) {
            state.active = false;
            tapLocked = false;
            showGameOver(`${labelFor("player")} wins!`, true);
        }
    }

    function cardStats(card, ownerId = null) {
        if (card.type === "economy") return `💎 +${card.shardGain || 0}`;
        if (card.type === "creature") {
            const attack = ownerId ? effectiveCreatureAttack(ownerId, card) : (card.atk || 0);
            const attackText = ownerId && attack !== (card.atk || 0) ? `${attack} (${card.atk})` : `${attack}`;
            return `${card.defender ? "🛡️ " : ""}⚔️${attackText} ❤️${card.hp || 0}`;
        }
        if (card.effect === "heal") return `💚 +${card.heal || 0}`;
        if (card.effect === "damage") return `⚔️ ${card.damage || 0}`;
        if (card.effect === "thunderstrike") return `🌩️ ${card.damage || 0}×2`;
        if (card.effect === "cloak") return "✨ Cloak";
        if (card.effect === "mindControl") return "🧠 Steal";
        if (card.effect === "revive") return "🔥 Revive";
        return card.desc || "Spell";
    }

    function typeIcon(card) {
        if (card.type === "creature") return "⚔️";
        if (card.type === "spell") return "✦";
        if (card.type === "oneshot") return "☄";
        if (card.type === "economy") return "💎";
        return "◆";
    }

    function cardHtml(card, opts = {}) {
        const classes = ["card", card.type || "spell"];
        if (opts.shop) classes.push("shop-card");
        if (opts.targetable) classes.push("targetable");
        if (opts.selected) classes.push("selected");
        if (opts.attacked) classes.push("attacked");
        if (opts.disabled) classes.push("disabled");
        if (card.image) classes.push("has-art");
        const data = opts.data || "";
        const cost = opts.shopCost ? `<span class="cost-badge">💎${card.shopCost}</span>` : "";
        const art = card.image ? `<div class="card-art" style="background-image:url('${escapeAttr(card.image)}')"></div>` : "";
        return `
            <div class="${classes.join(" ")}" ${data}>
                ${art}
                <div class="card-name">${escapeHtml(card.name)}</div>
                <div class="card-body">${escapeHtml(cardStats(card, opts.ownerId || null))}</div>
                <div class="card-desc">${escapeHtml(card.desc || "")}</div>
                ${cost}<span class="type-badge">${typeIcon(card)}</span>
            </div>`;
    }

    function faceDownHtml() {
        return `<div class="card face-down has-art"><div class="card-art" style="background-image:url('assets/ui/card_back.webp')"></div><div class="card-name">???</div></div>`;
    }

    function render() {
        const player = state.player;
        const ai = state.ai;
        if (!player || !ai) return;

        const bottomOwner = visibleBottomOwner();
        const topOwner = visibleTopOwner();
        const activeLabel = labelFor(state.turn);
        els.turnChip.textContent = state.active ? `${activeLabel} Turn` : "Game Over";
        els.subtitle.textContent = state.pendingSpell
            ? `${state.pendingSpell.cardName}: choose ${state.pendingSpell.maxTargets - state.pendingSpell.targets.length} target${state.pendingSpell.maxTargets - state.pendingSpell.targets.length === 1 ? "" : "s"}`
            : state.selectedAttackerUid
                ? "Attack mode: tap an enemy target"
                : `${state.mode === "pass" ? "Pass & Play" : "Solo vs AI"} · full art build`;
        els.statusMini.textContent = activeLabel;
        els.endTurnBtn.disabled = !state.active || !isHumanOwner(state.turn) || tapLocked || state.awaitingPass;

        els.opponentZoneName.textContent = `${topOwner === "ai" && state.mode === "ai" ? "🤖" : "🧙"} ${labelFor(topOwner)}`;
        els.playerZoneName.textContent = `✨ ${labelFor(bottomOwner)}`;
        els.opponentFieldLabel.textContent = `${labelFor(topOwner)} Battlefield`;
        els.opponentHandLabel.textContent = `${labelFor(topOwner)} Hand`;
        els.playerHandLabel.textContent = `${labelFor(bottomOwner)} Hand`;
        els.playerFieldLabel.textContent = `${labelFor(bottomOwner)} Creatures`;

        const bottom = actor(bottomOwner);
        const top = actor(topOwner);
        els.playerHp.textContent = Math.max(0, bottom.hp);
        els.aiHp.textContent = Math.max(0, top.hp);
        els.playerHp.closest(".hp-target").dataset.owner = bottomOwner;
        els.aiHp.closest(".hp-target").dataset.owner = topOwner;
        els.playerShards.textContent = bottom.shards;
        els.aiShards.textContent = top.shards;
        els.aiHandCount.textContent = top.hand.length;
        els.playerHandCount.textContent = `${bottom.hand.length} card${bottom.hand.length === 1 ? "" : "s"}`;
        els.aiDeckCount.textContent = `Deck ${top.deck.length} / Discard ${top.discard.length}`;
        els.playerDeckCount.textContent = bottom.deck.length;
        els.playerDiscardCount.textContent = bottom.discard.length;
        els.aiFieldCount.textContent = `${top.field.length} creature${top.field.length === 1 ? "" : "s"}`;
        els.playerFieldCount.textContent = `${bottom.field.length} creature${bottom.field.length === 1 ? "" : "s"}`;
        els.centralDeckCount.textContent = state.centralDeck.length;
        els.clusterStock.textContent = state.arcaneClustersRemaining;

        els.aiZone.classList.toggle("cloak-active", actor(topOwner).cloakActive);
        els.playerZone.classList.toggle("cloak-active", actor(bottomOwner).cloakActive);

        renderHeroTargetState();
        renderFloatingTargets();
        renderHand(bottomOwner);
        renderField(bottomOwner, els.playerBattlefield);
        renderField(topOwner, els.aiBattlefield);
        renderHiddenHand(topOwner);
        renderShop();
        renderLogs();
        renderHint();
    }

    function renderHeroTargetState() {
        document.querySelectorAll(".hp-target").forEach(el => el.classList.remove("targetable"));
        if (!state.active || !isHumanOwner(state.turn) || state.awaitingPass) return;

        if (state.pendingSpell) {
            const legal = getDamageTargets(state.turn).filter(isHeroRef).map(refKey);
            document.querySelectorAll(".hp-target[data-owner]").forEach(el => {
                const ref = { kind: "hero", ownerId: el.dataset.owner };
                if (legal.includes(refKey(ref))) el.classList.add("targetable");
            });
        } else if (state.selectedAttackerUid) {
            const legal = getDamageTargets(state.turn).filter(isHeroRef).map(refKey);
            const enemyId = other(state.turn);
            const hp = document.querySelector(`.hp-target[data-owner="${enemyId}"]`);
            if (hp && legal.includes(`hero:${enemyId}`)) hp.classList.add("targetable");
        }
    }

    function renderFloatingTargets() {
        if (!els.floatingTargets) return;
        els.floatingTargets.classList.remove("visible");

        if (!state.active || !isHumanOwner(state.turn) || state.awaitingPass) return;

        const enemyId = other(state.turn);
        const legalHeroTargets = getDamageTargets(state.turn).filter(isHeroRef).map(refKey);
        const aiHeroTargetable = legalHeroTargets.includes(`hero:${enemyId}`) && !actor(enemyId).cloakActive;
        const needsFloatingHero = aiHeroTargetable && Boolean(state.pendingSpell || state.selectedAttackerUid);

        if (!needsFloatingHero) return;

        const selected = state.selectedAttackerUid ? findCreature(state.turn, state.selectedAttackerUid) : null;
        const title = state.pendingSpell
            ? `${state.pendingSpell.cardName}: ${labelFor(enemyId)} HP is in range`
            : `${selected ? selected.name : "Creature"} can attack ${labelFor(enemyId)} HP`;
        const detail = actor(enemyId).field.some(c => c.defender)
            ? "Defender is blocking hero damage."
            : "Tap this instead of scrolling to the top.";

        els.floatingTargetLabel.innerHTML = `${escapeHtml(title)}<small>${escapeHtml(detail)}</small>`;
        const button = document.getElementById("floatingAiTarget");
        if (button) {
            button.dataset.owner = enemyId;
            button.innerHTML = `Hit ${escapeHtml(labelFor(enemyId))} ❤️ <span id="floatingAiHp">${Math.max(0, actor(enemyId).hp)}</span>`;
        }
        els.floatingTargets.classList.add("visible");
    }

    function renderHand(ownerId) {
        const p = actor(ownerId);
        if (state.turn !== ownerId || !state.active || state.awaitingPass) {
            els.playerHand.innerHTML = `<div class="empty-lane">Hand hidden until ${escapeHtml(labelFor(ownerId))} starts turn.</div>`;
            return;
        }

        if (p.hand.length === 0) {
            els.playerHand.innerHTML = `<div class="empty-lane">No cards in hand.</div>`;
            return;
        }

        els.playerHand.innerHTML = p.hand.map(card => cardHtml(card, {
            data: `data-action="hand-card" data-owner="${ownerId}" data-uid="${card.uid}"`,
            disabled: Boolean(state.pendingSpell || state.selectedAttackerUid)
        })).join("");
    }

    function renderField(ownerId, container) {
        const p = actor(ownerId);
        if (p.field.length === 0) {
            container.innerHTML = `<div class="empty-lane">No creatures.</div>`;
            return;
        }
        const bottomOwner = visibleBottomOwner();
        const isCurrentPlayerField = ownerId === state.turn && isHumanOwner(state.turn);
        const legalTargets = isHumanOwner(state.turn) && state.active && !state.awaitingPass
            ? getDamageTargets(state.turn).map(refKey)
            : [];

        container.innerHTML = p.field.map(card => {
            const targetRef = { kind: "creature", ownerId, uid: card.uid };
            const canBeSpellTarget = Boolean(state.pendingSpell && legalTargets.includes(refKey(targetRef)));
            const canBeAttackTarget = Boolean(state.selectedAttackerUid && ownerId === other(state.turn) && legalTargets.includes(refKey(targetRef)));
            const canSelectAttacker = Boolean(isCurrentPlayerField && !state.pendingSpell && state.active && !actor(ownerId).attackedThisTurn.has(card.uid));
            return cardHtml(card, {
                data: `data-action="field-card" data-owner="${ownerId}" data-uid="${card.uid}"`,
                targetable: canBeSpellTarget || canBeAttackTarget || canSelectAttacker,
                selected: isCurrentPlayerField && state.selectedAttackerUid === card.uid,
                attacked: isCurrentPlayerField && actor(ownerId).attackedThisTurn.has(card.uid),
                disabled: isCurrentPlayerField && actor(ownerId).attackedThisTurn.has(card.uid),
                ownerId
            });
        }).join("");
    }

    function renderHiddenHand(ownerId) {
        const p = actor(ownerId);
        if (p.hand.length === 0) {
            els.aiHand.innerHTML = `<div class="empty-lane">${escapeHtml(labelFor(ownerId))} hand empty.</div>`;
            return;
        }
        els.aiHand.innerHTML = Array.from({ length: p.hand.length }, faceDownHtml).join("");
    }

    function renderShop() {
        const cards = state.shopCards.map((card, index) => {
            if (!card) {
                return `<div class="shop-pill disabled"><div class="shop-title">Empty</div><div class="shop-meta">Sold out</div></div>`;
            }
            const buyerId = currentHumanOwner();
            const canBuy = isHumanOwner(state.turn) && !state.awaitingPass && state.active && !state.pendingSpell && !state.selectedAttackerUid && actor(buyerId).shards >= card.shopCost;
            return `
                <div class="shop-pill ${canBuy ? "targetable" : ""}" data-action="buy-shop" data-index="${index}">
                    ${card.image ? `<div class="shop-thumb" style="background-image:url('${escapeAttr(card.image)}')"></div>` : ""}
                    <div class="shop-title">${escapeHtml(card.name)}</div>
                    <div class="shop-meta">💎 ${card.shopCost}</div>
                    <div class="card-body">${escapeHtml(cardStats(card))}</div>
                    <div class="card-desc">${escapeHtml(card.desc || "")}</div>
                </div>`;
        });

        const buyerId = currentHumanOwner();
        const clusterBuyable = isHumanOwner(state.turn) && !state.awaitingPass && state.active && !state.pendingSpell && !state.selectedAttackerUid && state.arcaneClustersRemaining > 0 && actor(buyerId).shards >= ARCANE_CLUSTER_CARD.shopCost;
        cards.push(`
            <div class="shop-pill ${state.arcaneClustersRemaining > 0 ? "" : "disabled"} ${clusterBuyable ? "targetable" : ""}" data-action="buy-cluster">
                <div class="shop-thumb" style="background-image:url('assets/cards/arcane_cluster.webp')"></div>
                <div class="shop-title">Arcane Cluster</div>
                <div class="shop-meta">💎 3</div>
                <div class="card-body">💎 +3</div>
                <div class="card-desc">${state.arcaneClustersRemaining > 0 ? `${state.arcaneClustersRemaining} left` : "Sold out"}</div>
            </div>`);

        els.shop.innerHTML = cards.join("");
    }

    function renderLogs() {
        els.gameLog.innerHTML = state.logs.length
            ? state.logs.map(message => `✨ ${escapeHtml(message)}`).join("<br>")
            : "No events yet.";
        els.debugLog.value = state.debugLines.join("\n");
    }

    function renderHint() {
        let main = "Tap cards to play. Tap one of your creatures, then tap an enemy to attack.";
        let small = "Swipe lanes sideways to view more cards.";
        if (!state.active) {
            main = "Game over.";
            small = "Restart to play again.";
        } else if (state.mode === "ai" && state.turn === "ai") {
            main = "AI is taking its turn.";
            small = "Watch the battlefield and plan your next move.";
        } else if (state.awaitingPass) {
            main = `Pass the device to ${labelFor(state.turn)}.`;
            small = "Their hand is hidden until they start the turn.";
        } else if (state.pendingSpell) {
            main = `${state.pendingSpell.cardName}: choose ${state.pendingSpell.maxTargets - state.pendingSpell.targets.length} target${state.pendingSpell.maxTargets - state.pendingSpell.targets.length === 1 ? "" : "s"}.`;
            small = "Use Cancel Action if you change your mind.";
        } else if (state.selectedAttackerUid) {
            const attacker = findCreature(state.turn, state.selectedAttackerUid);
            main = `${attacker ? attacker.name : "Creature"} selected. Tap an enemy creature or AI HP.`;
            small = "Defenders must be attacked first.";
        } else if (actor(currentHumanOwner()).shards > 0) {
            const shards = actor(currentHumanOwner()).shards;
            main = `${labelFor(currentHumanOwner())} has ${shards} shard${shards === 1 ? "" : "s"}. Buy from the market before ending turn.`;
            small = "Unspent shards reset at end of turn.";
        }
        els.actionHint.innerHTML = `${escapeHtml(main)}<small>${escapeHtml(small)}</small>`;
    }

    function revealAiCard(card) {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = cardHtml(card, { data: "", disabled: false });
        const node = wrapper.firstElementChild;
        node.classList.add("revealed");
        els.aiReveals.appendChild(node);
        node.addEventListener("animationend", () => node.remove(), { once: true });
    }

    function handlePointerDown(event) {
        const actionTarget = event.target.closest("[data-action]");
        pointerStart = {
            id: event.pointerId,
            x: event.clientX,
            y: event.clientY,
            time: performance.now(),
            action: actionTarget ? actionTarget.dataset.action : "",
            inShop: Boolean(event.target.closest(".scroll-lane.shop"))
        };
    }

    function isSwipeLikeShopGesture(event, action) {
        if (!pointerStart || pointerStart.id !== event.pointerId) return false;
        if (!pointerStart.inShop && action !== "buy-shop" && action !== "buy-cluster") return false;

        const dx = Math.abs(event.clientX - pointerStart.x);
        const dy = Math.abs(event.clientY - pointerStart.y);
        const movedEnoughToBeSwipe = dx > 10 || dy > 10;
        const mostlyHorizontal = dx > dy * 0.75;
        return movedEnoughToBeSwipe && mostlyHorizontal;
    }

    function handleTap(event) {
        const target = event.target.closest("[data-action]");
        if (!target) return;
        const action = target.dataset.action;

        if ((action === "buy-shop" || action === "buy-cluster") && isSwipeLikeShopGesture(event, action)) {
            pointerStart = null;
            return;
        }

        if (!["toggle-debug", "copy-debug"].includes(action)) {
            event.preventDefault();
        }

        switch (action) {
            case "hand-card":
                handlePlayerHand(target.dataset.uid);
                break;
            case "field-card": {
                const ref = getTargetRefFromElement(target);
                if (state.pendingSpell) {
                    handlePendingSpellTarget(ref);
                } else if (state.selectedAttackerUid && target.dataset.owner === other(state.turn)) {
                    creatureAttack(state.turn, state.selectedAttackerUid, ref);
                    tapFeedback(18);
                } else if (target.dataset.owner === state.turn) {
                    handlePlayerCreature(target.dataset.uid);
                }
                break;
            }
            case "target-hero": {
                const ref = getTargetRefFromElement(target);
                if (state.pendingSpell) handlePendingSpellTarget(ref);
                else if (state.selectedAttackerUid && target.dataset.owner === other(state.turn)) creatureAttack(state.turn, state.selectedAttackerUid, ref);
                break;
            }
            case "buy-shop":
                if (isHumanOwner(state.turn) && !state.awaitingPass && !state.pendingSpell && !state.selectedAttackerUid) {
                    tapFeedback();
                    buyShopCard(currentHumanOwner(), Number(target.dataset.index));
                }
                break;
            case "buy-cluster":
                if (isHumanOwner(state.turn) && !state.awaitingPass && !state.pendingSpell && !state.selectedAttackerUid) {
                    tapFeedback();
                    buyCluster(currentHumanOwner());
                }
                break;
            case "end-turn":
                tapFeedback();
                void handleEndTurn();
                break;
            case "restart":
                tapFeedback();
                showConfirm("Restart the match?", initGame);
                break;
            case "cancel-action":
                state.pendingSpell = null;
                state.selectedAttackerUid = null;
                addLog("Action cancelled.");
                tapFeedback();
                queueRender();
                break;
            case "toggle-debug":
                els.debugLog.classList.toggle("visible");
                break;
            case "copy-debug":
                copyDebug();
                break;
        }
    }

    function showConfirm(message, onConfirm) {
        els.modalRoot.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <div class="modal-card">
                    <h2>Confirm</h2>
                    <p>${escapeHtml(message)}</p>
                    <div class="modal-actions">
                        <button type="button" class="btn-dark" data-modal="cancel"><span class="button-inline"><img class="ui-icon" src="assets/ui/icon_target.webp" alt="" /> Cancel</span></button>
                        <button type="button" class="btn-orange" data-modal="confirm"><span class="button-inline"><img class="ui-icon" src="assets/ui/icon_crown.webp" alt="" /> Confirm</span></button>
                    </div>
                </div>
            </div>`;
        const cancel = els.modalRoot.querySelector('[data-modal="cancel"]');
        const confirm = els.modalRoot.querySelector('[data-modal="confirm"]');
        cancel.addEventListener("pointerup", () => { els.modalRoot.innerHTML = ""; }, { once: true });
        confirm.addEventListener("pointerup", () => {
            els.modalRoot.innerHTML = "";
            onConfirm();
        }, { once: true });
    }

    function showGameOver(message, isVictory) {
        els.modalRoot.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <div class="modal-card">
                    <h2 class="${isVictory ? "victory" : "defeat"}">${escapeHtml(message)}</h2>
                    <p>${state.mode === "ai" ? (isVictory ? "Nice run. The shards are yours." : "The AI claimed the shards this time.") : "Great duel. Pass the device back to set up another match."}</p>
                    <button type="button" class="btn-wide" data-modal="restart"><span class="button-inline"><img class="ui-icon" src="assets/ui/icon_restart.webp" alt="" /> Play Again</span></button>
                </div>
            </div>`;
        const restart = els.modalRoot.querySelector('[data-modal="restart"]');
        restart.addEventListener("pointerup", initGame, { once: true });
        queueRender();
    }

    async function copyDebug() {
        const text = state.debugLines.join("\n") || "No debug lines yet.";
        try {
            await navigator.clipboard.writeText(text);
            addLog("Debug copied.");
        } catch {
            els.debugLog.classList.add("visible");
            els.debugLog.focus();
            els.debugLog.select();
            document.execCommand("copy");
            addLog("Debug copied.");
        }
    }


    function showStartModal() {
        state.active = false;
        els.modalRoot.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <div class="modal-card">
                    <div class="start-art"></div>
                    <h2>Arcane Shards</h2>
                    <p>Choose your mode, name the players, then jump into the fully illustrated build.</p>
                    <div class="mode-grid">
                        <button type="button" class="mode-choice selected" data-start-mode="ai"><span class="button-inline"><img class="ui-icon" src="assets/ui/icon_helmet.webp" alt="" /> Solo vs AI</span></button>
                        <button type="button" class="mode-choice" data-start-mode="pass"><span class="button-inline"><img class="ui-icon" src="assets/ui/icon_passplay.webp" alt="" /> Pass &amp; Play</span></button>
                    </div>
                    <div class="name-grid">
                        <input id="startPlayerOne" maxlength="18" value="Player 1" aria-label="Player 1 name" />
                        <input id="startPlayerTwo" maxlength="18" value="Player 2" aria-label="Player 2 name" />
                    </div>
                    <ul class="rules-list">
                        <li>Play Shard cards to gain shards for this turn and build up your options.</li>
                        <li>Buy cards from the market; purchased cards go to your discard pile.</li>
                        <li>Tap a creature, then tap an enemy creature or hero HP to attack.</li>
                        <li>Defenders must be defeated before hero HP can be targeted.</li>
                        <li>Two matching elementals double that element's attack while both are alive.</li>
                    </ul>
                    <button type="button" class="btn-wide" data-modal="start-game"><span class="button-inline"><img class="ui-icon" src="assets/ui/icon_crown.webp" alt="" /> Start Game</span></button>
                </div>
            </div>`;

        let selectedMode = "ai";
        const modeButtons = [...els.modalRoot.querySelectorAll("[data-start-mode]")];
        const p2Input = els.modalRoot.querySelector("#startPlayerTwo");
        function updateMode(mode) {
            selectedMode = mode;
            modeButtons.forEach(btn => btn.classList.toggle("selected", btn.dataset.startMode === mode));
            p2Input.disabled = mode === "ai";
            p2Input.style.opacity = mode === "ai" ? "0.45" : "1";
        }
        modeButtons.forEach(btn => btn.addEventListener("pointerup", () => updateMode(btn.dataset.startMode)));
        updateMode("ai");
        els.modalRoot.querySelector('[data-modal="start-game"]').addEventListener("pointerup", () => {
            const playerName = els.modalRoot.querySelector("#startPlayerOne").value;
            const playerTwoName = p2Input.value;
            els.modalRoot.innerHTML = "";
            initGame({ mode: selectedMode, playerName, playerTwoName });
        }, { once: true });
    }

    function showPassPrompt(ownerId) {
        tapLocked = true;
        const name = labelFor(ownerId);
        els.modalRoot.innerHTML = `
            <div class="modal" role="dialog" aria-modal="true">
                <div class="modal-card">
                    <h2>Pass to ${escapeHtml(name)}</h2>
                    <p>Hand is hidden for pass play. Pass the device, then press Start Turn.</p>
                    <button type="button" class="btn-wide" data-modal="start-turn"><span class="button-inline"><img class="ui-icon" src="assets/ui/icon_arrow.webp" alt="" /> Start ${escapeHtml(name)} Turn</span></button>
                </div>
            </div>`;
        els.modalRoot.querySelector('[data-modal="start-turn"]').addEventListener("pointerup", () => {
            els.modalRoot.innerHTML = "";
            state.awaitingPass = false;
            tapLocked = false;
            queueRender();
        }, { once: true });
    }

    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function escapeHtml(value) {
        return String(value ?? "").replace(/[&<>'"]/g, char => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#039;",
            '"': "&quot;"
        }[char]));
    }

    function escapeAttr(value) {
        return escapeHtml(value).replace(/`/g, "&#096;");
    }

    document.addEventListener("pointerdown", handlePointerDown, { passive: true });
    document.addEventListener("pointerup", handleTap, { passive: false });
    window.addEventListener("resize", queueRender, { passive: true });
    showStartModal();
})();
