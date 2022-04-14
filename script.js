'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to')
const section1 = document.querySelector('#section--1')
const tabs = document.querySelectorAll('.operations__tab')
const tabsContainer = document.querySelector('.operations__tab-container')
const tabsContent = document.querySelectorAll('.operations__content')
const nav = document.querySelector('.nav')
const imgTargets = document.querySelectorAll('img[data-src]')
const header = document.querySelector('.header')
const navHeight = nav.getBoundingClientRect().height
const allSections = document.querySelectorAll('.section')
const slides = document.querySelectorAll('.slide')
const btnLeft = document.querySelector('.slider__btn--left')
const btnRight = document.querySelector('.slider__btn--right')
const dotContainer = document.querySelector('.dots')

////////////////////////////////////////
// Modal window
const openModal = function (e) {
    e.preventDefault()
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function () {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal))

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

////////////////////////////////////////
// Button scrolling
btnScrollTo.addEventListener('click', function (event) {
    const s1coords = section1.getBoundingClientRect()
    window.scrollTo({
        left: s1coords.left + window.pageXOffset,
        top: s1coords.top + window.pageYOffset,
        behavior: "smooth"
    })
    // section1.scrollIntoView({behavior: 'smooth'})
})

///////////////////////////////////////////
// Page navigation

// document.querySelectorAll('.nav__link').forEach(el => el
//     .addEventListener('click', function (event) {
//         event.preventDefault()
//         const id = this.getAttribute('href')
//         document.querySelector(id).scrollIntoView({behavior: "smooth"})
//     }))

document.querySelector('.nav__links').addEventListener('click', function (event) {
    event.preventDefault()
    if (event.target.classList.contains('nav__link')) {
        const id = event.target.getAttribute('href')
        document.querySelector(id).scrollIntoView({behavior: "smooth"})
    }
})

/////////////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function (event) {
    event.preventDefault()
    const clicked = event.target.closest('.operations__tab')
    // Guard clause
    if (!clicked) return;

    // Remove active classes
    tabs.forEach(tab => tab.classList.remove('operations__tab--active'))
    tabsContent.forEach(tabC => tabC.classList.remove('operations__content--active'))

    // Active tab
    clicked.classList.add('operations__tab--active')

    // Active content area
    document
        .querySelector(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active')

})

////////////////////////////////////////
// Menu fade animation
const handleHover = function (event, opacity) {
    if (event.target.classList.contains('nav__link')) {
        const link = event.target
        const siblings = link.closest('.nav').querySelectorAll('.nav__link')
        const logo = link.closest('.nav').firstElementChild

        siblings.forEach(el => {
            if (el !== link) el.style.opacity = opacity
        })

        logo.style.opacity = opacity
    }
}

nav.addEventListener('mouseover', (e) => handleHover(e, '0.5'))
nav.addEventListener('mouseout', (e) => handleHover(e, '1'))

/////////////////////////////////////////////
// Sticky navigation

// const initialCoords = section1.getBoundingClientRect().top
// window.addEventListener('scroll', function (event) {
//     console.log(window.scrollY)
//     if (window.scrollY > initialCoords - parseFloat(getComputedStyle(nav).height)) {
//         nav.classList.add('sticky')
//     } else {
//         nav.classList.remove('sticky')
//     }
// })

const stickyNav = function (entries) {
    const [entry] = entries
    if (!entry.isIntersecting) nav.classList.add('sticky')
    else nav.classList.remove('sticky')
}
const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
})
headerObserver.observe(header)

/////////////////////////////////////////////
// Reveal sections
const revealSection = function (entries, observer) {
    const [entry] = entries
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target)
}
const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
})
allSections.forEach(section => {
    sectionObserver.observe(section)
    section.classList.add('section--hidden')
})

/////////////////////////////////////////////
// Lazy loading images
const loadImg = function (entries, observer) {
    const [entry] = entries
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src
    entry.target.addEventListener('load', function () {
        entry.target.classList.remove('lazy-img')
    })
    observer.unobserve(entry.target)
}
const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px'
})
imgTargets.forEach(img => imgObserver.observe(img))

/////////////////////////////////////////////
// Slider

// Functions
const slider = function () {
    const createDots = function () {
        slides.forEach((_, i) => {
            const html = `<button class="dots__dot" data-slide="${i}"></button>`
            dotContainer.insertAdjacentHTML('beforeend', html)
        })
    }

    const activateDots = function (slide = 0) {
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'))
        document.querySelector(`.dots__dot[data-slide = "${slide}"]`).classList.add('dots__dot--active')
    }

    const goToSlide = function (slide) {
        slides.forEach((s, i) => s.style.transform = `translateX(${(i - slide) * 100}%)`)
        activateDots(slide)
    }

    let curSlide = 0
    const maxSlide = slides.length

// previous slide
    const prevSlide = function () {
        if (curSlide === 0) {
            curSlide = maxSlide - 1
        } else {
            curSlide--
        }
        goToSlide(curSlide)
        activateDots(curSlide)
    }

// Next slide
    const nextSlide = function () {
        if (curSlide === maxSlide - 1) {
            curSlide = 0
        } else {
            curSlide++
        }
        goToSlide(curSlide)
        activateDots(curSlide)
    }

    const init = function () {
        createDots()
        goToSlide(0)
    }
    init()

// Event handlers
    btnLeft.addEventListener('click', prevSlide)
    btnRight.addEventListener('click', nextSlide)

    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') {
            nextSlide()
        } else if (e.key === 'ArrowLeft') {
            prevSlide()
        }
    })

    dotContainer.addEventListener('click', function (event) {
        event.preventDefault()
        if (event.target.classList.contains('dots__dot')) {
            goToSlide(event.target.dataset.slide)
        }
    })
}

slider()
