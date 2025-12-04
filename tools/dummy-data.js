document.addEventListener('DOMContentLoaded', () => {
    const dataTypeSelect = document.getElementById('dataType');
    const countSlider = document.getElementById('count');
    const countValue = document.getElementById('countValue');
    const jsonFormatCheckbox = document.getElementById('jsonFormat');
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const copyBtn = document.getElementById('copyBtn');
    const outputTextarea = document.getElementById('output');

    // Sample data arrays
    const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
    const streets = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave', 'Lake St', 'Hill Rd'];
    const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'];
    const states = ['NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
    const companies = ['Tech Corp', 'Global Industries', 'Innovation Labs', 'Digital Solutions', 'Smart Systems', 'Future Enterprises', 'Quantum Group', 'Nexus Technologies', 'Prime Ventures', 'Apex Corporation'];
    const domains = ['example.com', 'test.com', 'demo.com', 'sample.net', 'mail.com'];
    const loremWords = ['lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua'];

    // Update count display
    countSlider.addEventListener('input', (e) => {
        countValue.textContent = e.target.value;
    });

    // Random selection helper
    function randomFrom(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    // Generate person data
    function generatePerson() {
        const firstName = randomFrom(firstNames);
        const lastName = randomFrom(lastNames);
        return {
            name: `${firstName} ${lastName}`,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${randomFrom(domains)}`,
            phone: `(${Math.floor(Math.random() * 900 + 100)}) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`
        };
    }

    // Generate address data
    function generateAddress() {
        return {
            street: `${Math.floor(Math.random() * 9999 + 1)} ${randomFrom(streets)}`,
            city: randomFrom(cities),
            state: randomFrom(states),
            zipCode: String(Math.floor(Math.random() * 90000 + 10000))
        };
    }

    // Generate company data
    function generateCompany() {
        return {
            name: randomFrom(companies),
            industry: randomFrom(['Technology', 'Finance', 'Healthcare', 'Retail', 'Manufacturing']),
            employees: Math.floor(Math.random() * 5000 + 50),
            website: `www.${randomFrom(companies).toLowerCase().replace(' ', '')}.com`
        };
    }

    // Generate internet data
    function generateInternet() {
        const firstName = randomFrom(firstNames).toLowerCase();
        const lastName = randomFrom(lastNames).toLowerCase();
        return {
            username: `${firstName}${Math.floor(Math.random() * 999)}`,
            email: `${firstName}.${lastName}@${randomFrom(domains)}`,
            url: `https://www.${firstName}${lastName}.${randomFrom(['com', 'net', 'org'])}`
        };
    }

    // Generate lorem ipsum
    function generateLorem() {
        const wordCount = Math.floor(Math.random() * 20 + 10);
        const words = [];
        for (let i = 0; i < wordCount; i++) {
            words.push(randomFrom(loremWords));
        }
        return { text: words.join(' ') + '.' };
    }

    // Generate data
    generateBtn.addEventListener('click', () => {
        const dataType = dataTypeSelect.value;
        const count = parseInt(countSlider.value);
        const asJSON = jsonFormatCheckbox.checked;
        
        const data = [];
        
        for (let i = 0; i < count; i++) {
            switch (dataType) {
                case 'person':
                    data.push(generatePerson());
                    break;
                case 'address':
                    data.push(generateAddress());
                    break;
                case 'company':
                    data.push(generateCompany());
                    break;
                case 'internet':
                    data.push(generateInternet());
                    break;
                case 'lorem':
                    data.push(generateLorem());
                    break;
            }
        }
        
        // Format output
        if (asJSON) {
            outputTextarea.value = JSON.stringify(data, null, 2);
        } else {
            const lines = data.map((item, index) => {
                const fields = Object.entries(item).map(([key, value]) => `${key}: ${value}`).join(', ');
                return `${index + 1}. ${fields}`;
            });
            outputTextarea.value = lines.join('\n\n');
        }
    });

    // Clear
    clearBtn.addEventListener('click', () => {
        outputTextarea.value = '';
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        const output = outputTextarea.value;
        
        if (!output) {
            showToast('Nothing to copy!');
            return;
        }
        
        navigator.clipboard.writeText(output)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            })
            .catch(() => {
                outputTextarea.select();
                document.execCommand('copy');
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy to Clipboard';
                }, 2000);
            });
    });

    // Toast notification function (errors only)
    function showToast(message) {
        const existingToast = document.querySelector('.toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // Generate initial data
    generateBtn.click();
});

document.querySelectorAll('input[type="range"]').forEach(slider => {
  const update = () => {
    const min = Number(slider.min ?? 0);
    const max = Number(slider.max ?? 100);
    const val = Number(slider.value);
    const pct = ( (val - min) / (max - min) ) * 100;
    // Use a percent string for the CSS var
    slider.style.setProperty('--pct', pct + '%');
  };

  slider.addEventListener('input', update, { passive: true });
  // initialize on page load
  update();
});