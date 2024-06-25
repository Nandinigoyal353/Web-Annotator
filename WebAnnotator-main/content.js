
let annotations = [];
let toolbar;
let isHighlighting = false; 

function createToolbar() {
  toolbar = document.createElement('div');
  toolbar.id = 'web-annotator-toolbar';
  toolbar.innerHTML = `
    <input type="color" id="highlight-color" value="#59f7a6">
    <button id="highlight-button">Highlight</button>
    <button id="add-note-button">Add Note</button>
    <button id="export-button">Export</button>
  `;
  document.body.appendChild(toolbar);

  attachEventListeners();

toolbar.style.position = 'fixed';
toolbar.style.top = '30vh';
toolbar.style.right = '0';
toolbar.style.margin = '0';
toolbar.style.display = 'flex';
toolbar.style.width= '90px';
toolbar.style.flexDirection = 'column';
toolbar.style.alignItems = 'center';
toolbar.style.backgroundColor = 'transparent';
toolbar.style.border = '2px white solid';
toolbar.style.padding = '10px';
toolbar.style.zIndex = '9999';
 toolbar.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.25)';
toolbar.style.borderRadius = '12px';

const colorButton = document.getElementById('highlight-color');
colorButton.style.width = '80px';
colorButton.style.height = '40px';
colorButton.style.marginBottom = '5px';
colorButton.style.border = '2px solid #ccc';
colorButton.style.borderRadius = '12px';
colorButton.style.border= 'none';
colorButton.style.cursor = 'pointer';
colorButton.style.transition = 'border-color 0.3s, box-shadow 0.3s';
colorButton.style.backgroundColor = '#ff5555'; 

const buttonStyle = (button) => {
  button.style.width = '80px';
  button.style.padding = '8px 15px';
  button.style.marginBottom = '5px';
  button.style.backgroundColor = '#ff5555'; 
  button.style.border = 'none';
  button.style.borderRadius = '12px';
  button.style.color = '#fff';
  button.style.cursor = 'pointer';
  button.style.fontSize = '14px';
  button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
  button.style.transition = 'background 0.3s, transform 0.2s, box-shadow 0.2s';
  button.style.display = 'flex';
  button.style.justifyContent = 'center';
  button.style.alignItems = 'center';
};


const highlightButton = document.getElementById('highlight-button');
buttonStyle(highlightButton);

const noteButton = document.getElementById('add-note-button');
buttonStyle(noteButton);

const exportButton = document.getElementById('export-button');
buttonStyle(exportButton);


const setHoverEffect = (button) => {
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#ff4500';
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = '#ff5555';
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
  });
  button.addEventListener('mousedown', () => {
    button.style.backgroundColor = '#ff5555';
    button.style.transform = 'translateY(1px)';
    button.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.1)';
  });
  button.addEventListener('mouseup', () => {
    button.style.backgroundColor = '#ff5555';
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.2)';
  });
};


setHoverEffect(highlightButton);
setHoverEffect(noteButton);
setHoverEffect(exportButton);


colorButton.addEventListener('mouseover', () => {
  colorButton.style.borderColor = '#999';
  colorButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
});
colorButton.addEventListener('mouseout', () => {
  colorButton.style.borderColor = '#ccc';
  colorButton.style.boxShadow = 'none';
});
colorButton.addEventListener('mousedown', () => {
  colorButton.style.borderColor = '#666';
  colorButton.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
});
colorButton.addEventListener('mouseup', () => {
  colorButton.style.borderColor = '#999';
  colorButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
});

 
  makeDraggable(toolbar);
}


function makeDraggable(element) {
  let offsetX, offsetY;
  let isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      element.style.left = `${e.clientX - offsetX}px`;
      element.style.top = `${e.clientY - offsetY}px`;
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}

function attachEventListeners() {
  document.getElementById('highlight-button').addEventListener('click', () => {
    isHighlighting = !isHighlighting;
    if (isHighlighting) {
      document.body.style.cursor = 'crosshair'; 
    } else {
      document.body.style.cursor = 'default';
    }
  });

  document.getElementById('add-note-button').addEventListener('click', () => {
    isHighlighting = false;
    document.body.style.cursor = 'default';

    const note = prompt('Enter your note:');
    if (note) {
      const color = document.getElementById('highlight-color').value; 
      const noteDiv = createMovableNoteDiv(note, color); 
      document.body.appendChild(noteDiv);
      const date = new Date().toISOString(); 
      annotations.push({ note: note, position: { top: noteDiv.style.top, left: noteDiv.style.left }, color: color, url: window.location.href, date: date }); // Save color with note and date
      saveAnnotations();
    }
  });

  document.getElementById('export-button').addEventListener('click', () => {
    isHighlighting = false; 
    document.body.style.cursor = 'default';
    exportPage();
  });

  document.addEventListener('mouseup', () => {
    if (isHighlighting) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) { 
          const color = document.getElementById('highlight-color').value;
          const span = document.createElement('span');
          span.style.backgroundColor = color;

          try {
            adjustRangeToTextNodes(range);
            range.surroundContents(span);
            const date = new Date().toISOString(); 
            annotations.push({ text: selection.toString(), color: color, url: window.location.href, date: date });
            saveAnnotations();
            selection.removeAllRanges(); 
          } catch (e) {
            console.error('Error while surrounding contents:', e);
          }
        }
      }
    }
  });
}

