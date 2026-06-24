/*
Max Claims: int (def 5)
Max Claim Member Size: int (def 3)

Cost Menu

Restricted Areas

Guide: bool
*/
import { world } from "@minecraft/server";

export const DEFAULT_CONFIG = {
    max_claims: 5,
    max_members: 3,
    max_size_x: 100,
    max_size_z: 100,
    getArea() { return this.max_size_x * this.max_size_z },
    restricted: [],
    join_guide: true,
    claimer_on_join: true,
    grief_prot: true,
    land_cost: {
        mode: "none", // none / scoreboard / item
        pricing: "fixed", // fixed / area
        item: {
            id: "",
            amount: 0,
        },
        scoreboard: {
            objective: "",
            amount: 0,
        }
    }
}

export const CONFIG = {
    loadConfig() {
        this.updateConfig(DEFAULT_CONFIG);
    },

    resetConfig() {
        world.setDynamicProperty("lc_config", JSON.stringify(DEFAULT_CONFIG))
    },

    getConfig() {
        const raw = world.getDynamicProperty("lc_config");
        const persisted = raw ? JSON.parse(raw) : {};
        const c = { ...DEFAULT_CONFIG, ...persisted };
        c.getArea = function () { return this.max_size_x * this.max_size_z; };
        c.max_size_x = Math.max(1, Math.min(c.max_size_x, 256));
        c.max_size_z = Math.max(1, Math.min(c.max_size_z, 256));
        return c;
    },

    updateConfig(newConfig) {
        try {
            world.setDynamicProperty("lc_config", JSON.stringify(newConfig));
        } catch (e) {
            console.warn(`Error updating config. Resetting to default. ${e}`);
            world.setDynamicProperty("lc_config", JSON.stringify(DEFAULT_CONFIG));
        }
    }
}