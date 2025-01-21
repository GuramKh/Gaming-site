document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEYS = {
        CURRENT_USER: 'currentUser',
        USERS: 'users'
    };

    const elements = {
        modal: document.getElementById('editModal'),
        editBtn: document.querySelector('.edit-profile-btn'),
        cancelBtn: document.querySelector('.cancel-btn'),
        editForm: document.getElementById('editProfileForm'),
        displayElements: {
            username: document.getElementById('username'),
            email: document.getElementById('email'),
            favGenre: document.getElementById('favGenre')
        },
        formInputs: {
            username: document.getElementById('editUsername'),
            email: document.getElementById('editEmail'),
            favGenre: document.getElementById('editFavGenre')
        }
    };

    const UserManager = {
        getCurrentUser() {
            try {
                return JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER));
            } catch (error) {
                console.error('Error getting current user:', error);
                return null;
            }
        },

        updateUser(userData) {
            try {
                const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
                const userIndex = users.findIndex(u => u.email === userData.email);

                if (userIndex === -1) throw new Error('User not found');

                users[userIndex] = { ...users[userIndex], ...userData };
                localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
                localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userData));

                return true;
            } catch (error) {
                console.error('Error updating user:', error);
                return false;
            }
        }
    };

    const UIController = {
        updateProfileDisplay(user) {
            elements.displayElements.username.textContent = user.username;
            elements.displayElements.email.textContent = user.email;
            elements.displayElements.favGenre.textContent = user.favGenre || 'Not set';
        },

        initializeEditForm(user) {
            elements.formInputs.username.value = user.username;
            elements.formInputs.email.value = user.email;
            elements.formInputs.favGenre.value = user.favGenre || 'Action';
        },

        toggleModal(show = true) {
            elements.modal.style.display = show ? 'block' : 'none';
        }
    };

    const EventHandlers = {
        handleSubmit(e, currentUser) {
            e.preventDefault();
            
            const updatedUser = {
                ...currentUser,
                username: elements.formInputs.username.value.trim(),
                email: elements.formInputs.email.value.trim(),
                favGenre: elements.formInputs.favGenre.value
            };

            if (UserManager.updateUser(updatedUser)) {
                UIController.updateProfileDisplay(updatedUser);
                UIController.toggleModal(false);
            }
        },

        handleOutsideClick(e) {
            if (e.target === elements.modal) {
                UIController.toggleModal(false);
            }
        }
    };

    const init = () => {
        const currentUser = UserManager.getCurrentUser();
        
        if (!currentUser) {
            window.location.href = 'login.html';
            return;
        }

        elements.editBtn.addEventListener('click', () => {
            UIController.initializeEditForm(currentUser);
            UIController.toggleModal(true);
        });

        elements.cancelBtn.addEventListener('click', () => UIController.toggleModal(false));
        window.addEventListener('click', EventHandlers.handleOutsideClick);
        elements.editForm.addEventListener('submit', (e) => EventHandlers.handleSubmit(e, currentUser));

        UIController.updateProfileDisplay(currentUser);
    };

    init();
});
