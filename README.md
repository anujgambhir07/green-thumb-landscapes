# Green Thumb Landscapes — Website (Interactive Sample)

A multi-page, animation-rich marketing site for **Green Thumb Landscapes**.
Pure static HTML / CSS / JavaScript — **no backend, no build step** — so it deploys
to GitHub + Vercel in a couple of minutes.

## View it locally

Just open `index.html` in a browser, or run any static server:

```bash
# Python (built in)
python -m http.server 8099
# then open http://localhost:8099

# or Node
npx serve .
```

## Pages

| File | Page |
|------|------|
| `index.html` | Home — hero, services, before/after, project slider, testimonials |
| `services.html` | Services — alternating reveals + process timeline |
| `gallery.html` | Our Work — lightbox gallery + before/after |
| `about.html` | About — story, values, team |
| `contact.html` | Contact — demo form + map |

## Interactive / animated features

- **Preloader** with animated logo
- **Custom cursor** + **magnetic buttons** (desktop)
- **Sticky navbar** that blurs on scroll and hides on scroll-down / shows on scroll-up
- **Scroll-progress bar** + **back-to-top** button
- **Scroll-reveal** system with 8 variants (`up / down / left / right / zoom / blur / rotate / flip`) + clip-text "mask" reveals, all staggered
- **Kinetic hero typography** (words rise in)
- **Parallax** hero & CTA backgrounds
- **Count-up** stat counters
- **3D tilt** cards on hover
- **Before/After** drag slider (mouse + touch)
- **Project carousel** with drag, swipe and arrow controls
- **Auto-rotating testimonials** carousel with dots
- **Lightbox gallery** (click to enlarge, arrow keys, swipe)
- **Marquee** ticker
- Fully **responsive** + honours `prefers-reduced-motion`

All hand-rolled in vanilla JS — no frameworks or libraries to load.

## Deploy to GitHub + Vercel

**1. Push to GitHub** (run in this folder):

```bash
git init
git add .
git commit -m "Green Thumb Landscapes sample site"
git branch -M main
# create an empty repo on github.com first, then:
git remote add origin https://github.com/<your-username>/green-thumb-landscapes.git
git push -u origin main
```

> Tip: with the GitHub CLI you can do it in one line:
> `gh repo create green-thumb-landscapes --public --source=. --push`

**2. Deploy on Vercel:**

- Go to **vercel.com → Add New → Project**
- Import the GitHub repo
- Framework preset: **Other** (it's static — no build command, no output dir needed)
- Click **Deploy**. Done — you get a live `*.vercel.app` URL.

> Or from the terminal: `npm i -g vercel && vercel` (then `vercel --prod`).

## Notes for the client (this is a draft)

- **Photos** are royalty-free placeholders pulled from loremflickr, saved in `/images`.
  Swap in real Green Thumb project photos (same filenames = no code changes).
- **Copy, stats** (120 gardens, 8 years) and **contact details** are placeholders —
  look for `[Your Region]`, `(000) 000-0000`, `hello@greenthumb.example`.
- The **contact form is a demo** — it validates and shows a success message but does
  not send anything. Wire it to email / Formspree / a backend before launch.
- The map is a generic OpenStreetMap embed — point it at the real service area.
