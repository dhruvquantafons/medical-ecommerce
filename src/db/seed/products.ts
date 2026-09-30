import type { Product, ProductForm } from "@/data/types";

// Demo catalogue used by `npm run db:seed`. Prices, ratings and stock are illustrative only.

type Seed = {
  name: string;
  brand: string;
  manufacturer: string;
  cat: string;
  form: ProductForm;
  pack: string;
  mrp: number;
  price: number;
  rx?: boolean;
  comp: string;
  desc?: string;
  uses?: string[];
  side?: string[];
  how?: string;
  tags: string[];
  rating?: number;
  reviews?: number;
  oos?: boolean;
};

const defaults: Record<string, Pick<Product, "uses" | "sideEffects" | "howToUse" | "safetyAdvice" | "storage">> = {
  medicine: {
    uses: ["As directed by your physician"],
    sideEffects: ["Nausea", "Headache", "Dizziness", "Stomach upset"],
    howToUse: "Take this medicine in the dose and duration advised by your doctor. Swallow it whole with water. Do not chew, crush or break it.",
    safetyAdvice: [
      "Alcohol: consult your doctor before consuming alcohol with this medicine.",
      "Pregnancy: consult your doctor before use.",
      "Driving: may cause dizziness in some patients; do not drive if affected.",
      "Kidney/Liver: use with caution; dose adjustment may be needed.",
    ],
    storage: "Store below 30°C in a cool, dry place away from direct sunlight.",
  },
  general: {
    uses: ["For daily health and wellness"],
    sideEffects: ["Generally well tolerated; discontinue if irritation occurs"],
    howToUse: "Read the label carefully before use and follow the instructions on the pack.",
    safetyAdvice: ["Keep out of reach of children.", "For external use only unless stated otherwise.", "Consult a doctor if symptoms persist."],
    storage: "Store in a cool, dry place away from direct sunlight.",
  },
};

