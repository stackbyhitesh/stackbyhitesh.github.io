// Finds every image in src/assets/achievements and maps it by file name (without extension).
// Example: prodigy.jpg -> achievementImages.prodigy
const files = import.meta.glob('../assets/achievements/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
});

export const achievementImages = Object.fromEntries(
  Object.entries(files).map(([path, url]) => [
    path.split('/').pop().replace(/\.[^.]+$/, '').toLowerCase(),
    url,
  ])
);
