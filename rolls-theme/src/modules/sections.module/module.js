(function () {
    // Variables
    const accordionHeadersElem = document.querySelectorAll('.faq__heading');
    const featuresTableStickyElem = document.querySelector('#js-pricing-trigger');
    const featuresTableStickyTriggerElem = document.querySelector('#js-sticky-table-header');
    const slider = $('#js-feature-cards');
    const featuredTableTriggerElem = document.querySelector('#js-pricing-trigger');
    const featuredTableBackToTopElem = document.querySelector('.pricing__features--backToTop');
    const featuredTableBackToTopElemTrigger = document.querySelector('#js-pricing-back-to-top');

    // Functions

    // Function for executing code on document ready
    function domReady(callback) {
        if (['interactive', 'complete'].indexOf(document.readyState) >= 0) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    }

    function offset(elt) {
        var rect = elt.getBoundingClientRect(), bodyElt = document.body;
        return {
            top: rect.top + bodyElt.scrollTop,
            left: rect.left + bodyElt.scrollLeft
        }
    }

    // Reset the scroll
    function Init() {
        window.onbeforeunload = function () {
            window.scrollTo(0, 0);
        }
    }

    function stickyFeaturesTableHeader() {
        const stickyStopper = document.querySelector('#js-sticky-header-stopper');
        const top = offset(featuresTableStickyElem).top;
        
        window.addEventListener('scroll', function() {
            let y = document.scrollingElement.scrollTop;

            if(y > top) {
                if (y < stickyStopper.offsetTop - 200) {
                    featuresTableStickyTriggerElem.classList.add('fixed');
                    featuredTableBackToTopElem.classList.add('show');
                } else {
                    featuresTableStickyTriggerElem.classList.remove('fixed');
                    featuredTableBackToTopElem.classList.remove('show');
                }
            } else {
                featuresTableStickyTriggerElem.classList.remove('fixed');
                featuredTableBackToTopElem.classList.remove('show');
            }
        }, { capture: false, passive: true})
    }

    function featureColumnsSlider($dots, $arrows, $breakpoint) {
        var settings = {
            mobileFirst: true,
            dots: $dots,
            arrows: $arrows,
            responsive: [
                {
                    breakpoint: $breakpoint,
                    settings: "unslick"
                }
            ]
        }

        slider.slick(settings);

        $(window).on("resize", function () {
            if ($(window).width() > $breakpoint) {
                return;
            }
            if (!slider.hasClass("slick-initialized")) {
                return slider.slick(settings);
            }
        });
    }

    function toggleFaqs() {
        Array.prototype.forEach.call(accordionHeadersElem, accordionHeader => {
        let target = accordionHeader.nextElementSibling;
            accordionHeader.onclick = () => {
                let expanded = accordionHeader.getAttribute('aria-expanded') === 'true' || false;
                accordionHeader.setAttribute('aria-expanded', !expanded);
                target.classList.toggle("-visible");
                accordionHeader.classList.toggle("-open");
                target.hidden = expanded;
            }
        })
    }

    function toggleFeaturedTableTrigger() {
        const featuredTable = document.querySelector('.pricing__features');
        const featuredTableSticky = document.querySelector('#js-sticky-table-header');

        featuredTableTriggerElem.onclick = (e) => {
            e.preventDefault();
            featuredTableTriggerElem.classList.toggle("-expanded");

            if (!featuredTable.classList.contains('-open')) {
                
                document.getElementById('js-pricing-trigger').innerHTML = 'Hide plan features';

                featuredTable.classList.add('-open');
                featuredTable.style.height = 'auto';
                featuredTableSticky.style.width = 'auto';

                const height = (featuredTable.clientHeight + 94) + 'px';
                const width = featuredTableSticky.clientWidth + 'px';

                featuredTable.style.height = '0px';
                featuredTableSticky.style.width = '0px';

                setTimeout(function () {
                    featuredTable.style.height = height;
                    featuredTableSticky.style.width = width;
                }, 0);
            
            } else {            
                document.getElementById('js-pricing-trigger').innerHTML = 'Compare plan features';

                featuredTable.style.height = '0px';
                featuredTableSticky.style.width = 'auto';
                featuredTable.addEventListener('transitionend', function () {
                    featuredTable.classList.remove('-open');
                }, {
                    once: true
                });
            
            }

        }
    }

    function backToTopBtnFeaturedTable(){ 

        const scrollIntoViewWithOffset = (selector, offset) => {
            const targetElem = selector.getBoundingClientRect();
            const targetBody = document.body.getBoundingClientRect();
            let offsetElemTop = targetElem.top - targetBody.top - offset
            window.scrollTo({
                behavior: 'smooth',
                top: offsetElemTop,
            })
        }

        scrollIntoViewWithOffset(featuredTableTriggerElem, 100);
    }

    // Execute JavaScript on document ready
    domReady(function () {
        if (!document.body) {
            return;
        } else {
            // Function to start the SlickSlider
            if (slider) {
                featureColumnsSlider(true, false, 767);
            }
            // Function to start the accordion items
            if (accordionHeadersElem) {
                toggleFaqs();
            }
            if(featuresTableStickyTriggerElem) {
                Init();
                stickyFeaturesTableHeader();
            }

            if(toggleFeaturedTableTrigger) {
                toggleFeaturedTableTrigger();
            }
            // Function to scroll back to the Compare Plan Features BTN
            if(featuredTableBackToTopElemTrigger) {
                featuredTableBackToTopElemTrigger.addEventListener("click", e => {
                    e.preventDefault();
                    backToTopBtnFeaturedTable();
                });
            }

        }
    });

})();