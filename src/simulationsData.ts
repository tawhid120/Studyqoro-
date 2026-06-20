export interface SimulationTopic {
  id: string;
  title: string;
  type: 'iframe' | 'internal';
  embedUrl?: string;
  componentId?: string;
}

export interface SimulationChapter {
  id: string;
  title: string;
  topics: SimulationTopic[];
}

export interface SimulationSubject {
  id: string;
  title: string;
  chapters: SimulationChapter[];
}

export const simulationsData: SimulationSubject[] = [
  {
    id: "physics-1st",
    title: "পদার্থবিজ্ঞান ১ম পত্র",
    chapters: [
      {
        id: "ch-2",
        title: "ভেক্টর",
        topics: [
          {
            id: "phet-vector-addition",
            title: "ভেক্টর যোগ (Vector Addition - PhET)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/vector-addition/latest/vector-addition_en.html"
          },
          {
            id: "phet-vector-equations",
            title: "ভেক্টর সমীকরণ (Vector Equations - PhET)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/vector-addition-equations/latest/vector-addition-equations_en.html"
          },
          {
            id: "section-1",
            title: "১. যোগ ও বিয়োগ",
            type: 'internal',
            componentId: 'VectorSimulations'
          },
          {
            id: "section-2",
            title: "২. উপাংশ বিভাজন",
            type: 'internal',
            componentId: 'VectorSimulations'
          },
          {
            id: "section-3",
            title: "৩. ডট ও ক্রস গুণন",
            type: 'internal',
            componentId: 'VectorSimulations'
          },
          {
            id: "section-4",
            title: "৪. নদী-নৌকা পারাপার",
            type: 'internal',
            componentId: 'VectorSimulations'
          },
          {
            id: "section-5",
            title: "৫. আপেক্ষিক বেগ",
            type: 'internal',
            componentId: 'VectorSimulations'
          }
        ]
      },
      {
        id: "ch-4",
        title: "নিউটনিয়ান বলবিদ্যা",
        topics: [
          {
            id: "forces-motion-basics",
            title: "বলের ধারণা ও সূত্র (Forces & Motion)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/forces-and-motion-basics/latest/forces-and-motion-basics_en.html"
          },
          {
            id: "collision-lab",
            title: "ভরবেগের সংরক্ষণশীলতা ও সংঘর্ষ (Collision Lab)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/collision-lab/latest/collision-lab_en.html"
          },
          {
            id: "gravity-and-orbits",
            title: "বৃত্তাকার গতি (Gravity and Orbits)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/gravity-and-orbits/latest/gravity-and-orbits_en.html"
          },
          {
            id: "balancing-act",
            title: "ঘূর্ণন গতি ও টর্ক (Balancing Act)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/balancing-act/latest/balancing-act_en.html"
          }
        ]
      },
      {
        id: "ch-8",
        title: "পর্যাবৃত্ত গতি",
        topics: [
          {
            id: "pendulum",
            title: "সরল দোলক (Pendulum Lab)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/pendulum-lab/latest/pendulum-lab_en.html"
          },
          {
            id: "mass-spring",
            title: "স্প্রিং-ভর ব্যবস্থা (Masses and Springs)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/masses-and-springs/latest/masses-and-springs_en.html"
          }
        ]
      }
    ]
  },
  {
    id: "physics-2nd",
    title: "পদার্থবিজ্ঞান ২য় পত্র",
    chapters: [
      {
        id: "ch-2",
        title: "স্থির তড়িৎ",
        topics: [
          {
            id: "charges-and-fields",
            title: "আধান এবং ক্ষেত্র (Charges and Fields)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/charges-and-fields/latest/charges-and-fields_en.html"
          },
          {
            id: "capacitors",
            title: "ধারকত্ব (Capacitor Lab)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/capacitor-lab-basics/latest/capacitor-lab-basics_en.html"
          }
        ]
      },
      {
        id: "ch-3",
        title: "চল তড়িৎ",
        topics: [
          {
            id: "circuit-kit",
            title: "বর্তনী নির্মাণ (Circuit Construction Kit)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/circuit-construction-kit-dc/latest/circuit-construction-kit-dc_en.html"
          }
        ]
      },
      {
        id: "ch-4",
        title: "তড়িৎ প্রবাহের চৌম্বক ক্রিয়া ও চুম্বকত্ব",
        topics: [
          {
            id: "magnet-and-compass",
            title: "চুম্বক ও কম্পাস (Magnet & Compass)",
            type: 'internal',
            componentId: 'MagnetAndCompass'
          }
        ]
      }
    ]
  },
  {
    id: "chemistry-2nd",
    title: "রসায়ন ২য় পত্র",
    chapters: [
      {
        id: "ch-1",
        title: "পরিবেশ রসায়ন",
        topics: [
          {
            id: "gas-properties",
            title: "গ্যাসের বৈশিষ্ট্য (Gas Properties)",
            type: 'iframe',
            embedUrl: "https://phet.colorado.edu/sims/html/gas-properties/latest/gas-properties_en.html"
          }
        ]
      }
    ]
  }
];
