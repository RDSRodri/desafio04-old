document.addEventListener('DOMContentLoaded', () => {
    const dataTable = document.getElementById('data-table').getElementsByTagName('tbody')[0];
    const typeFilter = document.getElementById('type-filter');

    let allData = [];

    function formatDate(date) {
        const d = new Date(date);
        return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
    }

    function formatPrice(price) {
        return `R$ ${price.toFixed(2).replace('.', ',')}`;
    }

    function updateTable(data) {
        dataTable.innerHTML = '';

        let totalEntries = 0;
        let totalExits = 0;

        data.forEach(item => {
            const row = dataTable.insertRow();
            row.insertCell().textContent = formatDate(item.date);
            row.insertCell().textContent = `${item.customer.first_name} ${item.customer.last_name}`;
            row.insertCell().textContent = item.customer.phone;
            row.insertCell().textContent = item.store.name;
            row.insertCell().textContent = item.store.phone;
            row.insertCell().textContent = item.type === 'IN' ? 'Entrada' : 'Saída';
            row.insertCell().textContent = item.amount;
            row.insertCell().textContent = formatPrice(item.price);
            row.insertCell().textContent = formatPrice(item.amount * item.price);

            if (item.type === 'IN') {
                totalEntries += item.amount * item.price;
            } else if (item.type === 'OUT') {
                totalExits += item.amount * item.price;
            }

        });

        document.getElementById('total-entries').querySelector('span').textContent = formatPrice(totalEntries);
        document.getElementById('total-exits').querySelector('span').textContent = formatPrice(totalExits);
        document.getElementById('total-balance').querySelector('span').textContent = formatPrice(totalEntries - totalExits);
    }

    function loadData() {
        fetch('dados.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            updateTable(allData);
        })
        .catch(error => console.error('Erro ao carregar dados:', error));
    }

    typeFilter.addEventListener('change', () => {
        const filterValue = typeFilter.value;
        if (filterValue === 'all') {
            updateTable(allData);
        } else {
            const filteredData = allData.filter(item => item.type === filterValue);
            updateTable(filteredData);
        }
    });

    loadData();
});