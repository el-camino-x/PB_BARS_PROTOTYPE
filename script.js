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