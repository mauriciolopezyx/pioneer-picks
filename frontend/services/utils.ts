// can be used for course cards and area buttons background colors
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams as originalUseLocalSearchParams } from 'expo-router'

export const revolvingColorPalette: Record<string, string>[] = [
  {
    primary: "#000000",
    secondary: "text-white",
  },
  // Existing
  { primary: "#E74C3C", secondary: "text-white" }, // Red
  { primary: "#9B59B6", secondary: "text-white" }, // Purple
  { primary: "#3498DB", secondary: "text-white" }, // Blue
  { primary: "#1ABC9C", secondary: "text-white" }, // Teal
  { primary: "#F39C12", secondary: "text-white" }, // Orange
  { primary: "#2ECC71", secondary: "text-white" }, // Green

  // New additions
  { primary: "#E67E22", secondary: "text-white" }, // Carrot orange
  { primary: "#16A085", secondary: "text-white" }, // Deep teal
  { primary: "#8E44AD", secondary: "text-white" }, // Deep purple
  { primary: "#2980B9", secondary: "text-white" }, // Dark blue
  { primary: "#27AE60", secondary: "text-white" }, // Deep green
  { primary: "#C0392B", secondary: "text-white" }, // Dark red
  { primary: "#D35400", secondary: "text-white" }, // Pumpkin
  { primary: "#E84393", secondary: "text-white" }, // Pink
  { primary: "#F1C40F", secondary: "text-black" }, // Bright yellow
  { primary: "#F8C291", secondary: "text-black" }, // Soft peach
  { primary: "#00B894", secondary: "text-white" }, // Mint green
  { primary: "#6C5CE7", secondary: "text-white" }, // Bright violet
  { primary: "#0984E3", secondary: "text-white" }, // Strong azure blue
  { primary: "#55E6C1", secondary: "text-black" }, // Aqua mint
]

export const subjectColorMappings: Record<string, number> = {
  "biological sciences": 1,
  "chemistry": 2,
  "civil engineering": 3,
  "computer engineering": 4,
  "computer science": 5,
  "criminal justice": 6,
  "economics": 7,
  "engineering": 8,
  "english": 9,
  "ethnic studies": 10,
  "finance": 11,
  "geography": 12,
  "history": 13,
  "kinesiology": 14,
  "mathematics": 15,
  "nursing": 16,
  "physics": 17,
  "psychology": 18,
  "public health": 19,
  "statistics": 20,
  "teacher education": 0
}

export const areaColorMappings: Record<string, number> = {
  "lower division": 1,
  "upper division": 2,
  "graduate division": 3,
  "american institution requirements": 4,
  "second composition": 5,
  "diversity": 6,
  "social justice": 7,
  "sustainability": 8,
  "university writing requirement": 9,
  "miscellaneous": 10,
  "multiple": 11
}

