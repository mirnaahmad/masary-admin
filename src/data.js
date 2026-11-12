export const lines = [
  { id: 5, name: "الكراجات – الجامعة", stops: 12, buses: 4, status: "منشور" },
  { id: 2, name: "الوعر – ساحة الساعة", stops: 7, buses: 3, status: "منشور" },
  { id: 8, name: "المركز – الإنشاءات", stops: 7, buses: 2, status: "منشور" },
  { id: 3, name: "عكرمة – الزهراء", stops: 10, buses: 3, status: "منشور" },
  {
    id: 14,
    name: "باب السباع – جامعة حمص",
    stops: 11,
    buses: 0,
    status: "مسودة",
  },
];
export const stops = [
  "الكراجات",
  "ساحة الساعة",
  "شارع الدبلان",
  "الإنشاءات",
  "عكرمة",
  "الزهراء",
  "جامعة حمص",
];
export const buses = [
  {
    id: 5,
    plate: "412538",
    line: "الكراجات – الجامعة",
    seats: 45,
    driver: "أحمد الخطيب",
    status: "أونلاين",
  },
  {
    id: 9,
    plate: "398201",
    line: "الوعر – ساحة الساعة",
    seats: 45,
    driver: "محمد السيد",
    status: "معطل",
  },
  {
    id: 12,
    plate: "401177",
    line: "المركز – الإنشاءات",
    seats: 40,
    driver: "سامي حداد",
    status: "أونلاين",
  },
  {
    id: 17,
    plate: "420963",
    line: "الكراجات – الجامعة",
    seats: 45,
    driver: "خالد العلي",
    status: "أونلاين",
  },
  {
    id: 22,
    plate: "415820",
    line: "عكرمة – الزهراء",
    seats: 45,
    driver: "يوسف ناصر",
    status: "أونلاين",
  },
  {
    id: 31,
    plate: "433016",
    line: "—",
    seats: 45,
    driver: "—",
    status: "احتياطي",
  },
];
export const drivers = [
  {
    name: "أحمد الخطيب",
    phone: "0933 412 538",
    user: "driver.ahmad.05",
    line: "الكراجات – الجامعة",
    bus: 5,
    status: "بجولة",
  },
  {
    name: "محمد السيد",
    phone: "0944 388 201",
    user: "driver.mhmd.09",
    line: "الوعر – ساحة الساعة",
    bus: 9,
    status: "إعادة تعيين",
  },
  {
    name: "سامي حداد",
    phone: "0955 401 177",
    user: "driver.sami.12",
    line: "المركز – الإنشاءات",
    bus: 12,
    status: "أونلاين",
  },
  {
    name: "خالد العلي",
    phone: "0933 420 963",
    user: "driver.khaled.17",
    line: "الكراجات – الجامعة",
    bus: 17,
    status: "بجولة",
  },
];
export const complaints = [
  {
    id: "C-1042",
    from: "رنا الحسن",
    type: "خصم مكرر",
    cat: "مالية",
    ref: "باص 5 · خط 5",
    date: "اليوم 9:40",
    status: "قيد الانتظار",
  },
  {
    id: "C-1041",
    from: "سامر يوسف",
    type: "خصم بدون ركوب",
    cat: "مالية",
    ref: "باص 2 · خط 9",
    date: "اليوم 8:15",
    status: "قيد الانتظار",
  },
  {
    id: "C-1040",
    from: "ليلى منصور",
    type: "التأخر عن موعد",
    cat: "عامة",
    ref: "—",
    date: "أمس 21:02",
    status: "قيد الانتظار",
  },
  {
    id: "C-1035",
    from: "هبة سليمان",
    type: "سرعة زائدة",
    cat: "عامة",
    ref: "باص 22",
    date: "2 تشرين 2",
    status: "مغلقة",
  },
];
export const tx = [
  {
    id: "TX-88214",
    who: "رنا الحسن",
    line: "الكراجات – الجامعة",
    amount: 2500,
    time: "10:02",
    ok: true,
  },
  {
    id: "TX-88231",
    who: "سامر يوسف",
    line: "الوعر – ساحة الساعة",
    amount: 2500,
    time: "9:58",
    ok: true,
  },
  {
    id: "TX-88230",
    who: "ليل منصور",
    line: "المركز – الإنشاءات",
    amount: 5000,
    time: "9:57",
    ok: true,
  },
  {
    id: "TX-88229",
    who: "أحمد غانم",
    line: "الوعر – ساحة الساعة",
    amount: 2500,
    time: "9:55",
    ok: true,
  },
];
export const byLine = [
  ["الكراجات – الجامعة", 100],
  ["الوعر – ساحة الساعة", 74],
  ["عكرمة – الزهراء", 58],
  ["المركز – الإنشاءات", 41],
  ["القوطة – الحمراء", 30],
];
export const fmt = (n) => n.toLocaleString("en-US");

export let tempLines = lines.map((l, idx) => ({
  ...l,
  id: idx + 1,
  fare: l.fare ?? 1500,
}));

export const setTempLines = (newList) => {
  tempLines = newList;
};

export let tempBuses = buses.map((b, idx) => ({
  ...b,
  id: idx + 1,
}));

export const setTempBuses = (newList) => {
  tempBuses = newList;
};

export let tempDrivers = drivers.map((d, idx) => ({
  ...d,
  id: idx + 1,
  status: d.status === "أوفلاين" ? "أوفلاين" : "أونلاين",
}));

export const setTempDrivers = (newList) => {
  tempDrivers = newList;
};
