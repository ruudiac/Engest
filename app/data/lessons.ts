const estonianLetterNames: Record<string, string> = {
  'A': 'aa', 'B': 'bee', 'C': 'tsee', 'D': 'dee', 'E': 'ee',
  'F': 'eff', 'G': 'gee', 'H': 'haa', 'I': 'ii', 'J': 'jott',
  'K': 'kaa', 'L': 'ell', 'M': 'emm', 'N': 'enn', 'O': 'oo',
  'P': 'pee', 'Q': 'kuu', 'R': 'err', 'S': 'ess', 'Š': 'šaa',
  'Z': 'zett', 'Ž': 'žee', 'T': 'tee', 'U': 'uu', 'V': 'vee',
  'W': 'kaksisvee', 'Õ': 'õõ', 'Ä': 'ää', 'Ö': 'öö', 'Ü': 'üü',
  'X': 'iks', 'Y': 'igrek'
}

export const lessonsData = {
  1: [
    { id: 1, 
      name: 'Tähed 1', 
      subtitle: 'Letters 1',   
      icon: require('../../assets/images/A.png'),
      icon2: require('../../assets/images/O.png')},

    { id: 2, 
      name: 'Tähed 2', 
      subtitle: 'Letters 2',   
      icon: require('../../assets/images/A.png'),
      icon2: require('../../assets/images/O.png')},

    { id: 3, 
      name: 'Tähed 3', 
      subtitle: 'Letters 3',   
      icon: require('../../assets/images/A.png'),
      icon2: require('../../assets/images/O.png')},

    { id: 4, 
      name: 'Tervitused', 
      subtitle: 'Greetings', 
      icon2: require('../../assets/images/kasi1.png'),
      icon: require('../../assets/images/kasi2.png')
     },

    { id: 5,
      name: 'Nädalapäevad', 
      subtitle: 'Days of the week', 
      icon2: require('../../assets/images/kalender.png') },

    { id: 6, 
      name: 'Ilm', 
      subtitle: 'Weather', 
      icon: require('../../assets/images/paike.png'),
      icon2: require('../../assets/images/pilv.png') }
    ],

  2: [ 
    { id: 1, 
      name: 'Igapäevane släng', 
      subtitle: 'Everyday slang'},

    { id: 2, 
      name: 'Reaktsioonid ja emotsioonid', 
      subtitle: 'Reactions and emotions'},

    { id: 3, 
      name: 'Lühendid', 
      subtitle: 'Abbreviations'},

    { id: 4, 
      name: 'Vanasõnad', 
      subtitle: 'Proverbs'},
      
    ],

  3: [ 
    { id: 1, 
      name: 'Töö alused', 
      subtitle: 'Job basics'},

    { id: 2, 
      name: 'Tööl suhtlemine', 
      subtitle: 'At Work Communication'},

    { id: 3, 
      name: 'Tööolukorrad', 
      subtitle: 'Work Situations '},

    { id: 4, 
      name: 'Probleemid tööl', 
      subtitle: 'Problems at Work'},
      
    ],

  4: [ 
    { id: 1, 
      name: 'Ostlemise alused', 
      subtitle: 'Shopping basics'},

    { id: 2, 
      name: 'Poes ja tooted', 
      subtitle: 'Shop & Products'},

    { id: 3, 
       name: 'Maksmine', 
       subtitle: 'Checkout '},

    { id: 4, 
      name: 'Tagastamine', 
      subtitle: 'Returns'},
      
    ],
  5: [ 
      { id: 1, 
        name: 'Isikut tõendavad dokumendid', 
        subtitle: 'Identity & Government Basics'},

        { id: 2, 
          name: 'Viisad ja elamisload', 
          subtitle: 'Visas & Permits'},

        { id: 3, 
        name: 'Tervishoid', 
        subtitle: 'Healthcare'},

        { id: 4, 
          name: 'Avaldused', 
          subtitle: 'Applications'},

        { id: 5, 
          name: 'Pangandus ja finantsdokumendid', 
          subtitle: 'Banking & Financial Documents '},
      
    ],
  6: [ 
      { id: 1, 
        name: 'Loodus', 
        subtitle: 'Nature'},

        { id: 2, 
          name: 'Traditsioonid', 
          subtitle: 'Traditions'},

        { id: 3, 
        name: 'Pühad ja tähtpäevad', 
        subtitle: 'Holidays & Celebrations'},

        { id: 4, 
          name: 'Traditstioonilised Toit ja jook', 
          subtitle: 'Traditiotnal Food & Drink'}
    ],
  };

  export const flashcardsData = {
    1: {
      1:[
        { id: 1,
        letter: 'A',
        word: 'Apelsin',
        translation: 'Orange',},
  
        { id: 2,
          letter: 'B',
          word: 'Banaan',
          translation: 'Banana',},
        
        { id: 3,
          letter: 'C',
          word: 'Cola',
          translation: 'Cola',},
  
        { id: 4,
          letter: 'D',
          word: 'Diivan',
          translation: 'Couch',},
  
        { id: 5,
          letter: 'E',
          word: 'Ema',
          translation: 'Mother',},
  
        { id: 6,
          letter: 'F',
          word: 'Foto',
          translation: 'Photo',},
  
        { id: 7,
          letter: 'G',
          word: 'Gümnaasium',
          translation: 'gymnasium',},
  
        { id: 8,
          letter: 'H',
          word: 'Hunt',
          translation: 'Wolf',},
  
        { id: 9,
          letter: 'I',
          word: 'Ilves',
          translation: 'Lynx',},
  
        { id: 10,
          letter: 'J',
          word: 'Jänes',
          translation: 'Rabbit',},
      ],
      2:[
        { id: 11,
          letter: 'K',
          word: 'Kass',
          translation: 'Cat',},
  
        {id: 12,
          letter: 'L',
          word: 'Lõvi',
          translation: 'Lion',},
  
        { id: 13,
          letter: 'M',
          word: 'Maasikas',
          translation: 'Strawberry',},
  
        { id: 14,
          letter: 'N',
          word: 'Nina',
          translation: 'Nose',},
  
        { id: 15,
          letter:'O',
          word:'Orav',
          translation: 'Squirrel',},
  
        { id: 16,
          letter:'P',
          word:'Päike',
          translation:'The sun',},
  
        { id: 17,
          letter:'Q',
          word:'Qatar',
          translation:'Qatar',},
  
        { id: 18,
          letter:'R',
          word:'Roos',
          translation:'Rose',},
        
        { id: 19,
          letter:'S',
          word:'Sall',
          translation:'Scarf',},
  
        { id: 20,
          letter:'š',
          word:'šokolaad',
          translation:'Chocolate',}
      ],
  
    3: [
      { id: 21,
        letter:'Z',
        word:'Zoo',
        translation:'Zoo',},
  
      { id: 22,
        letter: 'ž',
        word: 'žürii',
        translation: 'Jury',},
  
      { id: 23,
        letter:'T',
        word:'Tramm',
        translation:'Tram',},
  
      { id: 24,
        letter:'U',
        word:'Uks',
        translation:'Door',},
  
      { id: 25,
        letter:'V',
        word:'Vihm',
        translation:'Rain',},
  
      { id: 26,
        letter:'õ',
        word:'õun',
        translation:'Apple',},
  
      { id: 27,
        letter:'ä',
        word:'ämblik',
        translation:'Spider',},
  
      { id: 28,
        letter:'ö',
        word:'öökull',
        translation:'Owl',},
  
      { id: 29,
        letter:'ü',
        word:'ülikool',
        translation:'University',},
  
      { id: 30,
        letter:'X',
        word:'Xylofon',
        translation:'Xylophone',},
  
      { id: 31,
        letter:'W',
        word: 'Washington',
        translation: 'Washington',},
  
      { id: 32,
        letter:'Y',
        word:'York',
        translation:'York',},
    ],
    4: [
      { 
        id: 1,
        word: 'Tere',
        translation: 'Hello',},

      { 
        id: 2,
        word: 'Tsau',
        translation: 'Hi/Bye',},

      { 
        id: 3,
        word: 'Hei',
        translation: 'Hey',},

      { 
        id: 4,
        word: 'Tere hommikust',
        translation: 'Good morning',},
      
      { 
        id: 5,
        word: 'Tere päevast',
        translation: 'Good afternoon',},

      { 
        id: 6,
        word: 'Tere õhtust',
        translation: 'Good evening',},

      {
        id: 7,
        word: 'Head ööd',
        translation: 'Good night',},

      {
        id: 8,
        word: 'Head aega',
        translation: 'Goodbye',},

      {
        id: 9,
        word: 'Kohtumiseni',
        translation: 'See you later',
      }

    ],
    5:[
      {
        id: 1,
        word: 'Esmaspäev',
        translation: 'Monday',
      },
      {
        id: 2,
        word: 'Teisipäev',
        translation: 'Tuesday',
      },
      {
        id: 3,
        word: 'Kolmapäev',
        translation: 'Wednesday',
      },
      {
        id: 4,
        word: 'Neljapäev',
        translation: 'Thursday',
      },
      {
        id: 5,
        word: 'Reede',
        translation: 'Friday',
      },
      {
        id: 6,
        word: 'Laupäev',
        translation: 'Saturday',
      },
      {
        id: 7,
        word: 'Pühapäev',
        translation: 'Sunday',
      }
    ],
    6:[
      {
        id: 1,
        word: 'Päike',
        translation: 'Sun',
      },
      {
        id: 2,
        word: 'Pilv',
        translation: 'Cloud',
      },
      {
        id: 3,
        word: 'Vihm',
        translation: 'Rain',
      },
      {
        id: 4,
        word: 'Lumi',
        translation: 'Snow',
      },
      {
        id: 5,
        word: 'Tuul',
        translation: 'Wind',
      },
      {
        id: 6,
        word: 'Äike',
        translation: 'Thunderstorm',
      },
      {
        id: 7,
        word: 'Pilvine',
        translation: 'Cloudy',
      },
      {
        id: 8,
        word: 'Päikesepaisteline',
        translation: 'Sunny',
      },
      {
        id:9,
        word: 'Tuuline',
        translation: 'Windy',
      },
      {
        id:10,
        word:'Soe',
        translation:'Warm',
      },
      {
        id:11,
        word:'Külm',
        translation:'Cold',
      },
    ]
    },
  2: {
    1:[
      {
        id: 1,
        word: 'Norm',
        translation: 'Cool/Fine',
      },
      {
        id: 2,
        word: 'Täiega',
        translation: 'Really/Totally',
      },
      {
        id: 3,
        word: 'Värk',
        translation: 'Thing / Stuff / Situation',
      },
      {
        id: 4,
        word: 'Viitsima',
        translation: 'To feel like / To bother',
      },
      {
        id: 5,
        word: 'Suht',
        translation: 'Pretty much / Quite',
      },
      {
        id: 6,
        word: 'Tüüp',
        translation: 'Guy / Person/ Type',
      },
      {
        id: 7,
        word:'Sõps',
        translation: 'Friend',
      },
      {
        id: 8,
        word: 'Jama',
        translation: 'Crap / Trouble / Annoying situation',
      },
      {
        id: 9,
        word: 'Noup',
        translation: 'Nope',
      },
      {
        id: 10,
        word: 'Suva',
        translation:'Whatever', 
      }
    ],
    2:[
      {
        id: 1,
        word: 'Päriselt?',
        translation: 'Really?',
      },
      {
        id: 2,
        word: 'Tõsiselt?',
        translation: 'Seriously?',
      },
      {
        id: 3,
        word:'Issand!',
        translation: 'Oh my God! / Help!',
      },
      {
        id: 4,
        word: 'Vau!',
        translation: 'Wow!',
      },
      {
        id: 5,
        word: 'Muidugi!',
        translation: 'Of course!',
      },
      {
        id: 6,
        word: 'Pole hullu!',
        translation: 'No worries',
      },
      {
        id: 7,
        word: 'Rahune maha!',
        translation: 'Calm down',
      },
      {
        id: 8,
        word: 'Ära muretse!',
        translation: 'Don´t worry!',
      },
      {
        id: 9,
        word: 'Mul on kahju.',
        translation: 'I´m sorry,',
      },
      {
        id: 10,
        word: 'Palun vabandust',
        translation: 'I apologize/ I´m sorry',
      }
    ],
    3:[
      {
        id: 1,
        word: 'tglt',
        meaning: 'tegelt',
        translation: 'actually/really'
      },
      {
        id: 2,
        word: 'pmst',
        meaning: 'põhimõtteliselt',
        translation: 'basically'
      },
      {
        id: 3,
        word:'vb',
        meaning: 'võib-olla',
        translation: 'maybe'
      },
      {
        id: 4,
        word: 'nsm',
        meaning: 'niisama',
        translation: 'just / nothing special'
      },
      {
        id: 5,
        word: 'krt',
        meaning: 'kurat',
        translation: 'damn/fuck/devil'
      }
    ],
    4:[
      {
        id:1,
        word: 'Tasa sõuad, kaugele jõuad.',
        translation: 'Slow and steady wins the race.'
      },
      {
        id: 2,
        word: 'Kes kannatab, see kaua elab.',
        translation: 'Patience pays off.'
      },
      {
        id: 3,
        word: 'Kes otsib, see leiab.',
        translation: 'He who seeks shall find.'
      },
      {
        id: 4,
        word: 'Hommik on õhtust targem.',
        translation: 'Things may look clearer in the morning.'
      },
      {
        id: 5,
        word:'Julge hundi rind on rasvane.',
        translation:'Fortune favors the bold.'
      },
      {
        id: 6,
        word: 'Parem hilja kui mitte kunagi.',
        translation: 'Better late than never.',
      },
      {
        id: 7,
        word: 'Üheksa korda mõõda, üks kord lõika.',
        translation: 'Measure twice, cut once.'
      },
      {
        id: 8,
        word: 'Kus suitsu, seal tuld.',
        translation: 'Where there´s smoke, there´s fire.'
      },
      {
        id: 9,
        word: 'Kes teisele auku kaevab, see ise sisse kukub.',
        translation: 'What goes around comes around.'
      },
      {
        id: 10,
        word: 'Pill tuleb pika ilu peale.',
        translation: 'All good things eventually come to an end.'
      }
    ]
  },
  3:{
    1:[
      {
        id: 1,
        word: 'Töökoht',
        translation: 'Workplace/Job',
      },
      {
        id: 2,
        word: 'Tööandja',
        translation: 'Employer',
      },
      {
        id: 3,
        word: 'Töötaja',
        translation: 'Employee',
      },
      {
        id: 4,
        word: 'Tööleping',
        translation: 'Employment contract',
      },
      {
        id: 5,
        word: 'Tööaeg',
        translation: 'Working hours',
      },
      {
        id: 6,
        word:'Amet',
        translation:'Profession/Occupation',
      },
      {
        id: 7,
        word: 'Tööintervjuu',
        translation: 'Job interview',
      },
      {
        id: 8,
        word: 'Palk',
        translation: 'Salary/Wage',
      },
      {
        id: 9,
        word:'Töötamine',
        translation:'Working/Employment',
      },
      {
        id: 10,
        word:'Tööpäev',
        translation:'Workday',
      }
    ],
    2:[
      {
        id: 1,
        word:'Mul on küsimus',
        translation:'I have a question',
      },
      {
        id: 2,
        word:'Kas sa saad mind aidata?',
        translation:'Can you help me?',
      },
      {
        id: 3,
        word:'Kuidas ma saan sind aidata?',
        translation:'How can I help you?',
      },
      {
        id: 4,
        word:'Kas sa saad mulle selgitada?',
        translation:'Can you explain to me?',
      },
      {
        id: 5,
        word:'Kas sa saad mulle näidata?',
        translation:'Can you show me?',
      },
      {
        id: 6,
        word:'Kas sa saad mulle õpetada?',
        translation:'Can you teach me?',
      },
      {
        id: 7,
        word:'Aitäh abi eest',
        translation:'Thank you for your help',
      },
      {
        id: 8,
        word: 'Ma annan teada',
        translation: 'I will let you know',
      },
      {
        id: 9,
        word: 'Ma vaatan üle',
        translation: 'I will check it out',
      },
      {
        id: 10,
        word: 'Kas see sobib?',
        translation: 'Does this work for you?',
      }
    ],
    3:[
      {
       id: 1,
        word:'Õppima',
        translation:'To learn',
      },
      {
        id: 2,
        word:'Kirjutama',
        translation:'To write',
      },
      {
        id: 3,
        word: 'Alustama',
        translation: 'To start',
      },
      {
        id: 4,
        word:'Lõpetama',
        translation:'To finish',
      },
      {
        id: 5,
        word:'Parandama',
        translation:'To fix/To improve',
      },
      {
        id: 6,
        word:'Arutama',
        translation:'To discuss',
      },
      {
        id: 7,
        word:'Saatma',
        translation:'To send',
      },
      {
        id: 8,
        word:'Vastama',
        translation:'To answer',
      },
      {
        id: 9,
        word:'Kinnitama',
        translation:'To confirm',
      },
      {
        id: 10,
        word:'Tühistama',
        translation:'To cancel',
      }
    ],
    4:[
      {
        id: 1,
        word:'Probleem',
        translation:'Problem',
      },
      {
        id: 2,
        word:'Viga',
        translation:'Error/Mistake',
      },
      {
        id: 3,
        word:'Kaebus',
        translation:'Complaint',
      },
      {
        id: 4,
        word:'Viivitus',
        translation:'Delay',
      },
      {
        id: 5,
        word:'Vabandama',
        translation:'To apologize',
      },
      {
        id: 6,
        word:'Lahendama',
        translation:'To solve/To resolve',
      },
      {
        id: 7,
        word:'Küsimus',
        translation:'Question/Issue',
      },
      {
        id: 8,
        word:'Vastuvõtt',
        translation:'Reception/Front desk',
      },
      {
        id: 9,
        word:'Hilinema',
        translation:'To be late',
      },
      {
        id: 10,
        word:'Tagasiside',
        translation:'Feedback',
      }
    ]
  },
  4:{
    1:[
      {
        id: 1,
        word:'Pood',
        translation:'Shop/Store',
      },
      {
        id: 2,
        word:'Toode',
        translation:'Product',
      },
      {
        id: 3,
        word:'Hind',
        translation:'Price',
      },
      {
        id: 4,
        word:'Kassa',
        translation:'Cash register/Checkout',
      },
      {
        id: 5,
        word:'Ostja',
        translation:'Buyer/Customer',
      },
      {
        id: 6,
        word:'Müüja',
        translation:'Seller/Salesperson',
      },
      {
        id: 7,
        word:'Riiul',
        translation:'Shelf',
      },
      {
        id: 8,
        word:'Allahindlus',
        translation:'Discount/Sale',
      },
      {
        id: 9,
        word:'Kviitung',
        translation:'Receipt',
      },
      {
        id: 10,
        word:'Garantii',
        translation:'Warranty/Guarantee',
      },
      {
        id: 11,
        word:'Kallis',
        translation:'Expensive',
      },
      {
        id: 12,
        word:'Odav',
        translation:'Cheap',
      }
    ],
    2:[
      {
        id: 1,
        word:'Suurus',
        translation:'Size',
      },
      {
        id: 2,
        word:'Värv',
        translation:'Color',
      },
      {
        id: 3,
        word:'Materjal',
        translation:'Material',
      },
      {
        id: 4,
        word: 'Kaubamärk',
        translation: 'Brand',
      },
      {
        id: 5,
        word: 'Pakend',
        translation: 'Packaging',
      },
      {
        id: 6,
        word: 'Kogus',
        translation: 'Quantity',
      },
      {
        id: 7,
        word: 'Tükk',
        translation: 'Piece',
      },
      {
        id: 8,
        word: 'Saadaval',
        translation: 'Available',
      },
      {
        id: 9,
        word: 'Otsas',
        translation: 'Out of stock',
      },
      {
        id: 10,
        word: 'Tellimus',
        translation: 'Order',
      }
    ],
    3:[
      {
        id: 1,
        word:'Maksmine',
        translation:'Payment',
      },
      {
        id: 2,
        word:'Sularaha',
        translation:'Cash',
      },
      {
        id: 3,
        word:'Kaart',
        translation:'Card',
      },
      {
        id: 4,
        word:'Arve',
        translation:'Invoice/Bill',
      },
      {
        id: 5,
        word:'Kontaktivaba',
        translation:'Contactless',
      },
      {
        id: 6,
        word:'Makseterminal',
        translation:'Payment terminal',
      },
      {
        id: 7,
        word:'Vahetus',
        translation:'Exchange/Change',
      },
      {
        id: 8,
        word:'Maksma',
        translation:'To pay',
      },
      {
        id: 9,
        word:'Summa',
        translation:'Amount',
      },
      {
        id: 10,
        word:'Klienditeenindus',
        translation:'Customer service',
      }
    ],
    4:[
      {
        id: 1,
        word:'Tagastus',
        translation:'Return',
      },
      {
        id: 2,
        word:'Vahetus',
        translation:'Exchange',
      },
      {
        id: 3,
        word:'Ostutšekk',
        translation:'Purchase receipt',
      },
      {
        id: 4,
        word:'Tagasimakse',
        translation:'Refund',
      },
      {
        id: 5,
        word:'Defektne',
        translation:'Defective',
      },
      {
        id: 6,
        word:'Katki',
        translation:'Broken',
      },
      {
        id: 7,
        word:'Vale',
        translation:'Wrong',
      },
      {
        id: 8,
        word:'Kahjustatud',
        translation:'Damaged',
      },
      {
        id:9,
        word: 'Sobima',
        translation: 'To fit',
      },
      {
        id: 10,
        word: 'Vigane',
        translation: 'Faulty',
      }
    ],

  },
  5:{
    1:[
      {
        id: 1,
        word: 'Dokument',
        translation: 'Document',
      },
      {
        id: 2,
        word:'Isikut tõendav dokument',
        translation:'Identity document',
      },
      {
        id: 3,
        word:'ID-kaart',
        translation:'ID card',
      },
      {
        id: 4,
        word:'Pass',
        translation:'Passport',
      },
      {
        id: 5,
        word: 'Juhiluba',
        translation: 'Driver´s license',
      },
      {
        id: 6,
        word: 'Isikukood',
        translation: 'Personal identification code',
      },
      {
        id: 7,
        word: 'Kehtivusaeg',
        translation: 'Validity period',
      },
      {
        id: 8,
        word: 'Allikiri',
        translation: 'Signature',
      },
      {
        id: 9,
        word: 'Dokumendi number',
        translation: 'Document number',
      },
      {
        id: 10,
        word: 'Taotlus',
        translation: 'Application',
      }
    ],
    2:[
      {
        id: 1,
        word: 'Viisa',
        translation: 'Visa',
      },
      {
        id: 2,
        word: 'Elamisluba',
        translation: 'Residence permit',
      },
      {
        id: 3,
        word: 'Elamisõigus',
        translation: 'Right of residence',
      },
      {
        id: 4,
        word: 'Kodakondsus',
        translation: 'Citizenship',
      },
      {
        id: 5,
        word: 'Välismaalane',
        translation: 'Foreigner',
      },
      {
        id: 6,
        word: 'Tähtajaline',
        translation: 'Temporary/fixed-term',
      },
      {
        id: 7,
        word: 'Tähtajatu',
        translation: 'Permanent/indefinite',
      },
      {
        id: 8,
        word: 'Taotleja',
        translation: 'Applicant',
      },
      {
        id: 9,
        word: 'Viibimine',
        translation: 'Stay/Residence',
      },
      {
        id: 10,
        word: 'Elukoht',
        translation: 'Place of residence',
      },
      {
        id: 11,
        word: 'Registreerima',
        translation: 'To register',
      },
      {
        id: 12,
        word: 'Pikendama',
        translation: 'To extend',
      }
    ],
    3:[
      {
        id: 1,
        word: 'Arst',
        translation: 'Doctor',
      },
      {
        id: 2,
        word: 'Haigla',
        translation: 'Hospital',
      },
      {
        id: 3,
        word: 'Haigus',
        translation: 'Illness',
      },
      {
        id: 4,
        word: 'Apteek',
        translation: 'Pharmacy',
      },
      {
        id: 5,
        word: 'Tervisekindlustus',
        translation: 'Health insurance',
      },
      {
        id: 6,
        word: 'Retsept',
        translation: 'Prescription',
      },
      {
        id: 7,
        word: 'Ravim',
        translation: 'Medicine/Drug',
      },
      {
        id: 8,
        word: 'Vastuvõtt',
        translation: 'Appointment/Reception',
      },
      {
        id: 9,
        word: 'Paranema',
        translation: 'To recover',
      },
      {
        id: 10,
        word: 'Saatekiri',
        translation: 'Referral letter',
      },
      {
        id: 11,
        word: 'Haigestuma',
        translation: 'To fall ill',
      },
      {
        id: 12,
        word: 'Raviarve',
        translation: 'Medical bill',
        
      }
    ],
    4:[
      {
        id: 1,
        word: 'Vorm',
        translation: 'Form',
      },
      {
        id: 2,
        word: 'Taotlema',
        translation: 'To apply',
      },
      {
        id: 3,
        word: 'Täitma',
        translation: 'To fill out',
      },
      {
        id: 4,
        word: 'Esitama',
        translation: 'To submit',
      },
      {
        id: 5,
        word: 'Kuupäev',
        translation: 'Date',
      },
      {
        id: 6,
        word: 'Andmed',
        translation: 'Data/Information',
      },
      {
        id: 7,
        word: 'Isikuandmed',
        translation: 'Personal data',
      },
      {
        id: 8,
        word: 'Tõend',
        translation: 'Certificate/Proof',
      },
      {
        id: 9,
        word: 'Lisama',
        translation: 'To add/attach',
      },
      {
        id: 10,
        word: 'Ametiasutus',
        translation: 'Government authority',
      },
      {
        id: 11,
        word: 'Tähtaeg',
        translation: 'Deadline',
      }
    ],
    5:[
      {
        id: 1,
        word: 'Pank',
        translation: 'Bank',
      },
      {
        id: 2,
        word: 'Pangakonto',
        translation: 'Bank account',
      },
      {
        id: 3,
        word: 'Kontonumber',
        translation: 'Account number',
      },
      {
        id: 4,
        word: 'Pangakaart',
        translation: 'Bank card',
      },
      {
        id: 5,
        word: 'Konto väljavõte',
        translation: 'Account statement',
      },
      {
        id: 6,
        word: 'Ülekanne',
        translation: 'Transfer',
      },
      {
        id: 7,
        word: 'Makse',
        translation: 'Payment',
      },
      {
        id: 8,
        word: 'Laen',
        translation: 'Loan',
      },
      {
        id: 9,
        word: 'Leping',
        translation: 'Contract/Agreement',
      },
      {
        id: 10,
        word: 'Maksudeklaratsioon',
        translation: 'Tax declaration',
      },
      {
        id: 11,
        word: 'Sissetulek',
        translation: 'Income',
      },
      {
        id: 12,
        word: 'Kulu',
        translation: 'Expense',
      },
      {
        id: 13,
        word: 'Tuludeklaratsioon',
        translation: 'Income declaration',
      }
    ]
  },
  6:{
    1:[
      {
        id: 1,
        word: 'Mets',
        translation: 'Forest',
      },
      {
        id: 2,
        word: 'Meri',
        translation: 'Sea',
      },
      {
        id: 3,
        word:'Järv',
        translation:'Lake',
      },
      {
        id: 4,
        word: 'Saar',
        translation: 'Island',
      },
      {
        id: 5,
        word: 'Raba',
        translation: 'Bog',
      },
      {
        id: 6,
        word: 'Jõgi',
        translation: 'River',
      },
      {
        id: 7,
        word: 'Rand',
        translation: 'Beach',
      },
      {
        id: 8,
        word: 'Mägi',
        translation: 'Mountain',
      },
      {
        id: 9,
        word: 'Mari',
        translation: 'Berry',
      },
      {
        id: 10,
        word: 'Rahvuspark',
        translation: 'National park',
      }
    ],
    2:[
      {
        id: 1,
        word: 'Saun',
        translation: 'Sauna',
      },
      {
        id: 2,
        word: 'Pulmakomme',
        translation: 'Wedding tradition',
      },
      {
        id: 3,
        word:'Laulupidu',
        translation:'Song festival',
      },
      {
        id: 4,
        word:'Tantsupidu',
        translation:'Dance festival',
      },
      {
        id: 5,
        word: 'Rahvatants',
        translation: 'Folk dance',
      },
      {
        id: 6,
        word: 'Pulm',
        translation: 'Wedding',
      },
      {
        id: 7,
        word:'Regilaul',
        translation:'Runic song / traditional Estonian song',
      },
      {
        id: 8,
        word:'Rahvariided',
        translation:'Traditional clothing',
      },
      {
        id: 9,
        word:'Kiik',
        translation:'Swing',
      },
      {
        id: 10,
        word: 'Lõke',
        translation: 'Bonfire',
      }
    ],
    3:[
      {
        id: 1,
        word: 'Iseseisvuspäev',
        translation: 'Independence Day',
      },
      {
        id: 2,
        word: 'Jõulud',
        translation: 'Christmas',
      },
      {
        id: 3,
        word: 'Uusaasta',
        translation: 'New Year',
      },
      {
        id: 4,
        word: 'Vana-aastaõhtu',
        translation: 'New Year´s Eve',
      },
      {
        id: 5,
        word: 'Jaanipäev',
        translation: 'Midsummer Day',
      },
      {
        id: 6,
        word:'Vastlapäev',
        translation:'Shrove Tuesday',
      },
      {
        id: 7,
        word: 'Kadripäev',
        translation: 'St. Catherine´s Day',
      },
      {
        id: 8,
        word: 'Mardipäev',
        translation: 'St. Martin´s Day',
      },
      {
        id: 9,
        word: 'Sõbrapäev',
        translation: 'Valentine´s Day',
      },
      {
        id: 10,
        word: 'Riigipüha',
        translation: 'Public holiday',
      }
    ],
    4:[
      {
        id: 1,
        word: 'Must leib',
        translation: 'Dark rye bread',
      },
      {
        id: 2,
        word: 'Verivorst',
        translation: 'Blood sausage',
      },
      {
        id: 3,
        word: 'Kohuke',
        translation: 'Curd snack',
      },
      {
        id: 4,
        word: 'Hapukapsas',
        translation:'Sauerkraut',
      },
      {
        id: 5,
        word: 'Kartulisalat',
        translation: 'Potato salad',
      },
      {
        id: 6,
        word: 'Vastlakukkel',
        translation: 'Shrove bun',
      },
      {
        id: 7,
        word: 'Kali',
        translation: 'Kvass',
      },
      {
        id: 8,
        word: 'Sült',
        translation: 'Aspic',
      },
      {
        id: 9,
        word: 'Kama',
        translation: 'Kama (traditional Estonian food)',
      },
      {
        id: 10,
        word: 'Kiluvõileib',
        translation: 'Sprat sandwich',
      }
    ]
  }
  }
