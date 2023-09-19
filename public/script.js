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
        if (event.target && event.target.className === 'remove-field red-discord-button mt-1 ml-2') {
            event.target.parentElement.parentElement.remove();
            fieldCounter--;
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
    label.textContent = `Field ${fieldCounter} `;
    label.className = 'font-bold w-full';
    
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'container';

    // Title
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', `field_${fieldCounter}_title`);
    titleInput.setAttribute('name', `field_${fieldCounter}_title`);
    titleInput.setAttribute('placeholder', 'Title');
    titleInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';

    // Description
    const description = document.createElement('input');
    description.setAttribute('type', 'text');
    description.setAttribute('id', `field_${fieldCounter}`);
    description.setAttribute('name', `field_${fieldCounter}`);
    description.setAttribute('placeholder', 'Description');
    description.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';
    
    // Inline Checkbox
    // <div class="checkbox-wrapper-10">
    //   <input class="tgl tgl-flip" id="cb5" type="checkbox" checked />
    //   <label class="tgl-btn" data-tg-off="Nope" data-tg-on="Yeah!" for="cb5"></label>
    // </div>

    const inlineButtonDiv = document.createElement('div');
    inlineButtonDiv.className = 'checkbox-wrapper-10 mt-1 ml-2';

    const inlineButton = document.createElement('input');
    inlineButton.className = 'tgl tgl-flip';
    inlineButton.setAttribute('id', `field_${fieldCounter}_inline`);
    inlineButton.setAttribute('type', 'checkbox');
    inlineButton.checked = true;

    const inlineButtonLabel = document.createElement('label');
    inlineButtonLabel.className = 'tgl-btn';
    inlineButtonLabel.setAttribute('data-tg-off', '!Inline');
    inlineButtonLabel.setAttribute('data-tg-on', 'Inline');
    inlineButtonLabel.setAttribute('for', `field_${fieldCounter}_inline`);

    inlineButtonDiv.appendChild(inlineButton);
    inlineButtonDiv.appendChild(inlineButtonLabel);

    // Remove button
    const removeButton = document.createElement('button');
    removeButton.className = 'remove-field red-discord-button mt-1 ml-2';
    removeButton.textContent = 'Remove';
    removeButton.type = 'button';
    


    field.appendChild(label);
    field.appendChild(document.createElement('br'));

    fieldContainer.appendChild(titleInput);
    fieldContainer.appendChild(inlineButtonDiv);
    fieldContainer.appendChild(removeButton);
    field.appendChild(fieldContainer);

    field.appendChild(description);
    field.appendChild(document.createElement('br'));
    field.appendChild(document.createElement('br'));
    
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