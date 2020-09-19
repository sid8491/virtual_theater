import React from 'react'
import { Link } from 'react-router-dom'

function Home() {

    return (
        <div className='container'>
            <div className="jumbotron bg-light text-dark text-center shadow ">
                <div className="container">
                    <h1 className="card-title h1">Virtual Theater</h1>
                    <p className="lead">Watching videos with friends have never been simpler than this. <br />
                    Just create a room and share the link with your friends. <br />
                    When your friends join your room you will be able to watch the videos <br /> together without any interruption. </p>
                </div>
                <hr className="my-4" />
                <div className="text-center">
                <button type="button" className="btn btn-primary btn-lg font-weight-bold">
                    <Link to={{ pathname: `/room/${getRoomId()}`, state: {userName: getName()}}} className="text-light text-decoration-none">
                    {/* <Link to={`/room/${getRoomId()}`} className="text-light text-decoration-none"> */}
                        CREATE YOUR ROOM
                    </Link>
                </button>
                </div>
            </div>
        </div>
    )
}

function getRoomId() {
    var length = 20;
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < length; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}

export function getName() {
    const nameList = ["Abaddon", "Alchemist", "Axe", "Beastmaster", "Brewmaster", "Bristleback", "Centaur Warrunner", "Chaos Knight", "Clockwerk", 
        "Doom", "Dragon Knight", "Earth Spirit", "Earthshaker", "Elder Titan", "Huskar", "Io", "Kunkka", "Legion Commander", 
        "Lifestealer", "Lycan", "Magnus", "Night Stalker", "Omniknight", "Phoenix", "Pudge", "Sand King", "Slardar", "Spirit Breaker", 
        "Sven", "Tidehunter", "Timbersaw", "Tiny", "Treant Protector", "Tusk", "Underlord", "Undying", "Wraith King Anti-Mage", "Arc Warden", 
        "Bloodseeker", "Bounty Hunter", "Broodmother", "Clinkz", "Drow Ranger", "Ember Spirit", "Faceless Void", "Gyrocopter", "Juggernaut", 
        "Lone Druid", "Luna", "Medusa", "Meepo", "Mirana", "Monkey King", "Morphling", "Naga Siren", "Nyx Assassin", "Pangolier", "Phantom Assassin", 
        "Phantom Lancer", "Razor", "Riki", "Shadow Fiend", "Slark", "Sniper", "Spectre", "Templar Assassin", "Terrorblade", "Troll Warlord", "Ursa", 
        "Vengeful Spirit", "Venomancer", "Viper", "Weaver", "Ancient Apparition", "Bane", "Batrider", "Chen", "Crystal Maiden", "Dark Seer", "Dark Willow", 
        "Dazzle", "Death Prophet", "Disruptor", "Enchantress", "Enigma", "Invoker", "Jakiro", "Keeper of the Light", "Leshrac", "Lich", "Lina", "Lion", 
        "Natures Prophet", "Necrophos", "Ogre Magi", "Oracle", "Outworld Devourer", "Puck", "Pugna", "Queen of Pain", "Rubick", "Shadow Demon", 
        "Shadow Shaman", "Silencer", "Skywrath Mage", "Storm Spirit", "Techies", "Tinker", "Visage", "Warlock", "Windranger", "Winter Wyvern",
        "Witch Doctor", "Zeus"
    ]
    const name = nameList.sort(function() {return 0.5 - Math.random()})[0];
    return name
}

export default Home;
