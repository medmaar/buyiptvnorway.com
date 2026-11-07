/* NorwayIPTV — full-screen success overlay after a free-trial request or a plan order.
   Called from the form scripts: window.celebrate('trial' | 'order', email).
   Preview without submitting: add ?celebrate=trial or ?celebrate=order to the page URL.
   Text follows the page language: <html lang="nb"> shows Norwegian, everything else English. */
(function () {
  var TEXT = {
    en: {
      trial: {
        title: "Your free trial is on its way!",
        lines: [
          "Our trolls are skiing your login over the mountains to <b data-c-email></b> as fast as their little legs allow. ⛷️",
          "It usually lands within a few minutes. Check your <b>inbox</b> AND your <b>spam</b> folder, because our email is a little bit Norwegian: shy, and it sometimes hides in the corner.",
          "Your only job now: get the brunost out, find the coziest spot on the sofa and get ready for some proper kos. 🧀",
        ],
        btn: "Takk! Getting the brunost",
      },
      order: {
        title: "You did it! Order placed.",
        lines: [
          "Legendary move. Even the trolls up in the mountains are cheering, and trolls never cheer. 🏔️",
          "Your invoice is flying to <b data-c-email></b> right now. Check your <b>inbox</b> AND your <b>spam</b> folder (emails love hide and seek even more than Norwegians love a Sunday hike).",
          "Pay the invoice and your channels start rolling faster than a cross-country skier on a downhill. 🎿",
        ],
        btn: "Herlig, let’s go!",
      },
      fallback: "your email address",
      close: "Close",
    },
    nb: {
      trial: {
        title: "Prøveperioden din er på vei!",
        lines: [
          "Trollene våre går på ski over fjellet med innloggingen din til <b data-c-email></b> så fort de små beina tillater. ⛷️",
          "Den kommer vanligvis i løpet av noen minutter. Sjekk <b>innboksen</b> OG <b>søppelpost</b>, for e-posten vår er litt norsk: sjenert, og gjemmer seg gjerne i et hjørne.",
          "Din eneste jobb nå: finn frem brunosten, sett deg godt til rette i sofaen og gjør deg klar for skikkelig kos. 🧀",
        ],
        btn: "Takk! Henter brunosten",
      },
      order: {
        title: "Du klarte det! Bestillingen er sendt.",
        lines: [
          "Legendarisk trekk. Selv trollene oppe i fjellet jubler, og troll jubler aldri. 🏔️",
          "Fakturaen din flyr til <b data-c-email></b> akkurat nå. Sjekk <b>innboksen</b> OG <b>søppelpost</b> (e-poster elsker gjemsel enda mer enn nordmenn elsker søndagstur).",
          "Betal fakturaen, så ruller kanalene i gang raskere enn en langrennsløper i nedoverbakke. 🎿",
        ],
        btn: "Herlig, la oss kjøre!",
      },
      fallback: "e-postadressen din",
      close: "Lukk",
    },
  };

  var CSS =
    ".celebrating,.celebrating body{overflow:hidden}" +
    ".celebrate{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;padding:16px;overflow-y:auto;font-family:'Plus Jakarta Sans',system-ui,-apple-system,'Segoe UI',Arial,sans-serif;" +
    "background:radial-gradient(circle at 50% 35%,rgba(34,197,94,.22),transparent 60%),rgba(4,8,20,.93);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);animation:cel-in .3s ease both}" +
    ".celebrate.is-out{animation:cel-out .25s ease forwards}" +
    ".celebrate-box{position:relative;box-sizing:border-box;width:min(560px,100%);text-align:center;padding:clamp(28px,6vw,48px) clamp(18px,5vw,40px);background:#0d1424;border:1px solid rgba(34,197,94,.45);border-radius:20px;" +
    "box-shadow:0 0 0 1px rgba(34,197,94,.2),0 40px 120px -30px rgba(34,197,94,.45);animation:cel-pop .55s .05s cubic-bezier(.2,.9,.3,1.3) both}" +
    ".celebrate-x{position:absolute;top:10px;right:10px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(255,255,255,.06);color:rgba(255,255,255,.6);font-size:28px;line-height:1;cursor:pointer}" +
    ".celebrate-x:hover,.celebrate-x:focus-visible{color:#fff;background:rgba(255,255,255,.12)}" +
    ".celebrate-mark{display:block;width:clamp(130px,38vw,180px);height:auto;margin:0 auto 22px;fill:none;stroke:#4ade80;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 24px rgba(74,222,128,.5))}" +
    ".celebrate-mark circle{stroke-width:6;stroke-dasharray:340;stroke-dashoffset:340;animation:cel-draw .7s .2s ease forwards;fill:rgba(34,197,94,.1)}" +
    ".celebrate-mark path{stroke-width:9;stroke-dasharray:80;stroke-dashoffset:80;animation:cel-draw .45s .8s ease forwards,cel-bounce .5s 1.2s ease;transform-origin:center}" +
    ".celebrate h2{font-size:clamp(28px,6vw,40px);line-height:1.15;font-weight:900;margin:0 0 16px;color:#4ade80}" +
    ".celebrate p{color:rgba(255,255,255,.8);font-size:clamp(16px,2.2vw,18px);line-height:1.55;margin:0 auto 12px;max-width:460px}" +
    ".celebrate p b{color:#fff;word-break:break-word}" +
    ".celebrate-go{display:block;margin:18px auto 0;width:100%;max-width:360px;padding:15px 24px;border:0;border-radius:12px;background:#fd0322;color:#fff;font:inherit;font-size:17px;font-weight:800;cursor:pointer;box-shadow:0 10px 30px -8px rgba(253,3,34,.6)}" +
    ".celebrate-go:hover,.celebrate-go:focus-visible{background:#e0021e}" +
    ".celebrate-bits{position:fixed;inset:0;pointer-events:none;overflow:hidden}" +
    ".celebrate-bits i{position:absolute;top:-40px;left:var(--x);width:10px;height:16px;border-radius:3px;font-style:normal;font-size:22px;line-height:1;background:#ef2b2d;animation:cel-fall var(--t) var(--d) linear infinite}" +
    ".celebrate-bits i:nth-child(4n+1){background:#fff}" +
    ".celebrate-bits i:nth-child(4n+2){background:#002868;box-shadow:0 0 0 1px rgba(255,255,255,.25)}" +
    ".celebrate-bits i:nth-child(3n+1){width:auto;height:auto;background:none;box-shadow:none}" +
    "@keyframes cel-in{from{opacity:0}}@keyframes cel-out{to{opacity:0}}" +
    "@keyframes cel-pop{from{opacity:0;transform:scale(.85)}}" +
    "@keyframes cel-draw{to{stroke-dashoffset:0}}" +
    "@keyframes cel-bounce{50%{transform:scale(1.15)}}" +
    "@keyframes cel-fall{from{transform:translateY(0) rotate(var(--r))}to{transform:translateY(110vh) rotate(calc(var(--r) + 540deg))}}" +
    "@media (prefers-reduced-motion:reduce){.celebrate,.celebrate-box{animation:none}.celebrate-bits{display:none}.celebrate-mark circle,.celebrate-mark path{animation:none;stroke-dashoffset:0}}";

  function addCss() {
    if (document.getElementById("celebrate-css")) return;
    var s = document.createElement("style");
    s.id = "celebrate-css";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function celebrate(kind, email) {
    var lang = /^(nb|no|nn)/i.test(document.documentElement.lang || "") ? "nb" : "en";
    var T = TEXT[lang], c = T[kind === "order" ? "order" : "trial"];
    addCss();
    var old = document.querySelector(".celebrate");
    if (old) old.remove();
    var back = document.activeElement;
    var el = document.createElement("div");
    el.className = "celebrate";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "celebrate-title");
    var bits = "";
    for (var i = 0; i < 28; i++) {
      bits += '<i style="--x:' + ((i * 37) % 100) + "%;--d:" + ((i % 7) * 0.35) + "s;--t:" + (3.2 + (i % 5) * 0.5) + "s;--r:" + ((i * 53) % 360) + 'deg">' + (i % 3 ? "" : "❄️") + "</i>";
    }
    el.innerHTML =
      '<div class="celebrate-bits" aria-hidden="true">' + bits + "</div>" +
      '<div class="celebrate-box">' +
      '<button class="celebrate-x" type="button" aria-label="' + T.close + '">×</button>' +
      '<svg class="celebrate-mark" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="54"/><path d="M36 62 53 79 86 44"/></svg>' +
      '<h2 id="celebrate-title">' + c.title + "</h2>" +
      c.lines.map(function (l) { return "<p>" + l + "</p>"; }).join("") +
      '<button class="celebrate-go" type="button">' + c.btn + "</button>" +
      "</div>";
    // the email goes in as text, never as HTML
    Array.prototype.forEach.call(el.querySelectorAll("[data-c-email]"), function (b) { b.textContent = email || T.fallback; });
    var go = el.querySelector(".celebrate-go"), x = el.querySelector(".celebrate-x");
    function close() {
      document.removeEventListener("keydown", onKey);
      el.classList.add("is-out");
      document.documentElement.classList.remove("celebrating");
      setTimeout(function () { el.remove(); }, 250);
      if (back && back.focus) { try { back.focus({ preventScroll: true }); } catch (e) {} }
    }
    function onKey(e) {
      if (e.key === "Escape") close();
      if (e.key === "Tab") { e.preventDefault(); (document.activeElement === go ? x : go).focus(); }
    }
    document.addEventListener("keydown", onKey);
    x.addEventListener("click", close);
    go.addEventListener("click", close);
    document.body.appendChild(el);
    document.documentElement.classList.add("celebrating");
    go.focus({ preventScroll: true });
  }

  window.celebrate = celebrate;

  function preview() {
    var q = new URLSearchParams(location.search).get("celebrate");
    if (q) celebrate(q === "order" ? "order" : "trial", "you@example.com");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", preview);
  else preview();
})();
