'use strict';
const STORAGE_KEY = 'a-tu-ritmo.tasks.v1';
const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const status = document.querySelector('#status');
let tasks = [];
let filter = 'all';
try {
  const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  if (!Array.isArray(saved) || !saved.every(task => task && typeof task.id === 'string' && typeof task.text === 'string' && typeof task.completed === 'boolean')) throw new Error('Datos no válidos');
  tasks = saved;
} catch {
  status.textContent = 'No se pudieron cargar las tareas guardadas. Puedes seguir usando la aplicación.';
}
function save(message) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    status.textContent = message;
  } catch {
    status.textContent = 'No se pudieron guardar los cambios. Se conservarán solo mientras esta página siga abierta.';
  }
}
function render() {
  const pending = tasks.filter(task => !task.completed).length;
  const completed = tasks.length - pending;
  document.querySelector('#count').textContent = `${pending} ${pending === 1 ? 'pendiente' : 'pendientes'}`;
  document.querySelector('#progress-text').textContent = tasks.length ? `${completed} de ${tasks.length} completadas. ${pending ? 'A tu ritmo, sigue así.' : '¡Buen trabajo!'}` : 'Tu próximo paso empieza aquí.';
  document.querySelector('#progress').style.width = `${tasks.length ? completed / tasks.length * 100 : 0}%`;
  list.replaceChildren();
  const visible = tasks.filter(task => filter === 'all' || (filter === 'completed' ? task.completed : !task.completed));
  visible.forEach(task => {
    const row = document.createElement('li');
    row.className = `task${task.completed ? ' done' : ''}`;
    const label = document.createElement('label');
    label.className = 'task-label';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;
    checkbox.addEventListener('change', () => {
      task.completed = checkbox.checked;
      save(task.completed ? 'Tarea completada.' : 'Tarea marcada como pendiente.');
      render();
      const target = document.getElementById(`task-${task.id}`);
      (target || document.querySelector(`[data-filter="${filter}"]`)).focus();
    });
    checkbox.id = `task-${task.id}`;
    label.append(checkbox, text);
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'delete';
    remove.setAttribute('aria-label', `Eliminar tarea: ${task.text}`);
    remove.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 10v7m4-7v7"/></svg>';
    remove.addEventListener('click', () => {
      const index = visible.indexOf(task);
      tasks = tasks.filter(item => item.id !== task.id);
      save('Tarea eliminada.');
      render();
      const buttons = list.querySelectorAll('.delete');
      (buttons[Math.min(index, buttons.length - 1)] || input).focus();
    });
    row.append(label, remove);
    list.append(row);
  });
  const empty = document.querySelector('#empty');
  empty.hidden = visible.length > 0;
  empty.querySelector('h3').textContent = tasks.length === 0 ? 'Todo empieza con un pequeño paso' : filter === 'pending' ? '¡Todo al día!' : 'Todavía no hay tareas completadas';
  empty.querySelector('p').textContent = tasks.length === 0 ? 'Añade tu primera tarea y hazle sitio a lo importante.' : filter === 'pending' ? 'Has completado todas tus tareas. Disfruta de la calma.' : 'Cada tarea completada aparecerá aquí.';
}
form.addEventListener('submit', event => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    input.setCustomValidity('Escribe una tarea antes de añadirla.');
    input.reportValidity();
    return;
  }
  tasks.unshift({id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`, text, completed: false});
  filter = 'all';
  updateFilters();
  save('Tarea añadida.');
  input.value = '';
  render();
  input.focus();
});
input.addEventListener('input', () => input.setCustomValidity(''));
function updateFilters() {
  document.querySelectorAll('[data-filter]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
}
document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    filter = button.dataset.filter;
    updateFilters();
    render();
  });
});
render();
