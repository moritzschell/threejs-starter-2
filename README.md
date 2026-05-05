# threejs-starter-2
Dieses Tutorial ist der zweite Teil des Intros "Custom Models in three.js" und basiert auf der Step-by-step Anleitung (Teil 1 – Kamera, Licht, Model-Loader):
https://github.com/moritzschell/threejs-starter

---
### Reflexion:
- Öffne das File: _main.js_
- Was macht der jeweilige Code-Abschnitt?
- Bespreche die Abschnitte mit deinem Sitznachbarn / deiner Sitznachbarin
- Versucht gezielt eine Veränderung der Darstellung zu planen und umzusetzen (zB Veränderung der Lichtfarbe, Rotationsgeschwindigkeit, Kameraeinstellungen, ...)

---

## 01 – Headline hinter dem 3D-Objekt

In diesem Schritt kombinieren wir zum ersten Mal HTML, CSS und Three.js. Das Ziel: Eine große Überschrift erscheint im Hintergrund, während das 3D-Objekt davor schwebt.

### Wie funktioniert das?

Normalerweise malt Three.js seinen eigenen Hintergrund direkt auf das `<canvas>`-Element. Damit eine HTML-Überschrift dahinter sichtbar sein kann, müssen wir zwei Dinge tun:

1. Den Three.js-Hintergrund **transparent** machen – damit man durch das Canvas hindurchschauen kann.
2. Die Überschrift im HTML **hinter** dem Canvas platzieren – über CSS-Positionierung.

---

### Schritt 1 – Überschrift in `index.html` einfügen

Füge **vor** dem `<script>`-Tag einen neuen `<div>` mit einer `<h1>`-Überschrift ein.
Da das `<script>` den Canvas erzeugt und **danach** im HTML steht, liegt der Canvas automatisch **vor** dem Div:

```html
<body>

  <!-- Überschrift liegt hinter dem 3D-Canvas -->
  <div id="headline-container">
    <h1>Funky Slider</h1>
  </div>

  <!-- Three.js erzeugt hier den Canvas darüber -->
  <script type="module" src="./main.js"></script>

</body>
```

---

### Schritt 2 – Hintergrundfarbe und Layout in `style.css`

Wir geben dem `<body>` eine eigene Hintergrundfarbe. Diese wird sichtbar, weil der Canvas später transparent sein wird.

Dann positionieren wir den `#headline-container` so, dass er den gesamten Bildschirm ausfüllt und die Überschrift exakt in der Mitte liegt. Der Canvas wird mit `position: absolute` darüber gelegt.

```css
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    /* Hintergrundfarbe – sichtbar, weil der Canvas transparent ist */
    background-color: #3131bc;
}

/* Headline-Container füllt den ganzen Bildschirm aus */
#headline-container {
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center; /* horizontal zentriert */
    align-items: center;     /* vertikal zentriert */
}

h1 {
    color: white;
    font-size: 14vw; /* vw = % der Fensterbreite → passt sich der Größe an */
    font-family: sans-serif;
    margin: 0;
}

/* Canvas liegt oben drauf, der Hintergrund scheint durch */
canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

---

### Schritt 3 – Canvas transparent machen in `main.js`

Zwei kleine Änderungen im Renderer: `alpha: true` erlaubt Transparenz. Die Zeile `renderer.setClearColor` entfernen wir – wir wollen nicht, dass der Hintergrund von Three.js gesetzt wird.

```javascript
// alpha: true → Canvas-Hintergrund wird transparent
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
```

---

## 02 – Scroll-basierte Rotation

In diesem Schritt ersetzen wir die automatische Rotation durch eine **Scroll-gesteuerte Rotation**. Das 3D-Objekt dreht sich, während der User scrollt – der Canvas bleibt dabei fixiert im Hintergrund, während der HTML-Inhalt darüber scrollt.

### Wie funktioniert das?

Die Idee: Wir lesen mit `window.scrollY` aus, wie weit der User gescrollt hat – und setzen diesen Wert direkt auf `model.rotation.y`. Je weiter gescrollt wird, desto stärker dreht sich das Objekt.

Damit das funktioniert, braucht die Seite zunächst genug Scroll-Bereich. Und der Canvas muss fixiert bleiben, damit er nicht mitscrollt.

---

### Schritt 1 – Layout in `style.css` anpassen

Drei Änderungen:

1. `overflow: hidden` entfernen → Scrollen wird jetzt erlaubt
2. `#headline-container` bekommt `height: 500vh` → erzeugt einen langen Scroll-Bereich
3. Die `h1` scrollt mit dem Inhalt nach oben – dafür `align-items: flex-start` und ein `margin-top`
4. Der Canvas wird von `position: absolute` auf `position: fixed` geändert → bleibt immer sichtbar

