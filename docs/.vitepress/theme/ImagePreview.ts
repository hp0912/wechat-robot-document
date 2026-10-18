import { useRoute } from "vitepress";
import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

export default defineComponent({
  name: "ImagePreview",
  setup() {
    const route = useRoute();
    const dialog = ref<HTMLDialogElement>();
    const preview = ref<{ src: string; alt: string }>();
    let restoreScroll: (() => void) | undefined;
    let unbindImages = () => {};

    function resetPreview() {
      if (dialog.value?.open) return;
      preview.value = undefined;
      restoreScroll?.();
      restoreScroll = undefined;
    }

    function closePreview() {
      dialog.value?.close();
      resetPreview();
    }

    async function openPreview(event: Event) {
      const image = event.currentTarget;
      if (!(image instanceof HTMLImageElement) || dialog.value?.open) return;
      if (event instanceof KeyboardEvent && !["Enter", " "].includes(event.key)) {
        return;
      }

      event.preventDefault();
      image.focus({ preventScroll: true });
      preview.value = { src: image.currentSrc || image.src, alt: image.alt };
      await nextTick();
      if (!dialog.value || !preview.value) return;

      const root = document.documentElement;
      const overflow = root.style.overflow;
      restoreScroll = () => {
        root.style.overflow = overflow;
      };
      root.style.overflow = "hidden";
      dialog.value.showModal();
    }

    function bindImages() {
      unbindImages();
      const cleanups: Array<() => void> = [];
      document.querySelectorAll<HTMLImageElement>(".vp-doc img").forEach((image) => {
        if (image.closest("a, button")) return;
        const attributes = [
          "tabindex",
          "role",
          "aria-label",
          "aria-haspopup",
          "data-image-preview",
        ];
        const previous = attributes.map(
          (name) => [name, image.getAttribute(name)] as const,
        );
        image.setAttribute("tabindex", "0");
        image.setAttribute("role", "button");
        image.setAttribute("aria-label", `放大查看：${image.alt || "图片"}`);
        image.setAttribute("aria-haspopup", "dialog");
        image.setAttribute("data-image-preview", "");
        image.addEventListener("click", openPreview);
        image.addEventListener("keydown", openPreview);
        cleanups.push(() => {
          image.removeEventListener("click", openPreview);
          image.removeEventListener("keydown", openPreview);
          previous.forEach(([name, value]) => {
            if (value === null) image.removeAttribute(name);
            else image.setAttribute(name, value);
          });
        });
      });
      unbindImages = () => cleanups.forEach((cleanup) => cleanup());
    }

    onMounted(bindImages);
    watch(
      () => route.path,
      async () => {
        closePreview();
        await nextTick();
        bindImages();
      },
    );
    onBeforeUnmount(() => {
      closePreview();
      unbindImages();
    });

    return () =>
      h(
        "dialog",
        {
          ref: dialog,
          class: "image-preview",
          "aria-label": "图片预览",
          onClose: resetPreview,
          onClick: (event: MouseEvent) => {
            if (event.target === event.currentTarget) closePreview();
          },
        },
        [
          h(
            "button",
            {
              type: "button",
              class: "image-preview-close",
              "aria-label": "关闭图片预览",
              title: "关闭（Esc）",
              autofocus: true,
              onClick: closePreview,
            },
            "×",
          ),
          preview.value ? h("img", { ...preview.value, draggable: false }) : null,
        ],
      );
  },
});
