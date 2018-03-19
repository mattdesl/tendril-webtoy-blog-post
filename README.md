![screen](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/screen2.png?token=ABUdgxJHqyTSd5y_jr5ITB8JY1cFd-vyks5auSD9wA%3D%3D)

I recently launched a small and interactive web toy for the Toronto-based design studio, [Tendril](https://tendril.ca/). You can try it out on their home page below. Their site rotates through different web toys, so you may need to reload once or twice to see it.

<center><iframe src="https://player.vimeo.com/video/260787450?autoplay=0&loop=1&color=ffffff&title=0&byline=0&portrait=0" height="512" width="512" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</center>
<p></p>

The experience is simple: brush your mouse across the generative plants to see them blossom and emit musical tones.

This was a really fun project to work on, and I'm very pleased with the outcome. It's great to watch the reactions on [Twitter](https://twitter.com/mattdesl/status/973665760043290624) and [Instagram](https://www.instagram.com/p/BgSBV-1Dc-k/?taken-by=mattdesl_art), including the heartwarming reaction by a [four-year old](https://twitter.com/INNOMEGA/status/973943330659815426) using the experience on a tablet.

In this post, I'll explore how I created the web toy alongside the amazing team at Tendril, and discuss some of the technical challenges faced along the way.

## Concept

For a while now, Tendril has been showcasing different interactive animations on their home page (examples: [1](https://www.instagram.com/p/Bb4kkPyFrnd/?hl=en&taken-by=studiotendril), [2](https://www.instagram.com/p/BeV1pZoFtHa/?taken-by=studiotendril)). They approached me with the idea of developing a new experience that introduces some aspects of generative growth and procedural geometry.

![previous](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/prev.png?token=ABUdg8uZO-Rfpf3hpklcOKx4fn2jzUZGks5auSN0wA%3D%3D)

<sup style="color: hsl(0, 0%, 50%)"><em>— One of Tendril's previous web toys</em></sup>

The brief was very open: develop an interactive and playful toy for Tendril's home page. It should co-exist alongside their other web toys, be modestly designed and simple to use, and load fairly quickly. The interactions should be easy to pick up and the overall experience should align with Tendril and their website.

An open brief with full creative freedom was a welcome challenge for me. In the last couple months, I've been trying to push myself to do more research, brainstorming, art direction, design thinking, and ideation before stepping head-first into development. I've found a pencil and notebook really is the best tool for this, although platforms like Pinterest and Behance can help organize references and find sources of inspiration.

After chatting over a few different ideas, we settled on the broad concept of "interacting with tropical plants".

![mood](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/moodboard.png?token=ABUdg7U9xzcPvmZzetNMeuiDJkDv2oTdks5auSHTwA%3D%3D)

<sup style="color: hsl(0, 0%, 50%)"><em>— Early mood board</em></sup>

My early mood boards leaned toward a monochromatic and stark visual direction. It's great to reflect back on these, as it shows how much a project will change as it interates in development.

<blockquote class="large"><p style="line-height: 22px;font-size: 14px;padding-top: 3px;">💡 On a related note — I wish there was an open source tool for generating flexible masonry-style mood boards from a set of pictures. The UX of InVision Boards is great, but it's a pay-to-use service.</p></blockquote>

## Generative Plants

![2d](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/2d-prototype.png?token=ABUdg_zlk_OPL22eANzhaK4Jc5dH30m6ks5auSRdwA%3D%3D)

<sup style="color: hsl(0, 0%, 50%)"><em>— Early Canvas2D prototype of the procedural plant geometry</em></sup>

Initially, I began prototyping plant structures with Canvas2D and lines. This proved to be a great way to quickly iterate on ideas and geometry, without worrying about complexities added by WebGL and the GPU.

To build the procedural structure of the plants, I decided to use simple line segments and quadratic Bézier curves. A quadratic curve is made up of a start point, control point, and end point, as you can see in the screenshot below.

<center><img src="https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/curve.png?token=ABUdg1nCn0vvn_BTIIViD9G-cNoOncTsks5auSRuwA%3D%3D" width="50%" /></center>

Using simple primitives and parametric functions (like lines and curves) made it much easier to manage things like animations, fast GPU rendering, mouse collisions, and even sound design. For example: you can define *t*, a number between 0 and 1, and use a parametric function to quickly compute the 2D point at that value.

### Structure

I define each plant with a "start" point (i.e. edge of screen) and "end" point (somewhere closer to the center of the screen). Then, a control point is placed somewhere slightly off the center line between the two points, to give the impression of a bending plant stem.

<center><img src="https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/p1.png?token=ABUdg4aT2YpdBU47E1Bqu_QfCR5FMTzDks5auSR6wA%3D%3D" width="50%" /></center>

To extrude each leaf, you walk along the curve at regular intervals, determine the perpendicular normal of the curve at that position, and then scale & rotate the normal by some function so that it "feathers" outward like a leaf might.

<center><img src="https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/p3.png?token=ABUdg24UCcLkZNAHI34Av_OViTObq82Iks5auSSDwA%3D%3D" width="50%" /></center>

I've stripped my code down to a small Canvas2D demo below, and you can view/edit the code [here](https://codesandbox.io/s/3ynwk2573m?hidenavigation=1&module=%2Fsrc%2Fdraw.js). Click the below demo to modify the curve structure.

<iframe src="https://codesandbox.io/embed/3ynwk2573m?hidenavigation=1&module=%2Fsrc%2Fdraw.js&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<p></p>

### Lessons Learned

During this 2D prototyping phase, I made two mistakes that I will now be mindful of next time I prototype:

- *Dimensionality:* It would have been great to translate this experience into three dimensions, allowing for more depth and a greater sense of motion. Most of these algorithms can be translated into 3D, but too much of my code and architecture made assumptions about only two dimensions.
- *Units:* When I initially protoytped in 2D, I used pixels for scaling and placement. This proved challenging when adapting the experience for other resolutions. It would have been better to use relative coordinates throughout the generative code, such as (0, 0) for top left and (1, 1) for bottom right of the screen — like I did in the above CodeSandbox demo.

## Animations & Interactions

Instead of using a complex and potentially CPU-intensive physics system, I decided to use simple springs on the vertices of the plant geometry. This makes them a bit more like Jell-O, but the end result feels a bit more playful.

For each vertex in the plant stem and its leaves, we assign a `target` point (i.e. the position it should spring toward), `position` (i.e. the current computed position), and `velocity` (the speed and direction of movement). The pseudo-code of our basic physics system might look like this:

```js
// 1. Add a mouse force to velocity
if (mouse is close enough to vertex) {
  velocity += mouseVelocity * mouseStrength;
}

// 2. Spring toward target
const delta = target - position;
velocity += delta * spring;
velocity *= friction;
position += velocity;
```

I've included an interactive demo of this vertex springing, which shows how the quadratic curve can bounce and bend in response to mouse movemens. Try the demo below, or see the full code [here](https://codesandbox.io/s/2wv0vp0kor?hidenavigation=1&module=%2Fsrc%2Fdraw.js).

<iframe src="https://codesandbox.io/embed/2wv0vp0kor?hidenavigation=1&module=%2Fsrc%2Fdraw.js&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

<p></p>

One shortcoming of this approach is that it will not detect interactions with the curve itself; it will only detect interactions near the vertices in the curve. To produce more accurate sound interactions, I used a point-line intersection test on the smaller leaves (for the line segment between the stat and end vertices).

## Rendering

Although Canvas2D is great for quick prototypes, it isn't powerful enough to achieve things like per-pixel shading effects on a 2D geometry.

Using ThreeJS and an orthographic camera, it wasn't too difficult to port all of the canvas code into WebGL. To render the plants, each stem is made of a single (re-used) `PlaneGeometry` with a custom vertex shader. The vertex shader positions the plane segments to fit along the curve (or line) defined by the stem or leaf.

You can read more about this technique in a past Observable notebook I wrote, ["2D Quadratic Curves on the GPU"](https://beta.observablehq.com/@mattdesl/2d-quadratic-curves-on-the-gpu). Using this technique on the plant geometry, you end up with a scene like this:

![scene](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/render1.png?token=ABUdgznNb71aaIdv2HXRkPoBhqyZyiIqks5auSSnwA%3D%3D)

The vertex shader includes various parametric functions to sample varying line thickness along the *t* arc length. This ends up changing the silhouette of the geometry to more closely resemble tapered leaves.

![scene](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/render2.png?token=ABUdgx39rzw08RRDVthDTDfVpPDpcZRPks5auSStwA%3D%3D)

Lastly, colour and surface detail is added — each leaf has slight variation in brightness, hue, saturation, vein density and angle, and so forth. All of this is computed in the fragment shader – for example, the veins and center line on each leaf is based on the texture coordinates, using `fwidth()` to compute a smooth anti-aliased 2-3 pixel line.

![scene](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/render3.png?token=ABUdg3vNKcDe-cMcC1yDBBJyD-SXHhNFks5auSS9wA%3D%3D)

I used [dat.gui](https://github.com/dataarts/dat.gui) for visual sliders during development, and shared iterations with [surge.sh](https://surge.sh/). This allowed us to experiment with lots of different ideas and directions. It wasn't until later in development that we introduced animations to and from a thin black "wireframe" state.

![scene](https://raw.githubusercontent.com/mattdesl/tendril-webtoy-blog-post/master/images/render5.png?token=ABUdg089FM-ddO1MMJG8spaYUHO1ay7aks5auSTBwA%3D%3D)

## The Little Details

To bring more life to the project, I spent a *lot* of time on the little details. In fact, the core leaf structure and spring interactions proved to be the easy part; most of my development was spent in polishing the visuals, crafting the motion graphics, and fixing various issues across different browsers.

Here's a few examples:

- Randomness is used in almost all aspects of the experience, producing slight variations in the visuals, motion and sound. For example, randomizing length, curvature, density, timing, hue, thickness, brightness, volume, etc.
- Sounds are throttled (by time and max simultaneous voices) to avoid popping or too much aural clutter.
- The volume of a sound effect is modified based on your mouse velocity, giving bigger movements more dramatic audio outputs.
- Depending on the position of mouse interactions, the sound is panned left or right, giving a sense of spatialization.
- Lots of performance optimizations: the entire scene is just one shader and 3 different geometries (of varying subdivisions). Tons of time spent looking through profilers and optimizing functions until it rendered smoothly across all browsers and devices. Screen pixel density, leaf density, plant organization, and other variables are changed depending on your browser and resolution.

## Browser Pains

I used a lot of my past modules to handle cross-browser differences, such as [touches](https://www.npmjs.com/package/touches) for unified mouse and touch handling, [web-audio-player](https://www.npmjs.com/package/web-audio-player) for iOS compatible WebAudio.

There were a couple other particularly annoying browser issues that came up:

- In FireFox and MS Edge, sometimes `setTimeout` would not be fired in a timely manner if there is a lot of CPU activity going on in JavaScript. I didn't assume it would be accurate, but I wasn't prepared for it to fire 2-3 seconds late. Switching to [timeout-raf](https://www.npmjs.com/package/timeout-raf) fixed this issue.
- You need to polyfill WebAudio [stereo panner node](https://www.npmjs.com/package/stereo-panner-node) for unsupported browsers (i.e. Safari), and even so, some browsers (like mobile iOS Safari) do not do well with panning. I had to disable panning in some cases, tweak audio throttling/timing to reduce pops and clicks, and call `audioContext.resume()` since Safari would sometimes decide to suspend the audio.
- The JIT/JavaScript engine in MS Edge is *really* slow compared to other browsers; I couldn't do much to fix it except lower the plant detail.
- Inside an iFrame in iOS Safari, sometimes you will get an incorrect `window.innerWidth`. To fix, I ended up having to use `position: fixed` with 100% width and height on the `canvas` style.