import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalShell, operator as o } from "@/components/LegalShell";
import { getDictionary, localePath } from "@/dictionaries";
import { isLocale } from "@/lib/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/consent">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  return {
    title: `${getDictionary(lang).footer.consent} — glossa`,
    alternates: { canonical: localePath(lang, "/consent"), languages: { ru: "/consent", en: "/en/consent" } },
    robots: { index: false, follow: true },
  };
}

export default async function Consent({ params }: PageProps<"/[lang]/consent">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <LegalShell locale={lang} dict={dict} path="/consent">
      <p className="tag">Редакция от {o.updated}</p>
      <h1 className="h2">Согласие на обработку персональных данных</h1>
      <p className="legal__note">
        <mark>Шаблон.</mark> Реквизиты, выделенные так, — заглушки. Перед запуском сайта текст должен проверить
        юрист.
      </p>

      <p>
        Отмечая флажок в форме заявки на сайте <mark>{o.site}</mark> и нажимая кнопку «Отправить заявку», я свободно,
        своей волей и в своём интересе даю согласие <mark>{o.name}</mark> (ИНН <mark>{o.inn}</mark>, ОГРНИП{" "}
        <mark>{o.ogrnip}</mark>, адрес: <mark>{o.address}</mark>; далее — Оператор) на обработку моих персональных
        данных на следующих условиях.
      </p>

      <h2>1. Перечень данных</h2>
      <ul>
        <li>имя;</li>
        <li>номер телефона и (или) имя пользователя в мессенджере;</li>
        <li>адрес электронной почты (если указан);</li>
        <li>уровень владения английским языком и выбранный тариф.</li>
      </ul>

      <h2>2. Цель обработки</h2>
      <p>
        Обработка заявки: связь со мной, согласование времени и проведение пробного урока, подготовка предложения об
        обучении.
      </p>

      <h2>3. Действия с данными</h2>
      <p>
        Сбор, запись, систематизация, накопление, хранение, уточнение, извлечение, использование, передача
        (предоставление, доступ) сотрудникам и преподавателям Оператора, а также передача через мессенджер Telegram,
        используемый Оператором для получения заявок, блокирование, удаление и уничтожение — с
        использованием средств автоматизации и без них.
      </p>

      <h2>4. Срок действия и отзыв</h2>
      <p>
        Согласие действует до достижения цели обработки, но не дольше <mark>одного года</mark> со дня его
        предоставления. Я могу отозвать согласие в любой момент, направив письмо на <mark>{o.email}</mark>. После
        отзыва Оператор прекращает обработку и уничтожает данные в течение 30 дней, если иное не требуется по закону.
      </p>

      <p>
        Порядок обработки и защиты данных описан в{" "}
        <a href={localePath(lang, "/privacy")}>Политике конфиденциальности</a>.
      </p>
    </LegalShell>
  );
}