```css
body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    /* overflow: hidden  ← entfernt, damit gescrollt werden kann */

    background-color: #3131bc;
}

/* Scroll-Bereich: 500vh erzeugt genug Platz zum Scrollen */
#headline-container {
    position: absolute;
    width: 100%;
    height: 500vh;
    display: flex;
    justify-content: center;
    align-items: flex-start; /* Headline startet oben... */
}

h1 {
    color: white;
    font-size: 14vw;
    font-family: sans-serif;
    margin: 0;
    margin-top: 28vh; /* ...mit etwas Abstand vom oberen Rand */
}

/* fixed statt absolute → Canvas bleibt beim Scrollen sichtbar */
canvas {
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
```

---

### Schritt 2 – Scroll-Rotation in `main.js`

Die Auto-Rotation (`model.rotation.y += 0.01`) wird entfernt. Stattdessen lauschen wir auf das `scroll`-Event des Fensters und setzen die Rotation direkt:

```javascript
// Scroll-Event: Rotation des Modells an scrollY koppeln
window.addEventListener('scroll', () => {
  if (model != null) {
    model.rotation.y = window.scrollY * 0.005;
  }
});
```

Der Faktor `0.005` bestimmt, wie schnell sich das Objekt pro Scroll-Pixel dreht. Ein größerer Wert = schnellere Rotation, ein kleinerer Wert = langsamere, subtilere Drehung.

---

### Experiment

- Ändere die Rotationsgschwindigkeit
- Ändere die Rotations-Achsen
- Wie könnte die Rotation gemapped werden, zB. auf eine vorgegebene Rotation von 0 – 360 Grad?

---

## 03 – Sections und Scroll-Navigation

In diesem Schritt strukturieren wir die Seite in einzelne Abschnitte (Sections) und fügen Buttons hinzu, die beim Klick animiert zur nächsten Section scrollen. Außerdem mappen wir die Scroll-Rotation auf einen fixen Bereich von 0° bis 360°.

---

### Schritt 1 – Rotation auf 0–360° mappen in `main.js`

Bisher wurde `scrollY` direkt mit einem fixen Faktor multipliziert: Je nach Seitenlänge dreht sich das Objekt unterschiedlich weit.

Jetzt: Wir berechnen die **relative** Scrollposition im Verhältnis zur gesamten Länge des Scrollbereichs – als Wert zwischen 0 und 1 (`progress`). Dann multiplizieren wir mit `Math.PI * 2` (= 360°). Damit dreht sich das Objekt genau einmal, unabhängig von der Länge des Scrollbereichs.

```javascript
window.addEventListener('scroll', () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight; // gesamter Scroll-Bereich
    const progress = window.scrollY / maxScroll; // 0 = oben, 1 = unten
    model.rotation.y = progress * Math.PI * 2;   // 0° → 360°
});
```

> `Math.PI * 2` entspricht einer vollen Umdrehung. `Math.PI` wäre eine halbe (180°).

---

### Schritt 2 – Sections in `index.html`

Statt eines einzigen langen `<div>` strukturieren wir den Inhalt jetzt in vier `<section>`-Elemente. Jede Section soll eine Bildschirmhöhe hoch sein. Jeder Button trägt im `data-target`-Attribut die ID der nächsten Section.

