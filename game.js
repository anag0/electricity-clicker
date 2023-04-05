let Game = {
    val: 0,
    fps: 25,
    latency: 0,
    previusRunTime: 0,
    buildings: {
        hamsters: 0,
    },
    start: function() {
        this.load();
        this.initButtonHandler();
        this.initBuildingHandlers();
        this.initTimer();
    },
    refresh: function() {
        document.querySelector('#number').innerHTML = Game.val.toFixed(2);     
        document.querySelector('#hamsterCount').innerHTML = 
                    Game.buildings.hamsters;
    },
    initButtonHandler() {
        document.querySelector('#mainButton').addEventListener('click', function(){
            Game.val++;
            Game.refresh();
        });
    },
    initBuildingHandlers() {
        // Hamster
        document.querySelector('#hamster').addEventListener('click', function(){
            let cost = parseInt(this.dataset['cost']);
            if ( Game.val >= cost ) {
                Game.buildings.hamsters++;
                Game.val -= cost;    
                Game.refresh();
            }
        });
    },
    initTimer: function() {
        setInterval(function(){
            Game.tick();
        }, 1000/Game.fps);
        setInterval(function(){
            Game.save();
        }, 5000)
    },
    tick: function( doNotCheckLatency = false ) {
        let energyPerSecond = 0;
        if ( !doNotCheckLatency ) {
            let currentTime = new Date().getTime();
            Game.previusRunTime = Game.previusRunTime == 0 ? currentTime : Game.previusRunTime;
            let expectedTime = (Game.previusRunTime + 1000/Game.fps);
            if ( expectedTime <= currentTime ) {
                Game.latency += currentTime - expectedTime;
            }
            Game.previusRunTime = currentTime;
            if ( Game.latency >= (1000/Game.fps) ) {
                Game.tick(true);
                Game.latency = 0;
            } 
        }
        if ( Game.buildings.hamsters > 0 ) {
            energyPerSecond = 
                Game.buildings.hamsters *
                document.querySelector('#hamster').dataset['output']
        } 
        energyPerSecond = energyPerSecond / Game.fps;
        Game.val += energyPerSecond;
        Game.refresh();
    },
    save: function() {
        localStorage.setItem('save', JSON.stringify({
            'val': Game.val,
            'previusRunTime': Game.previusRunTime,
            'buildings': Game.buildings
        }));
        console.log('saving');
    },
    load: function() {
        let save = localStorage.getItem('save');
        if ( save !== null ) {
            save = JSON.parse(save);
            Game.val = save.val;
            Game.buildings = save.buildings;
            Game.previusRunTime = save.previusRunTime;
        }
        if ( Game.previusRunTime != 0 ) {
            let currentTime = new Date().getTime();
            let difference = currentTime - Game.previusRunTime;
            let ticksMissed = 0;
            if ( difference > 0 ) {
                ticksMissed = difference / (1000/Game.fps);
                for(let i=0; i<ticksMissed; ++i) {
                    Game.tick();
                }
            }
        }
    },
};
document.addEventListener(
    'DOMContentLoaded', 
    function(){
        Game.start();
    }
);