document.addEventListener("DOMContentLoaded", function() {
  // ===== Slider =====
  const track = document.querySelector('#menu .slider-track');
  const slides = Array.from(document.querySelectorAll('#menu .slider-item'));
  const prevBtn = document.querySelector('#menu .prev');
  const nextBtn = document.querySelector('#menu .next');
  const titleElement = document.getElementById('current-menu-title');

  if (track && slides.length && prevBtn && nextBtn && titleElement) {
    const titles = [
      "Signature Bar Menu",
      "Indonesian Menu",
      "Beer & Cocktails Menu",
      "Drinks Menu",
      "Coffee Menu",
      "Juice & Smoothies Menu"
    ];

    // ===== Clone for looping =====
    let index = 1;
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.id = "first-clone";
    lastClone.id = "last-clone";
    track.appendChild(firstClone);
    track.insertBefore(lastClone, slides[0]);

    const allSlides = document.querySelectorAll('#menu .slider-item');
    let slideWidth = slides[0].clientWidth;
    track.style.transform = `translateX(-${slideWidth * index}px)`;

    // ===== Functions =====
    function moveToSlide() {
      track.style.transition = "transform 0.6s ease";
      track.style.transform = `translateX(-${slideWidth * index}px)`;
    }

    function updateMenuTitle() {
      let realIndex;
      if (allSlides[index].id === "first-clone") realIndex = 0;
      else if (allSlides[index].id === "last-clone") realIndex = titles.length - 1;
      else realIndex = index - 1;
      titleElement.textContent = titles[realIndex];
    }

    // ===== Button Events =====
    nextBtn.addEventListener('click', () => { 
      if(index < allSlides.length - 1) { index++; moveToSlide(); updateMenuTitle(); } 
    });
    prevBtn.addEventListener('click', () => { 
      if(index > 0) { index--; moveToSlide(); updateMenuTitle(); } 
    });

    // ===== Loop Handling =====
    track.addEventListener('transitionend', () => {
      if(allSlides[index].id === "first-clone") { 
        track.style.transition = "none"; 
        index = 1; 
        track.style.transform = `translateX(-${slideWidth * index}px)`; 
      }
      if(allSlides[index].id === "last-clone") { 
        track.style.transition = "none"; 
        index = allSlides.length - 2; 
        track.style.transform = `translateX(-${slideWidth * index}px)`; 
      }
      updateMenuTitle();
    });

    // ===== Resize Handling =====
    window.addEventListener('resize', () => { 
      slideWidth = slides[0].clientWidth; 
      track.style.transition = "none"; 
      track.style.transform = `translateX(-${slideWidth * index}px)`; 
    });

    updateMenuTitle();
  }

  // ===== Smooth Scroll =====
  const menuBtn = document.querySelector('.main-buttons a[href="#menu"]');
  const eventsBtn = document.querySelector('.main-buttons a[href="#events"]');
  const menuSection = document.getElementById('menu');
  const eventsSection = document.getElementById('events');

  function smoothScroll(target) {
    if(target) {
      const headerOffset = 20; // jarak dari atas
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  }

  if(menuBtn) menuBtn.addEventListener('click', e => { 
    e.preventDefault(); 
    smoothScroll(menuSection); 
  });

  if(eventsBtn) eventsBtn.addEventListener('click', e => { 
    e.preventDefault(); 
    smoothScroll(eventsSection); 
  });
});

// ===== Fetch CSV & buat jadwal per liga =====
const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRM7FJDsMeuc5Bd4YtlepevwvC5tOjFK3Otr11m6-r2EWwSCF4FoCwEGhsdnCceLAvgp-ePCtHoqsne/pub?output=csv';

fetch(csvUrl)
  .then(response => response.text())
  .then(data => {
    const rows = data.split('\n').slice(1);
    const matchList = document.querySelector('.match-list');

    const matchesByLeague = {};
    rows.forEach(row => {
      if (!row) return;
      const [tanggal, jam, liga, home, away, logoHome, logoAway] = row.split(',');
      if (!matchesByLeague[liga]) matchesByLeague[liga] = [];
      matchesByLeague[liga].push({ tanggal, jam, home, away, logoHome, logoAway });
    });

    for (const liga in matchesByLeague) {
      const leagueSection = document.createElement('div');
      leagueSection.classList.add('league-section');

      const leagueTitle = document.createElement('h3');
      leagueTitle.textContent = liga;
      leagueTitle.classList.add('league-title');
      leagueSection.appendChild(leagueTitle);

      matchesByLeague[liga].forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card', 'has-league-logo');
        matchCard.dataset.league = liga; // **penting**

        // innerHTML tetap
        matchCard.innerHTML = `
          <div class="match-time">${match.tanggal} | ${match.jam}</div>
          <div class="match-teams">
            <img src="${match.logoHome}" alt="${match.home}" class="team-logo">
            <span class="team-name">${match.home}</span>
            <span>vs</span>
            <span class="team-name">${match.away}</span>
            <img src="${match.logoAway}" alt="${match.away}" class="team-logo">
          </div>
        `;

        leagueSection.appendChild(matchCard);
      });

      matchList.appendChild(leagueSection);
    }
  })
  .catch(err => console.error('Error fetching CSV:', err));


