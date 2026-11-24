// Content for the grammar modules (Käänded and Pöörded).
// One group per grammar lesson, found by "moduleId_lessonNumber", e.g. GRAMMAR['7_1'].
// In example sentences, **word** marks the case form; the screen highlights it.

export type GrammarExample = {
  et: string; // Estonian sentence, with the case form between ** **
  en: string; // English meaning
};

export type GrammarCase = {
  key: string;      // a key in CASES (casesModal.tsx), or a person key for verbs (ma, sa, ta, me, te, nad, eitus)
  label?: string;   // optional heading instead of the key (used for verbs)
  ending: string;   // the typical ending, shown big
  explain: string;  // plain-English explanation
  examples: GrammarExample[];
};

export type GrammarGroup = {
  title: string;    // short English headline for the intro screen
  intro: string;    // what the cases in this group have in common
  cases: GrammarCase[];
};

export const GRAMMAR: Record<string, GrammarGroup> = {
  '7_1': {
    title: 'Inside: into, in, out of',
    intro:
      'In Estonian, little words like "into", "in" and "out of" become endings on the word itself. ' +
      'These three cases are all about being inside something: going in, being in, and coming out.',
    cases: [
      {
        key: 'sisseütlev',
        ending: '-sse',
        explain:
          'Moving INTO something. Many common words use a shorter form without -sse, ' +
          'like poodi (into the shop) or kooli (to school). Both kinds are correct.',
        examples: [
          { et: 'Ma lähen **poodi**.', en: "I'm going to the shop." },
          { et: 'Pane piim **külmkappi**.', en: 'Put the milk into the fridge.' },
        ],
      },
      {
        key: 'seesütlev',
        ending: '-s',
        explain: 'Being IN or AT something. No movement, you are already there.',
        examples: [
          { et: 'Ma olen **koolis**.', en: "I'm at school." },
          { et: 'Piim on **külmkapis**.', en: 'The milk is in the fridge.' },
        ],
      },
      {
        key: 'seestütlev',
        ending: '-st',
        explain:
          'Coming OUT OF something, or FROM a place. It is also used for "about", ' +
          'when you talk about something.',
        examples: [
          { et: 'Ma tulen **poest**.', en: "I'm coming from the shop." },
          { et: 'Me räägime **filmist**.', en: "We're talking about the film." },
        ],
      },
    ],
  },

  '7_2': {
    title: 'On the surface: onto, on, off',
    intro:
      'These three work like the "inside" cases, but for surfaces and people: ' +
      'putting something onto a table, being on it, and taking it off. ' +
      'They are also how Estonians say "I have".',
    cases: [
      {
        key: 'alaleütlev',
        ending: '-le',
        explain: 'Moving ONTO something, or giving or saying something TO a person.',
        examples: [
          { et: 'Pane raamat **lauale**.', en: 'Put the book on the table.' },
          { et: 'Ma helistan **emale**.', en: "I'm calling mum." },
        ],
      },
      {
        key: 'alalütlev',
        ending: '-l',
        explain:
          'Being ON something. With a person, it means they HAVE something: ' +
          'Mul on = I have (literally "on me is").',
        examples: [
          { et: 'Raamat on **laual**.', en: 'The book is on the table.' },
          { et: '**Emal** on uus auto.', en: 'Mum has a new car.' },
        ],
      },
      {
        key: 'alaltütlev',
        ending: '-lt',
        explain: 'Coming OFF something, or getting something FROM a person.',
        examples: [
          { et: 'Võta raamat **laualt**.', en: 'Take the book off the table.' },
          { et: 'Ma sain **emalt** kingituse.', en: 'I got a present from mum.' },
        ],
      },
    ],
  },

  '7_3': {
    title: 'With and without',
    intro:
      'Two easy ones: "with" and "without" are just endings. ' +
      'They are among the most regular cases, so they are a good confidence boost.',
    cases: [
      {
        key: 'kaasaütlev',
        ending: '-ga',
        explain: 'WITH someone or something, and also BY, for ways of travelling.',
        examples: [
          { et: 'Ma lähen **emaga** kinno.', en: "I'm going to the cinema with mum." },
          { et: 'Ma sõidan **bussiga**.', en: "I'm going by bus." },
        ],
      },
      {
        key: 'ilmaütlev',
        ending: '-ta',
        explain: 'WITHOUT something.',
        examples: [
          { et: 'Kohv **suhkruta**, palun.', en: 'Coffee without sugar, please.' },
          { et: 'Ta läks **jopeta** välja.', en: 'He went out without a jacket.' },
        ],
      },
    ],
  },

  '7_4': {
    title: "Of, 's, and some",
    intro:
      'These two are the most important cases in Estonian, and the trickiest. ' +
      'They have no single ending, so the best way to learn them is word by word, ' +
      'with lots of examples.',
    cases: [
      {
        key: 'omastav',
        ending: '-?',
        explain:
          'OF or \'s: who something belongs to. Most other cases are built on this form, ' +
          'so it is worth learning with every new word.',
        examples: [
          { et: 'See on **ema** auto.', en: "This is mum's car." },
          { et: '**Tallinna** vanalinn on ilus.', en: "Tallinn's old town is beautiful." },
        ],
      },
      {
        key: 'osastav',
        ending: '-t / -d / -?',
        explain:
          'A PART of something, or an unknown amount. You need it after numbers, ' +
          'after "not" and "no", and for things like "some water".',
        examples: [
          { et: 'Mul ei ole **autot**.', en: "I don't have a car." },
          { et: 'Ma joon **vett**.', en: "I'm drinking water." },
        ],
      },
    ],
  },

  '7_5': {
    title: 'Becomes, as, until',
    intro:
      'Three cases for changes and limits: becoming something, being something for a while, ' +
      'and going as far as something.',
    cases: [
      {
        key: 'saav',
        ending: '-ks',
        explain: 'BECOMING something, or turning into something.',
        examples: [
          { et: 'Ta saab **arstiks**.', en: 'She is becoming a doctor.' },
          { et: 'Ilm läheb **külmaks**.', en: 'The weather is getting cold.' },
        ],
      },
      {
        key: 'olev',
        ending: '-na',
        explain: 'AS something, in a role or at a time of life.',
        examples: [
          { et: 'Ta töötab **arstina**.', en: 'She works as a doctor.' },
          { et: 'Ma elasin seal **lapsena**.', en: 'I lived there as a child.' },
        ],
      },
      {
        key: 'rajav',
        ending: '-ni',
        explain: 'UNTIL or AS FAR AS: a limit in time or place.',
        examples: [
          { et: 'Ma jalutan **jõeni**.', en: 'I walk as far as the river.' },
          { et: 'Pood on lahti **kella kaheni**.', en: 'The shop is open until two.' },
        ],
      },
    ],
  },
  // ---------- Pöörded (verbs), module 8 ----------
  '8_1': {
    title: 'I, you, he and she',
    intro:
      'Estonian verbs change their ending depending on WHO is doing something. ' +
      'The good news: the endings are very regular. We start with one person at a time: I, you and he or she. ' +
      'Estonian has no "he" or "she", ta means both!',
    cases: [
      {
        key: 'ma',
        label: 'ma · I',
        ending: '-n',
        explain:
          'For yourself, add -n. The middle of the word sometimes changes a little (õppima becomes õpin), ' +
          "so check each verb's Pöörded sheet.",
        examples: [
          { et: 'Ma **õpin** eesti keelt.', en: "I'm learning Estonian." },
          { et: 'Ma **maksan** kaardiga.', en: 'I pay by card.' },
        ],
      },
      {
        key: 'sa',
        label: 'sa · you',
        ending: '-d',
        explain: 'Talking to one person you know well: add -d.',
        examples: [
          { et: 'Kas sa **õpid** eesti keelt?', en: 'Are you learning Estonian?' },
          { et: 'Sa **kirjutad** väga hästi.', en: 'You write very well.' },
        ],
      },
      {
        key: 'ta',
        label: 'ta · he, she',
        ending: '-b',
        explain: 'Talking about one other person: add -b. The same form for he and she.',
        examples: [
          { et: 'Ta **vastab** kohe.', en: 'She answers right away.' },
          { et: 'Ta **hilineb** alati.', en: 'He is always late.' },
        ],
      },
    ],
  },

  '8_2': {
    title: 'We, you all, they',
    intro:
      'Now the plural: we, you (more than one person, or polite) and they. ' +
      'These endings are just as regular as the first three.',
    cases: [
      {
        key: 'me',
        label: 'me · we',
        ending: '-me',
        explain: 'For a group that includes you: add -me.',
        examples: [
          { et: 'Me **alustame** kell üheksa.', en: 'We start at nine.' },
          { et: 'Me **maksame** koos.', en: 'We pay together.' },
        ],
      },
      {
        key: 'te',
        label: 'te · you (all)',
        ending: '-te',
        explain:
          'For several people, or one person you want to be polite to (like a stranger or a boss): add -te.',
        examples: [
          { et: 'Kas te **räägite** inglise keelt?', en: 'Do you speak English?' },
          { et: 'Te **kirjutate** kiiresti.', en: 'You write fast.' },
        ],
      },
      {
        key: 'nad',
        label: 'nad · they',
        ending: '-vad',
        explain: 'Talking about several other people: add -vad.',
        examples: [
          { et: 'Nad **õpivad** ülikoolis.', en: 'They study at university.' },
          { et: 'Nad **hilinevad** jälle.', en: 'They are late again.' },
        ],
      },
    ],
  },

  '8_3': {
    title: 'Saying no',
    intro:
      'Here is the easiest grammar rule in Estonian: to say "not", put ei in front of the verb ' +
      'and drop the ending. It is the same for every person.',
    cases: [
      {
        key: 'eitus',
        label: 'ei · not',
        ending: 'ei ...',
        explain:
          'ei + the verb with no ending: ma ei õpi, sa ei õpi, nad ei õpi. ' +
          'No -n, -d or -b after ei!',
        examples: [
          { et: 'Ma **ei õpi** täna.', en: "I'm not studying today." },
          { et: 'Ta **ei vasta**.', en: "She isn't answering." },
          { et: 'Nad **ei maksa** sularahas.', en: "They don't pay in cash." },
        ],
      },
    ],
  },
};