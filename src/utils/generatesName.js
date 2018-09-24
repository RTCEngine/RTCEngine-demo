'use strict';

var firstNames = {
  male: [
    'Aaron', 'Aiden', 'Alexander', 'Andrew', 'Anthony', 'Benjamin', 'Brandon',
    'Brayden', 'Caleb', 'Carter', 'Christian', 'Christopher', 'Daniel',
    'David', 'Dylan', 'Elijah', 'Ethan', 'Evan', 'Gabriel', 'Gavin', 'Isaac',
    'Isaiah', 'Jack', 'Jackson', 'Jacob', 'James', 'Jayden', 'John',
    'Jonathan', 'Jordan', 'Joseph', 'Joshua', 'Julian', 'Landon', 'Liam',
    'Logan', 'Lucas', 'Luke', 'Mason', 'Matthew', 'Michael', 'Nathan',
    'Nicholas', 'Noah', 'Owen', 'Ryan', 'Samuel', 'Tyler', 'William', 'Wyatt'
  ],
  female: [
    'Aaliyah', 'Abigail', 'Addison', 'Alexis', 'Allison', 'Alyssa', 'Amelia',
    'Anna', 'Ashley', 'Aubrey', 'Audrey', 'Ava', 'Avery', 'Brianna',
    'Brooklyn', 'Camila', 'Charlotte', 'Chloe', 'Claire', 'Elizabeth', 'Ella',
    'Emily', 'Emma', 'Evelyn', 'Gabriella', 'Grace', 'Hailey', 'Hannah',
    'Isabella', 'Kaylee', 'Khloe', 'Layla', 'Leah', 'Lillian', 'Lily',
    'Madison', 'Mia', 'Natalie', 'Nevaeh', 'Olivia', 'Riley', 'Samantha',
    'Sarah', 'Savannah', 'Sofia', 'Sophia', 'Taylor', 'Victoria', 'Zoe',
    'Zoey'
  ]
};

var lastNames = [
  'Adams', 'Alexander', 'Allen', 'Anderson', 'Bailey', 'Baker', 'Barnes',
  'Bell', 'Bennett', 'Brooks', 'Brown', 'Bryant', 'Butler', 'Campbell',
  'Carter', 'Clark', 'Coleman', 'Collins', 'Cook', 'Cooper', 'Cox', 'Davis',
  'Diaz', 'Edwards', 'Evans', 'Flores', 'Foster', 'Garcia', 'Gonzales',
  'Gonzalez', 'Gray', 'Green', 'Griffin', 'Hall', 'Harris', 'Hayes',
  'Henderson', 'Hernandez', 'Hill', 'Howard', 'Hughes', 'Jackson', 'James',
  'Jenkins', 'Johnson', 'Jones', 'Kelly', 'King', 'Lee', 'Lewis', 'Long',
  'Lopez', 'Martin', 'Martinez', 'Miller', 'Mitchell', 'Moore', 'Morgan',
  'Morris', 'Murphy', 'Nelson', 'Parker', 'Patterson', 'Perez', 'Perry',
  'Peterson', 'Phillips', 'Powell', 'Price', 'Ramirez', 'Reed', 'Richardson',
  'Rivera', 'Roberts', 'Robinson', 'Rodriguez', 'Rogers', 'Ross', 'Russell',
  'Sanchez', 'Sanders', 'Scott', 'Simmons', 'Smith', 'Stewart', 'Taylor',
  'Thomas', 'Thompson', 'Torres', 'Turner', 'Walker', 'Ward', 'Washington',
  'Watson', 'White', 'Williams', 'Wilson', 'Wood', 'Wright', 'Young'
];

var sexes = [
  'female', 'male'
]

function randomInArray (array) {
  if (Array.isArray(array)) {
    return array[Math.floor(Math.random() * array.length)];
  } else {
    throw new Error(array + ' is not an array.');
  }
}

export default function () {
  const sex = randomInArray(sexes)
  return `${randomInArray(firstNames[sex])} ${randomInArray(lastNames)}`
}