const seeds: Seed[] = [
  // ---- Medicines: fever & pain (paracetamol 650 substitutes)
  { name: "Dolo 650 Tablet", brand: "Dolo", manufacturer: "Micro Labs Ltd", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 33.6, price: 30.24, comp: "Paracetamol (650mg)", desc: "Dolo 650 Tablet is a pain-relieving and fever-reducing medicine used to treat mild to moderate pain and fever.", uses: ["Fever", "Headache", "Body pain", "Toothache", "Menstrual cramps"], side: ["Nausea", "Stomach pain", "Rare allergic reactions"], tags: ["fever", "pain"], rating: 4.6, reviews: 18230 },
  { name: "Crocin 650 Advance Tablet", brand: "Crocin", manufacturer: "GSK Consumer Healthcare", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 34.56, price: 31.1, comp: "Paracetamol (650mg)", desc: "Crocin 650 Advance provides fast relief from fever and pain with Optizorb technology.", uses: ["Fever", "Headache", "Body pain"], side: ["Nausea", "Rash (rare)"], tags: ["fever", "pain"], rating: 4.5, reviews: 9412 },
  { name: "Calpol 650 Tablet", brand: "Calpol", manufacturer: "GSK Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 32.1, price: 27.29, comp: "Paracetamol (650mg)", uses: ["Fever", "Pain relief"], side: ["Nausea", "Rash (rare)"], tags: ["fever", "pain"], rating: 4.4, reviews: 3120 },
  { name: "Pacimol 650 Tablet", brand: "Pacimol", manufacturer: "Ipca Laboratories", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 24.75, price: 19.8, comp: "Paracetamol (650mg)", uses: ["Fever", "Pain relief"], side: ["Nausea"], tags: ["fever", "pain"], rating: 4.3, reviews: 1204 },
  { name: "Combiflam Tablet", brand: "Combiflam", manufacturer: "Sanofi India Ltd", cat: "medicines", form: "tablet", pack: "Strip of 20 tablets", mrp: 48.5, price: 43.65, comp: "Ibuprofen (400mg) + Paracetamol (325mg)", uses: ["Pain relief", "Fever", "Muscle pain", "Joint pain"], side: ["Heartburn", "Nausea", "Stomach pain"], tags: ["fever", "pain"], rating: 4.5, reviews: 7021 },
  { name: "Volini Pain Relief Spray", brand: "Volini", manufacturer: "Sun Pharmaceutical Industries", cat: "medicines", form: "bottle", pack: "Bottle of 55 g spray", mrp: 215, price: 182.75, comp: "Diclofenac + Methyl Salicylate + Menthol + Linseed Oil", uses: ["Back pain", "Neck pain", "Sprains", "Muscle pain"], side: ["Skin irritation", "Redness"], how: "Shake well and spray on the affected area from a distance of 10–15 cm, 3–4 times a day.", tags: ["pain", "bone"], rating: 4.4, reviews: 5320 },

  // ---- Medicines: acidity (pantoprazole 40 substitutes)
  { name: "Pan 40 Tablet", brand: "Pan", manufacturer: "Alkem Laboratories Ltd", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 225.5, price: 191.68, rx: true, comp: "Pantoprazole (40mg)", desc: "Pan 40 Tablet reduces the amount of acid produced in the stomach and is used to treat acidity and ulcers.", uses: ["Acidity", "GERD", "Peptic ulcer", "Zollinger-Ellison syndrome"], side: ["Headache", "Diarrhoea", "Flatulence", "Stomach pain"], how: "Take it on an empty stomach, preferably one hour before a meal.", tags: ["stomach"], rating: 4.5, reviews: 6230 },
  { name: "Pantocid 40 Tablet", brand: "Pantocid", manufacturer: "Sun Pharmaceutical Industries", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 239.4, price: 203.49, rx: true, comp: "Pantoprazole (40mg)", uses: ["Acidity", "GERD", "Peptic ulcer"], side: ["Headache", "Diarrhoea", "Nausea"], how: "Take it on an empty stomach, preferably one hour before a meal.", tags: ["stomach"], rating: 4.4, reviews: 2410 },
  { name: "Pantop 40 Tablet", brand: "Pantop", manufacturer: "Aristo Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 150.2, price: 112.65, rx: true, comp: "Pantoprazole (40mg)", uses: ["Acidity", "GERD"], side: ["Headache", "Diarrhoea"], tags: ["stomach"], rating: 4.2, reviews: 804 },
  { name: "Digene Acidity & Gas Relief Gel (Mint)", brand: "Digene", manufacturer: "Abbott", cat: "medicines", form: "syrup", pack: "Bottle of 450 ml gel", mrp: 234, price: 210.6, comp: "Magnesium Hydroxide + Aluminium Hydroxide + Simethicone", uses: ["Acidity", "Heartburn", "Gas", "Indigestion"], side: ["Constipation", "Diarrhoea"], how: "Take 2–4 teaspoons after meals and at bedtime, or as directed.", tags: ["stomach"], rating: 4.5, reviews: 4312 },
  { name: "ENO Fruit Salt Lemon", brand: "ENO", manufacturer: "GSK Consumer Healthcare", cat: "medicines", form: "powder", pack: "Pack of 6 sachets of 5 g", mrp: 60, price: 57, comp: "Sodium Bicarbonate + Citric Acid + Sodium Carbonate", uses: ["Acidity", "Heartburn", "Indigestion"], side: ["Bloating (rare)"], how: "Mix one sachet in a glass of water and drink immediately while fizzing.", tags: ["stomach"], rating: 4.6, reviews: 11204 },

  // ---- Medicines: cold & allergy
  { name: "Montair LC Tablet", brand: "Montair", manufacturer: "Cipla Ltd", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 267.8, price: 227.63, rx: true, comp: "Levocetirizine (5mg) + Montelukast (10mg)", uses: ["Allergic rhinitis", "Sneezing", "Runny nose", "Itchy eyes"], side: ["Drowsiness", "Dry mouth", "Headache", "Fatigue"], how: "Take it in the evening, with or without food.", tags: ["cold"], rating: 4.5, reviews: 3890 },
  { name: "Montek LC Tablet", brand: "Montek", manufacturer: "Sun Pharmaceutical Industries", cat: "medicines", form: "tablet", pack: "Strip of 10 tablets", mrp: 185.5, price: 148.4, rx: true, comp: "Levocetirizine (5mg) + Montelukast (10mg)", uses: ["Allergic rhinitis", "Sneezing"], side: ["Drowsiness", "Headache"], tags: ["cold"], rating: 4.4, reviews: 1672 },
  { name: "Okacet Tablet", brand: "Okacet", manufacturer: "Cipla Ltd", cat: "medicines", form: "tablet", pack: "Strip of 10 tablets", mrp: 20.5, price: 18.45, comp: "Cetirizine (10mg)", uses: ["Sneezing", "Runny nose", "Itching", "Hives"], side: ["Sleepiness", "Dry mouth", "Fatigue"], tags: ["cold"], rating: 4.4, reviews: 2140 },
  { name: "Cetzine Tablet", brand: "Cetzine", manufacturer: "Alkem Laboratories Ltd", cat: "medicines", form: "tablet", pack: "Strip of 10 tablets", mrp: 19.8, price: 15.84, comp: "Cetirizine (10mg)", uses: ["Sneezing", "Runny nose", "Itching"], side: ["Sleepiness", "Dry mouth"], tags: ["cold"], rating: 4.3, reviews: 911 },
  { name: "Benadryl Cough Syrup", brand: "Benadryl", manufacturer: "Johnson & Johnson", cat: "medicines", form: "syrup", pack: "Bottle of 150 ml syrup", mrp: 135, price: 121.5, comp: "Diphenhydramine + Ammonium Chloride + Sodium Citrate + Menthol", uses: ["Cough", "Throat irritation", "Congestion"], side: ["Drowsiness", "Dizziness"], how: "Take 10 ml three times a day or as directed by a physician.", tags: ["cold"], rating: 4.3, reviews: 3601 },
  { name: "Vicks Vaporub", brand: "Vicks", manufacturer: "Procter & Gamble", cat: "medicines", form: "cream", pack: "Jar of 50 ml balm", mrp: 165, price: 156.75, comp: "Menthol + Camphor + Eucalyptus Oil", uses: ["Nasal congestion", "Cough", "Headache", "Body ache"], side: ["Skin irritation (rare)"], how: "Rub on chest, throat and back. Do not use in the nostrils.", tags: ["cold"], rating: 4.7, reviews: 15020 },

  // ---- Medicines: antibiotics
  { name: "Azithral 500 Tablet", brand: "Azithral", manufacturer: "Alembic Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 5 tablets", mrp: 132.3, price: 112.46, rx: true, comp: "Azithromycin (500mg)", desc: "Azithral 500 is an antibiotic used to treat bacterial infections of the respiratory tract, ear, skin and eyes.", uses: ["Respiratory tract infections", "Ear infections", "Skin infections", "Typhoid"], side: ["Nausea", "Vomiting", "Diarrhoea", "Stomach pain"], how: "Take it at a fixed time, 1 hour before or 2 hours after food. Complete the full course.", tags: ["infection"], rating: 4.4, reviews: 5120 },
  { name: "Azee 500 Tablet", brand: "Azee", manufacturer: "Cipla Ltd", cat: "medicines", form: "tablet", pack: "Strip of 5 tablets", mrp: 119.5, price: 95.6, rx: true, comp: "Azithromycin (500mg)", uses: ["Respiratory tract infections", "Skin infections"], side: ["Nausea", "Diarrhoea"], tags: ["infection"], rating: 4.3, reviews: 2210 },
  { name: "Augmentin 625 Duo Tablet", brand: "Augmentin", manufacturer: "GSK Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 10 tablets", mrp: 223.4, price: 201.06, rx: true, comp: "Amoxycillin (500mg) + Clavulanic Acid (125mg)", uses: ["Bacterial infections", "Sinusitis", "Urinary tract infections"], side: ["Diarrhoea", "Nausea", "Skin rash"], tags: ["infection"], rating: 4.4, reviews: 3310 },

  // ---- Medicines: heart & BP
  { name: "Telma 40 Tablet", brand: "Telma", manufacturer: "Glenmark Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 30 tablets", mrp: 284.7, price: 242, rx: true, comp: "Telmisartan (40mg)", desc: "Telma 40 Tablet is used to treat high blood pressure and to reduce the risk of heart attack and stroke.", uses: ["Hypertension", "Prevention of heart attack and stroke"], side: ["Dizziness", "Back pain", "Sinus inflammation", "Diarrhoea"], tags: ["heart", "bp"], rating: 4.5, reviews: 2890 },
  { name: "Telmikind 40 Tablet", brand: "Telmikind", manufacturer: "Mankind Pharma Ltd", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 98.2, price: 73.65, rx: true, comp: "Telmisartan (40mg)", uses: ["Hypertension"], side: ["Dizziness", "Back pain"], tags: ["heart", "bp"], rating: 4.3, reviews: 740 },
  { name: "Atorva 10 Tablet", brand: "Atorva", manufacturer: "Zydus Cadila", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 138.6, price: 117.81, rx: true, comp: "Atorvastatin (10mg)", uses: ["High cholesterol", "Prevention of heart disease"], side: ["Muscle pain", "Constipation", "Nausea"], tags: ["heart"], rating: 4.4, reviews: 1320 },
  { name: "Lipvas 10 Tablet", brand: "Lipvas", manufacturer: "Cipla Ltd", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 118.5, price: 94.8, rx: true, comp: "Atorvastatin (10mg)", uses: ["High cholesterol"], side: ["Muscle pain", "Nausea"], tags: ["heart"], rating: 4.2, reviews: 412 },
  { name: "Ecosprin 75 Tablet", brand: "Ecosprin", manufacturer: "USV Ltd", cat: "medicines", form: "tablet", pack: "Strip of 14 tablets", mrp: 5.2, price: 4.94, rx: true, comp: "Aspirin (75mg)", uses: ["Prevention of heart attack", "Prevention of stroke"], side: ["Stomach irritation", "Bleeding risk"], tags: ["heart"], rating: 4.6, reviews: 4050 },

  // ---- Medicines: diabetes Rx (metformin substitutes)
  { name: "Glycomet 500 SR Tablet", brand: "Glycomet", manufacturer: "USV Ltd", cat: "medicines", form: "tablet", pack: "Strip of 20 tablets", mrp: 36.4, price: 30.94, rx: true, comp: "Metformin (500mg)", desc: "Glycomet 500 SR helps control blood sugar levels in people with type 2 diabetes.", uses: ["Type 2 diabetes mellitus"], side: ["Nausea", "Taste change", "Diarrhoea", "Stomach pain"], how: "Take it with or after meals to reduce stomach upset.", tags: ["diabetes"], rating: 4.5, reviews: 3812 },
  { name: "Glyciphage 500 Tablet", brand: "Glyciphage", manufacturer: "Franco-Indian Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 20 tablets", mrp: 29.5, price: 22.13, rx: true, comp: "Metformin (500mg)", uses: ["Type 2 diabetes mellitus"], side: ["Nausea", "Diarrhoea"], tags: ["diabetes"], rating: 4.3, reviews: 1020 },
  { name: "Janumet 50/500 Tablet", brand: "Janumet", manufacturer: "MSD Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 489.6, price: 430.85, rx: true, comp: "Sitagliptin (50mg) + Metformin (500mg)", uses: ["Type 2 diabetes mellitus"], side: ["Hypoglycemia", "Headache", "Nausea"], tags: ["diabetes"], rating: 4.4, reviews: 870 },

  // ---- Medicines: thyroid & others
  { name: "Thyronorm 50mcg Tablet", brand: "Thyronorm", manufacturer: "Abbott", cat: "medicines", form: "bottle", pack: "Bottle of 120 tablets", mrp: 214, price: 181.9, rx: true, comp: "Thyroxine (50mcg)", uses: ["Hypothyroidism"], side: ["Weight loss", "Palpitations", "Sweating"], how: "Take on an empty stomach in the morning, 30–60 minutes before breakfast.", tags: ["thyroid"], rating: 4.6, reviews: 5210 },
  { name: "Shelcal 500 Tablet", brand: "Shelcal", manufacturer: "Torrent Pharmaceuticals", cat: "medicines", form: "tablet", pack: "Strip of 15 tablets", mrp: 127.5, price: 108.38, comp: "Calcium Carbonate (1250mg) + Vitamin D3 (250 IU)", uses: ["Calcium deficiency", "Osteoporosis", "Bone health"], side: ["Constipation", "Bloating"], tags: ["bone"], rating: 4.5, reviews: 6780 },
  { name: "Ondem 4 Tablet", brand: "Ondem", manufacturer: "Alkem Laboratories Ltd", cat: "medicines", form: "tablet", pack: "Strip of 10 tablets", mrp: 55.2, price: 46.92, rx: true, comp: "Ondansetron (4mg)", uses: ["Nausea", "Vomiting"], side: ["Headache", "Constipation"], tags: ["stomach"], rating: 4.4, reviews: 1290 },
  { name: "Electral ORS Powder (Orange)", brand: "Electral", manufacturer: "FDC Ltd", cat: "medicines", form: "powder", pack: "Sachet of 21.8 g powder", mrp: 22, price: 21.12, comp: "Oral Rehydration Salts", uses: ["Dehydration", "Diarrhoea", "Heat exhaustion"], side: ["Vomiting (if taken too fast)"], how: "Dissolve one sachet in 1 litre of clean drinking water. Use within 24 hours.", tags: ["stomach"], rating: 4.6, reviews: 8920 },

  // ---- Healthcare devices
  { name: "Omron HEM 7120 Fully Automatic Digital BP Monitor", brand: "Omron", manufacturer: "Omron Healthcare", cat: "healthcare-devices", form: "device", pack: "Box of 1 device", mrp: 2800, price: 1899, comp: "Upper-arm blood pressure monitor with IntelliSense technology", uses: ["Measuring blood pressure at home", "Detecting irregular heartbeat"], how: "Wrap the cuff on your upper arm at heart level, sit still and press START.", tags: ["heart", "bp", "device"], rating: 4.5, reviews: 12040 },
  { name: "Dr. Morepen BP-02 Blood Pressure Monitor", brand: "Dr. Morepen", manufacturer: "Morepen Laboratories", cat: "healthcare-devices", form: "device", pack: "Box of 1 device", mrp: 2500, price: 1249, comp: "Automatic upper-arm BP monitor with 60 memory slots", uses: ["Measuring blood pressure at home"], tags: ["heart", "bp", "device"], rating: 4.2, reviews: 3210 },
  { name: "Accu-Chek Active Glucometer Kit", brand: "Accu-Chek", manufacturer: "Roche Diabetes Care", cat: "healthcare-devices", form: "device", pack: "Kit with 10 free strips", mrp: 1699, price: 1189, comp: "Blood glucose meter + lancing device + 10 test strips", uses: ["Monitoring blood sugar levels at home"], tags: ["diabetes", "device"], rating: 4.4, reviews: 7420 },
  { name: "Dr. Trust Fingertip Pulse Oximeter", brand: "Dr. Trust", manufacturer: "Dr. Trust (Nureca)", cat: "healthcare-devices", form: "device", pack: "Box of 1 device", mrp: 3000, price: 1349, comp: "SpO2 and pulse-rate monitor with OLED display", uses: ["Measuring blood oxygen (SpO2)", "Measuring pulse rate"], tags: ["device", "covid"], rating: 4.3, reviews: 5590 },
  { name: "Omron MC 246 Digital Thermometer", brand: "Omron", manufacturer: "Omron Healthcare", cat: "healthcare-devices", form: "device", pack: "Box of 1 device", mrp: 250, price: 199, comp: "Digital thermometer with 1-minute reading", uses: ["Measuring body temperature"], tags: ["fever", "device"], rating: 4.4, reviews: 8804 },
  { name: "Omron NE C101 Compressor Nebulizer", brand: "Omron", manufacturer: "Omron Healthcare", cat: "healthcare-devices", form: "device", pack: "Box of 1 device", mrp: 2640, price: 1790, comp: "Compressor nebulizer with adult and child masks", uses: ["Asthma", "COPD", "Respiratory conditions"], tags: ["cold", "device"], rating: 4.3, reviews: 2102 },
  { name: "Tynor Knee Cap Comfeel (Medium)", brand: "Tynor", manufacturer: "Tynor Orthotics", cat: "healthcare-devices", form: "pack", pack: "Pair of 2", mrp: 450, price: 405, comp: "Four-way stretch knee support", uses: ["Knee pain", "Arthritis support", "Sports injuries"], tags: ["bone"], rating: 4.2, reviews: 1830, oos: true },

  // ---- Vitamins & supplements
  { name: "Revital H Capsules for Men", brand: "Revital", manufacturer: "Sun Pharmaceutical Industries", cat: "vitamins-supplements", form: "bottle", pack: "Bottle of 30 capsules", mrp: 360, price: 306, comp: "Ginseng + Multivitamins + Minerals", uses: ["Daily energy", "Stamina", "Immunity"], tags: ["immunity", "vitamins"], rating: 4.4, reviews: 9021 },
  { name: "Becosules Capsule", brand: "Becosules", manufacturer: "Pfizer Ltd", cat: "vitamins-supplements", form: "capsule", pack: "Strip of 20 capsules", mrp: 51.2, price: 46.08, comp: "Vitamin B-Complex + Vitamin C", uses: ["Vitamin B deficiency", "Mouth ulcers", "Weakness"], tags: ["vitamins", "immunity"], rating: 4.6, reviews: 12510 },
  { name: "Limcee Vitamin C 500mg Chewable Tablet", brand: "Limcee", manufacturer: "Abbott", cat: "vitamins-supplements", form: "tablet", pack: "Strip of 15 tablets", mrp: 25.5, price: 24.23, comp: "Vitamin C (500mg)", uses: ["Immunity", "Vitamin C deficiency", "Skin health"], tags: ["immunity", "vitamins"], rating: 4.6, reviews: 10330 },
  { name: "Ensure Diabetes Care Vanilla Powder", brand: "Ensure", manufacturer: "Abbott", cat: "vitamins-supplements", form: "powder", pack: "Jar of 400 g powder", mrp: 799, price: 719, comp: "Complete balanced nutrition with Triple Care system", uses: ["Nutrition for diabetics", "Blood sugar management"], tags: ["diabetes", "nutrition"], rating: 4.3, reviews: 2811 },
  { name: "Protinex Original Powder", brand: "Protinex", manufacturer: "Danone Nutricia", cat: "vitamins-supplements", form: "powder", pack: "Jar of 250 g powder", mrp: 440, price: 374, comp: "Protein + 13 vitamins and minerals", uses: ["Daily protein intake", "Muscle strength"], tags: ["nutrition"], rating: 4.3, reviews: 3410 },
  { name: "Seven Seas Original Cod Liver Oil Capsules", brand: "Seven Seas", manufacturer: "Merck", cat: "vitamins-supplements", form: "bottle", pack: "Bottle of 100 capsules", mrp: 445, price: 378.25, comp: "Omega-3 + Vitamin A + Vitamin D", uses: ["Heart health", "Joint health", "Brain health"], tags: ["heart", "bone", "vitamins"], rating: 4.4, reviews: 2204 },
  { name: "Himalaya Ashvagandha Tablets", brand: "Himalaya", manufacturer: "Himalaya Wellness", cat: "vitamins-supplements", form: "bottle", pack: "Bottle of 60 tablets", mrp: 225, price: 202.5, comp: "Ashwagandha root extract (250mg)", uses: ["Stress relief", "Energy", "Sleep quality"], tags: ["immunity"], rating: 4.4, reviews: 6120 },

  // ---- Diabetes care
  { name: "Accu-Chek Active Test Strips", brand: "Accu-Chek", manufacturer: "Roche Diabetes Care", cat: "diabetes-care", form: "pack", pack: "Box of 50 strips", mrp: 1150, price: 977.5, comp: "Blood glucose test strips", uses: ["Blood sugar testing with Accu-Chek Active meter"], tags: ["diabetes"], rating: 4.6, reviews: 9420 },
  { name: "Dr. Morepen BG-03 Test Strips", brand: "Dr. Morepen", manufacturer: "Morepen Laboratories", cat: "diabetes-care", form: "pack", pack: "Box of 50 strips", mrp: 1099, price: 549, comp: "Blood glucose test strips", uses: ["Blood sugar testing with Dr. Morepen meter"], tags: ["diabetes"], rating: 4.3, reviews: 3120 },
  { name: "Sugar Free Gold Sweetener Pellets", brand: "Sugar Free", manufacturer: "Zydus Wellness", cat: "diabetes-care", form: "pack", pack: "Pack of 500 pellets", mrp: 190, price: 171, comp: "Aspartame", uses: ["Low-calorie sugar substitute"], tags: ["diabetes"], rating: 4.4, reviews: 4230 },
  { name: "Accu-Chek Softclix Lancets", brand: "Accu-Chek", manufacturer: "Roche Diabetes Care", cat: "diabetes-care", form: "pack", pack: "Box of 100 lancets", mrp: 520, price: 442, comp: "Sterile lancets for Softclix device", uses: ["Blood sampling for glucose testing"], tags: ["diabetes"], rating: 4.5, reviews: 2130 },
  { name: "Diabetic Karela Jamun Juice", brand: "Kapiva", manufacturer: "Kapiva Ayurveda", cat: "diabetes-care", form: "bottle", pack: "Bottle of 1 litre juice", mrp: 499, price: 399, comp: "Karela + Jamun + Amla", uses: ["Supports healthy blood sugar levels"], tags: ["diabetes"], rating: 4.1, reviews: 1820 },

  // ---- Personal care
  { name: "Dettol Original Liquid Handwash Refill", brand: "Dettol", manufacturer: "Reckitt Benckiser", cat: "personal-care", form: "pack", pack: "Pouch of 675 ml", mrp: 129, price: 109, comp: "Chloroxylenol-based antibacterial handwash", uses: ["Hand hygiene", "Protection from germs"], tags: ["hygiene"], rating: 4.6, reviews: 20410 },
  { name: "Sensodyne Rapid Relief Toothpaste", brand: "Sensodyne", manufacturer: "Haleon", cat: "personal-care", form: "pack", pack: "Tube of 80 g", mrp: 205, price: 194.75, comp: "Stannous Fluoride", uses: ["Sensitive teeth relief", "Cavity protection"], tags: ["oral"], rating: 4.6, reviews: 8120 },
  { name: "Whisper Ultra Clean Sanitary Pads (XL+)", brand: "Whisper", manufacturer: "Procter & Gamble", cat: "personal-care", form: "pack", pack: "Pack of 30 pads", mrp: 399, price: 339, comp: "Sanitary napkins with wings", uses: ["Menstrual hygiene"], tags: ["hygiene", "women"], rating: 4.5, reviews: 15310 },
  { name: "Listerine Cool Mint Mouthwash", brand: "Listerine", manufacturer: "Johnson & Johnson", cat: "personal-care", form: "bottle", pack: "Bottle of 250 ml", mrp: 165, price: 140.25, comp: "Essential oils (Eucalyptol, Menthol, Thymol)", uses: ["Fresh breath", "Plaque control"], tags: ["oral"], rating: 4.5, reviews: 6120 },
  { name: "Savlon Antiseptic Liquid", brand: "Savlon", manufacturer: "ITC Ltd", cat: "personal-care", form: "bottle", pack: "Bottle of 500 ml", mrp: 205, price: 184.5, comp: "Chlorhexidine Gluconate + Cetrimide", uses: ["First aid", "Wound cleaning", "Personal hygiene"], tags: ["hygiene"], rating: 4.6, reviews: 5020 },

  // ---- Skin care
  { name: "Cetaphil Gentle Skin Cleanser", brand: "Cetaphil", manufacturer: "Galderma", cat: "skin-care", form: "bottle", pack: "Bottle of 250 ml", mrp: 1075, price: 913.75, comp: "Soap-free gentle cleanser", uses: ["Daily face and body cleansing", "Sensitive and dry skin"], tags: ["skin"], rating: 4.6, reviews: 9910 },
  { name: "Cetaphil Moisturising Cream", brand: "Cetaphil", manufacturer: "Galderma", cat: "skin-care", form: "cream", pack: "Tub of 80 g", mrp: 765, price: 650.25, comp: "Sweet almond oil + Vitamin E + Glycerin", uses: ["Dry skin", "Moisturisation"], tags: ["skin"], rating: 4.5, reviews: 4020 },
  { name: "Neutrogena Ultra Sheer Sunscreen SPF 50+", brand: "Neutrogena", manufacturer: "Johnson & Johnson", cat: "skin-care", form: "cream", pack: "Tube of 88 ml", mrp: 699, price: 594.15, comp: "Broad-spectrum UVA/UVB sunscreen", uses: ["Sun protection", "Prevention of tanning"], tags: ["skin"], rating: 4.4, reviews: 7210 },
  { name: "Candid Dusting Powder", brand: "Candid", manufacturer: "Glenmark Pharmaceuticals", cat: "skin-care", form: "powder", pack: "Bottle of 100 g powder", mrp: 145, price: 130.5, comp: "Clotrimazole (1% w/w)", uses: ["Fungal skin infections", "Prickly heat", "Excessive sweating"], tags: ["skin", "infection"], rating: 4.5, reviews: 6230 },
  { name: "Boroline Antiseptic Cream", brand: "Boroline", manufacturer: "G.D. Pharmaceuticals", cat: "skin-care", form: "cream", pack: "Tube of 20 g", mrp: 50, price: 47.5, comp: "Boric acid + Zinc oxide", uses: ["Cracked lips and heels", "Minor cuts", "Dry skin"], tags: ["skin"], rating: 4.6, reviews: 5610 },

  // ---- Ayurveda
  { name: "Dabur Chyawanprash", brand: "Dabur", manufacturer: "Dabur India Ltd", cat: "ayurveda", form: "bottle", pack: "Jar of 1 kg", mrp: 399, price: 359.1, comp: "Amla + 40 Ayurvedic herbs", uses: ["Immunity", "Strength and stamina"], tags: ["immunity"], rating: 4.6, reviews: 14320 },
  { name: "Himalaya Liv.52 Tablets", brand: "Himalaya", manufacturer: "Himalaya Wellness", cat: "ayurveda", form: "bottle", pack: "Bottle of 100 tablets", mrp: 185, price: 166.5, comp: "Himsra + Kasani + Mandur bhasma", uses: ["Liver health", "Appetite", "Digestion"], tags: ["stomach"], rating: 4.5, reviews: 8810 },
  { name: "Patanjali Divya Swasari Pravahi", brand: "Patanjali", manufacturer: "Divya Pharmacy", cat: "ayurveda", form: "syrup", pack: "Bottle of 250 ml", mrp: 110, price: 104.5, comp: "Tulsi + Mulethi + Vasa + other herbs", uses: ["Cough", "Cold", "Throat irritation"], tags: ["cold"], rating: 4.2, reviews: 1320 },
  { name: "Dabur Honitus Cough Syrup", brand: "Dabur", manufacturer: "Dabur India Ltd", cat: "ayurveda", form: "syrup", pack: "Bottle of 100 ml", mrp: 105, price: 94.5, comp: "Honey + Tulsi + Mulethi + Banafsha", uses: ["Cough", "Sore throat"], tags: ["cold"], rating: 4.4, reviews: 3910 },
  { name: "Zandu Balm", brand: "Zandu", manufacturer: "Emami Ltd", cat: "ayurveda", form: "cream", pack: "Jar of 25 ml", mrp: 132, price: 118.8, comp: "Pudina ke phool + Gandhapura taila + Karpura", uses: ["Headache", "Body ache", "Cold"], tags: ["pain", "cold"], rating: 4.6, reviews: 7730 },
  { name: "Kottakkal Mahanarayana Thailam", brand: "Kottakkal", manufacturer: "Arya Vaidya Sala", cat: "ayurveda", form: "bottle", pack: "Bottle of 200 ml", mrp: 295, price: 280.25, comp: "Ayurvedic medicated oil", uses: ["Joint pain", "Muscle stiffness"], tags: ["bone", "pain"], rating: 4.4, reviews: 820 },

  // ---- Baby & mom care
  { name: "Pampers All Round Protection Pants (M)", brand: "Pampers", manufacturer: "Procter & Gamble", cat: "baby-mom-care", form: "pack", pack: "Pack of 76 diapers", mrp: 1599, price: 1119.3, comp: "Diaper pants with lotion and aloe vera", uses: ["Up to 12 hours dryness for babies 7–12 kg"], tags: ["baby"], rating: 4.5, reviews: 18720 },
  { name: "Johnson's Baby Oil", brand: "Johnson's", manufacturer: "Johnson & Johnson", cat: "baby-mom-care", form: "bottle", pack: "Bottle of 200 ml", mrp: 265, price: 238.5, comp: "Mineral oil + Vitamin E", uses: ["Baby massage", "Moisturisation"], tags: ["baby"], rating: 4.5, reviews: 6830 },
  { name: "Himalaya Diaper Rash Cream", brand: "Himalaya", manufacturer: "Himalaya Wellness", cat: "baby-mom-care", form: "cream", pack: "Tube of 50 g", mrp: 135, price: 121.5, comp: "Aloe vera + Almond oil + Yashada bhasma", uses: ["Diaper rash", "Skin irritation"], tags: ["baby", "skin"], rating: 4.4, reviews: 4120 },
  { name: "Cerelac Wheat Apple Cherry (8 months+)", brand: "Nestle", manufacturer: "Nestle India", cat: "baby-mom-care", form: "pack", pack: "Pack of 300 g", mrp: 290, price: 281.3, comp: "Wheat + fruits + milk + iron", uses: ["Infant nutrition for 8 months+"], tags: ["baby", "nutrition"], rating: 4.5, reviews: 5430 },
  { name: "Mother's Horlicks Vanilla", brand: "Horlicks", manufacturer: "Hindustan Unilever", cat: "baby-mom-care", form: "powder", pack: "Jar of 500 g", mrp: 385, price: 346.5, comp: "Nutrition drink with DHA, folic acid and iron", uses: ["Nutrition during pregnancy and lactation"], tags: ["women", "nutrition"], rating: 4.3, reviews: 2890 },

  // ---- Covid essentials
  { name: "Venus V-4400 N95 Mask", brand: "Venus", manufacturer: "Venus Safety", cat: "covid-essentials", form: "pack", pack: "Pack of 5 masks", mrp: 499, price: 299, comp: "5-layer N95 respirator", uses: ["Protection from dust, pollution and infections"], tags: ["covid"], rating: 4.3, reviews: 4320 },
  { name: "Dettol Hand Sanitizer", brand: "Dettol", manufacturer: "Reckitt Benckiser", cat: "covid-essentials", form: "bottle", pack: "Bottle of 200 ml", mrp: 100, price: 95, comp: "Alcohol-based hand sanitizer (62%)", uses: ["Kills 99.9% germs without water"], tags: ["covid", "hygiene"], rating: 4.6, reviews: 11200 },
  { name: "CoviSelf Covid-19 Rapid Antigen Test Kit", brand: "Mylab", manufacturer: "Mylab Discovery Solutions", cat: "covid-essentials", form: "pack", pack: "Kit of 1 test", mrp: 250, price: 225, comp: "Self-use nasal swab antigen test", uses: ["Home testing for Covid-19"], tags: ["covid"], rating: 4.0, reviews: 3410, oos: true },

  // ---- Sexual wellness
  { name: "Durex Extra Thin Condoms", brand: "Durex", manufacturer: "Reckitt Benckiser", cat: "sexual-wellness", form: "pack", pack: "Pack of 10 condoms", mrp: 250, price: 212.5, comp: "Natural rubber latex condoms", uses: ["Contraception", "Protection from STIs"], tags: ["wellness"], rating: 4.5, reviews: 6320 },
  { name: "Manforce Staylong Gel", brand: "Manforce", manufacturer: "Mankind Pharma Ltd", cat: "sexual-wellness", form: "cream", pack: "Tube of 8 g", mrp: 175, price: 157.5, comp: "Lidocaine-based topical gel", uses: ["Sexual wellness"], tags: ["wellness"], rating: 4.1, reviews: 2190 },
  { name: "i-pill Emergency Contraceptive Tablet", brand: "i-pill", manufacturer: "Piramal Enterprises", cat: "sexual-wellness", form: "tablet", pack: "Strip of 1 tablet", mrp: 110, price: 104.5, comp: "Levonorgestrel (1.5mg)", uses: ["Emergency contraception"], side: ["Nausea", "Irregular bleeding", "Headache"], how: "Take one tablet as soon as possible, within 72 hours.", tags: ["wellness", "women"], rating: 4.3, reviews: 3020 },
];

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Deterministic pseudo-random so ratings don't change between server and client renders.
function seeded(i: number) {
  const x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

export const products: Product[] = seeds.map((s, i) => {
  const isMedicine = s.cat === "medicines" || s.form === "tablet" || s.form === "capsule";
  const base = defaults[isMedicine ? "medicine" : "general"];
  const discountPct = Math.round(((s.mrp - s.price) / s.mrp) * 100);
  return {
    id: `p${String(i + 1).padStart(3, "0")}`,
    slug: slugify(s.name),
    name: s.name,
    brand: s.brand,
    manufacturer: s.manufacturer,
    categorySlug: s.cat,
    form: s.form,
    packSize: s.pack,
    mrp: s.mrp,
    price: s.price,
    discountPct,
    rxRequired: !!s.rx,
    composition: s.comp,
    description:
      s.desc ??
      `${s.name} by ${s.manufacturer}. ${s.uses?.length ? `It is commonly used for ${s.uses.slice(0, 3).join(", ").toLowerCase()}.` : ""} Contains ${s.comp}.`,
    uses: s.uses ?? base.uses,
    sideEffects: s.side ?? base.sideEffects,
    howToUse: s.how ?? base.howToUse,
    safetyAdvice: base.safetyAdvice,
    storage: base.storage,
    rating: s.rating ?? Math.round((3.8 + seeded(i) * 1) * 10) / 10,
    ratingCount: s.reviews ?? Math.round(100 + seeded(i + 7) * 5000),
    inStock: !s.oos,
    stock: s.oos ? 0 : 100,
    tags: s.tags,
  };
});
