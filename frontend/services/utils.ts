export const courseColorPalette: Record<string, Record<string, string>> = {
  all: {
    primary: "#000",
    secondary: "text-white"
  },
  english: {
    primary: "#E74C3C",
    secondary: "text-white"
  },
  history: {
    primary: "#9B59B6"
  },
  math: {
    primary: "#3498DB"
  },
  physics: {
    primary: "#1ABC9C"
  },
  "computer science": {
    primary: "#F39C12",
    secondary: "text-white"
  }
  //"#F39C12", // orange
  //"#2ECC71", // green
}
// change to index object round robin...... ^^^^^

export const areas = {
  ["General Education"]: {
    ["Lower Division"]: {
      "2": "Mathematical Concepts and Quantitative Reasoning",
      "4": "Social and Behavioral Sciences",
      "6": "Ethnic Studies",
      "F_ES": "Ethnic Studies",
      "1A": "English Communication",
      "1B": "Critical Thinking and Composition",
      "3A": "Arts",
      "3B": "Humanities",
      "B1": "Physical Science",
      "B2": "Life Science",
      "B3": "Science Laboratory",
      "B4": "Mathematical Concepts and Quantitative Reasoning",
      "C1": "Arts",
      "C2": "Humanities",
      "A2": "English Communication",
      "A3": "Critical Thinking and Composition",
      "5A": "Physical Science",
      "5B": "Life Science",
      "5C": "Science Laboratory",
      "D": "Social and Behavioral Sciences",
      "LD": "Lower Division"
    },
    ["Upper Division"]: {
      "UD": "Upper Division",
      "UD-3": "Upper Division Arts and Humanities",
      "C4": "Upper Division Arts and Humanities",
      "UD-4": "Upper Division Social Sciences",
      "D4": "Upper Division Social Sciences",
      "UD-5": "Upper Division Science or Mathematical Concepts/Quantitative Reasoning",
      "B6": "Upper Division Science or Mathematical Concepts/Quantitative Reasoning"
    }
  },
  ["Other"]: {
    ["American Institution Requirements"]: {
      "US1": "American Institution Requirements",
      "US2": "American Institution Requirements",
      "US3": "American Institution Requirements",
      "US12": "American Institution Requirements",
      "US13": "American Institution Requirements",
      "US23": "American Institution Requirements"
    },
    ["Second Composition"]: {
      "A4": "Second Composition",
      "2COMP": "Second Composition"
    },
    ["Diversity"]: {
      "DIV": "Diversity",
      "DM": "Diversity"
    },
    ["Social Justice"]: {
      "SJ": "Social Justice",
      "SJE": "Social Justice"
    },
    ["Sustainability"]: {
      "S": "Sustainability",
      "SUS": "Sustainability"
    },
    ["University Writing Requirement"]: {
      "UWRC": "University Writing Requirement",
    },
    ["Other"]: {
      "NTRN": "Academic Internship Course",
      "O": "Optional Service Learning Course",
      "R": "Required Service Learning Course"
    },
    ["Multiple"]: {
      // put all the ands here
    }
  }
}

export const abbreviations = {
  "2": "B4",
  "4": "D1-2",
  "D": "D1-2",
  "6": "F",
  "F_ES": "F",
  "3A": "C1",
  "3B": "C2",
  "1A": "A2",
  "1B": "A3",
  "US12": "US1&2",
  "US13": "US1&3",
  "US23": "US2&3",
  "2COMP": "A4",
  "SJE": "SJ",
  "DM": "DIV",
  "SUS": "S",
  "UWRC": "UWR",
  "5A": "B1",
  "5B": "B2",
  "5C": "B3",
  "C4": "UD-3",
  "D4": "UD-4",
  "B6": "UD-5"
}

// areas will be bg-color coded so avoid UD-... for abbreviations. have another object maps here vv
