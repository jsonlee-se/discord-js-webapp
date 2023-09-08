let fieldCounter = 1;

document.addEventListener('DOMContentLoaded', () => {
    const fieldsContainer = document.getElementById('fields-container');
    const addFieldButton = document.getElementById('add-field');
    const fetchButton = document.getElementById('fetch-data');
    const messagesContainer = document.getElementById('messages-container');

    const colorInput = document.getElementById('color');
    const embedDiv = document.getElementById('embedDiv');
    const initialColor = colorInput.value;
    
    addFieldButton.addEventListener('click', () => {
        const newField = createField();

        fieldsContainer.appendChild(newField);
    });
    
    fieldsContainer.addEventListener('click', (event) => {
        if (event.target && event.target.className === 'remove-field') {
            event.target.parentElement.remove();
        }
    });

    fetchButton.addEventListener('click', () => {
        fetch('/get-channel-messages')
            .then(response => response.json())
            .then(data => {                
                messagesContainer.innerHTML = '';

                data = data.filter(message => message.embeds.length > 0);
                data = data.sort((a, b) => a.createdTimestamp - b.createdTimestamp);

                data.forEach(message => {
                    const embed = createEmbedFormWithPlaceholders(
                        message.embeds[0].title || '',
                        message.embeds[0].url || '',
                        message.embeds[0].thumbnail ? message.embeds[0].url : '',
                        message.embeds[0].description || '',
                        message.embeds[0].image ? message.embeds[0].image.url : '',
                        message.embeds[0].color || 0x000000,
                        message.embeds[0].footer ? message.embeds[0].footer.text : ''
                    );

                    messagesContainer.appendChild(embed);
                });
            });
    });

    colorInput.style.backgroundColor = initialColor;
    embedDiv.style.borderLeftColor = initialColor;
    embedDiv.style.borderLeftStyle = 'solid';
    embedDiv.style.borderLeftWidth = '5px';

    colorInput.addEventListener('input', function() {
        const selectedColor = colorInput.value;
        colorInput.style.backgroundColor = selectedColor;
        embedDiv.style.borderLeftColor = selectedColor;
        embedDiv.style.borderLeftStyle = 'solid';
        embedDiv.style.borderLeftWidth = '5px';
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

function createEmbedFormWithPlaceholders(title, url, thumbnail, description, image, color, footer) {
    const embed = document.createElement('div');

    // Title
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Title: ';
    
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', 'title');
    titleInput.setAttribute('name', 'title');
    titleInput.setAttribute('placeholder', title);

    // URL
    const urlLabel = document.createElement('label');
    urlLabel.setAttribute('for', 'url');
    urlLabel.textContent = 'URL: ';

    const urlInput = document.createElement('input');
    urlInput.setAttribute('type', 'text');
    urlInput.setAttribute('id', 'url');
    urlInput.setAttribute('name', 'url');
    urlInput.setAttribute('placeholder', url);

    // Thumbnail
    const thumbnailLabel = document.createElement('label');
    thumbnailLabel.setAttribute('for', 'thumbnail');
    thumbnailLabel.textContent = 'Thumbnail: ';

    const thumbnailInput = document.createElement('input');
    thumbnailInput.setAttribute('type', 'text');
    thumbnailInput.setAttribute('id', 'thumbnail');
    thumbnailInput.setAttribute('name', 'thumbnail');
    thumbnailInput.setAttribute('placeholder', thumbnail);

    // Description
    const descriptionLabel = document.createElement('label');
    descriptionLabel.setAttribute('for', 'description');
    descriptionLabel.textContent = 'Description: ';

    const descriptionInput = document.createElement('input');
    descriptionInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('id', 'description');
    descriptionInput.setAttribute('name', 'description');
    descriptionInput.setAttribute('placeholder', description);

    // Image
    const imageLabel = document.createElement('label');
    imageLabel.setAttribute('for', 'image');
    imageLabel.textContent = 'Image: ';

    const imageInput = document.createElement('input');
    imageInput.setAttribute('type', 'text');
    imageInput.setAttribute('id', 'image');
    imageInput.setAttribute('name', 'image');
    imageInput.setAttribute('placeholder', image);

    // Color
    const colorString = "#" + color.toString(16)

    const colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', 'color');
    colorLabel.textContent = 'Color: ';

    const colorInput = document.createElement('input');
    colorInput.setAttribute('type', 'color');
    colorInput.setAttribute('id', 'color');
    colorInput.setAttribute('name', 'color');
    colorInput.setAttribute('value', colorString);
    
    // Footer
    const footerLabel = document.createElement('label');
    footerLabel.setAttribute('for', 'footer');
    footerLabel.textContent = 'Footer: ';

    const footerInput = document.createElement('input');
    footerInput.setAttribute('type', 'text');
    footerInput.setAttribute('id', 'footer');
    footerInput.setAttribute('name', 'footer');
    footerInput.setAttribute('placeholder', footer);

    embed.appendChild(titleLabel);
    embed.appendChild(titleInput);
    embed.appendChild(document.createElement('br'));
    embed.appendChild(urlLabel);
    embed.appendChild(urlInput);
    embed.appendChild(document.createElement('br'));
    embed.appendChild(thumbnailLabel);
    embed.appendChild(thumbnailInput);
    embed.appendChild(document.createElement('br'));
    embed.appendChild(descriptionLabel);
    embed.appendChild(descriptionInput);
    embed.appendChild(document.createElement('br'));
    embed.appendChild(imageLabel);
    embed.appendChild(imageInput);
    embed.appendChild(document.createElement('br'));
    embed.appendChild(colorLabel);
    embed.appendChild(colorInput);
    embed.appendChild(document.createElement('br'));
    embed.appendChild(footerLabel);
    embed.appendChild(footerInput);
    embed.appendChild(document.createElement('br'));
    embed.appendChild(document.createElement('br'));
    
    return embed;
}