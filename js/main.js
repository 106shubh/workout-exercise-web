// Main JavaScript for FitFusion Website

document.addEventListener('DOMContentLoaded', function() {
    // Interactive UI Elements for Workout Cards
    initializeInteractiveWorkoutCards();
    // Mobile Navigation Toggle
    const navLinks = document.getElementById('navLinks');
    const openMenu = document.getElementById('openMenu');
    const closeMenu = document.getElementById('closeMenu');

    if (openMenu && closeMenu && navLinks) {
        openMenu.addEventListener('click', function() {
            navLinks.classList.add('active');
        });

        closeMenu.addEventListener('click', function() {
            navLinks.classList.remove('active');
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // Close mobile menu if open

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for navbar height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Workout Filter Functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const workoutCards = document.querySelectorAll('.workout-card');

    if (filterButtons.length > 0 && workoutCards.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');

                const filterValue = this.getAttribute('data-filter');

                workoutCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // Function to initialize interactive workout cards
    function initializeInteractiveWorkoutCards() {
        const workoutCards = document.querySelectorAll('.workout-card');
        
        workoutCards.forEach(card => {
            // Add hover effect
            card.addEventListener('mouseenter', function() {
                this.classList.add('workout-card-hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('workout-card-hover');
            });
            
            // Add click event to show workout details modal
            card.addEventListener('click', function(e) {
                // Don't trigger if the button was clicked
                if (e.target.tagName === 'BUTTON') return;
                
                const workoutTitle = this.querySelector('h3').textContent;
                const workoutCategory = this.getAttribute('data-category');
                showWorkoutModal(workoutTitle, workoutCategory);
            });
            
            // Add interactive button functionality
            const startButton = card.querySelector('.btn-primary');
            if (startButton) {
                startButton.addEventListener('click', function(e) {
                    e.stopPropagation(); // Prevent card click event
                    const workoutTitle = card.querySelector('h3').textContent;
                    startWorkout(workoutTitle);
                });
            }
        });
        
        // Add interactive elements to "Full Body Strength" workout
        enhanceWorkoutCard('Full Body Strength', {
            exercises: ['Squats', 'Push-ups', 'Deadlifts', 'Bench Press', 'Shoulder Press'],
            duration: '45 min',
            difficulty: 'Intermediate',
            equipment: 'Barbell, Dumbbells, Bench'
        });
        
        // Add interactive elements to "Cardio Blast" workout
        enhanceWorkoutCard('Cardio Blast', {
            exercises: ['High Knees', 'Jumping Jacks', 'Burpees', 'Mountain Climbers', 'Jump Rope'],
            duration: '30 min',
            difficulty: 'Beginner',
            equipment: 'None'
        });
        
        // Add interactive elements to "Dynamic Stretching" workout
        enhanceWorkoutCard('Dynamic Stretching', {
            exercises: ['Leg Swings', 'Arm Circles', 'Hip Rotations', 'Walking Lunges', 'Torso Twists'],
            duration: '20 min',
            difficulty: 'All Levels',
            equipment: 'Yoga Mat'
        });
        
        // Add interactive elements to "HIIT Inferno" workout
        enhanceWorkoutCard('HIIT Inferno', {
            exercises: ['Box Jumps', 'Kettlebell Swings', 'Battle Ropes', 'Sprints', 'Burpee Pull-ups'],
            duration: '25 min',
            difficulty: 'Advanced',
            equipment: 'Kettlebell, Box, Battle Ropes, Pull-up Bar'
        });
    }

    // Function to enhance workout cards with interactive elements
    function enhanceWorkoutCard(workoutTitle, details) {
        const cards = document.querySelectorAll('.workout-card');
        let targetCard;
        
        // Find the card with the matching title
        cards.forEach(card => {
            const title = card.querySelector('h3');
            if (title && title.textContent === workoutTitle) {
                targetCard = card;
            }
        });
        
        if (!targetCard) return;
        
        // Create interactive elements container
        const interactiveElements = document.createElement('div');
        interactiveElements.className = 'workout-interactive';
        interactiveElements.innerHTML = `
            <div class="workout-details-expanded">
                <div class="workout-exercises">
                    <h4>Exercises</h4>
                    <ul>
                        ${details.exercises.map(exercise => `<li>${exercise}</li>`).join('')}
                    </ul>
                </div>
                <div class="workout-info-grid">
                    <div class="info-item">
                        <i class="far fa-clock"></i>
                        <span>${details.duration}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-signal"></i>
                        <span>${details.difficulty}</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-dumbbell"></i>
                        <span>${details.equipment}</span>
                    </div>
                </div>
                <div class="progress-tracker">
                    <div class="progress-label">Completion Progress</div>
                    <div class="progress-bar">
                        <div class="progress" style="width: 0%;"></div>
                    </div>
                    <div class="progress-percentage">0%</div>
                </div>
            </div>
        `;
        
        // Add toggle functionality
        const detailsButton = document.createElement('button');
        detailsButton.className = 'btn-secondary details-toggle';
        detailsButton.innerHTML = '<i class="fas fa-chevron-down"></i> Show Details';
        detailsButton.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click event
            const expanded = interactiveElements.classList.toggle('active');
            this.innerHTML = expanded ? 
                '<i class="fas fa-chevron-up"></i> Hide Details' : 
                '<i class="fas fa-chevron-down"></i> Show Details';
        });
        
        // Insert elements into the card
        const workoutDetails = targetCard.querySelector('.workout-details');
        workoutDetails.appendChild(detailsButton);
        workoutDetails.appendChild(interactiveElements);
    }
    
    // Function to show workout modal
    function showWorkoutModal(workoutTitle, category) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'workout-modal';
        
        // Get workout details based on title
        let exercises, equipment, description;
        
        switch(workoutTitle) {
            case 'Full Body Strength':
                exercises = ['Squats', 'Push-ups', 'Deadlifts', 'Bench Press', 'Shoulder Press'];
                equipment = 'Barbell, Dumbbells, Bench';
                description = 'A comprehensive strength training workout targeting all major muscle groups for balanced development.';
                break;
            case 'Cardio Blast':
                exercises = ['High Knees', 'Jumping Jacks', 'Burpees', 'Mountain Climbers', 'Jump Rope'];
                equipment = 'None';
                description = 'High-energy cardio workout designed to boost your heart rate, improve endurance, and burn calories efficiently.';
                break;
            case 'Dynamic Stretching':
                exercises = ['Leg Swings', 'Arm Circles', 'Hip Rotations', 'Walking Lunges', 'Torso Twists'];
                equipment = 'Yoga Mat';
                description = 'Active stretching routine that improves flexibility, mobility, and prepares your body for more intense exercise.';
                break;
            case 'HIIT Inferno':
                exercises = ['Box Jumps', 'Kettlebell Swings', 'Battle Ropes', 'Sprints', 'Burpee Pull-ups'];
                equipment = 'Kettlebell, Box, Battle Ropes, Pull-up Bar';
                description = 'Intense interval training that maximizes calorie burn, boosts metabolism, and improves cardiovascular fitness in minimal time.';
                break;
            default:
                exercises = [];
                equipment = 'Various';
                description = 'Custom workout routine.';
        }
        
        // Create modal content
        modal.innerHTML = `
            <div class="workout-modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-header ${category}-header">
                    <h2>${workoutTitle}</h2>
                    <div class="workout-category">${category.charAt(0).toUpperCase() + category.slice(1)}</div>
                </div>
                <div class="modal-body">
                    <p class="workout-description">${description}</p>
                    
                    <div class="workout-details-grid">
                        <div class="workout-exercises-list">
                            <h3>Exercises</h3>
                            <ol>
                                ${exercises.map(ex => `<li>${ex}</li>`).join('')}
                            </ol>
                        </div>
                        
                        <div class="workout-meta-info">
                            <div class="meta-item">
                                <i class="fas fa-dumbbell"></i>
                                <span><strong>Equipment:</strong> ${equipment}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-users"></i>
                                <span><strong>Suitable for:</strong> ${category === 'hiit' ? 'Advanced' : 'All levels'}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-fire"></i>
                                <span><strong>Intensity:</strong> ${category === 'hiit' ? 'High' : category === 'flexibility' ? 'Low' : 'Moderate'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="workout-actions">
                        <button class="btn-primary start-workout-btn" data-workout="${workoutTitle}">Start Workout</button>
                        <button class="btn-secondary add-to-favorites-btn"><i class="far fa-heart"></i> Add to Favorites</button>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to the body
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300); // Remove after transition
        });
        
        // Start workout button functionality
        const startBtn = modal.querySelector('.start-workout-btn');
        startBtn.addEventListener('click', () => {
            startWorkout(workoutTitle);
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
        });
        
        // Add to favorites functionality
        const favBtn = modal.querySelector('.add-to-favorites-btn');
        favBtn.addEventListener('click', function() {
            this.innerHTML = '<i class="fas fa-heart"></i> Added to Favorites';
            this.classList.add('favorited');
        });
    }
    
    // Function to start a workout
    function startWorkout(workoutTitle) {
        // Create workout session interface
        const workoutSession = document.createElement('div');
        workoutSession.className = 'workout-session';
        
        // Get exercises based on workout title
        let exercises;
        switch(workoutTitle) {
            case 'Full Body Strength':
                exercises = [
                    {name: 'Barbell Squats', sets: 4, reps: '10-12', rest: '90 sec'},
                    {name: 'Push-ups', sets: 3, reps: '15-20', rest: '60 sec'},
                    {name: 'Deadlifts', sets: 4, reps: '8-10', rest: '120 sec'},
                    {name: 'Bench Press', sets: 3, reps: '10-12', rest: '90 sec'},
                    {name: 'Shoulder Press', sets: 3, reps: '10-12', rest: '90 sec'}
                ];
                break;
            case 'Cardio Blast':
                exercises = [
                    {name: 'High Knees', sets: 3, reps: '45 sec', rest: '30 sec'},
                    {name: 'Jumping Jacks', sets: 3, reps: '45 sec', rest: '30 sec'},
                    {name: 'Burpees', sets: 3, reps: '30 sec', rest: '45 sec'},
                    {name: 'Mountain Climbers', sets: 3, reps: '45 sec', rest: '30 sec'},
                    {name: 'Jump Rope', sets: 3, reps: '60 sec', rest: '30 sec'}
                ];
                break;
            case 'Dynamic Stretching':
                exercises = [
                    {name: 'Leg Swings', sets: 2, reps: '15 each leg', rest: '20 sec'},
                    {name: 'Arm Circles', sets: 2, reps: '20 each direction', rest: '20 sec'},
                    {name: 'Hip Rotations', sets: 2, reps: '10 each side', rest: '20 sec'},
                    {name: 'Walking Lunges', sets: 2, reps: '10 each leg', rest: '30 sec'},
                    {name: 'Torso Twists', sets: 2, reps: '15 each side', rest: '20 sec'}
                ];
                break;
            case 'HIIT Inferno':
                exercises = [
                    {name: 'Box Jumps', sets: 4, reps: '30 sec', rest: '30 sec'},
                    {name: 'Kettlebell Swings', sets: 4, reps: '30 sec', rest: '30 sec'},
                    {name: 'Battle Ropes', sets: 4, reps: '30 sec', rest: '30 sec'},
                    {name: 'Sprints', sets: 4, reps: '20 sec', rest: '40 sec'},
                    {name: 'Burpee Pull-ups', sets: 4, reps: '30 sec', rest: '30 sec'}
                ];
                break;
            default:
                exercises = [];
        }
        
        // Create workout session content
        workoutSession.innerHTML = `
            <div class="workout-session-content">
                <div class="session-header">
                    <h2>${workoutTitle} Workout</h2>
                    <span class="session-close">&times;</span>
                </div>
                <div class="session-timer">
                    <div class="timer-display">00:00</div>
                    <div class="timer-controls">
                        <button class="timer-btn start"><i class="fas fa-play"></i></button>
                        <button class="timer-btn pause"><i class="fas fa-pause"></i></button>
                        <button class="timer-btn reset"><i class="fas fa-redo"></i></button>
                    </div>
                </div>
                <div class="exercise-list">
                    ${exercises.map((ex, index) => `
                        <div class="exercise-item" data-index="${index}">
                            <div class="exercise-header">
                                <h3>${ex.name}</h3>
                                <div class="exercise-meta">
                                    <span>${ex.sets} sets</span>
                                    <span>${ex.reps}</span>
                                    <span>${ex.rest} rest</span>
                                </div>
                                <div class="exercise-status">Pending</div>
                            </div>
                            <div class="set-tracker">
                                ${Array(ex.sets).fill().map((_, i) => `
                                    <div class="set-circle" data-set="${i+1}"></div>
                                `).join('')}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="session-actions">
                    <button class="btn-primary complete-workout">Complete Workout</button>
                </div>
            </div>
        `;
        
        // Add session to the body
        document.body.appendChild(workoutSession);
        
        // Show session with animation
        setTimeout(() => workoutSession.classList.add('active'), 10);
        
        // Close session functionality
        const closeBtn = workoutSession.querySelector('.session-close');
        closeBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to exit this workout?')) {
                workoutSession.classList.remove('active');
                setTimeout(() => workoutSession.remove(), 300);
            }
        });
        
        // Timer functionality
        let seconds = 0;
        let timerInterval;
        const timerDisplay = workoutSession.querySelector('.timer-display');
        const startBtn = workoutSession.querySelector('.timer-btn.start');
        const pauseBtn = workoutSession.querySelector('.timer-btn.pause');
        const resetBtn = workoutSession.querySelector('.timer-btn.reset');
        
        startBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                seconds++;
                const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
                const secs = (seconds % 60).toString().padStart(2, '0');
                timerDisplay.textContent = `${mins}:${secs}`;
            }, 1000);
        });
        
        pauseBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
        });
        
        resetBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            seconds = 0;
            timerDisplay.textContent = '00:00';
        });
        
        // Set tracking functionality
        const setCircles = workoutSession.querySelectorAll('.set-circle');
        setCircles.forEach(circle => {
            circle.addEventListener('click', function() {
                this.classList.toggle('completed');
                
                // Update exercise status
                const exerciseItem = this.closest('.exercise-item');
                const allSets = exerciseItem.querySelectorAll('.set-circle');
                const completedSets = exerciseItem.querySelectorAll('.set-circle.completed');
                const statusEl = exerciseItem.querySelector('.exercise-status');
                
                if (completedSets.length === 0) {
                    statusEl.textContent = 'Pending';
                    statusEl.className = 'exercise-status';
                } else if (completedSets.length === allSets.length) {
                    statusEl.textContent = 'Completed';
                    statusEl.className = 'exercise-status completed';
                } else {
                    statusEl.textContent = 'In Progress';
                    statusEl.className = 'exercise-status in-progress';
                }
                
                // Update overall progress
                updateWorkoutProgress();
            });
        });
        
        // Complete workout button
        const completeBtn = workoutSession.querySelector('.complete-workout');
        completeBtn.addEventListener('click', () => {
            alert('Great job completing your workout! 💪');
            workoutSession.classList.remove('active');
            setTimeout(() => workoutSession.remove(), 300);
            
            // Update card progress
            updateCardProgress(workoutTitle, 100);
        });
        
        // Function to update workout progress
        function updateWorkoutProgress() {
            const allSets = workoutSession.querySelectorAll('.set-circle');
            const completedSets = workoutSession.querySelectorAll('.set-circle.completed');
            const progressPercent = Math.round((completedSets.length / allSets.length) * 100);
            
            // Update card progress
            updateCardProgress(workoutTitle, progressPercent);
        }
    }
    
    // Function to update card progress
    function updateCardProgress(workoutTitle, progressPercent) {
        const cards = document.querySelectorAll('.workout-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3');
            if (title && title.textContent === workoutTitle) {
                const progressBar = card.querySelector('.progress');
                const progressText = card.querySelector('.progress-percentage');
                
                if (progressBar && progressText) {
                    progressBar.style.width = `${progressPercent}%`;
                    progressText.textContent = `${progressPercent}%`;
                }
            }
        });
    }
    
    // Add interactive meal plan functionality
    const mealPlanButton = document.querySelector('.nutrition-content .btn-primary');
    if (mealPlanButton) {
        mealPlanButton.addEventListener('click', showMealPlanModal);
    }
    
    // Function to show meal plan modal
    function showMealPlanModal() {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'meal-plan-modal';
        
        // Create modal content
        modal.innerHTML = `
            <div class="meal-plan-modal-content">
                <span class="modal-close">&times;</span>
                <div class="modal-header">
                    <h2>Create Your Personalized Meal Plan</h2>
                </div>
                <div class="modal-body">
                    <form id="mealPlanForm">
                        <div class="form-group">
                            <label for="fitnessGoal">What is your primary fitness goal?</label>
                            <select id="fitnessGoal" required>
                                <option value="">Select your goal</option>
                                <option value="weight-loss">Weight Loss</option>
                                <option value="muscle-gain">Muscle Gain</option>
                                <option value="maintenance">Maintenance</option>
                                <option value="performance">Athletic Performance</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="dietaryPreference">Do you have any dietary preferences?</label>
                            <select id="dietaryPreference" required>
                                <option value="">Select preference</option>
                                <option value="no-preference">No Specific Preference</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="keto">Keto</option>
                                <option value="paleo">Paleo</option>
                                <option value="mediterranean">Mediterranean</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label for="calorieIntake">Daily Calorie Target</label>
                            <div class="range-slider">
                                <input type="range" id="calorieIntake" min="1200" max="4000" step="100" value="2000">
                                <span class="range-value">2000</span> calories
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Allergies or Restrictions</label>
                            <div class="checkbox-group">
                                <label><input type="checkbox" name="allergies" value="gluten"> Gluten</label>
                                <label><input type="checkbox" name="allergies" value="dairy"> Dairy</label>
                                <label><input type="checkbox" name="allergies" value="nuts"> Nuts</label>
                                <label><input type="checkbox" name="allergies" value="eggs"> Eggs</label>
                                <label><input type="checkbox" name="allergies" value="soy"> Soy</label>
                                <label><input type="checkbox" name="allergies" value="seafood"> Seafood</label>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="mealsPerDay">How many meals per day?</label>
                            <select id="mealsPerDay" required>
                                <option value="3">3 meals</option>
                                <option value="4">4 meals</option>
                                <option value="5">5 meals</option>
                                <option value="6">6 meals</option>
                            </select>
                        </div>
                        
                        <button type="submit" class="btn-primary">Generate Meal Plan</button>
                    </form>
                </div>
            </div>
        `;
        
        // Add modal to the body
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300); // Remove after transition
        });
        
        // Range slider value display
        const rangeSlider = modal.querySelector('#calorieIntake');
        const rangeValue = modal.querySelector('.range-value');
        
        rangeSlider.addEventListener('input', function() {
            rangeValue.textContent = this.value;
        });
        
        // Form submission
        const mealPlanForm = modal.querySelector('#mealPlanForm');
        mealPlanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const goal = document.getElementById('fitnessGoal').value;
            const diet = document.getElementById('dietaryPreference').value;
            const calories = document.getElementById('calorieIntake').value;
            const meals = document.getElementById('mealsPerDay').value;
            
            // Get selected allergies
            const allergies = [];
            document.querySelectorAll('input[name="allergies"]:checked').forEach(checkbox => {
                allergies.push(checkbox.value);
            });
            
            // Close the form modal
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300);
            
            // Show the generated meal plan
            showGeneratedMealPlan(goal, diet, calories, meals, allergies);
        });
    }
    
    // Function to show generated meal plan
    function showGeneratedMealPlan(goal, diet, calories, meals, allergies) {
        // Create modal element
        const modal = document.createElement('div');
        modal.className = 'meal-plan-result-modal';
        
        // Define meal plan based on selections
        let mealPlanTitle, mealPlanDescription, mealPlanItems;
        
        switch(goal) {
            case 'weight-loss':
                mealPlanTitle = 'Weight Loss Meal Plan';
                mealPlanDescription = 'A calorie-controlled meal plan focused on nutrient-dense foods to support fat loss while preserving muscle mass.';
                break;
            case 'muscle-gain':
                mealPlanTitle = 'Muscle Building Meal Plan';
                mealPlanDescription = 'A protein-rich meal plan with adequate calories to support muscle growth and recovery.';
                break;
            case 'maintenance':
                mealPlanTitle = 'Maintenance Meal Plan';
                mealPlanDescription = 'A balanced meal plan to maintain your current weight while supporting overall health and fitness.';
                break;
            case 'performance':
                mealPlanTitle = 'Athletic Performance Meal Plan';
                mealPlanDescription = 'A meal plan optimized for energy, recovery, and performance for active individuals.';
                break;
            default:
                mealPlanTitle = 'Custom Meal Plan';
                mealPlanDescription = 'A personalized meal plan based on your specific needs and preferences.';
        }
        
        // Generate meal plan items based on diet preference
        let breakfastOptions, lunchOptions, dinnerOptions, snackOptions;
        
        if (diet === 'vegetarian') {
            breakfastOptions = ['Greek yogurt with berries and honey', 'Vegetable omelette with toast', 'Overnight oats with fruits and nuts'];
            lunchOptions = ['Quinoa salad with roasted vegetables', 'Lentil soup with whole grain bread', 'Caprese sandwich with side salad'];
            dinnerOptions = ['Vegetable stir-fry with tofu', 'Eggplant parmesan with side salad', 'Bean and cheese enchiladas'];
            snackOptions = ['Apple with almond butter', 'Cottage cheese with pineapple', 'Trail mix with dried fruits'];
        } else if (diet === 'vegan') {
            breakfastOptions = ['Tofu scramble with vegetables', 'Chia seed pudding with almond milk', 'Smoothie bowl with plant-based protein'];
            lunchOptions = ['Buddha bowl with tahini dressing', 'Chickpea salad sandwich', 'Vegetable soup with crusty bread'];
            dinnerOptions = ['Lentil and vegetable curry', 'Vegan pasta primavera', 'Stuffed bell peppers with quinoa'];
            snackOptions = ['Hummus with carrot sticks', 'Roasted chickpeas', 'Energy balls with dates and nuts'];
        } else {
            breakfastOptions = ['Scrambled eggs with whole grain toast', 'Protein smoothie with fruits', 'Oatmeal with nuts and berries'];
            lunchOptions = ['Grilled chicken salad', 'Turkey and avocado wrap', 'Tuna salad with whole grain crackers'];
            dinnerOptions = ['Baked salmon with roasted vegetables', 'Lean beef stir-fry', 'Grilled chicken with quinoa'];
            snackOptions = ['Greek yogurt with honey', 'Protein bar', 'Hard-boiled eggs'];
        }
        
        // Filter out allergens if needed
        if (allergies.length > 0) {
            // Simple filtering logic - in a real app this would be more sophisticated
            if (allergies.includes('nuts')) {
                breakfastOptions = breakfastOptions.filter(item => !item.includes('nuts') && !item.includes('almond'));
                snackOptions = snackOptions.filter(item => !item.includes('nuts') && !item.includes('almond'));
            }
            if (allergies.includes('dairy')) {
                breakfastOptions = breakfastOptions.filter(item => !item.includes('yogurt') && !item.includes('cheese'));
                snackOptions = snackOptions.filter(item => !item.includes('yogurt') && !item.includes('cheese'));
            }
            // Add more allergen filtering as needed
        }
        
        // Create daily meal plans
        const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        let mealPlanHTML = '';
        
        daysOfWeek.forEach(day => {
            const breakfast = breakfastOptions[Math.floor(Math.random() * breakfastOptions.length)];
            const lunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];
            const dinner = dinnerOptions[Math.floor(Math.random() * dinnerOptions.length)];
            
            let mealsHTML = `
                <div class="meal-item">
                    <div class="meal-time">Breakfast</div>
                    <div class="meal-name">${breakfast}</div>
                </div>
                <div class="meal-item">
                    <div class="meal-time">Lunch</div>
                    <div class="meal-name">${lunch}</div>
                </div>
                <div class="meal-item">
                    <div class="meal-time">Dinner</div>
                    <div class="meal-name">${dinner}</div>
                </div>
            `;
            
            // Add snacks based on meals per day selection
            if (meals >= 4) {
                const morningSnack = snackOptions[Math.floor(Math.random() * snackOptions.length)];
                mealsHTML = mealsHTML.replace('</div>
                <div class="meal-item">
                    <div class="meal-time">Lunch', '</div>
                <div class="meal-item">
                    <div class="meal-time">Morning Snack</div>
                    <div class="meal-name">${morningSnack}</div>
                </div>
                <div class="meal-item">
                    <div class="meal-time">Lunch');
            }
            
            if (meals >= 5) {
                const afternoonSnack = snackOptions[Math.floor(Math.random() * snackOptions.length)];
                mealsHTML = mealsHTML.replace('</div>
                <div class="meal-item">
                    <div class="meal-time">Dinner', '</div>
                <div class="meal-item">
                    <div class="meal-time">Afternoon Snack</div>
                    <div class="meal-name">${afternoonSnack}</div>
                </div>
                <div class="meal-item">
                    <div class="meal-time">Dinner');
            }
            
            if (meals >= 6) {
                const eveningSnack = snackOptions[Math.floor(Math.random() * snackOptions.length)];
                mealsHTML += `
                <div class="meal-item">
                    <div class="meal-time">Evening Snack</div>
                    <div class="meal-name">${eveningSnack}</div>
                </div>
                `;
            }
            
            mealPlanHTML += `
                <div class="day-plan">
                    <h3>${day}</h3>
                    <div class="day-meals">
                        ${mealsHTML}
                    </div>
                </div>
            `;
        });
        
        // Create modal content
        modal.innerHTML = `
            <div class="meal-plan-result-content">
                <span class="modal-close">&times;</span>
                <div class="modal-header">
                    <h2>${mealPlanTitle}</h2>
                    <p>${mealPlanDescription}</p>
                    <div class="meal-plan-meta">
                        <div class="meta-item">
                            <i class="fas fa-fire"></i>
                            <span>${calories} calories/day</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-utensils"></i>
                            <span>${meals} meals/day</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-leaf"></i>
                            <span>${diet.charAt(0).toUpperCase() + diet.slice(1).replace('-', ' ')}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="meal-plan-tabs">
                        <button class="tab-btn active" data-tab="weekly">Weekly Plan</button>
                        <button class="tab-btn" data-tab="shopping">Shopping List</button>
                        <button class="tab-btn" data-tab="nutrition">Nutrition Info</button>
                    </div>
                    
                    <div class="tab-content active" id="weekly">
                        <div class="weekly-meal-plan">
                            ${mealPlanHTML}
                        </div>
                    </div>
                    
                    <div class="tab-content" id="shopping">
                        <div class="shopping-list">
                            <h3>Shopping List</h3>
                            <p>Based on your meal plan, here's what you'll need:</p>
                            <div class="shopping-categories">
                                <div class="shopping-category">
                                    <h4>Proteins</h4>
                                    <ul class="shopping-items">
                                        ${diet === 'vegan' ? 
                                            '<li>Tofu</li><li>Tempeh</li><li>Seitan</li><li>Lentils</li><li>Chickpeas</li>' : 
                                            diet === 'vegetarian' ? 
                                                '<li>Eggs</li><li>Greek Yogurt</li><li>Cottage Cheese</li><li>Tofu</li><li>Lentils</li>' : 
                                                '<li>Chicken Breast</li><li>Lean Ground Beef</li><li>Salmon</li><li>Tuna</li><li>Eggs</li>'
                                        }
                                    </ul>
                                </div>
                                <div class="shopping-category">
                                    <h4>Fruits & Vegetables</h4>
                                    <ul class="shopping-items">
                                        <li>Spinach</li>
                                        <li>Broccoli</li>
                                        <li>Bell Peppers</li>
                                        <li>Carrots</li>
                                        <li>Bananas</li>
                                        <li>Berries</li>
                                        <li>Apples</li>
                                    </ul>
                                </div>
                                <div class="shopping-category">
                                    <h4>Grains & Starches</h4>
                                    <ul class="shopping-items">
                                        <li>Brown Rice</li>
                                        <li>Quinoa</li>
                                        <li>Whole Grain Bread</li>
                                        <li>Oats</li>
                                        <li>Sweet Potatoes</li>
                                    </ul>
                                </div>
                                <div class="shopping-category">
                                    <h4>Healthy Fats</h4>
                                    <ul class="shopping-items">
                                        <li>Olive Oil</li>
                                        <li>Avocados</li>
                                        <li>Nuts and Seeds</li>
                                        <li>Nut Butters</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="nutrition">
                        <div class="nutrition-info">
                            <h3>Nutrition Information</h3>
                            <p>Your meal plan is designed to provide approximately:</p>
                            
                            <div class="macros-chart">
                                <div class="macro-item">
                                    <div class="macro-circle protein">
                                        <span>${goal === 'muscle-gain' ? '40' : '30'}%</span>
                                    </div>
                                    <div class="macro-label">Protein</div>
                                </div>
                                <div class="macro-item">
                                    <div class="macro-circle carbs">
                                        <span>${goal === 'weight-loss' ? '30' : '45'}%</span>
                                    </div>
                                    <div class="macro-label">Carbs</div>
                                </div>
                                <div class="macro-item">
                                    <div class="macro-circle fats">
                                        <span>${goal === 'weight-loss' ? '40' : '25'}%</span>
                                    </div>
                                    <div class="macro-label">Fats</div>
                                </div>
                            </div>
                            
                            <div class="nutrition-tips">
                                <h4>Tips for Success</h4>
                                <ul>
                                    <li>Drink at least 8 glasses of water daily</li>
                                    <li>Prepare meals in advance when possible</li>
                                    <li>Adjust portion sizes based on your hunger and activity level</li>
                                    <li>Track your progress and make adjustments as needed</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button class="btn-secondary" id="editMealPlan">Edit Plan</button>
                    <button class="btn-primary" id="downloadMealPlan">Download PDF</button>
                </div>
            </div>
        `;
        
        // Add modal to the body
        document.body.appendChild(modal);
        
        // Show modal with animation
        setTimeout(() => modal.classList.add('active'), 10);
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.modal-close');
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300); // Remove after transition
        });
        
        // Tab switching functionality
        const tabBtns = modal.querySelectorAll('.tab-btn');
        const tabContents = modal.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked button and corresponding content
                this.classList.add('active');
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
        
        // Edit plan button functionality
        const editBtn = modal.querySelector('#editMealPlan');
        editBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.remove();
                showMealPlanModal(); // Reopen the form modal
            }, 300);
        });
        
        // Download button functionality (simulated)
        const downloadBtn = modal.querySelector('#downloadMealPlan');
        downloadBtn.addEventListener('click', () => {
            alert('Your meal plan PDF is being generated and will download shortly.');
            // In a real app, this would trigger a PDF generation and download
        });
    }
    
    // Testimonial Slider
    const testimonialDots = document.querySelectorAll('.dot');
    const testimonialSlider = document.querySelector('.testimonials-slider');

    if (testimonialDots.length > 0 && testimonialSlider) {
        testimonialDots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                // Remove active class from all dots
                testimonialDots.forEach(d => d.classList.remove('active'));
                // Add active class to clicked dot
                this.classList.add('active');

                // Calculate the scroll position
                const cardWidth = testimonialSlider.querySelector('.testimonial-card').offsetWidth;
                const scrollPosition = index * (cardWidth + 32); // 32px is the gap

                testimonialSlider.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });
        });
    }

    // Supplements Slider - Auto scroll functionality
    const supplementsSlider = document.querySelector('.supplements-slider');
    
    if (supplementsSlider) {
        let scrollAmount = 0;
        const scrollSpeed = 1;
        const cardWidth = 350; // Width of each card
        const gap = 32; // Gap between cards
        const totalWidth = supplementsSlider.scrollWidth;
        
        function autoScroll() {
            scrollAmount += scrollSpeed;
            
            if (scrollAmount >= totalWidth - supplementsSlider.offsetWidth) {
                scrollAmount = 0;
            }
            
            supplementsSlider.scrollLeft = scrollAmount;
            requestAnimationFrame(autoScroll);
        }
        
        // Pause auto-scroll when hovering
        supplementsSlider.addEventListener('mouseenter', function() {
            cancelAnimationFrame(autoScroll);
        });
        
        supplementsSlider.addEventListener('mouseleave', function() {
            requestAnimationFrame(autoScroll);
        });
        
        // Start auto-scroll
        requestAnimationFrame(autoScroll);
    }

    // Sticky Navigation
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero');
    
    if (navbar && heroSection) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    }

    // Chat Toggle Functionality
    const chatToggle = document.getElementById('chatToggle');
    const trainerSection = document.getElementById('trainer');
    
    if (chatToggle && trainerSection) {
        chatToggle.addEventListener('click', function() {
            trainerSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Animation on Scroll
    function animateOnScroll() {
        const elements = document.querySelectorAll('.feature-card, .workout-card, .program-card, .community-feature');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Set initial state for animation
    const animatedElements = document.querySelectorAll('.feature-card, .workout-card, .program-card, .community-feature');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run animation on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});