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
  
    // Higher-order conversion function
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
  
      return (input) => {
        if (Array.isArray(input)) {
          return input.map(val => Number(converter(val)).toFixed(2));
        }
        return Number(converter(input)).toFixed(2);
      };
    };
  
    const handleConversion = (singleInputId, listInputId, fromId, toId, resultId) => {
      const singleValueStr = document.getElementById(singleInputId).value;
      const listValueStr = document.getElementById(listInputId).value;
      const resultDiv = document.getElementById(resultId);

      // it will use the list if provided, if not will use the single value
      const input = listValueStr.trim() !== '' ? listValueStr : singleValueStr;
      const fromUnit = document.getElementById(fromId).value;
      const toUnit = document.getElementById(toId).value;
  
      // Check if converting from the same unit to the same unit
      if (fromUnit === toUnit) {
        resultDiv.textContent = "Error: Please select different units for conversion.";
        return;
      }
  
      try {
        // is it one value or list of values
        const values = input.includes(',')
          ? input.split(',').map(v => parseFloat(v.trim()))
          : parseFloat(input);
  
        // Validate input values
        if (Array.isArray(values) && values.some(isNaN)) {
          throw new Error('Please enter valid numbers separated by commas');
        } else if (!Array.isArray(values) && isNaN(values)) {
          throw new Error('Please enter a valid number');
        }
  
        // converter
        const converter = createConverter(fromUnit, toUnit);
        const result = converter(values);
  
        // Display the results
        if (Array.isArray(result)) {
          resultDiv.textContent = `Results: ${result.join(', ')} ${toUnit}`;
        } else {
          resultDiv.textContent = `Result: ${result} ${toUnit}`;
        }
      } catch (error) {
        resultDiv.textContent = error.message;
      }
    };
  
    document.getElementById('weightConvert').addEventListener('click', () => {
      handleConversion('weightInput', 'weightList', 'weightFrom', 'weightTo', 'weightResult');
    });
  
    document.getElementById('distanceConvert').addEventListener('click', () => {
      handleConversion('distanceInput', 'distanceList', 'distanceFrom', 'distanceTo', 'distanceResult');
    });
  
    document.getElementById('temperatureConvert').addEventListener('click', () => {
      handleConversion('temperatureInput', 'temperatureList', 'temperatureFrom', 'temperatureTo', 'temperatureResult');
    });
  });
  
