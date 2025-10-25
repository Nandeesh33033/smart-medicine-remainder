import React, { useState } from 'react';
import type { Medicine, Schedule, FoodInstruction } from '../types';

interface AddMedicineFormProps {
  onAddMedicine: (med: Omit<Medicine, 'id'>) => void;
}

const AddMedicineForm: React.FC<AddMedicineFormProps> = ({ onAddMedicine }) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [foodInstruction, setFoodInstruction] = useState<FoodInstruction>('after');
  const [schedules, setSchedules] = useState<Schedule[]>([{ days: [], time: '08:00' }]);
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dosage || schedules.some(s => s.days.length === 0)) {
        alert('Please fill all required fields.');
        return;
    }
    
    onAddMedicine({
      name,
      dosage: parseInt(dosage),
      foodInstruction,
      schedules,
      imageUrl: image ? URL.createObjectURL(image) : undefined,
      audioUrl: audio ? URL.createObjectURL(audio) : undefined,
    });
  };

  // FIX: The original implementation was not type-safe and mutated state directly.
  // This implementation is type-safe, handles only 'time' changes as intended,
  // and follows React's immutable update pattern.
  const handleScheduleChange = (index: number, field: keyof Schedule, value: string) => {
    if (field === 'time') {
      const newSchedules = schedules.map((schedule, i) => {
        if (i === index) {
          return { ...schedule, time: value };
        }
        return schedule;
      });
      setSchedules(newSchedules);
    }
  };
  
  // FIX: The original implementation mutated state directly (using .push).
  // This version uses an immutable pattern for updating the days array.
  const handleDayToggle = (scheduleIndex: number, day: Schedule['days'][0]) => {
    const newSchedules = schedules.map((schedule, i) => {
      if (i === scheduleIndex) {
        const days = schedule.days;
        const newDays = days.includes(day)
          ? days.filter(d => d !== day)
          : [...days, day];
        return { ...schedule, days: newDays };
      }
      return schedule;
    });
    setSchedules(newSchedules);
  };
  
  const DayButton: React.FC<{ day: Schedule['days'][0], selected: boolean, onClick: () => void}> = ({ day, selected, onClick}) => (
    <button type="button" onClick={onClick} className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors ${selected ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{day.slice(0,1)}</button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Dosage (mg)</label>
          <input type="number" value={dosage} onChange={e => setDosage(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Instructions</label>
        <select value={foodInstruction} onChange={e => setFoodInstruction(e.target.value as FoodInstruction)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2">
          <option value="before">Before Food</option>
          <option value="after">After Food</option>
        </select>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Schedules</h3>
        {schedules.map((schedule, index) => {
          const [h24, m] = schedule.time.split(':');
          const hour = parseInt(h24, 10);
          const minute = parseInt(m, 10);
          const period = hour >= 12 ? 'PM' : 'AM';
          let hour12 = hour % 12;
          if (hour12 === 0) hour12 = 12;

          const handleTimeChange = (part: 'hour' | 'minute' | 'period', value: string) => {
            let currentHour12 = hour12;
            let currentMinute = minute;
            let currentPeriod = period;

            if (part === 'hour') {
              currentHour12 = parseInt(value, 10);
            } else if (part === 'minute') {
              currentMinute = parseInt(value, 10);
            } else {
              currentPeriod = value;
            }

            let newHour24 = currentHour12;
            if (currentPeriod === 'PM' && newHour24 !== 12) {
              newHour24 += 12;
            }
            if (currentPeriod === 'AM' && newHour24 === 12) {
              newHour24 = 0;
            }

            const newTime = `${String(newHour24).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
            handleScheduleChange(index, 'time', newTime);
          };

          return (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-gray-50">
               <div className="flex items-center gap-4">
                   <label className="text-sm font-medium text-gray-700">Time:</label>
                   <div className="flex items-center gap-2">
                      <select value={hour12} onChange={(e) => handleTimeChange('hour', e.target.value)} className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                      <span className="font-bold">:</span>
                      <select value={minute} onChange={(e) => handleTimeChange('minute', e.target.value)} className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2">
                          {Array.from({ length: 60 }, (_, i) => i).map(min => <option key={min} value={min}>{String(min).padStart(2, '0')}</option>)}
                      </select>
                      <select value={period} onChange={(e) => handleTimeChange('period', e.target.value)} className="block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2">
                          <option value="AM">AM</option>
                          <option value="PM">PM</option>
                      </select>
                   </div>
               </div>
               <div className="flex items-center gap-2 flex-wrap">
                  <label className="text-sm font-medium text-gray-700">Days:</label>
                  {(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const).map(day => 
                      <DayButton key={day} day={day} selected={schedule.days.includes(day)} onClick={() => handleDayToggle(index, day)} />
                  )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Image of Medicine</label>
            <input type="file" accept="image/*" onChange={e => setImage(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-700">Audio Recording (e.g., "Take your morning pills")</label>
            <input type="file" accept="audio/*" onChange={e => setAudio(e.target.files ? e.target.files[0] : null)} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"/>
          </div>
      </div>
      
      <div className="text-right">
        <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md">
          Save Medicine
        </button>
      </div>
    </form>
  );
};

export default AddMedicineForm;