/* Credit: https://github.com/LispEngineer/screeps */

// Summarizes the situation in a room in a single object.
// Room can be a string room name or an actual room object.
function summarize_room_internal(room) {
    if (_.isString(room)) {
        room = Game.rooms[room];
    }
    if (room === undefined) {
        return;
    }
    if (room.controller === undefined || !room.controller.my) {
        return;
    }
    const controller_level = room.controller.level;
    const controller_progress = room.controller.progress;
    const controller_needed = room.controller.progressTotal;
    const controller_downgrade = room.controller.ticksToDowngrade;
    const controller_blocked = room.controller.upgradeBlocked;
    const controller_safemode = room.controller.safeMode ? room.controller.safeMode : 0;
    const controller_safemode_avail = room.controller.safeModeAvailable;
    const controller_safemode_cooldown = room.controller.safeModeCooldown;
    const has_storage = room.storage !== undefined;
    const storage_energy = room.storage ? room.storage.store[RESOURCE_ENERGY] : 0;
    const storage_minerals = room.storage ? _.sum(room.storage.store) - storage_energy : 0;
    const energy_avail = room.energyAvailable;
    const energy_cap = room.energyCapacityAvailable;
    const has_terminal = room.terminal !== undefined;
    const terminal_energy = room.terminal ? room.terminal.store[RESOURCE_ENERGY] : 0;
    const terminal_minerals = room.terminal ? _.sum(room.terminal.store) - terminal_energy : 0;

    let retval = {
        room_name: room.name,
        controller_level,
        controller_progress,
        controller_needed,
        controller_downgrade,
        controller_blocked,
        controller_safemode,
        controller_safemode_avail,
        controller_safemode_cooldown,
        energy_avail,
        energy_cap,
        has_storage,
        storage_energy,
        storage_minerals,
        has_terminal,
        terminal_energy,
        terminal_minerals,
    };
    // console.log('Room ' + room.name + ': ' + JSON.stringify(retval));
    return retval;
}

function summarize_rooms() {
    const now = Game.time;

    // First check if we cached it
    if (global.summarized_room_timestamp == now) {
        return global.summarized_rooms;
    }

    let retval = {};

    for (let r in Game.rooms) {
        let summary = summarize_room_internal(Game.rooms[r]);
        retval[r] = summary;
    }

    global.summarized_room_timestamp = now;
    global.summarized_rooms = retval;

    // console.log('All rooms: ' + JSON.stringify(retval));
    return retval;
}

function summarize_room(room) {
    if (_.isString(room)) {
        room = Game.rooms[room];
    }
    if (room === undefined) {
        return;
    }

    const sr = summarize_rooms();

    return sr[room.name];
}

module.exports = {
    summarize_room,
    summarize_rooms,
};
