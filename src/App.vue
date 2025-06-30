<script setup>
import { ref, onMounted, computed } from 'vue';
import FallingStars from './components/FallingStars.vue'

const locale = ref(true);
const addTitleCheck = ref(false);
const newUrl = ref('');
const newTitle = ref('');
const collection = ref([]);
const urlInput = ref(null);
const titleInput = ref(null);
const addToast = ref(false)
const deleteToast = ref(false)
const showToast = ref(true)

const pageHeading = computed(() => {
  return locale.value ? '收藏網址⼩⼯具' : 'URL Collection Tool';
});
const urlHeading = computed(() => {
  return locale.value ? '請輸入網址' : 'Please Enter URL';
});
const urlPlaceholder = computed(() => {
  return locale.value ? '輸入網址' : 'Enter URL';
});
const addTitleText = computed(() => {
  return locale.value ? '新增標題' : 'Add Title';
});
const optionalText = computed(() => {
  return locale.value ? '選填' : 'Optional';
});
const titleHeading = computed(() => {
  return locale.value ? '請輸入標題' : 'Please Enter Title';
});
const allowTitleHeading = computed(() => {
  return locale.value ? '啟用"新增標題"' : 'Enable "Add Title"';
});
const titlePlaceholder = computed(() => {
  return locale.value ? '輸入標題' : 'Enter Title';
});
const addText = computed(() => {
  return locale.value ? '新增' : 'Add';
});
const clearAllText = computed(() => {
  return locale.value ? '清除全部' : 'Clear All';
});
const collectionTitle = computed(() => {
  return locale.value ? '網址清單' : 'URL Collection';
});
const emptyListText = computed(() => {
  return locale.value ? '網址清單中沒有項目' : 'No items in the list';
});

const addToastText = computed(() => {
  return locale.value ? '已新增網址' : 'New URL Added';
});

const deleteToastText = computed(() => {
  return locale.value ? '網址清單已刪除' : 'URL Collection Deleted';
});

const addButtonPermission = computed(() => {
  if (!addTitleCheck.value && newUrl.value.length !== 0) return false;
  if (
    addTitleCheck.value &&
    newUrl.value.length !== 0 &&
    newTitle.value.length !== 0
  )
    return false;
  return true;
});

