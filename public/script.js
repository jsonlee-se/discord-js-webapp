let fieldCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    const fieldsContainer = document.getElementById('fields-container');
    const addFieldButton = document.getElementById('add-field');
    const fetchButton = document.getElementById('fetch-data');
    
    addFieldButton.addEventListener('click', () => {
        const newField = createField();
        fieldsContainer.appendChild(newField);
    });
    
    fieldsContainer.addEventListener('click', (event) => {
        if (event.target && event.target.className === 'remove-field') {
            // Remove the clicked field
            event.target.parentElement.remove();
        }
    });

    fetchButton.addEventListener('click', () => {
        // When the button is clicked, fetch JSON data
        fetch('/get-channel-messages')
            .then(response => response.json())
            .then(data => {
                // Handle the JSON data here (e.g., update the page content)
                console.log(data);
            })
            .catch(error => {
                console.error('Error fetching JSON data:', error);
            });
    });
});

function createField() {
    const field = document.createElement('div');
    
    // Label
    const label = document.createElement('label');
    label.setAttribute('for', `field_${fieldCounter}`);
    label.textContent = `Field ${fieldCounter}: `;
    
    // Input
    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', `field_${fieldCounter}`);
    input.setAttribute('name', `field_${fieldCounter}`);
    
    // Remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-field';
    removeButton.textContent = 'Remove';
    
    field.appendChild(label);
    field.appendChild(input);
    field.appendChild(removeButton);
    
    fieldCounter++; 
    return field;
}

