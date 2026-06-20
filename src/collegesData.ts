/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PresetCollege {
  id: string;
  name: string;
  division: string;
  district: string;
  studentCount: number;
}

export const BANGLADESH_DIVISIONS = [
  "ঢাকা বিভাগ",
  "চট্টগ্রাম বিভাগ",
  "রাজশাহী বিভাগ",
  "খুলনা বিভাগ",
  "সিলেট বিভাগ",
  "বরিশাল বিভাগ",
  "রংপুর বিভাগ",
  "ময়মনসিংহ বিভাগ"
];

export const DIVISION_DISTRICTS: { [division: string]: string[] } = {
  "ঢাকা বিভাগ": ["ঢাকা", "গাজীপুর", "নারায়ণগঞ্জ", "টাঙ্গাইল", "ফরিদপুর", "গোপালগঞ্জ", "কিশোরগঞ্জ", "মানিকগঞ্জ", "মুন্সীগঞ্জ", "নরসিংদী", "রাজবাড়ী", "শরীয়তপুর", "মাদারীপুর"],
  "চট্টগ্রাম বিভাগ": ["চট্টগ্রাম", "কক্সবাজার", "কুমিল্লা", "ফেনী", "ব্রাহ্মণবাড়িয়া", "নোয়াখালী", "চাঁদপুর", "লক্ষ্মীপুর", "রাঙ্গামাটি", "বান্দরবান", "খাগড়াছড়ি"],
  "রাজশাহী বিভাগ": ["রাজশাহী", "বগুড়া", "পাবনা", "সিরাজগঞ্জ", "নাটোর", "নওগাঁ", "জয়পুরহাট", "চাঁপাইনবাবগঞ্জ"],
  "খুলনা বিভাগ": ["খুলনা", "যশোর", "কুষ্টিয়া", "সাতক্ষীরা", "বাগেরহাট", "ঝিনাইদহ", "মাগুরা", "মেহেরপুর", "নড়াইল", "চুয়াডাঙ্গা"],
  "সিলেট বিভাগ": ["সিলেট", "মৌলভীবাজার", "হবিগঞ্জ", "সুনামগঞ্জ"],
  "বরিশাল বিভাগ": ["বরিশাল", "ভোলা", "পটুয়াখালী", "পিরোজপুর", "ঝালকাঠি", "বরগুনা"],
  "রংপুর বিভাগ": ["রংপুর", "দিনাজপুর", "গাইবান্ধা", "কুড়িগ্রাম", "লালমনিরহাট", "নীলফামারী", "পঞ্চগড়", "ঠাকুরগাঁও"],
  "ময়মনসিংহ বিভাগ": ["ময়মনসিংহ", "নেত্রকোনা", "জামালপুর", "শেরপুর"]
};

