<script setup>
import { ref, onMounted, computed } from 'vue';
import FallingStars from './components/FallingStars.vue'
import { formatUrl, extractTitle } from './util/handleUrl.js';

const locale = ref(true);
const addTitleCheck = ref(false);
const newUrl = ref('');
const newTitle = ref('');
const collection = ref([]);
const urlInput = ref(null);
const titleInput = ref(null);
const addToast = ref(false);
const deleteToast = ref(false);
const showToast = ref(true);
const fallingStarsNumber = ref(200);
const fallingSpeed = ref(0.2);

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

const confirmText = computed(() => {
  return locale.value ? '確認' : 'Confirm';
});

const closeText = computed(() => {
  return locale.value ? '關閉' : 'Close';
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

const modalTitleText = computed(() => {
  return locale.value ? '刪除完整的網址清單' : 'Deleting the complete URL Collection';
});

const modalMessageText = computed(() => {
  return locale.value ? '按一下「確認」可從清單中刪除所有項目' : 'Click Confirm to remove all items from the collection';
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

// Updated addUrl function
const addUrl = () => {
  // Ensure newUrl.value is not empty or just whitespace
  if (!newUrl.value || newUrl.value.trim() === '') {
    return; // Do nothing if input is empty
  }

  // Format the URL to make it clickable
  const formattedUrl = formatUrl(newUrl.value);

  // Extract the title, now with the improved TLD check
  const title = extractTitle(formattedUrl);

  const urlObj = {
    id: collection.value.length + 1, // Simple ID for demonstration
    url: formattedUrl, // Store the formatted URL
    title: addTitleCheck.value ? newTitle.value : title, // Use user-provided title if checked, otherwise extracted
  };

  collection.value.push(urlObj);
  localStorage.setItem('url-collection', JSON.stringify(collection.value)); // Persist to local storage

  // Clear inputs and reset state
  newUrl.value = '';
  newTitle.value = '';
  addTitleCheck.value = false;

  showAddToast(); // Assuming this function exists for user feedback

  if (urlInput.value) { // Assuming urlInput is a ref to your URL input field
    urlInput.value.focus();
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
  <FallingStars :numberOfStars="fallingStarsNumber" :speed="fallingSpeed" />
  <div class="navbar shadow-sm p-8">
    <div class="flex-1">
      <h1 class="text-xl sm:text-3xl font-bold">
        <span>{{ pageHeading }}</span>
      </h1>
    </div>
    <div class="flex-none">
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost m-1">
          <span class="material-symbols-outlined">
            settings
          </span>
        </div>
        <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
          <li>
            <span>Number of Stars</span>
            <input 
              type="number" 
              class="input 
              validator" required
              v-model="fallingStarsNumber"
              placeholder="Between 1 to 1000" min="1" max="1000" title="Must be between be 1 to 1000" />
          </li>
          <li>
            <span>Falling Speed</span>
            <input type="range" min="0" max="10" class="range" step="any" v-model="fallingSpeed"/>
          </li>
        </ul>
      </div>
      <label class="swap swap-flip text-sm border-1 rounded-md p-2 hover:bg-base-300">
        <!-- this hidden checkbox controls the state -->
        <input type="checkbox" @click="toggleLocale" v-model="locale" />

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
            <input type="checkbox" checked="checked" class="checkbox checkbox-sm" v-model="addTitleCheck" />
            {{ addTitleText }}
          </label>
        </div>
        <input ref="urlInput" type="text" class="input w-full sm:w-100" :placeholder="urlPlaceholder" v-model="newUrl"
          @keyup.enter="focusTitleInput" />
      </fieldset>
      <fieldset class="fieldset" :disabled="!addTitleCheck">
        <div class="flex items-end gap-5">
          <legend class="fieldset-legend text-lg">
            {{ titleHeading }}
          </legend>
          <transition name="slide-fade">
            <span v-if="!addTitleCheck" class="text-xs py-2 text-rose-300">
              < {{ allowTitleHeading }}>
            </span>
          </transition>
        </div>
        <input ref="titleInput" type="text" class="input w-full sm:w-100" :placeholder="titlePlaceholder"
          v-model="newTitle" @keyup.enter="addUrl" />
        <p class="label">{{ optionalText }}</p>
      </fieldset>
    </div>
    <div class="flex flex-col sm:flex-row gap-3">
      <button class="btn btn-outline btn-lg btn-full sm:btn-wide flex items-center" @click="addUrl"
        :disabled="addButtonPermission">
        <span class="material-symbols-outlined"> add_circle </span>
        {{ addText }}
      </button>
      <button class="btn btn-soft btn-error btn-lg" onclick="my_modal_1.showModal()">
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
      <li v-for="(item, index) in collection" :key="item.id" class="flex gap-3 items-center mb-3">
        <button class="cursor-pointer flex items-center" @click="deleteSingleUrl(index)">
          <span class="material-symbols-outlined hover:text-white transition-colors duration-500 cursor-pointer">
            delete
          </span>
        </button>
        <a :href="item.url" target="_blank" class="hover:text-white transition-colors duration-500">{{ item.title }} |
          {{ item.url }}</a>
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
<dialog id="my_modal_1" class="modal">
  <div class="modal-box">
    <h3 class="text-lg font-bold">{{ modalTitleText }}</h3>
    <p class="py-4">{{ modalMessageText }}</p>
    <div class="modal-action">
      <form method="dialog ">
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn" @click="clearCollection">{{ confirmText }}</button>
        <button class="btn ml-3">{{ closeText }}</button>
      </form>
    </div>
  </div>
</dialog>
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
