const User = require("../models/user")
const mongoose = require('mongoose');
const Quiz = require("../models/quiz");
const Friend = require("../models/friend")
const {connectToDatabase} = require("../db/db")
const admin = require("../lib/firebaseAdmin")
require("dotenv").config();

async function createSeedUser({ username, email, password }) {
  const firebaseUser = await admin.auth().createUser({
    email,
    password
  });
  const user = new User({
    authId: firebaseUser.uid,
    username,
    email
  });
  await user.save();
  return user;
}

async function deleteAllFirebaseUsers(nextPageToken) {
  try {
    const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    const uids = listUsersResult.users.map(user => user.uid);
    if (uids.length > 0) {
      await admin.auth().deleteUsers(uids);
      console.log(`Deleted ${uids.length} users from Firebase Auth`);
    }
    if (listUsersResult.pageToken) {
      await deleteAllFirebaseUsers(listUsersResult.pageToken);
    }
  } catch (error) {
    console.error("Error deleting Firebase users:", error);
  }
}

const seed = async () => {
  try{
    await connectToDatabase();
    console.log("Connected to MongoDB successfully")

    await Quiz.deleteMany({});
    await User.deleteMany({});
    await deleteAllFirebaseUsers();

    const jane = await createSeedUser({
      username: "JaneDoe",
      email: "jane@email.com",
      password: "Password123"
    });
    const alice = await createSeedUser({
      username: "Alice",
      email: "alice@email.com",
      password: "Password123"
    })
    const barney = await createSeedUser({
      username: "Barney",
      email: "barney@email.com",
      password: "Password123"
    })
    console.log("Seed users created")

    await Friend.deleteMany({});

    await Friend.insertMany([
      {
        user1: jane._id,
        user2: alice._id,
        accepted: true
      },
      {
        user1: jane._id,
        user2: barney._id,
        accepted: false
      },
      {
        user1: alice._id,
        user2: barney._id,
        accepted: true
      }
    ])
    console.log("Seed friends created")

    const quizId1 = new mongoose.Types.ObjectId();
    const quizId2 = new mongoose.Types.ObjectId();
    const quizId3 = new mongoose.Types.ObjectId();
    const quizId4 = new mongoose.Types.ObjectId();
    const quizId5 = new mongoose.Types.ObjectId();
    const quizId6 = new mongoose.Types.ObjectId();
    const quizId7 = new mongoose.Types.ObjectId();
    const quizId8 = new mongoose.Types.ObjectId();
    const quizId9 = new mongoose.Types.ObjectId();
    const quizId10 = new mongoose.Types.ObjectId();

    const addAnswerIds = (items) =>
      items.map((item) => ({
        _id: new mongoose.Types.ObjectId(),
        ...item,
      }))

    const quizzes = [
      {
        _id: quizId1,
        title: "Guess the Artist",
        category: "art",
        created_by: jane._id,
        req_to_pass: 6,
        questions: [
          {
            text: "Which of these artists founded the Cubist movement?",
            answers: addAnswerIds([
              { text: "Vincent van Gogh", is_correct: false },
              { text: "Pablo Picasso", is_correct: true },
              { text: "Edward Hopper", is_correct: false },
              { text: "Salvador Dalí", is_correct: false },
            ]),
          },
          {
            text: "Which of these artists drew the 'Vitruvian Man'?",
            answers: addAnswerIds([
              { text: "Leonardo da Vinci", is_correct: true },
              { text: "Caspar David Friedrich", is_correct: false },
              { text: "Vincent van Gogh", is_correct: false },
              { text: "Michelangelo", is_correct: false },
            ]),
          },
          {
            text: "'The Thinker' is a sculpture made by which of these artists?",
            answers: addAnswerIds([
              { text: "Salvador Dalí", is_correct: false },
              { text: "Michelangelo", is_correct: false },
              { text: "Auguste Rodin", is_correct: true },
              { text: "Claude Monet", is_correct: false },
            ]),
          },
          {
            text: "'Nighthawks' is a painting by which artist?",
            answers: addAnswerIds([
              { text: "Caspar David Friedrich", is_correct: false },
              { text: "Edward Hopper", is_correct: true },
              { text: "Edvard Munch", is_correct: false },
              { text: "Vincent van Gogh", is_correct: false },
            ]),
          },
          {
            text: "Who painted 'The Starry Night'?",
            answers: addAnswerIds([
              { text: "Pablo Picasso", is_correct: false },
              { text: "Claude Monet", is_correct: false },
              { text: "Vincent van Gogh", is_correct: true },
              { text: "Paul Gauguin", is_correct: false },
            ]),
          },
          {
            text: "Which artist created 'The Persistence of Memory'?",
            answers: addAnswerIds([
              { text: "Henri Matisse", is_correct: false },
              { text: "Salvador Dalí", is_correct: true },
              { text: "Edvard Munch", is_correct: false },
              { text: "Grant Wood", is_correct: false },
            ]),
          },
          {
            text: "Which artist painted the series 'Water Lilies'?",
            answers: addAnswerIds([
              { text: "Edgar Degas", is_correct: false },
              { text: "Paul Cezanne", is_correct: false },
              { text: "Claude Monet", is_correct: true },
              { text: "Gustav Klimt", is_correct: false },
            ]),
          },
          {
            text: "Which artist painted 'American Gothic'?",
            answers: addAnswerIds([
              { text: "Edward Hopper", is_correct: false },
              { text: "Georgia O'Keeffe", is_correct: false },
              { text: "Andrew Wyeth", is_correct: false },
              { text: "Grant Wood", is_correct: true },
            ]),
          }
        ],
      },
      {
        _id: quizId2,
        title: "The Skeletal System",
        category: "science",
        created_by: alice._id,
        req_to_pass: 6,
        questions: [
          {
            text: "What is the jawbone more formally known as?",
            answers: addAnswerIds([
              { text: "Scapula", is_correct: false },
              { text: "Epiglottis", is_correct: false },
              { text: "Patella", is_correct: false },
              { text: "Mandible", is_correct: true },
            ]),
          },
          {
            text: "Which is the largest bone in the body?",
            answers: addAnswerIds([
              { text: "Tibia", is_correct: false },
              { text: "Femur", is_correct: true },
              { text: "Radius", is_correct: false },
              { text: "Pelvis", is_correct: false },
            ]),
          },
          {
            text: "In what part of the body are the tarsals located?",
            answers: addAnswerIds([
              { text: "Hands", is_correct: false },
              { text: "Feet", is_correct: true },
              { text: "Ribcage", is_correct: false },
              { text: "Legs", is_correct: false },
            ]),
          },
          {
            text: "Which of these is not a bone?",
            answers: addAnswerIds([
              { text: "Scalenus", is_correct: true },
              { text: "Scapula", is_correct: false },
              { text: "Stapes", is_correct: false },
              { text: "Ulna", is_correct: false },
            ]),
          },
          {
            text: "What is the smallest bone in the human body?",
            answers: addAnswerIds([
              { text: "Ulna", is_correct: false },
              { text: "Stapes", is_correct: true },
              { text: "Humerus", is_correct: false },
              { text: "Fibula", is_correct: false },
            ]),
          },
          {
            text: "How many bones are in the adult human body?",
            answers: addAnswerIds([
              { text: "198", is_correct: false },
              { text: "212", is_correct: false },
              { text: "206", is_correct: true },
              { text: "186", is_correct: false },
            ]),
          },
          {
            text: "Which bone connects the sternum to the shoulder?",
            answers: addAnswerIds([
              { text: "Scapula", is_correct: false },
              { text: "Clavicle", is_correct: true },
              { text: "Radius", is_correct: false },
              { text: "Pelvis", is_correct: false },
            ]),
          },
          {
            text: "Which bone protects the brain?",
            answers: addAnswerIds([
              { text: "Mandible", is_correct: false },
              { text: "Sternum", is_correct: false },
              { text: "Cranium", is_correct: true },
              { text: "Vertebrae", is_correct: false },
            ]),
          }
        ],
      },
      {
        _id: quizId3,
        title: "Thermodynamics",
        category: "science",
        created_by: alice._id,
        req_to_pass: 6,
        questions: [
          {
            text: "What is commonly described as the measure of disorder or randomness?",
            answers: addAnswerIds([
              { text: "Diffusion", is_correct: false },
              { text: "Brownian Motion", is_correct: false },
              { text: "Entropy", is_correct: true },
              { text: "Osmosis", is_correct: false },
            ]),
          },
          {
            text: "Which of these temperatures is known as 'Absolute Zero'?",
            answers: addAnswerIds([
              { text: "-273.15°C", is_correct: true },
              { text: "-197.65°C", is_correct: false },
              { text: "-148.00°C", is_correct: false },
              { text: "-312.55°C", is_correct: false },
            ]),
          },
          {
            text: "'Heat Death' refers to what?",
            answers: addAnswerIds([
              { text: "Minimum Entropy", is_correct: false },
              { text: "Wave Function Collapse", is_correct: false },
              { text: "Thermal Equilibrium", is_correct: true },
              { text: "Stellar Nucleosynthesis", is_correct: false },
            ]),
          },
          {
            text: "How many laws of thermodynamics are there?",
            answers: addAnswerIds([
              { text: "3", is_correct: false },
              { text: "4", is_correct: true },
              { text: "5", is_correct: false },
              { text: "6", is_correct: false },
            ]),
          },
          {
            text: "Which law of thermodynamics states that energy is conserved?",
            answers: addAnswerIds([
              { text: "Second Law", is_correct: false },
              { text: "Third Law", is_correct: false },
              { text: "First Law", is_correct: true },
              { text: "Zeroth Law", is_correct: false },
            ]),
          },
          {
            text: "Which law says entropy of an isolated system tends to increase?",
            answers: addAnswerIds([
              { text: "First Law", is_correct: false },
              { text: "Second Law", is_correct: true },
              { text: "Third Law", is_correct: false },
              { text: "Zeroth Law", is_correct: false },
            ]),
          },
          {
            text: "What is the SI unit of temperature?",
            answers: addAnswerIds([
              { text: "Celsius", is_correct: false },
              { text: "Fahrenheit", is_correct: false },
              { text: "Rankine", is_correct: false },
              { text: "Kelvin", is_correct: true },
            ]),
          },
          {
            text: "The Zeroth Law of Thermodynamics deals with what concept?",
            answers: addAnswerIds([
              { text: "Heat capacity", is_correct: false },
              { text: "Thermal equilibrium", is_correct: true },
              { text: "Entropy increase", is_correct: false },
              { text: "Energy conversion", is_correct: false },
            ]),
          }
        ],
      },
      {
        _id: quizId4,
        title: "Renaissance Art",
        category: "art",
        created_by: jane._id,
        req_to_pass: 6,
        questions: [
          {
            text: "Who painted the ceiling of the Sistine Chapel?",
            answers: addAnswerIds([
              { text: "Donato Bramante", is_correct: false },
              { text: "Auguste Rodin", is_correct: false },
              { text: "Leonardo da Vinci", is_correct: false },
              { text: "Michelangelo", is_correct: true },
            ]),
          },
          {
            text: "Which Italian city was the heart of The Renaissance?",
            answers: addAnswerIds([
              { text: "Venice", is_correct: false },
              { text: "Florence", is_correct: true },
              { text: "Naples", is_correct: false },
              { text: "Rome", is_correct: false },
            ]),
          },
          {
            text: "Which city completes the title of Raphael's painting 'The School of...'?",
            answers: addAnswerIds([
              { text: "Rome", is_correct: false },
              { text: "Athens", is_correct: true },
              { text: "Alexandria", is_correct: false },
              { text: "Sparta", is_correct: false },
            ]),
          },
          {
            text: "Renaissance is the French word for what?",
            answers: addAnswerIds([
              { text: "Rebirth", is_correct: true },
              { text: "Renewal", is_correct: false },
              { text: "Resistance", is_correct: false },
              { text: "Noble", is_correct: false },
            ]),
          },
          {
            text: "Who painted the 'Mona Lisa'?",
            answers: addAnswerIds([
              { text: "Raphael", is_correct: false },
              { text: "Leonardo da Vinci", is_correct: true },
              { text: "Sandro Botticelli", is_correct: false },
              { text: "Titian", is_correct: false },
            ]),
          },
          {
            text: "Which artist painted 'The Birth of Venus'?",
            answers: addAnswerIds([
              { text: "Leonardo da Vinci", is_correct: false },
              { text: "Raphael", is_correct: false },
              { text: "Donatello", is_correct: false },
              { text: "Sandro Botticelli", is_correct: true },
            ]),
          },
          {
            text: "Which artist sculpted 'David'?",
            answers: addAnswerIds([
              { text: "Donatello", is_correct: false },
              { text: "Michelangelo", is_correct: true },
              { text: "Gian Lorenzo Bernini", is_correct: false },
              { text: "Filippo Brunelleschi", is_correct: false },
            ]),
          },
          {
            text: "Which artist is known for developing the sfumato technique?",
            answers: addAnswerIds([
              { text: "Raphael", is_correct: false },
              { text: "Albrecht Durer", is_correct: false },
              { text: "Leonardo da Vinci", is_correct: true },
              { text: "Caravaggio", is_correct: false },
            ]),
          } 
        ],
      },
      {
        _id: quizId5,
        title: "Western Classical Music",
        category: "music",
        created_by: barney._id,
        req_to_pass: 6,
        questions: [
          {
            text: "Which of these periods was the earliest?",
            answers: addAnswerIds([
              { text: "Romantic", is_correct: false },
              { text: "Classical", is_correct: false },
              { text: "Baroque", is_correct: true },
              { text: "Modern", is_correct: false },
            ]),
          },
          {
            text: "Frédéric Chopin belongs to which of these periods?",
            answers: addAnswerIds([
              { text: "Romantic", is_correct: true },
              { text: "Classical", is_correct: false },
              { text: "Baroque", is_correct: false },
              { text: "Modern", is_correct: false },
            ]),
          },
          {
            text: "Which composer is considered to be the 'father of Western music'?",
            answers: addAnswerIds([
              { text: "Wolfgang Amadeus Mozart", is_correct: false },
              { text: "Ludwig van Beethoven", is_correct: false },
              { text: "Antonio Vivaldi", is_correct: false },
              { text: "Johann Sebastian Bach", is_correct: true },
            ]),
          },
          {
            text: "Which pianist is most famously known for his works known as 'Trois Gymnopédies'?",
            answers: addAnswerIds([
              { text: "Frédéric Chopin", is_correct: false },
              { text: "Maurice Ravel", is_correct: false },
              { text: "Claude Debussy", is_correct: false },
              { text: "Erik Satie", is_correct: true },
            ]),
          },
          {
            text: "Who composed 'The Four Seasons'?",
            answers: addAnswerIds([
              { text: "Johann Sebastian Bach", is_correct: false },
              { text: "Antonio Vivaldi", is_correct: true },
              { text: "George Frideric Handel", is_correct: false },
              { text: "Joseph Haydn", is_correct: false },
            ]),
          },
          {
            text: "Who composed Symphony No. 5?",
            answers: addAnswerIds([
              { text: "Wolfgang Amadeus Mozart", is_correct: false },
              { text: "Franz Schubert", is_correct: false },
              { text: "Johannes Brahms", is_correct: false },
              { text: "Ludwig van Beethoven", is_correct: true },
            ]),
          },
          {
            text: "Which opera was composed by Mozart?",
            answers: addAnswerIds([
              { text: "Carmen", is_correct: false },
              { text: "La Traviata", is_correct: false },
              { text: "The Magic Flute", is_correct: true },
              { text: "Tannhauser", is_correct: false },
            ]),
          },
          {
            text: "Which period followed the Baroque era?",
            answers: addAnswerIds([
              { text: "Renaissance", is_correct: false },
              { text: "Classical", is_correct: true },
              { text: "Romantic", is_correct: false },
              { text: "Modern", is_correct: false },
            ]),
          } 
        ],
      },
      {
        _id: quizId6,
        title: "Brazilian History",
        category: "history",
        created_by: alice._id,
        req_to_pass: 6,
        questions: [
          {
            text: "What year did Brazil gain independence from Portugal?",
            answers: addAnswerIds([
              { text: "1814", is_correct: false },
              { text: "1822", is_correct: true },
              { text: "1818", is_correct: false },
              { text: "1815", is_correct: false },
            ]),
          },
          {
            text: "Which of these used to be a Brazilian currency?",
            answers: addAnswerIds([
              { text: "Cruzeiro", is_correct: true },
              { text: "Peso", is_correct: false },
              { text: "Moeda", is_correct: false },
              { text: "Primeiro", is_correct: false },
            ]),
          },
          {
            text: "Which of these cities has never been a Brazilian capital?",
            answers: addAnswerIds([
              { text: "Rio de Janeiro", is_correct: false },
              { text: "São Paulo", is_correct: true },
              { text: "Salvador", is_correct: false },
              { text: "Brasília", is_correct: false },
            ]),
          },
          {
            text: "Which modern country was briefly controlled by the Empire of Brazil?",
            answers: addAnswerIds([
              { text: "Paraguay", is_correct: false },
              { text: "Bolivia", is_correct: false },
              { text: "Uruguay", is_correct: true },
              { text: "Suriname", is_correct: false },
            ]),
          },
          {
            text: "Who proclaimed Brazil's independence?",
            answers: addAnswerIds([
              { text: "Dom Pedro II", is_correct: false },
              { text: "Dom Pedro I", is_correct: true },
              { text: "Getulio Vargas", is_correct: false },
              { text: "Jose Bonifacio", is_correct: false },
            ]),
          },
          {
            text: "In what year did Brazil become a republic?",
            answers: addAnswerIds([
              { text: "1822", is_correct: false },
              { text: "1930", is_correct: false },
              { text: "1889", is_correct: true },
              { text: "1960", is_correct: false },
            ]),
          },
          {
            text: "In what year was slavery abolished in Brazil?",
            answers: addAnswerIds([
              { text: "1878", is_correct: false },
              { text: "1898", is_correct: false },
              { text: "1868", is_correct: false },
              { text: "1888", is_correct: true },
            ]),
          },
          {
            text: "In what year did Brasilia become the capital of Brazil?",
            answers: addAnswerIds([
              { text: "1945", is_correct: false },
              { text: "1960", is_correct: true },
              { text: "1972", is_correct: false },
              { text: "1936", is_correct: false },
            ]),
          } 
        ],
      },
      {
        _id: quizId7,
        title: "Cocktails",
        category: "other",
        created_by: jane._id,
        req_to_pass: 6,
        questions: [
          {
            text: "A Negroni is composed of which 3 components?",
            answers: addAnswerIds([
              { text: "Rum - Campari - Vermouth Rosso", is_correct: false },
              { text: "Gin - Campari - Orgeat", is_correct: false },
              { text: "Gin - Campari - Vermouth Rosso", is_correct: true },
              { text: "Rum - Campari - Orgeat", is_correct: false },
            ]),
          },
          {
            text: "Which of these is not a tiki cocktail?",
            answers: addAnswerIds([
              { text: "Tequila Sunrise", is_correct: true },
              { text: "Zombie", is_correct: false },
              { text: "Mai Tai", is_correct: false },
              { text: "Jungle Bird", is_correct: false },
            ]),
          },
          {
            text: "Which of these cocktails uses rum as its base?",
            answers: addAnswerIds([
              { text: "Manhattan", is_correct: false },
              { text: "Caipirinha", is_correct: false },
              { text: "Daiquiri", is_correct: true },
              { text: "Mint Julep", is_correct: false },
            ]),
          },
          {
            text: "Which whiskey is traditionally used in an old fashioned?",
            answers: addAnswerIds([
              { text: "Rye", is_correct: false },
              { text: "Scotch", is_correct: false },
              { text: "Irish", is_correct: false },
              { text: "Bourbon", is_correct: true },
            ]),
          },
          {
            text: "What is the base spirit in a Margarita?",
            answers: addAnswerIds([
              { text: "Vodka", is_correct: false },
              { text: "Rum", is_correct: false },
              { text: "Tequila", is_correct: true },
              { text: "Gin", is_correct: false },
            ]),
          },
          {
            text: "Which cocktail is made with vodka, coffee liqueur, and cream?",
            answers: addAnswerIds([
              { text: "Espresso Martini", is_correct: false },
              { text: "White Russian", is_correct: true },
              { text: "Black Russian", is_correct: false },
              { text: "Moscow Mule", is_correct: false },
            ]),
          },
          {
            text: "Which cocktail traditionally includes mint, lime, sugar, and rum?",
            answers: addAnswerIds([
              { text: "Mai Tai", is_correct: false },
              { text: "Old Fashioned", is_correct: false },
              { text: "Sazerac", is_correct: false },
              { text: "Mojito", is_correct: true },
            ]),
          },
          {
            text: "Which cocktail is a classic mix of gin and tonic water?",
            answers: addAnswerIds([
              { text: "Tom Collins", is_correct: false },
              { text: "Gin and Tonic", is_correct: true },
              { text: "French 75", is_correct: false },
              { text: "Gimlet", is_correct: false },
            ]),
          } 
        ],
      },
      {
        _id: quizId8,
        title: "History of Coffee",
        category: "history",
        created_by: alice._id,
        req_to_pass: 6,
        questions: [
          {
            text: "In which country does coffee originate?",
            answers: addAnswerIds([
              { text: "Colombia", is_correct: false },
              { text: "Ethiopia", is_correct: true },
              { text: "Brazil", is_correct: false },
              { text: "Kenya", is_correct: false },
            ]),
          },
          {
            text: "The Mocha gets its name from a port in which country?",
            answers: addAnswerIds([
              { text: "Spain", is_correct: false },
              { text: "Lebanon", is_correct: false },
              { text: "Italy", is_correct: false },
              { text: "Yemen", is_correct: true },
            ]),
          },
          {
            text: "In which year did the first coffee house open in London?",
            answers: addAnswerIds([
              { text: "1652", is_correct: true },
              { text: "1650", is_correct: false },
              { text: "1681", is_correct: false },
              { text: "1703", is_correct: false },
            ]),
          },
          {
            text: "Which of these institutions began in a coffee house?",
            answers: addAnswerIds([
              { text: "Royal Opera House", is_correct: false },
              { text: "London Stock Exchange", is_correct: true },
              { text: "Cambridge University", is_correct: false },
              { text: "National Theatre", is_correct: false },
            ]),
          },
          {
            text: "Which country is the largest coffee producer today?",
            answers: addAnswerIds([
              { text: "Ethiopia", is_correct: false },
              { text: "Vietnam", is_correct: false },
              { text: "Brazil", is_correct: true },
              { text: "Colombia", is_correct: false },
            ]),
          },
          {
            text: "Coffee was first commercially cultivated in which country?",
            answers: addAnswerIds([
              { text: "Italy", is_correct: false },
              { text: "Ethiopia", is_correct: false },
              { text: "Yemen", is_correct: true },
              { text: "India", is_correct: false },
            ]),
          },
          {
            text: "The name 'cappuccino' comes from which group?",
            answers: addAnswerIds([
              { text: "Cistercian monks", is_correct: false },
              { text: "Capuchin monks", is_correct: true },
              { text: "Benedictine monks", is_correct: false },
              { text: "Franciscan monks", is_correct: false },
            ]),
          },
          {
            text: "Espresso originated in which country?",
            answers: addAnswerIds([
              { text: "France", is_correct: false },
              { text: "Turkey", is_correct: false },
              { text: "Italy", is_correct: true },
              { text: "Austria", is_correct: false },
            ]),
          } 
        ],
      },
      {
        _id: quizId9,
        title: "Bossa Nova",
        category: "music",
        created_by: barney._id,
        req_to_pass: 6,
        questions: [
          {
            text: "Who is considered the 'father of bossa nova'?",
            answers: addAnswerIds([
              { text: "Antônio Carlos Jobim", is_correct: false },
              { text: "Gilberto Gil", is_correct: false },
              { text: "Chico Buarque", is_correct: false },
              { text: "João Gilberto", is_correct: true },
            ]),
          },
          {
            text: "Bossa nova is a relaxed, jazz-infused form of which genre?",
            answers: addAnswerIds([
              { text: "Salsa", is_correct: false },
              { text: "Samba", is_correct: true },
              { text: "Sertanejo", is_correct: false },
              { text: "Flamenco", is_correct: false },
            ]),
          },
          {
            text: "Which of these is considered the first bossa nova hit?",
            answers: addAnswerIds([
              { text: "Corcovado", is_correct: false },
              { text: "Desafinado", is_correct: false },
              { text: "A Garota de Ipanema", is_correct: false },
              { text: "Chega de Saudade", is_correct: true },
            ]),
          },
          {
            text: "Which American artist first brought bossa nova to the United States?",
            answers: addAnswerIds([
              { text: "Charlie Byrd", is_correct: true },
              { text: "Stan Getz", is_correct: false },
              { text: "Miles Davis", is_correct: false },
              { text: "Glenn Miller", is_correct: false },
            ]),
          },
          {
            text: "Bossa nova emerged in Brazil during which decade?",
            answers: addAnswerIds([
              { text: "1930s", is_correct: false },
              { text: "1950s", is_correct: true },
              { text: "1970s", is_correct: false },
              { text: "1990s", is_correct: false },
            ]),
          },
          {
            text: "Who composed 'The Girl from Ipanema'?",
            answers: addAnswerIds([
              { text: "João Gilberto", is_correct: false },
              { text: "Chico Buarque", is_correct: false },
              { text: "Antônio Carlos Jobim", is_correct: true },
              { text: "Caetano Veloso", is_correct: false },
            ]),
          },
          {
            text: "Which album helped popularize bossa nova worldwide?",
            answers: addAnswerIds([
              { text: "Bossa Nova Worldwide", is_correct: false },
              { text: "Construção", is_correct: false },
              { text: "Getz/Gilberto", is_correct: true },
              { text: "O Descobridor dos Sete Mares", is_correct: false },
            ]),
          },
          {
            text: "Bossa nova is best described as a blend of samba and what?",
            answers: addAnswerIds([
              { text: "Rock", is_correct: false },
              { text: "Reggae", is_correct: false },
              { text: "Jazz", is_correct: true },
              { text: "Funk", is_correct: false },
            ]),
          } 
        ],
      },
      {
        _id: quizId10,
        title: "Mexican Cuisine",
        category: "other",
        created_by: barney._id,
        req_to_pass: 6,
        questions: [
          {
            text: "Which one of these dishes is not Mexican?",
            answers: addAnswerIds([
              { text: "Chilorios", is_correct: false },
              { text: "Chanclas Poblanas", is_correct: false },
              { text: "Feijoada", is_correct: true },
              { text: "Pozole", is_correct: false },
            ]),
          },
          {
            text: "'Burrito' translates literally to what in English?",
            answers: addAnswerIds([
              { text: "Little Blanket", is_correct: false },
              { text: "Little Donkey", is_correct: true },
              { text: "Little Bird", is_correct: false },
              { text: "Little Boat", is_correct: false },
            ]),
          },
          {
            text: "Which of these is not considered a breakfast dish?",
            answers: addAnswerIds([
              { text: "Desayuno", is_correct: true },
              { text: "Huevos Rancheros", is_correct: false },
              { text: "Mollete", is_correct: false },
              { text: "Chilaquiles", is_correct: false },
            ]),
          },
          {
            text: "Which dish is famously associated with Mexico's Independence celebrations in September?",
            answers: addAnswerIds([
              { text: "Mole Poblano", is_correct: false },
              { text: "Chiles en Nogada", is_correct: true },
              { text: "Barbacoa", is_correct: false },
              { text: "Chanclas Poblanas", is_correct: false },
            ]),
          },
          {
            text: "What is the corn dough used for tortillas called?",
            answers: addAnswerIds([
              { text: "Semolina", is_correct: false },
              { text: "Masa", is_correct: true },
              { text: "Polenta", is_correct: false },
              { text: "Arepa", is_correct: false },
            ]),
          },
          {
            text: "Guacamole is primarily made from what ingredient?",
            answers: addAnswerIds([
              { text: "Tomato", is_correct: false },
              { text: "Cucumber", is_correct: false },
              { text: "Avocado", is_correct: true },
              { text: "Zucchini", is_correct: false },
            ]),
          },
          {
            text: "Which cheese is commonly used in Mexican dishes?",
            answers: addAnswerIds([
              { text: "Brie", is_correct: false },
              { text: "Gouda", is_correct: false },
              { text: "Havarti", is_correct: false },
              { text: "Queso fresco", is_correct: true },
            ]),
          },
          {
            text: "Tacos al pastor were influenced by which cuisine?",
            answers: addAnswerIds([
              { text: "Japanese", is_correct: false },
              { text: "Lebanese", is_correct: true },
              { text: "Indian", is_correct: false },
              { text: "Spanish", is_correct: false },
            ]),
          } 
        ],
      }
    ]
    await Quiz.insertMany(quizzes);
    console.log("Seed quizzes created")
    process.exit(0);
  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

seed()
