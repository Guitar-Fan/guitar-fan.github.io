/**
 * StoryManager - Handles the introduction story and dialogue sequences
 */
class StoryManager {
    constructor() {
        this.currentStoryIndex = 0;
        this.storyData = [
            {
                text: "Deep within the cosmos, where the laws of physics reign supreme, there exists a mystical artifact of immense power...",
                speaker: "narrator",
                portraits: []
            },
            {
                text: "Greetings, young physicist. I am the Keeper of Physics, guardian of the universal laws that govern all existence.",
                speaker: "keeper",
                portraits: ["keeperPortrait"]
            },
            {
                text: "A terrible crisis has befallen us! Dr. Vector, a brilliant but rogue physicist, has stolen the Reality Bending Artifact!",
                speaker: "keeper",
                portraits: ["keeperPortrait"]
            },
            {
                text: "Muahahaha! With this artifact, I shall rewrite the laws of physics to my own design! The universe will bow to my will!",
                speaker: "vector",
                portraits: ["vectorPortrait"]
            },
            {
                text: "Dr. Vector seeks to use the artifact to create chaos by altering fundamental physics laws. Only someone with a true understanding of physics can stop him.",
                speaker: "keeper",
                portraits: ["keeperPortrait"]
            },
            {
                text: "You have shown great promise in your physics studies. I hereby task you with pursuing Dr. Vector and recovering the artifact!",
                speaker: "keeper",
                portraits: ["keeperPortrait", "protagonistPortrait"]
            },
            {
                text: "You'll never catch me! I've set up physics-based traps throughout this ancient cave system. Only a true master of physics can follow!",
                speaker: "vector",
                portraits: ["vectorPortrait"]
            },
            {
                text: "Your journey begins here, at the entrance to Dr. Vector's hideout. Use your knowledge of physics wisely, and may the laws of nature guide you!",
                speaker: "keeper",
                portraits: ["keeperPortrait", "protagonistPortrait"]
            },
            {
                text: "Dr. Vector has escaped across this wide chasm using a zipline platform. You must calculate the correct force to push the platform and cross safely!",
                speaker: "narrator",
                portraits: ["protagonistPortrait"]
            }
        ];
        
        this.dialogueElement = null;
        this.nextBtn = null;
        this.prevBtn = null;
        this.startPuzzleBtn = null;
        this.skipBtn = null;
        
        this.initialize();
    }
    
    initialize() {
        this.dialogueElement = document.getElementById('dialogueContent');
        this.nextBtn = document.getElementById('nextStoryBtn');
        this.prevBtn = document.getElementById('prevStoryBtn');
        this.startPuzzleBtn = document.getElementById('startPuzzleBtn');
        this.skipBtn = document.getElementById('skipStoryBtn');
        
        // Add event listeners
        this.nextBtn.addEventListener('click', () => this.nextStory());
        this.prevBtn.addEventListener('click', () => this.prevStory());
        this.startPuzzleBtn.addEventListener('click', () => this.startFirstPuzzle());
        this.skipBtn.addEventListener('click', () => this.skipToEnd());
        
        // Start the story
        this.showCurrentStory();
    }
    
    showCurrentStory() {
        const story = this.storyData[this.currentStoryIndex];
        
        // Update dialogue text with typewriter effect
        this.typewriterEffect(story.text);
        
        // Show/hide appropriate character portraits
        this.updatePortraits(story.portraits);
        
        // Update navigation buttons
        this.updateNavigationButtons();
    }
    
    typewriterEffect(text) {
        this.dialogueElement.innerHTML = '';
        let index = 0;
        
        const typeInterval = setInterval(() => {
            if (index < text.length) {
                this.dialogueElement.innerHTML += text.charAt(index);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30); // Adjust speed as needed
    }
    
    updatePortraits(activePortraitIds) {
        // Hide all portraits first
        const allPortraits = ['keeperPortrait', 'vectorPortrait', 'protagonistPortrait'];
        allPortraits.forEach(id => {
            const portrait = document.getElementById(id);
            if (portrait) {
                portrait.style.opacity = '0.3';
            }
        });
        
        // Show active portraits
        activePortraitIds.forEach(id => {
            const portrait = document.getElementById(id);
            if (portrait) {
                portrait.style.opacity = '1';
                // Add a subtle glow effect
                portrait.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    portrait.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }
    
    updateNavigationButtons() {
        // Previous button
        if (this.currentStoryIndex === 0) {
            this.prevBtn.disabled = true;
            this.prevBtn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.prevBtn.disabled = false;
            this.prevBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
        
        // Next/Start button
        if (this.currentStoryIndex === this.storyData.length - 1) {
            this.nextBtn.classList.add('hidden');
            this.startPuzzleBtn.classList.remove('hidden');
        } else {
            this.nextBtn.classList.remove('hidden');
            this.startPuzzleBtn.classList.add('hidden');
        }
    }
    
    nextStory() {
        if (this.currentStoryIndex < this.storyData.length - 1) {
            this.currentStoryIndex++;
            this.showCurrentStory();
        }
    }
    
    prevStory() {
        if (this.currentStoryIndex > 0) {
            this.currentStoryIndex--;
            this.showCurrentStory();
        }
    }
    
    startFirstPuzzle() {
        // Trigger the transition to the first puzzle
        const event = new CustomEvent('startFirstPuzzle');
        document.dispatchEvent(event);
    }
    
    skipToEnd() {
        // Jump to the last story segment
        this.currentStoryIndex = this.storyData.length - 1;
        this.showCurrentStory();
    }
    
    reset() {
        this.currentStoryIndex = 0;
        this.showCurrentStory();
    }
}