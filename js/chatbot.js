// Chatbot JavaScript for FitFusion Website

document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chatMessages');
    const userMessageInput = document.getElementById('userMessage');
    const sendMessageButton = document.getElementById('sendMessage');
    
    // Add CSS for typing indicator
    const style = document.createElement('style');
    style.textContent = `
        .typing {
            display: flex;
            align-items: center;
            padding: 10px 15px;
        }
        .typing .dot {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: #777;
            margin-right: 4px;
            animation: typing-dot 1.4s infinite ease-in-out both;
        }
        .typing .dot:nth-child(1) {
            animation-delay: -0.32s;
        }
        .typing .dot:nth-child(2) {
            animation-delay: -0.16s;
        }
        @keyframes typing-dot {
            0%, 80%, 100% { transform: scale(0); }
            40% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // Language detection variables
    const hinglishPatterns = [
        'kya', 'hai', 'kaise', 'kaisa', 'karna', 'hota', 'chahiye', 'acha', 'thik', 'nahi',
        'workout kaise', 'exercise kaise', 'weight kam', 'muscle banane', 'protein kitna',
        'kya khana', 'kya karna', 'kitna time', 'kitne din', 'kab tak', 'kaise kare'
    ];
    
    // Detect if input contains Hinglish
    function containsHinglish(text) {
        const lowercaseText = text.toLowerCase();
        return hinglishPatterns.some(pattern => lowercaseText.includes(pattern));
    }

    // Enhanced knowledge base for the AI Personal Trainer
    const trainerResponses = {
        // Casual conversation and greetings
        'greeting': [
            "Hey there! How can I help with your fitness journey today?",
            "Hi! I'm your FitFusion trainer. What would you like to know about fitness?",
            "Hello! Ready to crush some fitness goals today?",
            "Hey! What's up? How can I help with your workout or nutrition questions?",
            "Hi there! Looking for some fitness advice today?"
        ],
        'bye': [
            "See you later! Keep crushing those fitness goals!",
            "Goodbye! Remember to stay hydrated and keep moving!",
            "Take care! Looking forward to our next fitness chat!",
            "Bye for now! Don't forget your protein shake!",
            "Catch you later! Stay strong and motivated!"
        ],
        'thanks': [
            "You're welcome! Always happy to help with your fitness journey!",
            "No problem at all! That's what I'm here for!",
            "Anytime! Feel free to ask if you have more questions!",
            "Happy to help! Keep up the great work with your fitness goals!",
            "My pleasure! Let me know if you need anything else!"
        ],
        'how are you': [
            "I'm great, thanks for asking! More importantly, how's your fitness journey going?",
            "I'm always at 100% energy and ready to help with your fitness questions! How are you doing?",
            "I'm doing fantastic! Ready to talk about workouts, nutrition, or anything fitness related!",
            "I'm excellent! Even better now that I can help you with your fitness goals. What's on your mind?",
            "I'm operating at peak performance! How can I assist with your health and fitness today?"
        ],
        'wassup': [
            "Hey! Just here helping people crush their fitness goals! What's up with you?",
            "What's up! Ready to talk fitness whenever you are!",
            "Hey there! Just flexing my knowledge muscles. What can I help you with today?",
            "Yo! All good here. Looking to get some fitness advice?",
            "Hey! Nothing much, just waiting to answer your fitness questions!"
        ],
        'joke': [
            "Why don't scientists trust atoms? Because they make up everything... just like people who say they'll start their diet tomorrow!",
            "I told my trainer I want to get toned. He gave me a phone and said 'Call someone who cares.' Turns out I dialed the wrong number!",
            "Why did the gym close down? It just didn't work out!",
            "What do you call a dinosaur that skips leg day? A tyrannosaurus flex!",
            "I'm on a seafood diet. I see food and I eat it... which is why I need this workout plan!"
        ],
        'motivation': [
            "Remember, the only bad workout is the one that didn't happen. Let's crush it today!",
            "Your body can stand almost anything. It's your mind you have to convince!",
            "Don't wish for it, work for it! You've got this!",
            "The pain you feel today will be the strength you feel tomorrow. Keep pushing!",
            "Fitness is not about being better than someone else. It's about being better than you used to be!"
        ],
        // Workout related queries
        'workout': [
            "I recommend starting with a full-body workout 3 times a week if you're a beginner.",
            "For muscle building, focus on compound exercises like squats, deadlifts, bench press, and rows.",
            "To improve cardiovascular fitness, try incorporating 20-30 minutes of HIIT workouts 2-3 times a week.",
            "For weight loss, combine strength training with cardio and maintain a caloric deficit through your diet."
        ],
        'exercise': [
            "Make sure to maintain proper form during exercises to prevent injuries and maximize results.",
            "If you're experiencing pain (not just muscle fatigue), stop the exercise and consider consulting a healthcare professional.",
            "For beginners, bodyweight exercises are a great way to build foundational strength before adding weights.",
            "Remember to breathe properly during exercises - exhale during exertion and inhale during the relaxation phase."
        ],
        'muscle': [
            "To build muscle, ensure you're in a slight caloric surplus and consuming enough protein (around 1.6-2.2g per kg of bodyweight).",
            "Muscle soreness is normal, especially when starting a new routine, but should subside within 24-72 hours.",
            "For optimal muscle growth, aim for 8-12 reps per set with a weight that challenges you by the final rep.",
            "Don't forget to train all major muscle groups for balanced development and to prevent imbalances."
        ],
        'weight': [
            "Sustainable weight loss comes from a combination of regular exercise and a balanced diet in a caloric deficit.",
            "Aim for a gradual weight loss of 0.5-1kg per week for sustainable results.",
            "Strength training helps preserve muscle mass while losing weight, which helps maintain your metabolic rate.",
            "Don't rely solely on the scale - take measurements, progress photos, and note how your clothes fit as well."
        ],
        'cardio': [
            "For heart health, aim for at least 150 minutes of moderate-intensity cardio per week.",
            "HIIT (High-Intensity Interval Training) can be more time-efficient than steady-state cardio for calorie burning.",
            "Mix up your cardio routine with activities like running, cycling, swimming, or rowing to prevent plateaus.",
            "Low-intensity cardio like walking is great for recovery days and can help improve blood flow to sore muscles."
        ],
        
        // Nutrition related queries
        'nutrition': [
            "Focus on whole foods like lean proteins, fruits, vegetables, whole grains, and healthy fats.",
            "Stay hydrated! Aim to drink at least 8 glasses of water daily, more if you're exercising intensely.",
            "Pre-workout nutrition should include carbs for energy and some protein, consumed 1-3 hours before training.",
            "Post-workout, consume protein and carbs within 45 minutes to optimize recovery and muscle protein synthesis."
        ],
        'protein': [
            "Good protein sources include lean meats, fish, eggs, dairy, legumes, and plant-based options like tofu and tempeh.",
            "For muscle building, aim for 1.6-2.2g of protein per kg of bodyweight daily.",
            "Distribute your protein intake throughout the day for optimal muscle protein synthesis.",
            "Protein supplements like whey or plant-based powders can be useful when whole food sources aren't available."
        ],
        'carbs': [
            "Carbohydrates are your body's primary energy source, especially important for high-intensity exercise.",
            "Focus on complex carbs like whole grains, fruits, vegetables, and legumes for sustained energy.",
            "Consider timing higher carb intake around your workouts for optimal performance and recovery.",
            "Low-carb diets may work for some individuals, but they're not necessary for everyone and may impact performance."
        ],
        'fat': [
            "Healthy fats are essential for hormone production, including testosterone which is important for muscle growth.",
            "Include sources of omega-3 fatty acids like fatty fish, flaxseeds, and walnuts in your diet.",
            "Avocados, olive oil, nuts, and seeds are excellent sources of heart-healthy monounsaturated fats.",
            "Fat should make up about 20-35% of your daily caloric intake for optimal health."
        ],
        'meal': [
            "Meal prepping can save time and help you stay consistent with your nutrition goals.",
            "Aim to include protein, complex carbs, and vegetables in most meals for a balanced approach.",
            "Eating smaller, frequent meals works well for some people, while others prefer intermittent fasting approaches.",
            "Listen to your body's hunger and fullness cues rather than strictly adhering to a meal schedule."
        ],
        
        // Supplement related queries
        'supplement': [
            "Supplements should complement a good diet, not replace it.",
            "Protein powder, creatine, and caffeine are among the most research-backed supplements for performance.",
            "Always consult with a healthcare professional before starting any supplement regimen.",
            "Third-party tested supplements help ensure you're getting what's on the label without contaminants."
        ],
        'protein powder': [
            "Whey protein is quickly absorbed and has a complete amino acid profile, making it ideal post-workout.",
            "Plant-based proteins like pea, rice, or hemp are good options for those avoiding animal products.",
            "Look for protein powders with minimal additives, fillers, and added sugars.",
            "Protein powder is convenient but not necessary if you can meet your protein needs through whole foods."
        ],
        'creatine': [
            "Creatine monohydrate is one of the most researched and effective supplements for strength and power.",
            "The standard protocol is 3-5g daily, with no need for a loading phase or cycling.",
            "Creatine works by increasing your body's phosphocreatine stores, which helps regenerate ATP during high-intensity exercise.",
            "Some people may experience water retention initially, but this is not fat gain and is typically temporary."
        ],
        'pre-workout': [
            "The main effective ingredient in most pre-workouts is caffeine, which can improve performance and focus.",
            "Be cautious with pre-workout supplements as many contain proprietary blends with undisclosed amounts of ingredients.",
            "If you're sensitive to stimulants, look for stimulant-free pre-workout options or stick to simple options like coffee.",
            "Cycling off pre-workout occasionally can prevent tolerance buildup to caffeine."
        ],
        
        // Recovery related queries
        'recovery': [
            "Adequate sleep (7-9 hours) is crucial for recovery, hormone regulation, and overall performance.",
            "Active recovery like light walking, swimming, or yoga can help improve blood flow to sore muscles.",
            "Don't underestimate the importance of rest days in your training schedule.",
            "Stress management techniques like meditation can help optimize your recovery and results."
        ],
        'sleep': [
            "Aim for 7-9 hours of quality sleep per night for optimal recovery and performance.",
            "Create a consistent sleep schedule by going to bed and waking up at similar times each day.",
            "Limit screen time and avoid caffeine in the hours leading up to bedtime.",
            "A cool, dark, and quiet sleeping environment can significantly improve sleep quality."
        ],
        'stretch': [
            "Dynamic stretching is best before workouts to prepare your muscles for activity.",
            "Static stretching is more appropriate after workouts or on recovery days when muscles are warm.",
            "Incorporate mobility work focusing on joints and movement patterns relevant to your training.",
            "Regular stretching can help improve flexibility, reduce injury risk, and enhance recovery."
        ],
        'injury': [
            "For acute injuries, remember RICE: Rest, Ice, Compression, and Elevation.",
            "Minor soreness is normal, but sharp or persistent pain should be evaluated by a healthcare professional.",
            "Gradually increase training intensity to allow your body to adapt and reduce injury risk.",
            "Proper warm-up and cool-down protocols can significantly reduce your risk of injury."
        ],
        
        // General fitness queries
        'motivation': [
            "Set specific, measurable, achievable, relevant, and time-bound (SMART) goals to stay motivated.",
            "Find a workout buddy or community for accountability and support.",
            "Track your progress with measurements, photos, or performance metrics to see how far you've come.",
            "Remember your 'why' - the deeper reason behind your fitness journey that goes beyond aesthetics."
        ],
        'plateau': [
            "Plateaus are normal! Try changing variables like exercise selection, rep ranges, rest periods, or training splits.",
            "Ensure you're progressively overloading by increasing weight, reps, sets, or decreasing rest over time.",
            "Sometimes a deload week with reduced volume and intensity can help break through plateaus.",
            "Review your nutrition and recovery practices, as these often contribute to plateaus."
        ],
        'beginner': [
            "Start with full-body workouts 2-3 times per week focusing on compound movements.",
            "Focus on learning proper form before adding heavy weights.",
            "Consistency is more important than perfection when you're starting out.",
            "Don't compare your beginning to someone else's middle - everyone starts somewhere!"
        ],
        'goal': [
            "Set both process goals (e.g., work out 3x/week) and outcome goals (e.g., lose 5kg) for balance.",
            "Break larger goals into smaller milestones to make them more manageable and to celebrate progress.",
            "Regularly reassess your goals as you progress and adjust as needed.",
            "Write down your goals and share them with someone to increase accountability."
        ],
        
        // Default responses
        'default': [
            "I'm here to help with your fitness journey! Feel free to ask me about workouts, nutrition, supplements, or recovery strategies.",
            "I don't have information on that specific topic. Could you try rephrasing or ask me about workouts, nutrition, recovery, or supplements?",
            "That's a great question! While I don't have a specific answer for that, I can help with workout plans, nutrition advice, and general fitness guidance.",
            "I'm your AI Personal Trainer, focused on helping you achieve your fitness goals. What specific aspect of fitness can I assist you with today?"
        ],
        
        // Specific workout types
        'strength': [
            "Strength training is crucial for building muscle mass and increasing bone density. Focus on compound movements like squats, deadlifts, and bench press.",
            "For optimal strength gains, work in the 3-5 rep range with heavier weights and longer rest periods (3-5 minutes between sets).",
            "Progressive overload is key for strength - gradually increase weight over time while maintaining proper form.",
            "Consider a training split like Push/Pull/Legs or Upper/Lower to allow adequate recovery between strength sessions."
        ],
        'hypertrophy': [
            "For muscle hypertrophy (growth), aim for 8-12 reps per set with moderate weights and 60-90 seconds rest between sets.",
            "To maximize hypertrophy, focus on time under tension - control the eccentric (lowering) phase of each movement.",
            "Training each muscle group 2-3 times per week with sufficient volume (10-20 sets per muscle group weekly) is optimal for growth.",
            "Mind-muscle connection is important for hypertrophy - focus on feeling the target muscle working during each exercise."
        ],
        'endurance': [
            "Muscular endurance training typically involves higher reps (15+) with lighter weights and shorter rest periods.",
            "Circuit training is excellent for building muscular endurance while also providing cardiovascular benefits.",
            "For endurance athletes, incorporate sport-specific movements in your strength routine to improve performance.",
            "Gradually increase training volume over time to improve your muscular endurance capacity."
        ],
        'hiit': [
            "HIIT (High-Intensity Interval Training) alternates between intense work periods and recovery periods, typically in a 1:1 or 1:2 ratio.",
            "A simple HIIT protocol is 30 seconds of all-out effort followed by 30-60 seconds of recovery, repeated for 15-20 minutes.",
            "HIIT is time-efficient and great for fat loss, but limit sessions to 2-3 per week to allow for recovery.",
            "You can apply HIIT principles to various exercises: sprinting, cycling, bodyweight exercises, or even resistance training."
        ],
        'calisthenics': [
            "Calisthenics uses bodyweight exercises to build strength, flexibility, and control - perfect for developing functional fitness.",
            "Progressive calisthenics follows a clear path: master basic movements before advancing to harder variations.",
            "Key calisthenics exercises include push-ups, pull-ups, dips, squats, and various core movements.",
            "For advanced calisthenics skills like muscle-ups or handstands, consistent practice and proper progression are essential."
        ],
        'yoga': [
            "Yoga combines physical postures, breathing techniques, and meditation to improve strength, flexibility, and mental well-being.",
            "For athletes, yoga can be an excellent complement to intense training, helping with recovery and preventing injuries.",
            "Different yoga styles offer different benefits: Hatha for beginners, Vinyasa for flow and strength, Yin for deep stretching.",
            "Consistency in yoga practice is more important than intensity - even 10-15 minutes daily can provide benefits."
        ],
        'pilates': [
            "Pilates focuses on core strength, proper alignment, and controlled, precise movements.",
            "The Pilates principle of 'centering' teaches you to initiate movements from a strong core, which can improve all athletic performance.",
            "Pilates can be particularly beneficial for improving posture and preventing or rehabilitating from back pain.",
            "While less intense than some workouts, Pilates effectively builds functional strength and body awareness."
        ],
        
        // Specific body parts training
        'chest': [
            "Key chest exercises include bench press variations, push-ups, dips, and flyes - aim to include both compound and isolation movements.",
            "To target different parts of the chest, adjust the angle: incline for upper chest, flat for mid-chest, and decline for lower chest.",
            "For chest development, focus on full range of motion and feeling a good stretch at the bottom of movements.",
            "If you're struggling with chest growth, ensure you're not letting your front deltoids take over - focus on proper form and mind-muscle connection."
        ],
        'back': [
            "A well-developed back requires both vertical pulling (pull-ups, lat pulldowns) and horizontal pulling (rows) movements.",
            "To engage your lats properly, think about pulling with your elbows rather than your hands.",
            "For complete back development, include exercises for your traps (shrugs), rhomboids (face pulls), and lower back (hyperextensions).",
            "Many people have underdeveloped back muscles due to modern lifestyles - prioritize back training for balanced physique and posture."
        ],
        'legs': [
            "Don't skip leg day! Strong legs support overall strength, athletic performance, and metabolic health.",
            "Key leg exercises include squats, deadlifts, lunges, leg press, and hip thrusts - aim for a mix of quad, hamstring, and glute-focused movements.",
            "For leg hypertrophy, higher volume approaches often work well - try 12-20 rep ranges for some exercises.",
            "If you struggle with recovery from leg workouts, consider splitting them into quad-focused and hamstring/glute-focused days."
        ],
        'arms': [
            "For complete arm development, balance triceps and biceps training, as triceps actually make up about 2/3 of your arm size.",
            "Key bicep exercises include various curls (barbell, dumbbell, hammer, preacher), while triceps respond well to pushdowns, dips, and overhead extensions.",
            "For arm growth, ensure you're training them with sufficient volume and intensity - they can often handle more frequent training than larger muscle groups.",
            "Don't forget forearm training for complete arm development and improved grip strength."
        ],
        'shoulders': [
            "Complete shoulder development requires training all three deltoid heads: front (overhead press, front raises), side (lateral raises), and rear (reverse flyes, face pulls).",
            "Many people overemphasize front delts through pressing movements - pay special attention to side and rear delt training for balance.",
            "Shoulder health is crucial - include rotator cuff exercises and proper warm-ups to prevent injuries.",
            "For boulder shoulders, lateral raises are your best friend - focus on proper form rather than heavy weight."
        ],
        'core': [
            "Your core includes more than just abs - it encompasses your entire midsection including obliques, lower back, and deep stabilizing muscles.",
            "For functional core strength, include anti-movement exercises like planks (anti-extension), Pallof presses (anti-rotation), and suitcase carries (anti-lateral flexion).",
            "To reveal your abs, focus on reducing overall body fat through diet and exercise - spot reduction is a myth.",
            "For complete core development, include a variety of movements: flexion (crunches), rotation (Russian twists), and stabilization (planks)."
        ],
        'glutes': [
            "The gluteal muscles are the largest in your body and crucial for power, performance, and posture.",
            "Key glute exercises include hip thrusts, squats, lunges, deadlifts, and kickbacks - focus on full hip extension.",
            "Many people have 'sleepy glutes' due to sitting too much - activation exercises like glute bridges before your workout can help.",
            "For glute hypertrophy, ensure you're feeling the target muscles working - adjust foot positioning and focus on squeezing at the top of movements."
        ],
        
        // Specific fitness goals
        'weight loss': [
            "Sustainable weight loss comes from a caloric deficit of 300-500 calories per day, combining diet adjustments and increased activity.",
            "For fat loss, combine strength training (to preserve muscle) with strategic cardio and a protein-rich diet.",
            "Weight fluctuates daily due to water, food, and other factors - focus on weekly trends rather than daily numbers.",
            "The most sustainable weight loss approach is one that includes foods you enjoy and exercise you can maintain long-term."
        ],
        'muscle gain': [
            "To build muscle, you need a slight caloric surplus (200-300 extra calories), sufficient protein (1.6-2.2g per kg bodyweight), and progressive resistance training.",
            "Natural muscle building is a slow process - aim for 1-2% of body weight gain per month to minimize fat gain.",
            "For optimal muscle growth, ensure you're training with sufficient volume (10-20 sets per muscle group per week) and intensity (most sets taken close to failure).",
            "Recovery is when muscle growth happens - prioritize sleep, nutrition, and stress management alongside your training."
        ],
        'toning': [
            "'Toning' is achieved through a combination of building some muscle and reducing body fat to improve muscle definition.",
            "Resistance training is essential for a toned look - don't fear weights, as they help create the shape you're looking for.",
            "For a toned physique, combine strength training (moderate weights, 8-15 rep range) with some cardio and a diet that supports your goals.",
            "Consistency is key for toning - aim for 3-5 strength sessions per week and gradual nutrition improvements."
        ],
        'athletic': [
            "Athletic performance training should be specific to your sport while developing overall qualities like strength, power, endurance, and mobility.",
            "Periodization is important for athletes - organize your training year into phases focusing on different qualities (base building, strength, power, competition, recovery).",
            "Compound, multi-joint movements that mimic sport-specific patterns should form the foundation of athletic training.",
            "Recovery becomes even more critical for athletes - consider techniques like contrast baths, compression, and planned deload weeks."
        ],
        'functional': [
            "Functional fitness focuses on movements that improve your ability to perform daily activities and prevent injuries.",
            "Key functional training elements include multi-planar movements, balance challenges, core stability, and coordination drills.",
            "Functional training often utilizes tools like kettlebells, medicine balls, TRX, and bodyweight exercises that require full-body integration.",
            "For improved functional fitness, train movements rather than muscles - think pushing, pulling, squatting, hinging, rotating, carrying, and bracing."
        ],
        
        // Training approaches
        'split': [
            "Common training splits include Push/Pull/Legs, Upper/Lower, Body Part splits, and Full Body routines - the best one depends on your schedule, experience level, and goals.",
            "For beginners, full body routines 3x per week allow for frequent practice of movement patterns and adequate recovery.",
            "Push/Pull/Legs splits work well for intermediate lifters, allowing each muscle group to be trained 1-2x weekly with sufficient volume.",
            "More advanced lifters might benefit from specialized splits that allow for greater volume and frequency for lagging body parts."
        ],
        'frequency': [
            "Research suggests that training each muscle group 2-3 times per week is optimal for most people.",
            "Training frequency should be balanced with recovery capacity - more frequent sessions generally require lower volume per session.",
            "As you advance, you may find different muscle groups respond better to different frequencies - customize based on your results and recovery.",
            "Higher frequency training can be beneficial for skill development and technique practice."
        ],
        'intensity': [
            "Training intensity can be measured by percentage of one-rep max, proximity to failure, or rate of perceived exertion (RPE).",
            "For strength development, higher intensities (85%+ of 1RM or 1-6 reps) are generally most effective.",
            "For hypertrophy, moderate intensities (70-85% of 1RM or 6-12 reps) taken close to failure are typically optimal.",
            "Varying your training intensity is important - include both higher and lower intensity periods in your program."
        ],
        'volume': [
            "Training volume (sets × reps × weight) is a key driver of progress, particularly for hypertrophy.",
            "Most research suggests 10-20 sets per muscle group per week is an effective volume range for growth.",
            "Volume should be increased gradually over time as your work capacity and recovery ability improve.",
            "If you're not progressing, consider whether you need to increase volume (not seeing results) or decrease volume (showing signs of overtraining)."
        ],
        'progressive': [
            "Progressive overload - gradually increasing the demands on your body - is the fundamental principle behind all fitness progress.",
            "Progressive overload can be achieved through more weight, more reps, more sets, better technique, shorter rest periods, or increased range of motion.",
            "Track your workouts to ensure you're progressively overloading - what gets measured gets improved.",
            "Progress isn't always linear - expect periods of rapid improvement followed by plateaus that require strategic changes."
        ],
        
        // Special populations
        'senior': [
            "For seniors, resistance training is especially important to combat age-related muscle loss (sarcopenia) and maintain independence.",
            "Focus on functional movements that support daily activities: squatting, pushing, pulling, and balance exercises.",
            "Start with bodyweight or light resistance and progress gradually, focusing on proper form and controlled movements.",
            "Consistency is more important than intensity - aim for 2-3 strength sessions per week with adequate recovery time."
        ],
        
        // Medication related queries
        'medication': [
            "Always consult with a healthcare professional before starting any new medication, especially if you're taking other medications or supplements.",
            "Some medications may affect your exercise performance or recovery - discuss this with your doctor if you notice changes.",
            "Certain medications may impact hydration needs or electrolyte balance during exercise - stay extra hydrated if this applies to you.",
            "If you're taking medications that affect heart rate or blood pressure, you may need to adjust how you monitor exercise intensity."
        ],
        'supplements': [
            "Before taking any supplements, consult with a healthcare provider, especially if you're on medication or have health conditions.",
            "Third-party tested supplements help ensure quality and reduce the risk of contamination or banned substances.",
            "More expensive doesn't always mean better - look for supplements with research-backed ingredients and proper dosages.",
            "Remember that supplements are meant to supplement a good diet, not replace proper nutrition."
        ],
        'pain medication': [
            "Using pain medication to mask pain during exercise can lead to injury - address the root cause instead.",
            "Anti-inflammatory medications (like ibuprofen) taken regularly may interfere with the muscle adaptation process after training.",
            "For acute injuries, follow your doctor's advice on appropriate pain management while healing.",
            "Consider natural anti-inflammatory approaches like proper nutrition, adequate sleep, and stress management."
        ],
        'pre workout': [
            "Pre-workout supplements typically contain caffeine and other stimulants - be aware of your sensitivity and timing of intake.",
            "Check pre-workout ingredients carefully - some contain high doses of stimulants or unregulated compounds.",
            "You can create your own pre-workout with simple ingredients like coffee, a banana, and a small protein snack.",
            "If you use pre-workout regularly, consider cycling off periodically to prevent tolerance buildup."
        ],
        'recovery medication': [
            "Recovery aids like BCAAs and glutamine have mixed scientific support - focus on overall protein intake first.",
            "Tart cherry juice has some evidence for reducing inflammation and improving recovery after intense exercise.",
            "Magnesium supplements may help with muscle relaxation and sleep quality, supporting overall recovery.",
            "Curcumin (from turmeric) has anti-inflammatory properties that may support recovery, but absorption can be an issue without proper formulation."
        ],
        
        // Hinglish responses
        'hinglish': [
            "Aapke workout routine mein variety add karna important hai for better results. Try different exercises every week!",
            "Protein intake ka dhyan rakhna bahut zaroori hai muscle building ke liye. Aim for 1.6-2g per kg of bodyweight.",
            "Weight loss ke liye, diet aur exercise dono important hain. Calorie deficit maintain karein but extreme restriction se bachein.",
            "Recovery bhi utni hi important hai jitni workout. Make sure aap enough sleep le rahe hain aur proper nutrition follow kar rahe hain.",
            "Consistency is key! Fitness ek marathon hai, sprint nahi. Regular small efforts will give better results than occasional intense workouts."
        ],
        'youth': [
            "Youth fitness should focus on developing fundamental movement skills, body awareness, and making exercise enjoyable.",
            "For children and adolescents, bodyweight exercises and proper technique should be mastered before adding external resistance.",
            "Variety is important for youth fitness - incorporate games, sports, and play-based activities alongside more structured exercise.",
            "For young athletes, avoid early specialization - developing a broad athletic foundation leads to better long-term development and fewer injuries."
        ],
        'pregnant': [
            "Exercise during pregnancy (with healthcare provider approval) offers benefits including better mood, improved sleep, and potentially easier labor.",
            "Focus on maintaining fitness rather than making significant gains, and listen to your body - pregnancy is not the time to push limits.",
            "Avoid exercises that involve lying flat on your back after the first trimester, and be cautious with movements that challenge balance as pregnancy progresses.",
            "Pelvic floor exercises are particularly beneficial during and after pregnancy."
        ],
        'beginner fitness': [
            "As a beginner, focus on consistency and building the exercise habit rather than perfect programming.",
            "Start with full-body workouts 2-3 times per week, focusing on fundamental movement patterns and proper form.",
            "Begin with bodyweight or light resistance and gradually increase as you master techniques.",
            "Don't be intimidated - everyone starts somewhere, and consistent effort leads to progress."
        ],
        'rehabilitation': [
            "When returning from injury, work closely with healthcare professionals like physical therapists to ensure safe progression.",
            "Focus first on restoring pain-free range of motion before adding resistance or intensity.",
            "Rehabilitation should be progressive - gradually increase demands on the injured area as healing allows.",
            "Pay attention to compensatory patterns that may have developed during injury and work to correct them."
        ]
    };

    // Function to add a message to the chat
    function addMessage(message, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = isUser ? 'message user-message' : 'message trainer-message';
        
        const messagePara = document.createElement('p');
        messagePara.textContent = message;
        
        messageDiv.appendChild(messagePara);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Store conversation context for more natural interactions
    let conversationContext = {
        lastTopic: null,
        questionCount: 0,
        askedTopics: []
    };
    
    // Function to get a response from the AI trainer with improved matching
    function getTrainerResponse(userInput) {
        const input = userInput.toLowerCase();
        conversationContext.questionCount++;
        
        // Check for casual greetings and conversations first
        const casualConversationPatterns = {
            greeting: ['hi', 'hello', 'hey', 'hola', 'namaste', 'sup', 'yo', 'greetings', 'good morning', 'good afternoon', 'good evening'],
            bye: ['bye', 'goodbye', 'see you', 'talk later', 'cya', 'gtg', 'have to go', 'catch you later', 'farewell', 'adios', 'alvida'],
            thanks: ['thanks', 'thank you', 'thx', 'appreciate it', 'grateful', 'thankyou', 'thank u', 'ty', 'dhanyawad', 'shukriya'],
            how_are_you: ['how are you', 'how r u', 'how you doing', 'how\'s it going', 'whats up', 'how are things', 'how is it going', 'how do you do', 'kaise ho', 'kaisa hai'],
            wassup: ['wassup', 'wazzup', 'sup', 'what\'s up', 'what up', 'whats good', 'what\'s happening', 'kya chal raha hai'],
            joke: ['joke', 'tell me a joke', 'make me laugh', 'funny', 'humor me', 'say something funny', 'mazak', 'joke sunao']
        };
        
        // Check for casual conversation matches
        for (const [category, patterns] of Object.entries(casualConversationPatterns)) {
            if (patterns.some(pattern => input.includes(pattern))) {
                const responseCategory = category === 'how_are_you' ? 'how are you' : 
                                        category === 'wassup' ? 'wassup' : category;
                                        
                const responses = trainerResponses[responseCategory];
                if (responses) {
                    return responses[Math.floor(Math.random() * responses.length)];
                }
            }
        }
        
        // Check if input is in Hinglish
        if (containsHinglish(input)) {
            // For Hinglish inputs, provide Hinglish responses
            const hinglishResponses = trainerResponses['hinglish'];
            
            // Still try to detect the topic in Hinglish
            const hinglishTopicMap = {
                'workout': ['workout', 'exercise', 'gym', 'training', 'vyayam', 'kasrat', 'exercise'],
                'weight loss': ['weight loss', 'weight kam', 'patla', 'vajan', 'motapa', 'fat loss'],
                'muscle': ['muscle', 'muscles', 'bodybuilding', 'strong', 'strength', 'takat', 'mota'],
                'nutrition': ['nutrition', 'diet', 'khana', 'khaana', 'protein', 'carbs', 'fat', 'healthy food'],
                'recovery': ['recovery', 'rest', 'sleep', 'aaram', 'neend', 'thakan', 'sore']
            };
            
            // Check for topic matches in Hinglish
            for (const [topic, patterns] of Object.entries(hinglishTopicMap)) {
                if (patterns.some(pattern => input.includes(pattern))) {
                    conversationContext.lastTopic = topic;
                    conversationContext.askedTopics.push(topic);
                    return hinglishResponses[Math.floor(Math.random() * hinglishResponses.length)];
                }
            }
            
            // If no specific topic detected in Hinglish, return general Hinglish response
            return hinglishResponses[Math.floor(Math.random() * hinglishResponses.length)];
        }
        
        // Create an array to track matching keywords and their relevance scores
        let matches = [];
        
        // Check for keywords in the user's message with relevance scoring
        for (const [keyword, responses] of Object.entries(trainerResponses)) {
            // Skip the default category and conversation categories in the initial matching
            if (keyword === 'default' || keyword === 'greeting' || keyword === 'bye' || 
                keyword === 'thanks' || keyword === 'how are you' || keyword === 'wassup' || 
                keyword === 'joke' || keyword === 'hinglish') continue;
            
            // Different matching strategies with different weights
            // Exact match (highest priority)
            if (input === keyword) {
                matches.push({ keyword, score: 10, responses });
                continue;
            }
            
            // Direct inclusion of keyword
            if (input.includes(keyword)) {
                // Higher score for standalone word matches with word boundaries
                const wordBoundaryRegex = new RegExp(`\\b${keyword}\\b`, 'i');
                const score = wordBoundaryRegex.test(input) ? 8 : 5;
                matches.push({ keyword, score, responses });
                continue;
            }
            
            // Check for plural forms or common variations
            if (keyword.length > 3) {
                const pluralKeyword = keyword + 's';
                const singularKeyword = keyword.endsWith('s') ? keyword.slice(0, -1) : null;
                
                if (pluralKeyword && input.includes(pluralKeyword)) {
                    matches.push({ keyword, score: 4, responses });
                    continue;
                }
                
                if (singularKeyword && input.includes(singularKeyword)) {
                    matches.push({ keyword, score: 4, responses });
                    continue;
                }
            }
            
            // Check for partial matches in longer phrases
            if (keyword.length > 5 && input.includes(keyword.substring(0, 5))) {
                matches.push({ keyword, score: 2, responses });
                continue;
            }
            
            // Check for semantic similarity with synonyms
            const keywordSynonyms = {
                'workout': ['training', 'routine', 'regimen', 'program', 'plan', 'session'],
                'exercise': ['movement', 'activity', 'drill', 'exertion', 'working out'],
                'muscle': ['muscular', 'physique', 'build', 'bulk', 'gains', 'definition'],
                'weight': ['pounds', 'kilos', 'kg', 'lb', 'mass', 'heavy', 'light'],
                'cardio': ['aerobic', 'cardiovascular', 'endurance', 'stamina', 'heart rate'],
                'nutrition': ['diet', 'food', 'eating', 'meal', 'macros', 'calories'],
                'protein': ['amino acids', 'whey', 'casein', 'shake', 'powder'],
                'medication': ['medicine', 'drug', 'pill', 'prescription', 'tablet', 'supplement']
            };
            
            if (keywordSynonyms[keyword]) {
                for (const synonym of keywordSynonyms[keyword]) {
                    if (input.includes(synonym)) {
                        matches.push({ keyword, score: 3, responses });
                        break;
                    }
                }
            }
        }
        
        // Sort matches by score (highest first)
        matches.sort((a, b) => b.score - a.score);
        
        // If we have matches, use the highest scoring one
        if (matches.length > 0) {
            const bestMatch = matches[0];
            conversationContext.lastTopic = bestMatch.keyword;
            conversationContext.askedTopics.push(bestMatch.keyword);
            
            // Return a random response from the best matching category
            return bestMatch.responses[Math.floor(Math.random() * bestMatch.responses.length)];
        }
        
        // Context-aware fallback: If we have a previous topic and this seems like a follow-up question
        const followUpIndicators = [
            'what about', 'how about', 'and', 'what else', 'more', 'another', 'also', 'too',
            'tell me more', 'elaborate', 'explain', 'details', 'continue', 'go on',
            'aur batao', 'kya aur', 'aage', 'aur kya'
        ];
        const mightBeFollowUp = followUpIndicators.some(indicator => input.includes(indicator));
        
        if (conversationContext.lastTopic && mightBeFollowUp) {
            const lastTopicResponses = trainerResponses[conversationContext.lastTopic];
            // Find a response we haven't used recently if possible
            let responseIndex = Math.floor(Math.random() * lastTopicResponses.length);
            return `Following up on ${conversationContext.lastTopic}: ${lastTopicResponses[responseIndex]}`;
        }
        
        // If no keywords match, return a default response
        const defaultResponses = trainerResponses['default'];
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Function to handle sending a message
    function sendMessage() {
        const userMessage = userMessageInput.value.trim();
        
        if (userMessage) {
            // Add the user's message to the chat
            addMessage(userMessage, true);
            
            // Clear the input field
            userMessageInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message trainer-message typing';
            typingIndicator.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
            chatMessages.appendChild(typingIndicator);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            
            // Simulate AI thinking with a variable delay based on message length
            // This makes the chatbot feel more human-like
            const thinkingTime = Math.min(700 + userMessage.length * 10, 2000); // Between 700ms and 2000ms
            
            setTimeout(() => {
                // Remove typing indicator
                chatMessages.removeChild(typingIndicator);
                
                // Determine if input is Hinglish
                const isHinglishInput = containsHinglish(userMessage.toLowerCase());
                
                // First check if this is a complex question spanning multiple topics
                const complexResponse = handleComplexQuestion(userMessage.toLowerCase());
                
                let response;
                if (complexResponse) {
                    // If we have a complex response, use that
                    response = complexResponse;
                } else {
                    // Otherwise use the standard response matching
                    response = getTrainerResponse(userMessage);
                }
                
                // Add human-like touch to responses
                if (Math.random() < 0.3 && !isHinglishInput) {
                    const humanTouches = [
                        `${response}`,
                        `${response} 💪`,
                        `${response} Hope that helps!`,
                        `${response} Does that answer your question?`,
                        `Great question! ${response}`,
                        `${response} Let me know if you need more details!`
                    ];
                    response = humanTouches[Math.floor(Math.random() * humanTouches.length)];
                }
                
                // Add the response to the chat
                addMessage(response);
                
                // If this is the user's 3rd question or more, occasionally suggest related topics
                if (conversationContext.questionCount >= 3 && Math.random() < 0.3) {
                    setTimeout(() => {
                        suggestRelatedTopic();
                    }, 1500); // Delay the suggestion to make it feel more natural
                }
            }, thinkingTime);
        }
    }
    
    // Function to suggest related topics based on conversation history
    function suggestRelatedTopic() {
        if (!conversationContext.lastTopic) return;
        
        // Define topic relationships for better suggestions
        const topicRelationships = {
            'workout': ['exercise', 'muscle', 'strength', 'cardio'],
            'nutrition': ['protein', 'carbs', 'fat', 'meal'],
            'strength': ['muscle', 'progressive', 'hypertrophy', 'weight'],
            'cardio': ['endurance', 'hiit', 'weight loss'],
            'muscle': ['hypertrophy', 'protein', 'strength', 'recovery'],
            'weight loss': ['cardio', 'nutrition', 'calorie', 'hiit'],
            'recovery': ['sleep', 'stretch', 'nutrition'],
            // Add more relationships as needed
        };
        
        // Get related topics for the last discussed topic
        const relatedTopics = topicRelationships[conversationContext.lastTopic] || [];
        
        // Filter out topics already discussed in this conversation
        const newTopics = relatedTopics.filter(topic => 
            !conversationContext.askedTopics.includes(topic) && 
            trainerResponses[topic] // Make sure the topic exists in our knowledge base
        );
        
        // If we have new related topics, suggest one
        if (newTopics.length > 0) {
            const suggestedTopic = newTopics[Math.floor(Math.random() * newTopics.length)];
            setTimeout(() => {
                addMessage(`Would you also like to know about ${suggestedTopic}? It's related to what we've been discussing.`);
            }, 2000);
        }
    }

    // Event listeners
    if (sendMessageButton && userMessageInput) {
        sendMessageButton.addEventListener('click', sendMessage);
        
        userMessageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }

    // Function to handle complex questions that might span multiple topics
    function handleComplexQuestion(input) {
        // Check if the question contains multiple topics
        let detectedTopics = [];
        let topicScores = {};
        
        // Define topic synonyms and related terms for better matching
        const topicSynonyms = {
            'workout': ['training', 'routine', 'regimen', 'program', 'plan', 'session', 'gym', 'fitness'],
            'exercise': ['movement', 'activity', 'drill', 'exertion', 'working out', 'physical activity'],
            'muscle': ['muscular', 'physique', 'build', 'bulk', 'gains', 'definition', 'tone', 'strength'],
            'weight': ['pounds', 'kilos', 'kg', 'lb', 'mass', 'heavy', 'light', 'scale', 'fat'],
            'cardio': ['aerobic', 'cardiovascular', 'endurance', 'stamina', 'heart rate', 'running', 'jogging'],
            'nutrition': ['diet', 'food', 'eating', 'meal', 'macros', 'calories', 'nutrients', 'eating plan'],
            'protein': ['amino acids', 'whey', 'casein', 'shake', 'powder', 'protein shake', 'protein powder'],
            'medication': ['medicine', 'drug', 'pill', 'prescription', 'tablet', 'supplement', 'pharma', 'meds'],
            'recovery': ['rest', 'healing', 'repair', 'recuperation', 'restoration', 'rehab', 'regeneration'],
            'injury': ['hurt', 'pain', 'strain', 'sprain', 'tear', 'damage', 'trauma', 'wound', 'ache']
        };
        
        // Scan for all potential topics in the question
        for (const [keyword, responses] of Object.entries(trainerResponses)) {
            if (keyword === 'default' || keyword === 'greeting' || keyword === 'bye' || 
                keyword === 'thanks' || keyword === 'how are you' || keyword === 'wassup' || 
                keyword === 'joke' || keyword === 'hinglish') continue;
            
            // Check for keyword presence with word boundary for more accuracy
            const wordBoundaryRegex = new RegExp(`\\b${keyword}\\b`, 'i');
            if (wordBoundaryRegex.test(input)) {
                detectedTopics.push(keyword);
                topicScores[keyword] = 5; // Higher score for exact word matches
            } else if (input.includes(keyword)) {
                detectedTopics.push(keyword);
                topicScores[keyword] = 3; // Medium score for partial matches
            }
            
            // Check for synonyms and related terms
            if (topicSynonyms[keyword]) {
                for (const synonym of topicSynonyms[keyword]) {
                    const synonymRegex = new RegExp(`\\b${synonym}\\b`, 'i');
                    if (synonymRegex.test(input)) {
                        if (!detectedTopics.includes(keyword)) {
                            detectedTopics.push(keyword);
                        }
                        // Add to existing score or initialize
                        topicScores[keyword] = (topicScores[keyword] || 0) + 2;
                        break;
                    } else if (input.includes(synonym)) {
                        if (!detectedTopics.includes(keyword)) {
                            detectedTopics.push(keyword);
                        }
                        // Add to existing score or initialize
                        topicScores[keyword] = (topicScores[keyword] || 0) + 1;
                        break;
                    }
                }
            }
        }
        
        // Special handling for medication-related questions
        const medicationTerms = ['medication', 'medicine', 'drug', 'pill', 'prescription', 'supplement', 'pharma', 'meds'];
        const medicationRegex = new RegExp(medicationTerms.map(term => `\\b${term}\\b`).join('|'), 'i');
        
        if (medicationRegex.test(input)) {
            // Check if it's about specific types of medication
            const painMedRegex = /\b(pain|relief|ache|hurt|ibuprofen|aspirin|tylenol|advil)\b/i;
            const preworkoutRegex = /\b(pre.?workout|before.?workout|energy|boost|caffeine|stimulant)\b/i;
            const recoveryMedRegex = /\b(recovery|healing|bcaa|glutamine|post.?workout|after.?workout)\b/i;
            
            if (painMedRegex.test(input)) {
                if (!detectedTopics.includes('pain medication')) {
                    detectedTopics.push('pain medication');
                    topicScores['pain medication'] = 6;
                }
            }
            
            if (preworkoutRegex.test(input)) {
                if (!detectedTopics.includes('pre workout')) {
                    detectedTopics.push('pre workout');
                    topicScores['pre workout'] = 6;
                }
            }
            
            if (recoveryMedRegex.test(input)) {
                if (!detectedTopics.includes('recovery medication')) {
                    detectedTopics.push('recovery medication');
                    topicScores['recovery medication'] = 6;
                }
            }
            
            // If no specific medication type detected, use general medication
            if (!painMedRegex.test(input) && !preworkoutRegex.test(input) && !recoveryMedRegex.test(input)) {
                if (!detectedTopics.includes('medication')) {
                    detectedTopics.push('medication');
                    topicScores['medication'] = 5;
                }
            }
        }
        
        // If we have multiple topics, create a combined response
        if (detectedTopics.length > 1) {
            // Sort topics by their score
            detectedTopics.sort((a, b) => topicScores[b] - topicScores[a]);
            
            // Limit to top 2-3 most relevant topics to avoid overwhelming responses
            const maxTopics = detectedTopics.length > 2 ? 3 : 2;
            const primaryTopics = detectedTopics.slice(0, maxTopics);
            
            // Create a more natural-sounding combined response
            let combinedResponse = "";
            
            // Different intro phrases for variety
            const introOptions = [
                "Let me address multiple aspects of your question:",
                "Your question touches on several important points:",
                "I can help with the different parts of your question:",
                "Here's information about the topics you asked about:",
                "Great question covering multiple areas! Here's what you should know:"
            ];
            
            combinedResponse = introOptions[Math.floor(Math.random() * introOptions.length)] + "\n\n";
            
            // Add a response from each detected topic
            primaryTopics.forEach((topic, index) => {
                const topicResponses = trainerResponses[topic];
                const randomResponse = topicResponses[Math.floor(Math.random() * topicResponses.length)];
                
                // Different formatting for each topic to make it more readable
                if (primaryTopics.length <= 2) {
                    // For just 2 topics, use a more conversational format
                    if (index === 0) {
                        combinedResponse += `First, regarding ${topic}: ${randomResponse}\n\n`;
                    } else {
                        combinedResponse += `Additionally, about ${topic}: ${randomResponse}`;
                    }
                } else {
                    // For 3 topics, use numbered format
                    combinedResponse += `${index + 1}. Regarding ${topic}: ${randomResponse}\n\n`;
                }
            });
            
            // Update conversation context with multiple topics
            conversationContext.lastTopic = primaryTopics[0]; // Set primary topic as last topic
            conversationContext.askedTopics = [...conversationContext.askedTopics, ...primaryTopics];
            
            return combinedResponse;
        }
        
        return null; // Return null if not a complex question
    }
    
    // Add some initial messages for demonstration
    setTimeout(() => {
        addMessage("Hi there! I'm your personal AI trainer. How can I help you with your fitness journey today?");
    }, 500);
});