```html
<div id="scroll-container">

  <section id="section-0">
    <h1>Funky Slider</h1>
    <button class="scroll-btn" data-target="section-1">Next</button>
  </section>

  <section id="section-1">
    <button class="scroll-btn" data-target="section-2">Next</button>
  </section>

  <section id="section-2">
    <button class="scroll-btn" data-target="section-3">Next</button>
  </section>

  <section id="section-3">
  </section>

</div>
```

Das `data-target`-Attribut ist ein eigenes Daten-Attribut, an dem wir uns selbst Informationen speichern können. In JavaScript lesen wir es mit `button.dataset.target` aus. (Siehe: https://developer.mozilla.org/en-US/docs/Web/HTML/How_to/Use_data_attributes)

---

### Schritt 3 – Sections und Button in `style.css`

Jede Section bekommt `height: 100vh` – damit ist sie genau so hoch wie der Bildschirm. `box-sizing: border-box` stellt sicher, dass Innenabstand (`padding`) nicht zur Höhe addiert wird.

Der Button wird mit `position: absolute` und `bottom: 2rem` an den unteren Rand der Section gepinnt. 

**Da die Canvas über allem liegt, braucht sie** `pointer-events: none` **– ansonsten werden alle Klicks abgefangen.**

```css
/* Jede Section füllt genau einen Bildschirm */
section {
    box-sizing: border-box;
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
}

/* Section 0: Headline startet oben statt in der Mitte */
#section-0 {
    justify-content: flex-start;
    padding-top: 28vh;
}

/* Button am unteren Rand der Section */
.scroll-btn {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    background: none;
    border: 2px solid white;
    color: white;
    font-size: 1.5rem;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    border-radius: 4px;
}

/* Füge 'pointer-events: none' hinzu, damit Klicks durchgelassen werden */
canvas {
    pointer-events: none;
}
```

---

### Schritt 4 – Scroll-Animation in `main.js`

Wenn ein Button geklickt wird, soll die Seite animiert zur nächsten Section scrollen. Wir schreiben dafür eine eigene Funktion `scrollTo()`.

Die Idee: Wir merken uns die Startposition und die Zielposition. Dann aktualisieren wir die Scroll-Position in jedem Frame, bis wir angekommen sind. `SCROLL_DURATION` bestimmt wie lange die Animation dauert.

```javascript
// Dauer der Scroll-Animation in Millisekunden
// → größerer Wert = langsamer, kleinerer Wert = schneller
const SCROLL_DURATION = 600;

function scrollTo(targetPosition) {
    const startPosition = window.scrollY;                    // aktuelle Position
    const distance = targetPosition - startPosition;         // wie weit wir scrollen müssen
    const startTime = performance.now();                     // Startzeitpunkt

    function step(currentTime) {
        const elapsed = currentTime - startTime;             // vergangene Zeit
        const progress = Math.min(elapsed / SCROLL_DURATION, 1); // 0 → 1

        window.scrollTo(0, startPosition + distance * progress);

        if (progress < 1) {
            requestAnimationFrame(step); // nächsten Frame anfordern
        }
    }

    requestAnimationFrame(step);
}

// Alle Buttons finden und Click-Listener hinzufügen
const scrollButtons = document.querySelectorAll('.scroll-btn');

scrollButtons.forEach(function(button) {
    button.addEventListener('click', function() {
        const targetId = button.dataset.target;              // zB. "section-2"
        const targetSection = document.getElementById(targetId);
        const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY;

        scrollTo(targetPosition);
    });
});
```

> `getBoundingClientRect().top` gibt die Position relativ zum sichtbaren Fenster zurück. Mit `+ window.scrollY` rechnen wir sie in eine absolute Seitenposition um.

---

### Experiment

- Ändere die Scrollgeschwindigkeit
- Experimentiere mit der maximalen Scroll-Rotation (1/2 Umdrehung, 2 Umdrehungen, etc) 
- Füge einen Button hinzu, der zurück zur ersten Section scrollt.

---

