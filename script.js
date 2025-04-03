// See ChatGPT Real-time Data and Forms to change the below based on how you code the io platform

document.addEventListener('DOMContentLoaded', () => {
    // Real-Time Data Elements
    const temperatureElement = document.querySelector('.conditions-container p:nth-child(2) span');
    const humidityElement = document.querySelector('.conditions-container p:nth-child(3) span');
    const co2Element = document.querySelector('.conditions-container p:nth-child(4) span');
    const pmElement = document.querySelector('.conditions-container p:nth-child(5) span');
    const noiseElement = document.querySelector('.conditions-container p:nth-child(6) span');

    const chartElement = document.getElementById('sensorChart')?.getContext('2d');

    // Initialize Chart.js for data visualization
    const sensorChart = new Chart(chartElement, {
        type: 'line',
        data: {
            labels: [], // Timestamps
            datasets: [
                { label: 'Temperature (°C)', data: [], borderColor: 'red', fill: false },
                { label: 'Humidity (%)', data: [], borderColor: 'blue', fill: false },
                { label: 'CO₂ (ppm)', data: [], borderColor: 'green', fill: false },
                { label: 'Particulate Matter (µm)', data: [], borderColor: 'purple', fill: false },
                { label: 'Noise (dB)', data: [], borderColor: 'orange', fill: false }
            ]
        }
    });

    // Function to fetch and update sensor data (mock data for now)
    async function fetchSensorData() {
        try {
            const response = await fetch('https://api.thingspeak.com/channels/YOUR_CHANNEL_ID/feeds/last.json?api_key=YOUR_READ_API_KEY'); //or change endpoint
            const data = await response.json();
    
            const parsedData = {
                temperature: parseFloat(data.field1),
                humidity: parseFloat(data.field2),
                co2: parseFloat(data.field3),   // skip if not used
                pm: parseFloat(data.field4),
                noise: parseFloat(data.field5)
            };
    
            const timestamp = new Date().toLocaleTimeString();
    
            if (temperatureElement) temperatureElement.innerText = `${parsedData.temperature} °C`;
            if (humidityElement) humidityElement.innerText = `${parsedData.humidity} %`;
            if (co2Element) co2Element.innerText = `${parsedData.co2 || 'N/A'} ppm`;
            if (pmElement) pmElement.innerText = `${parsedData.pm} µm`;
            if (noiseElement) noiseElement.innerText = `${parsedData.noise} dB`;
    
            sensorChart.data.labels.push(timestamp);
            sensorChart.data.datasets[0].data.push(parsedData.temperature);
            sensorChart.data.datasets[1].data.push(parsedData.humidity);
            sensorChart.data.datasets[2].data.push(parsedData.co2 || null);
            sensorChart.data.datasets[3].data.push(parsedData.pm);
            sensorChart.data.datasets[4].data.push(parsedData.noise);
            
            // limit chart to 50 data points
            if (sensorChart.data.labels.length > 50) {
                sensorChart.data.labels.shift();
                sensorChart.data.datasets.forEach(ds => ds.data.shift());
            }            

            sensorChart.update();
        } catch (error) {
            console.error('Error fetching sensor data:', error);
            if (temperatureElement) temperatureElement.innerText = 'N/A';
            if (humidityElement) humidityElement.innerText = 'N/A';
            if (co2Element) co2Element.innerText = 'N/A';
            if (pmElement) pmElement.innerText = 'N/A';
            if (noiseElement) noiseElement.innerText = 'N/A';
        }
    }
    

    // Update data every 5 seconds
    setInterval(fetchSensorData, 5000);


});
