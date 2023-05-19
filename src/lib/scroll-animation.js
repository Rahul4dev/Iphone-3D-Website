import { gsap } from 'gsap';

export const scrollAnimation = (position, target, isMobile, onUpdate) => {
  const timeLine = gsap.timeline();

  timeLine
    .to(position, {
      // change of position (we get from webGI position properties customized according to different positions. new camera views)
      x: !isMobile ? -3.38 : -6.0,
      y: !isMobile ? -10.74 : -12.2,
      z: !isMobile ? -5.93 : -5.0,
      // what to do: scroll trigger to start the animation
      scrollTrigger: {
        // from where it start? from .sound-section(element)
        trigger: '.sound-section',
        // when to start the animation
        start: 'top bottom',
        // what will end the animation
        end: 'top top',
        // for smooth transitions (either true or a number)
        scrub: 2,
        // for decrease the rendering speed to ease the gpu
        immediateRender: false,
      },
      onUpdate,
    })
    .to(target, {
      x: !isMobile ? 1.52 : 0.7,
      y: !isMobile ? 0.77 : 1.9,
      z: !isMobile ? -1.08 : 0.7,

      scrollTrigger: {
        trigger: '.sound-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false,
      },
    })
    .to('.jumbotron-section', {
      opacity: 0,
      scrollTrigger: {
        trigger: '.sound-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false,
      },
    })
    .to('.sound-section-content', {
      opacity: 1,
      scrollTrigger: {
        trigger: '.sound-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false,
      },
    })
    .to(position, {
      x: !isMobile ? 1.56 : 9.36,
      y: !isMobile ? 5.0 : 10.95,
      z: !isMobile ? 0.011 : 0.09,
      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false,
      },
      onUpdate,
    })
    .to(target, {
      x: !isMobile ? -0.55 : -1.62,
      y: !isMobile ? 0.32 : 0.02,
      z: !isMobile ? 0.0 : -0.06,

      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false,
      },
    })
    .to('.display-section', {
      opacity: 1,
      scrollTrigger: {
        trigger: '.display-section',
        start: 'top bottom',
        end: 'top top',
        scrub: 2,
        immediateRender: false,
      },
    });
};
