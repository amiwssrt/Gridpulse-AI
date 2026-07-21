export function generateReport(line: any): string {
  const currentTemp = line.state === 'critical' ? 92.4 : (line.state === 'warning' ? 78.1 : 45.3);
  const remainingHeadroom = line.state === 'critical' ? 0 : (line.state === 'warning' ? 8.1 : 46.7);
  const risk30 = line.state === 'critical' ? 94 : (line.state === 'warning' ? 35 : 2);
  const risk60 = line.state === 'critical' ? 99 : (line.state === 'warning' ? 68 : 5);
  
  const scadaAction = line.state === 'critical' ? 'SHED_LOAD' : (line.state === 'warning' ? 'SHIFT_LOAD' : 'HOLD_LOAD');
  const targetFider = line.state === 'critical' ? 'Ф-14 (ПС Ерменсай)' : 'Н/Д';
  const powerShift = line.state === 'critical' ? '1.8' : '0';
  const pushActive = line.state === 'critical' ? 'Да' : 'Нет';

  return `[СТАТУС ПОДКЛЮЧЕНИЯ К БД] (ИМИТАЦИЯ)
• Синхронизация со SCADA: ОК
• Синхронизация с АСКУЭ: ОК
• Данные Казгидромета: Получены

[МЕТАДАННЫЕ ОБЪЕКТА РК]
• Подстанция: ${line.substationName}
• Линия/Фидер: ${line.fiderCode}
• Район/ЖК привязки: ${line.district}

1. ТЕРМОДИНАМИЧЕСКИЙ АНАЛИЗ (Расчет теплового баланса):
• Расчетная температура жилы кабеля: ${currentTemp}°C
• Номинальный предел марки кабеля: ${line.maxTemp}°C (${line.cableType})
• Текущие потери мощности на нагрев (I²R): ${(line.currentAmps * line.currentAmps * 0.05 / 1000).toFixed(2)} МВт
• Оставшийся термический запас (Headroom): ${remainingHeadroom}%

2. ПРОГНОЗ КАТАСТРОФИЧЕСКОГО СЦЕНАРИЯ:
• Вероятность аварии в течение 30 минут: ${risk30}%
• Вероятность аварии в течение 60 минут: ${risk60}%
• Технический прогноз физики разрушения: Критический перегрев токоведущей жилы вызовет необратимое термическое удлинение металла с превышением габарита провеса. В результате вероятно межфазное короткое замыкание или перекрытие на поросль с последующим отключением масляного выключателя от МТЗ.

3. ИНЖЕНЕРНЫЙ ПРОТОКОЛ ПЕРЕКЛЮЧЕНИЯ SCADA:
• Рекомендуемое действие: ${scadaAction}
• Пошаговая команда для пульта: 1. Включить секционный выключатель СВ-10кВ на ${line.substationName}. 2. Перевести ${powerShift} МВт нагрузки на фидер ${targetFider}. 3. Контролировать переток реактивной мощности.
• Объем мощности для переброски: ${powerShift} МВт
• Целевая резервная линия: ${targetFider}

4. ИНТЕГРАЦИЯ С ПОЛЬЗОВАТЕЛЬСКИМ ПРИЛОЖЕНИЕМ (Demand Response):
• Активация экстренного Пуш-запроса: ${pushActive}
• Целевой периметр (Микрорайон / Конкретные ЖК): ${line.district}
• Необходимое снижение нагрузки на 1 квартиру: 1.5 кВт (Перевод кондиционеров в режим DRY / повышение уставки до 25°C)
`;

  export function generatePredictiveData(line: any, overrides: any = {}) {
  const simulatedTemp = overrides.simulatedTemp || (line.state === 'critical' ? 104.5 : (line.state === 'warning' ? 89.2 : 62.0));
  const blackoutRisk = overrides.blackoutRisk || (line.state === 'critical' ? 98.5 : (line.state === 'warning' ? 45.0 : 5.0));
  const hexColor = line.state === 'critical' ? '#E74C3C' : (line.state === 'warning' ? '#F1C40F' : '#2ECC71');
  
  const justRu = line.state === 'critical' 
    ? "Прогнозируется критический перегрев жилы до 104.5°C через 3 часа из-за пикового спроса АСКУЭ и высоких температур. Риск провисания и КЗ максимален."
    : "Температурный режим в пределах нормы. Ожидается умеренный рост до 62°C к вечернему пику.";

  const ageYears = overrides.ageYears !== undefined ? Number(overrides.ageYears) : (line.state === 'critical' ? 25 : 10);
  const overheatCount = overrides.overheatCount !== undefined ? Number(overrides.overheatCount) : (line.state === 'critical' ? 85 : 12);

  let healthPercentRaw = 100 - (ageYears * 2) - (overheatCount * 0.5);
  const healthPercent = Math.max(0, Math.min(100, Number(healthPercentRaw.toFixed(1))));

  let rulMonthsRaw = Math.floor((healthPercent / 100) * 360) - (overheatCount * 1.5);
  const rulMonths = Math.max(0, Math.floor(rulMonthsRaw));

  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + rulMonths);
  const failDate = currentDate.toISOString().split('T')[0];
  
  let degradedPower = line.activePowerMW * (healthPercent / 100) * 1.2;
  const degradedSafePowerCapacityMw = Math.max(0, Number(degradedPower.toFixed(1)));

  const recRu = healthPercent < 40 
    ? "Критический износ изоляции из-за частых перегревов. Немедленно снизить пропускную способность фидера. Запланировать замену." 
    : "Плановое обслуживание. Состояние актива с учетом термического стресса удовлетворительное.";

    return {
    status: "SUCCESS",
    asset_identity: { substation: line.substationName, feeder: line.fiderCode },
    predictive_3hr_simulator: {
      simulated_core_temp_celsius: simulatedTemp,
      calculated_blackout_risk_percent: blackoutRisk,
      future_map_hex_color: hexColor,
      thermodynamic_justification_ru: justRu
    },
    asset_health_lifecycle_optimizer: {
      current_insulation_health_percentage: healthPercent,
      remaining_useful_life_months: rulMonths,
      estimated_failure_window_date: failDate,
      degraded_safe_power_capacity_mw: degradedSafePowerCapacityMw,
      maintenance_recommendation_ru: recRu
    }
  };
}  
}

