<template>
    <div class="stars-container">
      <div
        v-for="star in stars"
        :key="star.id"
        class="star"
        :style="{
          left: star.left + 'vw',
          animationDuration: star.duration + 's',
          animationDelay: star.delay + 's',
          opacity: star.opacity,
          width: star.size + 'px',
          // Conditional height for streak effect
          height: star.isStreaking ? (star.size * 8) + 'px' : star.size + 'px',
          // Conditional border-radius for streak effect (this shape works well for bottom-heavy streak)
          borderRadius: star.isStreaking ? '50% 50% 50% 50% / 10% 10% 90% 90%' : '50%',
          // Conditional background for streak effect (gradient from transparent top to solid bottom)
          background: star.isStreaking ? 'linear-gradient(to top, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)' : 'white',
        }"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  
  // Define props with default values and type validation
  const props = defineProps({
    numberOfStars: {
      type: Number,
      default: 100, // Default number of stars
    },
    speed: {
      type: Number,
      default: 1, // Default speed (1 = normal, higher = faster, lower = slower)
      validator: (value) => value > 0, // Ensure speed is a positive number
    },
  });
  
  const stars = ref([]);
  let intervalId = null; 
  
  // Define the speed threshold for stars to become streaks
  const STREAK_SPEED_THRESHOLD = 5; // You can adjust this value
  
  const generateRandomStar = () => {
    // Base duration range (e.g., 5-20 seconds for normal speed)
    const minBaseDuration = 5;
    const maxBaseDuration = 20;
  
    // Calculate actual duration inversely proportional to speed
    // Faster speed -> shorter duration
    // Slower speed -> longer duration
    const randomBaseDuration = Math.random() * (maxBaseDuration - minBaseDuration) + minBaseDuration;
    const actualDuration = randomBaseDuration / props.speed;
  
    // Determine if this star should be a streak based on the current speed prop
    const isStreaking = props.speed >= STREAK_SPEED_THRESHOLD;
  
    return {
      id: Math.random().toString(36).substr(2, 9), // Unique ID for key
      left: Math.random() * 100, // Random horizontal position (0-100vw)
      duration: actualDuration,
      // Random delay (negative to start some off-screen for continuous effect)
      delay: Math.random() * -props.numberOfStars, // Scale delay with number of stars
      opacity: Math.random() * (1 - 0.2) + 0.2, // Random opacity (0.2-1)
      // Adjust base size if it's a streak (make it slightly wider for better visibility)
      size: Math.random() * (isStreaking ? (5 - 3) + 3 : (3 - 1) + 1), // Base width: 3-5px for streak, 1-3px for normal
      isStreaking: isStreaking, // Add this boolean property to each star object
    };
  };
  
  // Function to generate all stars based on current props
  const generateStars = () => {
    stars.value = []; // Clear existing stars
    for (let i = 0; i < props.numberOfStars; i++) {
      stars.value.push(generateRandomStar());
    }
  };
  
  // Generate initial stars when the component is first mounted
  onMounted(() => {
    generateStars(); // Call to generate stars on initial mount
  });
  
  // Watch for changes in numberOfStars or speed props
  watch(
    [() => props.numberOfStars, () => props.speed], // Array of reactive sources to watch
    () => {
      // This callback runs whenever numberOfStars or speed changes
      generateStars(); // Re-generate all stars with new prop values
    },
    { deep: false, immediate: false } // 'deep: false' for primitive props, 'immediate: false' to not run on mount (as onMounted handles initial)
  );
  
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId);
    }
  });
  </script>
  
  <style scoped>
  .stars-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
    overflow: hidden;
    z-index: -1;
  }
  
  .star {
    position: absolute;
    /* background-color is now set conditionally inline */
    /* border-radius is now set conditionally inline */
    top: -10px; /* Start slightly above the screen */
  
    /* Apply the animation */
    animation-name: fallAndFade;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    /* animationDuration and animationDelay are set inline via Vue styles */
  }
  
  @keyframes fallAndFade {
    0% {
      transform: translateY(0vh);
      opacity: 0; /* Start invisible */
    }
    10% {
      opacity: var(--star-opacity, 1); /* Fallback to 1 if var not set */
    }
    90% {
      opacity: var(--star-opacity, 1);
    }
    100% {
      transform: translateY(110vh); /* Fall 110vh to go off-screen */
      opacity: 0; /* Fade out at the end */
    }
  }
  </style>
