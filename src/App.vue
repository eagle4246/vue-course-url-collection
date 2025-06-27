<script setup>
import { ref, onMounted, computed } from 'vue';

const locale = ref(true);
const addTitle = ref(false);
const newUrl = ref('');
const newTitle = ref('');
const collection = ref([]);
const urlInput = ref(null);
const titleInput = ref(null);

const pageHeading = computed(() => {
  return locale.value ? 'URL Collection Tool' : '收藏網址⼩⼯具';
});
const urlHeading = computed(() => {
  return locale.value ? 'Please Enter URL' : '請輸入網址';
});
const urlPlaceholder = computed(() => {
  return locale.value ? 'Enter URL' : '輸入網址';
});
const addTitleText = computed(() => {
  return locale.value ? 'Add Title' : '新增標題';
});
const optionalText = computed(() => {
  return locale.value ? 'Optional' : '選填';
});
const titleHeading = computed(() => {
  return locale.value ? 'Please Enter Title' : '請輸入標題';
});
const allowTitleHeading = computed(() => {
  return locale.value ? 'Enable "Add Title"' : '啟用“新增標題”';
});
const titlePlaceholder = computed(() => {
  return locale.value ? 'Enter Title' : '輸入標題';
});
const addText = computed(() => {
  return locale.value ? 'Add' : '新增';
});

const clearAllText = computed(() => {
  return locale.value ? 'Clear All' : '清除全部';
});

const collectionTitle = computed(() => {
  return locale.value ? 'URL Collection' : '網址清單';
});

const emptyListText = computed(() => {
  return locale.value ? 'No items in the list' : '網址清清單中沒有項目單';
});

const addButtonPermission = computed(() => {
  if (!addTitle.value && newUrl.value.length !== 0) return false;
  if (
    addTitle.value &&
    newUrl.value.length !== 0 &&
    newTitle.value.length !== 0
  )
    return false;
  return true;
});

const addUrl = () => {
  if (newUrl.value === '') return;
  if (newUrl.value.trim()) {
    const title = extractTitle(newUrl.value);
    const urlObj = {
      url: newUrl.value,
      title: addTitle.value ? newTitle.value : title,
    };
    collection.value.push(urlObj);
    localStorage.setItem('url-collection', JSON.stringify(collection.value));
    newUrl.value = ''; // Clear input
    newTitle.value = ''; // Clear input
    addTitle.value = false;
    if (urlInput.value) {
      urlInput.value.focus();
    }
  }
};

const extractTitle = (url) => {
  try {
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
  } catch (error) {
    console.error('Invalid URL or error parsing:', error);
  }
  return 'Untitled'; // Fallback title
};

const focusTitleInput = () => {
  if (!addTitle.value) {
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
};

const clearCollection = () => {
  collection.value = [];
  localStorage.removeItem('url-collection');
};

const toggleLocale = () => {
  locale.value = !locale.value;
};

onMounted(() => {
  const initialValue = localStorage.getItem('url-collection');
  console.log('entered Vue Project', initialValue);
  if (initialValue != null) {
    collection.value = JSON.parse(initialValue);
  }
});
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm px-5">
    <div class="flex-1">
      <h1 class="text-xl sm:text-3xl font-bold">
        <span>{{ pageHeading }}</span>
      </h1>
    </div>
    <div class="flex-none">
      <button class="btn btn-xs btn-outline py-4" @click="toggleLocale">
        <span class="material-symbols-outlined"> language </span>
        <span v-if="locale"> En</span>
        <span v-if="!locale">Tw</span>
      </button>
    </div>
  </div>

  <div class="flex flex-col gap-5 p-4 mb-3">
    <div>
      <fieldset class="fieldset">
        <legend class="fieldset-legend text-md">{{ urlHeading }}</legend>
        <input
          ref="urlInput"
          type="text"
          class="input"
          :placeholder="urlPlaceholder"
          v-model="newUrl"
          @keyup.enter="focusTitleInput"
        />
        <label class="label mt-3">
          <input
            type="checkbox"
            checked="checked"
            class="checkbox checkbox-xs"
            v-model="addTitle"
          />
          {{ addTitleText }}
        </label>
      </fieldset>
      <fieldset class="fieldset" :disabled="!addTitle">
        <legend v-if="addTitle" class="fieldset-legend">
          {{ titleHeading }}
        </legend>
        <legend v-if="!addTitle" class="fieldset-legend">
          {{ allowTitleHeading }}
        </legend>
        <input
          ref="titleInput"
          type="text"
          class="input"
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
  <div class="p-4 mt-3">
    <h2 class="text-xl font-bold mb-3 underline">{{ collectionTitle }}</h2>
    <transition-group name="slide-fade" tag="ul" class="space-y-2">
      <li
        v-for="(item, index) in collection"
        :key="index"
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
      <p v-if="collection.length === 0" class="text-gray-500 italic">
        {{ emptyListText }}
      </p>
    </transition-group>
  </div>
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
</style>
