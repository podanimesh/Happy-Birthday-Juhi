const cover = document.getElementById('cover');
const bookView = document.getElementById('bookView');
const openBookBtn = document.getElementById('openBookBtn');
const bgMusic = document.getElementById('bgMusic');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageIndicator = document.getElementById('pageIndicator');
const pageTotal = document.getElementById('pageTotal');
const pages = Array.from(document.querySelectorAll('.page'));
const envelope = document.getElementById('envelope');
const letterCard = document.getElementById('letterCard');
const optionalSpreads = Array.from(document.querySelectorAll('.optional-spread'));
const optionalPhotos = Array.from(document.querySelectorAll('.optional-photo img'));

let currentPage = 0;
let visiblePages = pages.slice();

function imageExists(img) {
  return !!img.getAttribute('src');
}

function updateVisiblePages() {
  optionalSpreads.forEach(spread => spread.style.display = '');
  const missing = optionalPhotos.filter(img => !imageExists(img)).length;

  if (missing >= 2) {
    optionalSpreads.forEach(spread => spread.style.display = 'none');
  }

  visiblePages = pages.filter(page => getComputedStyle(page).display !== 'none');
  pageTotal.textContent = String(visiblePages.length);
}

function showPage(newIndex) {
  if (newIndex < 0 || newIndex >= visiblePages.length) return;

  const current = visiblePages[currentPage];
  const next = visiblePages[newIndex];

  if (current === next) return;

  current.classList.remove('page-active');
  current.classList.add('page-leaving');

  setTimeout(() => current.classList.remove('page-leaving'), 700);

  next.classList.add('page-active');

  currentPage = newIndex;
  pageIndicator.textContent = String(currentPage + 1);
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === visiblePages.length - 1;
}

function startMusic() {
  bgMusic.volume = 0.18;
  bgMusic.play().catch(() => {});
}

openBookBtn.addEventListener('click', () => {
  cover.classList.remove('active');
  bookView.classList.add('active');
  startMusic();

  updateVisiblePages();
  visiblePages.forEach((page, idx) => page.classList.toggle('page-active', idx === 0));

  currentPage = 0;
  pageIndicator.textContent = '1';
  prevBtn.disabled = true;
  nextBtn.disabled = visiblePages.length === 1;
});

nextBtn.addEventListener('click', () => showPage(currentPage + 1));
prevBtn.addEventListener('click', () => showPage(currentPage - 1));

document.addEventListener('keydown', (e) => {
  if (!bookView.classList.contains('active')) return;
  if (e.key === 'ArrowRight') showPage(currentPage + 1);
  if (e.key === 'ArrowLeft') showPage(currentPage - 1);
});

function revealLetterLines() {
  const lines = Array.from(document.querySelectorAll('.letter-line'));
  lines.forEach((line, i) =>
    setTimeout(() => line.classList.add('reveal'), 250 + i * 450)
  );
}

function openLetter() {
  envelope.classList.add('open');
  letterCard.classList.add('open');
  revealLetterLines();
}

envelope.addEventListener('click', openLetter);
envelope.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    openLetter();
  }
});

updateVisiblePages();
pageTotal.textContent = String(visiblePages.length);
pageIndicator.textContent = '1';
