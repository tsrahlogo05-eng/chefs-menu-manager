(function () {
    'use strict';
    const STORAGE_KEY = 'chefMenuItems';
    const COURSE_LABELS = {
        'starter': 'Starter',
        'main-course': 'Main Course',
        'dessert': 'Dessert'
    };
    let menuItems = [];
    let itemPendingDelete = null;

    
    const els = {
        toast: document.getElementById('toast'),
        menuList: document.getElementById('menu-list'),
        menuEmpty: document.getElementById('menu-empty'),
        searchResults: document.getElementById('search-results'),
        searchEmpty: document.getElementById('search-empty'),
        searchInput: document.getElementById('search'),
        filterCourse: document.getElementById('filter-course'),
        clearFilters: document.getElementById('clear-filters'),
        addForm: document.getElementById('add-form'),
        editForm: document.getElementById('edit-form'),
        deleteName: document.getElementById('delete-item-name'),
        confirmDelete: document.getElementById('confirm-delete'),
        stats: {
            total: document.getElementById('stat-total'),
            average: document.getElementById('stat-average'),
            starters: document.getElementById('stat-starters'),
            mains: document.getElementById('stat-mains'),
            desserts: document.getElementById('stat-desserts')
        }
    };
    
    function loadItems() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    menuItems = parsed;
                    return;
                }
            }
        } catch (e) {
            console.warn('Could not load menu items', e);
        }
        menuItems = [
            {
                id: generateId(),
                name: 'Grilled Chicken',
                description: 'Grilled chicken served with vegetables.',
                course: 'main-course',
                price: 120
            },
            {
                id: generateId(),
                name: 'Caesar Salad',
                description: 'Fresh lettuce with chicken and dressing.',
                course: 'starter',
                price: 75
            },
            {
                id: generateId(),
                name: 'Chocolate Cake',
                description: 'Rich chocolate cake served with cream.',
                course: 'dessert',
                price: 65
            }
        ];
        saveItems();
    }

    function saveItems() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(menuItems));
    }
    function generateId() {
        return 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 9);
    }
    function showToast(message, type = 'success') {
        els.toast.textContent = message;
        els.toast.className = 'toast show ' + type;
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => {
            els.toast.className = 'toast';
        }, 2800);
    }
    function clearErrors(form) {
        form.querySelectorAll('.error-msg').forEach(el => {
            el.textContent = '';
        });
        form.querySelectorAll('.invalid').forEach(el => {
            el.classList.remove('invalid');
        });
    }
    function setError(inputId, message) {
        const input = document.getElementById(inputId);
        const err = document.getElementById('err-' + inputId);
        if (input) input.classList.add('invalid');
        if (err) err.textContent = message;
    }
    function formatPrice(value) {
        return 'R ' + Number(value).toFixed(2);
    }
    function formatCourse(course) {
        return COURSE_LABELS[course] || course;
    }

    function validateItem(data, prefix = '') {
        const errors = {};
        const name = (data.name || '').trim();
        const description = (data.description || '').trim();
        const course = data.course || '';
        const price = parseFloat(data.price);

        if (!name) {
            errors[prefix + 'name'] = 'Dish name is required.';
        } else if (name.length < 2) {
            errors[prefix + 'name'] = 'Name must be at least 2 characters.';
        }

        if (!description) {
            errors[prefix + 'description'] = 'Description is required.';
        } else if (description.length < 5) {
            errors[prefix + 'description'] = 'Description must be at least 5 characters.';
        }

        if (!course || !COURSE_LABELS[course]) {
            errors[prefix + 'course'] = 'Please select a valid course.';
        }

        if (isNaN(price) || price <= 0) {
            errors[prefix + 'price'] = 'Enter a valid price greater than 0.';
        }
        return errors;
    }

    function applyErrors(errors, prefix = '') {
        Object.keys(errors).forEach(key => {
            // key is e.g. "dish-name" or "edit-name"
            setError(key, errors[key]);
        });
    }
    function createMenuItemCard(item) {
        const article = document.createElement('article');
        article.className = 'menu-item';
        article.dataset.id = item.id;

        article.innerHTML = `
            <div class="item-info">
                <h3>${escapeHtml(item.name)}</h3>
                <span class="course">${escapeHtml(formatCourse(item.course))}</span>
                <p>${escapeHtml(item.description)}</p>
                <strong>${formatPrice(item.price)}</strong>
            </div>
            <div class="item-actions">
                <button type="button" class="edit-button" data-action="edit" data-id="${item.id}">Edit</button>
                <button type="button" class="delete-button" data-action="delete" data-id="${item.id}">Delete</button>
            </div>
        `;
        return article;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    function renderMenuList(container, items) {
        container.innerHTML = '';
        items.forEach(item => {
            container.appendChild(createMenuItemCard(item));
        });
    }
    function refreshAllViews() {
        if (menuItems.length === 0) {
            els.menuList.innerHTML = '';
            els.menuEmpty.classList.remove('hidden');
        } else {
            els.menuEmpty.classList.add('hidden');
            renderMenuList(els.menuList, menuItems);
        }
        applySearchAndFilter()
        updateStatistics();
    }

    function applySearchAndFilter() {
        const query = (els.searchInput.value || '').trim().toLowerCase();
        const courseFilter = els.filterCourse.value;
        let filtered = menuItems.slice();

        if (query) {
            filtered = filtered.filter(item =>
                item.name.toLowerCase().includes(query)
            );
        }
        if (courseFilter) {
            filtered = filtered.filter(item => item.course === courseFilter);
        }

        if (filtered.length === 0) {
            els.searchResults.innerHTML = '';
            els.searchEmpty.classList.remove('hidden');
        } else {
            els.searchEmpty.classList.add('hidden');
            renderMenuList(els.searchResults, filtered);
        }
    }

    function updateStatistics() {
        const total = menuItems.length;
        els.stats.total.textContent = total;
        if (total === 0) {
            els.stats.average.textContent = 'R 0.00';
            els.stats.starters.textContent = '0';
            els.stats.mains.textContent = '0';
            els.stats.desserts.textContent = '0';
            return;
        }

        const sum = menuItems.reduce((acc, item) => acc + Number(item.price), 0);
        const average = sum / total;
        els.stats.average.textContent = formatPrice(average);

        const starters = menuItems.filter(i => i.course === 'starter').length;
        const mains = menuItems.filter(i => i.course === 'main-course').length;
        const desserts = menuItems.filter(i => i.course === 'dessert').length;

        els.stats.starters.textContent = starters;
        els.stats.mains.textContent = mains;
        els.stats.desserts.textContent = desserts;
    }

    function addItem(data) {
        const newItem = {
            id: generateId(),
            name: data.name.trim(),
            description: data.description.trim(),
            course: data.course,
            price: parseFloat(data.price)
        };
        menuItems.push(newItem);
        saveItems();
        refreshAllViews();
        showToast('Menu item added successfully.');
        return newItem;
    }

    function updateItem(id, data) {
        const index = menuItems.findIndex(i => i.id === id);
        if (index === -1) return false;

        menuItems[index] = {
            ...menuItems[index],
            name: data.name.trim(),
            description: data.description.trim(),
            course: data.course,
            price: parseFloat(data.price)
        };
        saveItems();
        refreshAllViews();
        showToast('Menu item updated successfully.');
        return true;
    }

    function deleteItem(id) {
        const index = menuItems.findIndex(i => i.id === id);
        if (index === -1) return false;

        const name = menuItems[index].name;
        menuItems.splice(index, 1);
        saveItems();
        refreshAllViews();
        showToast(`"${name}" has been deleted.`);
        return true;
    }

    function getItemById(id) {
        return menuItems.find(i => i.id === id) || null;
    }

    function handleAddSubmit(e) {
        e.preventDefault();
        clearErrors(els.addForm);
        const data = {
            name: document.getElementById('dish-name').value,
            description: document.getElementById('description').value,
            course: document.getElementById('course').value,
            price: document.getElementById('price').value
        };
        const errors = {};
        const rawErrors = validateItem(data);
        if (rawErrors.name) errors['dish-name'] = rawErrors.name;
        if (rawErrors.description) errors['description'] = rawErrors.description;
        if (rawErrors.course) errors['course'] = rawErrors.course;
        if (rawErrors.price) errors['price'] = rawErrors.price;

        if (Object.keys(errors).length > 0) {
            applyErrors(errors);
            showToast('Please fix the errors in the form.', 'error');
            return;
        }
        addItem(data);
        els.addForm.reset();
        window.location.hash = '#menu-items';
    }

    function handleEditSubmit(e) {
        e.preventDefault();
        clearErrors(els.editForm);

        const id = document.getElementById('edit-id').value;
        const data = {
            name: document.getElementById('edit-name').value,
            description: document.getElementById('edit-description').value,
            course: document.getElementById('edit-course').value,
            price: document.getElementById('edit-price').value
        };

        const errors = {};
        const rawErrors = validateItem(data);
        if (rawErrors.name) errors['edit-name'] = rawErrors.name;
        if (rawErrors.description) errors['edit-description'] = rawErrors.description;
        if (rawErrors.course) errors['edit-course'] = rawErrors.course;
        if (rawErrors.price) errors['edit-price'] = rawErrors.price;

        if (Object.keys(errors).length > 0) {
            applyErrors(errors);
            showToast('Please fix the errors in the form.', 'error');
            return;
        }
        if (updateItem(id, data)) {
            window.location.hash = '#menu-items';
        } else {
            showToast('Item not found.', 'error');
        }
    }

    function openEditScreen(id) {
        const item = getItemById(id);
        if (!item) {
            showToast('Item not found.', 'error');
            return;
        }

        document.getElementById('edit-id').value = item.id;
        document.getElementById('edit-name').value = item.name;
        document.getElementById('edit-description').value = item.description;
        document.getElementById('edit-course').value = item.course;
        document.getElementById('edit-price').value = item.price;

        clearErrors(els.editForm);
        window.location.hash = '#edit-item';
    }

    function openDeleteScreen(id) {
        const item = getItemById(id);
        if (!item) {
            showToast('Item not found.', 'error');
            return;
        }
        itemPendingDelete = id;
        els.deleteName.textContent = item.name;
        window.location.hash = '#delete-item';
    }

    function handleConfirmDelete() {
        if (itemPendingDelete) {
            deleteItem(itemPendingDelete);
            itemPendingDelete = null;
            window.location.hash = '#menu-items';
        }
    }

    function handleListClick(e) {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;

        const action = btn.dataset.action;
        const id = btn.dataset.id;

        if (action === 'edit') {
            openEditScreen(id);
        } else if (action === 'delete') {
            openDeleteScreen(id);
        }
    }
    function init() {
        loadItems();
        refreshAllViews();
        els.addForm.addEventListener('submit', handleAddSubmit);
        els.editForm.addEventListener('submit', handleEditSubmit);
        els.addForm.addEventListener('reset', () => {
            setTimeout(() => clearErrors(els.addForm), 0);
        });

        els.confirmDelete.addEventListener('click', handleConfirmDelete);
        els.searchInput.addEventListener('input', applySearchAndFilter);
        els.filterCourse.addEventListener('change', applySearchAndFilter);
        els.clearFilters.addEventListener('click', () => {
            els.searchInput.value = '';
            els.filterCourse.value = '';
            applySearchAndFilter();
            showToast('Search and filter cleared.');
        });
        
        els.menuList.addEventListener('click', handleListClick);
        els.searchResults.addEventListener('click', handleListClick);
        if (!window.location.hash) {
            window.location.hash = '#home';
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
