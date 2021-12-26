/**
    * @param {string} container - name of the container with .for classname and # for id
    * @param {object} config - keys -> transitionTime, delayTime
    * @param {number} transitionTime - time it takes for the image to slide in seconds
    * @param {number} delayTime - time it takes for the image to automatically start sliding in seconds
*/

class Carousel {
    constructor(containerSelector, config) {

        // store arguments
        this.containerName = containerSelector;
        this.container = document.querySelector(containerSelector);
        this.wrapper = this.container.querySelector('.carousel-image-wrapper');
        this.width = window.getComputedStyle(this.container).getPropertyValue('width');
        this.height = window.getComputedStyle(this.container).getPropertyValue('height');
        this.transitionTime = config.transitionTime;
        this.delayTime = config.delayTime;

        // create attributes needed for processing
        this.index = 0; // stores current index of navigator
        this.images = this.wrapper.getElementsByTagName('img');

        //create attributes needed for new elements
        this.rightButton;
        this.leftButton;
        this.radioGroup;
        this.radio = [];

        // call setup functions
        this.setupContainerLayout();
        this.setupWrapperLayout();
        this.setupNavigationButtons();
        this.setupIndicator();
        this.styleIndicator();

        // setup autoslide
        this.setupAutoSlide();

        window.addEventListener('resize', () => {
            this.width = window.getComputedStyle(this.container).getPropertyValue('width');
            this.height = window.getComputedStyle(this.container).getPropertyValue('height');
            this.setupContainerLayout();
            this.setupWrapperLayout();
            this.setupNavigationButtons();
            this.styleIndicator();
        });
    }

    setupContainerLayout = () => {
        this.container.style.overflow = 'hidden';
        this.container.style.position = 'relative';
    }

    setupWrapperLayout = () => {
        this.wrapper.style.minWidth = '1000vw'; // just needs to be large enough to hold all the images horizontally
        this.wrapper.style.height = this.height;
        this.wrapper.style.position = 'absolute';
        this.wrapper.style.left = '-0px'; // use negative because the left attribute is used to animate the images

        for (let j=0; j<this.images.length; j++) {
            this.images[j].style.width = this.width;
            this.images[j].style.height = this.height;
            this.images[j].style.float = 'left';
        }
    }

    setupNavigationButtons = () => {
        // function that sets same attributes for both buttons. used to reduce code repetition
        const styleButton = (button) => {
            button.style.position = 'absolute';
            button.style.top = parseFloat(this.height)/2 - 32 + 'px'; // calculate on the basis of height
            button.style.backgroundColor = 'rgba(0,0,0,0)'; // set transparency
            button.style.border = 'none';
            button.style.fontSize = '48px';
            button.style.color = 'white';
            button.style.borderRadius = '50%';
            button.style.paddingBottom = '16px'; // hit and trial. works for all viewport sizes on my PC.
            button.addEventListener('mouseover', () => {
                button.style.cursor = 'pointer';
                button.style.backgroundColor = 'rgba(0,0,0,0.5)';
            });
            button.addEventListener('mouseout', () => {
                button.style.cursor = 'none';
                button.style.backgroundColor = 'rgba(0,0,0,0)';
            });
        }

        // right button
        this.rightButton = document.createElement('button');
        this.rightButton.innerHTML = '&rarr;';
        this.rightButton.style.right = 5 + 'px';
        this.rightButton.addEventListener('click', () => this.next());
        styleButton(this.rightButton);
        this.container.appendChild(this.rightButton);

        // left button
        this.leftButton = document.createElement('button');
        this.leftButton.innerHTML = '&larr;';
        this.leftButton.style.left = 5 + 'px';
        this.leftButton.addEventListener('click', () => this.previous());
        styleButton(this.leftButton);
        this.container.appendChild(this.leftButton);
    }

    slide = () => {
        this.wrapper.animate([
            { left: - this.index * parseFloat(this.width) + 'px'}
        ], {
            duration: this.transitionTime*1000,
            iterations: 1,
            fill: 'forwards'
        })
        this.radio[this.index].checked = true;

        //reset autoslide
        clearInterval(this.autoSlideInterval);
        this.setupAutoSlide();
    }

    setupAutoSlide = () => {
        this.autoSlideInterval = setInterval(() => {
            if (this.index < this.images.length - 1)
                this.index++;
            else
                this.index = 0;
            this.slide();
        }, (this.delayTime + this.transitionTime) * 1000);
    }

    styleIndicator = () => {
        this.radioGroup.style.position = 'absolute';
        this.radioGroup.style.left = (parseFloat(this.width)/2) - (this.images.length*15/2) + 'px'; // width/2 - width_of_indicator/2 
        this.radioGroup.style.bottom = '0px';
    }

    setupIndicator = () => {
        this.radioGroup = document.createElement('div');
        this.styleIndicator();

        for (let i=0; i<this.images.length; i++) {
            const newRadio = document.createElement('input');
            newRadio.type = 'radio';
            newRadio.name = 'indicator' + this.containerName;
            newRadio.value = i; // value of each radio button is the index of image
            newRadio.style.margin = '0px 1px';
            newRadio.addEventListener('mouseover', () => newRadio.style.cursor = 'pointer');

            newRadio.addEventListener('click', () => {
                let prev_index = this.index;
                this.index = parseInt(newRadio.value);

                if (prev_index == this.index)
                    return; // if no change in index don't move
                else {
                    this.slide();
                }
            });

            this.radio.push(newRadio);
            this.radioGroup.appendChild(newRadio);
        }
        this.radio[0].checked = true;
        this.container.appendChild(this.radioGroup);
    }

    next = () => {
        if (this.index < this.images.length - 1) {
            this.index++;
            this.slide();
        }
        else {
            this.index = 0;
            this.slide();
        }
    }
    
    previous = () => {
        if (this.index > 0) {
            this.index--;
            this.slide();
        }
        else {
            this.index = this.images.length-1;
            this.slide();
        }
    }
}