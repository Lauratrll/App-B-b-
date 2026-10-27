/*
 * reflexo-anim.js — Moteur d'animation « Réflexologie plantaire » (autonome, vanilla JS)
 * -----------------------------------------------------------------------------------------
 * Reproduit les mouvements VALIDÉS (voir mouvement-*.html, PARAMS_animation.json, RAILS_zones.json).
 * Le code de l'app n'a PAS à réimplémenter la mécanique : il charge ce moteur et demande un geste.
 *
 * Dépendances : aucune. Fonctionne sur un <svg> inliné (les id de zones doivent être dans le DOM).
 *
 * Utilisation :
 *   const player = ReflexoAnim.create(svgElement, { params, rails, catalog });
 *   await player.playZone('colonne-vertebrale');        // joue le geste (2 pieds) puis résout
 *   await player.playStep({ zones:['colonne-vertebrale','colonne-vertebrale-contour'] }); // enchaîné
 *   await player.playProtocol(protocoleJson);           // enchaîne toutes les étapes
 *   player.stop();
 *
 *   - `catalog`  = zones-mouvements.json (tableau `zones`)
 *   - `rails`    = RAILS_zones.json
 *   - `params`   = PARAMS_animation.json (facultatif : des valeurs par défaut sont incluses)
 *
 * Règles transversales appliquées (comme les prototypes) :
 *   - couleur = celle du SVG ; l'info passe par l'OPACITÉ (repos .30 / traînée .75 / terminé .90)
 *   - le coloriage RESTE au passage (surligneur) ; pas de « ver qui avance »
 *   - clip sur la forme de la zone ; brosse large pour couvrir toute la zone
 *   - requestAnimationFrame ; getTotalLength calculé une fois
 */
