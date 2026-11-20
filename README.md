# glossa — landing pentru școală online de engleză (RU / EN)

Next.js 16 (App Router) · React 19 · Tailwind 4 · TypeScript. Fără librării de UI sau animație — tot designul e CSS propriu.

- Rusă: `/` · Engleză: `/en` · Documente: `/privacy`, `/consent`
- Ambele pagini sunt statice (HTML generat la build); singurul cod de server este `POST /api/lead`.

## Pornire

```bash
pnpm install
```

```bash
pnpm dev
```

Build de producție: `pnpm build`, apoi `pnpm start`.

## Configurare (`.env.local`)

Copiază `.env.example` în `.env.local` și completează:

| Variabilă | Ce face |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Adresa publică a site-ului (canonical, hreflang, sitemap). |
| `TELEGRAM_BOT_TOKEN` | Tokenul botului de la @BotFather. |
| `TELEGRAM_CHAT_ID` | ID-ul chatului care primește cererile (mai multe: separate prin virgulă). Pentru grup — număr negativ, botul trebuie să fie membru. Destinatarul trebuie să apese **Start** la bot. |
| `TELEGRAM_API_BASE` | Opțional: un relay, dacă `api.telegram.org` nu e accesibil de pe hosting. |
| `LEAD_WEBHOOK_URL` | Opțional, recomandat: al doilea canal (CRM, n8n, Albato…). Cererea e considerată trimisă dacă măcar un canal a primit-o. |
| `NEXT_PUBLIC_YM_ID` | Numărul contorului Yandex.Metrika. Gol = fără analitică și fără banner de cookie. |
| `LEAD_DEMO_MODE=1` | Doar pentru demo fără bot: formularul arată „Спасибо”, cererea se scrie în logul serverului. |

Fără Telegram/webhook: în `pnpm dev` cererile se afișează în consolă; în producție formularul arată eroare (ca să nu se piardă cereri pe tăcute).

### Yandex.Metrika

În Metrika creează un obiectiv de tip **JavaScript-событие** cu identificatorul `lead_form_submit`. Contorul se încarcă doar după ce vizitatorul acceptă cookie-urile.

## Unde se schimbă conținutul

| Ce | Fișier |
| --- | --- |
| Toate textele, prețurile, FAQ (RU) | `src/dictionaries/ru.ts` |
| Aceleași texte în engleză | `src/dictionaries/en.ts` |
| Telefon, email, rețele sociale | `src/dictionaries/index.ts` → `contacts` |
| Date juridice (ИП, ИНН, ОГРНИП, adresă) | `src/components/LegalShell.tsx` → `operator` și `footer.entity` din dicționare |
| Culori, fonturi, raze, umbre (design tokens) | `src/app/globals.css` — secțiunile 1–3 de sus |
| ID-urile tarifelor și nivelurilor | `src/lib/site.ts` (+ etichetele din `src/lib/telegram.ts`) |

## De confirmat cu clientul înainte de lansare

Toate acestea sunt **valori provizorii** inventate pentru demo:

- numele școlii „glossa” (marcă și domeniu neverificate), numele profesoarei din cardul din hero;
- prețurile și conținutul tarifelor, regula de reprogramare „cu 4 ore înainte”, programul 9:00–21:00 МСК, politica de returnare din FAQ;
- telefon, email, linkuri Telegram / MAX / VK;
- datele juridice și textele `/privacy` și `/consent` — sunt șabloane, trebuie verificate de un jurist (152-ФЗ: consimțământ ca document separat, notificare la Роскомнадзор);
- livrarea în Telegram: accesul la Telegram din Rusia este instabil — se recomandă hosting/relay care ajunge la `api.telegram.org` și un al doilea canal (`LEAD_WEBHOOK_URL`).
