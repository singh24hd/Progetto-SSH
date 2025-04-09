import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { Bar } from 'react-chartjs-2';
import 'react-calendar/dist/Calendar.css';
import './AttendancePage.css';

const AttendancePage = () => {
  // Stato per memorizzare le presenze
  // Si assume che ogni record abbia: { date: 'YYYY-MM-DD', present: boolean, hours: number }
  const [attendanceData, setAttendanceData] = useState([]);
  const [totalHours, setTotalHours] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    // Simula il recupero dati da API (sostituisci 'API_ATTENDANCE' con l'endpoint reale)
    const fetchAttendanceData = async () => {
      try {
        const response = await fetch('API_ATTENDANCE');
        const data = await response.json();
        // Imposta i dati di presenze
        setAttendanceData(data);

        // Calcola le ore totali frequentate (somma delle ore dei giorni in cui "present" è true)
        const total = data.reduce((acc, entry) => entry.present ? acc + entry.hours : acc, 0);
        setTotalHours(total);

        // Crea i dati per il grafico: per semplicità creiamo le etichette con le date e associamo le ore se presente (altrimenti 0)
        const labels = data.map(entry => entry.date);
        const hours = data.map(entry => entry.present ? entry.hours : 0);
        const barColors = data.map(entry => entry.present ? 'green' : 'red');

        setChartData({
          labels,
          datasets: [{
            label: 'Ore frequentate',
            data: hours,
            backgroundColor: barColors
          }]
        });
      } catch (error) {
        console.error('Errore nel recupero dei dati delle presenze:', error);
      }
    };

    fetchAttendanceData();
  }, []);

  // Funzione per assegnare una classe al tile del calendario in base alla presenza
  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      // Cerca la data nel set dei dati (confronto per toDateString)
      const attendanceEntry = attendanceData.find(entry => {
        return new Date(entry.date).toDateString() === date.toDateString();
      });
      if (attendanceEntry) {
        return attendanceEntry.present ? 'present' : 'absent';
      }
    }
    return '';
  };

  return (
    <div className="attendance-container">
      <div className="attendance-form">
        <h2 className="attendance-title">Presenze dello Studente</h2>

        <div className="attendance-chart">
          {chartData ? (
            <Bar
              data={chartData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'top' },
                  title: { display: true, text: 'Ore frequentate per giorno' }
                }
              }}
            />
          ) : (
            <p>Caricamento dati per il grafico...</p>
          )}
        </div>

        <div className="attendance-calendar">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            tileClassName={tileClassName}
          />
        </div>

        <div className="attendance-summary">
          <strong>Totale Ore Frequentate: </strong> {totalHours}
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
