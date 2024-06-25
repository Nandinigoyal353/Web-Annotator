
function loadAnnotations() {
  chrome.storage.local.get('annotations', (data) => {
    const annotations = data.annotations || [];
    displayAnnotations(annotations);
  });
}

function displayAnnotations(annotations) {
  const annotationsList = document.getElementById('annotations-list');
  annotationsList.innerHTML = '';
  annotations.forEach((annotation, index) => {
    const listItem = document.createElement('li');
    
    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'annotation-details';
    
    const textDiv = document.createElement('div');
    textDiv.innerHTML = `<strong>Text:</strong> ${annotation.text || ''}`;
    detailsDiv.appendChild(textDiv);
    
    const colorDiv = document.createElement('div');
    colorDiv.innerHTML = `<strong>Color:</strong> ${annotation.color}`;
    detailsDiv.appendChild(colorDiv);
    
    const dateDiv = document.createElement('div');
    dateDiv.innerHTML = `<strong>Date:</strong> ${new Date(annotation.date).toLocaleString()}`;
    detailsDiv.appendChild(dateDiv);
    
    const noteDiv = document.createElement('div');
    noteDiv.innerHTML = annotation.note ? `<strong>Note:</strong> ${annotation.note}` : '';
    detailsDiv.appendChild(noteDiv);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-button'; 
    deleteButton.addEventListener('click', () => {
      deleteAnnotation(index);
    });

    listItem.appendChild(detailsDiv);
    listItem.appendChild(deleteButton);
    annotationsList.appendChild(listItem);
  });
}

function deleteAnnotation(index) {
  chrome.storage.local.get('annotations', (data) => {
    let annotations = data.annotations || [];
    annotations.splice(index, 1);
    chrome.storage.local.set({ annotations: annotations }, () => {
      loadAnnotations();
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.reload(tabs[0].id);
      });
    });
  });
}

function searchAnnotations() {
  const searchInput = document.getElementById('search-input').value.toLowerCase();
  chrome.storage.local.get('annotations', (data) => {
    const annotations = data.annotations || [];
    const filteredAnnotations = annotations.filter(annotation => {
      const textMatch = annotation.text && annotation.text.toLowerCase().includes(searchInput);
      const noteMatch = annotation.note && annotation.note.toLowerCase().includes(searchInput);
      const dateMatch = annotation.date && new Date(annotation.date).toLocaleString().toLowerCase().includes(searchInput);
      return textMatch || noteMatch || dateMatch;
    });
    displayAnnotations(filteredAnnotations);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  loadAnnotations();
  document.getElementById('search-input').addEventListener('input', searchAnnotations);
});


