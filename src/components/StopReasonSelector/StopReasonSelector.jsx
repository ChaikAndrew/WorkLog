import React from "react";

// Список причин зупинки з відповідними номерами
const stopReasons = [
  { id: 1, description: "Przezbrojenie (zmiana palety)" },
  { id: 2, description: "Czyszczenie gfowic (Planowane 2/zm)" },
  { id: 3, description: "Kalibracja palety (problem z wysokoscia)" },
  { id: 4, description: "Czyszczenie palet z farby" },
  { id: 5, description: "Przerwa pracownicza" },
  { id: 6, description: "Brak peinej obsady" },
  { id: 7, description: "Brak plikow" },
  { id: 8, description: "Brak farb/spray'u" },
  { id: 9, description: "Brak towaru produkeyinego" },
  { id: 10, description: "Testy technologiczne" },
  { id: 11, description: "Problem z czujnikiem wysokosci gfowicy" },
  { id: 12, description: "Czyszczenie Gtowic (Paskowanie glowic)" },
  { id: 13, description: "Uderzenie w gtowice" },
  { id: 14, description: "Awaria pieca" },
  { id: 15, description: "Bledy systemowe (system POD)" },
  { id: 16, description: "Konserwacja pieca tygodniowa/miesieczna" },
  { id: 17, description: "Konserwacja Kornit tygodniowa/miesieczna" },
  { id: 18, description: "Awaria dysków sieciowych/pradu" },
  { id: 19, description: "Segregaja towaru" },
  { id: 20, description: "Zawieszenie maszyny (restart)" },
  { id: 21, description: "Maszyna wylaczona z pracy (awaria opisana mailowo)" },
  { id: 22, description: "Operatywka" },
  { id: 23, description: "Zalewanie sie palety sprayem" },
  { id: 24, description: "Prezbrojenie (zmiana temperatury pieca)" },
];

const StopReasonSelector = ({ onSelectReason }) => {
  return (
    <select onChange={(e) => onSelectReason(parseInt(e.target.value, 10))}>
      <option value="">Select the reason for the stop</option>
      {stopReasons.map((reason) => (
        <option key={reason.id} value={reason.id}>
          {reason.id} - {reason.description}
        </option>
      ))}
    </select>
  );
};

export default StopReasonSelector;
