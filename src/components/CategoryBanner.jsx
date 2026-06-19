import Link from "next/link";

export default function CategoryBanner({ category, image, link }) {
  return (
    <Link href={link} className="text-decoration-none">
      <div
        className="category-banner"
        style={{ backgroundImage: `url(${image})` }}
        data-aos="fade-up"
        data-aos-duration="600"
      >
        <h3 className="display-6 fw-bold">{category}</h3>
      </div>
    </Link>
  );
}
