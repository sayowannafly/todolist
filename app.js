const inputElement = document.getElementById("title");
const createBtn = document.getElementById("create");
const toDoListElement = document.getElementById("to-do-list");
const inProgressListElement = document.getElementById("in-progress-list");
const doneListElement = document.getElementById("done-list");
const deleteBtn = document.getElementById("delete");

const notes = [];
let noteIdCounter = 0;

function saveToLocalStorage() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function loadFromLocalStorage() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        notes.push(...parsedNotes);
        noteIdCounter = notes.length ? notes[notes.length - 1].id + 1 : 0;
    }
}

function render() {
    renderList(toDoListElement, notes.filter(note => note.status === 'to-do'), 'to-do');
    renderList(inProgressListElement, notes.filter(note => note.status === 'in-progress'), 'in-progress');
    renderList(doneListElement, notes.filter(note => note.status === 'done'), 'done');
}

function renderList(listElement, listNotes, status) {
    listElement.innerHTML = "";
    if (listNotes.length === 0) {
        listElement.innerHTML = "<p style='color: #adb5bd;'>Нет задач</p>";
    } else {
        listNotes.forEach((note) => {
            listElement.insertAdjacentHTML('beforeend', getNoteTemplate(note));
        });
    }

    const statusHeader = document.querySelector(`#${status}-count`);
    statusHeader.textContent = ` (${listNotes.length})`;
}

createBtn.onclick = function() {
    if (inputElement.value.trim().length === 0) {
        return;
    } else if (inputElement.value.trim().length > 30) {
        return;
    }
    
    const newNote = {
        id: noteIdCounter++,
        title: inputElement.value.trim(),
        status: 'to-do'
    };
    
    notes.push(newNote);
    saveToLocalStorage();
    render();
    inputElement.value = "";
}

deleteBtn.onclick = function() {
    notes.length = 0;
    noteIdCounter = 0;
    localStorage.removeItem('notes');
    render();
}

document.addEventListener('click', function(event) {
    const index = event.target.dataset.index ? parseInt(event.target.dataset.index) : null;
    const type = event.target.dataset.type;

    if (index !== null) {
        if (type === 'toggle') {
            handleToggle(index);
        } else if (type === 'remove') {
            handleRemove(index);
        }
    }
});

function handleToggle(index) {
    const note = notes.find(note => note.id === index);
    if (note) {
        if (note.status === 'to-do') {
            note.status = 'in-progress';
        } else if (note.status === 'in-progress') {
            note.status = 'done';
        }
        saveToLocalStorage();
        render();
    }
}

function handleRemove(index) {
    const noteIndex = notes.findIndex(note => note.id === index);
    if (noteIndex !== -1) {
        notes.splice(noteIndex, 1);
        saveToLocalStorage();
        render();
    }
}

function getNoteTemplate(note) {
    const checkButtonClass = note.status === 'to-do' ? 'success' :
                             note.status === 'in-progress' ? 'success' :
                             'secondary';
    
    return `<li class="list-group-item d-flex justify-content-between align-items-center">
              <span class="${note.status}">${note.title}</span>
              <span>
                ${note.status !== 'done' ? `<span class="btn btn-small btn-${checkButtonClass}" data-index="${note.id}" data-type="toggle">&check;</span>` : ''}
                <span class="btn btn-small btn-danger" data-type="remove" data-index="${note.id}">&times;</span>
              </span>
            </li>`;
}

loadFromLocalStorage();
render();


// Основа данного кода была взята с канала "Владилен Милен" и было добавлено 2 колонны, счетчик и сохранение данных