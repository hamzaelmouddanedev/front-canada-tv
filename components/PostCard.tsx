import Image from "next/image";
import Link from "next/link";
import { altText, localePath, t, type Locale } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { hasImage, urlFor } from "@/lib/sanity/image";
import type { Post } from "@/lib/sanity/types";
import { chip } from "@/lib/ui";

export function formatDate(iso: string | undefined, locale: Locale) {
  if (!iso) return "";
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-CA", { dateStyle: "long" }).format(new Date(iso));
}

export function CategoryChips({ post, locale }: { post: Post; locale: Locale }) {
  return (
    <>
      {(post.categories ?? []).map((c) => (
        <span key={c._id} className={chip} style={c.color ? { color: c.color } : undefined}>
          {t(c.title, locale)}
        </span>
      ))}
    </>
  );
}

export async function PostCard({ post }: { post: Post }) {
  const { locale, ui, tr } = await getI18n();
  const title = tr(post.title);
  return (
    <Link href={localePath(locale, `/blog/${post.slug}`)} className={`flex flex-col overflow-hidden rounded-[20px] border text-inherit transition duration-300 hover:-translate-y-1.5 ${
        post.featured ? "border-vivid" : "border-lagoon/15 bg-harbor/10 hover:border-lagoon/45"
      }`}>
      <div className="relative aspect-video bg-amethyst/20">
        {hasImage(post.coverImage) && (
          <Image
            src={urlFor(post.coverImage).width(800).height(450).fit("crop").url()}
            alt={altText(ui.alt.post, title)}
            fill
            sizes="(max-width: 480px) 100vw, 400px"
            className="object-cover"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-[0.7rem] px-6 pt-[1.4rem] pb-[1.6rem]">
        <div className="flex flex-wrap items-center gap-2 text-[0.78rem] text-muted">
          <CategoryChips post={post} locale={locale} />
          {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>}
        </div>
        <h2 className="text-[1.15rem] leading-[1.4] font-extrabold text-white">{title}</h2>
        {tr(post.excerpt) && <p className="text-[0.9rem] leading-[1.7] text-muted">{tr(post.excerpt)}</p>}
        <span className="mt-auto text-[0.88rem] font-bold text-lagoon">{ui.blog.readMore}</span>
      </div>
    </Link>
  );
}
