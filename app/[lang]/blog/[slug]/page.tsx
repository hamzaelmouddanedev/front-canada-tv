import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { JsonLd } from "@/components/JsonLd";
import { CategoryChips, formatDate } from "@/components/PostCard";
import { getPost } from "@/lib/data";
import { altText, localePath } from "@/lib/i18n";
import { getI18n } from "@/lib/locale";
import { backLink, chip, proseText, sectionTitle, sectionTop } from "@/lib/ui";
import { ORG_ID } from "@/lib/jsonld";
import { siteUrl } from "@/lib/sanity/env";
import { hasImage, urlFor } from "@/lib/sanity/image";
import { getRoute, slugParams } from "@/lib/routes";
import { buildMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return slugParams("blog");
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const [{ locale, tr }, post, route] = await Promise.all([getI18n(), getPost(slug), getRoute(`/blog/${slug}`)]);
  if (!post) return {};
  const meta = buildMetadata(post.seo, {
    title: tr(post.title),
    description: tr(post.excerpt),
    path: `/blog/${slug}`,
    locales: route?.locales,
  }, locale);
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: post.publishedAt },
  };
}

// `params` is URL data: with partialPrefetching it must be read inside
// <Suspense> so the route's App Shell stays shared across every post link.
export default function PostPage({ params }: PageProps<"/[lang]/blog/[slug]">) {
  return (
    <article className={sectionTop}>
      <div className="mx-auto max-w-[760px]">
        <Suspense fallback={<PostSkeleton />}>
          <PostDetails params={params} />
        </Suspense>
      </div>
    </article>
  );
}

function PostSkeleton() {
  return (
    <div aria-busy="true">
      <div className="mb-6 h-10 w-3/4 animate-pulse rounded-lg bg-lagoon/10" />
      <div className="aspect-video animate-pulse rounded-[20px] border border-lagoon/20" />
    </div>
  );
}

async function PostDetails({ params }: Pick<PageProps<"/[lang]/blog/[slug]">, "params">) {
  const { slug } = await params;
  const [{ locale, ui, tr, href }, post] = await Promise.all([getI18n(), getPost(slug)]);
  if (!post) notFound();

  const title = tr(post.title);
  const url = `${siteUrl}${localePath(locale, `/blog/${slug}`)}`;
  const cover = hasImage(post.coverImage) ? urlFor(post.coverImage).width(1600).height(900).fit("crop").url() : null;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          inLanguage: locale,
          headline: title,
          description: tr(post.excerpt) || undefined,
          image: cover ? [cover] : undefined,
          datePublished: post.publishedAt,
          author: post.author?.name ? { "@type": "Person", name: post.author.name } : undefined,
          publisher: { "@id": ORG_ID },
          mainEntityOfPage: url,
          keywords: post.tags?.length ? post.tags.join(", ") : undefined,
        }}
      />
      <Link href={href("/blog")} className={backLink}>
        {ui.blog.back}
      </Link>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[0.78rem] text-muted">
        <CategoryChips post={post} locale={locale} />
        {post.publishedAt && <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>}
        {post.author?.name && (
          <span>
            · {ui.blog.by} {post.author.name}
          </span>
        )}
      </div>
      <h1 className={sectionTitle}>{title}</h1>
      {tr(post.excerpt) && (
        <p className={`${proseText} mb-8 text-muted`}>
          {tr(post.excerpt)}
        </p>
      )}
      {cover && (
        <div className="relative mb-10 aspect-video overflow-hidden rounded-[20px] border border-lagoon/20">
          <Image src={cover} alt={altText(ui.alt.post, title)} fill priority sizes="(max-width: 800px) 100vw, 760px" />
        </div>
      )}
      <div className={`${proseText} text-[1.05rem]`}>{tr(post.body)}</div>
      {post.tags?.length ? (
        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className={chip}>
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}
