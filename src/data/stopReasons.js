const reasons = [
  { id: 1, description: "Przezbrojenie (zmiana palety)" },
  { id: 2, description: "Czyszczenie głowic (Planowane 2/zm)" },
  { id: 3, description: "Kalibracja palety (problem z wysokoscia)" },
  { id: 4, description: "Czyszczenie palet z farby" },
  { id: 5, description: "Przerwa pracownicza" },
  { id: 6, description: "Brak peinej obsady" },
  { id: 7, description: "Brak plików" },
  { id: 8, description: "Brak farb/spray'u" },
  { id: 9, description: "Brak towaru produkeyinego" },
  { id: 10, description: "Testy technologiczne" },
  { id: 11, description: "Problem z czujnikiem wysokosci głowicy" },
  { id: 12, description: "Czyszczenie Głowic (Paskowanie glowic)" },
  { id: 13, description: "Uderzenie w głowice" },
  { id: 14, description: "Awaria pieca" },
  { id: 15, description: "Błedy systemowe (system POD)" },
  { id: 16, description: "Konserwacja pieca tygodniowa/miesięczna" },
  { id: 17, description: "Konserwacja Kornit tygodniowa/miesięczna" },
  { id: 18, description: "Awaria dysków sieciowych/pradu" },
  { id: 19, description: "Segregaja towaru" },
  { id: 20, description: "Zawieszenie maszyny (restart)" },
  { id: 21, description: "Maszyna wyłączona z pracy (awaria opisana mailowo)" },
  { id: 22, description: "Operatywka" },
  { id: 23, description: "Zalewanie się palety sprayem" },
  { id: 24, description: "Prezbrojenie (zmiana temperatury pieca)" },
  { id: 25, description: "Brak poprzedniej zmiany" },
];

const stopReasons = reasons.map((reason) => ({
  id: reason.id,
  description: `${reason.id}.${reason.description}`,
}));

export default stopReasons;
