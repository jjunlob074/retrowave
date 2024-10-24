const tl = gsap.timeline({
	repeat: -1,
	repeatDelay: 1,
	onRepeat: () => document.querySelector('#displace > feTurbulence').setAttribute('seed', Math.floor(Math.random()*1000).toString()) // A new horizon after every loop!
});

// Grow the sun and move it upward (from center=100% to center=50%); note that there is a mask covering the bottom half
tl.from('[data-sun]', { attr: { r: '*=0.25', cy: '*=2' }, ease: 'circ.out', duration: 1 });

// Scale in all the lines in the lower 50% horizontally from the center, with a little vertical offset (y) to move them down as if appearing from the SVG's center
tl.from('[data-sun-line]', { attr: { y: '-=6' }, scaleX: 0, transformOrigin: '50% 50%', ease: 'power4.out', duration: 0.6, stagger: 0.1 }, '<+=0.25');

// Animate the anti-line mask (inverse of the sun's mask) to go to a height of zero to stop masking the letter altogether
tl.to('[data-anti-line]', { attr: { height: 0 }, ease: 'power4.out', duration: 1 }, '<+=0.5');

// Move the letter up so it can reveal itself throw the "anti-lines" as if appearing from behind them
tl.from('[data-letter]', { y: '15%', ease: 'power4.out', duration: 1 }, '<');

// This is the midpoint of the animation where the "scene" is waiting before animating itself out
tl.addLabel('midpoint');

// Reveal the glow around the letter
tl.from('[data-glow]', { autoAlpha: 0, ease: 'power3.out', duration: 1 }, '<+=0.5');

// Adds a nice shine across the letter and sun, staggered so they don't animate exactly at the same time, giving it a little bit of depth
tl.fromTo('[data-shine]', { x: '100%' }, {x: '-100%', ease: 'power3.inOut', duration: 1.5, stagger: -0.075 }, '>-=0.6');

// Power on the rockets, staggered and elastic-eased for a playful effect. Houston, we have lift-off!
tl.from('[data-woosh]', { height: 0, ease: 'elastic.out(1, 0.3)', duration: 1, stagger: 0.1 }, '>-=0.5');

// Move the letter up by -100px (size of the SVG "canvas") so it disappears
tl.to('[data-letter]', { y: '-100px', ease: 'power4.in', duration: 1 }, '<+=0.5');

// Ensure the "boosters" stay stuck to the letter (alt idea: place the letter and these in a group that moves as one)
tl.to('[data-woosh]', { y: '-100px', autoAlpha: 0, ease: 'power4.in', duration: 1 }, '<');

// Make the letter glow trail behind a tiny bit
tl.to('[data-glow]', { attr: { y: '+=10' }, ease: 'power4.in', duration: 1 }, '<');

// Move the sun's bottom half mask up a tiny bit to follow the letter's momentum; scaling the lines to extend past their initial area (they touch the circle's edge so they animate in with the right weight based on their width)
tl.to('[data-sun-line]', { attr: { y: '-=6' }, scaleX: 2, transformOrigin: '50% 50%', ease: 'power2.in', duration: 0.8 }, '<+=0.42');

// Move the sun's mask up as well to hide the last visible element on the canvas
tl.to('[data-sun-bottom]', { attr: { y: 0 }, ease: 'power2.in', duration: 0.6 }, '<+=0.3');

// Start the animation when the "scene" is complete if this is not in the context of the CodePen thumbnail preview… gross but it works!
if(!document.body.hasAttribute('onload')) {
	tl.seek('midpoint');
}