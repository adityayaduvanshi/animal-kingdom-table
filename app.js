class AnimalTable {
    constructor(category, species, initialData, sortableColumns) {
        this.category = category;
        this.species = species;
        this.data = [...initialData];
        this.sortableColumns = sortableColumns;
        this.sortColumn = null;
        this.sortAscending = true;
        this.renderTable();
    }

    renderColumnHeader(column, displayName) {
        const isSortable = this.sortableColumns.includes(column);
        const sortableClass = isSortable ? 'sortable-header' : '';
        const activeSortClass = (this.sortColumn === column) ? 'sort-active' : '';
        
        return `
            <th class="${sortableClass} ${activeSortClass}" 
                ${isSortable ? `onclick="animalTables['${this.category}'].sortTable('${column}')"` : ''}>
                <div class="d-flex align-items-center">
                    <span class="me-2">
                        <i class="fas fa-${this.getColumnIcon(column)} text-secondary"></i>
                    </span>
                    <span>${displayName}</span>
                    ${isSortable ? `
                        <span class="sort-icon">
                            ${this.getSortIcon(column)}
                        </span>
                    ` : ''}
                </div>
            </th>
        `;
    }

    getColumnIcon(column) {
        const icons = {
            'image': 'image',
            'name': 'font',
            'size': 'ruler',
            'location': 'map-marker-alt'
        };
        return icons[column] || 'info';
    }

    renderTable() {
        const container = document.getElementById(`${this.category}-table-container`);
        const tableId = `${this.category}-table`;
        
        const table = `
            <div class="table-responsive">
                <table id="${tableId}" class="table">
                    <thead>
                        <tr>
                            ${this.renderColumnHeader('image', 'Image')}
                            ${this.renderColumnHeader('name', this.getNameColumnHeader())}
                            ${this.renderColumnHeader('size', 'Size (ft)')}
                            ${this.renderColumnHeader('location', 'Location')}
                            <th class="text-center" width="160">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.renderTableRows()}
                    </tbody>
                </table>
            </div>
        `;
        
        container.innerHTML = table;
    }

    getNameColumnHeader() {
        if (this.category === 'big-fish') {
            return '<span class="blue-bold-italic">Name</span>';
        }
        return 'Name';
    }

    getSortIcon(column) {
        if (this.sortColumn !== column) {
            return '<i class="fas fa-sort"></i>';
        }
        return this.sortAscending ? 
            '<i class="fas fa-sort-up"></i>' : 
            '<i class="fas fa-sort-down"></i>';
    }

    renderTableRows() {
        return this.data.map((animal, index) => `
            <tr>
                <td class="text-center">
                    <div class="image-container" data-title="${animal.name}">
                        <img src="${animal.imageUrl}" 
                             alt="${animal.name}" 
                             class="animal-image">
                    </div>
                </td>
                <td>
                    ${this.formatName(animal.name)}
                </td>
                <td class="text-center">
                    <span class="size-badge">
                        ${animal.size} ft
                    </span>
                </td>
                <td>
                    <i class="fas fa-map-marker-alt me-2 text-secondary"></i>
                    ${animal.location}
                </td>
                <td class="text-center">
                    <div class="btn-group">
                        <button class="btn btn-action btn-edit me-2" 
                                onclick="openEditModal('${this.category}', ${index})"
                                title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-action btn-delete" 
                                onclick="deleteAnimal('${this.category}', ${index})"
                                title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    formatName(name) {
        if (this.category === 'dogs') {
            return `<strong>${name}</strong>`;
        } else if (this.category === 'big-fish') {
            return `<span class="blue-bold-italic">${name}</span>`;
        }
        return name;
    }

    sortTable(column) {
        if (!this.sortableColumns.includes(column)) return;

        if (this.sortColumn === column) {
            this.sortAscending = !this.sortAscending;
        } else {
            this.sortColumn = column;
            this.sortAscending = true;
        }

        this.data.sort((a, b) => {
            let valueA = column === 'size' ? parseFloat(a[column]) : a[column];
            let valueB = column === 'size' ? parseFloat(b[column]) : b[column];
            
            if (column === 'size') {
                return this.sortAscending ? valueA - valueB : valueB - valueA;
            }
            
            return this.sortAscending 
                ? valueA.localeCompare(valueB) 
                : valueB.localeCompare(valueA);
        });

        this.renderTable();
    }

    addAnimal(animal) {
        if (this.data.some(a => a.name === animal.name)) {
            alert('An animal with this name already exists!');
            return false;
        }
        this.data.push(animal);
        this.renderTable();
        return true;
    }

    editAnimal(index, animal) {
        if (this.data.some((a, i) => a.name === animal.name && i !== index)) {
            alert('An animal with this name already exists!');
            return false;
        }
        this.data[index] = animal;
        this.renderTable();
        return true;
    }

    deleteAnimal(index) {
        this.data.splice(index, 1);
        this.renderTable();
    }
}

const animalTables = {
    'big-cats': new AnimalTable('big-cats', 'Big Cats', [
        { name: 'Tiger', size: '10', location: 'Asia', imageUrl: 'https://images.pexels.com/photos/162203/panthera-tigris-altaica-tiger-siberian-amurtiger-162203.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { name: 'Lion', size: '8', location: 'Africa', imageUrl: 'https://images.pexels.com/photos/3651335/pexels-photo-3651335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
        { name: 'Leopard', size: '5', location: 'Africa and Asia', imageUrl: 'https://www.lovemycatz.com/wp-content/uploads/2024/01/gettyimages-1480819675-1-360x540.jpg' },
        { name: 'Cheetah', size: '5', location: 'Africa', imageUrl: 'https://www.shutterstock.com/image-photo/amazing-image-cheetah-running-600nw-2460392715.jpg' },
      
        { name: 'Jaguar', size: '5', location: 'Amazon', imageUrl: 'https://cdn.pixabay.com/photo/2018/05/03/06/19/jaguar-3370498_1280.jpg' }
    ], ['name', 'size', 'location']),
    'dogs': new AnimalTable('dogs', 'Dog', [
        { name: 'Rotwailer', size: '2', location: 'Germany', imageUrl: 'https://media.istockphoto.com/id/1064733482/photo/rottweiler.jpg?s=612x612&w=0&k=20&c=AfrJyy-eh4ZECUKB_IkAda6mI1Ol0pYeFK7y5AlYbEA=' },
        { name: 'German Shepherd', size: '2', location: 'Germany', imageUrl: 'https://images.pexels.com/photos/333083/pexels-photo-333083.jpeg' },
        { name: 'Labrodar', size: '2', location: 'UK', imageUrl: 'https://t3.ftcdn.net/jpg/01/02/85/78/360_F_102857871_vJs4AnThry3AUb2Va5VMTfRUUKiVwsgh.jpg' },
       
    ], ['name', 'location']),
    'big-fish': new AnimalTable('big-fish', 'Big Fish', [
        { name: 'Humpback Whale', size: '15', location: 'Atlantic Ocean', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Humpback_Whale_underwater_shot.jpg/800px-Humpback_Whale_underwater_shot.jpg' },
        { name: 'Killer Whale', size: '12', location: 'Atlantic Ocean', imageUrl: 'https://media.istockphoto.com/id/1253430109/photo/killer-whale-orcinus-orca-adult-breaching-channel-near-orcas-island.jpg?s=612x612&w=0&k=20&c=Kw02r4CP5rM-hczLEEBTeCOx828-MdOncPaRNL0G1vw=' },
        { name: 'Tiger Shark', size: '8', location: 'Ocean', imageUrl: 'https://t3.ftcdn.net/jpg/03/39/46/78/360_F_339467870_lluJoa9vXpMfUtv9lROzmcDjCycSNADy.jpg' },
        { name: 'Hammerhead Shark', size: '8', location: 'Ocean', imageUrl: 'https://i.natgeofe.com/n/18c79c2b-601e-4a1b-a290-49c11be58c13/hammerhead-sharks_thumb_2x1.jpg' }
    ], ['size'])
};

let currentModalCategory = null;
let editingIndex = -1;

function openAddModal(category) {
    currentModalCategory = category;
    const modal = new bootstrap.Modal(document.getElementById('animalModal'));
    document.getElementById('modalTitle').textContent = `Add ${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
    document.getElementById('species').value = animalTables[category].species;
    document.getElementById('name').value = '';
    document.getElementById('size').value = '';
    document.getElementById('location').value = '';
    document.getElementById('imageUrl').value = 'default-image.jpg';
    document.getElementById('editIndex').value = -1;
    document.getElementById('currentCategory').value = category;
    modal.show();
}

function openEditModal(category, index) {
    currentModalCategory = category;
    const animal = animalTables[category].data[index];
    const modal = new bootstrap.Modal(document.getElementById('animalModal'));
    document.getElementById('modalTitle').textContent = `Edit ${animal.name}`;
    document.getElementById('species').value = animalTables[category].species;
    document.getElementById('name').value = animal.name;
    document.getElementById('size').value = animal.size;
    document.getElementById('location').value = animal.location;
    document.getElementById('imageUrl').value = animal.imageUrl;
    document.getElementById('editIndex').value = index;
    document.getElementById('currentCategory').value = category;
    modal.show();
}

function saveAnimal() {
    const name = document.getElementById('name').value.trim();
    const size = document.getElementById('size').value;
    const location = document.getElementById('location').value.trim();
    const imageUrl = document.getElementById('imageUrl').value.trim();
    const category = document.getElementById('currentCategory').value;
    const editIndex = parseInt(document.getElementById('editIndex').value);

    if (!name || !size || !location) {
        alert('Please fill in all required fields');
        return;
    }

    if (isNaN(size) || parseFloat(size) <= 0) {
        alert('Size must be a positive number');
        return;
    }

    const animal = { 
        name, 
        size: size.toString(), 
        location, 
        imageUrl: imageUrl || 'default-image.jpg'
    };

    let success;
    if (editIndex === -1) {
        success = animalTables[category].addAnimal(animal);
    } else {
        success = animalTables[category].editAnimal(editIndex, animal);
    }

    if (success) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('animalModal'));
        modal.hide();
    }
}

function deleteAnimal(category, index) {
    if (confirm('Are you sure you want to delete this animal?')) {
        animalTables[category].deleteAnimal(index);
    }
}