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

    const embedForm = createEmbedForm(message_id);

    const embedBody = createEmbedBody(color);

    const titleInput = createInput('title', 'Title', title);
    const descriptionInput = createInput('description', 'Description', description);
    const urlDiv = createUrlDiv(url, thumbnail);
    const imageColorDiv = createImageColorDiv(image, color, embedBody);
    const footerInput = createInput('footer', 'Footer', footer);
    const embedFieldsContainer = createEmbedFieldsContainer(fields);
    const addFieldButton = createAddFieldButton(embedFieldsContainer);
    const editButton = createEditButton(embedForm, titleInput, urlDiv, thumbnail, descriptionInput, imageColorDiv, color, footerInput, message_id, embedFieldsContainer);

    const accordionBody = createAccordionBody(titleInput, descriptionInput, urlDiv, imageColorDiv, footerInput, embedFieldsContainer, addFieldButton, editButton);

    const accordionDiv = createAccordionDiv(title, titleInput, accordionBody);

    embedBody.appendChild(accordionDiv);
    embedBody.appendChild(accordionBody);
    embedForm.appendChild(embedBody);
    embedDiv.appendChild(embedForm);

    return embedDiv;
}

function createEmbedForm(message_id) {
    const embedForm = document.createElement('form');
    embedForm.setAttribute('action', '/edit-embed');
    embedForm.setAttribute('method', 'POST');
    embedForm.setAttribute('id', `embed_${embedCounter}`);

    const messageIdInput = createHiddenInput('messageId', message_id);
    embedForm.appendChild(messageIdInput);

    return embedForm;
}

function createEmbedBody(color) {
    const colorString = color === 0 ? "#000000" : "#" + color.toString(16)
    const embedBody = document.createElement('div');
    embedBody.className = 'bg-dark-3 border-1-4 rounded-md';
    embedBody.style.position = 'relative';
    embedBody.style.padding = '0.75rem';

    embedBody.style.borderLeftColor = colorString;
    embedBody.style.borderLeftStyle = 'solid';
    embedBody.style.borderLeftWidth = '5px';

    return embedBody;
}

function createInput(id, label, value) {
    const inputLabel = document.createElement('label');
    inputLabel.setAttribute('for', id);
    inputLabel.textContent = label;
    inputLabel.className = 'font-bold';

    const input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('id', id);
    input.setAttribute('name', id);
    input.setAttribute('value', value);
    input.className = 'bg-dark-2 rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';

    return { label: inputLabel, input };
}

function createUrlDiv(url, thumbnail) {
    const urlDiv = document.createElement('div');
    urlDiv.className = 'container';

    const urlTitleLeft = createUrlTitleLeft(url);
    const urlThumbnailRight = createUrlThumbnailRight(thumbnail);

    urlDiv.appendChild(urlTitleLeft);
    urlDiv.appendChild(urlThumbnailRight);

    return urlDiv;
}

function createUrlTitleLeft(url) {
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

    const urlTitleLeft = document.createElement('div');
    urlTitleLeft.className = 'inline-div';
    urlTitleLeft.appendChild(urlLabel);
    urlTitleLeft.appendChild(urlInput);

    return urlTitleLeft;
}

function createUrlThumbnailRight(thumbnail) {
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

    const urlThumbnailRight = document.createElement('div');
    urlThumbnailRight.className = 'inline-div pl-2';
    urlThumbnailRight.appendChild(thumbnailLabel);
    urlThumbnailRight.appendChild(thumbnailInput);

    return urlThumbnailRight;
}

function createImageColorDiv(image, color, embedBody) {
    const imageColorDiv = document.createElement('div');
    imageColorDiv.className = 'container';

    const imageColorLeft = createImageColorLeft(image);
    const imageColorRight = createImageColorRight(color, embedBody);

    imageColorDiv.appendChild(imageColorLeft);
    imageColorDiv.appendChild(imageColorRight);

    return imageColorDiv;
}

function createImageColorLeft(image) {
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

    const imageColorLeft = document.createElement('div');
    imageColorLeft.className = 'inline-div';
    imageColorLeft.appendChild(imageLabel);
    imageColorLeft.appendChild(imageInput);

    return imageColorLeft;
}

function createImageColorRight(color, embedBody) {
    const colorString = color === 0 ? "#000000" : "#" + color.toString(16);

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

    colorInput.addEventListener('input', function() {
        const selectedColor = colorInput.value;
        colorInput.style.backgroundColor = selectedColor;
        embedBody.style.borderLeftColor = selectedColor;
        embedBody.style.borderLeftStyle = 'solid';
        embedBody.style.borderLeftWidth = '5px';
    });

    const imageColorRight = document.createElement('div');
    imageColorRight.className = 'inline-div pl-2';
    imageColorRight.appendChild(colorLabel);
    imageColorRight.appendChild(colorInput);

    return imageColorRight;
}

