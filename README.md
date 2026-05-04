# threejs-starter-2
Dieses Tutorial ist der zweite Teil des Intros "Custom Models in three.js" und basiert auf der Step-by-step Anleitung (Teil 1 – Kamera, Licht, Model-Loader):
https://github.com/moritzschell/threejs-starter

.
> Reflexion:
> - Öffne das File: _main.js_
> - Was macht der jeweilige Code-Abschnitt?
> - Bespreche die Abschnitte mit deinem Sitznachbarn / deiner Sitznachbarin
> - Versucht gezielt eine Veränderung der Darstellung zu planen und umzusetzen (zB Veränderung der Lichtfarbe, Rotationsgeschwindigkeit, Kameraeinstellungen, ...)

.

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
- Wie könnte die Rotation auf einen maximalen Wert begrenzt werden – damit das Objekt sich nicht endlos dreht?

---