(function (root) {
  'use strict';
  var NS = 'http://www.w3.org/2000/svg';

  // ---- valeurs par défaut (extraites des prototypes ; PARAMS_animation.json les surcharge) ----
  var DEF = {
    OP_REPOS: 0.30, OP_TRAINEE: 0.75, OP_FIN: 0.90,
    maintenue: { T_POSE: 1000, T_MAINTIEN: 3000, T_RETRAIT: 900, N_ONDES: 3, ONDE_ECART: 1000, ONDE_DUREE: 1000, ONDE_EXP: 1.50, ONDE_OP: 0.38, CYCLES_SIMPLE: 3, CYCLES_MULTI: 2, T_INTER: 1000 },
    glissee: { VITESSE_PX: 0.105, T_EFFACE: 550, SEUIL_FIN: 0.82, DOIGT: 1.15, PASSAGES: 3, LARGEUR: 30 },
    circulaire: { TOURS: 3, LARGEUR: 1.30, R0: 0.12, R1: 0.38, T_MVT: 6300, T_PAUSE: 620 },
    boucles: { T_EFFACE: 550, SEUIL_FIN: 0.85, PASSAGES: 3, VITESSE_PX: 0.09, LARGEUR: 34 },
    spirale: { PASSAGES: 3, VITESSE_PX: 0.09, LARGEUR: 26, TOURS: 2.6 },
    urinaire: { T_MAINTIEN: 3000, T_GLIDE: 2900, PASSAGES: 3 }
  };

  function el(name, attrs) { var e = document.createElementNS(NS, name); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }
  function lerp(a, b, u) { return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u]; }
  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }
  function cum(P) { var c = [0]; for (var i = 1; i < P.length; i++) c.push(c[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1])); return c; }
  function ptAt(P, c, s) { var i = 1; while (i < c.length && c[i] < s) i++; i = Math.min(i, c.length - 1); var seg = (s - c[i - 1]) / ((c[i] - c[i - 1]) || 1); return lerp(P[i - 1], P[i], seg); }
  function pathD(P) { return 'M' + P.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' L'); }

  function create(svg, opts) {
    opts = opts || {};
    var params = mergeParams(DEF, opts.params);
    var rails = (opts.rails && opts.rails.zones) || opts.rails || {};
    var catalog = {}; (opts.catalog || []).forEach(function (z) { catalog[z.id] = z; });

    // couche d'overlay dans le SVG (au-dessus des zones)
    var ov = el('g', { 'data-reflexo': 'overlay' }); svg.appendChild(ov);
    var defs = svg.querySelector('defs') || svg.insertBefore(el('defs'), svg.firstChild);
    var running = null, stopped = false, clipCount = 0;

    function grp(id) { return svg.getElementById(id); }
    function fillOf(id) { var g = grp(id); if (!g) return '#8A9E98'; var c = g.querySelector('[fill^="#"]'); return c ? c.getAttribute('fill') : '#8A9E98'; }
    function setZoneOpacity(id, op) { var g = grp(id); if (g) g.style.opacity = op; }
    function bbox(id) { var g = grp(id); if (!g) return null; var b = g.getBBox(); return b; }
    function clipForZone(id) {
      var g = grp(id); if (!g) return null;
      var cid = 'rfx-clip-' + (++clipCount);
      var cp = el('clipPath', { id: cid });
      // cloner les paths/circles de la zone comme masque
      Array.prototype.forEach.call(g.children, function (ch) { cp.appendChild(ch.cloneNode(true)); });
      defs.appendChild(cp); return 'url(#' + cid + ')';
    }
    function railFor(baseId, side) { var r = rails[baseId]; return r ? r[side] : null; }
    function cibles(zone) { return (zone.cibles || []).slice(); }
    function sideOf(id) { return /-d$/.test(id) ? 'd' : (/-g$/.test(id) ? 'g' : ''); }
    function raf() { return new Promise(function (res) { requestAnimationFrame(res); }); }
    function wait(ms) { return new Promise(function (res) { setTimeout(res, ms); }); }

    // ---------- MOUVEMENT : pression maintenue (points) ----------
    async function maintenue(zone) {
      var P = params.maintenue, groups = cibles(zone).map(grp).filter(Boolean);
      // récupérer tous les points (circle) et leur ordre par groupe
      var pts = [];
      groups.forEach(function (g) { Array.prototype.forEach.call(g.querySelectorAll('circle'), function (c) { pts.push({ cx: +c.getAttribute('cx'), cy: +c.getAttribute('cy'), r: +c.getAttribute('r') || 19, fill: c.getAttribute('fill') || '#8A9E98', g: g }); }); });
      groups.forEach(function (g) { g.style.opacity = params.OP_REPOS; });
      var cycles = pts.length > 2 ? P.CYCLES_MULTI : P.CYCLES_SIMPLE;
      for (var c = 0; c < cycles && !stopped; c++) {
        for (var pi = 0; pi < pts.length && !stopped; pi++) {
          await beatMaintenue(pts[pi], P);
        }
      }
      groups.forEach(function (g) { g.style.opacity = params.OP_FIN; });
    }
    async function beatMaintenue(pt, P) {
      var layer = el('g'); ov.appendChild(layer);
      var appui = el('circle', { cx: pt.cx, cy: pt.cy, r: 0, fill: pt.fill, opacity: 0.92 }); layer.appendChild(appui);
      var t0 = performance.now(), total = P.T_POSE + P.T_MAINTIEN + P.T_RETRAIT;
      while (!stopped) {
        var t = performance.now() - t0; if (t >= total) break;
        var r;
        if (t < P.T_POSE) r = pt.r * easeOut(t / P.T_POSE);
        else if (t < P.T_POSE + P.T_MAINTIEN) r = pt.r;
        else r = pt.r * (1 - easeOut((t - P.T_POSE - P.T_MAINTIEN) / P.T_RETRAIT));
        appui.setAttribute('r', r.toFixed(1));
        // ondes pendant le maintien
        while (layer.childNodes.length > 1) layer.removeChild(layer.lastChild);
        if (t >= P.T_POSE && t < P.T_POSE + P.T_MAINTIEN) {
          var th = t - P.T_POSE;
          for (var o = 0; o < P.N_ONDES; o++) { var te = th - o * P.ONDE_ECART; if (te >= 0 && te <= P.ONDE_DUREE) { var u = te / P.ONDE_DUREE; layer.appendChild(el('circle', { cx: pt.cx, cy: pt.cy, r: (pt.r * (1 + (P.ONDE_EXP - 1) * easeOut(u))).toFixed(1), fill: pt.fill, opacity: (P.ONDE_OP * (1 - u)).toFixed(3) })); } }
        }
        await raf();
      }
      ov.removeChild(layer);
    }

    // ---------- MOUVEMENT : pression glissée (rail) ----------
    async function glissee(zone, override) {
      override = override || {};
      var P = params.glissee, list = cibles(zone);
      var jobs = [];
      list.forEach(function (id) {
        var side = sideOf(id), base = zone.id;
        var rail = override.rail || railFor(base, side);
        if (!rail || !rail.length) return;
        jobs.push({ id: id, rail: rail, clip: clipForZone(id), fill: fillOf(id) });
      });
      // deux pieds simultanés (sauf override sequentiel)
      if (override.sequentiel) { for (var i = 0; i < jobs.length; i++) await glideOne(jobs[i], P, override); }
      else await Promise.all(jobs.map(function (j) { return glideOne(j, P, override); }));
      list.forEach(function (id) { setZoneOpacity(id, params.OP_FIN); });
    }
    async function glideOne(job, P, override) {
      var poly = job.rail, c = cum(poly), L = c[c.length - 1];
      var passes = override.passages || P.PASSAGES, W = override.largeur || P.LARGEUR, V = override.vitesse || P.VITESSE_PX;
      var g = el('g', job.clip ? { 'clip-path': job.clip } : null); ov.appendChild(g);
      // trace guide estompé
      g.appendChild(el('path', { d: pathD(poly), fill: 'none', stroke: job.fill, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0.12 }));
      for (var p = 0; p < passes && !stopped; p++) {
        var reveal = el('path', { d: pathD(poly), fill: 'none', stroke: job.fill, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: params.OP_TRAINEE });
        reveal.style.strokeDasharray = L; reveal.style.strokeDashoffset = L; g.appendChild(reveal);
        var dot = el('circle', { r: (W * 0.55).toFixed(1), fill: job.fill }); g.appendChild(dot);
        var t0 = performance.now(), dur = L / V;
        while (!stopped) { var t = performance.now() - t0; var u = Math.min(t / dur, 1); reveal.style.strokeDashoffset = (L * (1 - u)).toFixed(1); var pos = ptAt(poly, c, u * L); dot.setAttribute('cx', pos[0].toFixed(1)); dot.setAttribute('cy', pos[1].toFixed(1)); if (u >= 1) break; await raf(); }
        g.removeChild(dot);
        // le coloriage RESTE (reveal conservé). Fondu léger entre passages sauf dernier.
        if (p < passes - 1) { reveal.style.transition = 'opacity ' + P.T_EFFACE + 'ms'; reveal.setAttribute('opacity', 0.30); await wait(P.T_EFFACE); }
      }
    }

    // ---------- MOUVEMENT : pression circulaire (orteils) ----------
    async function circulaire(zone) {
      var P = params.circulaire;
      var jobs = cibles(zone).map(function (id) { var b = bbox(id); return b ? { id: id, b: b, clip: clipForZone(id), fill: fillOf(id) } : null; }).filter(Boolean);
      await Promise.all(jobs.map(function (j) { return spiralToe(j, P); }));
      jobs.forEach(function (j) { setZoneOpacity(j.id, params.OP_FIN); });
    }
    async function spiralToe(job, P) {
      var b = job.b, cx = b.x + b.width / 2, cy = b.y + b.height / 2, rmax = Math.max(b.width, b.height) / 2 * 1.15;
      var g = el('g', job.clip ? { 'clip-path': job.clip } : null); ov.appendChild(g);
      var dot = el('circle', { r: (rmax * 0.22).toFixed(1), fill: job.fill });
      var trail = el('path', { fill: 'none', stroke: job.fill, 'stroke-width': (rmax * P.LARGEUR * 0.5).toFixed(1), 'stroke-linecap': 'round', opacity: 0.6 }); g.appendChild(trail); g.appendChild(dot);
      var t0 = performance.now(), pts = [];
      while (!stopped) { var t = performance.now() - t0; var u = Math.min(t / P.T_MVT, 1); var ang = Math.PI * 0.75 - u * P.TOURS * 2 * Math.PI; var rr = rmax * (P.R0 + (P.R1 - P.R0) * u); var x = cx + rr * Math.cos(ang), y = cy + rr * Math.sin(ang); pts.push([x, y]); trail.setAttribute('d', pathD(pts)); dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1)); if (u >= 1) break; await raf(); }
      g.removeChild(dot);
    }

    // ---------- MOUVEMENT : boucles progressives (cercles avancés) ----------
    async function boucles(zone, override) {
      override = override || {}; var P = params.boucles;
      var jobs = cibles(zone).map(function (id) { var side = sideOf(id); var rail = railFor(zone.id, side); return rail ? { id: id, rail: rail, clip: clipForZone(id), fill: fillOf(id) } : null; }).filter(Boolean);
      // synchro : les deux pieds finissent ensemble -> même durée
      var maxL = Math.max.apply(null, jobs.map(function (j) { return cum(j.rail).slice(-1)[0]; })), dur = maxL / P.VITESSE_PX;
      await Promise.all(jobs.map(function (j) { return revealSync(j, dur, P.LARGEUR); }));
      jobs.forEach(function (j) { setZoneOpacity(j.id, params.OP_FIN); });
    }
    async function revealSync(job, dur, W) {
      var poly = job.rail, c = cum(poly), L = c[c.length - 1];
      var g = el('g', job.clip ? { 'clip-path': job.clip } : null); ov.appendChild(g);
      var reveal = el('path', { d: pathD(poly), fill: 'none', stroke: job.fill, 'stroke-width': W, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: params.OP_TRAINEE });
      reveal.style.strokeDasharray = L; reveal.style.strokeDashoffset = L; g.appendChild(reveal);
      var dot = el('circle', { r: (W * 0.5).toFixed(1), fill: job.fill }); g.appendChild(dot);
      var t0 = performance.now();
      while (!stopped) { var t = performance.now() - t0; var u = Math.min(t / dur, 1); reveal.style.strokeDashoffset = (L * (1 - u)).toFixed(1); var pos = ptAt(poly, c, u * L); dot.setAttribute('cx', pos[0].toFixed(1)); dot.setAttribute('cy', pos[1].toFixed(1)); if (u >= 1) break; await raf(); }
      g.removeChild(dot);
    }

    // ---------- MOUVEMENT : spirale centripète (bassin) ----------
    async function spirale(zone) {
      var P = params.spirale;
      var jobs = cibles(zone).map(function (id) { var b = bbox(id); return b ? { id: id, b: b, clip: clipForZone(id), fill: fillOf(id) } : null; }).filter(Boolean);
      await Promise.all(jobs.map(function (j) { return spiralZone(j, P); }));
      jobs.forEach(function (j) { setZoneOpacity(j.id, params.OP_FIN); });
    }
    async function spiralZone(job, P) {
      var b = job.b, cx = b.x + b.width / 2, cy = b.y + b.height / 2, Rmax = Math.max(b.width, b.height) / 2 * 0.95;
      var g = el('g', job.clip ? { 'clip-path': job.clip } : null); ov.appendChild(g);
      var trail = el('path', { fill: 'none', stroke: job.fill, 'stroke-width': P.LARGEUR, 'stroke-linecap': 'round', opacity: 0.6 }); var dot = el('circle', { r: 12, fill: job.fill }); g.appendChild(trail); g.appendChild(dot);
      var N = 260, pts = [];
      for (var k = 0; k <= N && !stopped; k++) { var u = k / N; var th = u * P.TOURS * 2 * Math.PI; var r = Rmax * (1 - u) + 3; var x = cx + r * Math.cos(th), y = cy + r * Math.sin(th); pts.push([x, y]); trail.setAttribute('d', pathD(pts)); dot.setAttribute('cx', x.toFixed(1)); dot.setAttribute('cy', y.toFixed(1)); if (k % 2 === 0) await raf(); }
      g.removeChild(dot);
    }

    // ---------- MOUVEMENT : composite système urinaire ----------
    async function composite(zone) {
      var P = params.urinaire, list = cibles(zone);
      await Promise.all(list.map(function (id) {
        var side = sideOf(id), rail = railFor('systeme-urinaire', side) || [];
        if (rail.length < 2) return Promise.resolve();
        var vessie = rail[0][1] > rail[1][1] ? rail[0] : rail[1];
        var rein = rail[0][1] > rail[1][1] ? rail[1] : rail[0];
        return urinaireOne(vessie, rein, fillOf(id), P);
      }));
      list.forEach(function (id) { setZoneOpacity(id, params.OP_FIN); });
    }
    async function urinaireOne(vessie, rein, fill, P) {
      for (var p = 0; p < P.PASSAGES && !stopped; p++) {
        await beatMaintenue({ cx: vessie[0], cy: vessie[1], r: 19, fill: fill }, params.maintenue);
        // glissée lente vessie -> rein
        var g = el('g'); ov.appendChild(g); var dot = el('circle', { r: 17, fill: fill }); var line = el('line', { x1: vessie[0], y1: vessie[1], x2: rein[0], y2: rein[1], stroke: fill, 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.25 }); g.appendChild(line); g.appendChild(dot);
        var t0 = performance.now(); while (!stopped) { var t = performance.now() - t0; var u = Math.min(t / P.T_GLIDE, 1); var pos = lerp(vessie, rein, easeOut(u)); dot.setAttribute('cx', pos[0].toFixed(1)); dot.setAttribute('cy', pos[1].toFixed(1)); if (u >= 1) break; await raf(); } ov.removeChild(g);
        await beatMaintenue({ cx: rein[0], cy: rein[1], r: 19, fill: fill }, params.maintenue);
      }
    }

    // ---------- routeur ----------
    function overrideFor(zone) {
      var o = {};
      if (zone.id === 'nez') o.croix = true;
      if (zone.id === 'gros-intestin') o.sequentiel = true; // 2 gestes séparés, pas de trait entre pieds
      if (zone.sens) o.sens = zone.sens;
      if (zone.passages) o.passages = zone.passages;
      return o;
    }
    async function playZoneObj(zone) {
      if (!zone) return;
      var m = zone.mouvement;
      if (zone.id === 'systeme-urinaire') return composite(zone);
      if (zone.id === 'intestin-grele') return boucles(zone);
      if (zone.id === 'nez') return glisseeCroix(zone);
      if (m === 'pression-maintenue') return maintenue(zone);
      if (m === 'pression-glissee') return glissee(zone, overrideFor(zone));
      if (m === 'pression-circulaire') return circulaire(zone);
      if (m === 'boucles-progressives') return boucles(zone);
      if (m === 'spirale-centripete') return spirale(zone);
      return glissee(zone, overrideFor(zone));
    }
    // nez : croix = barre verticale puis horizontale, x passages
    async function glisseeCroix(zone) {
      var P = params.glissee;
      var jobs = cibles(zone).map(function (id) { var side = sideOf(id), r = railFor('nez', side); return r ? { id: id, cross: r, clip: clipForZone(id), fill: fillOf(id) } : null; }).filter(Boolean);
      await Promise.all(jobs.map(async function (j) {
        for (var p = 0; p < (zone.passages || P.PASSAGES) && !stopped; p++) {
          await glideOne({ id: j.id, rail: j.cross.vertical_haut_bas, clip: j.clip, fill: j.fill }, P, { passages: 1, largeur: 16 });
          await glideOne({ id: j.id, rail: j.cross.horizontal_bord_orteils, clip: j.clip, fill: j.fill }, P, { passages: 1, largeur: 16 });
        }
      }));
      jobs.forEach(function (j) { setZoneOpacity(j.id, params.OP_FIN); });
    }

    // ---------- API publique ----------
    function reset() { stopped = false; while (ov.firstChild) ov.removeChild(ov.firstChild); }
    function stop() { stopped = true; reset(); }
    async function playZone(zoneId) { reset(); await playZoneObj(catalog[zoneId]); }
    async function playStep(step) { reset(); for (var i = 0; i < step.zones.length && !stopped; i++) { await playZoneObj(catalog[step.zones[i].zone || step.zones[i]]); } }
    async function playProtocol(proto, onStep) { reset(); for (var i = 0; i < proto.sequence.length && !stopped; i++) { var e = proto.sequence[i]; if (onStep) onStep(e, i); for (var j = 0; j < e.zones.length && !stopped; j++) { await playZoneObj(catalog[e.zones[j].zone]); } } }

    return { playZone: playZone, playStep: playStep, playProtocol: playProtocol, stop: stop };
  }

  function mergeParams(def, p) {
    if (!p) return JSON.parse(JSON.stringify(def));
    var out = JSON.parse(JSON.stringify(def));
    // mapping souple depuis PARAMS_animation.json si fourni
    function num(v, d) { return (typeof v === 'number') ? v : d; }
    if (p['pression-glissee']) { out.glissee.VITESSE_PX = num(p['pression-glissee'].VITESSE_PX_par_ms, out.glissee.VITESSE_PX); out.glissee.T_EFFACE = num(p['pression-glissee'].T_EFFACE_ms, out.glissee.T_EFFACE); out.glissee.SEUIL_FIN = num(p['pression-glissee'].SEUIL_FIN, out.glissee.SEUIL_FIN); }
    if (p['pression-maintenue']) { var m = p['pression-maintenue']; out.maintenue.T_POSE = num(m.T_POSE_ms, out.maintenue.T_POSE); out.maintenue.T_MAINTIEN = num(m.T_MAINTIEN_ms, out.maintenue.T_MAINTIEN); out.maintenue.T_RETRAIT = num(m.T_RETRAIT_ms, out.maintenue.T_RETRAIT); if (m.ondes) { out.maintenue.ONDE_EXP = num(m.ondes.ONDE_EXPANSION, out.maintenue.ONDE_EXP); out.maintenue.ONDE_OP = num(m.ondes.ONDE_OP, out.maintenue.ONDE_OP); } }
    return out;
  }

  root.ReflexoAnim = { create: create, DEFAULTS: DEF };
})(typeof window !== 'undefined' ? window : this);
