# 🧮 3D‑Druck Kosten Rechner

Ein **offener, transparenter und nicht‑gewinnorientierter 3D‑Druck‑Kostenrechner** für den Hobby‑, Maker‑ und Bildungsbereich.

Dieses Projekt verfolgt **bewusst keinen kommerziellen Ansatz**. Ziel ist es, **reale Unterhalts‑ und Betriebskosten** eines 3D‑Drucks nachvollziehbar darzustellen – **ohne Gewinnaufschläge, ohne Marktpreise und ohne Schönrechnen**.

---

## 🎯 Projektziel

Viele existierende 3D‑Druck‑Rechner:

* mischen Kosten mit Gewinn
* arbeiten mit Pauschalen
* sind intransparent oder überkompliziert

**Dieser Rechner verfolgt einen anderen Ansatz:**

* ✅ Reine Kostendeckung
* ✅ Alle Kostenposten einzeln sichtbar
* ✅ Realistische Default‑Werte
* ✅ Keine versteckten Annahmen
* ✅ Für Menschen verständlich – nicht nur für Tabellen

---

## 👥 Zielgruppe

* Hobby‑ & Heim‑3D‑Druck
* Maker‑Spaces
* Bildung / Schule
* Private Kostenabschätzung

❌ **Nicht** gedacht für:

* industrielle Serienfertigung
* Angebots‑ oder Verkaufspreise
* Gewinnerzielung

---

## ⚙️ Berücksichtigte Kostenpunkte

### 🧱 Materialkosten

* Filamentpreis in **€/kg**
* Tatsächlicher Verbrauch in **Gramm**

**Formel:**

```
(Material in g / 1000) × Filamentpreis €/kg
```

---

### ⚠️ Fehldruck‑Puffer

* Prozentualer Puffer **nur auf Materialkosten**
* Kein Aufschlag auf Strom, Zeit oder Wartung

**Warum?**
Fehldrucke verursachen primär Materialverlust – nicht mehr Druckzeit im Nachhinein.

**Formel:**

```
Materialkosten × (Fehldruck‑Puffer % / 100)
```

---

### ⚡ Stromkosten

* Durchschnittliche Leistungsaufnahme des Druckers
* Kein Rechnen mit Peak‑Werten
* Keine komplexen Energiekurven

**Wichtig:**

> Die angegebene Leistung ist ein **Durchschnittswert über die gesamte Druckzeit** (inkl. Aufheizen).

**Formel:**

```
(Leistung in Watt / 1000) × Druckzeit in Stunden × Strompreis €/kWh
```

---

### 🛠 Verschleißkosten

* Düsen
* Lager
* Riemen
* Mechanischer Abrieb

**Ansatz:**

* Kosten pro **Betriebsstunde (€/h)**
* Keine Maschinenabschreibung

---

### 🧽 Wartung & Pflege

Getrennt vom Verschleiß, z. B.:

* Reinigung
* Schmiermittel
* Alkohol
* Kleinteile

**Formel:**

```
Druckzeit in Stunden × Wartungskosten €/h
```

---

## ⏱ Zeitmodell

* Eingabe in **Stunden + Minuten**
* Automatische Normalisierung
* Interne Berechnung mit **Dezimalstunden**

**Beispiel:**

```
2 h 30 min → 2,5 h
```

Alle zeitabhängigen Kosten (Strom, Verschleiß, Wartung) basieren auf **derselben Zeitbasis**.

---

## 📊 Ergebnisdarstellung

* Einzelkosten transparent aufgeschlüsselt
* Gesamtkosten klar hervorgehoben
* Zusätzliche Anzeige:

```
≈ Kosten pro Stunde (Durchschnitt)
```

👉 Diese Anzeige ist **rein informativ** und kein Abrechnungsmodell.

---

## ℹ️ „Wie wird gerechnet?“

Der Rechner enthält eine einblendbare Erklärung, die:

* alle Formeln offenlegt
* Annahmen erklärt
* bewusst auf Überkomplexität verzichtet

Transparenz ist hier **Feature**, nicht Beigabe.

---

## 🔄 Nutzer‑ & Update‑freundlich

* Speicherung der Eingaben im `localStorage`
* Automatische Migration bei neuen Feldern
* Keine Datenverluste bei Updates
* PWA‑tauglich (Offline‑fähig)

---

## ❌ Bewusst nicht enthalten

Diese Punkte sind **absichtlich nicht Teil** des Projekts:

* ❌ Gewinnaufschläge
* ❌ Markt‑ oder Verkaufspreise
* ❌ Maschinenabschreibung
* ❌ Komplexe Energiekurven
* ❌ KI‑Schätzungen

> Diese Einschränkungen sind **Design‑Entscheidungen**, keine fehlenden Features.

---

## 🧠 Design‑Philosophie

> Lieber **ehrlich und nachvollziehbar** als scheinbar exakt.

Der Rechner soll:

* Vertrauen schaffen
* Diskussionen vermeiden
* realistische Größenordnungen liefern

---

## 🪪 Lizenz

**Open Source – frei & offen**

Dieses Projekt ist als **Open‑Source‑Software** gedacht.

Empfohlene Lizenz:

```
MIT License
```

* freie Nutzung
* freie Weiterentwicklung
* freie Anpassung

---

## 🤝 Mitwirken

Verbesserungen, Ideen und Diskussionen sind willkommen:

* Issues
* Pull Requests
* sachliche Vorschläge

Bitte immer mit Fokus auf:

* Transparenz
* Nachvollziehbarkeit
* Nicht‑Gewinn‑Orientierung

---

## 📌 Hinweis

Dieses Projekt stellt **keine betriebswirtschaftliche Beratung** dar.
Alle Werte sind **Richtwerte**, die vom Nutzer angepasst werden können und sollen.

---

**Projektstatus:** aktiv gepflegt
**Charakter:** offen, sachlich, nicht‑kommerziell
