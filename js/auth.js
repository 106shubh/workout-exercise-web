// Authentication JavaScript for FitFusion Website

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const authModals = document.querySelectorAll('.auth-modal');
    const modalOverlay = document.getElementById('modalOverlay');
    const loginBtn = document.querySelector('.btn-primary');
    const signupBtn = document.querySelector('.btn-secondary');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const switchToSignupBtn = document.getElementById('switchToSignup');
    const switchToLoginBtn = document.getElementById('switchToLogin');
    const logoutBtn = document.getElementById('logoutBtn');
    const userProfileBtn = document.getElementById('userProfileBtn');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    // Check if user is logged in
    checkAuthStatus();
    
    // Event Listeners
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            openModal('loginModal');
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', function() {
            openModal('signupModal');
        });
    }
    
    if (closeModalBtns) {
        closeModalBtns.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
    }
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeAllModals);
    }
    
    if (switchToSignupBtn) {
        switchToSignupBtn.addEventListener('click', function() {
            closeAllModals();
            openModal('signupModal');
        });
    }
    
    if (switchToLoginBtn) {
        switchToLoginBtn.addEventListener('click', function() {
            closeAllModals();
            openModal('loginModal');
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Form Submissions
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Functions
    function openModal(modalId) {
        if (modalOverlay) modalOverlay.classList.add('active');
        
        authModals.forEach(modal => {
            if (modal.id === modalId) {
                modal.classList.add('active');
            } else {
                modal.classList.remove('active');
            }
        });
    }
    
    function closeAllModals() {
        if (modalOverlay) modalOverlay.classList.remove('active');
        
        authModals.forEach(modal => {
            modal.classList.remove('active');
        });
    }
    
    function handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const errorMsg = document.getElementById('loginError');
        
        // Reset error message
        if (errorMsg) errorMsg.textContent = '';
        
        // Simple validation
        if (!email || !password) {
            if (errorMsg) errorMsg.textContent = 'Please fill in all fields';
            return;
        }
        
        // Get users from local storage
        const users = JSON.parse(localStorage.getItem('fitFusionUsers')) || [];
        
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Set current user in local storage
            localStorage.setItem('fitFusionCurrentUser', JSON.stringify({
                id: user.id,
                name: user.name,
                email: user.email
            }));
            
            // Update UI
            updateAuthUI(true, user.name);
            
            // Close modal
            closeAllModals();
            
            // Show success message
            showNotification('Login successful! Welcome back, ' + user.name);
        } else {
            if (errorMsg) errorMsg.textContent = 'Invalid email or password';
        }
    }
    
    function handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;
        const errorMsg = document.getElementById('signupError');
        
        // Reset error message
        if (errorMsg) errorMsg.textContent = '';
        
        // Simple validation
        if (!name || !email || !password || !confirmPassword) {
            if (errorMsg) errorMsg.textContent = 'Please fill in all fields';
            return;
        }
        
        if (password !== confirmPassword) {
            if (errorMsg) errorMsg.textContent = 'Passwords do not match';
            return;
        }
        
        if (password.length < 6) {
            if (errorMsg) errorMsg.textContent = 'Password must be at least 6 characters';
            return;
        }
        
        // Get users from local storage
        const users = JSON.parse(localStorage.getItem('fitFusionUsers')) || [];
        
        // Check if user already exists
        if (users.some(user => user.email === email)) {
            if (errorMsg) errorMsg.textContent = 'Email already in use';
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        // Add user to users array
        users.push(newUser);
        
        // Save users to local storage
        localStorage.setItem('fitFusionUsers', JSON.stringify(users));
        
        // Set current user in local storage
        localStorage.setItem('fitFusionCurrentUser', JSON.stringify({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        }));
        
        // Update UI
        updateAuthUI(true, newUser.name);
        
        // Close modal
        closeAllModals();
        
        // Show success message
        showNotification('Account created successfully! Welcome, ' + newUser.name);
    }
    
    function logout() {
        // Remove current user from local storage
        localStorage.removeItem('fitFusionCurrentUser');
        
        // Update UI
        updateAuthUI(false);
        
        // Show success message
        showNotification('You have been logged out');
    }
    
    function checkAuthStatus() {
        const currentUser = JSON.parse(localStorage.getItem('fitFusionCurrentUser'));
        
        if (currentUser) {
            updateAuthUI(true, currentUser.name);
        } else {
            updateAuthUI(false);
        }
    }
    
    function updateAuthUI(isLoggedIn, userName = '') {
        const authButtons = document.querySelector('.user-actions');
        const userProfile = document.querySelector('.user-profile');
        
        if (isLoggedIn) {
            // Hide auth buttons
            if (authButtons) authButtons.style.display = 'none';
            
            // Show user profile
            if (userProfile) {
                userProfile.style.display = 'flex';
                if (userNameDisplay) userNameDisplay.textContent = userName;
            }
        } else {
            // Show auth buttons
            if (authButtons) authButtons.style.display = 'flex';
            
            // Hide user profile
            if (userProfile) userProfile.style.display = 'none';
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('active');
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('active');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});