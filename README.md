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
    <h1>Funky Fader</h1>
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

- Ändere die Rotationsgeschwindigkeit
- Ändere die Rotations-Achsen

---

## 03 – Sections und Scroll-Navigation

In diesem Schritt strukturieren wir die Seite in einzelne Abschnitte (Sections) und fügen Buttons hinzu, die beim Klick animiert zur nächsten Section scrollen. Außerdem mappen wir die Scroll-Rotation auf einen fixen Bereich von 0° bis 360°.

---

### Schritt 1 – Sections in `index.html`

Statt eines einzigen langen `<div>` strukturieren wir den Inhalt jetzt in vier `<section>`-Elemente. Jede Section soll eine Bildschirmhöhe hoch sein. Jeder Button trägt im `data-target`-Attribut die ID der nächsten Section.

```html
<div id="scroll-container">

  <section id="section-0">
    <h1>Funky Fader</h1>
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

### Schritt 2 – Sections und Button in `style.css`

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

### Schritt 3 – Rotation auf 0–360° mappen in `main.js`

Bisher wurde `scrollY` direkt mit einem fixen Faktor multipliziert: Je nach Seitenlänge dreht sich das Objekt unterschiedlich weit.

Jetzt: wir berechnen die **relative** Scrollposition als Wert zwischen 0 und 1 (`progress`) und multiplizieren mit `Math.PI * 2` (= 360°). Damit dreht sich das Objekt genau einmal über die gesamte Seite.

Ersetze den bisherigen `scroll`-EventListener durch diesen:

```javascript
window.addEventListener('scroll', () => {
    const maxScroll = document.body.scrollHeight - window.innerHeight; // gesamter Scroll-Bereich
    if (maxScroll === 0) return; // Seite hat keine Scroll-Höhe → abbrechen
    const progress = window.scrollY / maxScroll; // 0 = oben, 1 = unten
    model.rotation.y = progress * Math.PI * 2;   // 0° → 360°
});
```

> `Math.PI * 2` entspricht einer vollen Umdrehung. `Math.PI` wäre eine halbe (180°).

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
- Füge am Ende einen Button hinzu, der zurück zur ersten Section scrollt.

---

## 04 – Sub-Headlines und Texte

In diesem Schritt füllen wir die drei Content-Sections mit Inhalt: eine Sub-Headline und ein kurzer Absatz. Die Blöcke wechseln sich ab – links, rechts, links – damit der Text abwechslungsreich neben dem 3D-Objekt liegt.

---

### Schritt 1 – Inhalt in `index.html`

Jede Section bekommt einen `<div class="text-block">` mit einer `<h2>` und einem `<p>`. Der Div hält Headline und Text zusammen, damit sie beim Ausrichten als eine Einheit behandelt werden.

Zusätzlich bekommt jede Section eine Ausrichtungs-Klasse: `align-left` oder `align-right`.

```html
<section id="section-1" class="align-left">
  <div class="text-block">
    <h2>Sub-Headline Eins</h2>
    <p>Hier steht ein kurzer Platzhalter-Text. Füge deinen eigenen Inhalt hier ein.</p>
  </div>
  <button class="scroll-btn" data-target="section-2">Next</button>
</section>

<section id="section-2" class="align-right">
  <div class="text-block">
    <h2>Sub-Headline Zwei</h2>
    <p>Hier steht ein kurzer Platzhalter-Text. Füge deinen eigenen Inhalt hier ein.</p>
  </div>
  <button class="scroll-btn" data-target="section-3">Next</button>
</section>

<section id="section-3" class="align-left">
  <div class="text-block">
    <h2>Sub-Headline Drei</h2>
    <p>Hier steht ein kurzer Platzhalter-Text. Füge deinen eigenen Inhalt hier ein.</p>
  </div>
  <button class="scroll-btn" data-target="section-0">Back to start</button>
</section>
```

---

### Schritt 2 – Ausrichtung und Typografie in `style.css`

`h2` und `p` bekommen Farbe, Größe und Schriftart. Der `<p>` bekommt `max-width: 40ch` – das begrenzt die Zeilenlänge auf etwa 40 Zeichen und macht den Text besser lesbar.

```css
h2 {
    color: white;
    font-size: 4vw;
    font-family: sans-serif;
    margin: 0 0 1rem 0;
}

p {
    color: white;
    font-size: 1.2rem;
    font-family: sans-serif;
    max-width: 40ch;
    margin: 0;
    line-height: 1.6;
}
```

Die Klassen `.align-left` und `.align-right` steuern, wo der Inhalt innerhalb der Section landet. `justify-content: flex-start` schiebt alles nach oben, `padding-top` gibt Abstand vom oberen Rand.

```css
.align-left {
    justify-content: flex-start;
    align-items: flex-start;
    padding-top: 15vh;
    padding-left: 8vw;
}