function createInputWithHidden(id, value) {
    const input = createInput(id, '', value);
    const hiddenInput = createHiddenInput(id, value);

    return { label: input.label, input: input.input, hiddenInput };
}

function createHiddenInput(id, value) {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('id', id);
    input.setAttribute('name', id);
    input.setAttribute('value', value);

    return input;
}

function createEmbedFieldsContainer(fields) {
    const embedFieldsContainer = document.createElement('div');
    embedFieldsContainer.setAttribute('id', 'embedFields-container');

    if (fields !== null && fields !== '') {
        const parsedFields = JSON.parse(fields);
        parsedFields.forEach(field => {
            embedFieldsContainer.append(createField(field.name, field.value, field.inline));
        });
    }

    const fieldsInput = createHiddenInput('fields', fields);

    embedFieldsContainer.addEventListener('click', (event) => {
        if (event.target && event.target.className === 'remove-field red-discord-button mt-1 ml-2') {
            event.target.parentElement.parentElement.remove();
            fieldCounter--;
        }
    });

    embedFieldsContainer.appendChild(fieldsInput);

    return embedFieldsContainer;
}

function createAddFieldButton(embedFieldsContainer) {
    const addFieldButton = document.createElement('button');
    addFieldButton.className = 'green-discord-button';
    addFieldButton.textContent = 'Add Field';
    addFieldButton.type = 'button';
    addFieldButton.addEventListener('click', () => {
        const newField = createField();

        embedFieldsContainer.appendChild(newField);
    });

    return addFieldButton;
}

function createInlineCheckbox(inline) {
    const inlineLabel = document.createElement('label');
    inlineLabel.setAttribute('for', 'inline');
    inlineLabel.textContent = 'Inline';
    inlineLabel.className = 'font-bold';

    const inlineCheckbox = document.createElement('input');
    inlineCheckbox.setAttribute('type', 'checkbox');
    inlineCheckbox.setAttribute('id', 'inline');
    inlineCheckbox.setAttribute('name', 'inline');
    inlineCheckbox.checked = inline;
    inlineCheckbox.className = 'rounded-md border-1-4 border-transparent w-full px-3 py-2 mt-1 text-white';

    return { label: inlineLabel, checkbox: inlineCheckbox };
}

function createRemoveFieldButton() {
    const removeFieldButton = document.createElement('button');
    removeFieldButton.className = 'remove-field red-discord-button mt-1 ml-2';
    removeFieldButton.textContent = 'Remove';
    removeFieldButton.type = 'button';

    return removeFieldButton;
}

function createEditButton(embedForm, titleInput, urlDiv, thumbnail, descriptionInput, imageColorDiv, color, footerInput, message_id, embedFieldsContainer) {
    const editButton = document.createElement('button');
    editButton.className = 'edit-embed-button discord-button font-bold mt-1';
    editButton.textContent = 'Edit ';
    editButton.type = 'button';

    const editIcon = document.createElement('i');
    editIcon.className = 'fi fi-rr-pencil';
    editButton.appendChild(editIcon);

    editButton.addEventListener('click', () => {
        const embedData = {
            title: titleInput.input.value || '',
            url: urlDiv.querySelector('#url').value || '',
            thumbnail: urlDiv.querySelector('#thumbnail').value || '',
            description: descriptionInput.input.value || '',
            image: imageColorDiv.querySelector('#image').value || '',
            color: imageColorDiv.querySelector('#color').value || 0x000000, // Convert hex to decimal
            footer: footerInput.input.value || '',
            messageId: message_id || '',
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

    return editButton;
}

function createAccordionDiv(title, titleInput, accordionBody) {
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

    accordionDiv.appendChild(accordionIcon);
    accordionDiv.appendChild(titleInput.label);
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

    return accordionDiv;
}

function createAccordionBody(titleInput, descriptionInput, urlDiv, imageColorDiv, footerInput, embedFieldsContainer, addFieldButton, editButton) {
    const accordionBody = document.createElement('div');
    accordionBody.className = 'accordion-body';

    accordionBody.appendChild(titleInput.input);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(descriptionInput.label);
    accordionBody.appendChild(descriptionInput.input);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(urlDiv);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(imageColorDiv);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(footerInput.label);
    accordionBody.appendChild(footerInput.input);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(embedFieldsContainer);
    accordionBody.appendChild(addFieldButton);
    accordionBody.appendChild(document.createElement('br'));
    accordionBody.appendChild(editButton);

    return accordionBody;
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