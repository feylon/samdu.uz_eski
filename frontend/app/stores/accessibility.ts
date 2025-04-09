import { defineStore } from 'pinia';

export type FontScale = 100 | 112 | 125;

interface AccessibilityState {
  fontScale: FontScale;
  grayscale: boolean;
  contrast: boolean;
  hideImages: boolean;
}

const DEFAULT_STATE: AccessibilityState = {
  fontScale: 100,
  grayscale: false,
  contrast: false,
  hideImages: false,
};

export const useAccessibilityStore = defineStore('accessibility', () => {
  const cookie = useCookie<AccessibilityState>('samdu_a11y', {
    default: () => ({ ...DEFAULT_STATE }),
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'lax',
  });

  const state = reactive<AccessibilityState>({ ...DEFAULT_STATE, ...cookie.value });
  const panelOpen = ref(false);

  watch(state, (value) => {
    cookie.value = { ...value };
  });

  const isActive = computed(
    () => state.fontScale !== 100 || state.grayscale || state.contrast || state.hideImages,
  );

  const htmlClasses = computed(() =>
    [
      state.grayscale && 'a11y-grayscale',
      state.contrast && 'a11y-contrast',
      state.hideImages && 'a11y-no-images',
    ].filter(Boolean) as string[],
  );

  function setFontScale(value: FontScale) {
    state.fontScale = value;
  }

  function toggle(key: 'grayscale' | 'contrast' | 'hideImages') {
    state[key] = !state[key];
  }

  function reset() {
    Object.assign(state, DEFAULT_STATE);
  }

  return { state, panelOpen, isActive, htmlClasses, setFontScale, toggle, reset };
});
