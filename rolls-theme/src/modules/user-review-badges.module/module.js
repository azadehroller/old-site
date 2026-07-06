const badgeImages = document.querySelectorAll('#js_user_review_badges li img');

if (badgeImages) {
    const badgeImagesElement = (images) => {
        for(const badge of images) {
            if (!badge.hasAttribute('loading') && !badge.hasAttribute('width') && !badge.hasAttribute('height')) {
                const width = badge.width;
                const height = badge.height;

                badge.setAttribute('loading', 'lazy');
                badge.setAttribute('width', width);
                badge.setAttribute('height', height);
            }
        }
    };

    badgeImagesElement(badgeImages);
}