export const PRESET_COLLEGES: PresetCollege[] = [
  // ==================== DHAKA DIVISION ====================
  // Dhaka District
  { id: "dhk-ndc", name: "Notre Dame College, Dhaka (EIIN: 108272)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 15 },
  { id: "dhk-dhaka", name: "Dhaka College (EIIN: 107977)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 12 },
  { id: "dhk-rumc", name: "Rajuk Uttara Model College (EIIN: 108573)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 9 },
  { id: "dhk-vnc", name: "Viqarunnisa Noon School and College (EIIN: 108259)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 10 },
  { id: "dhk-hc", name: "Holy Cross College (EIIN: 108008)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 8 },
  { id: "dhk-adamjee", name: "Adamjee Cantonment College (EIIN: 107849)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 11 },
  { id: "dhk-drmc", name: "Dhaka Residential Model College (EIIN: 108258)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 6 },
  { id: "dhk-rouf", name: "Birshreshtha Munshi Abdur Rouf Public College (EIIN: 108162)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 7 },
  { id: "dhk-noor", name: "Birshreshtha Noor Mohammad Public College (EIIN: 108161)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 7 },
  { id: "dhk-baf", name: "BAF Shaheen College Dhaka (EIIN: 107858)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 5 },
  { id: "dhk-joseph", name: "Saint Joseph Higher Secondary School (EIIN: 108250)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 4 },
  { id: "dhk-ideal", name: "Ideal School and College, Motijheel (EIIN: 108277)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 6 },
  { id: "dhk-city", name: "Dhaka City College (EIIN: 107975)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 8 },
  { id: "dhk-commerce", name: "Dhaka Commerce College (EIIN: 108207)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 7 },
  { id: "dhk-milestone", name: "Milestone College (EIIN: 108572)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 7 },
  { id: "dhk-science", name: "Government Science College (EIIN: 108544)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 5 },
  { id: "dhk-badrunnesa", name: "Begum Badrunnesa Government Girls' College (EIIN: 108154)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 6 },
  { id: "dhk-tejgaon", name: "Tejgaon College (EIIN: 108533)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 8 },
  { id: "dhk-titumir", name: "Govt. Titumir College (EIIN: 108221)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 9 },
  { id: "dhk-eden", name: "Eden Mohila College (EIIN: 108153)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 10 },
  { id: "dhk-nazrul", name: "Kabi Nazrul Government College (EIIN: 108426)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 6 },
  { id: "dhk-imperial", name: "Dhaka Imperial College (EIIN: 107886)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 5 },
  { id: "dhk-national", name: "National Ideal College (EIIN: 108287)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 6 },
  { id: "dhk-police", name: "Shaheed Police Smrity College (EIIN: 108182)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 4 },
  { id: "dhk-gregory", name: "St. Gregory's High School and College (EIIN: 108480)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 3 },
  { id: "dhk-banglabazar", name: "Banglabazar Govt. Girls' High School (EIIN: 108481)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 2 },
  { id: "dhk-savar-cant", name: "Cantonment Public School and College, Savar (EIIN: 109210)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 4 },
  { id: "dhk-jahangirnagar", name: "Jahangirnagar University School & College (EIIN: 109208)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 3 },
  { id: "dhk-bpsc", name: "Bangladesh Public School and College (EIIN: 108552)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 2 },
  
  // Gazipur District
  { id: "gaz-bhawal", name: "Bhawal Badre Alam Govt. College (EIIN: 109028)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 4 },
  { id: "gaz-govt", name: "Gazipur Govt. College (EIIN: 109038)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 3 },
  { id: "gaz-tongi", name: "Tongi Govt. College (EIIN: 109033)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 4 },
  { id: "gaz-safiuddin", name: "Safiuddin Sarker Academy and College (EIIN: 109045)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 5 },
  { id: "gaz-meh", name: "M.E.H. Arif College (EIIN: 109072)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 3 },
  { id: "gaz-rover", name: "Rover Palli Degree College (EIIN: 109030)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 2 },
  { id: "gaz-bangabandhu", name: "Bangabandhu College (EIIN: 109031)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 2 },

  // Narayanganj District
  { id: "nyg-tolaram", name: "Govt. Tolaram College (EIIN: 112469)", division: "ঢাকা বিভাগ", district: "নারায়ণগঞ্জ", studentCount: 5 },
  { id: "nyg-govt", name: "Narayanganj Govt. College (EIIN: 112470)", division: "ঢাকা বিভাগ", district: "নারায়ণগঞ্জ", studentCount: 3 },
  { id: "nyg-mohila", name: "Narayanganj Govt. Mohila College (EIIN: 112471)", division: "ঢাকা বিভাগ", district: "নারায়ণগঞ্জ", studentCount: 4 },
  { id: "nyg-college", name: "Narayanganj College (EIIN: 112472)", division: "ঢাকা বিভাগ", district: "নারায়ণগঞ্জ", studentCount: 4 },
  { id: "nyg-kadam", name: "Kadam Rasul College (EIIN: 112349)", division: "ঢাকা বিভাগ", district: "নারায়ণগঞ্জ", studentCount: 2 },
  { id: "nyg-roopganj", name: "Roopganj Govt. College (EIIN: 112678)", division: "ঢাকা বিভাগ", district: "নারায়ণগঞ্জ", studentCount: 2 },

  // Tangail District
  { id: "tng-saadat", name: "Govt. Saadat College (EIIN: 114757)", division: "ঢাকা বিভাগ", district: "টাঙ্গাইল", studentCount: 3 },
  { id: "tng-kumudini", name: "Kumudini Government College (EIIN: 114251)", division: "ঢাকা বিভাগ", district: "টাঙ্গাইল", studentCount: 2 },
  { id: "tng-mahmudul", name: "Major General Mahmudul Hasan College (EIIN: 114674)", division: "ঢাকা বিভাগ", district: "টাঙ্গাইল", studentCount: 3 },
  { id: "tng-sristi", name: "Sristi College of Tangail (EIIN: 132101)", division: "ঢাকা বিভাগ", district: "টাঙ্গাইল", studentCount: 3 },
  { id: "tng-bindu", name: "Bindubashini Govt. Boys' High School and College (EIIN: 114676)", division: "ঢাকা বিভাগ", district: "টাঙ্গাইল", studentCount: 2 },

  // Faridpur District
  { id: "far-rajendra", name: "Govt. Rajendra College (EIIN: 108797)", division: "ঢাকা বিভাগ", district: "ফরিদপুর", studentCount: 5 },
  { id: "far-yasin", name: "Govt. Yasin College (EIIN: 108798)", division: "ঢাকা বিভাগ", district: "ফরিদপুর", studentCount: 2 },
  { id: "far-girls", name: "Faridpur Govt. Girls' College (EIIN: 108799)", division: "ঢাকা বিভাগ", district: "ফরিদপুর", studentCount: 3 },
  { id: "far-sarada", name: "Govt. Sarada Sundari Mahila College (EIIN: 108801)", division: "ঢাকা বিভাগ", district: "ফরিদপুর", studentCount: 2 },

  // Gopalganj District
  { id: "gop-bangabandhu", name: "Govt. Bangabandhu College (EIIN: 109503)", division: "ঢাকা বিভাগ", district: "গোপালগঞ্জ", studentCount: 3 },
  { id: "gop-fazil", name: "Sheikh Fazilatunnesa Govt. Women's College (EIIN: 109504)", division: "ঢাকা বিভাগ", district: "গোপালগঞ্জ", studentCount: 2 },
  { id: "gop-sm", name: "S.M. Model Government High School & College (EIIN: 109505)", division: "ঢাকা বিভাগ", district: "গোপালগঞ্জ", studentCount: 2 },
  
  // Kishoreganj District
  { id: "kis-gurudayal", name: "Gurudayal Govt. College (EIIN: 110432)", division: "ঢাকা বিভাগ", district: "কিশোরগঞ্জ", studentCount: 4 },
  { id: "kis-mohila", name: "Kishoreganj Govt. Mahila College (EIIN: 110433)", division: "ঢাকা বিভাগ", district: "কিশোরগঞ্জ", studentCount: 3 },
  { id: "kis-wali", name: "Wali Nawaz Khan College (EIIN: 110435)", division: "ঢাকা বিভাগ", district: "কিশোরগঞ্জ", studentCount: 2 },

  // Manikganj District
  { id: "man-debendra", name: "Govt. Debendra College (EIIN: 111032)", division: "ঢাকা বিভাগ", district: "মানিকগঞ্জ", studentCount: 3 },
  { id: "man-mohila", name: "Manikganj Govt. Mahila College (EIIN: 111034)", division: "ঢাকা বিভাগ", district: "মানিকগঞ্জ", studentCount: 2 },

  // Munshiganj District
  { id: "mun-haraganga", name: "Govt. Haraganga College (EIIN: 111195)", division: "ঢাকা বিভাগ", district: "মুন্সীগঞ্জ", studentCount: 3 },
  { id: "mun-mohila", name: "Munshiganj Govt. Mahila College (EIIN: 111196)", division: "ঢাকা বিভাগ", district: "মুন্সীগঞ্জ", studentCount: 2 },

  // Narsingdi District
  { id: "nar-govt-d", name: "Narsingdi Govt. College (EIIN: 112704)", division: "ঢাকা বিভাগ", district: "নরসিংদী", studentCount: 4 },
  { id: "nar-abdul", name: "Abdul Kadir Mollah City College (EIIN: 112753)", division: "ঢাকা বিভাগ", district: "নরসিংদী", studentCount: 5 },
  { id: "nar-mohila", name: "Narsingdi Govt. Mahila College (EIIN: 112705)", division: "ঢাকা বিভাগ", district: "নরসিংদী", studentCount: 3 },

  // Rajbari District
  { id: "rajb-govt", name: "Govt. Rajbari College (EIIN: 113454)", division: "ঢাকা বিভাগ", district: "রাজবাড়ী", studentCount: 2 },

  // Shariatpur District
  { id: "sha-govt", name: "Shariatpur Govt. College (EIIN: 113645)", division: "ঢাকা বিভাগ", district: "শরীয়তপুর", studentCount: 2 },

  // Madaripur District
  { id: "mad-nazimuddin", name: "Govt. Nazimuddin College (EIIN: 110756)", division: "ঢাকা বিভাগ", district: "মাদারীপুর", studentCount: 3 },

  // ==================== CHITTAGONG DIVISION ====================
  // Chattogram District
  { id: "ctg-college", name: "Chattogram College (EIIN: 104300)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 6 },
  { id: "ctg-mohsin", name: "Govt. Hazi Mohammad Mohsin College (EIIN: 104301)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 4 },
  { id: "ctg-city", name: "Govt City College, Chottogram (EIIN: 104303)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 3 },
  { id: "ctg-cadet", name: "Faujdarhat Cadet College (EIIN: 105051)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 2 },
  { id: "ctg-cant", name: "Chittagong Cantonment Public College (EIIN: 104118)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 4 },
  { id: "ctg-girls", name: "Chittagong Government Girls' College (EIIN: 104302)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 3 },
  { id: "ctg-ispahani", name: "Ispahani Public School and College (EIIN: 104297)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 2 },
  { id: "ctg-hazera", name: "Hazera Taju Degree College (EIIN: 104298)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 3 },
  { id: "ctg-bakaliya", name: "Bakaliya Government College (EIIN: 104299)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 5 },
  { id: "ctg-darul-uloom", name: "DARUL ULOOM KAMIL MADRASHA (EIIN: 104353)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 1 },
  { id: "ctg-navy", name: "Bangladesh Navy College Chittagong (EIIN: 104304)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 4 },
  { id: "ctg-commerce", name: "Government College of Commerce (EIIN: 104305)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 4 },
  { id: "ctg-baf", name: "BAF Shaheen College Chittagong (EIIN: 104698)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 3 },
  { id: "ctg-omargani", name: "Omargani M.E.S College (EIIN: 104306)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 5 },

  // Cox's Bazar District
  { id: "cox-govt", name: "Cox's Bazar Govt. College (EIIN: 106316)", division: "চট্টগ্রাম বিভাগ", district: "কক্সবাজার", studentCount: 4 },
  { id: "cox-city", name: "Cox's Bazar City College (EIIN: 106315)", division: "চট্টগ্রাম বিভাগ", district: "কক্সবাজার", studentCount: 3 },
  { id: "cox-mohesh", name: "Moheshkhali College (EIIN: 106346)", division: "চট্টগ্রাম বিভাগ", district: "কক্সবাজার", studentCount: 2 },

  // Cumilla District
  { id: "cum-victoria", name: "Comilla Victoria Govt. College (EIIN: 105822)", division: "চট্টগ্রাম বিভাগ", district: "কুমিল্লা", studentCount: 8 },
  { id: "cum-govt", name: "Comilla Govt. College (EIIN: 105796)", division: "চট্টগ্রাম বিভাগ", district: "কুমিল্লা", studentCount: 4 },
  { id: "cum-women", name: "Comilla Govt. Women's College (EIIN: 105823)", division: "চট্টগ্রাম বিভাগ", district: "কুমিল্লা", studentCount: 3 },
  { id: "cum-cadet", name: "Comilla Cadet College (EIIN: 106190)", division: "চট্টগ্রাম বিভাগ", district: "কুমিল্লা", studentCount: 2 },
  { id: "cum-ispahani", name: "Ispahani Public School & College, Comilla (EIIN: 105824)", division: "চট্টগ্রাম বিভাগ", district: "কুমিল্লা", studentCount: 3 },

  // Feni District
  { id: "fen-govt", name: "Feni Govt. College (EIIN: 106500)", division: "চট্টগ্রাম বিভাগ", district: "ফেনী", studentCount: 3 },
  { id: "fen-girls", name: "Feni Govt. Girls' High School & College (EIIN: 106501)", division: "চট্টগ্রাম বিভাগ", district: "ফেনী", studentCount: 2 },

  // Noakhali District
  { id: "nok-govt", name: "Noakhali Govt. College (EIIN: 107471)", division: "চট্টগ্রাম বিভাগ", district: "নোয়াখালী", studentCount: 3 },
  { id: "nok-women", name: "Noakhali Govt. Women's College (EIIN: 107472)", division: "চট্টগ্রাম বিভাগ", district: "নোয়াখালী", studentCount: 3 },
  { id: "nok-chowmuhani", name: "Chowmuhani Govt. S.A College (EIIN: 107293)", division: "চট্টগ্রাম বিভাগ", district: "নোয়াখালী", studentCount: 4 },

  // Brahmanbaria District
  { id: "bra-govt", name: "Brahmanbaria Govt. College (EIIN: 103303)", division: "চট্টগ্রাম বিভাগ", district: "ব্রাহ্মণবাড়িয়া", studentCount: 4 },
  { id: "bra-women", name: "Brahmanbaria Govt. Women's College (EIIN: 103304)", division: "চট্টগ্রাম বিভাগ", district: "ব্রাহ্মণবাড়িয়া", studentCount: 2 },

  // Chandpur District
  { id: "cha-govt", name: "Chandpur Govt. College (EIIN: 103714)", division: "চট্টগ্রাম বিভাগ", district: "চাঁদপুর", studentCount: 3 },
  { id: "cha-women", name: "Chandpur Govt. Women's College (EIIN: 103715)", division: "চট্টগ্রাম বিভাগ", district: "চাঁদপুর", studentCount: 2 },

  // Lakshmipur District
  { id: "lak-govt", name: "Lakshmipur Govt. College (EIIN: 106935)", division: "চট্টগ্রাম বিভাগ", district: "লক্ষ্মীপুর", studentCount: 3 },
  { id: "lak-women", name: "Lakshmipur Govt. Women's College (EIIN: 106936)", division: "চট্টগ্রাম বিভাগ", district: "লক্ষ্মীপুর", studentCount: 2 },

  // Rangamati District
  { id: "ran-govt", name: "Rangamati Govt. College (EIIN: 107902)", division: "চট্টগ্রাম বিভাগ", district: "রাঙ্গামাটি", studentCount: 2 },
  { id: "ran-public", name: "Rangamati Public College (EIIN: 107903)", division: "চট্টগ্রাম বিভাগ", district: "রাঙ্গামাটি", studentCount: 2 },

  // Bandarban District
  { id: "ban-govt", name: "Bandarban Govt. College (EIIN: 103164)", division: "চট্টগ্রাম বিভাগ", district: "বান্দরবান", studentCount: 2 },

  // Khagrachhari District
  { id: "kha-govt", name: "Khagrachhari Govt. College (EIIN: 106757)", division: "চট্টগ্রাম বিভাগ", district: "খাগড়াছড়ি", studentCount: 2 },

  // ==================== RAJSHAHI DIVISION ====================
  // Rajshahi District
  { id: "raj-college", name: "Rajshahi College (EIIN: 126490)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 8 },
  { id: "raj-degree", name: "New Govt. Degree College, Rajshahi (EIIN: 126491)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 4 },
  { id: "raj-cadet", name: "Rajshahi Cadet College (EIIN: 121735)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 2 },
  { id: "raj-city", name: "Rajshahi Government City College (EIIN: 126492)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 3 },
  { id: "raj-women", name: "Rajshahi Government Women's College (EIIN: 126494)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 3 },
  { id: "raj-cant", name: "Rajshahi Cantonment Public School & College (EIIN: 126496)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 3 },
  { id: "raj-bangabandhu", name: "Bangabandhu College, Rajshahi (EIIN: 126497)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 2 },

  // Bogura District
  { id: "bog-azizul", name: "Govt. Azizul Haque College, Bogra (EIIN: 119523)", division: "রাজশাহী বিভাগ", district: "বগুড়া", studentCount: 5 },
  { id: "bog-cant", name: "Bogra Cantonment Public School & College (EIIN: 119213)", division: "রাজশাহী বিভাগ", district: "বগুড়া", studentCount: 3 },
  { id: "bog-women", name: "Govt. Mujibur Rahman Women's College, Bogra (EIIN: 119524)", division: "রাজশাহী বিভাগ", district: "বগুড়া", studentCount: 3 },
  { id: "bog-pundra", name: "Pundra University College (EIIN: 119525)", division: "রাজশাহী বিভাগ", district: "বগুড়া", studentCount: 2 },

  // Pabna District
  { id: "pab-edward", name: "Pabna Edward College (EIIN: 125547)", division: "রাজশাহী বিভাগ", district: "পাবনা", studentCount: 4 },
  { id: "pab-women", name: "Govt. Women's College, Pabna (EIIN: 125548)", division: "রাজশাহী বিভাগ", district: "পাবনা", studentCount: 2 },
  { id: "pab-bulbul", name: "Shahid Bulbul Govt. College, Pabna (EIIN: 125549)", division: "রাজশাহী বিভাগ", district: "পাবনা", studentCount: 3 },

  // Sirajganj District
  { id: "sir-govt", name: "Sirajganj Govt. College (EIIN: 128292)", division: "রাজশাহী বিভাগ", district: "সিরাজগঞ্জ", studentCount: 3 },
  { id: "sir-islamia", name: "Islamia Govt. College, Sirajganj (EIIN: 128293)", division: "রাজশাহী বিভাগ", district: "সিরাজগঞ্জ", studentCount: 2 },

  // Natore District
  { id: "nat-nawab", name: "Nawab Siraj-Ud-Dowla Govt. College (EIIN: 124237)", division: "রাজশাহী বিভাগ", district: "নাটোর", studentCount: 3 },
  { id: "nat-women", name: "Natore Govt. Women's College (EIIN: 124238)", division: "রাজশাহী বিভাগ", district: "নাটোর", studentCount: 2 },

  // Naogaon District
  { id: "nao-govt", name: "Naogaon Govt. College (EIIN: 123491)", division: "রাজশাহী বিভাগ", district: "নওগাঁ", studentCount: 3 },
  { id: "nao-bmc", name: "B.M.C Govt. Women's College (EIIN: 123492)", division: "রাজশাহী বিভাগ", district: "নওগাঁ", studentCount: 2 },

  // Joypurhat District
  { id: "joy-govt", name: "Joypurhat Govt. College (EIIN: 122013)", division: "রাজশাহী বিভাগ", district: "জয়পুরহাট", studentCount: 2 },
  { id: "joy-women", name: "Joypurhat Govt. Women's College (EIIN: 122014)", division: "রাজশাহী বিভাগ", district: "জয়পুরহাট", studentCount: 2 },

  // Chapainawabganj District
  { id: "cha-nawab", name: "Nawabganj Govt. College (EIIN: 124589)", division: "রাজশাহী বিভাগ", district: "চাঁপাইনবাবগঞ্জ", studentCount: 3 },
  { id: "cha-women-nab", name: "Nawabganj Govt. Women's College (EIIN: 124590)", division: "রাজশাহী বিভাগ", district: "চাঁপাইনবাবগঞ্জ", studentCount: 2 },

  // ==================== KHULNA DIVISION ====================
  // Khulna District
  { id: "khl-bl", name: "Govt. Brajalal (BL) College, Khulna (EIIN: 117188)", division: "খুলনা বিভাগ", district: "খুলনা", studentCount: 6 },
  { id: "khl-public", name: "Khulna Public College (EIIN: 117144)", division: "খুলনা বিভাগ", district: "খুলনা", studentCount: 3 },
  { id: "khl-city", name: "Govt. M. M. City College, Khulna (EIIN: 117189)", division: "খুলনা বিভাগ", district: "খুলনা", studentCount: 4 },
  { id: "khl-pioneer", name: "Government Pioneer Women's College (EIIN: 117190)", division: "খুলনা বিভাগ", district: "খুলনা", studentCount: 4 },
  { id: "khl-cant", name: "Cantonment Public College, Khulna (EIIN: 117145)", division: "খুলনা বিভাগ", district: "খুলনা", studentCount: 3 },

  // Jessore District
  { id: "jes-mm", name: "Govt. M. M. College, Jessore (EIIN: 115959)", division: "খুলনা বিভাগ", district: "যশোর", studentCount: 5 },
  { id: "jes-cant", name: "Cantonment College, Jessore (EIIN: 115961)", division: "খুলনা বিভাগ", district: "যশোর", studentCount: 3 },
  { id: "jes-city", name: "Jessore Govt. City College (EIIN: 115960)", division: "খুলনা বিভাগ", district: "যশোর", studentCount: 3 },
  { id: "jes-women", name: "Jessore Govt. Women's College (EIIN: 115962)", division: "খুলনা বিভাগ", district: "যশোর", studentCount: 2 },

  // Kushtia District
  { id: "kus-govt", name: "Kushtia Govt. College (EIIN: 117764)", division: "খুলনা বিভাগ", district: "কুষ্টিয়া", studentCount: 4 },
  { id: "kus-women", name: "Kushtia Govt. Women's College (EIIN: 117765)", division: "খুলনা বিভাগ", district: "কুষ্টিয়া", studentCount: 2 },

  // Satkhira District
  { id: "sat-govt", name: "Satkhira Govt. College (EIIN: 118835)", division: "খুলনা বিভাগ", district: "সাতক্ষীরা", studentCount: 3 },
  { id: "sat-women", name: "Satkhira Govt. Women's College (EIIN: 118836)", division: "খুলনা বিভাগ", district: "সাতক্ষীরা", studentCount: 2 },

  // Bagerhat District
  { id: "bag-pc", name: "Bagerhat Govt. P.C. College (EIIN: 114940)", division: "খুলনা বিভাগ", district: "বাগেরহাট", studentCount: 3 },
  { id: "bag-women", name: "Bagerhat Govt. Women's College (EIIN: 114941)", division: "খুলনা বিভাগ", district: "বাগেরহাট", studentCount: 2 },

  // Jhenaidah District
  { id: "jhe-kc", name: "Govt. K.C. College (EIIN: 116518)", division: "খুলনা বিভাগ", district: "ঝিনাইদহ", studentCount: 3 },
  { id: "jhe-cadet", name: "Jhenaidah Cadet College (EIIN: 116519)", division: "খুলনা বিভাগ", district: "ঝিনাইদহ", studentCount: 2 },

  // Magura District
  { id: "mag-suhrawardy", name: "Govt. Huseyn Shaheed Suhrawardy College (EIIN: 117950)", division: "খুলনা বিভাগ", district: "মাগুরা", studentCount: 2 },
  { id: "mag-adarsa", name: "Magura Adarsha College (EIIN: 117951)", division: "খুলনা বিভাগ", district: "মাগুরা", studentCount: 2 },

  // Meherpur District
  { id: "meh-govt", name: "Meherpur Govt. College (EIIN: 118314)", division: "খুলনা বিভাগ", district: "মেহেরপুর", studentCount: 2 },
  { id: "meh-women", name: "Meherpur Govt. Women's College (EIIN: 118315)", division: "খুলনা বিভাগ", district: "মেহেরপুর", studentCount: 2 },

  // Narail District
  { id: "nar-victoria", name: "Narail Govt. Victoria College (EIIN: 118464)", division: "খুলনা বিভাগ", district: "নড়াইল", studentCount: 2 },

  // Chuadanga District
  { id: "chu-govt", name: "Chuadanga Govt. College (EIIN: 115456)", division: "খুলনা বিভাগ", district: "চুয়াডাঙ্গা", studentCount: 3 },
  { id: "chu-adarsha", name: "Chuadanga Adarsha Mahila College (EIIN: 115457)", division: "খুলনা বিভাগ", district: "চুয়াডাঙ্গা", studentCount: 2 },

  // ==================== SYLHET DIVISION ====================
  // Sylhet District
  { id: "syl-mc", name: "MC College, Sylhet (EIIN: 130452)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 5 },
  { id: "syl-govt", name: "Sylhet Govt. College (EIIN: 130451)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 3 },
  { id: "syl-women", name: "Sylhet Women's Govt. College (EIIN: 130454)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 2 },
  { id: "syl-jalalabad", name: "Jalalabad Cantonment Public School & College (EIIN: 130310)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 3 },
  { id: "syl-bluebird", name: "Blue Bird High School & College (EIIN: 130449)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 2 },
  { id: "syl-cadet", name: "Sylhet Cadet College (EIIN: 130460)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 2 },

  // Moulvibazar District
  { id: "mou-govt", name: "Moulvibazar Govt. College (EIIN: 129754)", division: "সিলেট বিভাগ", district: "মৌলভীবাজার", studentCount: 3 },
  { id: "mou-women", name: "Moulvibazar Govt. Women's College (EIIN: 129755)", division: "সিলেট বিভাগ", district: "মৌলভীবাজার", studentCount: 2 },

  // Habiganj District
  { id: "hab-vrindaban", name: "Habiganj Govt. Vrindaban College (EIIN: 129469)", division: "সিলেট বিভাগ", district: "হবিগঞ্জ", studentCount: 3 },
  { id: "hab-women", name: "Habiganj Govt. Mahila College (EIIN: 129470)", division: "সিলেট বিভাগ", district: "হবিগঞ্জ", studentCount: 2 },

  // Sunamganj District
  { id: "sun-govt", name: "Sunamganj Govt. College (EIIN: 130006)", division: "সিলেট বিভাগ", district: "সুনামগঞ্জ", studentCount: 3 },
  { id: "sun-women", name: "Sunamganj Govt. Women's College (EIIN: 130007)", division: "সিলেট বিভাগ", district: "সুনামগঞ্জ", studentCount: 2 },

  // ==================== BARISAL DIVISION ====================
  // Barisal District
  { id: "bar-bm", name: "Govt. Brojomohun (BM) College, Barisal (EIIN: 100868)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 4 },
  { id: "bar-hatem", name: "Govt. Syed Hatem Ali College (EIIN: 100869)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 3 },
  { id: "bar-cadet", name: "Barisal Cadet College (EIIN: 100693)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 2 },
  { id: "bar-amrita", name: "Amrita Lal Dey College (EIIN: 100866)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 3 },
  { id: "bar-women", name: "Barisal Govt. Women's College (EIIN: 100871)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 3 },
  { id: "bar-model", name: "Barisal Model School and College (EIIN: 100870)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 2 },

  // Bhola District
  { id: "bho-govt", name: "Bhola Govt. College (EIIN: 101481)", division: "বরিশাল বিভাগ", district: "ভোলা", studentCount: 3 },
  { id: "bho-fazilatunnesa", name: "Fazilatunnesa Govt. Women's College (EIIN: 101482)", division: "বরিশাল বিভাগ", district: "ভোলা", studentCount: 2 },

  // Patuakhali District
  { id: "pat-govt", name: "Patuakhali Govt. College (EIIN: 102554)", division: "বরিশাল বিভাগ", district: "পটুয়াখালী", studentCount: 3 },
  { id: "pat-women", name: "Patuakhali Govt. Women's College (EIIN: 102555)", division: "বরিশাল বিভাগ", district: "পটুয়াখালী", studentCount: 2 },

  // Pirojpur District
  { id: "pir-suhrawardy", name: "Pirojpur Govt. Suhrawardy College (EIIN: 102925)", division: "বরিশাল বিভাগ", district: "পিরোজপুর", studentCount: 2 },
  { id: "pir-women", name: "Pirojpur Govt. Women's College (EIIN: 102926)", division: "বরিশাল বিভাগ", district: "পিরোজপুর", studentCount: 1 },

  // Jhalokati District
  { id: "jha-govt", name: "Jhalokati Govt. College (EIIN: 101683)", division: "বরিশাল বিভাগ", district: "ঝালকাঠি", studentCount: 2 },
  { id: "jha-women", name: "Jhalokati Govt. Women's College (EIIN: 101684)", division: "বরিশাল বিভাগ", district: "ঝালকাঠি", studentCount: 1 },

  // Barguna District
  { id: "bar-govt-b", name: "Barguna Govt. College (EIIN: 100185)", division: "বরিশাল বিভাগ", district: "বরগুনা", studentCount: 2 },
  { id: "bar-women-b", name: "Barguna Govt. Women's College (EIIN: 100186)", division: "বরিশাল বিভাগ", district: "বরগুনা", studentCount: 1 },

  // ==================== RANGPUR DIVISION ====================
  // Rangpur District
  { id: "rng-carmichael", name: "Carmichael College, Rangpur (EIIN: 127653)", division: "রংপুর বিভাগ", district: "রংপুর", studentCount: 6 },
  { id: "rng-cant", name: "Cantonment Public School and College, Rangpur (EIIN: 127453)", division: "রংপুর বিভাগ", district: "রংপুর", studentCount: 4 },
  { id: "rng-cadet", name: "Rangpur Cadet College (EIIN: 127535)", division: "রংপুর বিভাগ", district: "রংপুর", studentCount: 2 },
  { id: "rng-govt", name: "Rangpur Govt. College (EIIN: 127651)", division: "রংপুর বিভাগ", district: "রংপুর", studentCount: 3 },
  { id: "rng-begum", name: "Begum Rokeya Govt. College (EIIN: 127652)", division: "রংপুর বিভাগ", district: "রংপুর", studentCount: 3 },
  { id: "rng-police", name: "Police Lines School and College, Rangpur (EIIN: 127462)", division: "রংপুর বিভাগ", district: "রংপুর", studentCount: 3 },

  // Dinajpur District
  { id: "din-govt", name: "Dinajpur Govt. College (EIIN: 120833)", division: "রংপুর বিভাগ", district: "দিনাজপুর", studentCount: 4 },
  { id: "din-women", name: "Dinajpur Govt. Women's College (EIIN: 120834)", division: "রংপুর বিভাগ", district: "দিনাজপুর", studentCount: 2 },
  { id: "din-cant", name: "Cantonment Public School & College, Dinajpur (EIIN: 120835)", division: "রংপুর বিভাগ", district: "দিনাজপুর", studentCount: 3 },

  // Gaibandha District
  { id: "gai-govt", name: "Gaibandha Govt. College (EIIN: 121307)", division: "রংপুর বিভাগ", district: "গাইবান্ধা", studentCount: 3 },
  { id: "gai-women", name: "Gaibandha Govt. Mahila College (EIIN: 121308)", division: "রংপুর বিভাগ", district: "গাইবান্ধা", studentCount: 2 },

  // Kurigram District
  { id: "kur-govt", name: "Kurigram Govt. College (EIIN: 122340)", division: "রংপুর বিভাগ", district: "কুড়িগ্রাম", studentCount: 3 },
  { id: "kur-women", name: "Kurigram Govt. Women's College (EIIN: 122341)", division: "রংপুর বিভাগ", district: "কুড়িগ্রাম", studentCount: 2 },

  // Lalmonirhat District
  { id: "lal-govt", name: "Lalmonirhat Govt. College (EIIN: 122869)", division: "রংপুর বিভাগ", district: "লালমনিরহাট", studentCount: 2 },
  { id: "lal-women", name: "Majida Khatun Govt. Women's College (EIIN: 122870)", division: "রংপুর বিভাগ", district: "লালমনিরহাট", studentCount: 1 },

  // Nilphamari District
  { id: "nil-govt", name: "Nilphamari Govt. College (EIIN: 125132)", division: "রংপুর বিভাগ", district: "নীলফামারী", studentCount: 3 },
  { id: "nil-women", name: "Nilphamari Govt. Women's College (EIIN: 125133)", division: "রংপুর বিভাগ", district: "নীলফামারী", studentCount: 2 },

  // Panchagarh District
  { id: "pan-govt", name: "M.R. Govt. College, Panchagarh (EIIN: 125211)", division: "রংপুর বিভাগ", district: "পঞ্চগড়", studentCount: 2 },
  { id: "pan-women", name: "Panchagarh Govt. Women's College (EIIN: 125212)", division: "রংপুর বিভাগ", district: "পঞ্চগড়", studentCount: 1 },

  // Thakurgaon District
  { id: "tha-govt", name: "Thakurgaon Govt. College (EIIN: 129035)", division: "রংপুর বিভাগ", district: "ঠাকুরগাঁও", studentCount: 3 },
  { id: "tha-women", name: "Thakurgaon Govt. Women's College (EIIN: 129036)", division: "রংপুর বিভাগ", district: "ঠাকুরগাঁও", studentCount: 2 },

  // ==================== MYMENSINGH DIVISION ====================
  // Mymensingh District
  { id: "mym-ananda", name: "Ananda Mohan College, Mymensingh (EIIN: 111910)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 7 },
  { id: "mym-cadet", name: "Mymensingh Girls' Cadet College (EIIN: 111818)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 2 },
  { id: "mym-cant", name: "Cantonment Public School & College, Momenshahi (EIIN: 111905)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 3 },
  { id: "mym-govt", name: "Mymensingh Govt. College (EIIN: 111912)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 4 },
  { id: "mym-muminunnesa", name: "Muminunnesa Govt. Women's College (EIIN: 111911)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 4 },
  { id: "mym-nazrul", name: "Shahid Syed Nazrul Islam College (EIIN: 111933)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 4 },

  // Netrokona District
  { id: "net-govt", name: "Netrokona Govt. College (EIIN: 113110)", division: "ময়মনসিংহ বিভাগ", district: "নেত্রকোনা", studentCount: 3 },
  { id: "net-women", name: "Netrokona Govt. Mohila College (EIIN: 113111)", division: "ময়মনসিংহ বিভাগ", district: "নেত্রকোনা", studentCount: 2 },

  // Jamalpur District
  { id: "jam-asheq", name: "Jamalpur Govt. Asheq Mahmud College (EIIN: 110110)", division: "ময়মনসিংহ বিভাগ", district: "জামালপুর", studentCount: 3 },
  { id: "jam-jaheda", name: "Govt. Jaheda Safir Mahila College (EIIN: 110111)", division: "ময়মনসিংহ বিভাগ", district: "জামালপুর", studentCount: 2 },

  // Sherpur District
  { id: "she-govt", name: "Sherpur Govt. College (EIIN: 113840)", division: "ময়মনসিংহ বিভাগ", district: "শেরপুর", studentCount: 3 },
  { id: "she-women", name: "Sherpur Govt. Women's College (EIIN: 113841)", division: "ময়মনসিংহ বিভাগ", district: "শেরপুর", studentCount: 2 },

  // ==================== ADDITIONAL COLLEGES LISTED OVER WEB SEARCH ====================
  // Dhaka additional
  { id: "dhk-bd-int", name: "Bangladesh International School & College (EIIN: 108574)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 2 },
  { id: "dhk-sos", name: "SOS Hermann Gmeiner College (EIIN: 108253)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 3 },
  { id: "dhk-cps", name: "Cantonment Public School and College (EIIN: 108257)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 4 },
  { id: "dhk-st-cross", name: "St. Francis Xavier's Girls' High School & College (EIIN: 108427)", division: "ঢাকা বিভাগ", district: "ঢাকা", studentCount: 2 },
  { id: "nan-sc", name: "Narayanganj High School and College (EIIN: 112476)", division: "ঢাকা বিভাগ", district: "নারায়ণগঞ্জ", studentCount: 3 },
  { id: "man-sc", name: "Manikganj Govt. High School (EIIN: 111035)", division: "ঢাকা বিভাগ", district: "মানিকগঞ্জ", studentCount: 1 },
  { id: "gaz-bhawal-badre", name: "Bhawal Badre Alam Government College (EIIN: 109028)", division: "ঢাকা বিভাগ", district: "গাজীপুর", studentCount: 3 },
  { id: "kis-z", name: "Kishoreganj Zilla School (EIIN: 110438)", division: "ঢাকা বিভাগ", district: "কিশোরগঞ্জ", studentCount: 2 },
  
  // Chittagong additional
  { id: "ctg-col-sch", name: "Chittagong Collegiate School & College (EIIN: 104527)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 5 },
  { id: "ctg-agrabad", name: "Agrabad Mohila College (EIIN: 104308)", division: "চট্টগ্রাম বিভাগ", district: "চট্টগ্রাম", studentCount: 4 },
  { id: "cox-govt-g", name: "Cox's Bazar Govt. Girls High School (EIIN: 106317)", division: "চট্টগ্রাম বিভাগ", district: "কক্সবাজার", studentCount: 2 },
  { id: "cum-z", name: "Comilla Zilla School (EIIN: 105767)", division: "চট্টগ্রাম বিভাগ", district: "কুমিল্লা", studentCount: 4 },
  { id: "feni-z", name: "Feni Govt. Pilot High School (EIIN: 106503)", division: "চট্টগ্রাম বিভাগ", district: "ফেনী", studentCount: 3 },
  { id: "noa-z", name: "Noakhali Zilla School (EIIN: 107474)", division: "চট্টগ্রাম বিভাগ", district: "নোয়াখালী", studentCount: 3 },

  // Rajshahi additional
  { id: "raj-col", name: "Rajshahi Collegiate School (EIIN: 126442)", division: "রাজশাহী বিভাগ", district: "রাজশাহী", studentCount: 4 },
  { id: "bog-z", name: "Bogra Zilla School (EIIN: 119253)", division: "রাজশাহী বিভাগ", district: "বগুড়া", studentCount: 3 },
  { id: "bog-cor", name: "Bogra Coronation Institution (EIIN: 119254)", division: "রাজশাহী বিভাগ", district: "বগুড়া", studentCount: 2 },
  { id: "pab-z", name: "Pabna Zilla School (EIIN: 125550)", division: "রাজশাহী বিভাগ", district: "পাবনা", studentCount: 3 },
  { id: "sir-z", name: "Sirajganj Govt. B.L. High School (EIIN: 128295)", division: "রাজশাহী বিভাগ", district: "সিরাজগঞ্জ", studentCount: 3 },

  // Khulna additional
  { id: "khl-z", name: "Khulna Zilla School (EIIN: 117105)", division: "খুলনা বিভাগ", district: "খুলনা", studentCount: 4 },
  { id: "khl-cor", name: "Khulna Coronation Govt. Girls High School (EIIN: 117106)", division: "খুলনা বিভাগ", district: "খুলনা", studentCount: 3 },
  { id: "jes-z", name: "Jessore Zilla School (EIIN: 115963)", division: "খুলনা বিভাগ", district: "যশোর", studentCount: 3 },
  { id: "kus-z", name: "Kushtia Zilla School (EIIN: 117767)", division: "খুলনা বিভাগ", district: "কুষ্টিয়া", studentCount: 3 },

  // Sylhet additional
  { id: "syl-z", name: "Sylhet Govt. Pilot High School (EIIN: 130453)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 3 },
  { id: "syl-agra", name: "Sylhet Agragami Govt. Girls High School (EIIN: 130455)", division: "সিলেট বিভাগ", district: "সিলেট", studentCount: 2 },
  { id: "hab-z", name: "Habiganj Govt. High School (EIIN: 129472)", division: "সিলেট বিভাগ", district: "হবিগঞ্জ", studentCount: 2 },
  
  // Barisal additional
  { id: "bar-z", name: "Barisal Zilla School (EIIN: 100874)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 4 },
  { id: "bar-sad", name: "Barisal Govt. Girls High School (EIIN: 100875)", division: "বরিশাল বিভাগ", district: "বরিশাল", studentCount: 3 },
  { id: "pat-z", name: "Patuakhali Govt. Jubilee High School (EIIN: 102557)", division: "বরিশাল বিভাগ", district: "পটুয়াখালী", studentCount: 2 },

  // Rangpur additional
  { id: "rng-z", name: "Rangpur Zilla School (EIIN: 127654)", division: "রংপুর বিভাগ", district: "রংপুর", studentCount: 4 },
  { id: "din-z", name: "Dinajpur Zilla School (EIIN: 120836)", division: "রংপুর বিভাগ", district: "দিনাজপুর", studentCount: 3 },
  { id: "kur-z", name: "Kurigram Govt. High School (EIIN: 122343)", division: "রংপুর বিভাগ", district: "কুড়িগ্রাম", studentCount: 2 },

  // Mymensingh additional
  { id: "mym-z", name: "Mymensingh Zilla School (EIIN: 111913)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 4 },
  { id: "mym-vidya", name: "Vidyamoyee Govt. Girls High School (EIIN: 111914)", division: "ময়মনসিংহ বিভাগ", district: "ময়মনসিংহ", studentCount: 3 },
  { id: "jam-z", name: "Jamalpur Zilla School (EIIN: 110113)", division: "ময়মনসিংহ বিভাগ", district: "জামালপুর", studentCount: 3 }
];
