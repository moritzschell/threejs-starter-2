# threejs-starter
Dieses Beispiel basiert auf der offiziellen Dokumentation von threejs – „Creating a
Scene“
https://threejs.org/manual/#en/creating-a-scene

**three.js** ist eine JavaScript-Bibliothek, mit der 3D-Grafik direkt im Browser erstellt
werden kann. Sie nutzt WebGL – die Szenen werden auf der Grafikkarte gerendert.  
Für Darstellungen von 3D Objekten benötigen wir 3 Objekte:
Eine **Szene** (*THREE.Scene*), eine **Kamera** (zB *THREE.PerspectiveCamera*) und einen
**Renderer** (*THREE.WebGLRenderer*)

```javascript
// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
75, window.innerWidth / window.innerHeight, 0.1, 1000
);
camera.position.z = 5;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
```


## 01 - Grundbausteine verstehen:
1. *Scene*  
Die Szene ist wie eine „leere Bühne“. Hier werden alle Dinge hinzugefügt, die angezeigt werden sollen – z. B. Objekte, Licht, etc.
2. *Camera*  
Die Kamera ist der Blick auf die Bühne. Sie bestimmt, was aus welchem Winkel und in welcher Entfernung gesehen wird.
3. *Renderer*  
Der Renderer rendert ( = „zeigt“) das Bild.
Er nimmt die Szene und Kamera und „zeichnet“ daraus ein sichtbares Bild auf den Bildschirm.

**Die Werte der Kamera:**  

Das erste Attribut ist das Sichtfeld (Field of View, FOV).
Das Sichtfeld gibt an, wie viel von der Szene man auf dem Bildschirm auf einmal sehen kann. Der Wert wird in Grad angegeben.

Das zweite Attribut ist das Seitenverhältnis (Aspect Ratio).
Du solltest fast immer die Breite durch die Höhe des Bildschirms oder Fensters teilen. Wenn du das nicht machst, passiert das Gleiche wie bei alten Filmen auf einem modernen Fernseher – das Bild wirkt gestaucht oder verzerrt.

Die nächsten beiden Attribute sind die nahe und ferne Clipping-Ebene. Das bedeutet: Objekte, die näher als „near“ oder weiter entfernt als „far“ sind, werden
nicht angezeigt.

**Echtzeit Rendering:**

Zum Schluss fügen wir das Renderer-Element zu unserem HTML-Dokument hinzu. Dabei handelt es sich um ein `<canvas>-Element`, das der Renderer nutzt, um uns die Szene anzuzeigen.

**Geometrie:**  

Für die Einfache Darstellung des Würfels verwenden wir eine Geometrie (*THREE.BoxGeometry*), ein Material (*THREE.MeshBasicMaterial*) und ein Mesh (*THREE.Mesh*).  

Am Ende wird der Würfel der Szene hinzugefügt.

```javascript
// Simple cube
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00aaff });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
```

**Die Animation:**

```javascript
// Animation loop
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
```

- requestAnimationFrame(animate) sagt dem Browser:
„Ruf die Funktion animate beim nächsten Bild wieder auf.“
- Dadurch entsteht eine Endlosschleife, die aber vom Browser gesteuert wird – also
besonders flüssig und leistungsfreundlich.
- Der Browser passt die Animation an die Bildwiederholrate des Bildschirms an (z. B. 60
FPS).

In der Animations-Funktion können wir den Würfel in der Rotation immer wieder ein Stück weiterdrehen. Dadurch entsteht die Rotationsbewegung.

Am Ende wird der Render-Befehl aufgerufen, der das neue Kamerabild der Szene rendert.

.
> Experiment: 
> - Verändere die Richtung der Rotation (Lasse den Würfel in verschiedene Richtungen drehen)
> - Verändere die Rotationsgeschwindigkeit
> - Verändere die Farbe des Würfels

.
  
## 02 - Licht

Wir können der Szene ein Licht hinzufügen, damit die räumliche Darstellung realistischer erscheint, indem zB. Schattierungen entstehen.

**1. Erstelle ein „*Directional Light*“**  

