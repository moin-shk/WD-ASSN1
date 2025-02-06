document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');

    // Tab switching logic
    tabs.forEach(tab => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            tabContents.forEach(content => content.classList.add('hidden'));
            document.getElementById(tab.dataset.tab).classList.remove('hidden');
        });
    });

    // Higher-order conversion function as per requirements
    const createConverter = (fromUnit, toUnit) => {
        const conversions = {
            // Weight conversions
            'kg-lb': value => value * 2.20462,
            'lb-kg': value => value * 0.453592,
            // Distance conversions
            'miles-km': value => value * 1.60934,
            'km-miles': value => value * 0.621371,
            // Temperature conversions
            'celsius-fahrenheit': value => (value * 9/5) + 32,
            'fahrenheit-celsius': value => (value - 32) * 5/9
        };

        const converter = conversions[`${fromUnit}-${toUnit}`];
        
        // Return arrow function that handles both single values and arrays
        return (input) => {
            if (Array.isArray(input)) {
                return input.map(val => Number(converter(val)).toFixed(2));
            }
            return Number(converter(input)).toFixed(2);
        };
    };

    // Function to handle form submission
    const handleConversion = (inputId, fromId, toId, resultId) => {
        const input = document.getElementById(inputId).value;
        const fromUnit = document.getElementById(fromId).value;
        const toUnit = document.getElementById(toId).value;
        const resultDiv = document.getElementById(resultId);

        try {
            // Check if input contains multiple values
            const values = input.includes(',') ? 
                input.split(',').map(v => parseFloat(v.trim())) :
                parseFloat(input);

            // Validate input
            if (Array.isArray(values) && values.some(isNaN)) {
                throw new Error('Please enter valid numbers separated by commas');
            } else if (!Array.isArray(values) && isNaN(values)) {
                throw new Error('Please enter a valid number');
            }

            // Create and use converter
            const converter = createConverter(fromUnit, toUnit);
            const result = converter(values);

            // Display results
            if (Array.isArray(result)) {
                resultDiv.textContent = `Results: ${result.join(', ')} ${toUnit}`;
            } else {
                resultDiv.textContent = `Result: ${result} ${toUnit}`;
            }
        } catch (error) {
            resultDiv.textContent = error.message;
        }
    };

    // Add event listeners to conversion buttons
    document.getElementById('weightConvert').addEventListener('click', () => {
        handleConversion('weightInput', 'weightFrom', 'weightTo', 'weightResult');
    });

    document.getElementById('distanceConvert').addEventListener('click', () => {
        handleConversion('distanceInput', 'distanceFrom', 'distanceTo', 'distanceResult');
    });

    document.getElementById('temperatureConvert').addEventListener('click', () => {
        handleConversion('temperatureInput', 'temperatureFrom', 'temperatureTo', 'temperatureResult');
    });
});