export const areas = {
  ["General Education"]: {
    ["Lower Division"]: {
      "1A": "English Communication",
      "1B": "Critical Thinking and Composition",
      "A2": "English Communication",
      "A3": "Critical Thinking and Composition",
      "2": "Mathematical Concepts and Quantitative Reasoning",
      "4": "Social and Behavioral Sciences",
      "6": "Ethnic Studies",
      "F_ES": "Ethnic Studies",
      "3A": "Arts",
      "3B": "Humanities",
      "B1": "Physical Science",
      "B2": "Life Science",
      "B3": "Science Laboratory",
      "B4": "Mathematical Concepts and Quantitative Reasoning",
      "C1": "Arts",
      "C2": "Humanities",
      "5A": "Physical Science",
      "5B": "Life Science",
      "5C": "Science Laboratory",
      "D": "Social and Behavioral Sciences",
      "LD": "Lower Division"
    },
    ["Upper Division"]: {
      "UD": "Upper Division",
      "UD-3": "Arts and Humanities",
      "C4": "Arts and Humanities",
      "UD-4": "Social Sciences",
      "D4": "Social Sciences",
      "UD-5": "Science or Mathematical Concepts/Quant. Reasoning",
      "B6": "Science or Mathematical Concepts/Quant. Reasoning"
    },
    ["Graduate Division"]: {
      "GD": "Graduate Division"
    }
  },
  ["Other"]: {
    ["American Institution Requirements"]: {
      "US1": "American Institution Requirements 1",
      "US2": "American Institution Requirements 2",
      "US3": "American Institution Requirements 3",
      "US12": "US1 and US2",
      "US13": "US1 and US3",
      "US23": "US2 and US3"
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
    ["Miscellaneous"]: {
      "NTRN": "Academic Internship Course",
      "O": "Optional Service Learning Course",
      "R": "Required Service Learning Course"
    },
    ["Multiple"]: {
      "UD-5DIV": "UD-5 and DIV",
      "UD-5SJ": "UD-5 and SJ",
      "B6DIV": "UD-5 and DIV",
      "B6SJ": "UD-5 and SJ",
      "UD-5SUS": "UD-5 and S",
      "B6SUS": "UD-5 and S",
      "1B2COMP": "A3 and A4",
      "UD-3DIV": "UD-3 and DIV",
      "UD-3SJ": "UD-3 and SJ",
      "UD-4SJ": "UD-4 and SJ",
      "UD-4SUS": "UD-4 and S",
      "C4SJ": "UD-3 and SJ",
      "D4SJ": "UD-4 and SJ",
      "D4SUS": "UD-4 and S",
      "UD-3SUS": "UD-3 and S",
      "UD-4DIV": "UD-4 and DIV",
      "C4DIV": "UD-3 and DIV",
      "C4SUS": "UD-3 and S",
      "D4DIV": "UD-4 and DIV"
    }
  }
}

export const areaAbbreviations: Record<string, string> = {
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
  "B6": "UD-5",
  "UD-5DIV": "UD-5, DIV",
  "B6DIV": "UD-5, DIV",
  "B6SJ": "UD-5, SJ",
  "UD-5SJ": "UD-5, SJ",
  "UD-5SUS": "UD-5, S",
  "B6SUS": "UD-5, S",
  "1B2COMP": "A3, A4",
  "UD-3DIV": "UD-3, DIV",
  "UD-3SJ": "UD-3, SJ",
  "UD-4SJ": "UD-4, SJ",
  "UD-4SUS": "UD-4, S",
  "C4SJ": "UD-3, SJ",
  "D4SJ": "UD-4, SJ",
  "D4SUS": "UD-4, S",
  "UD-3SUS": "UD-3, S",
  "UD-4DIV": "UD-4, DIV",
  "C4DIV": "UD-3, DIV",
  "C4SUS": "UD-3, S",
  "D4DIV": "UD-4, DIV"
}

export const reviewOptions = {
    location: ["Online", "In-person", "Hybrid", "Cancel"],
    leniency: ["Lenient", "Slightly rigourous", "Rigourous", "Cancel"],
    assessment: ["Exam heavy", "Classwork heavy", "Balanced exams & classwork", "Cancel"],
    communication: ["Organized", "Disorganized", "Unorganized", "Cancel"],
    workload: ["<5", "5-10", "10-15", "15+"]
}

export function findAreaParentKey(
  data: any,
  targetKey: string
): string | null {
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "object" && value !== null) {
      if (Object.prototype.hasOwnProperty.call(value, targetKey)) {
        return key
      }
      const found = findAreaParentKey(value, targetKey);
      if (found) return found;
    }
  }
  return null
}

export const subjectIconMappings: Record<string, keyof typeof Ionicons.glyphMap> = {
  All: "globe-outline",
  "Biological Sciences": "flask-outline",
  "Chemistry": "flask-outline",
  "Civil Engineering": "pencil-outline",
  "Computer Engineering": "server-outline",
  "Criminal Justice": "search-outline",
  "Economics": "trending-up-outline",
  "Engineering": "pencil-outline",
  "Ethnic Studies": "search-outline",
  "Finance": "cash-outline",
  "Geography": "earth-outline",
  "History": "hourglass-outline",
  "Kinesiology": "body-outline",
  "Mathematics": "calculator-outline",
  "Nursing": "medkit-outline",
  "Psychology": "man-outline",
  "Public Health": "medkit-outline",
  "Statistics": "stats-chart-outline",
  "Teacher Education": "chatbubbles-outline",
  English: "book-outline",
  Math: "calculator-outline",
  Physics: "flask-outline",
  "Computer Science": "laptop-outline"
};

export function useParsedLocalSearchParams<TParsed>(parser: (raw: Record<string, string | undefined>) => TParsed): TParsed {
  const rawParams = originalUseLocalSearchParams() as Record<string, string | undefined>;
  return parser(rawParams);
}