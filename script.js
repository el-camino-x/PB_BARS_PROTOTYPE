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

const leagueLogos = {
  "Premier League": "https://i.postimg.cc/4dkJfngy/4c377s1535214890.png",
  "La Liga": "https://i.postimg.cc/6qpFtNy7/La-Liga-logo-red-horizontal-PNG-large-size.png",
  "Serie A": "https://i.postimg.cc/HLmZTCNs/Serie-A.png",
  "Bundesliga": "https://i.postimg.cc/htLsy5GF/bundesliga-logo.png",
  "Ligue 1": "https://i.postimg.cc/q7gLJMGs/Ligue1-logo.png",
  "Primeira Liga": "https://i.postimg.cc/DZt0JFXk/Primeiraliga.webp",
  "Süper Lig": "https://i.postimg.cc/J0d7Wx7Q/Super-Lig-logo-svg.png",
  "Saudi Pro League": "https://i.postimg.cc/K8TGdt69/Roshn-Saudi-League-Logo-svg.png",
  "MLS": "https://i.postimg.cc/QCPDzM0t/MLS-crest-logo-CMYK-gradient-svg.png",
  "UEFA Champions League": "https://i.postimg.cc/HLHgRR40/Logo-UEFA-Champions-League.png",
  "Eredivisie": "https://i.postimg.cc/nhK84T8R/Eredivisie-nuovo-logo.png",
  "NBA": "https://i.postimg.cc/4yHqmQQ3/nba-logo-brandlogos-net-ipeky.png",
  "NFL": "https://i.postimg.cc/BZ1J8T6G/NFL-logo.png",
  "NHL": "https://i.postimg.cc/zDW1DqtR/NHL-Logo.png",
  "UFC": "https://i.postimg.cc/nVq6b0rC/2560px-UFC-Logo-svg.png",
  "National Rugby League": "https://i.postimg.cc/HkF2L1Py/National-Rugby-League-svg.png",
  "Bri LIga 1": "https://i.postimg.cc/Pf61xkCH/logo-liga-1-logo-bri-liga-1-bri-liga-1-1-169.png"
};

fetch(csvUrl)
  .then(response => response.text())
  .then(data => {
    const rows = data.split(/\r?\n/).slice(1); // handle \r\n
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

      // ===== League Title dengan Logo =====
      const leagueTitle = document.createElement('h3');
      leagueTitle.classList.add('league-title');
      const logoUrl = leagueLogos[liga] || '';
      leagueTitle.innerHTML = logoUrl ? `<img src="${logoUrl}" alt="${liga} logo"> ${liga}` : liga;
      leagueSection.appendChild(leagueTitle);

      matchesByLeague[liga].forEach(match => {
        const matchCard = document.createElement('div');
        matchCard.classList.add('match-card', 'has-league-logo'); // tetap ada class ini
        matchCard.dataset.league = liga;

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
