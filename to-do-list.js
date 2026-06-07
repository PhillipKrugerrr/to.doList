const DAY_ORDER  = ['hoje', 'amanha', 'depois', 'semana'];
const DAY_LABELS = { hoje: 'Today', amanha: 'Tomorrow', depois: 'Day after tomorrow', semana: 'This week' };
const TAG_LABELS = { trabalho: 'Work', pessoal: 'Personal', saude: 'Health', outros: 'Other' };
 
let tasks  = [];
let nextId = 1;
 
function add() {
    const input    = document.getElementById('input-task');
    const texto    = input.value.trim();
    const horario  = document.getElementById('input-time').value;
    const dia      = document.getElementById('input-day').value;
    const categoria = document.getElementById('input-category').value;
 
    if (texto === '') return;
 
    tasks.push({ id: nextId++, texto, horario, dia, categoria, concluida: false });
 
    input.value = '';
    input.focus();
    render();
}
 
function concluir(id) {
    const tarefa = tasks.find(t => t.id === id);
    if (tarefa) tarefa.concluida = !tarefa.concluida;
    render();
}
 
function remover(id) {
    tasks = tasks.filter(t => t.id !== id);
    render();
}
 
function render() {
    const lista = document.getElementById('task-list');
 
    /* estatísticas */
    document.getElementById('stat-total').textContent = tasks.length;
    document.getElementById('stat-done').textContent  = tasks.filter(t => t.concluida).length;
 
    if (tasks.length === 0) {
        lista.innerHTML = '<p class="empty-msg">No tasks yet. Add one above.</p>';
        return;
    }
 
    /* agrupar por dia e ordenar por horário dentro de cada grupo */
    const grupos = {};
    DAY_ORDER.forEach(d => { grupos[d] = []; });
    tasks.forEach(t => { grupos[t.dia].push(t); });
    DAY_ORDER.forEach(d => {
        grupos[d].sort((a, b) => a.horario.localeCompare(b.horario));
    });
 
    lista.innerHTML = '';
 
    DAY_ORDER.forEach(dia => {
        if (grupos[dia].length === 0) return;
 
        const grupo = document.createElement('div');
        grupo.className = 'day-group';
 
        const label = document.createElement('div');
        label.className = 'day-label';
        label.textContent = DAY_LABELS[dia];
        grupo.appendChild(label);
 
        const ul = document.createElement('ul');
 
        grupos[dia].forEach(tarefa => {
            const li = document.createElement('li');
            if (tarefa.concluida) li.classList.add('completed');
 
            /* botão concluir */
            const btnConcluir = document.createElement('button');
            btnConcluir.className = 'btn-concluir';
            btnConcluir.textContent = '✓';
            btnConcluir.setAttribute('aria-label', 'Mark as done');
            btnConcluir.addEventListener('click', () => concluir(tarefa.id));
 
            /* horário */
            const horarioSpan = document.createElement('span');
            horarioSpan.className = 'task-time';
            horarioSpan.textContent = tarefa.horario;
 
            /* texto */
            const textoSpan = document.createElement('span');
            textoSpan.className = 'task-text';
            textoSpan.textContent = tarefa.texto;
 
            /* badge categoria */
            const tag = document.createElement('span');
            tag.className = `task-tag tag-${tarefa.categoria}`;
            tag.textContent = TAG_LABELS[tarefa.categoria];
 
            /* botão remover */
            const btnRemover = document.createElement('button');
            btnRemover.className = 'btn-remover';
            btnRemover.textContent = '✕';
            btnRemover.setAttribute('aria-label', 'Remove task');
            btnRemover.addEventListener('click', () => remover(tarefa.id));
 
            li.appendChild(btnConcluir);
            li.appendChild(horarioSpan);
            li.appendChild(textoSpan);
            li.appendChild(tag);
            li.appendChild(btnRemover);
            ul.appendChild(li);
        });
 
        grupo.appendChild(ul);
        lista.appendChild(grupo);
    });
}
 
/* inicializa a view vazia */
render();