function adjustRangeToTextNodes(range) {
  function expandRangeToTextNodes(range) {
    while (range.startContainer.nodeType !== Node.TEXT_NODE) {
      range.setStartBefore(range.startContainer);
    }
    while (range.endContainer.nodeType !== Node.TEXT_NODE) {
      range.setEndAfter(range.endContainer);
    }
  }
  
  function splitNonTextNodes(range) {
    const { startContainer, endContainer, startOffset, endOffset } = range;
    
    if (startContainer.nodeType !== Node.TEXT_NODE) {
      if (startContainer.childNodes.length > 0) {
        range.setStart(startContainer.childNodes[startOffset], 0);
      } else {
        range.setStart(startContainer, 0);
      }
    }
    
    if (endContainer.nodeType !== Node.TEXT_NODE) {
      if (endContainer.childNodes.length > 0) {
        range.setEnd(endContainer.childNodes[endOffset - 1], endContainer.childNodes[endOffset - 1].textContent.length);
      } else {
        range.setEnd(endContainer, endContainer.textContent.length);
      }
    }
  }
  
  splitNonTextNodes(range);
  expandRangeToTextNodes(range);
}



function createMovableNoteDiv(note, color) {
  const noteDiv = document.createElement('div');
  noteDiv.textContent = note;
  noteDiv.classList.add('movable-note');
  noteDiv.style.position = 'absolute';
  noteDiv.style.top = '200px';
  noteDiv.style.left = '300px';
  noteDiv.style.backgroundColor = 'transparent';
  noteDiv.style.color = color; 
  noteDiv.style.padding = '8px';
  noteDiv.style.border = '1px solid #000';
  noteDiv.style.cursor = 'move';
  noteDiv.style.maxWidth = '300px'; 
  noteDiv.style.width = 'fit-content'; 
  noteDiv.style.wordWrap = 'break-word'; 
  noteDiv.style.whiteSpace = 'pre-wrap';
  noteDiv.style.zIndex = '2000';

  let offsetX, offsetY;
  let isDragging = false;

  noteDiv.addEventListener('mousedown', (e) => {
    if (!isDragging) {
      isDragging = true;
      offsetX = e.clientX - noteDiv.getBoundingClientRect().left;
      offsetY = e.clientY - noteDiv.getBoundingClientRect().top;
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  });

  function onMouseMove(e) {
    if (isDragging) {
      noteDiv.style.left = `${e.clientX - offsetX}px`;
      noteDiv.style.top = `${e.clientY - offsetY}px`;
    }
  }

  function onMouseUp() {
    if (isDragging) {
      isDragging = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      annotations = annotations.map(annotation => {
        if (annotation.note === note) {
          annotation.position = { top: noteDiv.style.top, left: noteDiv.style.left };
        }
        return annotation;
      });
      saveAnnotations();
    }
  }

  return noteDiv;
}


function removeToolbar() {
  if (toolbar) {
    toolbar.remove();
  }
}

function saveAnnotations() {
  chrome.storage.local.set({ annotations: annotations });
}

function loadAnnotations() {
  chrome.storage.local.get('annotations', (data) => {
    annotations = data.annotations || [];
    annotations.forEach((annotation) => {
      if (annotation.url === window.location.href) { 
        if (annotation.text) {
          highlightText(annotation.text, annotation.color);
        }
        if (annotation.note) {
          const noteDiv = createMovableNoteDiv(annotation.note, annotation.color); 
          noteDiv.style.top = annotation.position.top;
          noteDiv.style.left = annotation.position.left;
          document.body.appendChild(noteDiv);
        }
      }
    });
  });
}

function highlightText(text, color) {
  const nodes = findTextNodes(document.body, text);
  nodes.forEach((node) => {
    const range = document.createRange();
    range.setStart(node, node.nodeValue.indexOf(text));
    range.setEnd(node, node.nodeValue.indexOf(text) + text.length);
    const span = document.createElement('span');
    span.style.backgroundColor = color;
    try {
      range.surroundContents(span);
    } catch (e) {
      console.error('Error while surrounding contents:', e);
    }
  });
}

function findTextNodes(node, text) {
  const textNodes = [];
  if (node.nodeType === Node.TEXT_NODE) {
    if (node.nodeValue.includes(text)) {
      textNodes.push(node);
    }
  } else {
    node.childNodes.forEach((childNode) => {
      textNodes.push(...findTextNodes(childNode, text));
    });
  }
  return textNodes;
}

function exportPage() {
  const doc = document.cloneNode(true);
  const toolbar = doc.getElementById('web-annotator-toolbar');
  if (toolbar) {
    toolbar.remove();
  }

  const annotationsScript = document.createElement('script');
  annotationsScript.textContent = `(${restoreAnnotations.toString()})();\n(${annotationsJSON.toString()})();`;
  doc.body.appendChild(annotationsScript);

  const data = new Blob([doc.documentElement.outerHTML], { type: 'text/html' });
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${document.title}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function restoreAnnotations() {
  const annotationsData = annotationsJSON();
  annotationsData.forEach((annotation) => {
    if (annotation.text) {
      highlightText(annotation.text, annotation.color);
    }
    if (annotation.note) {
      const noteDiv = createMovableNoteDiv(annotation.note, annotation.color);
      noteDiv.style.top = annotation.position.top;
      noteDiv.style.left = annotation.position.left;
      document.body.appendChild(noteDiv);
    }
  });
}

function annotationsJSON() {
  return JSON.parse(localStorage.getItem('annotations')) || [];
}

createToolbar();
loadAnnotations();

window.addEventListener('beforeunload', removeToolbar);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleToolbar') {
    if (toolbar && toolbar.parentNode) {
      removeToolbar();
    } else {
      createToolbar();
    }
  }
});


