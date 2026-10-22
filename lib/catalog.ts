export const categories = [
  "All ingredients",
  "Popping boba",
  "Core ingredients",
  "Powders",
] as const;
export type Category = (typeof categories)[number];
export const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
export type Product = {
  id: string;
  name: string;
  ar: string;
  category: Exclude<Category, "All ingredients">;
  weight: string;
  carton: number;
  color: string;
  note: string;
};
export const products: Product[] = [
  {
    id: "130600912",
    name: "Mango",
    ar: "مانجو",
    category: "Popping boba",
    weight: "1.2 kg",
    carton: 12,
    color: "#f6d7a7",
    note: "A sunshine state of mind.",
  },
  {
    id: "130600913",
    name: "Green Apple",
    ar: "تفاح أخضر",
    category: "Popping boba",
    weight: "1.2 kg",
    carton: 12,
    color: "#dfe9c8",
    note: "A little tart. A lot of character.",
  },
  {
    id: "130600914",
    name: "Lychee",
    ar: "ليتشي",
    category: "Popping boba",
    weight: "1.2 kg",
    carton: 12,
    color: "#f1dce4",
    note: "A floral twist for your next favourite.",
  },
  {
    id: "130600910",
    name: "Strawberry",
    ar: "فراولة",
    category: "Popping boba",
    weight: "1.2 kg",
    carton: 12,
    color: "#f5d1c9",
    note: "The bright side of every sip.",
  },
  {
    id: "130600911",
    name: "Passion Fruit",
    ar: "باشن فروت",
    category: "Popping boba",
    weight: "1.2 kg",
    carton: 12,
    color: "#f1e4ad",
    note: "Bring a tropical twist to the menu.",
  },

  {
    id: "130600908",
    name: "Blueberry",
    ar: "توت أزرق",
    category: "Popping boba",
    weight: "1.2 kg",
    carton: 12,
    color: "#d9dcee",
    note: "Deep colour. Bright possibilities.",
  },
  {
    id: "130600915",
    name: "Peach",
    ar: "خوخ",
    category: "Popping boba",
    weight: "1.2 kg",
    carton: 12,
    color: "#f3d8cb",
    note: "A soft, summery finishing touch.",
  },
  {
    id: "130500521",
    name: "Black Tapioca Pearls",
    ar: "لؤلؤ التابيوكا السوداء",
    category: "Core ingredients",
    weight: "1 kg",
    carton: 20,
    color: "#ded4c8",
    note: "The classic at the heart of bubble tea.",
  },
  {
    id: "132100600",
    name: "Brown Sugar Flavored Syrup",
    ar: "سيرب بنكهة السكر البني",
    category: "Core ingredients",
    weight: "2 L (2.5 kg)",
    carton: 8,
    color: "#f0d2ae",
    note: "Build your signature brown-sugar drink.",
  },
  {
    id: "130401971",
    name: "Non-Dairy Creamer C92",
    ar: "مبيض غير لبني C92",
    category: "Powders",
    weight: "1 kg",
    carton: 20,
    color: "#d6e7e3",
    note: "A foundation for your beverage menu.",
  },
  {
    id: "130201334",
    name: "Signature Matcha",
    ar: "ماتشا سيجنتشر",
    category: "Powders",
    weight: "1 kg",
    carton: 20,
    color: "#dce4cb",
    note: "Make room for a green favourite.",
  },
  {
    id: "130201335",
    name: "Taro Flavored Powder",
    ar: "بودرة بنكهة التارو",
    category: "Powders",
    weight: "1 kg",
    carton: 20,
    color: "#e4d9ec",
    note: "A purple possibility for your menu.",
  },
];
export const whatsapp = (message: string) =>
  `https://wa.me/201097477503?text=${encodeURIComponent(message)}`;