.align-right {
    justify-content: flex-start;
    align-items: flex-end;
    padding-top: 15vh;
    padding-right: 8vw;
}
```

---

### Experiment

- Ersetze die Platzhalter-Texte durch eigene Inhalte
- Ändere `font-size` bei `h2`
- Ändere `max-width` beim `<p>` – was passiert bei `20ch` oder `60ch`?
- Ändere die Anordnung der Inhalte in den Sections – z.B. auf `align-right` / `align-left` / `align-right`

---

## 05 – Keyframe-Animation abspielen

In diesem Schritt laden wir ein GLB-Modell, das eine eingebettete Keyframe-Animation enthält. Ein Button in der letzten Section spielt die Animation einmalig ab.

---

### Schritt 1 – Model Keyframe Animation hinzufügen

1. Öffne Blender und importiere das *Fader.glb* File
2. Im Edit Mode – Selektiere das Objekt und separiere das bewegliche Element vom Gehäuse. 
    - `Mesh > Separate > Selection` 
    - oder Shortcut `P`: Separate by `Selection` oder `By Material`
3. Im Object Mode: Wähle das bewegliche *Fader-Handle* Element und füge eine Keyframe-Animation hinzu.
    - drücke `I` oder `Object > Animation > Insert Keyframe`
    - Im Timeline Fenster bewege den Zeit-Cursor (zB zu Frame 40)
    - Bewege das Objekt (Shortcut `G`) drücke `I` um einen weiteren Keyframe hinzuzufügen. 
    - Wiederhole die Schritte um einen Animations-Loop zu erstellen
4. Exportiere das Objekt als glb mit Animation inkludiert, zB. als *Fader-animation*
5. Füge das neu exportierte Objekt dem *models* Ordner hinzu

---

### Schritt 2 – AnimationMixer einrichten in `main.js`

Es werden 3 Variablen vorbereitet:

Three.js spielt Keyframe-Animationen über einen `AnimationMixer` ab. Wir brauchen außerdem eine `Clock`, die misst, wie viel Zeit zwischen zwei Frames vergangen ist – Der Mixer nutzt diese Zeitdifferenz, um die Animation abzuspielen.

`action` nutzen wir, um später per Button die Animation auslösen zu können.

```javascript
let mixer;   // AnimationMixer — steuert die Keyframe-Animation
let action;  // die vorbereitete Animation, bereit zum Abspielen
const clock = new THREE.Clock(); // misst die Zeit zwischen den Frames
```

Im Loader: lade das neue Model

```javascript
'./models/Fader-animation.glb'
```

Im Loader, nachdem das Modell geladen wurde (direkt nach der Zeile: `scene.add(model);`):

```javascript
mixer = new THREE.AnimationMixer(model);
action = mixer.clipAction(gltf.animations[0]); // erste Animation im GLB
action.setLoop(THREE.LoopOnce, 1);  // nur einmal abspielen
action.clampWhenFinished = true;    // am letzten Frame einfrieren
```

---

### Schritt 3 – Mixer im Animations-Loop aktualisieren

Der Mixer bewegt die Animation nur, wenn er in jedem Frame mit der vergangenen Zeit aktualisiert wird. `clock.getDelta()` gibt die Sekunden seit dem letzten Frame zurück:

```javascript
function animate() {
    requestAnimationFrame(animate);

    if (mixer) {
        mixer.update(clock.getDelta());
    }

    renderer.render(scene, camera);
}
```

---

### Schritt 4 – Play-Button in `index.html` und `main.js`

Füge im `text-block`-Div der letzten Section, direkt unter dem Absatz einen Button hinzu:

```html
<section id="section-3" class="align-left">
  <div class="text-block">
    <h2>Sub-Headline Drei</h2>
    <p>Hier steht ein kurzer Platzhalter-Text.</p>
    <button id="play-btn">Play Animation</button>
  </div>
  <button class="scroll-btn" data-target="section-0">Back to start</button>
</section>
```

In `main.js` hören wir auf den Klick und spielen die Animation ab. `action.reset()` spult dabei immer zurück an den Anfang, damit der Button mehrfach verwendet werden kann:

```javascript
document.getElementById('play-btn').addEventListener('click', function () {
    if (!action) return; // Modell noch nicht geladen
    action.reset();
    action.play();
});
```

---

### Schritt 5 – Button stylen in `style.css`

Der Play-Button sitzt inline im Text-Block und bekommt denselben Look wie die Scroll-Buttons, aber ohne `position: absolute`:

```css
#play-btn {
    margin-top: 1.5rem;
    background: none;
    border: 2px solid white;
    color: white;
    font-size: 1rem;
    padding: 0.5rem 1.2rem;
    cursor: pointer;
    border-radius: 4px;
}
```

---

### Experiment

- Füge eine zweite Rotation um die x-Achse hinzu, sodass der Fader am Ende aufrecht steht und die Animation dadurch besser sichtbar wird
- Ersetze `LoopOnce, 1` durch `LoopRepeat` – was passiert?
- Experimentiere mit deiner eigenen Gestaltung, passe Hintergrundfarbe und Schriftgrößen an
- Lade einen neuen Font-Style (zB über [Google Fonts](https://fonts.google.com))

---

