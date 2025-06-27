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
          height: star.size + 'px',
        }"
      ></div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue';
  
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
  
  const generateRandomStar = () => {
    // Base duration range (e.g., 5-20 seconds for normal speed)
    const minBaseDuration = 5;
    const maxBaseDuration = 20;
  
    // Calculate actual duration inversely proportional to speed
    // Faster speed -> shorter duration
    // Slower speed -> longer duration
    const randomBaseDuration = Math.random() * (maxBaseDuration - minBaseDuration) + minBaseDuration;
    const actualDuration = randomBaseDuration / props.speed;
  
    return {
      id: Math.random().toString(36).substr(2, 9), // Unique ID for key
      left: Math.random() * 100, // Random horizontal position (0-100vw)
      duration: actualDuration,
      // Random delay (negative to start some off-screen for continuous effect)
      delay: Math.random() * -props.numberOfStars, // Scale delay with number of stars
      opacity: Math.random() * (1 - 0.2) + 0.2, // Random opacity (0.2-1)
      size: Math.random() * (3 - 1) + 1, // Random size (1-3px)
    };
  };
  
  // Generate initial stars based on props.numberOfStars
  for (let i = 0; i < props.numberOfStars; i++) {
    stars.value.push(generateRandomStar());
  }
  
  // Optional: If you want to dynamically add/remove stars over time,
  // you could use an interval here. For a fixed background, it's often not needed
  // as CSS animation loops handle it.
  onMounted(() => {
    // No interval needed for a static set of infinitely looping stars.
    // If you later decide to have stars appear/disappear on an interval,
    // uncomment and adapt this:
    /*
    intervalId = setInterval(() => {
      // Example: remove oldest star, add new one
      // stars.value.shift();
      // stars.value.push(generateRandomStar());
    }, 1000); // Adjust interval
    */
  });
  
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
    background-color: white;
    border-radius: 50%;
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