// Add this new function for URL formatting
const formatUrl = (url) => {
  if (!url) return '';
  // Remove any whitespace
  url = url.trim();
  // If it already has a protocol, return as is
  if (url.match(/^https?:\/\//i)) {
    return url;
  }
  // If it starts with www., add https://
  if (url.match(/^www\./i)) {
    return `https://${url}`;
  }
  // If it looks like a domain (has a dot and no spaces), add https://www.
  if (url.includes('.') && !url.includes(' ') && !url.includes('/')) {
    return `https://www.${url}`;
  }
  // If it starts with a domain pattern, add https://
  if (url.match(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)) {
    return `https://${url}`;
  }
  // Default: assume it needs https://
  return `https://${url}`;
};

// Updated addUrl function
const addUrl = () => {
  if (newUrl.value === '') return;
  if (newUrl.value.trim()) {
    // Format the URL to make it clickable
    const formattedUrl = formatUrl(newUrl.value);
    const title = extractTitle(formattedUrl);

    const urlObj = {
      id: collection.value.length + 1,
      url: formattedUrl, // Store the formatted URL instead of raw input
      title: addTitleCheck.value ? newTitle.value : title,
    };
    collection.value.push(urlObj);
    localStorage.setItem('url-collection', JSON.stringify(collection.value));
    newUrl.value = ''; // Clear input
    newTitle.value = ''; // Clear input
    addTitleCheck.value = false;
    showAddToast();
    if (urlInput.value) {
      urlInput.value.focus();
    }
  }
};

const showAddToast = () => {
  addToast.value = true;
  showToast.value = true;
  setTimeout(() => {
    addToast.value = false;
    showToast.value = false;
  }, 1500);
}

const showDeleteToast = () => {
  deleteToast.value = true;
  showToast.value = true;
  setTimeout(() => {
    deleteToast.value = false;
    showToast.value = false;
  }, 2500);
}

// Updated extractTitle function to work with formatted URLs
const extractTitle = (url) => {
  try {
    // If it's a formatted URL with protocol, use URL constructor
    if (url.startsWith('http')) {
      const urlObj = new URL(url);
      let hostname = urlObj.hostname;
      hostname = hostname.replace(/^www\./, '');

      // Extract the main domain name
      const match = hostname.match(/^([^.]+)\./);
      if (match && match[1]) {
        let extractedText = match[1];
        return (
          extractedText.charAt(0).toUpperCase() +
          extractedText.slice(1).toLowerCase()
        );
      }
      return hostname;
    } else {
      // Fallback for raw input (though this shouldn't happen after formatting)
    let hostname = url;
    hostname = hostname.replace(/^www\./, '');
    const match = hostname.match(/^([^.]+)\.[a-z]{2,}(?:\.[a-z]{2})?$/i);

    if (match && match[1]) {
      let extractedText = match[1];
      return (
        extractedText.charAt(0).toUpperCase() +
        extractedText.slice(1).toLowerCase()
      );
      }
    }
  } catch (error) {
    console.error('Invalid URL or error parsing:', error);
  }
  return 'Untitled'; // Fallback title
};

const focusTitleInput = () => {
  if (!addTitleCheck.value) {
    addUrl();
    return;
  }
  if (titleInput.value) {
    titleInput.value.focus();
  }
};

const deleteSingleUrl = (index) => {
  if (!collection.value) return;
  collection.value.splice(index, 1);
  localStorage.setItem('url-collection', JSON.stringify(collection.value));
};

const clearCollection = () => {
  collection.value = [];
  localStorage.removeItem('url-collection');
  showDeleteToast();
};

const localeByText = computed(() => {
  return locale.value ? 'tw' : 'en'
})

const toggleLocale = () => {
  locale.value = !locale.value;
  localStorage.setItem('locale', JSON.stringify(localeByText.value));
};

const setLocale = () => {
  const storedLocale = localStorage.getItem('locale');
  if (storedLocale != null) {
    locale.value = JSON.parse(storedLocale) === 'tw'
  }
}

onMounted(() => {
  const initialValue = localStorage.getItem('url-collection');
  setLocale();
  if (initialValue != null) {
    collection.value = JSON.parse(initialValue);
  }
});
</script>

<template>
  <FallingStars :numberOfStars="100" :speed="0.2"/>
  <div class="navbar shadow-sm p-8">
    <div class="flex-1">
      <h1 class="text-xl sm:text-3xl font-bold">
        <span>{{ pageHeading }}</span>
      </h1>
    </div>
    <div class="flex-none">
      <label class="swap swap-flip text-sm border-1 rounded-md p-2 hover:bg-base-300">
          <!-- this hidden checkbox controls the state -->
          <input type="checkbox" @click="toggleLocale" v-model="locale"/>

          <div class="swap-on">中</div>
          <div class="swap-off">En</div>
        </label>
    </div>
  </div>

  <div class="flex flex-col gap-5 p-8 mb-3">
    <div>
      <fieldset class="fieldset flex flex-col">
        <div class="flex justify-between w-full sm:w-100">
          <legend class="fieldset-legend text-lg">{{ urlHeading }}</legend>
          <label class="label flex items-center">
            <input
              type="checkbox"
              checked="checked"
              class="checkbox checkbox-sm"
              v-model="addTitleCheck"
            />
            {{ addTitleText }}
          </label>
        </div>
        <input
          ref="urlInput"
          type="text"
          class="input w-full sm:w-100"
          :placeholder="urlPlaceholder"
          v-model="newUrl"
          @keyup.enter="focusTitleInput"
        />
      </fieldset>
      <fieldset class="fieldset" :disabled="!addTitleCheck">
        <div class="flex items-end gap-5">
          <legend class="fieldset-legend text-lg">
            {{ titleHeading }}
          </legend>
          <transition name="slide-fade">
          <span v-if="!addTitleCheck" class="text-xs py-2 text-rose-300">
            < {{ allowTitleHeading }} >
          </span>
        </transition>
        </div>
        <input
          ref="titleInput"
          type="text"
          class="input w-full sm:w-100"
          :placeholder="titlePlaceholder"
          v-model="newTitle"
          @keyup.enter="addUrl"
        />
        <p class="label">{{ optionalText }}</p>
      </fieldset>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <button
        class="btn btn-outline btn-lg btn-full sm:btn-wide flex items-center"
        @click="addUrl"
        :disabled="addButtonPermission"
      >
        <span class="material-symbols-outlined"> add_circle </span>
        {{ addText }}
      </button>
      <button class="btn btn-soft btn-error btn-lg" @click="clearCollection">
        <span class="material-symbols-outlined"> delete </span>
        {{ clearAllText }}
      </button>
    </div>
  </div>
  <hr />
  <div class="p-8 mt-3">
    <h2 class="text-xl font-bold mb-3 underline italic">{{ collectionTitle }}</h2>
    <span v-if="collection.length === 0" class="text-gray-500 italic">
      {{ emptyListText }}
    </span>
    <transition-group name="slide-fade" tag="ul" class="space-y-2 w-fit">
      <li
        v-for="(item, index) in collection"
        :key="item.id"
        class="flex gap-3 items-center mb-3"
      >
        <button
          class="cursor-pointer flex items-center"
          @click="deleteSingleUrl(index)"
        >
          <span
            class="material-symbols-outlined hover:text-white transition-colors duration-500 cursor-pointer"
          >
            delete
          </span>
        </button>
        <a
          :href="item.url"
          target="_blank"
          class="hover:text-white transition-colors duration-500"
          >{{ item.title }} | {{ item.url }}</a
        >
      </li>
      <!-- Empty state -->
    </transition-group>
    
  </div>
  <transition name="toast">
    <div class="toast toast-center toast-middle" v-if="showToast">
      <div v-if="addToast" class="alert alert-warning bg-base-content">
        <span class="text-lg">{{ addToastText }}</span>
      </div>
      <div v-if="deleteToast" class="alert alert-error">
        <span class="text-lg">{{ deleteToastText }}</span>
      </div>
    </div>
  </transition>
</template>

<style scoped>
/* Animation styles - still need custom CSS for the specific animation */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}

.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(100px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(100px);
}

.slide-fade-move {
  transition: transform 0.3s ease;
}

/* Enter & Leave initial/final states */
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* Enter & Leave transition */
.toast-enter-active,
.toast-leave-active {
  transition: all 1s ease-out;
}

/* Enter final state */
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}

/* Leave starting state */
.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}

</style>
