require("dotenv").config();
const { connectDB } = require("./lib/db");
const Question = require("./models/Question");

async function run() {
  await connectDB(process.env.MONGO_URI);

  await Question.deleteMany({});

  await Question.insertMany([
    {
      prompt: "Which anime features the 'Hunter Exam' early in the story?",
      choices: ["Bleach", "Hunter x Hunter", "Naruto", "One Piece"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt:
        "In 'Death Note', what is the shinigami's name attached to Light?",
      choices: ["Ryuk", "Rem", "Sidoh", "Gelus"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 1,
    },

    {
      prompt: "Who is Naruto’s teacher and leader of Team 7?",
      choices: ["Iruka", "Kakashi", "Jiraiya", "Asuma"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "What is the name of Luffy’s hat in One Piece?",
      choices: ["Pirate Hat", "Straw Hat", "Treasure Hat", "Sun Hat"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "Who is Kagome’s companion fox demon in Inuyasha?",
      choices: ["Jaken", "Shippo", "Koga", "Naraku"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "What planet does Goku grow up on?",
      choices: ["Namek", "Earth", "Vegeta", "Mars"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "What is the name of the shinigami who drops the Death Note?",
      choices: ["Rem", "Ryuk", "Gelus", "Sidoh"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "What device does Ash use to store Pokémon?",
      choices: ["Pokeball", "Digivice", "Capsule", "Monster Ball"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "What is Gon’s best friend’s name in Hunter x Hunter?",
      choices: ["Kurapika", "Leorio", "Killua", "Hisoka"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "What color is Goku’s most famous outfit?",
      choices: ["Blue", "Red", "Orange", "Black"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 1,
    },
    {
      prompt: "What is the name of Naruto’s team led by Kakashi?",
      choices: ["Team 8", "Team 7", "Team 10", "Team Guy"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What power allows Luffy to stretch his body?",
      choices: [
        "Flame-Flame Fruit",
        "Gum-Gum Fruit",
        "Dark-Dark Fruit",
        "Ice-Ice Fruit",
      ],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What is the name of Inuyasha’s sword?",
      choices: ["Zangetsu", "Tessaiga", "Enma", "Dragon Slayer"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "Who trains Goku and Krillin in early Dragon Ball?",
      choices: ["Master Roshi", "King Kai", "Beerus", "Piccolo"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What is L’s favorite food in Death Note?",
      choices: ["Cake and sweets", "Ramen", "Apples", "Coffee"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What is the name of Ash’s rival in the first Pokémon season?",
      choices: ["Gary Oak", "Brock", "Tracey", "Paul"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What is Killua’s family famous for in Hunter x Hunter?",
      choices: ["Hunters", "Assassins", "Pirates", "Ninjas"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What transformation comes after Super Saiyan in Dragon Ball Z?",
      choices: [
        "Super Saiyan Blue",
        "Super Saiyan 2",
        "Ultra Instinct",
        "Super Saiyan God",
      ],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What is the name of Naruto’s tailed beast?",
      choices: ["Shukaku", "Kurama", "Gyuki", "Matatabi"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt: "What group does Light join to help catch Kira?",
      choices: ["Task Force", "Survey Corps", "Phantom Troupe", "Akatsuki"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 2,
    },
    {
      prompt:
        "What is the name of the organization Naruto fights that collects tailed beasts?",
      choices: ["Akatsuki", "Anbu", "Root", "Seven Swordsmen"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What is the name of Luffy’s brother who uses fire powers?",
      choices: ["Sabo", "Ace", "Shanks", "Law"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What jewel are Kagome and Inuyasha searching for?",
      choices: ["Sacred Jewel", "Soul Gem", "Dragon Pearl", "Spirit Orb"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "Who defeats Frieza on Planet Namek?",
      choices: ["Vegeta", "Gohan", "Goku", "Piccolo"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What is the name of the detective who succeeds L in Death Note?",
      choices: ["Near", "Mello", "Watari", "Soichiro"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "Which Pokémon type is Pikachu?",
      choices: ["Electric", "Fire", "Normal", "Psychic"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What ability allows characters to use aura in Hunter x Hunter?",
      choices: ["Chakra", "Nen", "Haki", "Ki"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What fusion technique do Goku and Vegeta use with the earrings?",
      choices: ["Fusion Dance", "Potara Fusion", "Ultra Fusion", "God Fusion"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What is the name of Naruto’s father?",
      choices: ["Jiraiya", "Minato Namikaze", "Hiruzen", "Tobirama"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What criminal organization does Kurapika target?",
      choices: ["Akatsuki", "Phantom Troupe", "Marine Admirals", "Dark Guild"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 3,
    },
    {
      prompt: "What is the name of Naruto’s sage mode taught by the toads?",
      choices: [
        "Six Paths Sage Mode",
        "Toad Sage Mode",
        "Kurama Mode",
        "Hashirama Mode",
      ],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "Which Warlord first defeats Luffy in One Piece?",
      choices: ["Doflamingo", "Crocodile", "Mihawk", "Kuma"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "What is Sesshomaru’s sword called?",
      choices: ["Tensaiga", "Tessaiga", "Bakusaiga", "Zangetsu"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt:
        "What is the name of Goku’s technique that multiplies his power taught by King Kai?",
      choices: [
        "Spirit Bomb",
        "Kaioken",
        "Instant Transmission",
        "Ultra Instinct",
      ],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "What alias does Light use as the killer in Death Note?",
      choices: ["L", "Ryuk", "Kira", "Zero"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "What is the name of Ash’s hometown?",
      choices: ["Cerulean City", "Pallet Town", "Viridian City", "Pewter City"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "What Nen category does Gon belong to?",
      choices: ["Emitter", "Enhancer", "Manipulator", "Transmuter"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "Who kills Cell in Dragon Ball Z?",
      choices: ["Goku", "Vegeta", "Gohan", "Trunks"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "What is the name of Naruto’s signature jutsu?",
      choices: ["Chidori", "Rasengan", "Amaterasu", "Byakugan"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 4,
    },
    {
      prompt: "What is the Phantom Troupe also known as?",
      choices: ["Spider", "Scorpion", "Shadow Guild", "Dark Hunters"],
      correctIndex: 0,
      category: "Shonen",
      difficulty: 4,
    },

    {
      prompt: "What is the name of the Nine-Tails’ jinchuriki before Naruto?",
      choices: ["Kushina Uzumaki", "Mito Uzumaki", "Rin Nohara", "Tsunade"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt:
        "What is the name of the island where Luffy trained during the time skip?",
      choices: ["Dressrosa", "Wano", "Rusukaina", "Zou"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt: "Who originally owned the Shikon Jewel in Inuyasha?",
      choices: ["Kikyo", "Kagome", "Kaede", "Midori"],
      correctIndex: 3,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt: "What race is Frieza?",
      choices: ["Saiyan", "Namekian", "Frieza Race", "Android"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt:
        "What is the rule about writing a person’s name in the Death Note?",
      choices: [
        "Need photo",
        "Need birthdate",
        "Must picture their face",
        "Must know location",
      ],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt: "What region does Ash start his journey in?",
      choices: ["Johto", "Kanto", "Hoenn", "Sinnoh"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt: "What Nen type is Killua?",
      choices: ["Emitter", "Enhancer", "Transmuter", "Manipulator"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt: "Who is the God of Destruction of Universe 7?",
      choices: ["Whis", "Beerus", "Zeno", "Champa"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt: "What clan does Sasuke belong to?",
      choices: ["Hyuga", "Uzumaki", "Uchiha", "Senju"],
      correctIndex: 2,
      category: "Shonen",
      difficulty: 5,
    },
    {
      prompt: "What is the name of Gon’s father?",
      choices: ["Silva", "Ging", "Kite", "Illumi"],
      correctIndex: 1,
      category: "Shonen",
      difficulty: 5,
    },
  ]);

  console.log("Seeded questions!");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
