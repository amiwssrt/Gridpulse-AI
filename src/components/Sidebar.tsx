import { powerLines } from '../data/mockData';
import { generateReport, generatePredictiveData } from '../utils/aiAnalysis';
import { Activity, ShieldAlert, Cpu, AlertTriangle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  selectedLineId: string | null;
}

export default function Sidebar({ selectedLineId }: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'predictive' | 'lifecycle'>('report');
  
  // Form state
  const [ambientTemp, setAmbientTemp] = useState('42');
  const [windSpeed, setWindSpeed] = useState('0.8');
  const [solarRad, setSolarRad] = useState('850');
  const [ageYears, setAgeYears] = useState('15');
  const [overheatCount, setOverheatCount] = useState('42');
  
  const [predictiveResult, setPredictiveResult] = useState<any>(null);

  const selectedLine = powerLines.find(l => l.id === selectedLineId);

  useEffect(() => {
    // Reset predictive result when line changes
    setPredictiveResult(null);
    if (selectedLine) {
       setAgeYears(selectedLine.state === 'critical' ? '25' : '10');
       setOverheatCount(selectedLine.state === 'critical' ? '85' : '12');
    }
  }, [selectedLineId, selectedLine]);

  if (!selectedLine) {
    return (
      <div className="w-[500px] bg-gray-950 border-l border-gray-800 flex flex-col h-full text-gray-300 p-6 z-10 relative">
        <div className="flex items-center gap-3 text-emerald-500 mb-8">
          <Cpu className="w-6 h-6" />
          <h1 className="text-xl font-bold tracking-wider uppercase">GridPulse AI</h1>
        </div>
        
        <div className="flex flex-col items-center justify-center flex-1 text-center opacity-40">
          <Activity className="w-12 h-12 mb-4 animate-pulse text-emerald-500" />
          <p className="font-mono text-sm uppercase tracking-widest">Ожидание выбора линии...</p>
        </div>
      </div>
    );
  }

  const report = generateReport(selectedLine);

  const handleCalculate = () => {
    // For imitation, we pass some pseudo-overrides based on inputs
    const tempValue = parseFloat(ambientTemp) || 0;
    const baseTemp = selectedLine.state === 'critical' ? 104.5 : (selectedLine.state === 'warning' ? 89.2 : 62.0);
    const tempOffset = (tempValue - 42) * 1.5; // just fake math to make it react
    
    const result = generatePredictiveData(selectedLine, {
      simulatedTemp: Number((baseTemp + tempOffset).toFixed(1)),
      blackoutRisk: Math.min(99.9, Math.max(1, (baseTemp + tempOffset > 90 ? 98 : 30))),
      ageYears: ageYears,
      overheatCount: overheatCount
    });
    setPredictiveResult(result);
  };

  return (
    <div className="w-[500px] bg-gray-950 border-l border-gray-800 flex flex-col h-full text-gray-300 overflow-hidden shadow-2xl z-10 relative">
      <div className="flex items-start justify-between p-6 border-b border-gray-800 shrink-0 bg-gray-950/90 backdrop-blur">
        <div className="flex items-center gap-3 mt-1">
          <Cpu className="w-6 h-6 text-emerald-500 shrink-0" />
          <h1 className="text-xl font-bold tracking-wider uppercase text-emerald-500">GridPulse AI</h1>
        </div>
        <div className="flex items-start gap-2 text-xs font-mono">
          <span className="relative flex h-2 w-2 shrink-0 mt-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-emerald-500 uppercase tracking-widest text-[9px] text-right leading-relaxed max-w-[160px]">
            Симулированные данные и<br/>базы данных
          </span>
        </div>
      </div>

      <div className="flex border-b border-gray-800 shrink-0 bg-gray-950">
        <button 
          onClick={() => setActiveTab('report')}
          className={`flex-1 py-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'report' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-gray-600 hover:text-gray-400'}`}
        >
          Отчет
        </button>
        <button 
          onClick={() => setActiveTab('predictive')}
          className={`flex-1 py-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'predictive' ? 'text-blue-500 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-400'}`}
        >
          Прогноз
        </button>
        <button 
          onClick={() => setActiveTab('lifecycle')}
          className={`flex-1 py-4 text-[10px] sm:text-xs font-bold tracking-widest uppercase transition-colors ${activeTab === 'lifecycle' ? 'text-purple-500 border-b-2 border-purple-500' : 'text-gray-600 hover:text-gray-400'}`}
        >
          Жизненный Цикл
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 font-mono leading-relaxed">
        {activeTab === 'report' && (
          <>
            {selectedLine.state === 'critical' && (
              <div className="mb-6 p-4 bg-red-950/30 border border-red-500/30 rounded-lg flex items-start gap-3 text-red-400">
                <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold uppercase tracking-wider mb-1">Критическая Угроза</div>
                  Обнаружен аномальный нагрев токоведущей жилы. Риск веерного отключения.
                </div>
              </div>
            )}
            <div className="whitespace-pre-wrap text-gray-300 text-[13px] leading-relaxed tracking-wide">
              {report}
            </div>
          </>
        )}
        
        {activeTab === 'predictive' && (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Параметры симуляции (3 часа)
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Температура воздуха (°C)</label>
                    <input 
                      type="number" 
                      value={ambientTemp} 
                      onChange={e => setAmbientTemp(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Скорость ветра (м/с)</label>
                    <input 
                      type="number" 
                      value={windSpeed} 
                      onChange={e => setWindSpeed(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Радиация солнца (Вт/м²)</label>
                    <input 
                      type="number" 
                      value={solarRad} 
                      onChange={e => setSolarRad(e.target.value)}
                      className="w-full bg-gray-950 border border-gray-700 rounded px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleCalculate}
                className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold tracking-widest uppercase rounded transition-colors shadow-[0_0_15px_rgba(37,99,235,0.3)]"
              >
                Рассчитать
              </button>
            </div>

            {predictiveResult && (
              <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 flex flex-col gap-5 text-[13px] text-gray-300">
                <div>
                  <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-1">Идентификатор Актива</h4>
                  <div className="font-bold">{predictiveResult.asset_identity.substation} — {predictiveResult.asset_identity.feeder}</div>
                </div>

                <div className="border-l-2 pl-3 border-blue-500">
                  <h4 className="text-xs text-blue-400 uppercase tracking-widest mb-2">Прогноз через 3 часа</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Температура жилы</div>
                      <div className="text-lg font-bold" style={{ color: predictiveResult.predictive_3hr_simulator.future_map_hex_color }}>
                        {predictiveResult.predictive_3hr_simulator.simulated_core_temp_celsius}°C
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Риск аварии</div>
                      <div className="text-lg font-bold" style={{ color: predictiveResult.predictive_3hr_simulator.future_map_hex_color }}>
                        {predictiveResult.predictive_3hr_simulator.calculated_blackout_risk_percent}%
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-400 leading-relaxed mb-2">{predictiveResult.predictive_3hr_simulator.thermodynamic_justification_ru}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'lifecycle' && (
          <div className="flex flex-col gap-6">
            <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Оценка жизненного цикла
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Календарный возраст (лет)</label>
                    <input 
                      type="number" 
                      value={ageYears} 
                      onChange={e => setAgeYears(e.target.value)}
                      className="w-full bg-gray-950 border border-purple-500/30 rounded px-3 py-2 text-sm text-purple-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Стресс (превышения 75°C)</label>
                    <input 
                      type="number" 
                      value={overheatCount} 
                      onChange={e => setOverheatCount(e.target.value)}
                      className="w-full bg-gray-950 border border-purple-500/30 rounded px-3 py-2 text-sm text-purple-200 focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              <button 
                onClick={handleCalculate}
                className="mt-6 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-bold tracking-widest uppercase rounded transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"
              >
                Рассчитать
              </button>
            </div>

            {predictiveResult && (
              <div className="bg-gray-900/50 p-5 rounded-lg border border-gray-800 flex flex-col gap-5 text-[13px] text-gray-300">
                <div className="border-l-2 pl-3 border-purple-500">
                  <h4 className="text-xs text-purple-400 uppercase tracking-widest mb-2">Оценка Жизненного Цикла</h4>
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-gray-500">Здоровье изоляции</div>
                      <div className="font-bold text-gray-200">{predictiveResult.asset_health_lifecycle_optimizer.current_insulation_health_percentage}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Остаточный ресурс</div>
                      <div className="font-bold text-gray-200">{predictiveResult.asset_health_lifecycle_optimizer.remaining_useful_life_months} мес.</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">Безопасная мощность</div>
                      <div className="font-bold text-gray-200">{predictiveResult.asset_health_lifecycle_optimizer.degraded_safe_power_capacity_mw} МВт</div>
                    </div>
                  </div>
                  <div className="bg-gray-950 p-3 rounded border border-gray-800 mt-4">
                    <p className="text-gray-300 leading-relaxed">{predictiveResult.asset_health_lifecycle_optimizer.maintenance_recommendation_ru}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