```javascript
// Light
const color = 0xFFFFFF; //Licht Farbe
const intensity = 1; //Licht Itensität
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(0, 0, 10); //Position
light.target.position.set(-5, 0, 0); //Ziel
scene.add(light);
scene.add(light.target);
```

<span style="color:red">**Test: Die Darstellung ändert sich nicht!**</span>

Dies liegt daran, dass wir dem Würfel ein „Basic Material“ zugewiesen haben. Dieses Material reagiert nicht auf Licht. Wir benötigen einen anderen Material-Typ um das Licht auf der Oberfläche des Würfels sichtbar zu machen.

**2. Wir ändern das Material des Würfels in ein „Standard Material“**

```javascript
// const material = new THREE.MeshBasicMaterial({ color: 0x00aaff });
const material = new THREE.MeshStandardMaterial({ color: 0x00aaff });
```

--> Das Licht ist nun auf der Würfeloberfläche sichtbar

**3. Wir können weitere Lichtquellen hinzufügen. zB ein Ambient Light um die generelle
Helligkeit der Szenerie zu erhöhen.**

```javascript
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
```
.

> Experiment: 
> - Verändere die Lichtfarbe
> - Verändere die Lichtintensität
> - Experimentiere mit verschiedenen Kombinationen von Lichtfarbe und Materialfarbe
> - Verändere die Art der Geometrie, zB.:
>   - Sphere (https://threejs.org/docs/#SphereGeometry)
>   - Torus (https://threejs.org/docs/#TorusGeometry)
>   - ...

.

## 03 - Ein 3D Modell laden

Dieses Beispiel basiert auf: https://threejs.org/manual/#en/loading-3d-models

Statt einfachen Geometrien können auch komplexe 3D Modelle geladen werden (zB
Modelle, die in Blender erstellt wurden).

Ein gutes Transfer Format ist hier glTF (GL Transmission Format) — Entweder im .GLB oder im .GLTF File-Format.

In diesem Starter Kit sind schon die entsprechenden Erweiterungen für die Model-Loader hinzugefügt und korrekt verlinkt.
(*lib/examples/loaders/GLTFLoader.js & lib/examples/loaders/utils/BufferGeometryUtils.js*)

**1. Als erstes müssen wir die entsprechende Erweiterung importieren**

```javascript
import { GLTFLoader } from './lib/examples/jsm/loaders/GLTFLoader.js';
```

--> Füge diesen Befehl oben im main.js File an.  
Damit wird die entsprechende Erweiterung importiert

**2. 3D-Model bereitstellen**

Nun benötigen wir ein 3D Model im entsprechenden Format, das geladen werden soll.  
Erstelle einen Ordner ***models*** und lade das 3D-Model als *.glb-Datei* in diesen Ordner.

**3. 3D-Model laden**

Füge den GLTFLoader code hinzu, um das Model zu laden:

```javascript
//Load GLB Model
let model;
const loader = new GLTFLoader();
loader.load(
'./models/flying_robot.glb', // path to your model
function (gltf) {
model = gltf.scene;
//model.scale.set(2, 2, 2);
scene.add(model);
},
undefined,
function (error) {
console.error('An error occurred loading the model:', error);
}
);
```

*Alle Zeilen Code, die den Cube betreffen, können nun gelöscht oder auskommentiert werden… Wir wollen nur noch das Model sehen*

ℹ️ Sollte das Model nicht sichtbar sein, muss evtl die Größe angepasst werden. Nutze dazu die Zeile ```model.scale.set(2, 2, 2);``` um die Skalierung anzupassen (x,y,z skalierung entsprechend des eingestellten Faktors, zB.: 2 --> Verdoppelung der Größe).

.

> Experiment: 
> - Verändere die Skalierung des Objekts
> - Animiere das Objekt, zB Drehung
>   - Achte darauf, dass „null“ korrekt abgefangen wird
> - Verändere Kamera Position und/oder Objekt Position


.


## 04 - Hintergrundfarbe anpassen

Um die Hintergrundfarbe anzupassen, können wir die „clearColor“ des renderers verändern, zB:

```javascript
// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xffaaaa); // light red background
document.body.appendChild(renderer.domElement);
```

