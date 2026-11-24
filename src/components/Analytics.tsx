"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";

type Props = {
  id: string;
  t: { text: string; link: string; accept: string; decline: string; label: string };
  privacyHref: string;
};

const KEY = "cookie-consent";
const subs = new Set<() => void>();
const subscribe = (cb: () => void) => {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
};
// In-memory copy: the choice still works for this page view when storage is blocked.
let memory: string | null = null;
const read = () => {
  try {
    return memory ?? localStorage.getItem(KEY) ?? "unset";
  } catch {
    return memory ?? "unset";
  }
};
const write = (v: "yes" | "no") => {
  memory = v;
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* storage blocked: the choice lasts for this page view only */
  }
  subs.forEach((s) => s());
};

/**
 * Yandex.Metrika is loaded only after the visitor accepts — and lazily, so it
 * never competes with the page for the main thread during load.
 */
export function Analytics({ id, t, privacyHref }: Props) {
  // "pending" on the server and during hydration: nothing renders, nothing shifts.
  const consent = useSyncExternalStore(subscribe, read, () => "pending");
  if (!id || !/^\d+$/.test(id)) return null;

  if (consent === "yes") {
    return (
      <Script id="ym" strategy="lazyOnload">
        {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${id},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:false});`}
      </Script>
    );
  }
  if (consent !== "unset") return null;

  return (
    <div className="cookie" role="region" aria-label={t.label}>
      <div className="wrap cookie__in">
        <p>
          {t.text}
          <a href={privacyHref}>{t.link}</a>.
        </p>
        <div className="cookie__btns">
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => write("no")}>
            {t.decline}
          </button>
          <button type="button" className="btn btn--sm btn--ghost" onClick={() => write("yes")}>
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * "Cookie settings": forgets the visitor's choice and reloads the page, so the banner
 * appears again and an already loaded Metrica counter is unloaded.
 */
export function CookieSettings({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="cookie-settings"
      onClick={() => {
        memory = null;
        try {
          localStorage.removeItem(KEY);
        } catch {
          /* storage blocked: nothing was saved */
        }
        window.location.reload();
      }}
    >
      {label}
    </button>
  );
}
