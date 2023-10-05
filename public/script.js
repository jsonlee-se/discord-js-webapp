let fieldCounter = 1;
let embedCounter = 0;

document.addEventListener('DOMContentLoaded', () => {
    const fieldsContainer = document.getElementById('fields-container');
    const addFieldButton = document.getElementById('add-field');
    const fetchButton = document.getElementById('fetch-data');
    const messagesContainer = document.getElementById('messages-container');
    const sendMessageForm = document.getElementById('sendMessage');
    

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

    sendMessageForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const fields = [];

        for (const child of fieldsContainer.children) {
            if (child.fieldObject) {
                fields.push({
                    name: child.fieldObject.title ? child.fieldObject.title.value : '',
                    value: child.fieldObject.description ? child.fieldObject.description.value : '',
                    inline: child.fieldObject.inline ? child.fieldObject.inline.checked : true
                });
            }
        }

        sendMessageForm.elements.fields.value = JSON.stringify(fields);

        sendMessageForm.submit();
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
                        message.embeds[0].footer ? message.embeds[0].footer.text : '',
                        message.embeds[0].fields ? JSON.stringify(message.embeds[0].fields) : '',
                        message.id || ''
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

function createField(title = '', des = '', inline = true) {
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
    titleInput.setAttribute('value', title);
    titleInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';

    // Description
    const description = document.createElement('input');
    description.setAttribute('type', 'text');
    description.setAttribute('id', `field_${fieldCounter}`);
    description.setAttribute('name', `field_${fieldCounter}`);
    description.setAttribute('value', des);
    description.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';
    
    // Inline Checkbox
    const inlineButtonDiv = document.createElement('div');
    inlineButtonDiv.className = 'checkbox-wrapper-10 mt-1 ml-2';

    const inlineButton = document.createElement('input');
    inlineButton.className = 'tgl tgl-flip';
    inlineButton.setAttribute('id', `field_${fieldCounter}_inline`);
    inlineButton.setAttribute('type', 'checkbox');
    inlineButton.checked = inline;

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

    const fieldObject = {
        title: titleInput,
        description: description,
        inline: inlineButton
    };

    field.fieldObject = fieldObject;
    return field;
}

function createEmbedFormWithPlaceholders(title, url, thumbnail, description, image, color, footer, fields, message_id) {
    const embedDiv = document.createElement('div');
    embedDiv.className = 'mb-2';


    const embedForm = document.createElement('form');

    embedForm.setAttribute('action', '/edit-embed');
    embedForm.setAttribute('method', 'POST');
    embedForm.setAttribute('id', `embed_${embedCounter}`);

    const embedBody = document.createElement('div');
    embedBody.className = 'bg-dark-3 border-1-4 rounded-md';
    embedBody.style.position = 'relative';
    embedBody.style.padding = '0.75rem';

    // hidden input with message id
    const messageIdInput = document.createElement('input');
    messageIdInput.setAttribute('type', 'hidden');
    messageIdInput.setAttribute('id', 'messageId');
    messageIdInput.setAttribute('name', 'messageId');
    messageIdInput.setAttribute('value', message_id);

    // Title
    const titleLabel = document.createElement('label');
    titleLabel.setAttribute('for', 'title');
    titleLabel.textContent = 'Title';
    titleLabel.className = 'font-bold';
    
    const titleInput = document.createElement('input');
    titleInput.setAttribute('type', 'text');
    titleInput.setAttribute('id', 'title');
    titleInput.setAttribute('name', 'title');
    titleInput.setAttribute('value', title);
    titleInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white'; 

    // Description
    const descriptionLabel = document.createElement('label');
    descriptionLabel.setAttribute('for', 'description');
    descriptionLabel.textContent = 'Description';
    descriptionLabel.className = 'font-bold';

    const descriptionInput = document.createElement('input');
    descriptionInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('id', 'description');
    descriptionInput.setAttribute('name', 'description');
    descriptionInput.setAttribute('value', description);
    descriptionInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';

    // URLS AND Thumbnail DIV
    const urlDiv = document.createElement('div');
    urlDiv.className = 'container';
    const urlTitleLeft = document.createElement('div');
    urlTitleLeft.className = 'inline-div';
    const urlThumbnailRight = document.createElement('div');
    urlThumbnailRight.className = 'inline-div pl-2';

    // URL
    const urlLabel = document.createElement('label');
    urlLabel.setAttribute('for', 'url');
    urlLabel.textContent = 'Title URL';
    urlLabel.className = 'font-bold';

    const urlInput = document.createElement('input');
    urlInput.setAttribute('type', 'text');
    urlInput.setAttribute('id', 'url');
    urlInput.setAttribute('name', 'url');
    urlInput.setAttribute('value', url);
    urlInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';
    
    urlTitleLeft.appendChild(urlLabel);
    urlTitleLeft.appendChild(urlInput);

    // Thumbnail
    const thumbnailLabel = document.createElement('label');
    thumbnailLabel.setAttribute('for', 'thumbnail');
    thumbnailLabel.textContent = 'Thumbnail URL';
    thumbnailLabel.className = 'font-bold';

    const thumbnailInput = document.createElement('input');
    thumbnailInput.setAttribute('type', 'text');
    thumbnailInput.setAttribute('id', 'thumbnail');
    thumbnailInput.setAttribute('name', 'thumbnail');
    thumbnailInput.setAttribute('value', thumbnail);
    thumbnailInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';
    
    urlThumbnailRight.appendChild(thumbnailLabel);
    urlThumbnailRight.appendChild(thumbnailInput);

    urlDiv.appendChild(urlTitleLeft);
    urlDiv.appendChild(urlThumbnailRight);

    // Image and Color DIV
    const imageColorDiv = document.createElement('div');
    imageColorDiv.className = 'container';
    const imageColorLeft = document.createElement('div');
    imageColorLeft.className = 'inline-div';
    const imageColorRight = document.createElement('div');
    imageColorRight.className = 'inline-div pl-2';

    // Image
    const imageLabel = document.createElement('label');
    imageLabel.setAttribute('for', 'image');
    imageLabel.textContent = 'Image URL';
    imageLabel.className = 'font-bold';

    const imageInput = document.createElement('input');
    imageInput.setAttribute('type', 'text');
    imageInput.setAttribute('id', 'image');
    imageInput.setAttribute('name', 'image');
    imageInput.setAttribute('value', image);
    imageInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';

    imageColorLeft.appendChild(imageLabel);
    imageColorLeft.appendChild(imageInput);

    // Color
    var colorString;
    if (color === 0) {
        colorString = "#000000";
    }
    else {
        colorString = "#" + color.toString(16)
    }

    const colorLabel = document.createElement('label');
    colorLabel.setAttribute('for', 'color');
    colorLabel.textContent = 'Color';
    colorLabel.className = 'font-bold';

    const colorInput = document.createElement('input');
    colorInput.setAttribute('type', 'color');
    colorInput.setAttribute('id', 'color');
    colorInput.setAttribute('name', 'color');
    colorInput.setAttribute('value', colorString);
    colorInput.className = 'rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white h-25em';

    colorInput.style.backgroundColor = colorString;
    embedBody.style.borderLeftColor = colorString;
    embedBody.style.borderLeftStyle = 'solid';
    embedBody.style.borderLeftWidth = '5px';

    colorInput.addEventListener('input', function() {
        const selectedColor = colorInput.value;
        colorInput.style.backgroundColor = selectedColor;
        embedBody.style.borderLeftColor = selectedColor;
        embedBody.style.borderLeftStyle = 'solid';
        embedBody.style.borderLeftWidth = '5px';
    });
    
    imageColorRight.appendChild(colorLabel);
    imageColorRight.appendChild(colorInput);

    imageColorDiv.appendChild(imageColorLeft);
    imageColorDiv.appendChild(imageColorRight);
    
    // Footer
    const footerLabel = document.createElement('label');
    footerLabel.setAttribute('for', 'footer');
    footerLabel.textContent = 'Footer';
    footerLabel.className = 'font-bold';

    const footerInput = document.createElement('input');
    footerInput.setAttribute('type', 'text');
    footerInput.setAttribute('id', 'footer');
    footerInput.setAttribute('name', 'footer');
    footerInput.setAttribute('value', footer);
    footerInput.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';

    // fields
    const embedFieldsContainer = document.createElement('div');
    embedFieldsContainer.setAttribute('id', 'embedFields-container');

    if (fields !== null && fields !== '') {
        const parsedFields = JSON.parse(fields);
        parsedFields.forEach(field => {
            embedFieldsContainer.append(createField(field.name, field.value, field.inline));
        });
    }

    // hidden input with fields
    const fieldsInput = document.createElement('input');
    fieldsInput.setAttribute('type', 'hidden');
    fieldsInput.setAttribute('id', 'fields');
    fieldsInput.setAttribute('name', 'fields');
    fieldsInput.setAttribute('value', fields);

    // add field button
    const addFieldButton = document.createElement('button');
    addFieldButton.className = 'green-discord-button';
    addFieldButton.textContent = 'Add Field';
    addFieldButton.type = 'button';
    addFieldButton.addEventListener('click', () => {
        const newField = createField();

        embedFieldsContainer.appendChild(newField);
    });

    embedFieldsContainer.addEventListener('click', (event) => {
        if (event.target && event.target.className === 'remove-field red-discord-button mt-1 ml-2') {
            event.target.parentElement.parentElement.remove();
            fieldCounter--;
        }
    });

    // edit button
    const editButton = document.createElement('button');
    editButton.className = 'edit-embed-button discord-button font-bold mt-1';
    editButton.textContent = 'Edit ';
    editButton.type = 'button';

    // edit icon
    const editIcon = document.createElement('i');
    editIcon.className = 'fi fi-rr-pencil';
    editButton.appendChild(editIcon);

    editButton.addEventListener('click', () => {
        const embedData = {
            title: titleInput.value || '',
            url: urlInput.value || '',
            thumbnail: thumbnailInput.value || '',
            description: descriptionInput.value || '',
            image: imageInput.value || '',
            color: colorInput.value || 0x000000, // Convert hex to decimal
            footer: footerInput.value || '',
            messageId: messageIdInput.value || '',

        };
        const editedFields = [];

        for (const child of embedFieldsContainer.children) {
            if (child.fieldObject) {
                editedFields.push({
                    name: child.fieldObject.title ? child.fieldObject.title.value : '',
                    value: child.fieldObject.description ? child.fieldObject.description.value : '',
                    inline: child.fieldObject.inline ? child.fieldObject.inline.checked : true
                });
            }
        }
        // TODO
        console.log(embedData.color);

        embedForm.elements.title.value = embedData.title;
        embedForm.elements.url.value = embedData.url;
        embedForm.elements.thumbnail.value = embedData.thumbnail;
        embedForm.elements.description.value = embedData.description;
        embedForm.elements.image.value = embedData.image;
        embedForm.elements.color.value = embedData.color;
        embedForm.elements.footer.value = embedData.footer;
        embedForm.elements.messageId.value = embedData.messageId;
        embedForm.elements.fields.value = JSON.stringify(editedFields);

        embedForm.submit();
    });

    //  Accordion

    const accordionDiv = document.createElement('div');

    const accordionLabel = document.createElement('label');
    accordionLabel.className = 'font-bold';
    accordionLabel.textContent = ' : ' + title;


    const accordionState = document.createElement('input');
    accordionState.setAttribute('type', 'checkbox');
    accordionState.hidden = true;
    accordionState.checked = true;

    const accordionIcon = document.createElement('i');
    accordionIcon.className = 'fi fi-rr-angle-small-right';

    const accordionBody = document.createElement('div');
    accordionBody.className = 'accordion-body';

    accordionDiv.appendChild(accordionIcon);
    accordionDiv.appendChild(titleLabel);
    accordionDiv.appendChild(accordionLabel);

    accordionDiv.addEventListener('click', () => {
        if (accordionState.checked) {
            accordionIcon.className = 'fi fi-rr-angle-small-down';
            accordionBody.style.maxHeight = getMaxHeightToChildren(embedDiv);
            accordionState.checked = false;
        } else {
            accordionIcon.className = 'fi fi-rr-angle-small-right';
            accordionBody.style.maxHeight = '0px';
            accordionState.checked = true;
            
        }
        accordionLabel.classList.toggle('accordion-hidden');
    });

    embedBody.appendChild(accordionDiv);
    embedBody.appendChild(accordionState);

    accordionBody.appendChild(titleInput);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(descriptionLabel);
    accordionBody.appendChild(descriptionInput);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(urlDiv);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(imageColorDiv);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(footerLabel);
    accordionBody.appendChild(footerInput);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(embedFieldsContainer);
    accordionBody.appendChild(fieldsInput);
    accordionBody.appendChild(addFieldButton);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(editButton);
    
    embedBody.appendChild(accordionBody);
    embedForm.appendChild(messageIdInput);
    embedForm.appendChild(embedBody);

    embedDiv.appendChild(embedForm);

    return embedDiv;
}

function getMaxHeightToChildren(element) {
    // Get all the children
    const children = getAllChildrenRecursive(element);

    // Calculate total height of children
    let totalHeight = 0;
    for (let i = 0; i < children.length; i++) {
        totalHeight += children[i].offsetHeight;
    }

    return totalHeight + 'px';
}

function getAllChildrenRecursive(element, result = []) {
    const children = element.children;

    if (children.length === 0) {
        return result;
    }

    for (let i = 0; i < children.length; i++) {
        result.push(children[i]);
        getAllChildrenRecursive(children[i], result);
    }

    return result;
}